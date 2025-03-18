import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const ProtectedRoute = ({ children }) => {
    const accessToken = sessionStorage.getItem("access_token")
    if (!accessToken) {
        return <Navigate to={"/"} replace />
    }

    try {
        const decodedToken = jwtDecode(accessToken)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
            sessionStorage.removeItem("access_token")
            return <Navigate to={"/"} replace />
        }
        return children
    } catch (error) {
        sessionStorage.removeItem("access_token")
        return <Navigate to={"/"} replace />
    }

}

export default ProtectedRoute
















// The replace prop prevents the previous page from being added to the history stack.
