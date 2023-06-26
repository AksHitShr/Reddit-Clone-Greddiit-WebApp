import React, { useState } from "react";
import axios from "axios";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import img from "./images/icons8-gatsbyjs-48.png";

function Register(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    Fname: "",
    Lname: "",
    Uname: "",
    Age: "",
    email: "",
    cnum: "",
    pass: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  function handleReg(event) {
    const { Fname, Lname, Uname, Age, email, cnum, pass } = user;
    event.preventDefault();
    if (
      Fname &&
      Lname &&
      Uname &&
      email &&
      pass &&
      Age&&cnum&&(!isNaN(Age))&&(!isNaN(cnum))
    ) {
      axios.post("http://localhost:3500/api/register", user).then((res) => {
        alert(res.data.message);
        setUser({
          Fname: "",
          Lname: "",
          Uname: "",
          Age: "",
          email: "",
          cnum: "",
          pass: "",
        });
        navigate("/");
      });
    } else {
      alert("Invalid Entry!");
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
              props.butfunc(false);
            }}
            style={{marginRight:"20px"}}
          >
            Login
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
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              autoComplete="off"
                              name="Fname"
                              value={user.Fname}
                              onChange={handleChange}
                              id="form3Example1"
                              className="form-control"
                              placeholder="First Name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              autoComplete="off"
                              name="Lname"
                              value={user.Lname}
                              onChange={handleChange}
                              id="form3Example2"
                              className="form-control"
                              placeholder="Last Name"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              autoComplete="off"
                              name="Uname"
                              value={user.Uname}
                              onChange={handleChange}
                              id="form3Example1"
                              className="form-control"
                              placeholder="User Name"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              autoComplete="off"
                              name="Age"
                              value={user.Age}
                              onChange={handleChange}
                              id="form3Example2"
                              className="form-control"
                              placeholder="Age"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="email"
                              autoComplete="off"
                              name="email"
                              value={user.email}
                              onChange={handleChange}
                              id="form3Example1"
                              className="form-control"
                              placeholder="Email"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              name="cnum"
                              autoComplete="off"
                              value={user.cnum}
                              onChange={handleChange}
                              id="form3Example2"
                              className="form-control"
                              placeholder="Contact Number"
                            />
                          </div>
                        </div>
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
                        Sign up
                      </button>
                      <div className="text-center sigup">
                        <p>or sign up with:</p>
                        <button
                          type="button"
                          className="btn btn-link btn-floating mx-1"
                        >
                          <i className="fab fa-facebook-f fa-xl"></i>
                        </button>

                        <button
                          type="button"
                          className="btn btn-link btn-floating mx-1"
                        >
                          <i className="fab fa-google fa-xl"></i>
                        </button>
                        <br />
                      </div>
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

export default Register;
