import React, { useState } from "react";
import Register from "./register";
import Login from "./login";
import Home from "./home";
import SubGrPage from "./subGrPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./Users";
import JoinReq from "./JoinReq";
import Reports from "./Reports";
import Stats from "./Stats";
import SubGrTab from "./SubGrTab";
import SgOpen from "./SgOpen";
import SavedPosts from "./SavedPosts";

function App() {
  const [usr, setLoginUsr] = useState({
    jwt: window.localStorage.getItem("mytoken"),
  });

  const [forchange,setPage]=useState(false);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={forchange ? (<Register butfunc={setPage} />) : (<Login changeusr={setLoginUsr} butfunc={setPage} />)}
          />
          <Route exact path="/home" element={
              usr.jwt ? (
                <Home usrJWT={usr} setusr={setLoginUsr} />
              ) :(forchange ? (<Register butfunc={setPage} />) : (<Login changeusr={setLoginUsr} butfunc={setPage} />))
            } />
            <Route path="/home/SavedPosts" element={<SavedPosts />} />
            <Route path="/home/:name" element={<SubGrPage />} />
            <Route path="/home/:name/Users" element={<Users />} />
            <Route path="/home/:name/JoinReq" element={<JoinReq />} />
            <Route path="/home/:name/Reports" element={<Reports />} />
            <Route path="/home/:name/Stats" element={<Stats />} />
            <Route path="/home/SubGreddiit" element={<SubGrTab />} />
            <Route path="/home/SubGreddiit/:name" element={<SgOpen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;