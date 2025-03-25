import { faImage, faImages, faStar, faSquareShareNodes, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { logoutUser } from '../app/features/userSlice';


const SideBar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = () => {
        dispatch(logoutUser())
        navigate("/")
    }

    return (
        <div className="">
            <h4 className="my-3 ms-3 fw-bold" style={{
                fontSize: "2rem",
                fontWeight: "700",
                fontFamily: "'Pacifico', cursive",
                color: "#ff6b6b", // Soft coral red
                textShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)"
            }}>
                Time<span style={{ color: "#48C9B0" }}>Lens</span>
            </h4>

            <nav className="nav flex-column">
                <NavLink
                    to={"/gallery"}
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link text-danger  fw-medium fst-italic "
                            : "nav-link text-white"
                    }
                >
                    <FontAwesomeIcon icon={faImage} className='me-3' /> Photos
                </NavLink>
                <NavLink
                    to={"/albums"}
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link text-danger  fw-medium fst-italic"
                            : "nav-link text-white"
                    }
                >
                    <FontAwesomeIcon icon={faPhotoFilm} className='me-3' />Albums
                </NavLink>
                <NavLink
                    to={"/favorite"}
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link text-danger  fw-medium fst-italic"
                            : "nav-link text-white"
                    }
                >
                    <FontAwesomeIcon icon={faStar} className='me-3' /> Favorite
                </NavLink>
                <NavLink
                    to={"/sharedWithMe"}
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link text-danger  fw-medium fst-italic"
                            : "nav-link text-white"
                    }
                >
                    <FontAwesomeIcon icon={faSquareShareNodes} className='me-3' /> &nbsp;Shared
                </NavLink>

            </nav>

            <button className='btn btn-sm btn-outline-danger mt-5 ms-3' onClick={handleLogOut}>LogOut</button>
        </div>
    )
}

export default SideBar
