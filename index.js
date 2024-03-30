// article: .item-news
// .title-news > a : href = link, textContent = title
// .description > a > textContent

const readline = require("readline");
const chalk = require("chalk");

const crawlVnExpress = require("./vn-express.js");
const crawlVietNamTimes = require("./vietnamtimes.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(chalk.green("Welcome to crawl-data-toolkit"));
console.log(chalk.green("Please enter option"));
console.log(chalk.green("[1].Vnexpress ") + chalk.yellow(" [2].Vietnamtimes"));
rl.question(chalk.blue("Option: "), (answer) => {
    console.log(chalk.blue("You entered: ", answer));
    if (answer == 1) {
        console.log(chalk.green("Crawing data from VnExpress..."));
        const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const doing = async () => {
            for (let i = 0; i < pageNumbers.length; i++) {
                await crawlVnExpress(pageNumbers[i]);
            }
        };
        doing();
    } else if (answer == 2) {
        console.log(chalk.yellow("Crawing data from Vietnamtimes..."));
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
