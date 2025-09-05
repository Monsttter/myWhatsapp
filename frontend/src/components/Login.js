import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';

const Login = () => {

    const [credentials, setCredentials]= useState({email: "", password: ""});
    const [warning, setWarning]= useState("");
    const navigate= useNavigate();

    const handleChange= (e)=>{
        const {name, value}= e.target;
        setCredentials({...credentials, [name]: value});
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const response= await fetch("https://mywhatsapp-ymha.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const data= await response.json();

        // console.log(data);
        if(data.success){
            localStorage.setItem("token", data.token);
            navigate("/");
        }
        else{
            if(response.status === 400){
                if(data.errorType === "email"){
                    setWarning("User with this email doesn't exist");
                }
                else if(data.errorType === "password"){
                    setWarning("Please login with correct credentials")
                }
            }
            else if(response.status === 500){
                console.log("Internal Error Occured")
            }
        }
        setCredentials({email: "", password: ""});
    }

  return (
    <div className="container" style={{ marginTop: "100px" , color: "white", backgroundColor: "#343a40", width: "500px", borderRadius: "10px"}}>
    <h2 style={{textAlign: "center"}}>Login to myWhatsApp</h2>
    <p style={{color: "red"}}>{warning}</p>
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="email" value={credentials.email} id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="mb-5">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="password" value={credentials.password} id="exampleInputPassword1" />
        </div>
        <button type="submit" className="btn mb-1" style={{width: "100%", backgroundColor: "#626265", color: "white"}}>Submit</button>
        <p className="pb-3" style={{textAlign: "center"}}>or <Link to="/register">Register</Link></p>
    </form>
    </div>
  )
}

export default Login;
