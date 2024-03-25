const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");

const baseDir = path.join(__dirname, "../data");

const readCSVFile = (filePath) => {
    fs.createReadStream(baseDir + filePath)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            console.log(row);
        })
        .on("error", function (error) {
            console.log(error.message);
        });
};

const data = [3, "Nga tan cong Ukraina", "25/03/2024 00:00:26"];

const writeCSVFile = (filePath, data) => {
    const writableStream = fs.createWriteStream(baseDir + filePath, {
        encoding: "utf8",
        flags: "a",
    });
    const stringifier = stringify({ header: false });
    stringifier.write(data);
    stringifier.pipe(writableStream);
};

// readCSVFile(baseDir + "/vietnamtimes/25-03-2024.csv");
// writeCSVFile(baseDir + "/vietnamtimes/25-03-2024.csv", data);

module.exports = { readCSVFile, writeCSVFile };
