export function formatStr(str: any, teams: any) {

    // Extract the team name and remaining string using regular expression
    // const regex = /^(.*?RBPT)(\d+)(:.*)$/;

    const regex = /^(.*?)(\d+):(.*)$/;
    const [, teamName, raceNumber, time] = str.match(regex);

    // Find the matching team in arrayB
    // const teamData = teams.find((entry: any) => teamName.includes(entry.team));


    // Convert the raceNumber to a number
    // const raceNumberAsNumber = parseInt(raceNumber, 10);

    // Create the resulting array
    const array = [teamName, raceNumber, time];
    return array;
}

export function checkYear(year: any) {
    if (year) {
        return year;
    }
    return new Date().getFullYear().toString();
}