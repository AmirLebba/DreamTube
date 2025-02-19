import React, { useRef } from "react";

const ThumbnailGenerator = ({ file, setThumbnail }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleGenerateThumbnail = () => {
        if (!videoRef.current || !canvasRef.current) {
            console.error("Video or canvas reference is missing.");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const width = 320;
        const height = (video.videoHeight / video.videoWidth) * width;
        canvas.width = width;
        canvas.height = height;

        context.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    setThumbnail(blob);
                } else {
                    console.error("Failed to generate thumbnail blob.");
                }
            },
            "image/jpeg",
            0.9
        );
    };

    return (
        <>
            <video ref={videoRef} src={URL.createObjectURL(file)} controls className="video-preview" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={handleGenerateThumbnail} className="generate-thumbnail-button">Capture Thumbnail</button>
        </>
    );
};

export default ThumbnailGenerator;
