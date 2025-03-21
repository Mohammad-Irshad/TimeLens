import React from 'react'
import SideBar from '../src/components/SideBar'
import { useSelector } from 'react-redux'
import Photo from '../src/components/Photo'

const Favorite = () => {

    const { allImages, status } = useSelector((state) => state.image)

    const favImages = allImages.filter((img) => img.isFavorite)



    return (
        <div className="container-fluid vh-100 bg-body-secondary">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <SideBar />
                </div>
                <div className="col-md-9 col-lg-10 bg-light p-4">
                    <h3 className='mb-3'>Your Favorite Images</h3>
                    <hr />
                    {status === 'loading' ? (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-success fw-bold">Fetching your favorite images... Hold tight! 🌟</p>
                        </div>
                    ) : favImages.length === 0 ? (
                        // No favorite images found
                        <div className="text-center mt-4">
                            <p className="text-danger fw-bold">No favorite images found. Start marking your favorites! ❤️</p>
                        </div>
                    ) : (
                        // Display favorite images
                        <Photo allImages={favImages} />
                    )}
                </div>
            </div>

        </div>
    )
}

export default Favorite
