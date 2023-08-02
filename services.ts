import logger from "node-color-log";
import { checkYear } from "./utils";
import { crawlingDrivers, crawlingRaces, crawlingTeams } from "./tasks";
import db from "./db";

const races = db.get("races");

export async function formulaRaceResult(year: any, type: any) {
    try {
        let url = '';

        if (year) {
            url = `https://www.formula1.com/en/results.html/${year}`
        } else {
            url = 'https://www.formula1.com/en/results.html/2023'
        }

        switch (type) {
            case 'drivers':
                year = checkYear(year);
                url = `${url}/drivers.html`;
                crawlingDrivers(url, type, year);
                break;

            case 'teams':
                year = checkYear(year);
                url = `${url}/team.html`;
                crawlingTeams(url, type, year)
                break;

            default:
                year = checkYear(year)
                url = `${url}/races.html`;
                crawlingRaces(url, type, year);
                break;
        }

    } catch (error) {
        logger.error(error.message);
        return error;
    }
}



export async function getRaceResult(year: String, team: String, driver: String) {
    try {
        let obj: any = {};
        if (year) {
            obj.year = year;
        }
        if (team) {
            obj.team = team;
        }
        if(driver){
            obj = {
                ...obj,
                $or: [
                    { 'driver.firstName': { $regex: driver, $options: "i" } },
                    { 'driver.lastName': { $regex: driver, $options: "i" } },
                ]
            }
        }
        const result = await races.find({ ...obj })
        return {result, total: result.length};
    } catch (error) {
        logger.error(error.message);
        return error;
    }
}