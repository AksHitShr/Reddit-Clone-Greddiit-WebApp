import React, { useEffect, useState } from "react";
import img from "./images/icons8-gatsbyjs-48.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function SavedPosts() {
  const navigate = useNavigate();
  const [savedpsts, setsavedpsts] = useState([]);
  const [loader,setloader]=useState(false);
  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getSavedPosts", {
        jwt: localStorage.getItem("mytoken"),
      })
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const ps = res.data.saved;
        setsavedpsts(ps);
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function delsavedpost(pstid,sgname) {
    axios
      .post("http://localhost:3500/api/delSavedPost", {jwt:localStorage.getItem("mytoken"),postid:pstid,sg:sgname})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
        axios
          .post("http://localhost:3500/api/getSavedPosts", {jwt: localStorage.getItem("mytoken")})
          .then((re) => {
            if (re.data.message === 0) {
              window.localStorage.removeItem("mytoken");
              navigate("/");
            }
            const ps = re.data.saved;
            setsavedpsts(ps);
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    loader?(<div>
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
                  navigate("/home");
                }}
                style={{ marginRight: "5px", marginTop: "10px" }}
              >
                Back
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
                style={{ marginRight: "5px", marginTop: "10px" }}
              >
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div
        className="note"
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#C1AEFC",
        }}
      >
        <h1
          style={{
            color: "orange",
            fontFamily: "'Caveat', cursive",
            fontSize: "3rem",
          }}
        >
          Saved Posts
        </h1>
      </div>
      {savedpsts.map((ps) => {
        return (
          <div className="note">
            <h1>{"Posted by : " + ps[0]?.Uname}</h1>
            <p>{"SubGreddiit : " + ps[1]}</p>
            <p>{"Description : " + ps[0].Desc}</p>
            {ps[0].Comments.map((com) => {
              return (
                <div
                  className="note"
                  style={{ backgroundColor: "#BEF0CB", margin: "10px" }}
                >
                  <h1>{"Commented by : " + com?.Uname}</h1>
                  <p>{"Comment : " + com?.ComStr}</p>
                </div>
              );
            })}
            <button
              className="btn btn-primary"
              onClick={() => {
                delsavedpost(ps[0]._id,ps[1]);
              }}
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        );
      })}
    </div>):<Loader />
  );
}

export default SavedPosts;
