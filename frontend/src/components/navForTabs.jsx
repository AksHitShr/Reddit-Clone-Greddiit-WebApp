import React from "react";
import img from "./images/icons8-gatsbyjs-48.png";
import { useNavigate, useParams } from "react-router-dom";

function NavForTabs(){
    const params=useParams();
    const navigate=useNavigate();
    return (
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
                  className="btn btn-primary btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home/"+params.name);
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
                  className="btn btn-info btn-block mb-4 subut"
                  onClick={() => {
                    navigate("/home");
                  }}
                  style={{marginRight:"5px",marginTop:"10px"}}
                >
                  {"My Sub Greddiits   "}
                  <i class="fa-solid fa-heart"></i>
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
    );
};

export default NavForTabs;