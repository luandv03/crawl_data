// article: .item-news
// .title-news > a : href = link, textContent = title
// .description > a > textContent

const readline = require("readline");

const crawlVnExpress = require("./vn-express.js");
const crawlVietNamTimes = require("./vietnamtimes.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Welcome to crawl-data-toolkit");
console.log("Please enter option");
console.log("[1].Vnexpress [2].Vietnamtimes");
rl.question("Option: ", (answer) => {
    console.log("You entered: ", answer);
    if (answer == 1) {
        console.log("Crawing data from vnexpress...");
        const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const doing = async () => {
            for (let i = 0; i < pageNumbers.length; i++) {
                await crawlVnExpress(pageNumbers[i]);
            }
        };
        doing();
    } else if (answer == 2) {
        console.log("Crawing data from vietnamtimes...");
        const pageNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const doing = async () => {
            for (let i = 0; i < pageNumbers.length; i++) {
                await crawlVietNamTimes(pageNumbers[i]);
            }
        };
        doing();
    }
    rl.close();
});
