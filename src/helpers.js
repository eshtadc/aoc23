
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

export function getCoordinate(x, y) {
    return `${x},${y}`;
}

/**
 * Checks a grid for a match above, below, left, or right of an anchor.
 * startX: The x position of the first position of the anchor
 * endX: The x position of the last position of the anchor (can be the same as startX for an anchor that only takes a single x coordinate)
 * y: The y position of the anchor
 * grid: the grid to check
 * matcher: a function that will return true if there is a match at the given coordinate
 * checkDiagonal: if true, will also check diagonally adjacent positions
 * Returns false if no match, otherwise and array with the first element being true and the second element being the coordinate of the match
 */
export function isAdjacent(startX, endX, y, grid, matcher, checkDiagonal = true) {
    const lineMaxX = grid[0].length-1;
    const checkXStart = checkDiagonal ? Math.max(startX-1, 0) : startX;
    const checkXEnd = checkDiagonal ? Math.min(endX+1, lineMaxX) : endX;
    if (y > 0) {
        for (let x=checkXStart; x<=checkXEnd; x++) {
            if (matcher(grid[y-1][x])) {
                return [true, getCoordinate(x, y-1)];
            }
        }
    }
    if (y < grid.length-1) {
        for (let x=checkXStart; x<=checkXEnd; x++) {
            if (matcher(grid[y+1][x])) {
                return [true, getCoordinate(x, y+1)];
            }
        }
    }
    if (startX > 0) {
        if (matcher(grid[y][startX-1])) {
            return [true, getCoordinate(startX-1, y)];
        }
    }
    if (endX < lineMaxX) {
        if (matcher(grid[y][endX+1])) {
            return [true, getCoordinate(endX+1, y)];
        }
    }
    return false;
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