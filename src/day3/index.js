import { getCoordinate, isAdjacent, parseFile, writeAnswer } from '../helpers.js';

const SPACE = '.';

function isSymbol(str) {
    return isNaN(parseInt(str, 10)) && str !== SPACE;
}

function parseLine(line, y, schematic, adjacentCallback) {
    let i=0;
    let sum = 0;
    let check = '';
    let checkStartX = -1;
    // console.log('checking', line);
    for (let i=0; i<line.length; i++) {
        const digit = parseInt(line[i], 10);
        if (isNaN(digit)) {
            if (check.length > 0) {
                const adjacent = isAdjacent(checkStartX, i-1, y, schematic, isSymbol);
                if (adjacent) {
                    adjacentCallback(check, getCoordinate(checkStartX, y), adjacent[1]);
                }
                check = '';
                checkStartX = -1;
            }
            continue;
        }
        if (checkStartX === -1) {
            checkStartX = i;
        }
        check = check + line[i];
    }
    if (check.length > 0) {
        const adjacent = isAdjacent(checkStartX, i-1, y, schematic, isSymbol)
        if (adjacent) {
            adjacentCallback(check, getCoordinate(checkStartX, y), adjacent[1]);
        }
    }
}

function solvePart1(schematic) {
    let sum = 0;
    const adjacentCallback = (match) => {
        sum += parseInt(match, 10);
    }
    schematic.forEach((line, y) => parseLine(line, y, schematic, adjacentCallback));
    return sum;
}

function sumGearRatios(gearMap) {
    let sum = 0;
    gearMap.forEach((gearValues) => {
        if (gearValues.length === 2) {
            sum += parseInt(gearValues[0],10) * parseInt(gearValues[1],0);
        }
    });
    return sum;
}

function solvePart2(schematic) {
    const gearMap = new Map(); // coordinate = [gear values]
    const adjacentCallback = ((match, coordinate, matchedCoordinate) => {
        if(!gearMap.has(matchedCoordinate)) {
            gearMap.set(matchedCoordinate, [match]);
        } else {
            gearMap.get(matchedCoordinate).push(match);
        }
    });
    schematic.forEach((line, y) => parseLine(line, y, schematic, adjacentCallback));
    return sumGearRatios(gearMap);
}

export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day3/sample.txt' : '/day3/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
        writeAnswer(solvePart2(input), 2); // 83279367
    } else {
        writeAnswer(solvePart1(input), 1); // 531561
    }
}