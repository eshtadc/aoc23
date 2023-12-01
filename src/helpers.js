
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

function relativePath(filename) {
    return join(dirname(fileURLToPath(import.meta.url)), filename);
}

export function readFile(filename) {
    return fs.readFileSync(relativePath(filename), 'utf8');
}

export function parseFile(filename, separator = '\n') {
    const input = readFile(filename);
    return input.split(separator);
}

export function writeAnswer(output, part = 1) {
    console.log(`Final answer for part ${part}: `, output);
}

export function getAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz';
}

// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
export function mod(n, m) {
    return ((n % m) + m) % m;
}

export function drawGrid(grid, [tlX, tlY], [brX, brY], empty='.') {
    for (let y=tlY; y<=brY; y++) {
        let line = '';
        for (let x=tlX; x<=brX; x++) {
            const key = generateGridKey(x,y);
            if (grid.has(key)) {
                line = `${line}${grid.get(key)}`
            } else {
                line = `${line}${empty}`;
            }
        }
        console.log(line);
    }
}