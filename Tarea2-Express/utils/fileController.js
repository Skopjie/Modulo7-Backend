const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

async function getData() {
  try {
    const contenido = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(contenido);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await setData([]);
      return [];
    }
    throw err;
  }
}

async function setData(datos) {
  await fs.writeFile(dataFilePath, JSON.stringify(datos, null, 2), 'utf8');
}

module.exports = { getData, setData };
