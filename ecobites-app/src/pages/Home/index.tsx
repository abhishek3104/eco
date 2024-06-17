import React from "react";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { EXPLORE_RECIPES } from "../../common/constants/constants";
function HomePage() {
  const navigate = useNavigate();
  

  return (
    <>
      <h3 className="summary">
        Recipes and ingredients will appear here once added, Lets cook
      </h3>
      <div className="parent">
        <button className="button_design" onClick={() => navigate("/overview")}>
          {EXPLORE_RECIPES}

        </button>
      </div>
    </>
  );
}

export default HomePage;
