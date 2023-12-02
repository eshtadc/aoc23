import { parseFile, writeAnswer } from '../helpers.js';

function parseShowing(str, game) {
    const cubeParts = str.split(', ');
    return cubeParts.reduce((showing, cubePart) => {
        const [numStr, color] = cubePart.split(' ');
        const numCubes = parseInt(numStr, 10);
        showing[color] = Math.max(showing[color] ?? 0, numCubes);
        game.max[color] = Math.max(game.max[color] ?? 0, numCubes);
        return showing;
    }, {});
}

function parseGame(gameStr) {
    const [gamePartStr, cubesStr] = gameStr.split(': ');
    const [_, gameNumStr] = gamePartStr.split(' ');
    const cubeSubsets = cubesStr.split('; ');
    const game = {
        number: parseInt(gameNumStr, 10),
        max: {},
    };
    game.showings = cubeSubsets.map(set => {
        return parseShowing(set, game);
    });
    game.power = Object.keys(game.max).reduce((total, color) => {
        return total * game.max[color];
    }, 1);
    return game;
}

function getSumPossibleGames(games, cubeMaxes) {
    return games.reduce((total, game) => {
        const isPossible = game.showings.every(showing => {
            return Object.keys(showing).every(color => {
                return showing[color] <= cubeMaxes[color];
            });
        });
        return total + (isPossible ? game.number : 0);
    }, 0);
}

function getSumPowerCubes(games) {
    return games.reduce(((total, game) => game.power + total), 0);
}

function solvePart1(gameInput) {
    const games = gameInput.map(parseGame);
    return getSumPossibleGames(games, {
        red: 12,
        green: 13,
        blue: 14,
    });
}

function solvePart2(gameInput) {
    const games = gameInput.map(parseGame);
    return getSumPowerCubes(games);
}


export function solve(part = 1, isSample = false) {
    let filename = isSample ? 'day2/sample.txt' : '/day2/input.txt';
    const input = parseFile(filename);
    if (part === 2) {
        writeAnswer(solvePart2(input), 2); // 69110
    } else {
        writeAnswer(solvePart1(input), 1); // 2810
    }
}