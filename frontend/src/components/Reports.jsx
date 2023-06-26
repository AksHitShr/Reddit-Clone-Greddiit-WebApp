import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReportItem from "./ReportItem";
import NavForTabs from "./navForTabs";
import Loader from "./Loader";
import axios from "axios";

function Reports() {
  const params = useParams();
  const navigate = useNavigate();
  const sgname = params.name;
  const [sgdata, setsgdata] = useState({});
  const [repdt, setrepdt] = useState([]);
  const [showdt,setdt]=useState(false);
  const [loader,setloader]=useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getUsersData", {jwt:localStorage.getItem("mytoken"), sg: sgname })
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
        const forrep = res.data.rep;
        setrepdt(forrep);
        setsgdata(newd);
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  function delreq(item) {
    axios
      .post("http://localhost:3500/api/delReport", {sg:sgdata.Name,todel:item,reporterEmail:item.reporterEmail,blkper:item.posterName})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err);
      });

      setrepdt((prev)=>{
        let temp=prev;
        let vg=temp.filter((e)=>{
            return e!==item;
        });
        return vg;
      });
  }

  function funcIgnore(reportid,sta,repem,repperson){
    if(sta===1){
        return;
    }
    axios
      .post("http://localhost:3500/api/repStatus", {sg:sgdata.Name,todel:reportid,sta:1,reporterEmail:repem,blkper:repperson})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });
    setrepdt((prev)=>{
        let myarr=prev;
        myarr.forEach((e)=>{
            if(e.repid===reportid){
                e.status=1;
            }
        });
        return [...myarr];
    });
  };

  function newfunc(blockidforpost,repperson,repem){
    const reportid=blockidforpost;
    axios
      .post("http://localhost:3500/api/repStatus", {sg:sgdata.Name,todel:reportid,sta:2,blkper:repperson,reporterEmail:repem})
      .then((res) => {
        if (res.data.message === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err);
      });

    setrepdt((prev)=>{
        let myarr=prev;
        myarr.forEach((e)=>{
            if(e.repid===reportid){
                e.status=2;
            }
        });
        return [...myarr];
    });
  };

  return (loader?(showdt&&
    (<div>
      <NavForTabs />
      <div
        className="note"
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#FFAACF",
        }}
      >
        <h1
          style={{
            color: "#3F979B",
            fontFamily: "'Caveat', cursive",
            fontSize: "3rem",
          }}
        >
          Reported Posts
        </h1>
      </div>
      {repdt?.map((item) => {
        return (<ReportItem item={item} newfunc={newfunc} funcIgnore={funcIgnore} delreq={delreq} />);
      })}
    </div>)):<Loader />
  );
}

export default Reports;