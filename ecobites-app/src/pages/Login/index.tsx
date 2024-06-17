import React, { useState } from "react";
import { FormValues } from "../../common/types/LoginInterface";
import { useNavigate, Link } from "react-router-dom";
import { EmailErrorMsg, PasswordErrorMsg, ErrorMsg } from "../../common/constants/constants";
import styles from "./index.module.scss";
import axios from "axios";
import Navbar from "../../components/Navbar";
 
const LOGIN_URL = "http://localhost:8080/users/login";
 
function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
 
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!re.test(formValues.email)) {
      setEmailErrorMsg(EmailErrorMsg);
      return;
    } else {
      setEmailErrorMsg("");
    }
 
    if (!formValues.password || formValues.password.length < 8 || formValues.password.length > 15) {
      setPasswordErrorMsg(PasswordErrorMsg);
      return;
    } else {
      setPasswordErrorMsg("");
    }
   
    try {
      const response = await axios.post(
        LOGIN_URL,
        { email: formValues.email, password: formValues.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
 
      if (response.status === 200) {
        const { token, id } = response.data;
        sessionStorage.setItem('jwt_token', token);
        sessionStorage.setItem('user_id', id);
        navigate("/profile2");
      } else {
        setErrorMessage(ErrorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData.error) {
          setErrorMessage(errorData.status);
        } else {
          setErrorMessage(ErrorMsg);
        }
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };
 
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailErrorMsg("");
    setFormValues({ ...formValues, email: e.target.value });
  };
 
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordErrorMsg("");
    setFormValues({ ...formValues, password: e.target.value });
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>Log in</div>
        <form className={styles.cardBody} onSubmit={handleSubmit}>
          <div className={styles.textField}>
            <input
              type="email"
              id="Email"
              placeholder=""
              value={formValues.email}
              onChange={handleEmailChange}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              title={EmailErrorMsg}
              required
            />
            <label htmlFor="Email">E-mail</label>
            {emailErrorMsg && <p className={styles.errorMsg}>{emailErrorMsg}</p>}
          </div>
          <div className={styles.textField}>
            <input
              type="password"
              id="Password"
              placeholder=""
              value={formValues.password}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="Password">Password</label>
            {passwordErrorMsg && <p className={styles.errorMsg}>{passwordErrorMsg}</p>}
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
 
          <Link to="/forgetpassword" className={styles.forget}>
            Forget password?
          </Link>
          <button type="submit" className={styles.btn}>
            Log in
          </button>
          <p>
            Don&apos;t have an account?
            <Link to="/signup" className={styles.sign}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <Navbar/>
    </div>
  );
}
 
export default Login;
