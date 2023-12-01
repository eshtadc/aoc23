const aocDay = 1;

async function loadModule(day) {
    return await import(`./day${day}/index.js`);
}

const { solve } = await loadModule(aocDay);

solve(1);
solve(2);
