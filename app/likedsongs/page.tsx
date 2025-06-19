"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import YoutubePlayer from "../Components/YoutubePlayer/YoutubePlayer";
import { grid, simplelist } from "@/app/utils/Icons";
import { autoAddSong } from "@/app/utils/addSongViaUI";
import toast from "react-hot-toast";

/** Styled-компоненти */
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background: linear-gradient(#fff, #fafafa);
  border-radius: 1rem;
  margin: 1rem;
  margin-top: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Sidebar = styled.div`
  width: 280px;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  margin: 1rem;
  margin-top: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(79, 70, 229, 0.4);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 240px;
    padding: 1rem;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const SidebarTitle = styled.h4`
  margin-bottom: 1rem;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin-left: 1rem;
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: rgba(79, 70, 229, 0.05);
    color: #4f46e5;
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TrackImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  margin-right: 0.75rem;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackTitle = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ArtistName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #2d3748;
`;

const TrackCount = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const LikedContainer = styled.div`
  background-color: transparent;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TrackCard = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const TrackListItem = styled.div`
  display: grid;
  grid-template-columns: 48px 2fr 1fr 1fr 200px;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(79, 70, 229, 0.05);
  }
`;

const CardTrackImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${TrackCard}:hover & {
    transform: scale(1.05);
  }
`;

const ListTrackImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const CardTrackInfo = styled.div`
  padding: 0.75rem;
`;

const CardTrackTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardTrackArtist = styled.div`
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListTrackTitle = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #2d3748;
  padding-left: 0.5rem;
`;

const ListTrackArtist = styled.div`
  font-size: 0.8rem;
  color: #718096;
  padding-left: 0.5rem;
`;

const ListTrackAlbum = styled.div`
  font-size: 0.8rem;
  color: #718096;
`;

const ListTrackDuration = styled.div`
  font-size: 0.8rem;
  color: #718096;
  text-align: right;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const ActionButton = styled.button`
  position: absolute;
  padding: 0.5rem;
  font-size: 0.7rem;
  bottom: 60px;
  cursor: pointer;
  color: white;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(5px);
  
  ${TrackCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: scale(1.1) !important;
  }

  svg {
    margin-right: 0;
  }
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 55px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  opacity: 0;

  ${TrackCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #4338ca;
    transform: translateX(-50%) scale(1.05);
  }

  svg {
    margin-right: 4px;
  }
`;

const LikeButton = styled(ActionButton)`
  bottom: 53px;
  right: 10px;
  background: linear-gradient(90deg, #de4694 0%, #ed64a6 100%);
  
  &:hover {
    background: linear-gradient(90deg, #d53f8c 0%, #ed64a6 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(237, 100, 166, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FindSimilarButton = styled(ActionButton)`
  bottom: 53px;
  left: 10px;
  background-color: #60a5fa;
  
  &:hover {
    background-color: #3b82f6;
  }
`;

const AddToLearnButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 80%;
  transform: translateX(-50%);
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(90deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.3);
  opacity: 0;
  z-index: 10;
  width: fit-content;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${TrackCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: linear-gradient(90deg, #4338ca 0%, #3730a3 100%);
    transform: translateX(-50%) translateY(-1px);
    box-shadow: 0 3px 6px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateX(-50%) translateY(0);
    box-shadow: 0 1px 3px rgba(79, 70, 229, 0.3);
  }
`;

const AddToLearnListButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(90deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);

  &:hover {
    background: linear-gradient(90deg, #4338ca 0%, #3730a3 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
  }
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4338ca;
  }
`;

const TrackDetailsPopup = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  width: 300px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 0.75rem;
  padding: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.25rem;

  strong {
    min-width: 80px;
    margin-right: 0.5rem;
    color: #4a5568;
    font-weight: 500;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #718096;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #4a5568;
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  width: 85%;
  max-width: 850px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      transform: scale(0.98);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const YouTubePlayerContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #000;
`;

const PlayerHeader = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const PlayerTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
  color: #2d3748;
`;

const PlayerControls = styled.div`
  padding: 1rem 1.5rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 7rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const MediaButton = styled.button`
  background: #f3f4f6;
  color: #4f46e5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0.25rem;

  &:hover {
    background: #e0e7ff;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoadingIndicator = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  background-color: white;
  color: #4f46e5;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  animation: slideIn 0.2s ease;
  z-index: 100;

  @keyframes slideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  svg {
    margin-right: 0.5rem;
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const TrackDetailsLoading = styled(LoadingIndicator)`
  background-color: #fce7f3;
  color: #db2777;
`;

const YouTubeLoading = styled(LoadingIndicator)`
  background-color: #e0e7ff;
  color: #4f46e5;
`;

/** Типи даних */
interface ITrack {
  title: string;
  artist: string;
  spotify_url?: string;
  spotify_uri?: string;
  image_url?: string;
}

interface ITrackDetails extends ITrack {
  album?: string;
  release_date?: string;
  duration_ms?: number;
  popularity?: number;
  preview_url?: string;
  genres?: string[];
  isExplicit?: boolean;
  artists?: string[];
}

/** Ключі API (для прикладу, перемістити в .env) */
const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function LikedSongsPage() {
  const [likedTracks, setLikedTracks] = useState<ITrack[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<ITrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<ITrack | null>(null);
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const [activeTrackDetails, setActiveTrackDetails] = useState<ITrackDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [trackDetailsCache, setTrackDetailsCache] = useState<Record<string, ITrackDetails>>({});
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<ITrack | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const stored = localStorage.getItem("likedTracks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ITrack[];
        setLikedTracks(parsed);
        parsed.forEach((track) => {
          if (track.spotify_uri) {
            loadTrackDetails(track);
          }
        });
      } catch (err) {
        console.warn("Error parsing likedTracks:", err);
      }
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  const loadSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
        value
      )}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.results) {
        setSuggestions([]);
        return;
      }
      const items = data.results.trackmatches.track.map((track: any) => ({
        title: track.name,
        artist: track.artist,
      }));
      setSuggestions(items);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    loadSuggestions(value);
  };

  const handleSelect = async (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    if (!value) return;

    const [titleRaw, artistRaw] = value.split(" — ");
    if (!titleRaw || !artistRaw) return;

    const trackTitle = titleRaw.trim();
    const trackArtist = artistRaw.trim();

    try {
      const token = await getSpotifyToken();
      const spData = await searchSpotifyTrack(trackTitle, trackArtist, token);
      if (!spData) {
        setSelectedTrack(null);
        return;
      }
      const newTrack: ITrack = {
        title: spData.track.name,
        artist: spData.track.artist,
        spotify_url: spData.track.url,
        spotify_uri: spData.track.uri,
        image_url: spData.track.image,
      };
      setSelectedTrack(newTrack);
      loadTrackDetails(newTrack);
    } catch (err) {
      console.error("Error retrieving track info:", err);
      setSelectedTrack(null);
    }
  };

  const handleToggleLike = (track: ITrack) => {
    const index = likedTracks.findIndex((t) => t.spotify_uri === track.spotify_uri);
    if (index === -1) {
      const updated = [...likedTracks, track];
      setLikedTracks(updated);
      localStorage.setItem("likedTracks", JSON.stringify(updated));
      loadTrackDetails(track);
    } else {
      const updated = likedTracks.filter((_, i) => i !== index);
      setLikedTracks(updated);
      localStorage.setItem("likedTracks", JSON.stringify(updated));
    }
  };

  const isLiked = (track: ITrack) => {
    return likedTracks.some((t) => t.spotify_uri === track.spotify_uri);
  };

  const loadTrackDetails = async (track: ITrack) => {
    if (!track.spotify_uri) return null;

    const trackId = track.spotify_uri.split(":").pop();
    if (trackId && trackDetailsCache[trackId]) {
      return trackDetailsCache[trackId];
    }

    try {
      setIsLoadingDetails(true);
      const token = await getSpotifyToken();
      if (!trackId) return null;

      const url = `https://api.spotify.com/v1/tracks/${trackId}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const trackData = await response.json();
      let genres: string[] = [];
      if (trackData.artists && trackData.artists.length > 0) {
        const artistId = trackData.artists[0].id;
        const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;
        const artistResponse = await fetch(artistUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const artistData = await artistResponse.json();
        genres = artistData.genres || [];
      }

      const trackDetails: ITrackDetails = {
        ...track,
        album: trackData.album?.name,
        release_date: trackData.album?.release_date,
        duration_ms: trackData.duration_ms,
        popularity: trackData.popularity,
        preview_url: trackData.preview_url,
        genres: genres,
        isExplicit: trackData.explicit,
        artists: trackData.artists.map((a: any) => a.name),
      };

      setTrackDetailsCache((prev) => ({
        ...prev,
        [trackId]: trackDetails,
      }));

      return trackDetails;
    } catch (error) {
      console.error("Error loading track details:", error);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleTrackHover = async (track: ITrack) => {
    if (!track.spotify_uri) return;

    const trackId = track.spotify_uri.split(":").pop();
    if (!trackId) return;

    setHoveredTrackId(trackId);
    const details = await loadTrackDetails(track);
    if (details) {
      setActiveTrackDetails(details);
    }
  };

  const handleCloseDetails = () => {
    setHoveredTrackId(null);
    setActiveTrackDetails(null);
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms) return "00:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const searchYouTubeVideo = async (track: ITrack) => {
    setIsLoadingYouTube(true);
    setCurrentPlayingTrack(track);

    try {
      const searchQuery = `${track.title} ${track.artist} official audio`;
      const url = `https://www.googleapis.com/youtube/v3/search?`+
        `part=snippet&maxResults=1&q=${encodeURIComponent(
        searchQuery
      )}&key=${YOUTUBE_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        setYoutubeVideoId(videoId);
        setShowYouTubePlayer(true);
      } else {
        alert("Can't find Youtube video for this track");
      }
    } catch (error) {
      console.error("Error searching YouTube:", error);
      alert("Помилка при пошуку відео на YouTube");
    } finally {
      setIsLoadingYouTube(false);
    }
  };

  const closeYouTubePlayer = () => {
    setShowYouTubePlayer(false);
    setYoutubeVideoId(null);
    setCurrentPlayingTrack(null);
  };

  const toggleMute = () => {
    const iframe = document.querySelector<HTMLIFrameElement>("#youtube-player");
    if (iframe) {
      const message = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}';
      iframe.contentWindow?.postMessage(message, "*");
      setIsMuted(!isMuted);
    }
  };

  const getTopArtists = () => {
    const artistCounts = likedTracks.reduce((acc, track) => {
      acc[track.artist] = (acc[track.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 5);
  };

  const topArtists = useMemo(getTopArtists, [likedTracks]);

  const renderTrackCard = (track: ITrack, idx: number) => (
    <TrackCard
      key={idx}
      onMouseEnter={() => handleTrackHover(track)}
      onMouseLeave={() => setTimeout(() => setHoveredTrackId(null), 300)}
    >
      {track.image_url && (
        <CardTrackImage src={track.image_url} alt={`${track.title} cover`} />
      )}
      <CardTrackInfo>
        <CardTrackTitle>{track.title}</CardTrackTitle>
        <CardTrackArtist>{track.artist}</CardTrackArtist>
      </CardTrackInfo>
      <PlayButton onClick={() => searchYouTubeVideo(track)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
        </svg>
        Play
      </PlayButton>
      <LikeButton onClick={() => handleToggleLike(track)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={isLiked(track) ? "#f687b3" : "currentColor"}
          />
        </svg>
        {isLiked(track) ? "" : ""}
      </LikeButton>
      {/* <AddToLearnButton
        onClick={() =>
          toast.promise(autoAddSong(track.artist, track.title), {
            loading: "Adding song...",
            success: "Song added to learning list!",
            error: "Failed to add song",
          })
        }
      >
        Learn
      </AddToLearnButton> */}
      <FindSimilarButton
        onClick={() => {
          const query = `track=${encodeURIComponent(
            track.title
          )}&artist=${encodeURIComponent(track.artist)}`;
          window.location.href = `/playlist?${query}`;
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            fill="currentColor"
          />
        </svg>
      </FindSimilarButton>
      {track.spotify_uri &&
        hoveredTrackId === track.spotify_uri.split(":").pop() &&
        activeTrackDetails && (
          <TrackDetailsPopup>
            <CloseButton onClick={handleCloseDetails}>✕</CloseButton>
            <h3>{activeTrackDetails.title}</h3>
            <DetailRow>
              <strong>Artist:</strong>{" "}
              {activeTrackDetails.artists?.join(", ") || activeTrackDetails.artist}
            </DetailRow>
            {activeTrackDetails.album && (
              <DetailRow>
                <strong>Album:</strong> {activeTrackDetails.album}
              </DetailRow>
            )}
            {activeTrackDetails.release_date && (
              <DetailRow>
                <strong>Released:</strong>{" "}
                {new Date(activeTrackDetails.release_date).toLocaleDateString()}
              </DetailRow>
            )}
            {activeTrackDetails.duration_ms && (
              <DetailRow>
                <strong>Duration:</strong>{" "}
                {formatDuration(activeTrackDetails.duration_ms)}
              </DetailRow>
            )}
            {activeTrackDetails.popularity !== undefined && (
              <DetailRow>
                <strong>Popularity:</strong> {activeTrackDetails.popularity}/100
              </DetailRow>
            )}
            {activeTrackDetails.genres && activeTrackDetails.genres.length > 0 && (
              <DetailRow>
                <strong>Genres:</strong>{" "}
                {activeTrackDetails.genres.join(", ")}
              </DetailRow>
            )}
            {activeTrackDetails.isExplicit !== undefined && (
              <DetailRow>
                <strong>Explicit:</strong>{" "}
                {activeTrackDetails.isExplicit ? "Yes" : "No"}
              </DetailRow>
            )}
            {activeTrackDetails.preview_url && (
              <div style={{ marginTop: "10px" }}>
                <audio
                  controls
                  src={activeTrackDetails.preview_url}
                  style={{ width: "100%" }}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </TrackDetailsPopup>
        )}
    </TrackCard>
  );

  const renderTrackListItem = (track: ITrack, idx: number) => (
    <TrackListItem key={idx}>
      {track.image_url && (
        <ListTrackImage src={track.image_url} alt={`${track.title} cover`} />
      )}
      <div>
        <ListTrackTitle>{track.title}</ListTrackTitle>
        <ListTrackArtist>{track.artist}</ListTrackArtist>
      </div>
      <ListTrackAlbum>
        {trackDetailsCache[track.spotify_uri?.split(":").pop() || ""]?.album || "N/A"}
      </ListTrackAlbum>
      <ListTrackDuration>
        {formatDuration(
          trackDetailsCache[track.spotify_uri?.split(":").pop() || ""]?.duration_ms
        )}
      </ListTrackDuration>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <PlayButton onClick={() => searchYouTubeVideo(track)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
          </svg>
          Play
        </PlayButton>
        <LikeButton onClick={() => handleToggleLike(track)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isLiked(track) ? "#f687b3" : "currentColor"}
            />
          </svg>
        </LikeButton>
        <AddToLearnListButton
          onClick={() =>
            toast.promise(autoAddSong(track.artist, track.title), {
              loading: "Adding song...",
              success: "Song added to learning list!",
              error: "Failed to add song",
            })
          }
        >
          Add to Learn
        </AddToLearnListButton>
      </div>
    </TrackListItem>
  );

  return (
    <PageContainer>
      <MainContent>
        <LikedContainer>
          <SearchContainer>
            <Title>Search & pick a track:</Title>
            <Input
              list="trackSuggestions"
              value={searchValue}
              onChange={handleInputChange}
              onSelect={handleSelect}
              placeholder="Song Title — Artist"
              aria-label="Search for a song by title and artist"
            />
            <datalist id="trackSuggestions">
              {suggestions.map((track, idx) => (
                <option key={idx} value={`${track.title} — ${track.artist}`} />
              ))}
            </datalist>
          </SearchContainer>

          {selectedTrack && (
            <TracksGrid>
              {renderTrackCard(selectedTrack, 0)}
            </TracksGrid>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title>Your Favorites</Title>
            <ToggleButton
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
              title={`Switch to ${viewMode === "grid" ? "List" : "Grid"} view`}
            >
              {viewMode === "grid" ? simplelist : grid}
            </ToggleButton>
          </div>

          {likedTracks.length === 0 ? (
            <p>You haven't liked any tracks yet.</p>
          ) : viewMode === "grid" ? (
            <TracksGrid>
              {likedTracks.map((track, idx) => renderTrackCard(track, idx))}
            </TracksGrid>
          ) : (
            <TracksList>
              {likedTracks.map((track, idx) => renderTrackListItem(track, idx))}
            </TracksList>
          )}

          {isLoadingDetails && (
            <TrackDetailsLoading>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="50 50"
                />
              </svg>
              Loading track details...
            </TrackDetailsLoading>
          )}

          {isLoadingYouTube && (
            <YouTubeLoading>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="50 50"
                />
              </svg>
              Searching YouTube...
            </YouTubeLoading>
          )}

          {showYouTubePlayer && youtubeVideoId && currentPlayingTrack && (
            <ModalOverlay onClick={closeYouTubePlayer}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <PlayerHeader>
                  <PlayerTitle>
                    {currentPlayingTrack.title} - {currentPlayingTrack.artist}
                  </PlayerTitle>
                  <CloseButton onClick={closeYouTubePlayer} style={{ color: "white" }}>
                    ✕
                  </CloseButton>
                </PlayerHeader>
                <YouTubePlayerContainer>
                  <YoutubePlayer videoId={youtubeVideoId} isMuted={isMuted} setIsMuted={setIsMuted} />
                </YouTubePlayerContainer>
                <PlayerControls>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MediaButton onClick={toggleMute}>
                      {isMuted ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.70zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </MediaButton>
                    <AddToLearnListButton
                      onClick={() =>
                        toast.promise(autoAddSong(currentPlayingTrack.artist, currentPlayingTrack.title), {
                          loading: "Adding song...",
                          success: "Song added to learning list!",
                          error: "Failed to add song",
                        })
                      }
                    >
                      Add to Learn
                    </AddToLearnListButton>
                  </div>
                  <div style={{ display: "flex", alignItems: "left" }}>
                    {currentPlayingTrack.image_url && (
                      <img
                        src={currentPlayingTrack.image_url}
                        alt={currentPlayingTrack.title}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "4px",
                          marginRight: "10px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      />
                    )}
                    <div style={{ color: "#1e1c1c", fontWeight: "600", fontSize: "14px" }}>
                      Now playing via YouTube
                      {currentPlayingTrack.spotify_url && (
                        <div>
                          <a
                            href={currentPlayingTrack.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#1DB954",
                              textDecoration: "none",
                              fontSize: "12px",
                            }}
                          >
                            Open in Spotify
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <LikeButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(currentPlayingTrack);
                      }}
                      style={{
                        background: isLiked(currentPlayingTrack)
                          ? "rgba(240, 98, 146, 0.8)"
                          : "rgba(240, 98, 146, 0.5)",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill={isLiked(currentPlayingTrack) ? "#f687b3" : "currentColor"}
                        />
                      </svg>
                      {isLiked(currentPlayingTrack) ? "Unlike" : "Like"}
                    </LikeButton>
                  </div>
                </PlayerControls>
              </ModalContent>
            </ModalOverlay>
          )}
        </LikedContainer>
      </MainContent>

      <Sidebar>
        <SidebarSection>
          <SidebarTitle>Recently Liked</SidebarTitle>
          <SidebarList>
            {likedTracks.slice(-5).reverse().map((track, idx) => (
              <SidebarListItem
                key={idx}
                onClick={() => searchYouTubeVideo(track)}
                tabIndex={0}
                aria-label={`Play ${track.title} by ${track.artist}`}
              >
                {track.image_url && (
                  <TrackImage src={track.image_url} alt={`${track.title} cover`} />
                )}
                <TrackInfo>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>{track.artist}</TrackArtist>
                </TrackInfo>
              </SidebarListItem>
            ))}
            {likedTracks.length === 0 && (
              <SidebarListItem>No tracks liked yet.</SidebarListItem>
            )}
          </SidebarList>
        </SidebarSection>

        <SidebarSection>
          <SidebarTitle>Top Artists</SidebarTitle>
          <SidebarList>
            {topArtists.map((artist, idx) => (
              <SidebarListItem key={idx}>
                <ArtistInfo>
                  <ArtistName>{artist.name}</ArtistName>
                  <TrackCount>
                    ({artist.count} {artist.count === 1 ? "track" : "tracks"})
                  </TrackCount>
                </ArtistInfo>
              </SidebarListItem>
            ))}
            {topArtists.length === 0 && (
              <SidebarListItem>No artists yet.</SidebarListItem>
            )}
          </SidebarList>
        </SidebarSection>
      </Sidebar>
    </PageContainer>
  );
}

async function getSpotifyToken(): Promise<string> {
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      )}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await resp.json();
  return data.access_token;
}

async function searchSpotifyTrack(title: string, artist: string, token: string) {
  const exactQuery = `track:${title} artist:${artist}`;
  let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    exactQuery
  )}&type=track&limit=1`;

  let resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let data = await resp.json();
  let item = data.tracks?.items?.[0];

  if (!item) {
    const softQuery = `${title} ${artist}`;
    url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      softQuery
    )}&type=track&limit=1`;
    resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    data = await resp.json();
    item = data.tracks?.items?.[0];
    if (!item) {
      return null;
    }
  }

  const trackData = {
    uri: item.uri,
    url: item.external_urls.spotify,
    image: item.album.images?.[0]?.url || "",
    name: item.name,
    artist: item.artists?.[0]?.name || "",
  };

  return { track: trackData };
}