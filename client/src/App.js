import React, {Fragment, useState} from 'react';
import Tracker from './TrackerComponents/Tracker'
import Input from './TrackerComponents/Input'
import GetList from './TrackerComponents/GetList'
import './css/index.css'
import {states} from './helper/appController'
import {toast} from 'react-toastify'

const App = ({ setAuth }) => {
    const [controller, setController] = useState(states["default"]);

    const logout = () => {
        //setAuth to false
        //remove token from localStorage
        localStorage.removeItem('token');
        setAuth(false);
        toast.success("Logged out successfully!")
    }

    return (
        <Fragment>
            {controller["code-tracker"] ?
            <Tracker
            type={"code"}
            controller={controller}
            setController={setController}
            setAuth={setAuth}/>
            : null}
            {controller["study-tracker"] ?
            <Tracker
            type={"study"}
            controller={controller}
            setController={setController}
            setAuth={setAuth}/>
            : null}
            {controller["exercise-tracker"] ?
            <Tracker
            type={"exercise"}
            controller={controller}
            setController={setController}
            setAuth={setAuth}/>
            : null}


            {controller["code-input"] ?
            <Input type={"code"} setAuth={setAuth}/>
            : null}
            {controller["study-input"] ?
            <Input type={"study"} setAuth={setAuth}/>
            : null}
            {controller["exercise-input"] ?
            <Input type={"exercise"} setAuth={setAuth}/>
            : null}
            
            {controller["code-type-input"] || controller["get-codetype"] ?
            <Input type={"codetype"} controller={controller} setController={setController} setAuth={setAuth}/>
            : null}
            {controller["study-type-input"] || controller["get-studytype"] ?
            <Input type={"studytype"} controller={controller} setController={setController} setAuth={setAuth}/>
            : null}
            {controller["exercise-type-input"] || controller["get-exercisetype"] ?
            <Input type={"exercisetype"} controller={controller} setController={setController} setAuth={setAuth}/>
            : null}


            {controller["get-codetype"] ?
            <GetList type={"codetype"} setAuth={setAuth}/>
            : null}
            {controller["get-studytype"] ?
            <GetList type={"studytype"} setAuth={setAuth}/>
            : null}
            {controller["get-exercisetype"] ?
            <GetList type={"exercisetype"} setAuth={setAuth}/>
            : null}

            <div className="d-flex align-items-center">
                <button className="btn btn-danger my-3 text-center mx-auto" onClick={()=>logout()}>Logout</button>
            </div>
        </Fragment>
    );
}

export const ThemeContext = React.createContext();

const Updater = ({ setAuth }) => {
    const [update, setUpdate] = useState(0);
    return(
        <ThemeContext.Provider value={[update, setUpdate]}>
            <App setAuth={setAuth}/>
        </ThemeContext.Provider>
    )
}

export default Updater;
