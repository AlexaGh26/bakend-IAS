const fs = require('fs');
const moment = require('moment');
const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
const dateFormat = 'DD/MM/YYYY HH:mm:ss';

export const calculateHours = {
    calculate: (historyTechnical: any, week: number) => {
        const rangeFrom = moment('2020').add(week, 'weeks').startOf('isoweek').format(dateFormat);
        const rangeTo = moment(rangeFrom, dateFormat).add(6, 'days').format(dateFormat);
        historyTechnical = historyTechnical.filter((item: any) => {
            return (
            moment(item.dateInit, dateFormat).isSameOrAfter(moment(rangeFrom, dateFormat).set({"hour": 23, "minute": 59})) 
            && moment(item.dateInit, dateFormat).isSameOrBefore(moment(rangeTo, dateFormat).set({"hour": 23, "minute": 59}))) 
            && moment(item.dateEnd, dateFormat).isSameOrAfter(moment(rangeFrom, dateFormat).set({"hour": 23, "minute": 59})) 
            && moment(item.dateEnd, dateFormat).isSameOrBefore(moment(rangeTo, dateFormat).set({"hour": 23, "minute": 59})) 
        })
        
        let resultCalculations: any = [];
        let totalHours = 0;
        let totalNightOvertime = 0;
        let sundayNightExtraHours = 0
        let hoursSunday = 0;
        let normalHours = 0;
        let objectInformation = {};
        historyTechnical.map((registry: any, index: any) => {
            const { dateInit, dateEnd } = registry
            const dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            const dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            const dayOfTheWeek = moment(dateInitFormat).format('dddd');

            if (dayOfTheWeek === 'Sunday') {
                hoursSunday = hoursSunday + calculateHours.calcSundayOverTime(dateInitFormat, dateEndFormat);
                sundayNightExtraHours = sundayNightExtraHours + calculateHours.HoursExtraNight(dateInitFormat, dateEndFormat, dateInit, dateEnd);
            } else {
                totalHours = totalHours + calculateHours.totalHours(dateInitFormat, dateEndFormat, historyTechnical, index);
                totalNightOvertime = totalNightOvertime + calculateHours.HoursExtraNight(dateInitFormat, dateEndFormat, dateInit, dateEnd);
            }
        })
        let totalHoursExtra = ( totalNightOvertime + hoursSunday + sundayNightExtraHours);
        console.log(totalHours,totalHoursExtra);
        
        normalHours = totalHours - totalHoursExtra; 

        objectInformation = {
            HoursWorkedWeek : totalHours,
            totalExtraHours : totalHoursExtra,
            totalHoursExtraNight: totalNightOvertime,
            totalSundayHours: hoursSunday,
            sundayNightExtraHours: sundayNightExtraHours,
            normalHours: normalHours
        }
        resultCalculations.push(objectInformation);
        return resultCalculations;
    },
    totalHours: (dateInitFormat: any, dateEndFormat: any, historyTechnical: any, index: number) => {
        let totaHours = 0;
        const hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
        totaHours = totaHours + hoursWorked;
        return totaHours;
    },
    HoursExtraNight: (dateInitFormat: any, dateEndFormat: any, dateInit: any, dateEnd: any) => {
        let totalHoursExtraNight = 0;
        let totalMinutesExtra = 0;
        let resultHoursAndMinutes = 0;
        const hourLimitInit = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
        const hourLimitEnd = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
        hourLimitInit.set({
            hour: '20',
            minute: '00',
        })
        hourLimitEnd.set({
            hour: '07',
            minute: '00',
        })
        let totalDiffHoursAfter = 0;
        let totalDifMinutesAfter = 0;
        let totalDiffHoursBefore = 0;
        let totalDifMinutesBefore = 0;

        const hoursAfter = dateEndFormat.isAfter(hourLimitInit);
        const hourBefore = dateInitFormat.isBefore(hourLimitEnd);
        if (hoursAfter) {
            totalDiffHoursAfter = dateEndFormat.diff(hourLimitInit, 'hours')
            totalDifMinutesAfter = (dateEndFormat.diff(hourLimitInit, 'minutes') - (totalDiffHoursAfter * 60))
        }
        if (hourBefore) {
            totalDiffHoursBefore = (dateInitFormat.diff(hourLimitEnd, 'hours'))
                ? ((dateInitFormat.diff(hourLimitEnd, 'hours')) * -1)
                : (dateInitFormat.diff(hourLimitEnd, 'hours'));

            totalDifMinutesBefore = (dateInitFormat.diff(hourLimitEnd, 'minutes') - (totalDiffHoursBefore * 60))
                ? (((dateInitFormat.diff(hourLimitEnd, 'minutes')) * -1) - (totalDiffHoursBefore * 60))
                : ((dateInitFormat.diff(hourLimitEnd, 'minutes') - (totalDiffHoursBefore * 60)));

        }
        let totalHours = totalDiffHoursAfter + totalDiffHoursBefore;
        let totalMinutes = totalDifMinutesAfter + totalDifMinutesBefore;
        totalHoursExtraNight = totalHoursExtraNight + totalHours;
        totalMinutesExtra = totalMinutesExtra + totalMinutes;
        resultHoursAndMinutes = totalHoursExtraNight + (Number((totalMinutesExtra / 60).toFixed(0)))
        totalHoursExtraNight = totalHoursExtraNight + resultHoursAndMinutes
        return totalHoursExtraNight;
    },
    calcSundayOverTime: (dateInitFormat: any, dateEndFormat: any) => {
        let hoursWorkedSunday = 0;
        hoursWorkedSunday = dateEndFormat.diff(dateInitFormat, 'hours');
        //console.log(hoursWorkedSunday);
        return hoursWorkedSunday;
    }
};

