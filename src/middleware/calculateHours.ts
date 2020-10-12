const fs = require('fs');
const moment = require('moment');
const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
import { servInformationModel } from '../models/servInformation';

export const calculateHours = {
    calculate: (historyTechnical: any) => {

        const totalHoursDay = calculateHours.totalHours(historyTechnical);
        const totalHoursExtraNight = calculateHours.HoursExtraNight(historyTechnical);
        return totalHoursDay;
    },

    totalHours: (historyTechnical: any) => {

        return historyTechnical.map((registry: any) => {
            const { dateInit, dateEnd } = registry
            const dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            const dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');
            const hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        })
    },

    HoursExtraNight: (historyTechnical: any) => {
        return historyTechnical.map((registry: any) => {
            const { dateInit, dateEnd } = registry

            const dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            const dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');

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
            const hoursAfter = dateEndFormat.isAfter(hourLimitInit);
            const hourBefore = dateInitFormat.isBefore(hourLimitEnd);

            let totalDiffHoursAfter = 0;
            let totalDifMinutesAfter = 0;
            let totalDiffHoursBefore = 0;
            let totalDifMinutesBefore = 0;

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
                : ((dateInitFormat.diff(hourLimitEnd, 'minutes')- (totalDiffHoursBefore * 60)));

            }
            let totalHours = totalDiffHoursAfter + totalDiffHoursBefore;
            let totalMinutes = totalDifMinutesAfter + totalDifMinutesBefore;
            console.log(totalHours,totalMinutes );
            
        })
    }

};

