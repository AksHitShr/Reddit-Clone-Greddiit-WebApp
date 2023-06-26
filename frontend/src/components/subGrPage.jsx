import React, { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import img from "./images/icons8-gatsbyjs-48.png";
import axios from "axios";
import Loader from "./Loader";

function SubGrPage(){
    const navigate=useNavigate();
    const [showdt,setdt]=useState(false);
    const [sgdt,setsgdt]=useState({});
    const [loader,setloader]=useState(false);

    const params=useParams();
    const subgname=params.name;
    useEffect(()=>{
      axios
      .post("http://localhost:3500/api/getSgData", {jwt:localStorage.getItem("mytoken"), sgname: subgname })
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const x=res.data.sg;
        setsgdt(x);
        const usrdet=res.data.usr;
        const modarr=res.data.sg.Moderators;
        const hasValue = modarr.some(obj => Object.values(obj).includes(usrdet.Email));
        if(!hasValue){
          navigate("/home");
        }else{
          setdt(true);
        }
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
    },[]);
    
    return (loader?(showdt&&
    (<div>
        <nav class="navbar navbar-expand-lg navbar-light bg-warning">
          <img
            src={img}
            width="30"
            height="30"
            className="d-inline-block align-top navlogo"
            alt=""
          />
          <a class="navbar-brand" href="/home">
            Greddiit
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-success btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home/"+params.name+"/Users");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"Users   "}
                  <i class="fa-solid fa-users"></i>
                </button>
                </li>
                <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-dark btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home/"+params.name+"/JoinReq");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"Join Requests  "}
                  <i class="fa-solid fa-handshake"></i>
                </button>
                </li>
                <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-dark btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home/"+params.name+"/Stats");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"Stats   "}
                  <i class="fa-solid fa-chart-simple"></i>
                </button>
                </li>
                <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-dark btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home/"+params.name+"/Reports");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"Reported Posts   "}
                  <i class="fa-solid fa-ban"></i>
                </button>
                </li>
                {/* for my sub greddiit */}
                <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-info btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"Back   "}
                  <i class="fa-solid fa-backward"></i>
                </button>
                </li>
                <li class="nav-item">
                <button
                  type="submit"
                  className="btn btn-success btn-block mb-4 subut"
                  onClick={() => {
                    window.localStorage.removeItem("mytoken");
                    navigate("/");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  <i class="fa-solid fa-right-from-bracket"></i>
                </button>
                </li>
            </ul>
          </div>
        </nav>
        <div className="note" style={{width:"100%",textAlign:"center",backgroundColor:"#2B3467"}}><h1 style={{color:"#FFB84C",fontFamily:"'Caveat', cursive",fontSize:"3rem"}}>{"Welcome to SubGreddiit   :    "+sgdt.Name}</h1></div>
        </div>)):<Loader />)
};

export default SubGrPage;