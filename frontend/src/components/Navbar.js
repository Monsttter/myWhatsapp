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
    <nav class="navbar bg-dark navbar-expand-lg" style={{ padding: "0", height: "8%", color: "white"}} data-bs-theme="dark">
      <div class="container-fluid">
        <Link class="navbar-brand" to="/">myWhatsApp</Link>
        <button className="btn" style={{backgroundColor: "#626265"}} onClick={handleClick}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
