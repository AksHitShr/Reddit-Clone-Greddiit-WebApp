import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "./images/icons8-gatsbyjs-48.png";
import NavForTabs from "./navForTabs";
import Loader from "./Loader";

function Tabs() {
  const navigate = useNavigate();
  const params = useParams();
  const subgreddiit = params.name;
  const [tabdata, setTabData] = useState({
    Followers:[{}]
  });
  const [showdt,setdt]=useState(false);
  const [loader,setloader]=useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getUsersData", {jwt:localStorage.getItem("mytoken"), sg: subgreddiit })
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        const newd = res.data.newd;
        const usrdt=res.data.usr;
        const modarr=newd.Moderators;
        const hasValue = modarr.some(obj => Object.values(obj).includes(usrdt.Email));
        if(!hasValue){
          navigate("/home");
        }else{
          setdt(true);
        }
        // console.log(newd);
        if(newd.Followers){
        newd?.Followers.sort((a,b)=>{return a.Blocked-b.Blocked});}
        // console.log(newd);
        setTabData(newd);
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  return (loader?(showdt&&
    (<div>
    <NavForTabs />
    <div className="note" style={{width:"100%",textAlign:"center",backgroundColor:"#C1AEFC"}}><h1 style={{color:"#3F979B",fontFamily:"'Caveat', cursive",fontSize:"3rem"}}>Users (Red for Blocked)</h1></div>
      {tabdata?.Followers?.map((elem) => {
        let st={display:"block",float:"none",backgroundColor:"white"};
        const ty=elem.Blocked;
        if(ty==="1"){
          st.backgroundColor="rgb(245, 143, 114)";
        }
        return (
          <div className="note" style={st}>
          <h1>{"Name : " + elem.Uname}</h1>
          <p>{"Email : "+elem.Email}</p>
          </div>
        );
      })}
    </div>)):<Loader />
  );
}

export default Tabs;
