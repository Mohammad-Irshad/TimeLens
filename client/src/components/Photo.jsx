import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash, faComments, faComment, faUser } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTheImage, getAllTheImages, toggleFavorite, updateComment, updateTheImage } from '../app/features/imageSlice'

const Photo = ({ allImages, isShared = false }) => {
    const [imageComment, setImageComment] = useState('')
    const [photos, setPhotos] = useState(allImages)

    const { logedInUser } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // Update local photos when allImages prop changes
    useEffect(() => {
        setPhotos(allImages)
    }, [allImages])

    const favoriteToggler = (image) => {
        const newFavoriteStatus = !image.isFavorite
        // Optimistically update the local state to reflect the change immediately
        setPhotos(prevPhotos =>
            prevPhotos.map(img =>
                img._id === image._id ? { ...img, isFavorite: newFavoriteStatus } : img
            )
        )
        // Dispatch actions to update the backend
        dispatch(toggleFavorite({ imageId: image._id }))
        dispatch(updateTheImage({ id: image._id, updatedData: { isFavorite: newFavoriteStatus } }))
    }

    const deleteHandler = async (image) => {
        // Optimistically update UI by filtering out the deleted image
        const updatedPhotos = photos.filter((img) => img._id !== image._id);
        setPhotos(updatedPhotos);

        try {
            await dispatch(deleteTheImage(image._id));
        } catch (error) {
            console.error("Failed to delete image:", error);
            // Rollback UI if deletion fails
            setPhotos(photos);
        }
    };


    const commentHandler = async (image) => {
        if (!imageComment.trim()) return; // Prevent empty comments

        const newComment = {
            userName: logedInUser.name,
            userEmail: logedInUser.email,
            userComment: imageComment,
        };

        // Optimistic UI Update
        setPhotos((prevPhotos) =>
            prevPhotos.map((img) =>
                img._id === image._id ? { ...img, comments: [newComment, ...img.comments] } : img
            )
        );

        try {
            await dispatch(updateTheImage({ id: image._id, updatedData: { comments: [newComment, ...image.comments] } }));
        } catch (error) {
            console.error("Failed to update comment:", error);
        }

        setImageComment(""); // Clear input field after submitting
    };

    return (
        <>
            <div className="row">
                {photos.length > 0 ? photos.map((image) => (
                    <div className="col-md-3 mb-3" key={image._id}>
                        <div className="card">
                            <div className="card-body">
                                <img
                                    src={image.imageUrl}
                                    alt="image"
                                    title={`${image.name}`}
                                    className="img-fluid rounded"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#imageModal${image._id}`}
                                    style={{ cursor: "pointer" }}
                                />
                                <br />
                                <hr />
                                <div className="d-flex justify-content-around">
                                    {!isShared && (
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            title={image.isFavorite ? "Remove Favorite" : "Mark Favorite"}
                                            style={{ color: image.isFavorite ? "orange" : "black", cursor: "pointer" }}
                                            onClick={() => favoriteToggler(image)}
                                        />
                                    )}
                                    <FontAwesomeIcon
                                        icon={faComments}
                                        style={{ cursor: "pointer", color: "green" }}
                                        title="Comment"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#imageModal${image._id}`}
                                    />
                                    {!isShared && (
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ cursor: "pointer", color: "red" }}
                                            title="Delete"
                                            onClick={() => deleteHandler(image)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <section>
                            <div
                                className="modal fade"
                                id={`imageModal${image._id}`}
                                tabIndex="-1"
                                aria-labelledby={`imageModalLabel${image._id}`}
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id={`imageModalLabel${image._id}`}>
                                                {image.name}
                                            </h1>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="card">
                                                <img
                                                    src={image.imageUrl}
                                                    className="card-img-top"
                                                    alt={`${image.name}_image`}
                                                />
                                                <div className="card-body">
                                                    <div>
                                                        <strong>Tags: </strong>
                                                        {image.tags.map((tag, ind) => <span className="badge bg-primary me-1" key={ind}>{tag}</span>)}
                                                    </div>

                                                    <div className="mt-2">
                                                        <strong>Tagged People: </strong>{image.persons.map((per, ind) => <span className="badge bg-success me-1" key={ind}>{per}</span>)}
                                                    </div>

                                                    <hr />
                                                    <h6 className="mb-3">Add your comments below</h6>
                                                    <div className="d-flex justify-content-between">
                                                        <input
                                                            type="text"
                                                            value={imageComment}
                                                            placeholder="Comment here..."
                                                            className="form-control form-control-sm"
                                                            onChange={(e) => setImageComment(e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-success ms-3"
                                                            onClick={() => commentHandler(image)}
                                                        >
                                                            Comment
                                                        </button>
                                                    </div>
                                                    <hr />
                                                    {image.comments &&
                                                        image.comments.map((cmt) => (
                                                            <div
                                                                key={cmt._id}
                                                                className="p-3 mb-2 border rounded bg-light"
                                                            >
                                                                <small className="text-muted">
                                                                    <span>
                                                                        <FontAwesomeIcon icon={faUser} />
                                                                    </span>{" "}
                                                                    @{cmt.userName}_{cmt.userEmail}
                                                                </small>
                                                                <p className="mb-0">
                                                                    <span>
                                                                        <small>
                                                                            <FontAwesomeIcon icon={faComment} />
                                                                        </small>
                                                                    </span>{" "}
                                                                    {cmt.userComment}
                                                                </p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )) : (
                    <div className="text-center mt-4">
                        <p className="text-danger fw-bold">
                            You don't have any images to display — add some! 📸
                        </p>
                    </div>

                )}
            </div>
        </>
    )
}

export default Photo