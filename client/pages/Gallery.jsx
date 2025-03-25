import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../src/components/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTheAlbums } from '../src/app/features/albumSlice'
import { getAllTheImages, uploadAImage } from '../src/app/features/imageSlice'
import Photo from '../src/components/Photo'


const Gallery = () => {

    const fileInputRef = useRef()

    const [fileValidationError, setFileValidationError] = useState('')
    const [addImageLoader, setAddImageLoader] = useState(false)
    const [imagesLoading, setImagesLoading] = useState(true)
    const [imageUploadMessage, setImageUploadMessage] = useState('')


    const { allAlbums, status: albumStatus, error: albumError } = useSelector((state) => state.album);
    const { allImages, status: imageStatus, error: imageError } = useSelector((state) => state.image);
    const { logedInUser } = useSelector((state) => state.user);

    const [filteredImages, setFilteredImages] = useState(allImages);
    const [imageAndMetaData, setImageAndMetaData] = useState({
        image: null,
        albumId: '',
        ownerId: logedInUser._id,
        name: '',
        tags: [],
        persons: [],

    })

    console.log("logedIn user is : ", logedInUser)


    const dispatch = useDispatch()

    const handleMetaDataChange = (e) => {
        const { name, value } = e.target

        if (name === 'tags' || name === 'persons') {
            const data = value.split(',')
            setImageAndMetaData((pre) => ({ ...pre, [name]: data }))
        } else {
            setImageAndMetaData((pre) => ({ ...pre, [name]: value }))
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        const maxSize = 5 * 1024 * 1024; // 5MB max size
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

        if (file) {
            if (!allowedTypes.includes(file.type)) {
                setFileValidationError("Invalid file type. Please upload a JPG, PNG, GIF, or WEBP image.")
                return;
            }

            if (file.size > maxSize) {
                setFileValidationError("File size exceeds 5MB. Please upload a smaller file.")
                return;
            }

            setImageAndMetaData((prev) => ({ ...prev, image: file }))
            setFileValidationError("")
        }
    }

    const submithandler = async (e) => {
        if (imageAndMetaData.image === null || imageAndMetaData.albumId === '' || imageAndMetaData.name === '' || imageAndMetaData.tags === '' || imageAndMetaData.persons === '') {
            setFileValidationError("All fields are mandatory!")
            return
        }

        try {
            setAddImageLoader(true)
            const result = await dispatch(uploadAImage(imageAndMetaData)).unwrap()
            setFilteredImages((prevImages) => {
                return [...prevImages, result.uploadedImage]
            })
            setImageUploadMessage("Image uploaded successfully")
            clearFormData()
            await dispatch(getAllTheImages(logedInUser._id))
        } catch (error) {
            console.log("Can't upload the image : ", error)
        } finally {
            setAddImageLoader(false)
        }
        setTimeout(() => {
            setImageUploadMessage("")
        }, 3000)
    }

    const clearFormData = () => {
        setImageAndMetaData({
            image: null,
            albumId: '',
            ownerId: logedInUser._id,
            name: '',
            tags: [],
            persons: [],
        })
        if (fileInputRef.current) fileInputRef.current.value = null
        setFileValidationError('')
    }

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase().trim();
        const results = allImages.filter((img) =>
            img.tags.some(tag => tag.toLowerCase().trim().includes(value)) ||
            img.persons.some(person => person.toLowerCase().trim().includes(value))
        );
        setFilteredImages(results);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(getAllTheAlbums(imageAndMetaData.ownerId));
                setImagesLoading(true)
                const result = await dispatch(getAllTheImages(logedInUser._id)).unwrap()
                setFilteredImages(result.allImages)
            } catch (error) {
                console.error("Error while fetching data:", error)
            } finally {
                setImagesLoading(false)
            }
        };
        fetchData()
    }, [])


    return (
        <div className="container-fluid vh-100 bg-body-secondary">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <SideBar />
                </div>

                <div className="col-md-9 col-lg-10 bg-light p-4">
                    <input type='text' placeholder='Search photo...' className='form-control' onChange={handleSearch} />

                    <div className='d-flex justify-content-between my-4'>
                        <h3>Your Photos</h3>
                        <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#photoModal">+ Add Photo</button>
                    </div>
                    {imagesLoading ? (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-success fw-bold">Fetching your images... Hang tight! 📸</p>
                        </div>

                    ) : filteredImages.length === 0 ? (
                        <div className="text-center mt-4">
                            <i className="bi bi-image text-danger" style={{ fontSize: "2rem" }}></i>
                            <p className="mt-2 text-danger fw-bold">No images found. Time to capture some amazing moments! 🎥✨</p>
                        </div>
                    ) : (
                        <Photo allImages={filteredImages} />
                    )}
                </div>
            </div>

            <div className="modal fade" id="photoModal" tabIndex="-1" aria-labelledby="photoModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="photoModalLabel">Add a photo</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label className='form-label' htmlFor='chooseAPhoto'>Choose a image: </label>
                                <input type='file' className='form-control form-control-sm' id='chooseAPhoto' ref={fileInputRef} onChange={handleFileChange} />
                                {fileValidationError && <p style={{ color: "red", marginTop: "10px" }}>{fileValidationError}</p>}
                                <label className='form-label mt-2' htmlFor='selectAlbum'>Select a album: </label>
                                <select className="form-select form-select-sm" id='selectAlbum' name='albumId' value={imageAndMetaData.albumId} onChange={handleMetaDataChange}>
                                    <option value="">Select a album</option>
                                    {allAlbums && allAlbums.map((alb) => (
                                        <option key={alb._id} value={alb._id}>{alb.name}</option>
                                    ))}
                                </select>
                                <label className='form-label mt-2' htmlFor='imageName'>Name the image: </label>
                                <input type='text' placeholder='Enter Image name' id='imageName' className='form-control form-control-sm' name='name' value={imageAndMetaData.name} onChange={handleMetaDataChange} />
                                <label className='form-label mt-2' htmlFor='imageTag'>Add tags: </label>
                                <input type='text' placeholder='Enter Image tags separated by comma (Ex: beach, sunset)' id='imageTag' className='form-control form-control-sm' name='tags' value={imageAndMetaData.tags} onChange={handleMetaDataChange} />
                                <label className='form-label mt-2' htmlFor='imageTagPerson'>Tag people: </label>
                                <input type='text' placeholder='Enter person name separated by comma (Ex: shahrukh, salman)' id='imageTagPerson' className='form-control form-control-sm' name='persons' value={imageAndMetaData.persons} onChange={handleMetaDataChange} />
                            </form>
                        </div>
                        {imageUploadMessage && <p className='text-success container'>{imageUploadMessage}</p>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearFormData}>Close</button>
                            {
                                addImageLoader ?
                                    <div class="spinner-border text-danger" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div> :
                                    <button type="button" className="btn btn-primary" onClick={submithandler}>Add Image</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gallery
