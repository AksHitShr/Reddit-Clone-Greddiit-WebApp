import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "./images/icons8-gatsbyjs-48.png";
import axios from "axios";
import deadpool from "./images/leftpic.jpeg";
import Loader from "./Loader";

function SgOpen() {
  const navigate = useNavigate();
  const params = useParams();
  const sgname = params.name;
  const [sgdata, setsgData] = useState({ Followers: [{}] });
  const [usrdata, setusrdata] = useState();
  const [varforusr, setvarforusr] = useState(false);
  const [modtit, setmodtit] = useState("");
  const [postData, setpostData] = useState({ posts: [{}] });
  const [reportsdata,setreportsdt]=useState([]);
  const [commtext, setcommtext] = useState("");
  const [reportvar,setreportvar]=useState("");
  const [forsavedpsts,setsavedpsts]=useState([]);
  const [loader,setloader]=useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getSgData", {
        jwt: localStorage.getItem("mytoken"),
        sgname: sgname,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const dta = res.data.sg;
        const us = res.data.usr;
        const pstData = res.data.posts;
        const fols = res.data.Followers;
        const folw = res.data.Following;
        const repdt=res.data.Reports;
        const jdd=res.data.svdpsts;
        setsavedpsts(jdd);
        setreportsdt(repdt);
        setpostData(pstData);
        console.log(pstData);
        dta.Followers?.forEach((e) => {
          if (e.Uname === us.Uname && e.Email === us.Email) {
            setvarforusr(true);
          }
        });
        setusrdata({ ...us, Followers: fols, Following: folw });
        setsgData(dta);
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function handleChange(event) {
    // for banned keywords
    const newv = event.target.value;
    let words_in_inp=newv.match(/\w+|\s+|[^\s\w]+/g);
    let new_inp=[];
    words_in_inp?.forEach((e)=>{
      if(!sgdata.BannedKeys.includes(e.toLowerCase())){
        new_inp.push(e);
      }else{
        new_inp.push("*");
        alert(`${e} is a banned keyword`);
      }
    });
    const answ=new_inp.join('');
    setmodtit(answ);
  }

  function handleAdd() {
    axios
      .post("http://localhost:3500/api/AddPost", {
        sgName: sgname,
        toadd: modtit,
        uname: usrdata.Uname,
        email: usrdata.Email,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const m = res.data.message;
      })
      .catch((err) => {
        alert(err);
      });
    setpostData((prev) => {
      let newarr = prev;
      newarr.posts.push({
        Uname: usrdata.Uname,
        Email: usrdata.Email,
        Desc: modtit,
        Comments: [],
        Upvotes: [],
        Downvotes: [],
      });
      return newarr;
    });
    setmodtit("");
  }

  function AddToFollowing(newfol) {
    axios
      .post("http://localhost:3500/api/AddNewFol", {
        nameofFol: newfol,
        addTo: usrdata.Uname,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const mes = res.data.message;
        alert(mes);
        setusrdata((prev) => {
          let foli = prev.Following;
          foli.push(newfol);
          return { ...prev, Following: foli };
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  function DownVoteHandle(postid) {
    axios
      .post("http://localhost:3500/api/DownvotePost", {
        sgName: sgdata.Name,
        pstid: postid,
        usrname: usrdata.Uname,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });

    setpostData((prev) => {
      let tempvar = prev;
      tempvar.posts.forEach((e) => {
        if (String(e._id) === String(postid)) {
          e.Downvotes.push(usrdata.Uname);
          let y = e.Upvotes;
          e.Upvotes = y.filter((x) => {
            return x !== usrdata.Uname;
          });
        }
      });
      return { ...tempvar };
    });
  }

  // function handlecommbut() {
  //   setcomm((prev) => {
  //     return !prev;
  //   });
  // }

  function UpVoteHandle(postid) {
    axios
      .post("http://localhost:3500/api/UpvotePost", {
        sgName: sgdata.Name,
        pstid: postid,
        usrname: usrdata.Uname,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });

    setpostData((prev) => {
      let tempvar = prev;
      tempvar.posts.forEach((e) => {
        if (String(e._id) === String(postid)) {
          e.Upvotes.push(usrdata.Uname);
          let y = e.Downvotes;
          e.Downvotes = y.filter((x) => {
            return x !== usrdata.Uname;
          });
        }
      });
      return { ...tempvar };
    });
  }

  function handleCommChange(event) {
    const newcommvalue = event.target.value;
    setcommtext(newcommvalue);
  }

  function AddComment(postid) {
    const bywhom = usrdata.Uname;
    const addem = usrdata.Email;
    if(!commtext){
      alert("Comment Empty!");
      return;
    }

    axios
      .post("http://localhost:3500/api/AddComm", {
        sgName: sgdata.Name,
        pstid: postid,
        commobj: {Uname:bywhom,Email:addem,ComStr:commtext}
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });

    setpostData((prev) => {
      let tempvar = prev;
      tempvar.posts.forEach((e) => {
        if (String(e._id) === String(postid)) {
          e.Comments.push({Uname:bywhom,Email:addem,ComStr:commtext});
        }
      });
      return { ...tempvar };
    });
    setcommtext("");
  }

  function reportPost(postrec){
    const un=usrdata.Uname;
    const uem=usrdata.Email;
    if(!reportvar){
      alert("Concern Empty!");
      return;
    }
    const tosend={sg:sgdata.Name,dat:{reporterName:un,reporterEmail:uem,posterName:postrec.Uname,posterEmail:postrec.Email,Concern:reportvar,text:postrec.Desc,status:0,repid:String(postrec._id)}};
    
    axios
      .post("http://localhost:3500/api/AddReport",tosend)
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });
    
    setreportsdt((prev)=>{
      let abcd=prev;
      abcd.push(tosend.dat);
      return [...abcd];
    });
    setreportvar("");
  };

  function handlereportvar(event){
    const newv=event.target.value;
    setreportvar(newv);
  };

  function handlesavePost(idforpost){
    axios
      .post("http://localhost:3500/api/addtoSaved",{usrn:usrdata.Uname,usrem:usrdata.Email,sg:sgdata.Name,pstid:idforpost})
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });

      setsavedpsts((prev)=>{
        let a=prev;
        a.push({SubName:sgdata.Name,Postid:String(idforpost)});
        return [...a];
      });
  };

  return (
   loader?(<div>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                type="submit"
                className="btn btn-primary btn-block mb-4 subut"
                onClick={() => {
                  navigate("/home/SubGreddiit");
                }}
                style={{ marginRight: "5px", marginTop: "10px" }}
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
                style={{ marginRight: "5px", marginTop: "10px" }}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="forpartition">
        <div className="forprofile">
          <img src={deadpool} className="dead" />
          <div
            className="note"
            style={{ marginTop: "50px", marginLeft: "5%", width: "80%" }}
          >
            <h1>{"Name : " + sgdata.Name}</h1>
            <p>{"Description : " + sgdata.Desc}</p>
            <p>{"Number of Users : " + sgdata.Followers?.length}</p>
          </div>
        </div>
        <div className="rightpart">
          {varforusr ? (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "50%", marginTop: "20px" }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                New Post
              </button>

              <div
                class="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="staticBackdropLabel">
                        Add New Post
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <label for="Desc">Content : </label>
                      <input
                        autoComplete="off"
                        id="Desc"
                        type="text"
                        value={modtit}
                        onChange={handleChange}
                        name="Desc"
                      />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        onClick={() => {
                          handleAdd();
                        }}
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {postData?.posts?.map((e,eind) => {
                let savedps=true;
                forsavedpsts.forEach((b)=>{
                  if(String(e._id)===b.Postid){
                    savedps=false;
                  }
                });
                let forreportmodal=true;
                if(e.Uname==="Blocked User"){
                  forreportmodal=false;
                }
                reportsdata?.forEach((xy)=>{
                  if(xy?.reporterName===usrdata?.Uname && xy.text===e.Desc){
                    forreportmodal=false;
                  }
                });
                const curusrname = usrdata?.Uname;
                let forfolbut = true;
                if (curusrname === e?.Uname) {
                  forfolbut = false;
                  forreportmodal=false;
                }
                usrdata?.Following?.forEach((ex) => {
                  if (ex === e?.Uname) {
                    forfolbut = false;
                  }
                });
                let curVotestatus = "";
                e.Upvotes?.forEach((i) => {
                  if (i === curusrname) {
                    curVotestatus = "Downvote";
                  }
                });
                e.Downvotes?.forEach((i) => {
                  if (i === curusrname) {
                    curVotestatus = "Upvote";
                  }
                });
                return (
                  <div
                    className="note"
                    style={{
                      marginTop: "30px",
                      marginLeft: "10%",
                      width: "80%",
                    }}
                  >
                    <p>{"Posted By : " + e?.Uname}</p>
                    <p>{"Description : " + e?.Desc}</p>
                    <p>{"Upvotes : " + e?.Upvotes?.length}</p>
                    <p>{"Downvotes : " + e?.Downvotes?.length}</p>
                    {forfolbut && (
                      <button
                        onClick={() => {
                          AddToFollowing(e?.Uname);
                        }}
                      >
                        Follow
                      </button>
                    )}
                    {curVotestatus === "" ? (
                      <div>
                        <button>
                          <i
                            onClick={() => {
                              UpVoteHandle(e._id);
                            }}
                            class="fa-sharp fa-solid fa-caret-up"
                          ></i>
                        </button>
                        <button>
                          <i
                            onClick={() => {
                              DownVoteHandle(e._id);
                            }}
                            class="fa-sharp fa-solid fa-caret-down"
                          ></i>
                        </button>
                      </div>
                    ) : curVotestatus === "Downvote" ? (
                      <button>
                        <i
                          onClick={() => {
                            DownVoteHandle(e._id);
                          }}
                          class="fa-sharp fa-solid fa-caret-down"
                        ></i>
                      </button>
                    ) : (
                      <button>
                        <i
                          onClick={() => {
                            UpVoteHandle(e._id);
                          }}
                          class="fa-sharp fa-solid fa-caret-up"
                        ></i>
                      </button>
                    )}
                    {/* <button
                      className="btn btn-primary"
                      onClick={() => {
                        handlecommbut();
                      }}
                    >
                      Comments
                    </button> */}

                    {savedps&&(<button
                      type="button"
                      className="btn btn-primary"
                      onClick={()=>{handlesavePost(e._id)}}
                    >
                      Save Post
                    </button>)}


                    <button
                type="button"
                className="btn btn-primary"
                style={{float:"left"}}
                data-bs-toggle="modal"
                data-bs-target={"#staticBackdrop2"+eind}
              >
                Add Comment
              </button>

              <div
                class="modal fade"
                id={"staticBackdrop2"+eind}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby={"staticBackdropLabel2"+eind}
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id={"staticBackdropLabel2"+eind}>
                       Add Your Comment
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <label for="Comm">Content : </label>
                      <input
                        autoComplete="off"
                        id="Comm"
                        type="text"
                        value={commtext}
                        onChange={handleCommChange}
                        name="Comm"
                      />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        onClick={() => {
                          AddComment(e._id);
                        }}
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>




                    {forreportmodal&&(<div><button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={"#staticBackdrop3"+eind}
              >
                Report
              </button>

              <div
                class="modal fade"
                id={"staticBackdrop3"+eind}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby={"staticBackdropLabel3"+eind}
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id={"staticBackdropLabel3"+eind}>
                       Report This Post
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <label for="Rep">Concern : </label>
                      <input
                        autoComplete="off"
                        id="Rep"
                        type="text"
                        value={reportvar}
                        onChange={handlereportvar}
                        name="Rep"
                      />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        onClick={() => {
                          reportPost(e);
                        }}
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div></div>)}


                    {
                      e?.Comments?.map((z) => {
                        return (
                          <div
                            className="note"
                            style={{
                              backgroundColor: "#BEF0CB",
                              margin: "10px",
                            }}
                          >
                            <h1>{"Commented by : " + z?.Uname}</h1>
                            <p>{"Comment : " + z?.ComStr}</p>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          ) : (
            <h1
              style={{
                fontFamily: "'Caveat', cursive",
                color: "aqua",
                textAlign: "center",
              }}
            >
              Join this SubGreddiit to see more !!
            </h1>
          )}
        </div>
      </div>
    </div>):<Loader />
  );
}

export default SgOpen;
