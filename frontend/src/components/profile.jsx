import React, { useState, useEffect } from "react";
import Item from "./item";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const navigate=useNavigate();
  const [myfollowerData, setfollowData] = useState({
    Uname: "",
    Password: "",
    Followers: [],
    Following: [],
  });
  const [loader,setloader]=useState(false);

  const currUser = props.newUser;
  const [followerItems, setFollowerItems] = useState([]);
  const [followingItems, setFollowingItems] = useState([]);
  // const [changemade,setchangemade]=useState(false);
  const un=props.newUser.Uname;

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/follow", { Uname: un})
      .then((res) => {
        if (res.data.message === 1) {
          const newData = res.data.follow;
          setfollowData(newData);
        }
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  useEffect(()=>{
    setFollowerItems(myfollowerData.Followers);
    setFollowingItems(myfollowerData.Following);
  },[myfollowerData]);

  const [user, setUser] = useState({
    Fname: currUser.Fname,
    Lname: currUser.Lname,
    Uname: currUser.Uname,
    Age: currUser.Age,
    Email: currUser.Email,
    ContactNo: currUser.ContactNo,
    Password: currUser.Password,
  });

  function handleChange(event) {
    // setchangemade(true);
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  function handleFollowers(id,elemi) {
    let newArr=[];
    const torem=elemi;
    setFollowerItems((prevItems) => {
      newArr = prevItems.filter((item, index) => {
        return index !== id;
      });
      axios
      .post("http://localhost:3500/api/upFollowers", {forFoll:{...myfollowerData,Followers:newArr},torem:torem,curr:currUser.Uname})
      .then((res) => {
        if (res.data.message === 1) {
          alert("Updated !");
        }else{
          alert("Error!");
        }
      })
      .catch((err) => {
        alert(err);
      });
      return newArr;
    });
  }

  function handleFollowing(id,elemi) {
    let newArr=[];
    const torem=elemi;
    setFollowingItems((prevItems) => {
      newArr = prevItems.filter((item, index) => {
        return index !== id;
      });
      axios
      .post("http://localhost:3500/api/upFollowing", {forFoll:{...myfollowerData,Following:newArr},torem:torem,curr:currUser.Uname})
      .then((res) => {
        if (res.data.message === 1) {
          alert("Updated");
        }
      })
      .catch((err) => {
        alert(err);
      });
      return newArr;
    });
  }

  function saveNewData(event) {
    event.preventDefault();
    const {Fname,Lname,Uname,Age,Email,ContactNo,Password}=user;
    if (
      !(Fname &&
      Lname &&
      Uname &&
      Email &&
      Password &&
      Age&&ContactNo&&(!isNaN(Age))&&(!isNaN(ContactNo)))
    ){
      alert("Invalid Changes!");
      setUser({
        Fname: currUser.Fname,
        Lname: currUser.Lname,
        Uname: currUser.Uname,
        Age: currUser.Age,
        Email: currUser.Email,
        ContactNo: currUser.ContactNo,
        Password: currUser.Password,
      });
      return;
    }
    axios
      .post("http://localhost:3500/api/update", { upuser: user })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (loader?
    (<section class="vh-100">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-300">
          <div class="col col-md-9 col-lg-7 col-xl-5">
            <div
              class="card"
              style={{
                borderRadius: "15px",
                minHeight: "400px",
                maxWidth: "1000px",
              }}
            >
              <div class="card-body p-4">
                <div class="d-flex text-black">
                  <div class="flex-shrink-0" style={{ marginRight: "0px" }}>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                      alt="no"
                      class="img-fluid"
                      style={{ width: "90px", borderRadius: "50px" }}
                    />
                  </div>
                  <form style={{ marginRight: "10px" }}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <label>First Name</label>
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
                          <label>Last Name</label>
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
                          <label>User Name</label>
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
                          <label>Age</label>
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
                          <label>Contact No</label>
                          <input
                            type="text"
                            name="cnum"
                            autoComplete="off"
                            value={user.ContactNo}
                            onChange={handleChange}
                            id="form3Example2"
                            className="form-control"
                            placeholder="Contact Number"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4 subut"
                      onClick={saveNewData}
                    >
                      Save
                    </button>
                  </form>

                  {/* code for followings */}
                  <div
                    class="d-flex rounded-3 p-2 mb-2 h-100"
                    style={{ backgroundColor: "#AEE2FF" }}
                  >
                    <div class="px-3">
                      <p class="small text-muted mb-1">Followers</p>
                      <div class="dropdown">
                        <button
                          class="btn btn-primary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          style={{
                            backgroundColor: "#AEE2FF",
                            border: "none",
                            color: "black",
                          }}
                        >
                          {followerItems.length}
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                          {followerItems.map((elem, ind) => {
                            return (
                              <Item
                                item={elem}
                                index={ind}
                                delitem={handleFollowers}
                              />
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p class="small text-muted mb-1">Following</p>
                      <div class="dropdown">
                        <button
                          class="btn btn-primary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          style={{
                            backgroundColor: "#AEE2FF",
                            border: "none",
                            color: "black",
                          }}
                        >
                          {followingItems.length}
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                          {followingItems.map((elem, ind) => {
                            return (
                              <Item
                                item={elem}
                                index={ind}
                                delitem={handleFollowing}
                              />
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>):<Loader />
  );
}

export default Profile;
