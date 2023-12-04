import { parseFile, writeAnswer } from '../helpers.js';

const SPACE_REGEX = /\s+/;

function getNumberWinners(winners, numbers) {
    return numbers.reduce((numberWinners, number) => {
        if (winners.has(number)) {
            numberWinners++;
        }
        return numberWinners;
    }, 0);
}

function getCardPoints(winners, numbers) {
    const numOfWinners = getNumberWinners(winners, numbers);
    if (numOfWinners === 0) {
        return 0;
    }
    return 2 ** (numOfWinners - 1);
}

function parseCard(card) {
    const [_, vals] = card.split(': ');
    const [winnerStr, numStr] = vals.split(' | ');
    const winners = winnerStr.trim().split(SPACE_REGEX).reduce((acc, val) => {
        acc.add(val);
        return acc;
    }, new Set());
    const numbers = numStr.trim().split(SPACE_REGEX);
    return [winners, numbers];
}

function solvePart1(cards) {
    return cards.reduce((total, cardLine) => {
        const [ winners, numbers ] = parseCard(cardLine);
        return total + getCardPoints(winners, numbers);
    }, 0);
}

function solvePart2(cards) {
    const winnings = new Map();
    let i = 0;
    for (const cardLine of cards) {
        winnings.set(i, (winnings.get(i) || 0) + 1);
        const [winners, numbers] = parseCard(cardLine);
        const numWinners = getNumberWinners(winners, numbers); 
        for (let j=1; j<=numWinners; j++) {
            let cardNum = i+j;
            winnings.set(cardNum, (winnings.get(cardNum) || 0) + winnings.get(i));
        };
        i++;
    };
    let totalCards = 0;
    winnings.forEach((val) => {
        totalCards += val;
    });
    return totalCards;
}

export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day4/sample.txt' : '/day4/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
       writeAnswer(solvePart2(input), 2); // 8063216
    } else {
       writeAnswer(solvePart1(input), 1); // 18619
    }
}