import { Looper, lcmm, parseFile, writeAnswer } from '../helpers.js';

const INSTRUCTIONS_REGEX = /\(([0-9A-Z]+), ([0-9A-Z]+)\)/;

function getInstructions(map) {
    return new Looper(map[0]);
}

function getNextLocation(map, current, direction) {
    const { left, right } = map.get(current);
    return direction === 'L' ? left : right;
}

function parseMap(map) {
    let parsed = new Map();
    let starting = [];
    for (let i=2; i<map.length; i++) {
        const line = map[i];
        const [location, neighbors] = line.split(' = ');
        const [_, left, right] = neighbors.match(INSTRUCTIONS_REGEX);
        const lastLetter = location.slice(-1);
        parsed.set(location, { 
            left, 
            right,  
            isEnd: lastLetter === 'Z' 
        });
        if (lastLetter === 'A') {
            starting.push(location);
        };

    }
    return [parsed, starting];
}

function traverseMap(instructions, map, start, end) {
    let current = start;
    let steps = 0;
    for (let instruction of instructions) {
        steps++;
        current = getNextLocation(map, current, instruction);
        if (current === end) {
            return steps;
        }
    }
}

function traverseMapSimultaneous(instructions, map, starting) {
    let current = starting.map((location) => [location, 0, false]);
    for (let instruction of instructions) {
        let hasUnsolved = false;
        current = current.map(([location, steps, isSolved]) => {
            if (isSolved) {
                return [location, steps, isSolved];
            }
            const next = getNextLocation(map, location, instruction);
            const solved = map.get(next).isEnd;
            if (!solved) {
                hasUnsolved = true;
            }
            return [next, steps+1, solved];
        });
        if (!hasUnsolved) {
            break;
        }
    }
    const totalSteps = current.map(([_, steps]) => steps);
    return lcmm(totalSteps);
}

function solvePart1(input) {
    const instructions = getInstructions(input);
    const [map] = parseMap(input);
    return traverseMap(instructions, map, 'AAA', 'ZZZ');
}

function solvePart2(input) {
    const instructions = getInstructions(input);
    const [map, starting] = parseMap(input);
    return traverseMapSimultaneous(instructions, map, starting);
}

export function solve(part = 1, isSample = false) {
    let filename = 'day8/input.txt';
    if (isSample) {
        filename = part === 1 ? 'day8/sample.txt' : 'day8/sample.2.txt';
    }
    const input = parseFile(filename);
    if (part === 2) {
       writeAnswer(solvePart2(input), 2); // 21165830176709
    } else {
       writeAnswer(solvePart1(input), 1); // 21409
    }
}