import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ListMySub(props) {
    const navigate=useNavigate();
  const [subarr, setsubArr] = useState(props.lsData);

  function handleDel(id) {
    axios
      .post("http://localhost:3500/api/delSub", {
        sub: subarr[id],
        usrjwt: localStorage.getItem("mytoken"),
      })
      .then((res) => {
        if (res.data.message === 0) {
          alert(res.data.disp);
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }
        alert("Successfully deleted Sub Greddiit!");

        setsubArr((prevItems) => {
          const newArr = prevItems.filter((item, index) => {
            return index !== id;
          });

          return newArr;
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <div>
      {subarr.map((elem, ind) => {
        return (
          <div className="note forhoverdiv">
            <h1>{"Name : " + elem.Name}</h1>
            <p>{"Posts : " + props.psdt[ind].posts.length}</p>
            <p>{props.varsub&&("Users : " + elem.Followers?.length)}</p>
            <p>{"Description : " + elem.Desc}</p>
            <p>{"Banned Keywords : " + elem.BannedKeys?.join(",")}</p>
            <button
              onClick={() => {
                handleDel(ind);
              }}
            >
              <i class="fa-solid fa-trash"></i>
            </button>
            <button type="button" class="btn btn-light" onClick={()=>{navigate("/home/"+elem.Name)}}>Open</button>
          </div>
        );
      })}
    </div>
  );
}

export default ListMySub;