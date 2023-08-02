import monk from 'monk';
import dotenv from 'dotenv';

dotenv.config();
const { MONGODB_URL } = process.env;
const db = monk(MONGODB_URL || 'mongodb://localhost:27017/v-crawling');

const drivers = db.get('drivers');
// (async () => await drivers.createIndex({ loggedAt: 1 }, { unique: true }))();
const teams = db.get('teams');
// (async () => await teams.createIndex({ loggedAt: 1 }, { unique: true }))();

const races = db.get('races');

export default db;