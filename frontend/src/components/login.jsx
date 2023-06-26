import React, { useEffect, useState } from "react";
import axios from "axios";
import "./loginPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import img from "./images/icons8-gatsbyjs-48.png";

function Login(props) {
  const navigate = useNavigate();
  const location=useLocation();

  useEffect(()=>{
    if(!window.localStorage.getItem("mytoken")&&location.pathname==="/home"){
      navigate("/");
    }else if (window.localStorage.getItem("mytoken")){
      navigate("/home");
    }
  },[]);

  const [user, setUser] = useState({
    Uname: "",
    pass: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prev)=>{return {
      ...prev,
      [name]: value,
    }});
  }

  function handleReg(event) {
    event.preventDefault();
    const { Uname, pass } = user;

    if (Uname && pass) {
      axios
        .post("http://localhost:3500/api/login", user)
        .then((res) => {
          alert(res.data.message);
          const mytok = res.data.token;
          if (mytok) {
            props.changeusr({ jwt: mytok });
            window.localStorage.setItem("mytoken", mytok);
          }
          if(res.data.c===1){
            navigate("/home");
          }
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert("Empty Field is invalid!");
    }
  }

  return (
    <div>
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
            className="btn btn-info btn-block mb-4"
            onClick={() => {
              props.butfunc(true);
            }}
            style={{marginRight:"20px"}}
          >
            Register
          </button>
            </li>
          </ul>
        </div>
      </nav>
      <section>
        <div className="px-4 py-5 px-md-5 text-center text-lg-start fullBox">
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-3 fw-bold ls-tight brand">
                  Greddiit
                </h1>
                <br />
                <p className="byline">Bring out the best in YOU.</p>
              </div>
              <div className="col-lg-6 mb-5 mb-lg-0 frompart">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <form>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          autoComplete="off"
                          name="Uname"
                          value={user.Uname}
                          onChange={handleChange}
                          id="form3Example4"
                          className="form-control"
                          placeholder="User Name"
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          name="pass"
                          value={user.pass}
                          onChange={handleChange}
                          id="form3Example4"
                          className="form-control"
                          placeholder="Password"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block mb-4 subut"
                        onClick={handleReg}
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
