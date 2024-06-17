import React from "react";
import Login from "./pages/Login/index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Forgetpassword from "./pages/ForgetPassword/index";

import HomePage from "./pages/Home/index";
import "./style/Theme.scss";
import Layout from "./Layout";
import OverviewPage from "./pages/Overview/index";
import SignUpForm from "./pages/SignUp/index";
// import LogoutButton from "./components/LogoutButton";
import DietaryPreferences from "./pages/ProfileEdit";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/profile/:userId" element={<DietaryPreferences />} />
        </Route>
        {/* <Route path="/profile2" element={<LogoutButton />} /> */}
        <Route path="/profile2" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
