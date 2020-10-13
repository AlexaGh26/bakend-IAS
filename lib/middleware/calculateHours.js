"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHours = void 0;
var fs = require('fs');
var moment = require('moment');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
var dateFormat = 'DD/MM/YYYY HH:mm:ss';
exports.calculateHours = {
    calculate: function (historyTechnical, week) {
        var rangeFrom = moment('2020').add(week, 'weeks').startOf('isoweek').format(dateFormat);
        var rangeTo = moment(rangeFrom, dateFormat).add(6, 'days').format(dateFormat);
        historyTechnical = historyTechnical.filter(function (item) {
            return (moment(item.dateInit, dateFormat).isSameOrAfter(moment(rangeFrom, dateFormat).set({ "hour": 23, "minute": 59 }))
                && moment(item.dateInit, dateFormat).isSameOrBefore(moment(rangeTo, dateFormat).set({ "hour": 23, "minute": 59 })))
                && moment(item.dateEnd, dateFormat).isSameOrAfter(moment(rangeFrom, dateFormat).set({ "hour": 23, "minute": 59 }))
                && moment(item.dateEnd, dateFormat).isSameOrBefore(moment(rangeTo, dateFormat).set({ "hour": 23, "minute": 59 }));
        });
        var resultCalculations = [];
        var totalHours = 0;
        var totalNightOvertime = 0;
        var sundayNightExtraHours = 0;
        var hoursSunday = 0;
        var normalHours = 0;
        var objectInformation = {};
        historyTechnical.map(function (registry, index) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var dayOfTheWeek = moment(dateInitFormat).format('dddd');
            if (dayOfTheWeek === 'Sunday') {
                hoursSunday = hoursSunday + exports.calculateHours.calcSundayOverTime(dateInitFormat, dateEndFormat);
                sundayNightExtraHours = sundayNightExtraHours + exports.calculateHours.HoursExtraNight(dateInitFormat, dateEndFormat, dateInit, dateEnd);
            }
            else {
                totalHours = totalHours + exports.calculateHours.totalHours(dateInitFormat, dateEndFormat, historyTechnical, index);
                totalNightOvertime = totalNightOvertime + exports.calculateHours.HoursExtraNight(dateInitFormat, dateEndFormat, dateInit, dateEnd);
            }
        });
        var totalHoursExtra = (totalNightOvertime + hoursSunday + sundayNightExtraHours);
        console.log(totalHours, totalHoursExtra);
        normalHours = totalHours - totalHoursExtra;
        objectInformation = {
            HoursWorkedWeek: totalHours,
            totalExtraHours: totalHoursExtra,
            totalHoursExtraNight: totalNightOvertime,
            totalSundayHours: hoursSunday,
            sundayNightExtraHours: sundayNightExtraHours,
            normalHours: normalHours
        };
        resultCalculations.push(objectInformation);
        return resultCalculations;
    },
    totalHours: function (dateInitFormat, dateEndFormat, historyTechnical, index) {
        var totaHours = 0;
        var hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
        totaHours = totaHours + hoursWorked;
        return totaHours;
    },
    HoursExtraNight: function (dateInitFormat, dateEndFormat, dateInit, dateEnd) {
        var totalHoursExtraNight = 0;
        var totalMinutesExtra = 0;
        var resultHoursAndMinutes = 0;
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
        var totalDiffHoursAfter = 0;
        var totalDifMinutesAfter = 0;
        var totalDiffHoursBefore = 0;
        var totalDifMinutesBefore = 0;
        var hoursAfter = dateEndFormat.isAfter(hourLimitInit);
        var hourBefore = dateInitFormat.isBefore(hourLimitEnd);
        if (hoursAfter) {
            totalDiffHoursAfter = dateEndFormat.diff(hourLimitInit, 'hours');
            totalDifMinutesAfter = (dateEndFormat.diff(hourLimitInit, 'minutes') - (totalDiffHoursAfter * 60));
        }
        if (hourBefore) {
            totalDiffHoursBefore = (dateInitFormat.diff(hourLimitEnd, 'hours'))
                ? ((dateInitFormat.diff(hourLimitEnd, 'hours')) * -1)
                : (dateInitFormat.diff(hourLimitEnd, 'hours'));
            totalDifMinutesBefore = (dateInitFormat.diff(hourLimitEnd, 'minutes') - (totalDiffHoursBefore * 60))
                ? (((dateInitFormat.diff(hourLimitEnd, 'minutes')) * -1) - (totalDiffHoursBefore * 60))
                : ((dateInitFormat.diff(hourLimitEnd, 'minutes') - (totalDiffHoursBefore * 60)));
        }
        var totalHours = totalDiffHoursAfter + totalDiffHoursBefore;
        var totalMinutes = totalDifMinutesAfter + totalDifMinutesBefore;
        totalHoursExtraNight = totalHoursExtraNight + totalHours;
        totalMinutesExtra = totalMinutesExtra + totalMinutes;
        resultHoursAndMinutes = totalHoursExtraNight + (Number((totalMinutesExtra / 60).toFixed(0)));
        totalHoursExtraNight = totalHoursExtraNight + resultHoursAndMinutes;
        return totalHoursExtraNight;
    },
    calcSundayOverTime: function (dateInitFormat, dateEndFormat) {
        var hoursWorkedSunday = 0;
        hoursWorkedSunday = dateEndFormat.diff(dateInitFormat, 'hours');
        //console.log(hoursWorkedSunday);
        return hoursWorkedSunday;
    }
};
