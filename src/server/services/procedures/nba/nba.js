
const ApiConsumer = require('../utils/api-consumer');
const nba = new ApiConsumer('nba', 'https://www.balldontlie.io/api/v1/',{cache: {ttl: 24*60*60}});

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


nba.playerId = function(name) {
    name = name.target.value.split(" ").join("_");
    field = '.' + field;
    const options = {
        path: `players?search=${name}`,
    };
    return this._sendAnswer(options, '.id')
        .catch(err => {
            if (nameError(err)) {
                return this.response.status(500).send(nameError(err));
            }
            throw err;
        });
}

nba.playerInfo = function(name, field) {
    name = name.target.value.split(" ").join("_");
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

nba.teamInfo = function(id, field) {
    field = '.' + field;
    const options = {
        path: `teams/${id}`,
    };
    return this._sendAnswer(options, '.id')
        .catch(err => {
            if (idError(err)) {
                return this.response.status(500).send(idError(err));
            }
            throw err;
        });
}

nba.playerFirstName = function(name) {return this.playerInfo(name, 'first_name');}
nba.playerLastName = function(name) {return this.playerInfo.call(name, 'last_name');}
nba.playerPosition = function(name) {return this.playerInfo.call(name, 'position');}
nba.playerHeightFeet = function(name) {return this.playerInfo.call(name, 'height_feet');}
nba.playerHeightInches = function(name) {return this.playerInfo.call(name, 'height_inches');}
nba.playerWeightPounds = function(name) {return this.playerInfo.call(name, 'weight_pounds');}
//nba.playerTeam = function(name){return playerInfo.call(this, name, 'team', 'full_name')}

nba.teamAbbreviation = function(id) {return this.teamInfo.call(id, 'abbreviation');}
nba.teamCity = function(id) {return this.teamInfo.call(id, 'city');}
nba.teamConference = function(id) {return this.teamInfo.call(id, 'conference');}
nba.teamdivision = function(id) {return this.teamInfo.call(id, 'division');}
nba.teamFullName = function(id) {return this.teamInfo.call(id, 'full_name');}
nba.teamName = function(id) {return this.teamInfo.call(id, 'name');}

module.exports = nba;