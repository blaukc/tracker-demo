import React, { Fragment, useState, useEffect, useContext } from 'react';
import '../css/input.css'
import {testInput} from '../helper/testInput'
import { ThemeContext } from '../App'
import {states} from '../helper/appController'
import {toast} from 'react-toastify'

const Input = ({ type, controller, setController, setAuth }) => {
    //sets original states
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [reps, setReps] = useState("");
    const [activityTypes, setActivityTypes] = useState([]);
    const [formActivityType, setFormActivityTypes] = useState("");
    const [multiplier, setMultiplier] = useState("");

    //when the context is updated, triggers useEffect to cause rerender of component
    const updater = useContext(ThemeContext)[1];
    const update = useContext(ThemeContext)[0];

    //ADDING ACTIVITIES on button click
    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            var body;
            if (testInput(type, [description, date, duration, reps, multiplier, formActivityType])) { //tests if form submission is correct
                if (type === "code" || type === "study") {  //changes jsondata for POST req to required format based on db
                    body = {
                        "description": description,
                        "date": date,
                        "duration": duration,
                        "type": formActivityType
                    };
                } else if (type === "exercise") {
                    if (duration === "0" || duration === "") {
                        body = {
                            "type": description,
                            "date": date,
                            "reps": reps,
                            "duration": null
                        }
                    } else {
                        body = {
                            "type": description,
                            "date": date,
                            "reps": reps,
                            "duration": duration
                        }
                    }
                } else if (type === "codetype" || type === "studytype"){
                    body = {
                        "type": description
                    }
                } else if (type === "exercisetype"){
                    body = {
                        "type": description,
                        "multiplier": multiplier
                    }
                }
            } else {
                throw new Error('Form submission fail');
            }

            const response = await fetch("/" + type, {  //POST req
                method: "POST",
                headers: {"Content-Type": "application/json", "token": localStorage.token},
                body: JSON.stringify(body)
            })

            if (response.status === 401) {      //if not authorised
                setAuth(false);
                const parseRes = await response.json();
                return toast.error(parseRes)
            }

            updater(update+1);  //updates context to rerender Tracker component
            toast.success("Activity added!")
            //clears the form
            setDescription("");
            setDate("");
            setDuration("");
            setReps("");
            setMultiplier("");
            setFormActivityTypes("");
            //window.location="/";
        } catch(err) {
            console.error(err.message);
        }
    }

    //GETTING EXERCISE TYPES
    useEffect(() => {
        const getTypes = async() => {
            try {
                const response = await fetch("/" + type + "type", {
                    method: "GET",
                    headers: {token: localStorage.token}
                });

                if (response.status === 401) {      //if not authorised
                    setAuth(false)
                    const parseRes = await response.json();
                    return toast.error(parseRes)
                }

                const jsonData = await response.json();

                setActivityTypes(jsonData);
            } catch(err) {
                console.error(err.message)
            }
        }
        if (type === "code" || type === "study" || type === "exercise") getTypes();
    }, [type, update, setAuth])      //triggers rerender when update is updated

    return (
        <Fragment>
            <h1 className="text-center mt-5">
                { type === "code" || type === "study" || type === "exercise" ?
                <span>Add Activity</span> :
                type === "codetype" ?
                <span>Add
                    <span
                    id="code-type-title"
                    onClick={() => controller !== states["codetype"] ? setController(states["codetype"]) : setController(states["code"])}
                    > Code Type
                    </span>
                </span>:
                type === "studytype" ?
                <span>Add
                    <span
                    id="study-type-title"
                    onClick={() => controller !== states["studytype"] ? setController(states["studytype"]) : setController(states["study"])}
                    > Study Type
                    </span>
                </span>:
                <span>Add
                    <span
                    id="exercise-type-title"
                    onClick={() => controller !== states["exercisetype"] ? setController(states["exercisetype"]) : setController(states["exercise"])}
                    > Exercise Type
                    </span>
                </span>
                }
            </h1>


            <form className="container">
                {/*NON-EXERCISE TYPE INPUT*/}
                { type === "code" || type === "study" ?
                <Fragment>
                    <div className="input-group mt-3">
                        <span className="input-group-text">Description</span>
                        <input type="text" required
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        ></input>
                    </div>

                    <div className="input-group my-3">
                        <span className="input-group-text">{type === "code" ? "Project" : "Subject"}</span>
                        <select className="form-select" id="inputGroupSelect01" required
                        value={formActivityType}
                        onChange={e => setFormActivityTypes(e.target.value)}>
                            <option value="">Choose...</option>
                            {activityTypes.map((activity) => (
                                <option
                                key={activity[type + "type_id"]}
                                value={activity.type}>
                                {activity.type}
                                </option>
                            ))}
                        </select>
                        <span className="input-group-text">Duration</span>
                        <input type="number" min="0" required
                        className="form-control"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        ></input>
                        <span className="input-group-text">Date</span>
                        <input type="date"
                        className="form-control"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        ></input>
                    </div>
                </Fragment>
                : null}

                {/*EXERCISE TYPE INPUT*/}
                { type === "exercise" ?
                <Fragment>
                    <div className="input-group mt-3">
                        <span className="input-group-text">Description</span>
                        <select className="form-select" id="inputGroupSelect01" required
                        value={description}
                        onChange={e => setDescription(e.target.value)}>
                            <option value="">Choose...</option>
                            {activityTypes.map((exercise) => (
                                <option
                                key={exercise.exercisetype_id}
                                value={exercise.type}>
                                {exercise.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group my-3">
                        <span className="input-group-text">Reps</span>
                        <input type="number" min="0" required
                        className="form-control"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        ></input>
                        <span className="input-group-text">Duration</span>
                        <input type="number" min="0"
                        className="form-control"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        ></input>
                        <span className="input-group-text">Date</span>
                        <input type="date" required
                        className="form-control"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        ></input>
                    </div>
                </Fragment>
                : null}

                {/*ADD CODE/STUDY TYPE*/}
                { type === "codetype" || type === "studytype" ?
                <Fragment>
                    <div className="input-group my-3">
                        <span className="input-group-text">{type === "codetype" ? "Project" : "Subject"}</span>
                        <input type="text" required
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        ></input>
                    </div>
                </Fragment>
                : null}

                {/*ADD EXERCISE TYPE*/}
                { type === "exercisetype" ?
                <Fragment>
                    <div className="input-group my-3">
                        <span className="input-group-text">Exercise</span>
                        <input type="text" required
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        ></input>
                        <span className="input-group-text">Multiplier</span>
                        <input type="number" min="0" step="0.01" required
                        className="form-control"
                        value={multiplier}
                        onChange={e => setMultiplier(e.target.value)}
                        ></input>
                    </div>
                </Fragment>
                : null}

                {/*ADD BUTTON*/}
                <div className="d-grid gap-2 col-4 mx-auto mb-3">
                    <button className="btn btn-success" type="submit"
                    onClick={onSubmitForm}>Add</button>
                </div>
            </form>
        </Fragment>
    )
}

export default Input;
