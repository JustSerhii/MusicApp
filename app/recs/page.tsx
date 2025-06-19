"use client";

import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { autoAddSong } from "@/app/utils/addSongViaUI";

/** Типи */
interface IRecommendedTrack {
  title: string;
  artist: string;
  spotify_url?: string;
  spotify_uri?: string;
  image_url?: string;
  videoId?: string;
  views?: string;
}

interface IRecommendedAlbum {
  albumName: string;
  artistName: string;
  spotifyAlbumUrl: string;
  spotifyAlbumUri: string;
  imageUrl: string;
}

interface IYTMusicTrack {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  views: string;
}

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const YT_MUSIC_API_BASE = "http://localhost:8000";

/** Список країн для прикладу і відповідні коди для YouTube Music API */
const availableCountries = [
  "United States",
  "Ukraine",
  "Germany",
  "France",
  "Poland",
  "Japan",
  "Australia",
  "Italy",
  "Spain",
  "Canada",
  "Netherlands",
  "Sweden"
];

const countryCodeMap: Record<string, string> = {
  "United States": "US",
  "Ukraine": "UA",
  "Germany": "DE",
  "France": "FR",
  "Poland": "PL",
  "Japan": "JP",
  "Australia": "AU",
  "Italy": "IT",
  "Spain": "ES",
  "Canada": "CA",
  "Netherlands": "NL",
  "Sweden": "SE"
};


/** Styled-контейнер */
const RecommendationsContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e2e8ff 50%, #e3dbfa 100%);
  min-height: 100vh;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-y: auto;
  color: #2d3748;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none; 
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #2d3748;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
  }
`;

/** Новий контейнер для альбомів з автоматичним прокручуванням */
const AlbumsSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  max-width: 100vh;
  &::-webkit-scrollbar {
    display: none; 
  }
`;

const AlbumsGrid = styled.div<{ totalWidth: number }>`
  display: flex;
  gap: 1.25rem;
  width: ${({ totalWidth }) => totalWidth * 2}px;
  animation: scroll 45s linear infinite;
  animation-play-state: running;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-${({ totalWidth }) => totalWidth}px); }
  }
`;


const AlbumCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  width: 200px;
  min-width: 200px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
    transform: scale(1.06);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    animation-play-state: paused;
  }
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const AlbumInfo = styled.div`
  padding: 1rem;
  text-align: center;
`;

const AlbumTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  length: 100px;
`;

const AlbumArtist = styled.div`
  font-size: 0.75rem;
  color: #718096;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 0.7rem;
  right: 0.3rem;
  padding-left: 5px;
  padding-top: 2px;
  background: linear-gradient(90deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);

  &:hover {
    background: linear-gradient(90deg, #4338ca 0%, #3730a3 100%);
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/** Styled для перемикача вкладок (Tab Buttons) */
const TabContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)' 
    : 'linear-gradient(90deg, #e2e8f0 0%, #d1d9e6 100%)'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active 
    ? '0 2px 4px rgba(79, 70, 229, 0.3)' 
    : '0 1px 3px rgba(0, 0, 0, 0.1)'};

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #4338ca 0%, #3730a3 100%)' 
      : 'linear-gradient(90deg, #d1d9e6 0%, #c4cee2 100%)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.active 
      ? '0 4px 8px rgba(79, 70, 229, 0.4)' 
      : '0 2px 5px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.active 
      ? '0 2px 4px rgba(79, 70, 229, 0.3)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  }
