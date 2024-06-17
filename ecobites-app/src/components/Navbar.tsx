import React from "react";
import "./NavbarPage.scss";

import { ReactComponent as ActionAccountFillIcon } from "@epam/assets/icons/action-account-fill.svg";
import { ReactComponent as ActionHomeFillOptIcon } from "@epam/assets/icons/action-home-fill-opt.2.svg";
import { ReactComponent as EditorListBulletOutlineIcon } from "@epam/assets/icons/editor-list_bullet-outline.svg";
// import { useNavigate } from "react-router-dom";
function Navbar() {
  // const navigate=useNavigate();
  return (

    <footer>
      <a href="." className="link_design">
        <ActionHomeFillOptIcon />
        Home
      </a>
      <a href=".">
        <EditorListBulletOutlineIcon />
        GroceeryList
      </a>
      <a href=".">
        <ActionAccountFillIcon />
        Profile
      </a>
    </footer>
  );
}
export default Navbar;
