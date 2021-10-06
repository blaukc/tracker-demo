import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import './css/stats.css'

const Stats = ({setAuth}) => {
    const [stats, setStats] = useState([])

    const { type } = useParams();
    //if id not valid, redirect to login/home
    if (!(type === "code" || type === "study" || type === "exercise")) {
        window.location.href = '/login';
    }

    const highestInArray = (array) => {
        var max, index;
        for (var i = 0; i < array.length; i++) {
            if (i === 0) {
                max = array[i];
                index = i;
            } else {
                if (array[i] > max) {
                    max = array[i];
                    index = i;
                }
            }
        }
        return [max, index];
    }

    const sumArray = (array) => {
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum
    }

    const addToDict = (dict, key, value) => {//
        //intialise key if not in dict
        if (!Object.keys(dict).includes(key)) {
            dict[key] = 0;
        }
        //add value
        dict[key] += value
    }

    useEffect(() => {
        const getAllData = async() => {
            try {
                //GET request to get all data
                const config = {
                    method: "GET",
                    headers: {token: localStorage.token}
                };
                const response = await fetch("/" + type, config);

                if (response.status === 401) {      //if not authorised
                    setAuth(false);
                    const parseRes = await response.json();
                    window.location.href = '/login';
                    return toast.error(parseRes)
                }

                const parseRes = await response.json()
                console.log(parseRes)

                var stats;
                const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                if (type === "code" || type === "study") {
                    //total time spent
                    var total = 0;
                    var monthStats = {};
                    var dayStats = [];
                    var projectStats = {};

                    //SORT ENTRIES INTO LIST
                    for (var i = 0; i < parseRes.length; i++) {
                        total += parseRes[i].duration;
                        dayStats.push(parseRes[i].duration)
                        const entryDate = new Date(parseRes[i].date)

                        //check if monthStats contains the year of each element
                        if (!Object.keys(monthStats).includes(entryDate.getFullYear().toString())) {
                            //initialise month stats for the new year
                            monthStats[entryDate.getFullYear()] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                        //add to duration for each month
                        monthStats[entryDate.getFullYear()][entryDate.getMonth()] += parseRes[i].duration


                        //check if projectStats contains the year of each element
                        if (!Object.keys(projectStats).includes(parseRes[i].type)) {
                            //initialise project stats for new project
                            projectStats[parseRes[i].type] = 0
                        }
                        //add to duration for each month
                        projectStats[parseRes[i].type] += parseRes[i].duration
                    }

                    var valueByYear = [];
                    var valueByMonth = [];
                    for (i = 0; i < Object.keys(monthStats).length; i++) {
                        //adds total for each year into an array valueByYear
                        valueByYear.push(sumArray(Object.values(monthStats)[i]));
                        for (var j = 0; j < Object.values(monthStats)[i].length; j++) {
                            //adds total for each month into an array valueByMonth
                            valueByMonth.push(Object.values(monthStats)[i][j]);
                        }
                    }

                    //calculates the stats after the data sorting
                    const productiveYear = [Object.keys(monthStats)[highestInArray(valueByYear)[1]], highestInArray(valueByYear)[0]];
                    const productiveMonth = [months[highestInArray(valueByMonth)[1] % 12] + ' ' + Object.keys(monthStats)[Math.floor(highestInArray(valueByMonth)[1] / 12)], highestInArray(valueByMonth)[0]];
                    const productiveDay = [new Date(parseRes[highestInArray(dayStats)[1]].date).toDateString(), parseRes[highestInArray(dayStats)[1]].duration];
                    const biggestProject = [Object.keys(projectStats)[highestInArray(Object.values(projectStats))[1]], highestInArray(Object.values(projectStats))[0]];

                    stats = [["Total Time Coding", total, "minutes"],
                             ["Your Most Productive Year", productiveYear[0], productiveYear[1] + " minutes"],
                             ["Your Most Productive Month", productiveMonth[0], productiveMonth[1] + " minutes"],
                             ["Your Most Productive Day", productiveDay[0], productiveDay[1] + " minutes"],
                             ["Your Biggest Project", biggestProject[0], biggestProject[1] + " minutes"]]

                    if (type === "study") {
                        stats[0][0] = "Total Time Studying"
                        stats[4][0] = "Most Studied"
                    }

                    setStats(stats)
                } else if (type === "exercise") {
                    //GET all exercise types
                    const exerciseType = await fetch("/exercisetype", config);
                    const parseExerciseType = await exerciseType.json();
                    //create multiplier dict where keys=exercise type & values=multiplier
                    var multiplierDict = {};
                    for (i = 0; i < parseExerciseType.length; i++) {
                        multiplierDict[parseExerciseType[i]["type"]] = parseExerciseType[i]["multiplier"]
                    }

                    //initalise variables
                    var totalExercise = 0;
                    var totalExerciseByYear = {};
                    var totalExerciseByMonth = {};
                    var totalExerciseByDay = {};
                    var totalExerciseByType = {};
                    var totalExerciseByRun = {};
                    var exerciseDate;


                    //loop through exercises
                    for (i = 0; i < parseRes.length; i++) {
                        totalExercise += parseInt(parseRes[i].reps)

                        exerciseDate = new Date(parseRes[i].date)
                        //add values to each stat dictionary
                        addToDict(totalExerciseByYear, exerciseDate.getFullYear().toString(), parseRes[i].reps * multiplierDict[parseRes[i].type]);
                        addToDict(totalExerciseByMonth, months[exerciseDate.getMonth()] + " " + exerciseDate.getFullYear().toString(), parseRes[i].reps * multiplierDict[parseRes[i].type]);
                        addToDict(totalExerciseByDay, exerciseDate.toDateString(), parseRes[i].reps * multiplierDict[parseRes[i].type]);
                        addToDict(totalExerciseByType, parseRes[i].type, parseRes[i].reps * multiplierDict[parseRes[i].type]);

                        if (parseRes[i].type === "Run") {
                            addToDict(totalExerciseByRun, exerciseDate.toDateString(), parseRes[i].reps * 100 / 100)
                        }
                    }

                    console.log()

                    const productiveYear = Object.keys(totalExerciseByYear)[highestInArray(Object.values(totalExerciseByYear))[1]];
                    const productiveMonth = Object.keys(totalExerciseByMonth)[highestInArray(Object.values(totalExerciseByMonth))[1]];
                    const productiveDay = Object.keys(totalExerciseByDay)[highestInArray(Object.values(totalExerciseByDay))[1]];
                    var favouriteExercise = [Object.keys(totalExerciseByType)[highestInArray(Object.values(totalExerciseByType))[1]]];
                    favouriteExercise.push(Math.round(highestInArray(Object.values(totalExerciseByType))[0] / multiplierDict[favouriteExercise[0]]));
                    const longestRun = [highestInArray(Object.values(totalExerciseByRun))[0], Object.keys(totalExerciseByRun)[highestInArray(Object.values(totalExerciseByRun))[1]]]

                    stats = [["Total Reps", totalExercise, " "],
                             ["Your Most Productive Year", productiveYear],
                             ["Your Most Productive Month", productiveMonth],
                             ["Your Most Productive Day", productiveDay],
                             ["Your Favourite Exercise", favouriteExercise[0], favouriteExercise[1] + " reps"],
                             ["Your Longest Run", longestRun[0] + " km", longestRun[1]]]
                    setStats(stats)
                }

            } catch(err) {
                console.error(err.message)
            }
        }
        getAllData()
    }, [type, setAuth])

    //total time spent
    //most productive year
    //most productive month
    //longest project

    //total reps
    //most productive year
    //most productive month
    //highest reps exercise


    return(
        <Fragment>
            <h1 className="text-center mt-5">
                <span id={type + "-title"}
                onClick={() => window.location.href = '/'}>
                    {type[0].toUpperCase() + type.substring(1)} Stats
                </span>
            </h1>

            <div className="container stats-container d-flex justify-content-center align-content-between flex-wrap">
                {stats.map((stat) => (
                    <div className="stats my-4 mx-4" key={stat[0]}>
                        <p className="stats-content-title mt-3">{stat[0]}</p>
                        <p className={"stats-content-" + type + " mt-4"}>{stat[1]}</p>
                        <p className="stats-content-footer mt-4">{stat[2]}</p>
                    </div>
                ))}
            </div>
        </Fragment>
    )
}

export default Stats;
