
const reverseString = (str) => result = str?.split('').reverse().join('');

function convertStringToNumber(str) {
    let numberRegex = /^[0-9]$/;

    if (numberRegex.test(str)) return parseInt(str);

    let names = {
        "zero"  : 0,
        "one"   : 1,
        "two"   : 2,
        "three" : 3,
        "four"  : 4,
        "five"  : 5,
        "six"   : 6,
        "seven" : 7,
        "eight" : 8,
        "nine"  : 9,
    };

    return names[str];
}

function getCalibrationValue(str) {
    let numbersRegex = "one|two|three|four|five|six|seven|eight|nine";
    let pattern = "[0-9]|" + numbersRegex;
    let reversePattern = "[0-9]|" + reverseString(numbersRegex);

    let firstNumber = convertStringToNumber(str.match(pattern)?.[0]);
    let lastNumber = convertStringToNumber(reverseString(reverseString(str).match(reversePattern)?.[0]));

    return parseInt(firstNumber?.toString() + lastNumber?.toString()) || 0;
}

var calibrationValues = [];

const fs = require("fs");
fs.readFileSync("../input.txt")
    .toString()
    .split("\n")
    .forEach(row => calibrationValues.push(getCalibrationValue(row)));

let sum = calibrationValues.reduce((sum, calibrationValue) => sum += calibrationValue);

console.log("Answer:", sum);