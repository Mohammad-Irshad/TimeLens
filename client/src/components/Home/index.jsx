import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../app/features/userSlice";

export const Home = () => {

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [loginData, setLoginData] = useState({
    email: 'kingkhan@gmail.com',
    password: '1234'
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { logedInUser } = useSelector((state) => state.user)

  // console.log("LogedIn user : ", logedInUser)

  const handleLoginData = (e) => {
    const { name, value } = e.target
    setLoginData((prevData) => ({ ...prevData, [name]: value }))
  }


  const handleLogin = async () => {
    setMessage(null)
    if (loginData.email === '' || loginData.password === '') {
      setMessage('Plase fill all details.')
      return
    }

    try {
      setIsLoading(true)
      const result = await dispatch(loginUser(loginData)).unwrap()
      if (result) {
        sessionStorage.setItem("access_token", result.accessToken)
        navigate('/gallery')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }



  const authenticateViaOAuth = async (method) => {
    try {
      window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/${method}`; // Call to backend
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-dark text-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <div className="card-header text-center">
          <h2 className="">Login to TimeLens</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input type="email" placeholder="Enter email" name="email" value={loginData.email} className="form-control" onChange={handleLoginData} />
          </div>
          <div className="mb-3">
            <input type="password" placeholder="Enter password" name="password" value={loginData.password} className="form-control" onChange={handleLoginData} />
          </div>
          {message && <p className="text-center text-danger">{message}</p>}
          <div className="d-grid">
            {isLoading ?
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              :
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            }

          </div>
          <p className="text-center mt-3">OR</p>
          <div className="d-flex align-items-center justify-content-center">
            <button
              onClick={() => authenticateViaOAuth('google')}
              className="btn btn-light d-flex align-items-center gap-2"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 488 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Login with Google
            </button>
          </div>
          <hr />
          <a href="" className="text-center mt-3"></a>
          <Link to={'/signup'}>Don't have an account? SingUp!</Link>
        </div>
      </div>
    </div>
  );
};
