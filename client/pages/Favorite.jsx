import React from 'react'
import SideBar from '../src/components/SideBar'
import { useSelector } from 'react-redux'
import Photo from '../src/components/Photo'

const Favorite = () => {

    const { allImages } = useSelector((state) => state.image)

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
                    <Photo allImages={favImages} />
                </div>
            </div>

        </div>
    )
}

export default Favorite
