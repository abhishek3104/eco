import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import Navbar from '../../components/Navbar';
interface FormData {
  username: string;
  email: string;
  password: string;
  image: string;
}
 
const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    image:'',
  });
 
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
 
  const navigate = useNavigate();
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };
 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formErrors: Partial<FormData> = {};
 
  if (!formData.username) {
      formErrors.username = 'Username is required';
  } else if (formData.username.length < 3 || formData.username.length > 25) {
      formErrors.username = 'Username must be between 3 and 25 characters';
  } else if (/^\s|\s$/.test(formData.username)) {
     formErrors.username = 'Username should not start or end with a space';
  } else if (/^[0-9_\W]/.test(formData.username[0])) {
     formErrors.username = 'Username should not start with a number, special character, or underscore';
  }
 
  if (!formData.email) {
      formErrors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
      formErrors.email = 'Invalid email address';
  } else if (/^[+\-.#$]/.test(formData.email)) {
      formErrors.email = 'Email should not start with a special character';
  }
 
  if (!formData.password) {
      formErrors.password = 'Password is required';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}/.test(formData.password)) {
      formErrors.password = 'Password must be between 8 and 15 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
 
  if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
  }
 
  try {
      setIsLoading(true);
      setApiError(null);
 
      const response = await fetch('http://localhost:8080/users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
 
      if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorMessage = 'An error occurred';
 
          if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
 
              const updatedErrors: Partial<FormData> = {};
 
              if (errorMessage.includes('Username')) {
                  updatedErrors.username = errorMessage;
              }
              if (errorMessage.includes('Email')) {
                  updatedErrors.email = errorMessage;
              }
 
              setErrors(prev => ({ ...prev, ...updatedErrors }));
          } else {
              errorMessage = await response.text();
          }
 
          throw new Error(errorMessage);
      }
 
      navigate('/login');
  } catch (error) {
      if (error instanceof Error) {
          // setApiError(error.message);
      } else {
          setApiError('An unexpected error occurred');
      }
  } finally {
      setIsLoading(false);
  }
};
 
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      re.test(email) &&
      (email.match(/@/g) || []).length === 1 &&
      (email.match(/\./g) || []).length === 1
    );
  };
 
  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {apiError && <p className="error">{apiError}</p>}
        <div className="form-group">
          <label htmlFor="username"></label>
          <input
            placeholder="Username*"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            placeholder="E-mail*"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            placeholder="Password*"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="login-section">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
      <Navbar/>
    </div>
  );
};
 
export default SignUpForm;