import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Upload from "./upload/Upload";
import VideoBrowser from "./Browse/VideoBrowser";
import VPlayer from "./Player/VPlayer";
import LoginRegisterHandler from "./Login/LoginRegisterHandler";
import ProtectedRoute from "./ProtectRoutes/ProtectRoutes";
import Profile from "./ProfilePage/Profile";
import { UploadProvider } from "./upload/UploadContext"; // Ensure correct path

import "./App.css";
import "video.js/dist/video-js.css";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <UploadProvider> {/* Wrap UploadProvider around Routes */}
                    <Routes>
                        <Route path="/" element={<VideoBrowser />} />
                        <Route path="/upload" element={<ProtectedRoute element={<Upload />} />} />
                        <Route path="/video/:id" element={<VPlayer />} />
                        <Route path="/register" element={<LoginRegisterHandler defaultView="false"/>} />
                        <Route path="/login" element={<LoginRegisterHandler defaultView="true"/>} />
                        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                    </Routes>
                </UploadProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
