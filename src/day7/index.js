import { parseFile, writeAnswer } from '../helpers.js';

const CARD_VALUES = ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2].reduce((vals, card) => {
    if (isNaN(card)) {
        if (card === 'A') {
            vals.set(card, 14);
        } else if (card === 'K') {
            vals.set(card, 13);
        } else if (card === 'Q') {
            vals.set(card, 12);
        } else if (card === 'J') {
            vals.set(card, 11);
        } else if (card === 'T') {
            vals.set(card, 10);
        }
    } else {
        vals.set(`${card}`, card);
    }
    return vals;
}, new Map());

function countCards(cards) {
    return Array.from(cards).reduce((acc, card) => {
        acc.set(card, (acc.get(card) || 0) + 1);
        return acc;
    }, new Map());
}

function identifyHandWithJoker(cards) {
    if (!cards.includes('J')) {
        return identifyHand(cards);
    }
    const cardCounts = countCards(cards);
    let nextHighest = 0;
    let convertTo = 'J';
    cardCounts.forEach((count, card) => {
        if (count > nextHighest && card !== 'J') {
            nextHighest = count;
            convertTo = card;
        }
    });
    return identifyHand(cards.replace(/J/g, convertTo));
}

function identifyHand(cards) {
    const uniqueCards = new Set(cards).size;
    if (uniqueCards === 1) {
        return 'fiveOfAKind';
    }
    if (uniqueCards  === 4) {
        return 'onePair';
    }
    if (uniqueCards === 5) {
        return 'highCard';
    }
    // 3 unique cards could be two pair or three of a kind
    // 2 unique cards could be four of a kind or a full house
    const cardCounts = countCards(cards);
    const counts = [...cardCounts.values()];
    if (uniqueCards === 2) {
        if (counts.includes(4)) {
            return 'fourOfAKind';
        } else {
            return 'fullHouse';
        }
    }
    if (counts.includes(3)) {
        return 'threeOfAKind';
    }
    return 'twoPair';
}

function identifyHands(hands, allowJoker = false) {
    return hands.reduce((acc, hand) => {
        const [cards] = hand.split(' ');
        const type = allowJoker ? identifyHandWithJoker(cards) : identifyHand(cards);
        acc[type].push(hand);
        return acc;
    }, {
        fiveOfAKind: [], // 1 unique type of card
        fullHouse: [], // 2 unique
        fourOfAKind: [], // 2 unique
        threeOfAKind: [], // 3 unique
        twoPair: [], // 3 unique
        onePair: [], // 4 unique
        highCard: [], // 5 unique
    });
}

function compareCards(a, b) {
    const aVal = CARD_VALUES.get(a);
    const bVal = CARD_VALUES.get(b);
    if (aVal > bVal) {
        return -1;
    } else if (aVal < bVal) {
        return 1;
    } else {
        return 0;
    }    
}

function handSorter(a, b) {
    for (let i=0; i < 5; i++) {
        const aCard = a[i];
        const bCard = b[i];
        const comparison = compareCards(aCard, bCard);
        if (comparison !== 0) {
            return comparison;
        }
    }
    return 0;
}

function getWinnings(hands) {
    const allHands = [].concat(hands.fiveOfAKind, hands.fourOfAKind, hands.fullHouse, hands.threeOfAKind, hands.twoPair, hands.onePair, hands.highCard);
    let multiplier = allHands.length;
    return allHands.reduce((total, hand) => {
        const [_, bid] = hand.split(' ');
        total += parseInt(bid, 10) * multiplier;
        multiplier--;
        return total;
    }, 0);
}

function calculateHands(groupedHands) {
    const sortedHands = {
        fiveOfAKind: groupedHands.fiveOfAKind.sort(handSorter),
        fullHouse: groupedHands.fullHouse.sort(handSorter),
        fourOfAKind: groupedHands.fourOfAKind.sort(handSorter),
        threeOfAKind: groupedHands.threeOfAKind.sort(handSorter),
        twoPair: groupedHands.twoPair.sort(handSorter),
        onePair: groupedHands.onePair.sort(handSorter),
        highCard: groupedHands.highCard.sort(handSorter),
    };
    return getWinnings(sortedHands);
}

function solvePart1(hands) {
    const groupedHands = identifyHands(hands);
    return calculateHands(groupedHands);
}

function solvePart2(hands) {
    CARD_VALUES.set('J', 0); // Joker is now the weakest card
    const groupedHands = identifyHands(hands, true);   
    return calculateHands(groupedHands);
}

export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day7/sample.txt' : '/day7/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
       writeAnswer(solvePart2(input), 2); // 251224870
    } else {
       writeAnswer(solvePart1(input), 1); // 250347426
    }
}