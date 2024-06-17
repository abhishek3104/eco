import React, { useState } from 'react';
import styles from "./index.module.scss";
import { EmailErrorMsg,ErrorMsg } from '../../common/constants/constants';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/forgot-password', { email });
      console.log(response.data.password);
      if (response.data && response.data.password) {
        setNewPassword(response.data.password);
        setSubmitted(true); 
      } else {
        setErrorMsg(ErrorMsg);
      }
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData.error) {
          setErrorMsg(errorData.status);
        } else {
          setErrorMsg(ErrorMsg);
        }
      } else {
        setErrorMsg(ErrorMsg);
      }
    }
  };
  
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>   
          {!submitted ? (
            // Render form only if not submitted
            <form data-testid="forgot-password-form" className={styles.cardBody} onSubmit={handleSubmit}>
              <div className={styles.cardHeader}> Forgot Password</div>
              <p className={styles.paragraph}>Don&apos;t worry, we&apos;ll provide you <br />
                               temporary password    </p>
              <div className={styles.textField}>
                <input
                  type="email"
                  id="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                  title={EmailErrorMsg}
                  className="email-input-error-class"
                  required
                />
                <label htmlFor='Email'>E-mail</label>
                {errorMsg && <p data-testid="error-message" className={styles.errorMsg}>{errorMsg}</p>}
              </div>
              <button type='submit' className={styles.btn}>Reset password</button>
            </form>
          ):( // Render success message if submitted
            <div className={styles.successMsg}>
                <h3>New Password</h3>
                <p>Your new temporary password is: <b>{newPassword}</b></p>
                <p className={styles.passmsg}>Please Change the password after logging in</p>
            </div>
          )}
        </div>
      </div>
      <Navbar/>
    </div>
  );
}
