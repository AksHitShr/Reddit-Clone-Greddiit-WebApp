import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavForTabs from "./navForTabs";
import axios from "axios";
import Loader from "./Loader";

function JoinReq() {
  const navigate = useNavigate();
  const params = useParams();
  const sgName = params.name;
  const [tabdata, setTabData] = useState([]);
  const [showdt,setdt]=useState(false);
  const [loader,setloader]=useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getUsersData", {jwt:localStorage.getItem("mytoken"), sg: sgName })
      .then((res) => {
        if (res.data.message === 0) {
          alert(res.data.disp);
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const v=res.data.newd;
        const newd = v.JoinReqs;
        const usrdt=res.data.usr;
        const modarr=v.Moderators;
        const hasValue = modarr.some(obj => Object.values(obj).includes(usrdt.Email));
        if(!hasValue){
          navigate("/home");
        }else{
          setdt(true);
        }
        setTabData(newd);
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function AddReq(elem, ind) {
    setTabData((prev) => {
        const temarr=prev.filter((elem,inde)=>{
            return inde!==ind;
        });
        axios
      .post("http://localhost:3500/api/JoinReq",{sg:sgName,Req:elem,in:ind})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err);
      });
        return temarr;
    });
  }

  function DelReq(elem, ind) {
    setTabData((prev) => {
        const temarr=prev.filter((elem,inde)=>{
            return inde!==ind;
        });
        axios
      .post("http://localhost:3500/api/DelReq", {sg:sgName,Req:elem,in:ind})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err);
    });

    return temarr;
    });
  }

  return (loader?(showdt&&
    (<div>
      <NavForTabs />
      <div className="note" style={{width:"100%",textAlign:"center",backgroundColor:"#537FE7"}}><h1 style={{color:"yellow",fontFamily:"'Caveat', cursive",fontSize:"3rem"}}>Join Requests</h1></div>
      {tabdata.map((elem, ind) => {
        return (
          <div className="note">
            <h1>{"Name : " + elem.Uname}</h1>
            <p>{"Email : " + elem.Email}</p>
            <button
              onClick={() => {
                AddReq(elem, ind);
              }}
            >
              Accept
            </button>
            <button
              onClick={() => {
                DelReq(elem, ind);
              }}
            >
              Reject
            </button>
          </div>
        );
      })}
    </div>)):<Loader />
  );
}

export default JoinReq;
