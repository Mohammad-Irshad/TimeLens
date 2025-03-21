import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAAlbum, getAllTheAlbums, updateAAlbum } from '../app/features/albumSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePen, faTrash, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { deleteTheImage } from '../app/features/imageSlice'

const AlbumCard = ({ allAlbums, sharedAlbums = null }) => {

    const [desc, setDesc] = useState('')
    const [shareAlbumWith, setShareAlbumWith] = useState('')
    const [emailError, setEmailError] = useState('')
    const [addEmailSuccesslMessage, setAddEmailSuccessMessage] = useState('')
    const [albums, setAlbums] = useState(allAlbums)


    // const { allAlbums, status, error } = useSelector((state) => state.album)
    const { logedInUser } = useSelector((state) => state.user)
    const { allImages } = useSelector((state) => state.image)
    const dispatch = useDispatch()

    useEffect(() => {
        setAlbums(allAlbums)
    }, [allAlbums])

    const handelDescUpdate = async (alb) => {
        // Optimistic UI update
        const updatedAlbums = albums.map((album) =>
            album._id === alb._id ? { ...album, description: desc } : album
        );
        setAlbums(updatedAlbums);

        try {
            await dispatch(updateAAlbum({ id: alb._id, updatedData: { description: desc } }));
        } catch (error) {
            console.error("Failed to update description:", error);
            setAlbums(albums); // Rollback UI
        }
    };

    const albumDeleteHandler = async (alb) => {
        // Optimistic UI update (remove album from UI)
        const updatedAlbums = albums.filter((album) => album._id !== alb._id);
        setAlbums(updatedAlbums);

        try {
            const imagesToDelete = allImages.filter((img) => img.albumId === alb._id);
            imagesToDelete.forEach((img) => dispatch(deleteTheImage(img._id)))
            await dispatch(deleteAAlbum(alb._id))
        } catch (error) {
            console.error("Failed to delete album:", error);
            setAlbums(albums); // Rollback UI
        }
    };

    const validateUser = async (email) => {
        try {
            const response = await axios.get(`https://timelens-server.vercel.app/user/validate-user-email?email=${email}`)
            return response.data.isValid
        } catch (error) {
            console.error("Error validating user email:", error);
            return false;
        }
    }

    const albumShareHandler = async (alb) => {
        setEmailError("");
        if (shareAlbumWith === "") return;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(shareAlbumWith)) {
            setEmailError("Invalid Email address");
            return;
        }

        const isValidUser = await validateUser(shareAlbumWith);
        if (!isValidUser) {
            setEmailError("This email is not registered.");
            return;
        }

        // Optimistic UI update
        const updatedSharedWith = [...alb.sharedWith, shareAlbumWith];
        const updatedAlbums = albums.map((album) =>
            album._id === alb._id ? { ...album, sharedWith: updatedSharedWith } : album
        );
        setAlbums(updatedAlbums);

        try {
            await dispatch(updateAAlbum({ id: alb._id, updatedData: { sharedWith: updatedSharedWith } }));
            setAddEmailSuccessMessage("Email added to share list successfully!");
        } catch (error) {
            console.error("Failed to share album:", error);
            setAlbums(albums); // Rollback UI
        }

        setShareAlbumWith("");
        setTimeout(() => {
            setAddEmailSuccessMessage("");
        }, 3000);
    };

    const removeEmailHandler = async ({ alb, mail }) => {
        // Optimistic UI update
        const updatedList = alb.sharedWith.filter((email) => email !== mail);
        const updatedAlbums = albums.map((album) =>
            album._id === alb._id ? { ...album, sharedWith: updatedList } : album
        );
        setAlbums(updatedAlbums);

        try {
            await dispatch(updateAAlbum({ id: alb._id, updatedData: { sharedWith: updatedList } }));
        } catch (error) {
            console.error("Failed to remove email:", error);
            setAlbums(albums); // Rollback UI
        }
    };

    useEffect(() => {
        dispatch(getAllTheAlbums(logedInUser._id))
    }, [logedInUser])



    return (
        <div className="row mt-4">

            {sharedAlbums && (sharedAlbums || []).length > 0 ? (
                (sharedAlbums || []).map((alb) => (
                    <div className="col-md-4 mb-3" key={alb._id}>
                        <div className='card'>
                            <div className='card-body'>
                                <h4 className='card-title'>{alb.name}</h4>
                                <Link to={`/album/${alb._id}/${alb.name.replace(/\s+/g, '-')}?desc=${encodeURIComponent(alb.description)}&isShared=true`}>
                                    <img src={`https://assets.serenity.co.uk/38000-38999/38650/720x480.jpg`} alt='albumThumbnailImage' className='img-fluid rounded mb-3' />
                                </Link>
                                <p>{alb.description}</p>
                            </div>
                        </div>
                    </div>
                ))
            )
                :
                (
                    (albums || []).map((alb) => (
                        <div className="col-md-4 mb-3" key={alb._id}>
                            <div className='card'>
                                <div className='card-body'>
                                    <h4 className='card-title'>{alb.name}</h4>
                                    <Link to={`/album/${alb._id}/${alb.name.replace(/\s+/g, '-')}?desc=${encodeURIComponent(alb.description)}&isShared=false`}>
                                        <img src={`https://assets.serenity.co.uk/38000-38999/38650/720x480.jpg`} alt='albumThumbnailImage' className='img-fluid rounded mb-3' style={{ cursor: "pointer" }} />
                                    </Link>

                                    <p>{alb.description}</p>
                                    <div className='d-flex justify-content-around'>
                                        <FontAwesomeIcon icon={faFilePen}
                                            style={{ color: "#007bff", cursor: "pointer" }}
                                            title='Edit'
                                            data-bs-toggle="modal"
                                            data-bs-target={`#editAlbumModal-${alb._id}`}
                                            onClick={() => setDesc(alb.description)}
                                        />
                                        <FontAwesomeIcon icon={faShareNodes}
                                            style={{ color: "#fd7e14", cursor: "pointer" }}
                                            title='Share'
                                            data-bs-toggle="modal"
                                            data-bs-target={`#editAlbumShareModal-${alb._id}`}
                                            onClick={() => { setShareAlbumWith(''), setEmailError('') }}
                                        />
                                        <FontAwesomeIcon icon={faTrash}
                                            style={{ color: "#dc3545", cursor: "pointer" }}
                                            title='Delete'
                                            onClick={() => albumDeleteHandler(alb)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <section>
                                <div className="modal fade" id={`editAlbumModal-${alb._id}`} tabIndex="-1" aria-labelledby={`editAlbumModalLabel-${alb._id}`} aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id={`editAlbumModalLabel-${alb._id}`}>Edit in {alb.name}</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <input type='text' value={desc} onChange={(e) => setDesc(e.target.value)} className='form-control' />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button"
                                                    className="btn btn-primary"
                                                    data-bs-dismiss="modal"
                                                    onClick={() => handelDescUpdate(alb)}
                                                >Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="modal fade" id={`editAlbumShareModal-${alb._id}`} tabIndex="-1" aria-labelledby={`editAlbumShareModalLabel-${alb._id}`} aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id={`editAlbumShareModalLabel-${alb._id}`}>Edit shared user list - {alb.name}</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <input type='email' value={shareAlbumWith} placeholder='Enter email to whome you want to share...' onChange={(e) => setShareAlbumWith(e.target.value)} className='form-control' />
                                                {emailError && <p className='text-danger mt-3'>{emailError}</p>}
                                                {addEmailSuccesslMessage && <p className='text-success mt-3'>{addEmailSuccesslMessage}</p>}
                                                <hr />
                                                <div>
                                                    <h5>List of shared users</h5>
                                                    <ul className='list-group'>
                                                        {
                                                            alb.sharedWith.length > 0 ? alb.sharedWith.map((mail, ind) => (
                                                                <li key={`${mail}/${ind}`} className='list-group-item d-flex justify-content-between align-items-center'>
                                                                    <span>{mail}</span>
                                                                    <button className='btn btn-sm btn-danger' onClick={() => removeEmailHandler({ alb, mail })}>Delete</button>
                                                                </li>
                                                            ))
                                                                :
                                                                <p>Album is not shared with anyone yet</p>
                                                        }
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button"
                                                    className="btn btn-primary"
                                                    // data-bs-dismiss="modal"
                                                    onClick={() => albumShareHandler(alb)}
                                                >Add Mail</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))
                )
            }


        </div>
    )
}

export default AlbumCard
