"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHours = void 0;
var fs = require('fs');
var moment = require('moment');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
exports.calculateHours = {
    calculate: function (historyTechnical) {
        var totalHoursDay = exports.calculateHours.totalHours(historyTechnical);
        var totalNightOverTime = exports.calculateHours.HoursExtraNight(historyTechnical);
        var totalSundaypurs = exports.calculateHours.calcSundayOverTime(historyTechnical);
        return totalHoursDay;
    },
    totalHours: function (historyTechnical) {
        var totaHours = 0;
        return historyTechnical.map(function (registry) {
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            totaHours = totaHours + hoursWorked;
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
            var totalDiffHoursAfter = 0;
            var totalDifMinutesAfter = 0;
            var totalDiffHoursBefore = 0;
            var totalDifMinutesBefore = 0;
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
            //console.log(totalHours,totalMinutes );
        });
    },
    calcSundayOverTime: function (historyTechnical) {
        return historyTechnical.map(function (registry) {
            var hoursWorkedSunday = 0;
            var dateInit = registry.dateInit, dateEnd = registry.dateEnd;
            var dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            var dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            var dayOfTheWeek = moment(dateInitFormat).format('dddd');
            if (dayOfTheWeek === 'Sunday') {
                console.log('es domingo');
                hoursWorkedSunday = dateEndFormat.diff(dateInitFormat, 'hours');
            }
            console.log(hoursWorkedSunday);
            return hoursWorkedSunday;
        });
    }
};
