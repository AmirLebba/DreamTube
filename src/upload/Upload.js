import React, { useState } from "react";
import FileUploadStep from "./FileUploadStep";
import DetailsStep from "./DetailsStep";
import ReviewStep from "./ReviewStep";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.scss";

const UploadForm = () => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUpload = async () => {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || !user.id) {
            setMessage("You must be logged in to upload a video.");
            return;
        }

        if (!thumbnail) {
            setMessage("Thumbnail is not generated.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);
        formData.append("title", title || "");
        formData.append("description", description || "");
        formData.append("user_id", user.id);

        if (thumbnail instanceof Blob) {
            const fileThumbnail = new File([thumbnail], "thumbnail.jpg", {
                type: "image/jpeg",
            });
            formData.append("thumbnail", fileThumbnail);
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/videos",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (event) => {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        setProgress(percent);
                        if (percent === 100) {
                            setMessage(
                                "Video uploaded successfully! Processing will begin shortly."
                            );
                            setTimeout(() => {
                                navigate("/");
                            }, 3000);
                        }
                    },
                }
            );
        } catch (error) {
            console.error("Error response:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Error uploading video.");
        }
    };

    const resetForm = () => {
        setFile(null);
        setThumbnail(null);
        setTitle("");
        setDescription("");
        setProgress(0);
        setStep(1);
    };

    return (
        <div className="upload-container">
            <h2>Upload Video</h2>
            {message && <p className="message">{message}</p>}
            <div className="upload-form">
                {step === 1 && (
                    <FileUploadStep
                        file={file}
                        setFile={setFile}
                        setStep={setStep}
                    />
                )}
                {step === 2 && (
                    <DetailsStep
                        file={file}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        thumbnail={thumbnail}
                        setThumbnail={setThumbnail}
                        setStep={setStep}
                    />
                )}
                {step === 3 && (
                    <ReviewStep
                        title={title}
                        description={description}
                        file={file}
                        thumbnail={thumbnail}
                        setStep={setStep}
                        handleUpload={handleUpload}
                    />
                )}
            </div>
            {progress > 0 && (
                <div className="progress-bar">Upload Progress: {progress}%</div>
            )}
        </div>
    );
};

export default UploadForm;