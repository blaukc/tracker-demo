import React, {Fragment, useEffect, useState, useContext} from 'react';
import { Link } from "react-router-dom";
import { ThemeContext } from '../App'
import '../css/tracker.css'
import {states} from '../helper/appController'
import GetList from './GetList'
import { ddmmyyyy, dateFromDay, dayFromDate, daysInYear } from '../helper/common'
import {toast} from 'react-toastify'

const Tracker = ({ type, controller, setController, setAuth }) => {

    //sets original states
    const [date, setDate] = useState()
    const [year, setYear] = useState(new Date().getFullYear())
    const [dbData, setData] = useState({
        "data": null,
        "multiplier": null,
        "relevantYears": []         //list of relevant years
    });

    //when the context is updated, triggers useEffect to cause rerender of component
    const updater = useContext(ThemeContext)[1];
    const update = useContext(ThemeContext)[0];
    const { data, multiplier, relevantYears } = dbData

    useEffect(() => {
    //GET ALL DATA
        const getTracker = async() => {
            try {
                const response = await fetch("/" + type, {
                    method: "GET",
                    headers: {token: localStorage.token}
                });

                if (response.status === 401) {      //if not authorised
                    setAuth(false);
                    const parseRes = await response.json();
                    return toast.error(parseRes)
                }

                var jsonData = await response.json();

                if (type === "exercise") {
                    const exerciseType = await fetch("/exercisetype", {
                        method: "GET",
                        headers: {token: localStorage.token}
                    });
                    var exerciseTypeData = await exerciseType.json();
                    var multiplierDict = {};
                    for (var i = 0; i < exerciseTypeData.length; i++) {
                        multiplierDict[exerciseTypeData[i]["type"]] = exerciseTypeData[i]["multiplier"]
                    }
                }

                var relevantYearsTmp = [];
                for (i = 0; i < jsonData.length; i++) {
                    jsonData[i].date = new Date(jsonData[i].date);   //convert SQL date to date object
                    if (!relevantYearsTmp.includes(jsonData[i].date.getFullYear())) {
                        relevantYearsTmp.push(jsonData[i].date.getFullYear());
                    }
                }

                //console.log(jsonData)
                setData({ data: jsonData, multiplier: multiplierDict, relevantYears: relevantYearsTmp});   //set multiple states
            } catch(err) {
                console.error(err.message)
            }
        }
        getTracker();
    }, [type, update, setAuth])      //triggers rerender when update is updated


    //GET THE POSITION FOR EACH DAY
    const dayDetails = (year, day_counter, first_day) => {
        var details = {};
        details["date"] = dateFromDay(year, day_counter);
        details["day"] = day_counter;

        //GETTING X & Y COORDS
        //(firstday -1 + daycounter) % 7 = row
        //((firstday -1 + daycounter) / 7)floor = column
        var row = (first_day.getDay() - 1 + day_counter) % 7 + 1;
        var column = Math.floor((first_day.getDay() - 1 + day_counter) / 7);
        details["x"] = (column * 17 + 25).toString() + "px";
        details["y"] = (row * 17).toString() + "px";

        //SET DATALEVEL, ACTIVITIES AND DURATION TO 0
        details["data_level"] = 0;
        details["activities"] = 0;
        details["duration"] = 0;

        return(details);
    }

    //CHOOSE DATA LEVEL BASED ON TYPE
    const getDataLevel = (tracker_day, data_day) => {
        if (type === "code" || type === "study") {          //separate between code, study & exercise
            tracker_day["duration"] += data_day.duration;  //add duration for each day

            if (tracker_day["duration"] <= 60) {          //set data level based on total duration
                tracker_day["data_level"] = 1;
            } else if (tracker_day["duration"] <= 120) {
                tracker_day["data_level"] = 2;
            } else if (tracker_day["duration"] <= 240) {
                tracker_day["data_level"] = 3;
            } else {
                tracker_day["data_level"] = 4;
            }
        } else if (type === "exercise") {
            if (data_day.duration) {
                tracker_day["duration"] += data_day.reps * data_day.duration * multiplier[data_day.type];
            } else {
                tracker_day["duration"] += data_day.reps * multiplier[data_day.type];
            }
            if (tracker_day["duration"] <= 30) {          //set data level based on total duration
                tracker_day["data_level"] = 1;
            } else if (tracker_day["duration"] <= 60) {
                tracker_day["data_level"] = 2;
            } else if (tracker_day["duration"] <= 90) {
                tracker_day["data_level"] = 3;
            } else {
                tracker_day["data_level"] = 4;
            }
        }
        //INCREMENT ACTIVITIES BY 1
        tracker_day["activities"] += 1;
    }

    //SET DATA LEVEL
    const setDataLevel = (year, all_days) => {
        if (data) {
            const first_day = new Date(year, 0, 1);
            for (var i = 0; i < data.length; i++) {
                if (data[i].date.getFullYear() === year) {
                    var day_counter = dayFromDate(year, data[i].date)       //get row and column from day number
                    var row = (first_day.getDay() + day_counter) % 7;
                    var column = Math.floor((first_day.getDay() + day_counter) / 7);
                    // if column = 0 (first week of the year), use different method to get the row number as there may not be 7 days
                    const day = column === 0 ? all_days[column][row - 7 + all_days[column].length] : all_days[column][row]
                    getDataLevel(day, data[i])
                }
            }
        }
    }

    //TO LIST OUT ALL THE DAYS & THEIR POSITIONS INTO AN ARRAY
    const listYear = (year) => {
        var all_days = [];
        const first_day = new Date(year, 0, 1);
        var week = [];
        var day_counter = 1;

        //FIRST WEEK
        for (var i = 0; i <= 6; i++) {
            if (i >= first_day.getDay()) {
                week.push(dayDetails(year, day_counter, first_day));
                day_counter++;
            }
        }
        all_days.push(week);

        //SUBSEQUENT WEEKS
        week = [];
        for (;day_counter <= daysInYear(year); day_counter++) {
            week.push(dayDetails(year, day_counter, first_day));
            if (week.length === 7) {                //adds week to days array when week is filled
                all_days.push(week);
                week = [];
                continue;                           //in case last week ends on saturday, prevents double count
            }
            if (day_counter === daysInYear(year)) { //adds last week to days if incomplete
                all_days.push(week);
            }
        }

        //SET DATA LEVEL, ACTIVTIES, DURATION
        setDataLevel(year, all_days);
        return(all_days);
    }

    //TO ALIGN THE MONTHS TEXT TO THE CALENDAR
    const getMonths = (year) => {
        const first_day = new Date(year, 0, 1);
        var months = [{"month": "Jan", "days": 31, "x": "25px"}, {"month": "Feb", "days": 28}, {"month": "Mar", "days": 31}, {"month": "Apr", "days": 30},
                      {"month": "May", "days": 31}, {"month": "Jun", "days": 30}, {"month": "Jul", "days": 31}, {"month": "Aug", "days": 31},
                      {"month": "Sep", "days": 30}, {"month": "Oct", "days": 31}, {"month": "Nov", "days": 30}, {"month": "Dec", "days": 31}]

        var day_count = 0, column;
        for (var i = 0; i < months.length - 1; i++) {
            day_count += months[i].days;
            if (daysInYear(year) === 366 && i !== 0) {
                column = Math.floor((first_day.getDay() + day_count + 1) / 7);
            } else {
                column = Math.floor((first_day.getDay() + day_count) / 7);
            }

            months[i+1]["x"] = (column * 17 + 25).toString() + "px";
        }

        return(months)
    }

    return (
        <Fragment>
            <h1 className="text-center mt-5">
                <span id={type + "-title"}
                onClick={() => {
                    controller !== states[type] ? setController(states[type]) : setController(states["default"]);
                    updater(update + 1)
                }}>
                    {type[0].toUpperCase() + type.substring(1)}
                </span>
            </h1>


            <div className="container text-center">
                <div className="tracker-header d-flex justify-content-center">{/*justify-content-between*/}
                    {/*<div className="tracker-header-spacer"></div>*/}
                    <button id={type + "Dropdown"} className="btn btn-sm btn-secondary dropdown-toggle yearDropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">{year}</button>
                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby={type + "Dropdown"}>
                        {relevantYears.map((relevantYear) => (
                            <li key={relevantYear}>
                                <span
                                className="dropdown-item"
                                onClick={() => setYear(relevantYear)}
                                >{relevantYear}</span>
                            </li>
                        ))}
                    </ul>
                    {/*<Link to={"/stats/" + type} style={{ textDecoration: 'none' }}><span className="tracker-header-stats">View Stats</span></Link>*/}
                </div>
            </div>


            <div className="container overflow-auto mb-3" id={type}>
                <svg className="d-block mx-auto">
                    <g>
                        <text className="day-text" y="28px">Sun</text>
                        <text className="day-text" y="45px">Mon</text>
                        <text className="day-text" y="62px">Tue</text>
                        <text className="day-text" y="79px">Wed</text>
                        <text className="day-text" y="96px">Thu</text>
                        <text className="day-text" y="113px">Fri</text>
                        <text className="day-text" y="130px">Sat</text>
                    </g>
                    <g>
                        {getMonths(year).map((month) => (
                            <text className="month-text" key={month.month} x={month.x} y="13px">{month.month}</text>
                        ))}
                    </g>
                    <g>
                        {listYear(year).map((column) => (
                            <g key={column[0].day}>
                                {column.map((day) => (
                                    <rect className="day"
                                    key={day.day}
                                    x={day.x} y={day.y}
                                    data-level={day.data_level}
                                    onClick={() => {
                                        if (day.activities > 0) {
                                            setController(states[type + "one"]);
                                            setDate(ddmmyyyy(day.date, false));
                                        }
                                    }}>
                                        <title>{ddmmyyy(day.date, true) +
                                        "\n" + day.activities.toString() +
                                        (day.activities === 1 ? " activity" : " activities") +
                                        (type !== "exercise" && day.activities > 0 ? "\n" + day.duration.toString() + " minutes" : "\n")
                                        }</title>
                                    </rect>
                                ))}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
            {controller["get-list"] ?
            <GetList
            type={type}
            date={date}
            setAuth={setAuth}/> :
            null}
        </Fragment>
    )
}
export default Tracker;
