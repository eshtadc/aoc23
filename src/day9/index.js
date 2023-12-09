import { parseFile, writeAnswer } from '../helpers.js';

function getDifferences(vals) {
    let diffs = [];
    for (let i=1; i<vals.length; i++) {
        const diff = vals[i]-vals[i-1];
        diffs.push(vals[i]-vals[i-1]);
    }
    return diffs;
}

function extrapolate(vals, sum=true) {
    let extrapolated = vals.pop();
    if (vals.length === 0) {
        return extrapolated;
    }
    for (let i = vals.length-1; i>=0; i--) {
        extrapolated = sum ? vals[i] + extrapolated : vals[i] - extrapolated;
    }
    return extrapolated;
}

function getExtrapolatedValue(line) {
    let isNotSame = new Set(line).size > 1;
    let lasts = line.slice(-1);
    let check = line;
    while (isNotSame) {
        line = getDifferences(line);
        lasts = lasts.concat(line.slice(-1));
        isNotSame = new Set(line).size > 1;
    }
    return extrapolate(lasts);
}

function getFirstExtrapolatedValue(line) {
    let isNotSame = new Set(line).size > 1;
    let firsts = line.slice(0, 1);
    let check = line;
    while (isNotSame) {
        line = getDifferences(line);
        firsts = firsts.concat(line.slice(0, 1));
        isNotSame = new Set(line).size > 1;
    }
    return extrapolate(firsts, false);
}

function solvePart1(input) {
    return input.map(line => {
        return getExtrapolatedValue(line.split(' ').map(parseFloat));
    }).reduce((acc, val) => acc + val, 0);
}

function solvePart2(input) {
    return input.map(line => {
        return getFirstExtrapolatedValue(line.split(' ').map(parseFloat));
    }).reduce((acc, val) => acc + val, 0);
}

export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day9/sample.txt' : 'day9/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
       writeAnswer(solvePart2(input), 2); // 933
    } else {
       writeAnswer(solvePart1(input), 1); // 1666172641
    }
}