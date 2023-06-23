import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./component/Header.jsx";
import Nav from "./component/Nav.jsx";
import SignUp from "./component/SignUp.jsx";
import SignIn from "./component/SignIn.jsx";
import GetProfile from "./component/GetProfile.jsx";
import SignOut from "./component/SignOut.jsx";
import Home from "./component/Home.jsx";
import MedicationTable from "./component/MedicationTable.jsx";
import { fetchProfileData } from "./services/apiConfig.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [profileData, setProfileData] = useState(null); // Add state for profile data

  useEffect(() => {
    // Fetch profile data and set it to the state
    if (isLoggedIn) {
      fetchProfileData(localStorage.getItem("token"))
        .then((data) => {
          setProfileData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <Header />
      <Nav isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn onSignIn={() => setIsLoggedIn(true)} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/profile"
          element={<GetProfile profileData={profileData} />} // Pass profileData to GetProfile
        />
        <Route
          path="/sign-out"
          element={<SignOut onSignOut={() => setIsLoggedIn(false)} />}
        />
        <Route
          path="/medication-table"
          element={<MedicationTable profileData={profileData} />} // Pass profileData to MedicationTable
        />
      </Routes>
    </div>
  );
}

export default App;