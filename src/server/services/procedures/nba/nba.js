
const ApiConsumer = require('../utils/api-consumer');
const nba = new ApiConsumer('nba', 'https://www.balldontlie.io/api/v1/',{cache: {ttl: 24*60*60}});
const nbaImage = new ApiConsumer('nbaImage', 'https://nba-players.herokuapp.com/', {cache: {ttl: 24*60*60}});

const nameError = err => {
    if(err.statusCode === 404) {
        return "unknown name";
    }
}

const fieldError = err => {
    if(err.statusCode === 404) {
        return "unknown field";
    }
}

const idError = err => {
    if(err.statusCode === 404) {
        return "unknown field";
    }
}

nba.teamInfo = function(id, field) {
    field = '.' + field;
    const options = {
        path: `teams/${id}`,
    };
    return this._sendAnswer(options, field)
        .catch(err => {
            if (idError(err)) {
                return this.response.status(500).send(idError(err));
            }
            throw err;
        });
}

nba.playerInfo = function(name, field) {
    name = ('' + name).split(" ").join("_");
    field = '.' + field;
    const options = {
        path: `players?search=${name}`,
    };
    return this._sendAnswer(options, field)
        .catch(err => {
            if(nameError(err)) {
                return this.response.status(500).send(nameError(err));
            } else if(fieldError(err)) {
                return this.response.status(500).send(fieldError(err));
            } 
            throw err;
        });
}


nba.playerstats = function(id, season, field) {
    field = '.' + field;
    const options = {
        path: `season_averages?season=${season}&player_ids[]=${id}`,
    };
    return this._sendAnswer(options, field)
        .catch(err => {
            if(idError(err)) {
                return this.response.status(500).send(idError(err));
            } else if(fieldError(err)) {
                return this.response.status(500).send(fieldError(err));
            } 
            throw err;
        });
}

nbaImage.playerImage = function(first_name, last_name) {
    const options = {
        path: `players/${last_name}/${first_name}`,
    };
    return this._sendImage(options)
        .catch(err => {
            if(nameError(err)) {
                return this.response.status(500).send(nameError(err));
            } 
            throw err;
        });
}

nba.playerId = function(name) {return this.playerInfo(name, 'data[0][id]');}
nba.playerFirstName = function(name) {return this.playerInfo(name, 'data[0][first_name]');}
nba.playerLastName = function(name) {return this.playerInfo(name, 'data[0][last_name]');}
nba.playerPosition = async function(name) {
    let positionInfo = await this.playerInfo(name, 'data[0][position]');
    if(positionInfo === 'G') {
        return 'Guard';
    } else if(positionInfo === 'F') {
        return 'Forward';
    } else if(positionInfo === 'C') {
        return 'Center';
    } else if(positionInfo === 'F-C') {
        return 'Forward or Center';
    } else if(positionInfo === 'G-F') {
        return 'Guard or Forward';
    }
}
nba.playerHeightFeet = function(name) {return this.playerInfo(name, 'data[0][height_feet]');}
nba.playerHeightInches = function(name) {return this.playerInfo(name, 'data[0][height_inches]');}
nba.playerWeightPounds = function(name) {return this.playerInfo(name, 'data[0][weight_pounds]');}
nba.playerteamName = function(name) {return this.playerInfo(name, 'data[0][team][name]');}
nba.playerteamCity = function(name) {return this.playerInfo(name, 'data[0][team][city]');}

nba.playerAveragePoints = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][pts]');
}
nba.playerAverageMinutes = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][min]');
}
nba.playerAverageRebounds = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][reb]');
}
nba.playerAverageAssits = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][ast]');
}
nba.playerAverageBlocks = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][blk]');
}
nba.playerAverageSteals = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][stl]');
}
nba.playerAverageOffensiveRebounds = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][oreb]');
}
nba.playerAverageDefensiveRebounds = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][dreb]');
}
nba.playerAverageTurnOvers = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][turnover]');
}
nba.playerAverageFouls = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][pf]');
}
nba.playerAverageFieldGoalAttempts = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][fga]');
}
nba.playerAverageFieldGoalMade = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][fgm]');
}
nba.playerAverageFieldGoalPercent = async function(name, season) {
    let id = await this.playerId(name);
    let percentInDecimal = await this.playerstats(id, season, 'data[0][fg_pct]');
    return Math.floor(percentInDecimal * 100) + '%';
}
nba.playerAverageThreePointsAttempts = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][fg3a]');
}
nba.playerAverageThreePointsMade = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][fg3m]');
}
nba.playerAverageThreePointsPercent = async function(name, season) {
    let id = await this.playerId(name);
    let percentInDecimal = await this.playerstats(id, season, 'data[0][fg3_pct]');
    return Math.floor(percentInDecimal * 100) + '%';
}
nba.playerAverageFreeThrowAttempts = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][fta]');
}
nba.playerAverageFreeThrowMade = async function(name, season) {
    let id = await this.playerId(name);
    return this.playerstats(id, season, 'data[0][ftm]');
}
nba.playerAverageFreeThrowPercent = async function(name, season) {
    let id = await this.playerId(name);
    let percentInDecimal = await this.playerstats(id, season, 'data[0][ft_pct]');
    return Math.floor(percentInDecimal * 100) + '%';
}

nba.playerHeadShot = async function(name) {
    nbaImage.response = this.response;
    let first_name = await this.playerFirstName(name);
    let last_name = await this.playerLastName(name);
    return nbaImage.playerImage(first_name, last_name);
}

nba.NBAEfficiency = async function(name, season) {
    let pts = await this.playerAveragePoints(name, season);
    let ast = await this.playerAverageAssits(name, season);
    let reb = await this.playerAverageRebounds(name, season);
    let blk = await this.playerAverageBlocks(name, season);
    let stl = await this.playerAverageSteals(name, season);
    let tov = await this.playerAverageTurnOvers(name, season);
    let ga = await this.playerAverageFieldGoalAttempts(name, season);
    let gm = await this.playerAverageFieldGoalMade(name, season);
    let fa = await this.playerAverageFreeThrowAttempts(name, season);
    let fm = await this.playerAverageFreeThrowMade(name, season);
    return (pts + ast + reb + blk + stl - tov - (ga - gm) - (fa - fm));
}

nba.playerAssistOverTurnovers = async function(name, season) {
    let ast = await this.playerAverageAssits(name, season);
    let tov = await this.playerAverageTurnOvers(name, season);
    return (ast/tov);
}

var teamDict = new Object();


nba.teamAbbreviation = function(id) {return this.teamInfo.call(id, 'abbreviation');}
nba.teamCity = function(id) {return this.teamInfo.call(id, 'city');}
nba.teamConference = function(id) {return this.teamInfo.call(id, 'conference');}
nba.teamdivision = function(id) {return this.teamInfo.call(id, 'division');}
nba.teamFullName = function(id) {return this.teamInfo.call(id, 'full_name');}
nba.teamName = function(id) {return this.teamInfo.call(id, 'name');}

module.exports = nba;