import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./VideoPlayer.css";

const VideoPlayer = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState(null);
    const [isLoadingQuality, setIsLoadingQuality] = useState(false);

    // Fetch video metadata
    const { data: video, isLoading, error } = useQuery({
        queryKey: ["video", id],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:8000/api/videos/${id}/metadata`
            );
            return response.data;
        },
    });

    // Extract available video URLs
    const videoUrls = video?.video_urls || {};

    // Set default quality when video data is loaded
    useEffect(() => {
        if (!currentQuality && videoUrls) {
            setCurrentQuality(
                videoUrls["720p"] || videoUrls["1080p"] || videoUrls["480p"] || Object.values(videoUrls)[0] || ""
            );
        }
    }, [videoUrls, currentQuality]);

    // Quality change handler
    const handleQualityChange = async (url) => {
        if (!videoRef.current) return;
        setIsLoadingQuality(true);

        try {
            const currentTime = videoRef.current.currentTime;
            videoRef.current.pause(); // Pause before changing source
            videoRef.current.src = url;
            videoRef.current.load();

            // Wait for the video to load and resume playback
            videoRef.current.addEventListener("canplay", function onCanPlay() {
                videoRef.current.currentTime = currentTime;
                videoRef.current.play().catch((err) => console.error("Autoplay prevented:", err));
                setIsLoadingQuality(false);
                videoRef.current.removeEventListener("canplay", onCanPlay);
            }, { once: true }); // Use { once: true } to automatically remove the event listener
        } catch (e) {
            console.error("Failed to change video quality:", e);
            alert("An error occurred while changing the video quality.");
            setIsLoadingQuality(false);
        }
    };

    // Playback error handler
    const handleError = () => {
        alert("An error occurred while playing the video. Please try again later.");
    };

    if (isLoading) return <div className="loading">Loading video...</div>;
    if (error) return <div className="error">Error loading video: {error.message}</div>;

    return (
        <div className="video-player-container">
            {/* Video Player */}
            <div className="video-wrapper">
                <video
                    controls
                    ref={videoRef}
                    src={currentQuality}
                    className="html5-video-player"
                    onError={handleError}
                    poster={video?.thumbnail_url || "default-thumbnail.jpg"}
                    autoPlay // Automatically start playing the video
                    muted // Mute the video to allow autoplay in most browsers
                >
                    Your browser does not support the video tag.
                </video>
                {isLoadingQuality && <div className="loading-spinner">Changing quality...</div>}
            </div>

            {/* Title */}
            <h1 className="video-title">{video?.title || "Untitled Video"}</h1>
            <div className="video-description">
                <div className="video-metadata">
                    <p>Published on: {new Date(video?.created_at).toLocaleDateString()}</p>
                    <p>Views: {video?.views || 0}</p>
                </div>
                <p>{video?.description || "No description available."}</p>
            </div>

            {/* Quality Selector */}
            <div className="quality-selector">
                <h3>Select Quality:</h3>
                {Object.keys(videoUrls).length > 0 ? (
                    Object.entries(videoUrls).map(([label, url]) => (
                        <button
                            key={label}
                            onClick={() => handleQualityChange(url)}
                            className={`quality-button ${currentQuality === url ? "active-quality" : ""}`}
                            disabled={isLoadingQuality}
                        >
                            {label}
                        </button>
                    ))
                ) : (
                    <p>No additional qualities available.</p>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;