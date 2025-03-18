import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { signUpUser } from '../src/app/features/userSlice'

const SignUp = () => {

    const [message, setMessage] = useState('')

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
            const result = await dispatch(signUpUser(userData)).unwrap()
            if (result) {
                setMessage("User Registered successfully!")
            }
        } catch (error) {
            console.log(error)
            setMessage("User registration failed!")
        }
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-light bg-dark">
            <div className="card text-center p-4 shadow-lg" style={{ width: "400px" }}>
                <div className='card-header'>
                    <h2>SignUp to TimeLens</h2>
                </div>
                <div className="card-body">

                    <input type='text' placeholder='Enter your name' name='name' value={userData.name} className='form-control' onChange={updateUserData} /><br />
                    <input type='email' placeholder='Enter your email' name='email' value={userData.email} className='form-control' onChange={(e) => updateUserData(e)} /><br />
                    <input type='password' placeholder='Enter your password' name='password' value={userData.password} className='form-control' onChange={(e) => updateUserData(e)} /><br />

                    <div className='text-start'>
                        <button className='btn btn-success' onClick={handleUserSingUp}>SignUp</button>
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