`;

/** Стиль для кнопки лайку */
const LikeButton = styled.button<{ isLiked: boolean }>`
  position: absolute;
  bottom: 17px;
  right: 0;
  padding: 0.4rem;
  font-size: 0.5rem;
  cursor: pointer;
  background: ${props => props.isLiked 
    ? 'linear-gradient(90deg, #d53f8c 0%, #ed64a6 100%)' 
    : 'linear-gradient(90deg, #ed64a6 0%, #f687b3 100%)'};
  color: white;
  border: none;
  border-radius: 0.5rem 0 0 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(5px);
  
  .track-card:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: linear-gradient(90deg, #d53f8c 0%, #ed64a6 100%);
    transform: scale(1.1) !important;
    box-shadow: 0 4px 8px rgba(237, 100, 166, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const YOUTUBE_API_KEY = "AIzaSyCsSBuNWeI-HMs7XpXdeXJIHDDZEPPJxG0";


export default function RecommendationsPage() {
  /** Стан для режиму (recommendations | charts) */
  const [viewMode, setViewMode] = useState<"recommendations" | "charts">(
    "recommendations"
  );

  // --------------------------
  //  Рекомендації
  // --------------------------
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<IRecommendedTrack[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<IRecommendedAlbum[]>([]);
  const albumsGridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);

  // Стан для лайкнутих треків
  const [likedTracks, setLikedTracks] = useState<IRecommendedTrack[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("likedTracks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          console.warn('Invalid likedTracks format in localStorage:', e);
        }
      }
    }
    return [];
  });

  // Зберігаємо лайкнуті треки в localStorage при зміні
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
    }
  }, [likedTracks]);

  // При маунті беремо історію пошуків із localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSearchHistory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        const truncated = parsed.slice(0, 5);
        setSearchHistory(truncated);
      } catch (err) {
        console.warn("Failed to parse userSearchHistory:", err);
      }
    }
  }, []);

  // Calculate grid width based on number of albums
  useEffect(() => {
    if (albumsGridRef.current && recommendedAlbums.length > 0) {
      const cardWidth = 200; // Width of AlbumCard
      const gap = 20; // Gap between cards (1.25rem = 20px)
      const totalWidth = recommendedAlbums.length * (cardWidth + gap) - gap; // Subtract extra gap
      setGridWidth(totalWidth);
    }
  }, [recommendedAlbums]);

  // Як і раніше: отримуємо рекомендації, якщо searchHistory не порожній
  useEffect(() => {
    if (!searchHistory.length) return;

    (async () => {
      try {
        const spotifyToken = await getSpotifyToken();

        const similarTracksResults = await Promise.all(
          searchHistory.map(async (item) => {
            const [titleRaw, artistRaw] = item.split(" — ");
            if (!titleRaw || !artistRaw) return [];
            const title = titleRaw.trim();
            const artist = artistRaw.trim();

            const similarTracks = await fetchSimilarTracks(title, artist, 10);
            const spotifyDataArray = await Promise.all(
              similarTracks.map((t) =>
                searchSpotifyTrack(t.title, t.artist, spotifyToken)
              )
            );
            return spotifyDataArray.filter((data) => data !== null);
          })
        );

        const allResults = similarTracksResults.flat();
        const validResults = allResults.filter(
          (item): item is NonNullable<typeof item> => item !== null
        );

        let allTracks = validResults.map((spData) => ({
          title: spData.track.name,
          artist: spData.track.artist,
          spotify_url: spData.track.url,
          spotify_uri: spData.track.uri,
          image_url: spData.track.image,
        }));

        let allAlbums = validResults.map((spData) => ({
          albumName: spData.album.name,
          artistName: spData.album.artist,
          spotifyAlbumUrl: spData.album.url,
          spotifyAlbumUri: spData.album.uri,
          imageUrl: spData.album.image,
        }));

        const trackMap = new Map<string, IRecommendedTrack>();
        allTracks.forEach((tr) => {
          const key = tr.title.toLowerCase() + "|" + tr.artist.toLowerCase();
          if (!trackMap.has(key)) trackMap.set(key, tr);
        });
        let finalTracks = Array.from(trackMap.values());

        if (finalTracks.length < 42) {
          const needed = 42 - finalTracks.length;
          const topChartTracks = await fetchTopChartTracks(needed + 10);
          const topChartData = await Promise.all(
            topChartTracks.map((t) =>
              searchSpotifyTrack(t.title, t.artist, spotifyToken)
            )
          );
          const validTopChart = topChartData
            .filter(
              (spData): spData is { track: any; album: any } => spData !== null
            )
            .map((spData) => ({
              title: spData.track.name,
              artist: spData.track.artist,
              spotify_url: spData.track.url,
              spotify_uri: spData.track.uri,
              image_url: spData.track.image,
            }));
          validTopChart.forEach((tr) => {
            const key = tr.title.toLowerCase() + "|" + tr.artist.toLowerCase();
            if (!trackMap.has(key)) trackMap.set(key, tr);
          });
          finalTracks = Array.from(trackMap.values()).slice(0, 42);
        } else {
          finalTracks = finalTracks.slice(0, 42);
        }

        const albumMap = new Map<string, IRecommendedAlbum>();
        allAlbums.forEach((alb) => {
          const key =
            alb.albumName.toLowerCase() + "|" + alb.artistName.toLowerCase();
          if (!albumMap.has(key)) albumMap.set(key, alb);
        });
        const finalAlbums = Array.from(albumMap.values()).slice(0, 12);

        const mixedTracks = shuffleArray(finalTracks);

        setRecommendedTracks(mixedTracks);
        setRecommendedAlbums(finalAlbums);
      } catch (err) {
        console.error("Error in fetching recommendations:", err);
      }
    })();
  }, [searchHistory]);

  // --------------------------
  //  Чарти по країнах
  // --------------------------
  const [selectedCountry, setSelectedCountry] = useState<string>(
    availableCountries[1]
  );
  const [countryTracks, setCountryTracks] = useState<IRecommendedTrack[]>([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);

  async function fetchYTMusicCharts(countryCode: string): Promise<IRecommendedTrack[]> {
    try {
      const response = await fetch(`${YT_MUSIC_API_BASE}/charts/${countryCode}`);
      const data = await response.json();
  
      if (data.error) {
        console.error(`Error from backend API for ${countryCode}:`, data.error);
        toast.error(`Failed to load charts for ${countryCode}: ${data.error}`);
        return [];
      }
  
      const youtubeTracks = data.tracks.map((track: any) => ({
        title: track.title,
        artist: track.artist,
        videoId: track.videoId,
        thumbnail: track.thumbnail,
        views: track.views,
      }));
  
      const spotifyToken = await getSpotifyToken();
  
      const enrichedTracks = await Promise.all(
        youtubeTracks.map(async (track: IYTMusicTrack) => {
          const spotifyData = await searchSpotifyTrack(track.title, track.artist, spotifyToken);
          return {
            title: track.title, // Keep YouTube title
            artist: track.artist, // Keep YouTube artist
            spotify_url: spotifyData?.track.url,
            spotify_uri: spotifyData?.track.uri,
            image_url: track.thumbnail, // Keep YouTube thumbnail
            videoId: track.videoId,
            views: track.views,
          };
        })
      );
  
      const validTracks = enrichedTracks.filter((track): track is IRecommendedTrack => track.title && track.artist);
      
      if (validTracks.length === 0) {
      }
      return validTracks;
    } catch (err) {
      console.error(`Error fetching YouTube Music charts for ${countryCode}:`, err);
      toast.error(`Error loading charts for ${countryCode}. Please try again.`);
      return [];
    }
  }
  
  useEffect(() => {
    if (viewMode !== "charts") return;
    if (!selectedCountry) return;
  
    (async () => {
      setIsLoadingCharts(true);
      try {
        const countryCode = countryCodeMap[selectedCountry] || "US";
  
        const ytMusicTracks = await fetchYTMusicCharts(countryCode);
  
        if (ytMusicTracks.length > 0) {
          setCountryTracks(ytMusicTracks);
        } else {
          const lastFmTracks = await fetchCountryTopTracks(selectedCountry);
          const spotifyToken = await getSpotifyToken();
          const spDataArr = await Promise.all(
            lastFmTracks.map((t) =>
              searchSpotifyTrack(t.title, t.artist, spotifyToken)
            )
          );
  
          const valid = spDataArr
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .map((sp) => ({
              title: sp.track.name,
              artist: sp.track.artist,
              spotify_url: sp.track.url,
              spotify_uri: sp.track.uri,
              image_url: sp.track.image,
            }));
  
          const map = new Map<string, IRecommendedTrack>();
          valid.forEach((v) => {
            const key = v.title.toLowerCase() + "|" + v.artist.toLowerCase();
            if (!map.has(key)) map.set(key, v);
          });
  
          setCountryTracks(Array.from(map.values()));
        }
      } catch (err) {
        console.error("Error fetching country charts:", err);
      } finally {
        setIsLoadingCharts(false);
      }
    })();
  }, [viewMode, selectedCountry]);

  const toggleLikeTrack = (track: IRecommendedTrack) => {
    const key = `${track.title.toLowerCase()}|${track.artist.toLowerCase()}`;
    const isLiked = likedTracks.some(
      (t) => `${t.title.toLowerCase()}|${t.artist.toLowerCase()}` === key
    );

    if (isLiked) {
      setLikedTracks(likedTracks.filter(
        (t) => `${t.title.toLowerCase()}|${t.artist.toLowerCase()}` !== key
      ));
      toast.success("Removed from liked tracks!");
    } else {
      setLikedTracks([...likedTracks, track]);
      toast.success("Added to liked tracks!");
    }
  };

  const isTrackLiked = (track: IRecommendedTrack) => {
    const key = `${track.title.toLowerCase()}|${track.artist.toLowerCase()}`;
    return likedTracks.some(
      (t) => `${t.title.toLowerCase()}|${t.artist.toLowerCase()}` === key
    );
  };

  // --------------------------
  //  Рендер
  // --------------------------
  return (
    <RecommendationsContainer>
      <h2 className="text-2xl font-bold mb-4">Music Discovery</h2>

      {/* Перемикач: "Recommendations" | "Charts" */}
      <TabContainer>
        <TabButton
          onClick={() => setViewMode("recommendations")}
          active={viewMode === "recommendations"}
        >
          Recommendations
        </TabButton>
        <TabButton
          onClick={() => setViewMode("charts")}
          active={viewMode === "charts"}
        >
          Charts by Country
        </TabButton>
      </TabContainer>

      {/* Якщо обрано Recommendations */}
      {viewMode === "recommendations" && (
        <>
          <h3 className="text-xl font-semibold mb-2">Recommended Albums</h3>
          <AlbumsSection>
            <AlbumsGrid ref={albumsGridRef} totalWidth={gridWidth}>
              {[...recommendedAlbums, ...recommendedAlbums].map((album, idx) => (
                <AlbumCard key={idx}>
                  <AlbumImage src={album.imageUrl} alt={album.albumName} />
                  <AlbumInfo>
                    <AlbumTitle>{album.albumName}</AlbumTitle>
                    <AlbumArtist>{album.artistName}</AlbumArtist>
                  </AlbumInfo>
                  <PlayButton onClick={() => window.open(album.spotifyAlbumUrl, "_blank")}>
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3v18l15-9L5 3z" fill="currentColor"/>
                    </svg>
                  </PlayButton>
                </AlbumCard>
              ))}
            </AlbumsGrid>
          </AlbumsSection>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            Recommended Tracks
          </h3>
          {recommendedTracks.length === 0 && (
            <p className="text-gray-500">Loading recommendations...</p>
          )}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-6
              gap-4
            "
            style={{
              display: 'grid',
              gap: '1.25rem',
              marginBottom: '2rem',
              maxWidth: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {recommendedTracks.map((track, idx) => (
              <div
                key={idx}
                className="
                  bg-white
                  rounded-md
                  overflow-hidden
                  shadow
                  text-center
                  flex flex-col
                  items-center
                  p-2
                  track-card
                "
                style={{
                  borderRadius: '0.75rem',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  border: '1px solid rgba(0, 0, 0, 0.03)',
                  padding: '0 0rem 1rem 0rem',
                  position: 'relative',
                  maxWidth: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }}
              >
                {track.image_url ? (
                  <img
                    src={track.image_url}
                    alt={`${track.title} cover`}
                    className="w-full h-32 object-cover rounded-md"
                    style={{
                      width: '100%',
                      height: '128px',
                      borderRadius: '0 0 0 0',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-32 bg-gray-300 rounded-md"
                    style={{
                      width: '100%',
                      height: '128px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '0.5rem',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                <div
                  className="mt-2 font-semibold text-sm"
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    width: '90%',
                    color: '#2d3748',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {track.title}
                </div>
                <div
                  className="text-xs text-gray-500"
                  style={{
                    fontSize: '0.75rem',
                    color: '#718096',
                    marginTop: '0.25rem',
                  }}
                >
                  {track.artist}
                </div>
                {track.spotify_url && (
                  <a
                    href={track.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-xs mt-1"
                    style={{
                      fontSize: '0.75rem',
                      color: '#4f46e5',
                      marginTop: '0.5rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4338ca';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#4f46e5';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Listen on Spotify
                  </a>
                )}
                <button
                  onClick={() =>
                    toast.promise(autoAddSong(track.artist, track.title), {
                      loading: "Adding song...",
                      success: "Song added to learning list!",
                      error: "Failed to add song",
                    })
                  }
                  className="mt-2 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #4338ca 0%, #3730a3 100%)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(79, 70, 229, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.3)';
                  }}
                >
                  Add to Learn
                </button>
                <LikeButton
                  isLiked={isTrackLiked(track)}
                  onClick={() => toggleLikeTrack(track)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isTrackLiked(track) ? "#f687b3" : "currentColor"}/>
                  </svg>
                </LikeButton>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Якщо обрано Charts */}
      {viewMode === "charts" && (
        <>
          <div
            className="mb-4 flex items-center gap-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <label
              htmlFor="countrySelect"
              className="font-semibold"
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#4a5568',
              }}
            >
              Select Country:
            </label>
            <select
              id="countrySelect"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border p-1 rounded"
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#4a5568',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-xl font-semibold mb-2">
            {selectedCountry} Trending Tracks
          </h3>
          {isLoadingCharts && (
            <p
              className="text-gray-500"
              style={{
                fontSize: '0.9rem',
                color: '#718096',
                textAlign: 'center',
                margin: '1rem 0',
              }}
            >
              Loading country charts...
            </p>
          )}

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-6
              gap-4
            "
            style={{
              display: 'grid',
              gap: '1.25rem',
              marginBottom: '2rem',
              maxWidth: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {countryTracks.map((track, idx) => (
              <div
                key={idx}
                className="
                  bg-white
                  rounded-md
                  overflow-hidden
                  shadow
                  text-center
                  flex flex-col
                  items-center
                  p-2
                  track-card
                "
                style={{
                  borderRadius: '0.75rem',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  border: '1px solid rgba(0, 0, 0, 0.03)',
                  padding: '0 0rem 1rem 0rem',
                  position: 'relative',
                  maxWidth: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                }}
              >
                {track.image_url ? (
                  <img
                    src={track.image_url}
                    alt={`${track.title} cover`}
                    className="w-full h-32 object-cover rounded-md"
                    style={{
                      width: '100%',
                      height: '128px',
                      borderRadius: '0 0 0 0',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-32 bg-gray-300 rounded-md"
                    style={{
                      width: '100%',
                      height: '128px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '0.5rem',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                <div
                  className="mt-2 font-semibold text-sm"
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    width: '90%',
                    color: '#2d3748',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                  }}
                >
                  {track.title}
                </div>
                <div
                  className="text-xs text-gray-500"
                  style={{
                    fontSize: '0.75rem',
                    color: '#718096',
                    marginTop: '0.25rem',
                    lineHeight: '1.2',
                    width: '90%',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                  }}
                >
                  {track.artist}
                </div>
                {/* {track.spotify_url && (
                  <a
                    href={track.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-xs mt-1"
                    style={{
                      fontSize: '0.75rem',
                      color: '#4f46e5',
                      marginTop: '0.5rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4338ca';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#4f46e5';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Listen on Spotify
                  </a>
                )} */}
                {track.videoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${track.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 hover:underline text-xs mt-1"
                    style={{
                      fontSize: '0.75rem',
                      color: '#ed64a6',
                      marginTop: '0.5rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d53f8c';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ed64a6';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Watch on YouTube
                  </a>
                )}
                
                <button
                  onClick={() =>
                    toast.promise(autoAddSong(track.artist, track.title), {
                      loading: "Adding song...",
                      success: "Song added to learning list!",
                      error: "Failed to add song",
                    })
                  }
                  className="mt-2 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #4338ca 0%, #3730a3 100%)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(79, 70, 229, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.3)';
                  }}
                >
                  Add to Learn
                </button>
                <LikeButton
                  isLiked={isTrackLiked(track)}
                  onClick={() => toggleLikeTrack(track)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isTrackLiked(track) ? "#f687b3" : "currentColor"}/>
                  </svg>
                </LikeButton>
              </div>
            ))}
          </div>
        </>
      )}
    </RecommendationsContainer>
  );
}

/** Перемішування масиву (Fisher–Yates) */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// --------------------------------------
// Функції для Last.fm & Spotify
// --------------------------------------
async function getSpotifyToken(): Promise<string> {
  try {
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
  } catch (err) {
    console.error("Error obtaining Spotify token:", err);
    throw err;
  }
}

async function fetchSimilarTracks(
  title: string,
  artist: string,
  limit: number
): Promise<{ title: string; artist: string }[]> {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getSimilar&track=${encodeURIComponent(
      title
    )}&artist=${encodeURIComponent(
      artist
    )}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const items = data.similartracks?.track || [];
    return items.map((tr: any) => ({
      title: tr.name,
      artist: tr.artist.name,
    }));
  } catch (err) {
    console.error("Error in fetchSimilarTracks:", err);
    return [];
  }
}

async function fetchTopChartTracks(
  limit: number
): Promise<{ title: string; artist: string }[]> {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const items = data.tracks?.track || [];
    return items.map((tr: any) => ({
      title: tr.name,
      artist: tr.artist.name,
    }));
  } catch (err) {
    console.error("Error in fetchTopChartTracks:", err);
    return [];
  }
}

async function fetchCountryTopTracks(country: string): Promise<IRecommendedTrack[]> {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${encodeURIComponent(
      country
    )}&api_key=${LASTFM_API_KEY}&format=json&limit=24`;
    const resp = await fetch(url);
    const data = await resp.json();
    const items = data.tracks?.track || [];

    const spotifyToken = await getSpotifyToken();
    const tracks = await Promise.all(
      items.map(async (tr: any) => {
        const title = tr.name;
        const artist = tr.artist.name;

        // Search YouTube for videoId
        const ytResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(
            `${artist} ${title} official`
          )}&type=video&videoCategoryId=10&maxResults=1&key=${YOUTUBE_API_KEY}`,
          {
            headers: {
              "x-referer": "https://artists.youtube.com",
            },
          }
        );
        const ytData = await ytResponse.json();
        const videoId = ytData.items?.[0]?.id?.videoId || "";

        const spotifyData = await searchSpotifyTrack(title, artist, spotifyToken);
        return {
          title,
          artist,
          spotify_url: spotifyData?.track.url,
          spotify_uri: spotifyData?.track.uri,
          image_url: tr.image?.[tr.image.length - 1]?.["#text"] || "",
          videoId,
          views: "N/A",
        };
      })
    );

    const validTracks = tracks.filter((track): track is IRecommendedTrack => track.title && track.artist);
    return validTracks;
  } catch (err) {
    console.error("Error in fetchCountryTopTracks:", err);
    return [];
  }
}
async function searchSpotifyTrack(
  title: string,
  artist: string,
  token: string
) {
  try {
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
      if (!item) return null;
    }
    const trackData = {
      uri: item.uri,
      url: item.external_urls.spotify,
      image: item.album.images?.[0]?.url || "",
      name: item.name,
      artist: item.artists?.[0]?.name || "",
    };
    const albumData = {
      uri: item.album.uri,
      url: item.album.external_urls.spotify,
      image: item.album.images?.[0]?.url || "",
      name: item.album.name,
      artist: item.album.artists?.[0]?.name || "",
    };
    return {
      track: trackData,
      album: albumData,
    };
  } catch (err) {
    console.error("Error in searchSpotifyTrack:", err);
    return null;
  }
}