import { useUpload } from "./UploadContext";
import { useEffect, useState } from "react";

const FileUploadStep = ({ file, setFile, setStep }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("video/")) {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid video file.");
        }
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            {previewUrl && <video src={previewUrl} controls />}
            <button type="button" onClick={() => setStep(2)} disabled={!file}>
                Next
            </button>
        </div>
    );
};

export default FileUploadStep;