import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import db from "./db";
import { formatStr } from "./utils";

const drivers = db.get("drivers");
const teams = db.get("teams");
const raceResult = db.get("races");

export async function crawlingRaces(url: String, type: String, year: String) {
    // Fetch data from URL and store the response into a const
    const response = await fetch(`${url}`);

    // Convert the response into text
    const body = await response.text();

    // Load body data
    const $ = cheerio.load(body);

    // Create array empt
    const items: any[] = [];

    const statsTable = $('.resultsarchive-table > tbody > tr')
    statsTable.each(function () {
        let title = $(this).find('td').text(); // get the text in all the td elements
        items.push(title);
    });

    const newArr = items.map((entry) => {
        const lines = entry.trim().split('\n');
        const location = lines[0];
        const [date] = lines[2].trim().split(/\s{2,}/);
        const firstName = lines[5].trim();
        const [lastName] = lines[6].trim().split(/\s{2,}/);
        const [driverCode] = lines[8].trim().split(/\s{2,}/);
        const newStr = formatStr(lines[lines.length - 1].trim().split(/\s{2,}/)[0], []);
        return {
            year,
            location,
            date,
            driver: {
                firstName,
                lastName,
                code: driverCode
            },
            team: newStr[0],
            lab: newStr[1],
            time: newStr[2]
        };
    });

    return await raceResult.insert(newArr);
}

export async function crawlingDrivers(url: String, type: String, year: String) {
    // Fetch data from URL and store the response into a const
    const response = await fetch(`${url}`);

    // Convert the response into text
    const body = await response.text();

    // Load body data
    const $ = cheerio.load(body);

    // Create array empt
    const items: any[] = [];

    const statsTable = $('.resultsarchive-table > tbody > tr')
    statsTable.each(function () {
        let title = $(this).find('td').text(); // get the text in all the td elements
        items.push(title);
    });

    const newArr = items.map((entry) => {
        const parts = entry.split('\n').map((part) => part.trim()).filter(Boolean);
        const rank = parseInt(parts[0], 10);
        const firstName = parts[1];
        const lastName = parts[2];
        const code = parts[3];
        const nationality = parts[4];
        const team = parts[5];
        const points = parseInt(parts[6], 10);

        return { year, rank, firstName, lastName, code, nationality, team, points };
    });
    return await drivers.insert(newArr)
}

export async function crawlingTeams(url: String, type: String, year: String) {
    // Fetch data from URL and store the response into a const
    const response = await fetch(`${url}`);

    // Convert the response into text
    const body = await response.text();

    // Load body data
    const $ = cheerio.load(body);

    // Create array empt
    const items: any[] = [];

    const statsTable = $('.resultsarchive-table > tbody > tr')
    statsTable.each(function () {
        let title = $(this).find('td').text(); // get the text in all the td elements
        items.push(title);
    });

    const newArr = items.map((entry) => {
        const parts = entry.trim().split('\n');
        const rank = parseInt(parts[0], 10);
        const team = parts[1].trim();
        const points = parseInt(parts[2], 10);

        return { year, rank, team, points };
    });

    return await teams.insert(newArr)
}