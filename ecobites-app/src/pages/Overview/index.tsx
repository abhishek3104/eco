import React from "react";
import "../Overview/index.scss";
import { LOGIN, SIGN_UP } from "../../common/constants/constants";
import { useNavigate } from "react-router-dom";

function OverviewPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h3 className="summary">
        Ready to access and manage your grocery list ? Just login !
      </h3>
      <div className="parent">
        <button
          id="signup"
          className="button_design"
          onClick={() => navigate("/signup")}
        >
          {SIGN_UP}
        </button>
        <br></br>
        <button
          id="login"
          className="button_white_design"
          onClick={() => navigate("/login")}
        >
          {LOGIN}
        </button>
      </div>
    </div>
  );
}

export default OverviewPage;
