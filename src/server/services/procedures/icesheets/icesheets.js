const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Icesheets = {};
Icesheets._data1 = [];
Icesheets._data2 = [];
Icesheets._data3 = [];

let timeConversion = function(time) {
    return (1950 - 1000*time);
}

const importdata1 = function(line) {
    let [time, d180, error] = line.trim().split(/\s+/);
    let adjustTime = timeConversion(time);
    Icesheets._data1.push({adjustTime, d180, error});
}

const importdata2 = function(line) {
    let [time, averagedSedRates, normalizedSedRates] = line.trim().split(/\s+/);
    let adjustTime = timeConversion(time);
    Icesheets._data2.push({adjustTime, averagedSedRates, normalizedSedRates});
}

const importdata3 = function(line) {
    let elements = line.trim().split(/\s+/);
    let s95; 
    let LR04a;
    if(elements.length == 6) {
        s95 = elements[2];
        LR041 = elements[3];
        let specMap = elements[4];
        let LR04b = elements[5];
        Icesheets._data3.push({s95,LR04a,specMap,LR04b});
    } else if(elements.length == 4) {
        s95 = elements[2];
        LR041 = elements[3];
        Icesheets._data3.push({s95,LR04a});
    } else {
        s95 = elements[0];
        LR041 = elements[1];
        Icesheets._data3.push({s95,LR04a});
    }
}

fs.readFileSync(path.join(__dirname, 'Pliocene-Pleistocene Benthic d18O Stack.txt'), 'utf8')
    .split('\n')
    .forEach(line=>importdata1(line));

fs.readFileSync(path.join(__dirname, 'Sedimentation Rates.txt'), 'utf8')
    .split('\n')
    .forEach(line=>importdata2(line));

fs.readFileSync(path.join(__dirname, 'Age model Conversion.txt'), 'utf8')
    .split('\n')
    .forEach(line=>importdata3(line));

Icesheets.getd180 = function(startyear, endyear) {
    return this._data1
        .map(data => [data.adjustTime, data.d180])
        .filter(data => data[0] >= startyear && data[0] <= endyear);
}

Icesheets.getd180error = function(startyear, endyear) {
    return this._data1
        .map(data => [data.adjustTime, data.error])
        .filter(data => data[0] >= startyear && data[0] <= endyear);
}

Icesheets.getAveSedRates = function(startyear, endyear) {
    return this._data2
        .map(data => [data.adjustTime, data.averagedSedRates])
        .filter(data => data[0] >= startyear && data[0] <= endyear);
}

Icesheets.getNormalizedSedRates = function(startyear, endyear) {
    return this._data2
        .map(data => [data.adjustTime, data.normalizedSedRates])
        .filter(data => data[0] >= startyear && data[0] <= endyear);
}

Icesheets.gets95Time = function() {
    return this._data3
        .map(data => [data.s95, data.LR04a]);
}

Icesheets.getsspecMapTime = function() {
    return this._data3
        .map(data => [data.specMap, data.LR04b]);
}

module.exports = Icesheets;