"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHours = void 0;
var fs = require('fs');
var moment = require('moment');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
exports.calculateHours = {
    calculate: function (historyTechnical) {
        var totalHoursDay = exports.calculateHours.totalHours(historyTechnical);
        var totalHoursExtraNight = exports.calculateHours.HoursExtraNight(historyTechnical);
        return totalHoursDay;
    },
    totalHours: function (historyTechnical) {
        return historyTechnical.map(function (registry) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        });
    },
    HoursExtraNight: function (historyTechnical) {
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
            var hoursAfter = dateEndFormat.isAfter(hourLimitInit);
            var hourBefore = dateInitFormat.isBefore(hourLimitEnd);
            if (hoursAfter) {
                var totalDiff = dateEndFormat.diff(hourLimitInit, 'hours');
                var minuteDiff = (dateEndFormat.diff(hourLimitInit, 'minutes') - (totalDiff * 60));
                //console.log(totalDiff, minuteDiff);
            }
            if (hourBefore) {
                var totalDiff = dateInitFormat.diff(hourLimitEnd, 'hours');
                var minuteDiff = (totalDiff * 60) - (dateInitFormat.diff(hourLimitEnd, 'minutes'));
                console.log(totalDiff, minuteDiff);
            }
        });
    }
};
