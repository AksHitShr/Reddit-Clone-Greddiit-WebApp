import React, { useState,useEffect } from "react";
import SubForm from "./newSubForm";
import { useNavigate } from "react-router-dom";
import ListMySub from "./listMySub";
import axios from "axios";
import Loader from "./Loader";

function SubGr(){
    const navigate=useNavigate();
    const [listMySub,setListMySub]=useState(false);
    const [newSubForm,setSubForm]=useState(false);
    const [listData,setListData]=useState([{Followers:[]}]);
    const [usrdet,setUsrDet]=useState({Uname:"",Email:""});
    const [loader,setloader]=useState(false);
    const [pstdt,setpstdt]=useState([]);

    useEffect(()=>{
        axios
        .post("http://localhost:3500/api/listData", {userjwt:localStorage.getItem("mytoken")})
        .then((res) => {
          if (res.data.message === 0) {
            window.localStorage.removeItem("mytoken");
            navigate("/");
          }
          const dt=res.data.d;
          const zx=res.data.x;
          setListData(dt);
          setpstdt(zx);
          const un=res.data.uname;
          const em=res.data.uemail;
          setUsrDet({Uname:un,Email:em});
          setListMySub(true);
          setloader(true);
        })
        .catch((err) => {
          alert(err);
        });
    },[]);

    return (
       loader?(<div>
            <div class="container boxForSubBut">
            <button type="button" class="btn btn-info newMySub" onClick={()=>{
                if(!newSubForm){
                    setListMySub(false);
                    setSubForm(true);
                }else{
                    setSubForm(false);
                    setListMySub(true);
                }
            }}>New Sub Greddiit</button>
            </div>
            {(newSubForm&&(<SubForm forForm={setSubForm} forList={setListMySub} lsd={listData} lsUpdate={setListData} usrDet={usrdet} />))}
            {(listMySub&&(<ListMySub lsData={listData} psdt={pstdt} varsub={listMySub} />))}
        </div>):<Loader />
    );
};

export default SubGr;