import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import img from "./images/icons8-gatsbyjs-48.png";

function SubGrTab() {
  const [subgData, setsubgData] = useState([]);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState([]);
  const [tagstr, settagChange] = useState("");
  const [tagarr, setTagArr] = useState([]);
  const [tagonoff, settagonoff] = useState(false);
  const [usrDt, setusrDt] = useState({});
  const [sortbut, setsortbut] = useState([
    "white",
    "white",
    "white",
    "white",
    "white",
  ]);
  const [fororig, setfororig] = useState([{ Followers: [{}], Left: [{}] }]);

  useEffect(() => {
    let newarr = [];

    fororig.forEach((e) => {
      let x = 0;
      tagarr.forEach((t) => {
        if (!e.Tags.includes(t)) {
          x = 1;
        }
      });
      if (x === 0) {
        newarr.push(e);
      }
    });
    setSearchData(newarr);
  }, [tagarr]);

  const searchItem = (query) => {
    if (!query) {
      setSearchData(fororig);
      return;
    }
    const fuse = new Fuse(subgData, {
      keys: ["Name"],
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setSearchData(finalResult);
    } else {
      setSearchData([]);
    }
  };

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getAllSubG", {
        jwt: localStorage.getItem("mytoken"),
      })
      .then((res) => {
        if (res.data.mes === 0) {
          alert("Error!");
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const newd = res.data.dt;
        const usrd = res.data.usr;
        console.log(newd);
        setsubgData(newd);
        setSearchData([...newd]);
        setfororig(newd);
        setusrDt(usrd);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function tagChange(event) {
    const news = event.target.value;
    settagChange(news);
  }

  function addTag() {
    if (tagstr === "") {
      return;
    }
    setTagArr((prev) => {
      const newar = prev;
      newar.push(tagstr.toLowerCase());
      return newar;
    });
    settagChange("");
    setSearchData((prev) => {
      return prev.filter((e) => {
        return e.Tags.includes(tagstr.toLowerCase());
      });
    });
  }

  function handlesub(event) {
    event.preventDefault();
  }

  function DelTagArr(index) {
    setTagArr((prev) => {
      const x = prev.filter((e, i) => {
        console.log(i);
        return i !== index;
      });
      return x;
    });
  }

  function handleClick(event) {
    event.preventDefault();
    event.preventDefault();
    const x = Number(event.target.name);
    setsortbut((prev) => {
      if (x === 4) {
        return ["white", "white", "white", "white", "white"];
      }
      const newar = ["white", "white", "white", "white", "white"];
      newar[x] = "green";
      return newar;
    });
    if (x === 0) {
      setSearchData((prev) => {
        const newa = prev;
        newa.sort((a, b) => {
          if (a.Name > b.Name) {
            return 1;
          } else {
            return -1;
          }
        });
        return newa;
      });
    } else if (x === 1) {
      setSearchData((prev) => {
        const newa = prev;
        newa.sort((a, b) => {
          if (a.Name > b.Name) {
            return -1;
          } else {
            return 1;
          }
        });
        return newa;
      });
    } else if (x === 2) {
      setSearchData((prev) => {
        const newa = prev;
        newa.sort((a, b) => {
          if (a.Followers.length > b.Followers.length) {
            return -1;
          } else {
            return 1;
          }
        });
        return newa;
      });
    } else if (x === 3) {
      setSearchData((prev) => {
        const newa = prev;
        newa.sort((a, b) => {
          const at = a._id.toString().substring(0, 8);
          const adate = new Date(parseInt(at, 16) * 1000);
          const bt = b._id.toString().substring(0, 8);
          const bdate = new Date(parseInt(bt, 16) * 1000);
          if (adate > bdate) {
            return 1;
          } else {
            return -1;
          }
        });
        return newa;
      });
    } else if (x === 4) {
      setTagArr([]);
      setSearchData([...fororig]);
    }
  }

  function AddToSubFol(sg) {
    if (sg.JoinReqs.length) {
      let a = 0;
      sg.JoinReqs.forEach((ei) => {
        if (ei.Uname === usrDt.Uname && ei.Email === usrDt.Email) {
          a = 1;
        }
      });
      if (a === 1) {
        alert("Join Request Already Sent!");
        return;
      }
    }
    if (sg.Left.length) {
      let b = 0;
      sg.Left.forEach((ei) => {
        if (ei.Uname === usrDt.Uname && ei.Email === usrDt.Email) {
          b = 1;
        }
      });
      if (b === 1) {
        alert("You have left this SubGreddiit Before");
        return;
      }
    }
    alert("Request Sent!");
    axios
      .post("http://localhost:3500/api/AddFolToSub", {
        sub: sg,
        uname: usrDt.Uname,
        email: usrDt.Email,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          alert("Error!");
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }

        fororig.forEach((e) => {
          if (e === sg) {
            const ar = e.JoinReqs;
            const tempe = e;
            ar.push({ Uname: usrDt.Uname, Email: usrDt.Email });
            setfororig((prev) => {
              return [...prev, { ...tempe, JoinReqs: ar }];
            });
          }
        });
        subgData.forEach((e) => {
          if (e === sg) {
            const tempe = e;
            const ar = e.JoinReqs;
            ar.push({ Uname: usrDt.Uname, Email: usrDt.Email });
            setsubgData((prev) => {
              return [...prev, { ...tempe, JoinReqs: ar }];
            });
          }
        });
        searchData.forEach((e) => {
          if (e === sg) {
            const tempe = e;
            const ar = e.JoinReqs;
            ar.push({ Uname: usrDt.Uname, Email: usrDt.Email });
            setSearchData((prev) => {
              return [...prev, { ...tempe, JoinReqs: ar }];
            });
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  function RemFromSub(subg) {
    let a = 0;
    const un = usrDt.Uname;
    const em = usrDt.Email;
    subg.Moderators.forEach((e) => {
      if (e.Uname === un && e.Email === em) {
        a = 1;
      }
    });
    if (a === 1) {
      return;
    }
    console.log("equality3");
    axios
      .post("http://localhost:3500/api/RemFromSub", {
        uname: un,
        email: em,
        Name: subg.Name,
      })
      .then((res) => {
        console.log("equality2");
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }

        fororig.slice().forEach((e) => {
          if (e.Name === subg.Name) {
            let ar = subg.Followers;
            let nar = ar.filter((ele) => {
              return ele.Uname !== un;
            });
            let leftar = subg.Left;
            leftar.push({ Uname: un, Email: em });
            setfororig((prev) => {
              let newprev = prev.filter((xv) => {
                return xv.Name !== subg.Name;
              });
              return [...newprev, { ...subg, Followers: nar, Left: leftar }];
            });
          }
        });
        subgData.slice().forEach((e) => {
          if (e.Name === subg.Name) {
            let ar = subg.Followers;
            let nar = ar.filter((ele) => {
              return ele.Uname !== un;
            });
            let leftar = subg.Left;
            leftar.push({ Uname: un, Email: em });
            setsubgData((prev) => {
              let newprev = prev.filter((xv) => {
                return xv.Name !== subg.Name;
              });
              return [...newprev, { ...subg, Followers: nar, Left: leftar }];
            });
          }
        });
        searchData.slice().forEach((e) => {
          if (e.Name === subg.Name) {
            let ar = subg.Followers;
            let nar = ar.filter((ele) => {
              return ele.Uname !== un;
            });
            let leftar = subg.Left;
            leftar.push({ Uname: un, Email: em });
            console.log("equality");

            setSearchData((prev) => {
              let newprev = prev.filter((xv) => {
                return xv.Name !== subg.Name;
              });
              return [...newprev, { ...subg, Followers: nar, Left: leftar }];
            });
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
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
                className="btn btn-primary btn-block mb-4 subut"
                onClick={() => {
                  navigate("/home");
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
                className="btn btn-info btn-block mb-4 subut"
                onClick={() => {
                  navigate("/home");
                }}
                style={{ marginRight: "5px", marginTop: "10px" }}
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
                style={{ marginRight: "5px", marginTop: "10px" }}
              >
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div>
        <input
          type="search"
          autoComplete="off"
          id="search"
          onChange={(e) => searchItem(e.target.value)}
          placeholder="Search SubGreddiit"
        />
        <button
          onClick={() => {
            if (tagonoff) {
              settagonoff(false);
            } else {
              settagonoff(true);
            }
          }}
          className="btn btn-info btn-block mb-4"
          style={{ margin: "0 50% 0 50%", width: "fit-content" }}
        >
          Tags
        </button>
      </div>
      <div>
        {tagonoff && (
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-12 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={handlesub}>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          autoComplete="off"
                          onChange={tagChange}
                          id="form3Example4"
                          value={tagstr}
                          className="form-control"
                          placeholder="Enter a Tag and click Add button"
                        />
                      </div>
                    </form>
                    <button
                      type="submit"
                      onClick={() => {
                        addTag();
                      }}
                    >
                      Add
                    </button>
                    <br />
                    <br />
                    <div>
                      {tagarr.map((e, eind) => {
                        return (
                          <button className="tagbut">
                            {e + "  "}
                            <i
                              onClick={() => {
                                DelTagArr(eind);
                              }}
                              class="fa-sharp fa-solid fa-xmark"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <button
            className="btn btn-light btn-block mb-4"
            style={{
              background: "transparent",
              color: "white",
              border: "none",
            }}
          >
            Sort By:
          </button>
          <button
            className="btn btn-light btn-block mb-4"
            name="0"
            onClick={handleClick}
            style={{
              margin: "10px 5px 0 25px",
              backgroundColor: sortbut[0],
              color: "red",
            }}
          >
            Name (Asc)
          </button>
          <button
            className="btn btn-light btn-block mb-4"
            name="1"
            onClick={handleClick}
            style={{
              margin: "10px 5px 0 25px",
              backgroundColor: sortbut[1],
              color: "red",
            }}
          >
            Name (Desc)
          </button>
          <button
            className="btn btn-light btn-block mb-4"
            name="2"
            onClick={handleClick}
            style={{
              margin: "10px 5px 0 25px",
              backgroundColor: sortbut[2],
              color: "red",
            }}
          >
            Follower Count (Desc)
          </button>
          <button
            className="btn btn-light btn-block mb-4"
            name="3"
            onClick={handleClick}
            style={{
              margin: "10px 5px 0 25px",
              backgroundColor: sortbut[3],
              color: "red",
            }}
          >
            Creation Date (new to old)
          </button>
          <button
            className="btn btn-light btn-block mb-4"
            name="4"
            onClick={handleClick}
            style={{
              margin: "10px 5px 0 25px",
              backgroundColor: sortbut[4],
              color: "red",
            }}
          >
            Default
          </button>
        </div>
      </div>
      {searchData.map((elem, ind) => {
        let forleave = false;
        let varforjoin = true;
        const un = usrDt.Uname;
        const em = usrDt.Email;
        elem.Followers.forEach((ei) => {
          if (ei.Uname === un && ei.Email === em) {
            varforjoin = false;
          }
          if (ei.Uname === un && ei.Email === em) {
            forleave = true;
          }
        });
        return (
          <div className="note forhoverdiv">
            <h1>{"Name : " + elem.Name}</h1>
            <p>{"Posts : " + elem?.a?.length}</p>
            <p>{"Users : " + elem.Followers?.length}</p>
            <p>{"Description : " + elem.Desc}</p>
            <p>{"Tags : " + elem.Tags}</p>
            <p>{"Banned Keywords : " + elem.BannedKeys?.join(",")}</p>
            {varforjoin && (
              <button className="jnbut"
                onClick={() => {
                  AddToSubFol(elem);
                }}
              >
                Join
              </button>
            )}
            {forleave &&(
              <button
                className="jnbut"
                onClick={() => {
                  RemFromSub(elem);
                }}
              >
                Leave
              </button>
            )}
            <button type="button" class="btn btn-light" onClick={() => {
                axios
                  .post("http://localhost:3500/api/forStatJoin", {
                    subg:elem.Name,
                    us:usrDt.Uname
                  })
                  .then((res) => {
                    if (res.data.mes === 0) {
                      window.localStorage.removeItem("mytoken");
                      navigate("/");
                    }
                  })
                  .catch((err) => {
                    alert(err);
                  });
                navigate("/home/SubGreddiit/" + elem.Name);
                }
            }>
              Open
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default SubGrTab;
