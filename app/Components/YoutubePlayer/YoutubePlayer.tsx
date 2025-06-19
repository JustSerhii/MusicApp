import React, { useEffect } from "react";
import styled from "styled-components";

// =======================
// Styled components
// =======================
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

// =======================
// Props type
// =======================
export interface YoutubePlayerProps {
  videoId: string;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
}

// =======================
// Main component
// =======================
const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  videoId,
  isMuted,
  setIsMuted,
}) => {
  // Load YouTube Iframe API once
  useEffect(() => {
    if (!document.getElementById("youtube-iframe-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-script";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  // Handle mute/unmute via postMessage
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("#youtube-player");
    if (iframe) {
      const message = isMuted
        ? '{"event":"command","func":"mute","args":""}'
        : '{"event":"command","func":"unMute","args":""}';
      iframe.contentWindow?.postMessage(message, "*");
    }
  }, [isMuted]);

  return (
    <PlayerContainer>
      <VideoContainer>
        <iframe
          id="youtube-player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Player"
        ></iframe>
      </VideoContainer>
    </PlayerContainer>
  );
};

export default YoutubePlayer;
