import { parseFile, writeAnswer } from '../helpers.js';

const NUMBERS = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four' : 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine' : 9,
}

const NUMBER_REGEX = new RegExp(`^(${Object.keys(NUMBERS).map(string => `(${string})`).join('|')})`);
const DIGITS_REGEX = new RegExp(/[0-9]/g);

function parseDigits(str) {
    return str.match(DIGITS_REGEX);
}

function parseExtendedDigitsFromLine(line) {
    let numbers = [];
    let pointer = 0;
    let str = line;
    while(str.length) {
        const testNumber = parseInt(str[0], 10);
        if (!isNaN(testNumber)) {
            numbers.push(testNumber)
        } else {
            const match = str.match(NUMBER_REGEX);
            if (match) {
                numbers.push(NUMBERS[match[0]]);
            }
        }
        str = str.slice(1);
    };
    return numbers;
}

function gatherCalibrationNumber(numbers) {
    const first = numbers.shift();
    const last = numbers.pop() ?? first;
    return parseInt(`${first}${last}`, 10);
}

function getCalibrationNumber(lines, lineParser) {
    return lines.reduce((total, line) => {
        const lineTotal = gatherCalibrationNumber(lineParser(line));
        return total + lineTotal;
    }, 0);
}

function solvePart1(lines) {
    return getCalibrationNumber(lines, parseDigits);
}
function solvePart2(lines) {
    return getCalibrationNumber(lines, parseExtendedDigitsFromLine);
}

export function solve(part = 1, isSample = false) {
    let filename = '/day1/input.txt';
    if (isSample) {
        filename = part === 2 ? '/day1/sample.2.txt' : '/day1/sample.1.txt';
    }
    const input = parseFile(filename);
    if (part === 2) {
        writeAnswer(solvePart2(input), 2); // 54100
    } else {
        writeAnswer(solvePart1(input), 1); // 54877
    }
}