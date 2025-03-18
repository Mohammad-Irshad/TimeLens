import React, { useEffect } from 'react'
import SideBar from '../src/components/SideBar'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Photo from '../src/components/Photo';
import { getAnAlbumImages } from '../src/app/features/imageSlice';

const Album = () => {

    const { albumId, albumName } = useParams();

    const queryParams = new URLSearchParams(useLocation().search)

    const description = queryParams.get("desc")
    const isShared = queryParams.get("isShared") === "true"

    const { allImages } = useSelector((state) => state.image)

    const thisAlbumImages = allImages.filter((img) => img.albumId === albumId)

    const { anAlbumImages } = useSelector((state) => state.image)

    const dispatch = useDispatch()

    useEffect(() => {
        if (albumId) {
            dispatch(getAnAlbumImages(albumId))
        }
    }, [albumId])

    return (
        <div className="container-fluid vh-100 bg-body-secondary">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <SideBar />
                </div>

                <div className="col-md-9 col-lg-10 bg-light p-4">
                    <h3>Album : {albumName.replace(/-/g, ' ')}</h3>
                    <h4>Description : {description}</h4>
                    <hr />
                    <Photo allImages={isShared ? anAlbumImages : thisAlbumImages} isShared={isShared} />
                </div>
            </div>

        </div>
    )
}

export default Album
