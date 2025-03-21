import React, { useEffect, useState } from 'react'
import SideBar from '../src/components/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { createAlbum, getAllTheAlbums } from '../src/app/features/albumSlice'
import AlbumCard from '../src/components/AlbumCard'

const Albums = () => {

    const logedInUser = useSelector((state) => state?.user?.logedInUser)
    const { allAlbums, status } = useSelector((state) => state.album)
    const [filteredAlbum, setFilteredAlbum] = useState([])

    const [newAlbumData, setNewAlbumData] = useState({
        name: '',
        description: '',
        ownerId: logedInUser._id
    })

    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setNewAlbumData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleAddAlbum = async () => {
        try {
            const response = await dispatch(createAlbum(newAlbumData)).unwrap();

            if (response) {
                setFilteredAlbum((prevAlbums) => [...prevAlbums, response.album]); // Instant UI update
                setNewAlbumData({
                    name: '',
                    description: '',
                    ownerId: logedInUser._id
                });
            }
        } catch (error) {
            console.error("Failed to create album:", error);
        }
    };



    const searchAlbum = (e) => {
        const value = e.target.value.toLowerCase().trim()
        const results = allAlbums.filter((alb) => alb.name.toLowerCase().trim().includes(value))
        setFilteredAlbum(results)
    }

    useEffect(() => {
        if (logedInUser) {
            dispatch(getAllTheAlbums(logedInUser?._id))
        }
    }, [logedInUser, dispatch]) // ✅ Run only when user changes

    // ✅ Update filteredAlbum when allAlbums changes
    useEffect(() => {
        if (status === 'success' && allAlbums?.length > 0) {
            setFilteredAlbum(allAlbums)
        }
    }, [allAlbums, status])



    return (
        <div className="container-fluid vh-100 bg-body-secondary">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <SideBar />
                </div>

                <div className="col-md-9 col-lg-10 bg-light p-4">
                    <input type='text' placeholder='Search album...' className='form-control' onChange={searchAlbum} />

                    <div className='d-flex justify-content-between mt-4'>
                        <h3>Your Albums</h3>
                        <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#albumModal">+ Add Album</button>
                    </div>
                    {filteredAlbum === 'loading' ? (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-success fw-bold">Fetching your albums... Please wait! 🎵</p>
                        </div>
                    ) : filteredAlbum.length === 0 ? (
                        <div className="text-center mt-4">
                            <p className="text-danger fw-bold">No albums found. Start creating your memories! 🎨</p>
                        </div>
                    ) : (
                        <AlbumCard allAlbums={filteredAlbum} />
                    )}


                </div>
            </div>

            <div className="modal fade" id="albumModal" tabIndex="-1" aria-labelledby="albumModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="albumModalLabel">Add a album</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type='text' placeholder='Enter album name' name='name' value={newAlbumData.name} onChange={handleOnChange} className='form-control' /><br />
                            <input type='text' placeholder='Enter album description' name='description' value={newAlbumData.description} onChange={handleOnChange} className='form-control' />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddAlbum}>Add Album</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Albums
