import React, { useEffect } from 'react'
import SideBar from '../src/components/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTheSharedAlbums } from '../src/app/features/albumSlice'
import AlbumCard from '../src/components/AlbumCard'

const SharedWithMe = () => {

    const { logedInUser } = useSelector((state) => state.user)
    const { albumsSharedwithMe } = useSelector((state) => state.album)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllTheSharedAlbums(logedInUser.email))
    }, [logedInUser])



    return (
        <div className="container-fluid vh-100 bg-body-secondary">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <SideBar />
                </div>

                <div className="col-md-9 col-lg-10 bg-light p-4">
                    <h3 className='mb-3'>Albums shared with you</h3>
                    <hr />
                    {albumsSharedwithMe &&
                        <AlbumCard sharedAlbums={albumsSharedwithMe} />
                    }
                </div>
            </div>

        </div>
    )
}

export default SharedWithMe
