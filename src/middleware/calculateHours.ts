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

            if (hoursAfter) {
                const totalDiff = dateEndFormat.diff(hourLimitInit, 'hours')
                const minuteDiff = (dateEndFormat.diff(hourLimitInit, 'minutes') - (totalDiff * 60))
                //console.log(totalDiff, minuteDiff);
            }
            if (hourBefore) {
                const totalDiff = dateInitFormat.diff(hourLimitEnd, 'hours')
                const minuteDiff = (dateInitFormat.diff(hourLimitEnd, 'minutes') - (totalDiff * 60))
                console.log(totalDiff, minuteDiff);
            }
        })
    }

};

