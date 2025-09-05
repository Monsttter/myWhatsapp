import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import { SocketContext } from '../context/socketContext';

const Navbar = () => {

  const navigate= useNavigate();
  const socket = useContext(SocketContext);

  const handleClick= ()=>{
    localStorage.removeItem("token");
    socket.removeAllListeners();
    socket.disconnect();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg" style={{height: "8vh", color: "white", backgroundColor: "#212529"}}>
  <div className="container-fluid">
    <Link className="navbar-brand" to="/" style={{color: "white"}}><h2> myWhatsApp</h2></Link>
    <button className="btn" style={{backgroundColor: "#626265"}} onClick={handleClick}>Logout</button>
  </div>
</nav>
  )
}

export default Navbar
