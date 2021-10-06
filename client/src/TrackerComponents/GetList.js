import React, { Fragment, useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../App'
import Edit from './Edit'
import '../css/getlist.css'
import { ddmmyyyy, yyyymmdd } from '../helper/common'
import {toast} from 'react-toastify'

const GetList = ({ type, date, setAuth }) => {
    const update = useContext(ThemeContext)[0];     //when the context is updated, triggers useEffect to cause rerender of component
    const updater = useContext(ThemeContext)[1];
    const [activities, setActivities] = useState([])

    //DELETE ACTIVITY on click
    const deleteActivity = async(id) => {
        try {
            const response = await fetch("/" + type + "/" + id, {  //DELETE
                method: "DELETE",
                headers: { token: localStorage.token }
            })

            if (response.status === 401) {      //if not authorised
                setAuth(false);
                const parseRes = await response.json();
                return toast.error(parseRes)
            }

            updater(update + 1);
            toast.success("Activity deleted!")
        } catch(err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
    //GET ALL DATA
        const getDateActivities = async() => {
            try {
                var jsonData;
                const config = {
                    method: "GET",
                    headers: {token: localStorage.token}
                }
                var response;
                if (type === "code" || type === "study" || type === "exercise") {      //fetch activity for that date
                    response = await fetch("/" + type + "/date/" + date, config);
                } else {                            //fetch exercisetype list
                    response = await fetch("/" + type, config);
                }

                if (response.status === 401) {      //if not authorised
                    setAuth(false);
                    const parseRes = await response.json();
                    return toast.error(parseRes)
                }

                jsonData = await response.json();

                if (type === "exercise") {              //format reps decimal to int
                    for (var i = 0; i < jsonData.length; i++) {
                        var reps = jsonData[i].reps.toString();

                        if (reps.slice(-2) === "00") {  //if reps is an int, remove decimal point
                            reps = reps.split(".")[0]
                        } else {                        //else remove all trailing 0s
                            while (reps[reps.length-1] === '0') {
                                reps = reps.slice(0, -1);
                            }
                        }
                        jsonData[i]["reps"] = reps;
                    }
                }

                setActivities(jsonData);
            } catch(err) {
                console.error(err.message);
            }
        }
        getDateActivities();
    }, [type, date, update, setAuth])      //triggers rerender when update is updated

    return(
        <Fragment>
            <h1 className="text-center mt-5">
                <span>{type === "codetype" ? "Projects" : type === "studytype" ? "Subjects" : type === "exercisetype" ? "Exercises" : "Activities"}</span>
            </h1>
            <div className="col-10 mx-auto" id="table-div">
                <table className="table" id="table">

                    {/*GET LIST FOR CODE/STUDY*/}
                    { type === "code" || type === "study" ?
                        <Fragment>
                            <thead>
                                <tr>
                                    <th className="col-1">Date</th>
                                    <th className="col-7">Activity</th>
                                    <th className="col-1">{type === "code" ? "Project" : "Subject"}</th>
                                    <th className="col-1">Duration</th>
                                    <th className="col-1"></th>
                                    <th className="col-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity[type + "_id"]}>
                                        <td>{ddmmyyyy(new Date(activity.date), true)}</td>
                                        <td>{activity.description}</td>
                                        <td>{activity.type}</td>
                                        <td>{activity.duration}</td>
                                        <td>
                                            <Edit
                                            type={type}
                                            id={activity[type + "_id"]}
                                            descriptionProp={activity.description}
                                            dateProp={yyyymmdd(new Date(activity.date), true)}
                                            durationProp={activity.duration}
                                            typeProp={activity.type}
                                            setAuth={setAuth}/>
                                        </td>
                                        <td>
                                            <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteActivity(activity[type + "_id"])}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Fragment>
                    : null}

                    {/*GET LIST FOR EXERCISE*/}
                    { type === "exercise" ?
                        <Fragment>
                            <thead>
                                <tr>
                                    <th className="col-1">Date</th>
                                    <th className="col-5">Activity</th>
                                    <th className="col-2">Reps</th>
                                    <th className="col-2">Duration</th>
                                    <th className="col-1"></th>
                                    <th className="col-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity[type + "_id"]}>
                                        <td>{ddmmyyyy(new Date(activity.date), true)}</td>
                                        <td>{activity.type}</td>
                                        <td>{activity.reps}</td>
                                        <td>{activity.duration}</td>
                                        <td>
                                            <Edit
                                            type={type}
                                            id={activity[type + "_id"]}
                                            descriptionProp={activity.type}
                                            dateProp={yyyymmdd(new Date(activity.date), true)}
                                            repsProp={activity.reps}
                                            durationProp={activity.duration === null ? "" : activity.duration}/>
                                        </td>
                                        <td>
                                            <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteActivity(activity[type + "_id"])}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Fragment>
                    : null}

                    {/*GET LIST FOR CODETYPE/STUDYTYPE*/}
                    { type === "codetype" || type === "studytype" ?
                        <Fragment>
                            <thead>
                                <tr>
                                    <th className="col-10">Exercise</th>
                                    <th className="col-1"></th>
                                    <th className="col-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity[type + "_id"]}>
                                        <td>{activity.type}</td>
                                        <td>
                                        <Edit
                                        type={type}
                                        id={activity[type + "_id"]}
                                        descriptionProp={activity.type}
                                        multiplierProp={activity.multiplier}
                                        setAuth={setAuth}/>
                                        </td>
                                        <td>
                                            <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteActivity(activity[type + "_id"])}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Fragment>
                    : null}

                    {/*GET LIST FOR EXERCISETYPE*/}
                    { type === "exercisetype" ?
                        <Fragment>
                            <thead>
                                <tr>
                                    <th className="col-8">Exercise</th>
                                    <th className="col-2">Multiplier</th>
                                    <th className="col-1"></th>
                                    <th className="col-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity[type + "_id"]}>
                                        <td>{activity.type}</td>
                                        <td>{activity.multiplier}</td>
                                        <td>
                                        <Edit
                                        type={type}
                                        id={activity[type + "_id"]}
                                        descriptionProp={activity.type}
                                        multiplierProp={activity.multiplier}
                                        setAuth={setAuth}/>
                                        </td>
                                        <td>
                                            <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteActivity(activity[type + "_id"])}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Fragment>
                    : null}

                </table>
            </div>
        </Fragment>
    );
}

export default GetList;
