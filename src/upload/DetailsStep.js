import React, { useState } from "react";
import { useUpload } from "./UploadContext";
import ThumbnailGenerator from "./ThumbnailGenerator";

const DetailsStep = ({
    file,
    title,
    setTitle,
    description,
    setDescription,
    thumbnail,
    setThumbnail,
    setStep,
}) => {
    const [personalThumbnail, setPersonalThumbnail] = useState(true);

    return (
        <>
            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="thumbnail-section">
                <label>
                    <input
                        type="checkbox"
                        checked={personalThumbnail}
                        onChange={() => setPersonalThumbnail(!personalThumbnail)}
                    />
                    Personal Thumbnail
                </label>

                {personalThumbnail ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                        />
                        {thumbnail && (
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt="Thumbnail Preview"
                                className="thumbnail-preview"
                            />
                        )}
                    </>
                ) : (
                    file && (
                        <ThumbnailGenerator file={file} setThumbnail={setThumbnail} />
                    )
                )}
            </div>

            <button type="button" onClick={() => setStep(3)} className="next-button">
                Next
            </button>
            <button type="button" onClick={() => setStep(1)} className="back-button">
                Back
            </button>
        </>
    );
};

export default DetailsStep;