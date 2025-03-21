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
                    {albumsSharedwithMe === undefined || albumsSharedwithMe === null ? (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-primary fw-bold">Fetching your shared albums... Hang tight! 😊</p>
                        </div>
                    ) : albumsSharedwithMe.length === 0 ? (
                        <div className="text-center mt-4">
                            <i className="bi bi-folder-x text-danger" style={{ fontSize: "2rem" }}></i>
                            <p className="mt-2 text-danger fw-bold">No shared albums found. Ask your friends to share some memories with you! 🎁</p>
                        </div>
                    ) : (
                        <AlbumCard allAlbums={null} sharedAlbums={albumsSharedwithMe} />
                    )}


                </div>
            </div>
        </div>
    )
}

export default SharedWithMe
