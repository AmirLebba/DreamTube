import { createContext, useState, useContext } from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [step, setStep] = useState(1);

    return (
        <UploadContext.Provider value={{
            file, setFile,
            title, setTitle,
            description, setDescription,
            thumbnail, setThumbnail,
            step, setStep
        }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => useContext(UploadContext);
