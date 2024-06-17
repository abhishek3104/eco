
import React, { useEffect, useState } from "react";
import "../../components/App.scss";
import { Avatar, FlexRow } from "@epam/uui";
import { ReactComponent as CommunicationFavoriteFillIcon } from "@epam/assets/icons/communication-favorite-fill.svg";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import LogoutButton from "../../components/LogoutButton";
import { GET_USER_ID ,USER_DETAILS} from "../../common/constants/url_constants";

interface UserDetails {
  username: string;
  image: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("jwt_token");
    if (!storedToken) {
      navigate("/login");
      return;
    }

    const fetchUserId = async () => {
      if (storedToken) {
        try {
          const response = await fetch(GET_USER_ID, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserId(data);

            const userDetailsResponse = await fetch(
              `${USER_DETAILS}/${data}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );
            if (userDetailsResponse.ok) {
              const userDetails = await userDetailsResponse.json();
              setUserDetails(userDetails);
            }
          } else {
            console.error("Failed to fetch user ID");
          }
        } catch (error) {
          console.error("An error occurred while fetching user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [navigate]);

  const handleEdit = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      console.error("User ID not found");
    }
  };

  const isLoggedIn = !!userId;

  return (
    <div className="header" data-testid="logout">
      <header className="head">
        <h2 className="profile">Profile</h2>
        <button className="edit" onClick={handleEdit} disabled={!isLoggedIn}>
          Edit
        </button>
      </header>
      <div className="profile-pic">
        <FlexRow columnGap="6">
          <div className="circular-avatar">
            <Avatar alt="avatar" img={userDetails?.image ?? null} size="78" />
          </div>
          <h3>{userDetails?.username}</h3>
        </FlexRow>
      </div>
      <div className="main-body">
        <button className="button" disabled={!isLoggedIn}>
          <Link to="/" className="button-link">
            Settings
          </Link>
        </button>
        <button className="button" disabled={!isLoggedIn}>
          <Link to="/change-password" className="button-link">
            Change Password
          </Link>
        </button>
        <button className="button" disabled={!isLoggedIn}>
          <Link to="/dietary" className="button-link">
            Set Dietary Preference
          </Link>
        </button>
        <button className="button" disabled={!isLoggedIn}>
          <Link to="/" className="button-link">
            About Us
          </Link>
        </button>
        <LogoutButton/>
      </div>

      <div className="main-body">
        <div className="favorite-recipes">
          <h2>Your favorite recipes</h2>
          <div className="recipes-list">
            <div className="recipe-card">
              <img
                src="https://th.bing.com/th/id/OIP.-T6r0SDcS2IjzVx4n4HVZwHaFt?rs=1&pid=ImgDetMain"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
            <div className="recipe-card">
              <img
                src="https://th.bing.com/th/id/OIP.sipswIFRnpoYxBGK_LGkWQHaFK?rs=1&pid=ImgDetMain"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
            <div className="recipe-card">
              <img
                src="https://www.thewickednoodle.com/wp-content/uploads/2019/12/Nicoise-Salad-3-of-3.jpg"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
            <div className="recipe-card">
              <img
                src="https://www.thewickednoodle.com/wp-content/uploads/2019/12/Nicoise-Salad-3-of-3.jpg"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
            <div className="recipe-card">
              <img
                src="https://www.thewickednoodle.com/wp-content/uploads/2019/12/Nicoise-Salad-3-of-3.jpg"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
            <div className="recipe-card">
              <img
                src="https://www.thewickednoodle.com/wp-content/uploads/2019/12/Nicoise-Salad-3-of-3.jpg"
                alt="Recipe"
                className="recipe-card-img"
              />
              <div className="recipe-card-info">
                <p className="recipe-card-time">30 min</p>
                <h3 className="recipe-card-title">Biryani</h3>
              </div>
              <CommunicationFavoriteFillIcon className="recipe-card-favorite-icon" />
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default ProfilePage;
