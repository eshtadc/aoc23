import { parseFile, writeAnswer } from '../helpers.js';

function parseRaces(raceSheet) {
    const spaceRegex = /\s+/;
    const [times, distances] = raceSheet;
    const timeList = times.replace(/Time:\s+/, '').split(spaceRegex).map(parseFloat);
    const distanceList = distances.replace(/Distance:\s+/, '').split(spaceRegex).map(parseFloat);
    return [timeList, distanceList];
}

function parseSheet(raceSheet) {
    let [times, distances] = raceSheet;
    times = times.replace(/Time:\s+/, '');
    distances = distances.replace(/Distance:\s+/, '');
    const time = parseFloat(times.replace(/\s*/g, ''));
    const distance = parseFloat(distances.replace(/\s*/g, ''));
    return [time, distance];
}

function getTraveledDistance(holdTime, totalTime) {
    const timePerUnit = holdTime;
    return (totalTime - holdTime) * timePerUnit;
}

function solvePart1(raceSheet) {
    const [times, distances] = parseRaces(raceSheet);
    const races = distances.reduce((acc, distance, i) => {
        acc.set(distance, {
            minTime: times[i],
            winners: 0,
        });
        return acc;
    }, new Map());
    const maxTime = times.pop();
    let hasHadWin = false;
    for (let i=1; i<maxTime; i++) {
        let hadWinner = false;
        races.forEach((stats, distance) => {
            const total = getTraveledDistance(i, stats.minTime);
            if (total > distance) {
                hadWinner = true;
                hasHadWin = true;
                stats.winners++;
            }
        });
        if (!hadWinner && hasHadWin) {
            console.log('no winner at time', i);
            break;
        }
    }
    let total = 1;
    races.forEach(stats => {
        total = total * stats.winners;
    });
    return total;
}

function solvePart2(raceSheet) {
    const [time, distance] = parseSheet(raceSheet);
    // get the minimum and maximum values and then figure out the range of winners
    let minTime;
    let maxTime;
    for (let i=1; i<time; i++) {
        const traveled = getTraveledDistance(i, time);
        if (traveled > distance) {
            minTime = i;
            break;
        }
    
    }
    for (let i=time-1; i>minTime; i--) {
        const traveled = getTraveledDistance(i, time);
        if (traveled > distance) {
            maxTime = i;
            break;
        }
    }
    return maxTime - minTime + 1;
}

export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day6/sample.txt' : '/day6/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
       writeAnswer(solvePart2(input), 2); // 35961505
    } else {
       writeAnswer(solvePart1(input), 1); // 1155175
    }
}