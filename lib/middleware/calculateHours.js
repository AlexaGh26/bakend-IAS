"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHours = void 0;
var fs = require('fs');
var moment = require('moment');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
exports.calculateHours = {
    calculate: function (historyTechnical) {
        console.log('entro a calculate');
        var totalHoursDay = exports.calculateHours.totalHours(historyTechnical);
        var totalHoursExtraNight = exports.calculateHours.calHoursExtraNight(historyTechnical);
        return totalHoursDay;
    },
    totalHours: function (historyTechnical) {
        console.log('entro a calcular total');
        return historyTechnical.map(function (registry) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        });
    },
    calHoursExtraNight: function (historyTechnical) {
        console.log('entro a calHoursExtra nocturnas');
        return historyTechnical.map(function (registry) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var hourLimitInit = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var hourLimitEnd = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            hourLimitInit.set({
                hour: '20',
                minute: '00',
            });
            hourLimitEnd.set({
                hour: '07',
                minute: '00',
            });
            //console.log(dateEndFormat.isAfter(hourLimitInit))
            console.log(dateInitFormat.isBefore(hourLimitEnd));
        });
    }
};
