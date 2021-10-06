//GET DDMMYYYY FROM DATE OBJECT
export const ddmmyyyy = (date, slash) => {
    var day = date.getDate()
    day < 10 ? day = '0' + day.toString() : day.toString()
    var month = date.getMonth() + 1
    month < 10 ? month = '0' + month.toString() : month.toString()
    if (slash) {
        return day + '/' + month + '/' + date.getFullYear()
    } else {
        return day + month + date.getFullYear()
    }
}

//GET YYYYMMDD FROM DATE OBJECT
export const yyyymmdd = (date, dash) => {
    var day = date.getDate()
    day < 10 ? day = '0' + day.toString() : day.toString()
    var month = date.getMonth() + 1
    month < 10 ? month = '0' + month.toString() : month.toString()
    if (dash) {
        return date.getFullYear() + '-' + month + '-' + day
    } else {
        return date.getFullYear() + month + day
    }
}

//GET DATE OBJECT FROM DAY NUMBER OF A YEAR
export const dateFromDay = (year, day) => {
    var date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
}

//GET DAY NUMBER FROM DATE OBJECT OF A YEAR
export const dayFromDate = (year, date) => {
    var start = new Date(year, 0); // initialize a date in `year-01-01`
    var diff = date - start;
    var day = Math.floor(diff / (1000 * 60 * 60 * 24));
    return(day);
}

//NUMBER OF YEARS IN DAY/IS IT LEAP YEAR?
export const daysInYear = (year) => {
    if (year % 4 === 0) {
        return(366);
    } else {
        return(365);
    }
}
