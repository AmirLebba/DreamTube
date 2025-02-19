import React from "react";
import { useUpload } from "./UploadContext";

const ReviewStep = ({ title, description, file, thumbnail, setStep, handleUpload }) => {
    return (
        <div className="form-review">
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Video File:</strong> {file?.name}</p>
            {thumbnail && (
                <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail"
                    className="thumbnail-preview"
                />
            )}
            <button type="button" onClick={handleUpload} className="upload-button">
                Upload
            </button>
            <button type="button" onClick={() => setStep(2)} className="back-button">
                Back
            </button>
        </div>
    );
};

export default ReviewStep;