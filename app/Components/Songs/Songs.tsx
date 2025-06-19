"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import SongItem from "../SongItem/SongItem";
import Modal from "../Modals/Modal";
import mockChords from "../../mockChords";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  songs: any[];
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function Songs({ title, songs }: Props) {
  const { theme, isLoading, openModalForNewSong, modal } = useGlobalState();
  const pathname = usePathname();
  const isMySongsPage = pathname === "/mysongs";
  const [chordSkills, setChordSkills] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("chordSkills");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setChordSkills(parsed);
        }
      } catch (e) {
        console.warn("Failed to parse chord skills:", e);
      }
    }
  }, []);

  const getChordType = (chordName: string) => {
    const chordName_trimmed = chordName.trim();
    const foundChord = mockChords.find((chord) => chord.name === chordName_trimmed);
    if (foundChord) return foundChord.type;

    if (chordName_trimmed.includes("5") && chordName_trimmed.length <= 3) {
      return "power";
    }

    if (
      chordName_trimmed.startsWith("B") ||
      chordName_trimmed.startsWith("F") ||
      chordName_trimmed.includes("#") ||
      chordName_trimmed.includes("b")
    ) {
      return "barre";
    }

    return "open";
  };

  const canPlaySong = (songChords: string[]) => {
    if (chordSkills.length === 0) return false;
    return songChords.every((chord) => {
      const chordType = getChordType(chord);
      return chordSkills.includes(chordType);
    });
  };

  return (
    <SongsContainer>
      {modal && <Modal />}

      <Header>
        <Title>{title}</Title>
        <AddButton onClick={openModalForNewSong}>
          <PlusIcon>+</PlusIcon>
          Add New Song
        </AddButton>
      </Header>

      <SongGrid>
        {songs.map((song) => {
          const canPlay = canPlaySong(song.chords);
          return (
            <SongItem
              key={song.id}
              title={song.title}
              lyrics={song.lyrics}
              chords={song.chords}
              date={song.date}
              isCompleted={song.isCompleted}
              id={song.id}
              canPlay={canPlay}
              isOwn={song.isOwn}
            />
          );
        })}
      </SongGrid>

      {/* {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>Loading songs...</LoadingText>
        </LoadingOverlay>
      )} */}
    </SongsContainer>
  );
}

/* ========== STYLES ========== */

const SongsContainer = styled.main`
  padding: 2rem;
  width: 100%;
  background: white;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(102, 126, 234, 0.1);
  border-radius: 1rem;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PlusIcon = styled.div`
  font-size: 1.25rem;
  line-height: 1;
`;

const SongGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #4f46e5;
  font-weight: 500;
`;

export default Songs;