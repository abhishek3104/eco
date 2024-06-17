
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const storedToken = sessionStorage.getItem("jwt_token");
      const response = await axios.post(
        `http://localhost:8080/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      console.log("Logout Response:", response);
      sessionStorage.removeItem("jwt_token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button className="button" onClick={handleLogout}>
      <span className="button-link">Logout</span>
    </button>
  );
};

export default LogoutButton;


