import { useState } from 'react';
import '../Authentification/Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const url = "http://localhost:7022";

const Auth = () => {
  const [isActive, setIsActive] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: true
  });

  const toggleActive = () => setIsActive(!isActive);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });

    if (name === 'password') {
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(value);
      setPasswordError(valid ? '' : 'Password must contain uppercase, lowercase, and special character.');
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (passwordError) return;

    try {
      const response = await axios.post(url + '/api/Account/register', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      }, { headers: { "Content-Type": "application/json" }, withCredentials: true });

      alert('Registration successful! Please login.');
      setIsActive(false);
    } catch (error) {
      setRegisterError(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + '/api/Account/login', {
        username: loginData.username,
        password: loginData.password,
        rememberMe: loginData.rememberMe
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      const profileResponse = await axios.get(url + '/api/Account/profile', {
        withCredentials: true
      });

      if (profileResponse.data) {
        localStorage.setItem('user', JSON.stringify(profileResponse.data));
        localStorage.setItem('userId', profileResponse.data.id);
        localStorage.setItem('username', profileResponse.data.username);
      }

      navigate('/home');
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <input type="text" placeholder="Full Name" name="username" onChange={handleRegisterChange} required />
          <input type="email" placeholder="Enter E-mail" name="email" onChange={handleRegisterChange} required />
          <input type="password" placeholder="Enter Password" name="password" onChange={handleRegisterChange} required />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <span>Login With Email & Password</span>
          <input type="text" placeholder="Enter Username" name="username" onChange={handleLoginChange} required />
          <input type="password" placeholder="Enter Password" name="password" onChange={handleLoginChange} required />
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome To <br />AirBnB</h1>
            <p>Do You Have Account?</p>
            <button className="hidden" id="login" onClick={toggleActive}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hi Dear</h1>
            <h1>Customer</h1>
            <p>If You Don't Have Account</p>
            <button className="hidden" id="register" onClick={toggleActive}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
