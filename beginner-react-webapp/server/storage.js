const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

const readDatabase = async () => {
  try {
    const rawContent = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(rawContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { users: [], leads: [] };
    }

    throw error;
  }
};

const writeDatabase = async (data) => {
  const serialised = JSON.stringify(data, null, 2);
  await fs.writeFile(DB_PATH, serialised, 'utf-8');
};

module.exports = { readDatabase, writeDatabase };
