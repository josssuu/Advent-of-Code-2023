function findLastNumberChar(str) {
    var reverseIdx = str.split("").reverse().findIndex((char) => !isNaN(parseInt(char)));
    return str[str.length - reverseIdx - 1];
};

function findFirstNumberChar(str) {
    var idx = str.split("").findIndex((char) => !isNaN(parseInt(char)));
    return str[idx];
};

function extractCalibrationValue(row) {
    return parseInt(findFirstNumberChar(row) + findLastNumberChar(row));
};

var calibrationValues = [];

const fs = require("fs");
fs.readFileSync("../input.txt")
    .toString()
    .split("\n")
    .forEach(row => calibrationValues.push(extractCalibrationValue(row)));

let sum = calibrationValues.reduce((sum, calibrationValue) => sum += calibrationValue);

console.log("Answer:", sum);