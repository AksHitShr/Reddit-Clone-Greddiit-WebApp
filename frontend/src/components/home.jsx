import React, { useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import img from "./images/icons8-gatsbyjs-48.png";
import Profile from "./profile";
import NavBar from "./navBar";
import SubGreddiit from "./subGreddiit";
import Loader from "./Loader";

function Home(props) {
  const navigate = useNavigate();

  const [userData, setuserData] = useState({});
  const [prof,setProf]=useState(false);
  const [varForMySub,setMySub]=useState(true);
  const [loader,setloader]=useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/user", props.usrJWT)
      .then((res) => {
        if (res.data.message === 1) {
          const newData = res.data.user;
          setuserData(newData);
        } else {
          alert(res.data.disp);
          window.localStorage.removeItem("mytoken");
          props.setusr({});
          navigate("/");
        }
        setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  },[]);

  return (loader?
    (<div>
      <NavBar img={img} var={prof} setVar={setProf} setUser={props.setusr} setMySub={setMySub} varForMySub={varForMySub} />
      {(prof&&(<Profile newUser={userData} />))||(varForMySub&&(<SubGreddiit usrdata={userData} />))}
    </div>):<Loader />
  );
}

export default Home;
