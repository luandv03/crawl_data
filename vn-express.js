const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

const { writeCSVFile } = require("./helpers/csvfiler.helper.js");
const filterDatetime = require("./helpers/filterDatetime.helper.js");

// Use stealth
puppeteer.use(pluginStealth());

// get datetime of post
const crawlPostDetail = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.goto(url);

    try {
        const datetime = await page.$eval(".date", (item) => item.innerText);

        return datetime;
    } catch (error) {
        console.log("Have error: ", error);
        return "";
    } finally {
        await browser.close();
    }
};

// get posts
const crawlVnExpress = async (pageNumber) => {
    console.log("Loading page of " + pageNumber);
    const scrollDelay = 3000; // Thời gian chờ sau mỗi lần cuộn (3 giây)

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    const url = `https://vnexpress.net/kinh-doanh-p` + pageNumber;

    await page.goto(url);

    await page.waitForTimeout(scrollDelay);

    try {
        let previousHeight;
        let scrollAttempts = 0;
        const maxScrollAttempts = 2; // Giới hạn số lần cuộn trang

        while (scrollAttempts < maxScrollAttempts) {
            // Cuộn trang xuống và chờ để tải thêm video
            await page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight);"
            );
            console.log("Loading...");
            await page.waitForTimeout(scrollDelay);

            // get elements
            // article: .item-news
            // .title-news > a : href = link, textContent = title
            // .description > a > textContent

            let listPostElement = await page.$$(".item-news");

            console.log("So luong post = ", listPostElement.length);

            let count = 0;
            for (const item of listPostElement) {
                count++;
                console.log("Dang crawl post so ", count);
                const titleElement = await item.$(".title-news");

                let datetime;
                try {
                    const datetimeURL = await item.$eval(
                        "img",
                        (img) => img.src
                    );
                    datetime = filterDatetime(datetimeURL);

                    if (!datetime) continue;
                } catch (err) {
                    continue;
                }

                const linkPost = await titleElement.$eval(
                    "a",
                    (link) => link.href
                );
                const title = await titleElement.$eval(
                    "a",
                    (link) => link.innerText
                );

                const d = new Date();
                const day = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();

                const filename = day + "-" + month + "-" + year + ".csv";

                writeCSVFile("/vnexpress/" + filename, [
                    title,
                    linkPost,
                    datetime,
                ]);
            }

            // Lấy chiều cao hiện tại của trang
            const currentHeight = await page.evaluate(
                "document.body.scrollHeight"
            );

            // // Kiểm tra xem trang còn thêm video không
            if (currentHeight === previousHeight) {
                break;
            }

            previousHeight = currentHeight;
            scrollAttempts++;
        }
    } catch (error) {
        console.log("Have error: ", error);
        return [];
    } finally {
        await browser.close();
        console.log("Done " + pageNumber);
    }
};

module.exports = crawlVnExpress;
