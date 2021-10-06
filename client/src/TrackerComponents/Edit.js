import React, { Fragment, useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../App'
import '../css/edit.css'
import { testInput } from '../helper/testInput'
import {toast} from 'react-toastify'



const Edit = ({ type, id, descriptionProp, dateProp, durationProp, typeProp, repsProp, multiplierProp, setAuth }) => {
    //sets original states
    const [description, setDescription] = useState(descriptionProp);
    const [date, setDate] = useState(dateProp);
    const [duration, setDuration] = useState(durationProp);
    const [formActivityType, setFormActivityType] = useState(typeProp)
    const [reps, setReps] = useState(repsProp);
    const [multiplier, setMultiplier] = useState(multiplierProp);
    const [activityType, setActivityTypes] = useState([])

    //when the context is updated, triggers useEffect to cause rerender of component
    const updater = useContext(ThemeContext)[1];
    const update = useContext(ThemeContext)[0];

    const resetForms = () => {
        setDescription(descriptionProp);
        setDate(dateProp);
        setDuration(durationProp);
        setFormActivityType(typeProp);
        setReps(repsProp);
        setMultiplier(multiplierProp);
    }

    //GET all code/study/exercise types
    useEffect(() => {
        const getTypes = async() => {
            try {
                const response = await fetch("/" + type + "type", {
                    method: "GET",
                    headers: {token: localStorage.token}
                });

                if (response.status === 401) {      //if not authorised
                    setAuth(false);
                    const parseRes = await response.json();
                    return toast.error(parseRes)
                }

                const jsonData = await response.json();

                setActivityTypes(jsonData);
            } catch(err) {
                console.error(err.message)
            }
        }
        if (type === "code" || type === "study" || type ==="exercise") getTypes();
    }, [type, update, setAuth])      //triggers rerender when update is updated

    //UPDATE activities on button press
    const updateActivity = async(e) => {
        e.preventDefault();
        try {
            var body;
            if (testInput(type, [description, date, duration, formActivityType, reps, multiplier])) { //tests if inputs are ok
                if (type === "code" || type === "study") {
                    body = {
                        "description": description,
                        "date": date,
                        "duration": duration,
                        "type": formActivityType
                    };
                } else if (type === "exercise"){
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
                } else if (type === "exercisetype") {
                    body = {
                        "type": description,
                        "multiplier": multiplier
                    }
                }
            } else {
                throw new Error('Form submission fail');
            }

            const response = await fetch("/" + type + "/" + id, {
                method: "PUT",
                headers: {"Content-Type": "application/json", "token": localStorage.token},
                body: JSON.stringify(body)
            })

            if (response.status === 401) {      //if not authorised
                setAuth(false);
                const parseRes = await response.json();
                return toast.error(parseRes)
            }

            updater(update + 1);
            toast.success("Activity updated!")
        } catch(err) {
            console.error(err.message)
            //RESET STATES IF ERROR
            resetForms();
        }
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target={"#" + type + id}>Edit</button>

            <div className="modal fade" id={type + id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-bg" data-bs-toggle="modal" data-bs-target={"#" + type + id} onClick={() => resetForms()}></div>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLabel">Edit</h3>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => resetForms()}></button>
                        </div>
                        <form>
                            {/*CODE/STUDY EDIT FORM*/}
                            {type === "code" || type === "study" ?
                            <div className="modal-body">
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
                                    onChange={e => setFormActivityType(e.target.value)}>
                                        <option value="">Choose...</option>
                                        {activityType.map((activity) => (
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
                            </div>
                            : null}

                            {/*EXERCISE EDIT FORM*/}
                            {type === "exercise" ?
                            <div className="modal-body">
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Description</span>
                                    <select className="form-select" id="inputGroupSelect01" required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}>
                                        <option value="">Choose...</option>
                                        {activityType.map((exercise) => (
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
                            </div>
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

                            {/*EXERCISETYPE EDIT FORM*/}
                            {type === "exercisetype" ?
                            <div className="modal-body">
                                <div className="input-group mt-3">
                                    <span className="input-group-text">Description</span>
                                    <input type="text" required
                                    className="form-control"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    ></input>
                                </div>
                                <div className="input-group my-3">
                                    <span className="input-group-text">Multiplier</span>
                                    <input type="number" min="0" step="0.01" required
                                    className="form-control"
                                    value={multiplier}
                                    onChange={e => setMultiplier(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                            : null}

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-warning" data-bs-dismiss="modal" onClick={(e) => updateActivity(e)}>Edit</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => resetForms()}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Edit;
