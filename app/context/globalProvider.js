"use client";

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import themes from "./themes";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

// Типізація глобального об'єкта для window.songContext
if (typeof window !== "undefined") {
  window.songContext ||= {
    allSongs: () => {},
    ownSongsList: () => {},
  };
}

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { user } = useUser();

  const [selectedTheme, setSelectedTheme] = useState(0);
  const theme = themes[selectedTheme];
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [ownSongs, setOwnSongs] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const openModalForEdit = useCallback((song) => {
    setCurrentSong(song);
    setModal(true);
  }, []);

  const openModalForNewSong = useCallback(() => {
    setCurrentSong(null);
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const collapseMenu = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const allSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/songs?isOwn=false");
      setSongs(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch songs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const ownSongsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/songs?isOwn=true");
      setOwnSongs(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch own songs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSong = useCallback(async (id) => {
    try {
      await axios.delete(`/api/songs/${id}`);
      toast.success("Song deleted");
      setSongs((prev) => prev.filter((song) => song.id !== id));
      setOwnSongs((prev) => prev.filter((song) => song.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }, []);

  const updateSong = useCallback(async (song) => {
    try {
      await axios.put(`/api/songs`, song);
      toast.success("Song updated");
      await Promise.all([allSongs(), ownSongsList()]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }, [allSongs, ownSongsList]);

  const learnedSongs = useMemo(() => songs.filter((song) => song.isCompleted === true), [songs]);
  const toLearnSongs = useMemo(() => songs.filter((song) => song.isCompleted === false), [songs]);
  const learnedOwnSongs = useMemo(() => ownSongs.filter((song) => song.isCompleted === true), [ownSongs]);
  const toLearnOwnSongs = useMemo(() => ownSongs.filter((song) => song.isCompleted === false), [ownSongs]);

  useEffect(() => {
    if (user) {
      allSongs();
      ownSongsList();
    }
  }, [user, allSongs, ownSongsList]);

  // 🔄 Встановлюємо глобальний доступ до allSongs/ownSongsList через window.songContext
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.songContext = {
        allSongs,
        ownSongsList,
      };
    }
  }, [allSongs, ownSongsList]);

  const contextValue = useMemo(
    () => ({
      theme,
      songs,
      ownSongs,
      deleteSong,
      isLoading,
      updateSong,
      modal,
      openModalForNewSong,
      closeModal,
      collapseMenu,
      openModalForEdit,
      currentSong,
      allSongs,
      ownSongsList,
      learnedSongs,
      toLearnSongs,
      learnedOwnSongs,
      toLearnOwnSongs,
    }),
    [
      theme,
      songs,
      ownSongs,
      deleteSong,
      isLoading,
      updateSong,
      modal,
      openModalForNewSong,
      closeModal,
      collapseMenu,
      openModalForEdit,
      currentSong,
      allSongs,
      ownSongsList,
      learnedSongs,
      toLearnSongs,
      learnedOwnSongs,
      toLearnOwnSongs,
    ]
  );

  const updateContextValue = useMemo(
    () => ({
      setSongs,
      setOwnSongs,
      setSelectedTheme,
      setIsLoading,
    }),
    []
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      <GlobalUpdateContext.Provider value={updateContextValue}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
