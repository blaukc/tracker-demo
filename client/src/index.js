import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import Stats from './Stats';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

toast.configure();

const Controller = () => {

    const [isAuth, setAuth] = useState(false)

    useEffect(() => {
        const isStillAuth = async () => {
            //send get request to verify
            const config = {
                method: 'GET',
                headers: { token: localStorage.token }
            }
            const response = await fetch("/auth/verify", config);

            //parse response to get true/false whether user token is still valid
            const parseRes = await response.json()


            //if verified, set auth to true
            //if not set auth to false
            if (parseRes === true) {
                setAuth(true)
            } else {
                setAuth(false)
            }
        }
        isStillAuth()
    }, [])

    return(
        <Router>
            <Switch>
                <Route exact path="/login">
                    {!isAuth ? <Login setAuth={setAuth}/> : <Redirect to="/"/>}
                </Route>
                <Route path="/stats/:type" children={<Stats setAuth={setAuth}/>} />
                <Route exact path="/">
                    {isAuth ? <App setAuth={setAuth}/> : <Redirect to="/login"/>}
                </Route>
                <Route>
                    <Redirect to="/login"/>
                </Route>
            </Switch>
        </Router>
    )
}

ReactDOM.render(
    <Controller />,
    document.getElementById('root')
);
