import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { register } from '../api/auth';

const Register = () => {

    const [credentials, setCredentials]= useState({username: "", profilePhoto:null, email: "", password: ""});
    const [warning, setWarning]= useState("");
    const navigate= useNavigate();

    const handleChange= (e)=>{
        if(e.target.files){
            setCredentials( {...credentials, profilePhoto: e.target.files[0]});
        }
        else{
            const {name, value}= e.target;
            setCredentials({...credentials, [name]: value});
        }
    }
    
    const handleSubmit= async(e)=>{
        e.preventDefault();
        const formData= new FormData();
        for(let key in credentials){
            formData.append(key, credentials[key]);
        }
        // console.log()
        const response= await register(formData);
        const data= await response.json();

        // console.log(data, response.status);
        if(data.success){
            localStorage.setItem("token", data.token);
            navigate("/");
        }
        else{
            if(response.status === 400){
                setWarning("Sorry! a user with this email already exist.");
            }
            else if(response.status === 500){
                console.log("Internal Error Occured")
            }
        }
        setCredentials({username: "", email: "", password: ""});
    }

  return (
    <div className="container" style={{ marginTop: "100px" , color: "white", backgroundColor: "#343a40", width: "500px", borderRadius: "10px"}}>
        <h2 style={{textAlign: "center"}}>Register on myWhatsApp</h2>
        <p style={{color: "red"}}>{warning}</p>
        <form onSubmit={handleSubmit} >
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" required style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="username" value={credentials.username} id="username"/>
            </div>
            <div className="mb-3">
                <label htmlFor="profilePhoto" className="form-label">Profile Photo</label>
                <input type="file" required style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="profilePhoto" id="profilePhoto"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" required style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="email" value={credentials.email} id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" required style={{backgroundColor: "darkgray", border: "none", color:"white"}} className="form-control" onChange={handleChange} name="password" value={credentials.password} id="exampleInputPassword1" />
            </div>
            <button type="submit" style={{width: "100%", backgroundColor: "#626265", color: "white"}} className="btn mb-3">Submit</button>
            <p className="pb-3" style={{textAlign: "center"}}>or <Link to="/login">Login</Link></p>
        </form>
    </div>
  )
}

export default Register;
