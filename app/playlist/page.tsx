"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2d3748;
  box-shadow: 
  0 4px 20px rgba(0, 0, 0, 0.08),
  0 0 0 1px rgba(102, 126, 234, 0.1);
  border-radius: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #1a202c;
  font-size: 2.5rem;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.05em;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Input = styled.input`
  padding: 12px 20px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #a0aec0;
    box-shadow: 0 0 0 3px rgba(118, 169, 250, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LimitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LimitLabel = styled.label`
  font-size: 16px;
  color: #4a5568;
  font-weight: 500;
`;

const NumberInput = styled.input`
  padding: 10px 15px;
  font-size: 16px;
  width: 80px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #a0aec0;
    box-shadow: 0 0 0 2px rgba(118, 169, 250, 0.2);
  }
`;

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 2rem;
`;

const TrackDiv = styled.div`
  margin-bottom: 1rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fff;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e0;
  }
`;

const TrackImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackTitle = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: #4a5568;
  font-size: 16px;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpotifyLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #1db954;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #1ed760;
    text-decoration: underline;
  }

  &::before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231db954'%3E%3Cpath d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z'/%3E%3C/svg%3E");
    background-size: contain;
    margin-right: 6px;
  }
`;

const LikeButton = styled.button`
  margin-left: auto;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(90deg, #ed64a6 0%, #f687b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(237, 100, 166, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: linear-gradient(90deg, #d53f8c 0%, #ed64a6 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(237, 100, 166, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(Button)`
  margin: 2rem auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 18px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
  font-size: 18px;
  border: 1px dashed #cbd5e0;
  border-radius: 12px;
  background-color: #f8fafc;
`;

const LoadingIndicator = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(26, 32, 44, 0.95);
  color: white;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface ITrack {
  title: string;
  artist: string;
  spotify_url?: string;
  spotify_uri?: string;
  image_url?: string;
}

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/playlist";

const SimilarSongsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<ITrack[]>([]);
  const [results, setResults] = useState<ITrack[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [likedTracks, setLikedTracks] = useState<ITrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const playlistCreatedRef = useRef(false);
  const hasAutoSearched = useRef(false);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("userSearchHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as string[];
        setSearchHistory(parsed);
      } catch (err) {
        console.warn("Failed to parse saved search history:", err);
      }
    }

    const stored = localStorage.getItem("likedTracks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ITrack[];
        setLikedTracks(parsed);
      } catch (err) {
        console.warn("Error parsing likedTracks:", err);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const track = params.get("track");
    const artist = params.get("artist");

    if (track && artist && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      const query = `${track} — ${artist}`;
      setSearchValue(query);
      handleSearch(track, artist);
    }
  }, []);

  const loadSuggestions = useCallback(async (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
          value
        )}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
      );
      const data = await response.json();
      const suggs = data.results.trackmatches.track.map((track: any) => ({
        title: track.name,
        artist: track.artist,
      }));
      setSuggestions(suggs);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    loadSuggestions(value);
  };

  const getSpotifyToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        )}`,
      },
      body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
  };

  const searchSpotifyTrack = async (
    title: string,
    artist: string,
    token: string
  ) => {
    const searchQuery = `track:${title} artist:${artist}`;
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const track = data.tracks?.items?.[0];
      if (track) {
        return {
          uri: track.uri,
          url: track.external_urls.spotify,
          image: track.album.images?.[0]?.url || "",
        };
      }

      const softSearchQuery = `${title} ${artist}`;
      const softResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          softSearchQuery
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const softData = await softResponse.json();
      const softTrack = softData.tracks?.items?.[0];
      if (softTrack) {
        return {
          uri: softTrack.uri,
          url: softTrack.external_urls.spotify,
          image: softTrack.album.images?.[0]?.url || "",
        };
      }

      console.warn(`No track found for: ${title} - ${artist}`);
      return null;
    } catch (error) {
      console.error("Error in Spotify track search:", error);
      return null;
    }
  };

  const handleLike = (track: ITrack) => {
    let updatedLikedTracks = [...likedTracks];

    if (
      (track.spotify_uri &&
        updatedLikedTracks.find((t) => t.spotify_uri === track.spotify_uri)) ||
      updatedLikedTracks.find(
        (t) => t.title === track.title && t.artist === track.artist
      )
    ) {
      return;
    }

    updatedLikedTracks.push(track);
    setLikedTracks(updatedLikedTracks);
    localStorage.setItem("likedTracks", JSON.stringify(updatedLikedTracks));
  };

  const handleSearch = async (title?: string, artist?: string) => {
    const query = title && artist ? `${title} — ${artist}` : searchValue.trim();
    if (!query) {
      alert("Please enter a song in the format 'Song Title — Artist'");
      return;
    }

    setIsLoading(true);

    const newHistory = [query, ...searchHistory];
    setSearchHistory(newHistory);
    localStorage.setItem("userSearchHistory", JSON.stringify(newHistory));

    let [trackTitle, trackArtist] = query.split(" — ");
    trackTitle = trackTitle ? trackTitle.trim() : "";
    trackArtist = trackArtist ? trackArtist.trim() : "";

    try {
      const spotifyToken = await getSpotifyToken();
      let allValidTracks: ITrack[] = [];
      let currentOffset = 0;
      let batchSize = limit;
      let attempts = 0;
      const maxAttempts = 5;

      while (allValidTracks.length < limit && attempts < maxAttempts) {
        attempts++;
        const currentBatchSize = batchSize * (attempts + 1);

        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.getSimilar&track=${encodeURIComponent(
            trackTitle
          )}&artist=${encodeURIComponent(
            trackArtist
          )}&api_key=${LASTFM_API_KEY}&format=json&limit=${currentBatchSize}`
        );

        const data = await response.json();

        if (!data.similartracks?.track?.length) {
          if (attempts === 1) {
            alert("No similar tracks found for this query.");
            setResults([]);
            setIsLoading(false);
            return;
          } else {
            break;
          }
        }

        const tracksWithSpotifyInfo = await Promise.all(
          data.similartracks.track.map(async (track: any) => {
            const spotifyResult = await searchSpotifyTrack(
              track.name,
              track.artist.name,
              spotifyToken
            );
            return {
              title: track.name,
              artist: track.artist.name,
              spotify_url: spotifyResult?.url || "",
              spotify_uri: spotifyResult?.uri || "",
              image_url: spotifyResult?.image || "",
            };
          })
        );

        const validTracks = tracksWithSpotifyInfo.filter((track) => {
          return (
            track.spotify_uri &&
            !likedTracks.some(
              (liked) =>
                liked.spotify_uri === track.spotify_uri ||
                (liked.title === track.title && liked.artist === track.artist)
            ) &&
            !allValidTracks.some(
              (existing) => existing.spotify_uri === track.spotify_uri
            )
          );
        });

        allValidTracks = [...allValidTracks, ...validTracks];

        if (attempts === maxAttempts && allValidTracks.length === 0) {
          setResults([]);
          alert("Couldn't find enough similar tracks after filtering favorites.");
          break;
        }

        if (allValidTracks.length >= limit || validTracks.length === 0) {
          break;
        }

        currentOffset += currentBatchSize;
      }

      const finalResults = allValidTracks.slice(0, limit);
      setResults(finalResults);
      localStorage.setItem("similarSongsTracks", JSON.stringify(finalResults));
      setPlaylistUrl(null);

    } catch (err) {
      console.error("Error fetching similar tracks:", err);
      alert("Error searching for similar tracks");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToSpotify = async () => {
    const scopes = "playlist-modify-public playlist-modify-private";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    window.location.href = authUrl;
  };

  const createSpotifyPlaylist = async () => {
    if (playlistCreatedRef.current) return;
    playlistCreatedRef.current = true;

    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, curr) => {
        const parts = curr.split("=");
        acc[parts[0]] = decodeURIComponent(parts[1]);
        return acc;
      }, {} as Record<string, string>);

    const accessToken = hash.access_token;
    if (!accessToken) {
      alert("Authentication failed");
      return;
    }

    try {
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userResponse.json();
      const userId = userData.id;
      if (!userId) {
        alert("Could not retrieve user id");
        return;
      }

      const tracksString = localStorage.getItem("similarSongsTracks");
      if (!tracksString) {
        alert("No matching tracks found on Spotify");
        return;
      }
      const lastTracks: ITrack[] = JSON.parse(tracksString);

      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Similar Songs Playlist",
            public: true,
            description: "Playlist generated from Similar Songs Finder",
          }),
        }
      );
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;
      if (!playlistId) {
        alert("Playlist creation failed");
        return;
      }

      const filteredUris = lastTracks
        .map((track) => track.spotify_uri)
        .filter((uri): uri is string => !!uri);

      if (filteredUris.length === 0) {
        alert("No matching tracks found on Spotify");
        return;
      }

      const addResp = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: filteredUris }),
        }
      );
      const addData = await addResp.json();

      if (addData.snapshot_id) {
        setPlaylistUrl(playlistData.external_urls.spotify);
        window.open(playlistData.external_urls.spotify, "_blank");
        localStorage.removeItem("similarSongsTracks");
        window.location.hash = "";
      } else {
        alert("Failed to add tracks");
      }
    } catch (error) {
      console.error("Playlist creation error:", error);
      alert("Failed to create playlist");
    }
  };

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      createSpotifyPlaylist();
    }
  }, []);

  return (
    <Container>
      <Title>Discover Similar Songs</Title>

      <SearchContainer>
        <Input
          id="search"
          list="suggestions"
          placeholder="Enter song (e.g. Song Title — Artist)"
          value={searchValue}
          onChange={handleInputChange}
        />
        <datalist id="suggestions">
          {suggestions.map((track, index) => (
            <option key={index} value={`${track.title} — ${track.artist}`} />
          ))}
        </datalist>
        <Button onClick={() => handleSearch()} disabled={isLoading}>
          {isLoading ? "Searching..." : "Find Similar"}
        </Button>
      </SearchContainer>

      <LimitContainer>
        <LimitLabel>Number of songs:</LimitLabel>
        <NumberInput
          type="number"
          min="1"
          max="50"
          value={limit}
          onChange={(e) => {
            const newLimit = parseInt(e.target.value, 10) || 1;
            setLimit(Math.max(1, Math.min(50, newLimit)));
          }}
        />
      </LimitContainer>

      <ResultsContainer>
        {results.length === 0 && hasAutoSearched.current && !isLoading && (
          <EmptyState>
            No new similar tracks found (excluding your favorites).
          </EmptyState>
        )}
        {results.map((track, index) => (
          <TrackDiv key={index}>
            {track.image_url && (
              <TrackImage 
                src={track.image_url} 
                alt={`${track.title} by ${track.artist}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0aec0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E";
                }}
              />
            )}
            <TrackInfo>
              <TrackTitle>{track.title}</TrackTitle>
              <TrackArtist>{track.artist}</TrackArtist>
              {track.spotify_url && (
                <SpotifyLink href={track.spotify_url} target="_blank" rel="noreferrer">
                  Open in Spotify
                </SpotifyLink>
              )}
            </TrackInfo>
            <LikeButton onClick={() => handleLike(track)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              
              Like
            </LikeButton>
          </TrackDiv>
        ))}
      </ResultsContainer>

      {results.length > 0 && (
        <div>
          <SaveButton onClick={saveToSpotify}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor"/>
            </svg>
            Save to Spotify
          </SaveButton>
          {playlistUrl && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <SpotifyLink href={playlistUrl} target="_blank" rel="noreferrer">
                View your new playlist on Spotify
              </SpotifyLink>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <LoadingIndicator>
          <Spinner />
          Searching similar tracks...
        </LoadingIndicator>
      )}
    </Container>
  );
};

export default SimilarSongsPage;