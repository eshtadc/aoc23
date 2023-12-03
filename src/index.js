const aocDay = 3;

async function loadModule(day) {
    return await import(`./day${day}/index.js`);
}

const { solve } = await loadModule(aocDay);

// solve(1, true);
solve(2);
