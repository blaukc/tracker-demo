import React, { Fragment, useState } from 'react';
import {toast} from 'react-toastify'

const Login = ({ setAuth }) => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    const login = async (e) => {
        e.preventDefault();
        try {
            //send login info to server
            const body = {
                name: name,
                password: password
            }
            const config = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }
            const response = await fetch("/auth/login", config);

            //parse json response
            const parseRes = await response.json()

            //if login success, store token in local storage, setAuth to true
            //else setAuth to false
            if (response.ok) {
                localStorage.setItem('token', parseRes.token);
                setAuth(true);
                toast.success("Logged in successfully!")
            } else {
                setAuth(false);
                toast.error(parseRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>
            <div className="d-flex flex-column justify-content-center align-items-center" id="loginContainer">
                <form className="d-flex flex-column justify-content-center align-items-center">
                    <h3 className=""><span>Login</span></h3>
                    <input type="text"
                    className="form-control mt-3"
                    placeholder="Name"
                    aria-label="Name"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}/>

                    <input type="password"
                    className="form-control my-3"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}/>

                    <button type="submit" className="btn btn-success mb-3" onClick={(e)=>login(e)}>Login</button>
                </form>
            </div>
    </Fragment>
    )
}

export default Login;
