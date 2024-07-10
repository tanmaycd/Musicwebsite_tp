// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './signup.css'
// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
//       if (response.status === 201) {
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleSignup}>Signup</button>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css'; // Import your custom CSS file

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form>
        <div className="form-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <button type="button" onClick={handleSignup}>Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
