
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
    name = name.split(" ").join("_");
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
nba.playerPosition = function(name) {return this.playerInfo(name, 'data[0][position]');}
nba.playerHeightFeet = function(name) {return this.playerInfo(name, 'data[0][height_feet]');}
nba.playerHeightInches = function(name) {return this.playerInfo(name, 'data[0][height_inches]');}
nba.playerWeightPounds = function(name) {return this.playerInfo(name, 'data[0][weight_pounds]');}

nba.playerAveragePoints = function(id, season) {return this.playerstats(id, season, 'data[0][pts]')}
nba.playerAverageMinutes = function(id, season) {return this.playerstats(id, season, 'data[0][min]')}
nba.playerAverageRebounds = function(id, season) {return this.playerstats(id, season, 'data[0][reb]')}
nba.playerAverageAssits = function(id, season) {return this.playerstats(id, season, 'data[0][ast]')}
nba.playerAverageBlocks = function(id, season) {return this.playerstats(id, season, 'data[0][blk]')}
nba.playerAverageSteals = function(id, season) {return this.playerstats(id, season, 'data[0][stl]')}
nba.playerAverageOffensiveRebounds = function(id, season) {return this.playerstats(id, season, 'data[0][oreb]')}
nba.playerAverageDefensiveRebounds = function(id, season) {return this.playerstats(id, season, 'data[0][dreb]')}
nba.playerAverageTurnOvers = function(id, season) {return this.playerstats(id, season, 'data[0][turnover]')}
nba.playerAverageFouls = function(id, season) {return this.playerstats(id, season, 'data[0][pf]')}
nba.playerAverageFieldGoalAttempts = function(id, season) {return this.playerstats(id, season, 'data[0][fga]')}
nba.playerAverageFieldGoalMade = function(id, season) {return this.playerstats(id, season, 'data[0][fgm]')}
nba.playerAverageFieldGoalPercent = function(id, season) {return this.playerstats(id, season, 'data[0][fg_pct]')}
nba.playerAverageThreePointsAttempts = function(id, season) {return this.playerstats(id, season, 'data[0][fg3a]')}
nba.playerAverageThreePointsMade = function(id, season) {return this.playerstats(id, season, 'data[0][fg3m]')}
nba.playerAverageThreePointsPercent = function(id, season) {return this.playerstats(id, season, 'data[0][fg3_pct]')}
nba.playerAverageFreeThrowAttempts = function(id, season) {return this.playerstats(id, season, 'data[0][fta]')}
nba.playerAverageFreeThrowMade = function(id, season) {return this.playerstats(id, season, 'data[0][ftm]')}
nba.playerAverageFreeThrowPercent = function(id, season) {return this.playerstats(id, season, 'data[0][ft_pct]')}


nba.playerHeadShot = function(first_name, last_name) {return nbaImage.playerImage(first_name, last_name)}


nba.teamAbbreviation = function(id) {return this.teamInfo.call(id, 'abbreviation');}
nba.teamCity = function(id) {return this.teamInfo.call(id, 'city');}
nba.teamConference = function(id) {return this.teamInfo.call(id, 'conference');}
nba.teamdivision = function(id) {return this.teamInfo.call(id, 'division');}
nba.teamFullName = function(id) {return this.teamInfo.call(id, 'full_name');}
nba.teamName = function(id) {return this.teamInfo.call(id, 'name');}

module.exports = nba;