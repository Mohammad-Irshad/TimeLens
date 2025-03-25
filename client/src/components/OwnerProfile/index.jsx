import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux'
import { authServerAxios, googleApiAxios } from "../../lib/axios.lib";
import { useLocation } from "react-router-dom";
import { saveLoginUser } from "../../app/features/userSlice";

export const GoogleProfile = () => {
  const [userData, setUserData] = useState(null);
  const googleAccessToken = Cookies.get("google_access_token") || "";

  const dispatch = useDispatch()
  const { logedInUser } = useSelector((state) => state.user)

  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const access_token = queryParams.get("access_token")

  sessionStorage.setItem("access_token", access_token)


  useEffect(() => {
    (async () => {
      if (googleAccessToken) {
        try {
          // Retrieve user info
          const userResponse = await googleApiAxios.get("/userinfo", {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          });

          if (!userData || userData.email !== userResponse.data.email) {
            setUserData(userResponse.data);  // Only update state when needed
            dispatch(saveLoginUser(userResponse.data))
            window.location.href = "/gallery";
          }
        } catch (error) {
          window.location.href = "/";
          console.error(error);
          console.log(JSON.stringify(error, undefined, 2));
        }
      } else if (location.pathname.includes("v2")) {
        try {

          const response = await authServerAxios.get("/user/profile/google");
          if (!userData || userData.email !== response.data.email) {
            setUserData(response.data);  // Only update state when needed
            dispatch(saveLoginUser(response.data))
            window.location.href = "/gallery";
          }
        } catch (error) {
          if (error.status === 403 || error.status === 500) {
            window.location.href = "/";
            console.log(error)
          }
        }
      } else {
        console.log("Error occured")
        window.location.href = "/";
      }
    })();
  }, [googleAccessToken]);


  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-light bg-dark">
      <div className="card text-center p-4 shadow-lg" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          {/* Profile Picture */}
          <div className="d-flex justify-content-center mb-4">
            <div className="bg-secondary p-3 rounded-circle">
              <svg
                className="text-dark"
                strokeWidth="0"
                viewBox="0 0 488 512"
                height="6rem"
                width="6rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
            </div>
          </div>

          {/* User Info */}
          <h5 className="card-title">Hello, {userData?.name || userData?.email}!</h5>
          <p className="text-muted">You have logged in with: <strong>{userData?.email}</strong></p>
          <br />
          {userData?.profilePicture && (
            <img
              src={userData.profilePicture}
              alt="User Profile"
              className="rounded-circle border"
              width="120"
              height="120"
              referrerPolicy="no-referrer"
            />
          )}

        </div>
      </div>
    </div>
  );
};
