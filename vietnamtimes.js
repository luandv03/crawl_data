const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

const { writeCSVFile } = require("./helpers/csvfiler.helper.js");

// Use stealth
puppeteer.use(pluginStealth());

// get posts
const crawlVietNamTimes = async (pageNumber) => {
    console.log("Loading page of " + pageNumber + 1);
    const scrollDelay = 3000; // Thời gian chờ sau mỗi lần cuộn (3 giây)

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    const url =
        `https://vietnamtimes.org.vn/economy&s_cond=&BRSR=` + pageNumber * 20;

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

            // .box-cat-content
            // .article
            // .article-link f0 : a : title, link
            // .article-info > article-publish : time

            const boxCatContentElement = await page.$(".box-cat-content");

            const listPostElement = await boxCatContentElement.$$(".article");

            console.log("So luong post = ", listPostElement.length);

            let count = 0;
            for (const item of listPostElement) {
                count++;
                console.log("Dang crawl post so ", count);
                const titleElement = await item.$(".article-title");
                const datetimeElement = await item.$(".article-publish");

                const linkPost = await titleElement.$eval(
                    "a",
                    (link) => link.href
                );

                const title = await titleElement.$eval(
                    "a",
                    (link) => link.innerText
                );

                const datetime = await (
                    await datetimeElement.getProperty("textContent")
                ).jsonValue();

                const d = new Date();
                const day = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();

                const filename = day + "-" + month + "-" + year + ".csv";

                writeCSVFile("/vietnamtimes/" + filename, [
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
        console.log("Done " + pageNumber + 1);
    }
};

module.exports = crawlVietNamTimes;
