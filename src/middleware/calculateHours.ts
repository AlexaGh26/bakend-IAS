const fs = require('fs');
const moment = require('moment');
const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
import { servInformationModel } from '../models/servInformation';

export const calculateHours = {
    calculate: (historyTechnical: any) => {
        console.log('entro a calculate');
        const totalHoursDay = calculateHours.totalHours(historyTechnical);
        const totalHoursExtraNight = calculateHours.calHoursExtraNight(historyTechnical);
        return totalHoursDay;
    },
    totalHours: (historyTechnical: any) => {
        console.log('entro a calcular total');
        return historyTechnical.map((registry :any) => {
            const {  dateInit, dateEnd } = registry
            const dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            const dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');  
            const hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        })
    },
     calHoursExtraNight: (historyTechnical:any) => {
         console.log('entro a calHoursExtra nocturnas');

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
             //console.log(dateEndFormat.isAfter(hourLimitInit))
             console.log(dateInitFormat.isBefore(hourLimitEnd));
             
             
            })
         }

};

