import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { signUpUser } from '../src/app/features/userSlice'

const SignUp = () => {

    const [message, setMessage] = useState('')
    const [isSigningUp, setIsSigningUp] = useState(false)

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const dispatch = useDispatch()

    const updateUserData = (e) => {
        const { name, value } = e.target
        setUserData((preData) => ({
            ...preData, [name]: value
        }))
    }

    const handleUserSingUp = async () => {
        setMessage("")
        if (userData.email === '' || userData.name === '' || userData.password === '') {
            setMessage("Plase fill all details.")
            return
        }
        try {
            setIsSigningUp(true)
            const result = await dispatch(signUpUser(userData)).unwrap()
            if (result) {
                setMessage("User Registered successfully!")
            }
        } catch (error) {
            console.log(error)
            setMessage("User registration failed!")
        } finally {
            setIsSigningUp(false)
        }
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-light bg-dark">
            <div className="card text-center p-4 shadow-lg" style={{ width: "400px" }}>
                <div className='card-header'>
                    <h2
                        className="my-3 ms-3 fw-bold"
                        style={{
                            fontSize: "1.8rem",
                            fontWeight: "700",
                            fontFamily: "'Pacifico', cursive",
                            color: "#ff6b6b",
                            textShadow: "3px 3px 5px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <span style={{ color: "#2C3E50" }}>SignUp to </span>
                        Time
                        <span style={{ color: "#48C9B0" }}>Lens</span>
                    </h2>
                </div>
                <div className="card-body">

                    <input type='text' placeholder='Enter your name' name='name' value={userData.name} className='form-control' onChange={updateUserData} /><br />
                    <input type='email' placeholder='Enter your email' name='email' value={userData.email} className='form-control' onChange={(e) => updateUserData(e)} /><br />
                    <input type='password' placeholder='Enter your password' name='password' value={userData.password} className='form-control' onChange={(e) => updateUserData(e)} /><br />

                    <div className='d-grid'>
                        <button className='btn btn-success' onClick={handleUserSingUp}>
                            {isSigningUp ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm text-light me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Signing Up...
                                </>
                            ) : (
                                'SignUp'
                            )}
                        </button>
                    </div>
                    {message && <p className='mt-2'>{message}</p>}
                    <hr />
                    <Link to={'/'}>Already have an account? Login!</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp
