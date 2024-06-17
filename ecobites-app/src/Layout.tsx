import React from "react";
import Ecobites from "./components/Ecobites";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <div>
        <Ecobites data-testid='' />
        <Outlet />
      </div>
      <Navbar data-tesid='Navbar' />
    </div>
  );
}

export default Layout;
