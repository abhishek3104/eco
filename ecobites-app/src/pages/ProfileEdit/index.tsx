import React, { useEffect, useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { GET_USER_ID ,UPDATE_USER } from '../../common/constants/url_constants'; 
import {SPECIAL_CHARACTER_PATTERN,STARTS_WITH_NUMBER_PATTERN,SPECIAL_CHAR_IN_MIDDLE_OR_ENDPATTERN,URL_PATTERN} from '../../common/constants/regex';

const DietaryPreferences: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [imageURL, setImageURL] = useState<string>('');
  const [imageURLError, setImageURLError] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedToken = sessionStorage.getItem('jwt_token');
        if (storedToken) {
          const response = await fetch(GET_USER_ID, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserId(data);
          } else {
            console.error('Failed to fetch user ID');
          }
        }
      } catch (error) {
        console.error('An error occurred while fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleUpdate = async () => {
    setUsernameError('');
    setImageURLError('');
    setUpdateError('');
  
    const isUsernameUpdated = username.trim() !== '';
    const isImageURLUpdated = imageURL.trim() !== '';
  
    if (!isUsernameUpdated && !isImageURLUpdated) {
      setUpdateError('At least one field (username or image URL) must be updated.');
      return;
    }
  
    const isUsernameValid = isUsernameUpdated ? validateUsername(username) : true;
    const isImageURLValid = isImageURLUpdated ? validateImageURL(imageURL) : true;
  
    if (!isUsernameValid || !isImageURLValid) {
      return;
    }
  
    if (!userId) {
      setUpdateError('Failed to update profile: User ID not found.');
      return;
    }
  
    const storedToken = sessionStorage.getItem('jwt_token');
    if (!storedToken) {
      setUpdateError('Failed to update profile: Token not found.');
      return;
    }
  
    const updateUsername = async () => {
      const data = { username: username.trim() };
  
      const response = await fetch(`${UPDATE_USER}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setUsernameError(errorData.status || 'Failed to update username.');
        return false;
      }
      return true;
    };
  
    const updateImageURL = async () => {
      const data = { image: imageURL.trim() };
  
      const response = await fetch(`${UPDATE_USER}/${userId}/image`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setImageURLError(errorData.status || 'Failed to update image URL.');
        return false;
      }
      return true;
    };
  
    try {
      if (isUsernameUpdated && isImageURLUpdated) {
        const isImageURLUpdateSuccess = await updateImageURL();
        if (isImageURLUpdateSuccess) {
          const isUsernameUpdateSuccess = await updateUsername();
          if (isUsernameUpdateSuccess) {
            setUpdateError('');
            navigate('/profile2');
          } else {
           
            await updateImageURL(); 
            setUpdateError('Failed to update username.');
          }
        } else {
          setUpdateError('Failed to update image URL.');
        }
      } else if (isUsernameUpdated) {
        const isUsernameUpdateSuccess = await updateUsername();
        if (isUsernameUpdateSuccess) {
          setUpdateError('');
          navigate('/profile2');
        } else {
          setUpdateError('Failed to update username.');
        }
      } else if (isImageURLUpdated) {
        const isImageURLUpdateSuccess = await updateImageURL();
        if (isImageURLUpdateSuccess) {
          setUpdateError('');
          navigate('/profile2');
        } else {
          setUpdateError('Failed to update image URL.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setUpdateError('An error occurred while updating the profile.');
    }
  };
  
  const validateUsername = (value: string) => {
    const trimmedValue = value.trim();
    const specialCharPattern = SPECIAL_CHARACTER_PATTERN;
    const startsWithNumberPattern = STARTS_WITH_NUMBER_PATTERN;
    const specialCharInMiddleOrEndPattern = SPECIAL_CHAR_IN_MIDDLE_OR_ENDPATTERN;
  
    if (trimmedValue.length < 3 || trimmedValue.length > 25) {
      setUsernameError('Username must be between 3 and 25 characters.');
      return false;
    }
    if (specialCharPattern.test(trimmedValue)) {
      setUsernameError('Username should not start with a special character or space.');
      return false;
    }
    if (value[0] === ' ' || value[value.length - 1] === ' ') {
      setUsernameError('Username should not start or end with a space.');
      return false;
    }
    if (startsWithNumberPattern.test(trimmedValue)) {
      setUsernameError('Username should not start with a number.');
      return false;
    }
    if (specialCharInMiddleOrEndPattern.test(trimmedValue)) {
      setUsernameError('Username should not contain special characters.');
      return false;
    }
    return true;
  };
  
  const validateImageURL = (value: string) => {
    const trimmedValue = value.trim();
    const urlPattern = URL_PATTERN;
    if (!urlPattern.test(trimmedValue)) {
      setImageURLError('Invalid image URL. It should start with "https://" and end with ".jpg", ".jpeg", or ".png".');
      return false;
    }
    // return urlPattern.test(trimmedValue);
    return true;
  };
  
  

  return (
    <div className="dietary-preferences">
      {/* Username input and error message */}
      <input 
        type='text' 
        placeholder='Enter your username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {usernameError && <p className="error-message">{usernameError}</p>}
      
      {/* Image URL input and error message */}
      <input 
        type='text' 
        placeholder='Enter image URL' 
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />
      {imageURLError && <p className="error-message">{imageURLError}</p>}
      
      <br />
      <button className='button_design' onClick={handleUpdate}>Update</button>
      {updateError && <p className="error-message">{updateError}</p>}
    </div>
  );
};

export default DietaryPreferences;
