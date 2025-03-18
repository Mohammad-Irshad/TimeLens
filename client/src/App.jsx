// import { authServerAxios } from './lib';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleProfile, Home } from './components';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SignUp from '../pages/SignUp';
import Gallery from '../pages/Gallery';
import Albums from '../pages/Albums';
import Album from '../pages/Album';
import Favorite from '../pages/Favorite';
import SharedWithMe from '../pages/SharedWithMe';
import ProtectedRoute from './components/ProtectedRoute';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile',
    element: <Home />,
  },
  {
    path: '/v1/profile/google',
    element: <GoogleProfile />,
  },
  {
    path: '/v2/profile/google',
    element: <GoogleProfile />,
  },
  {
    path: '/signUp',
    element: <SignUp />
  },
  {
    path: '/gallery',
    element: (
      <ProtectedRoute>
        <Gallery />
      </ProtectedRoute>
    )

  },
  {
    path: '/albums',
    element: (
      <ProtectedRoute>
        <Albums />
      </ProtectedRoute>
    )
  },
  {
    path: '/album/:albumId/:albumName',
    element: (
      <ProtectedRoute>
        <Album />
      </ProtectedRoute>
    )
  },
  {
    path: "/favorite",
    element: (
      <ProtectedRoute>
        <Favorite />
      </ProtectedRoute>
    )
  },
  {
    path: "/sharedWithMe",
    element: (
      <ProtectedRoute>
        <SharedWithMe />
      </ProtectedRoute>
    )

  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
