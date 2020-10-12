"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHours = void 0;
var fs = require('fs');
var moment = require('moment');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
exports.calculateHours = {
    calculate: function (historyTechnical) {
        console.log('entro a calculate');
        return exports.calculateHours.calHoursExtra(historyTechnical);
    },
    calHoursExtra: function (historyTechnical) {
        console.log('entro a calHoursExtra');
        historyTechnical.map(function (registry) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        });
    }
};
