import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SubForm(props) {
  const navigate = useNavigate();

  const [varsubForm, setvarsub] = useState({
    SubName: "",
    desc: "",
    tags: "",
    banned: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setvarsub({
      ...varsubForm,
      [name]: value,
    });
  }

  function handleCreate() {
    //event.preventDefault();
    const { SubName, desc, tags, banned } = varsubForm;
    if (SubName && desc && tags && banned) {
      let arrTags = tags.split(",");
      arrTags = arrTags.map((elem) => {
        return elem.toLowerCase();
      });

      arrTags = Array.from(new Set(arrTags));

      let keywords = banned.split(",");
      keywords = keywords.map((elem) => {
        return elem.toLowerCase();
      });

      keywords = Array.from(new Set(keywords));

      const toadd={
        Name: SubName,
        Desc: desc,
        Tags: arrTags,
        BannedKeys: keywords,
        usrjwt: window.localStorage.getItem("mytoken"),
      };
      
      axios
        .post("http://localhost:3500/api/newSub", toadd)
        .then((res) => {
          if (res.data.message === 0) {
            alert(res.data.disp);
            window.localStorage.removeItem("mytoken");
            navigate("/");
          }
          alert(res.data.message);
          props.lsUpdate(prev=>{
            const newar=prev;
            newar.push({...toadd,Followers:[{Uname:props.usrDet.Uname,Email:props.usrDet.Email,Blocked:"0"}]});
            return newar;
          });
          props.forForm(false);
          props.forList(true);
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert("Invalid Input!");
    }
  }

  return (
    <div
      className="px-4 py-5 px-md-5 text-center text-lg-start fullBox"
      style={{ width: "50%" }}
    >
      <div className="container">
        <div className="row gx-lg-5 align-items-center">
          <div className="col-lg-12 mb-5 mb-lg-0">
            <div className="card">
              <div className="card-body py-5 px-md-5">
                <form>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      autoComplete="off"
                      name="SubName"
                      value={varsubForm.SubName}
                      onChange={handleChange}
                      id="form3Example4"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      autoComplete="off"
                      name="desc"
                      value={varsubForm.desc}
                      onChange={handleChange}
                      id="form3Example4"
                      className="form-control"
                      placeholder="Description"
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      autoComplete="off"
                      name="tags"
                      value={varsubForm.tags}
                      onChange={handleChange}
                      id="form3Example4"
                      className="form-control"
                      placeholder="Tags (comma seperated, lower case)"
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      autoComplete="off"
                      name="banned"
                      value={varsubForm.banned}
                      onChange={handleChange}
                      id="form3Example4"
                      className="form-control"
                      placeholder="Banned Keywords (comma seperated)"
                    />
                  </div>
                  <button
                    type="button"
                    class="btn btn-info"
                    onClick={handleCreate}
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubForm;
