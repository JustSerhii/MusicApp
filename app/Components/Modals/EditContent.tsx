"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import mockChords from "../../mockChords";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";

interface Props {
  song: {
    id: string;
    title: string;
    lyrics: string;
    chords: string[];
    date: string;
    isCompleted: boolean;
    isOwn: boolean;
  };
}

function EditContent({ song }: Props) {
  const { closeModal, allSongs, ownSongsList } = useGlobalState();

  const [id, setId] = useState(song.id);
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics);
  const [typedChords, setTypedChords] = useState("");
  const [selectedChords, setSelectedChords] = useState<string[]>(song.chords);
  const [isOwn, setIsOwn] = useState(song.isOwn);
  const [isCompleted, setIsCompleted] = useState(song.isCompleted);

  useEffect(() => {
    console.log("EditContent received song:", song);
    if (song) {
      setId(song.id);
      setTitle(song.title);
      setLyrics(song.lyrics);
      setSelectedChords(song.chords);
      setIsOwn(song.isOwn);
      setIsCompleted(song.isCompleted);
    }
  }, [song]);

  const handleChange = (name: string) => (e: any) => {
    let value = e.target.value;
    if (name === "typedChords") {
      value = value.replace(/^ +| +$|( ) +/g, "$1");
    }

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "lyrics":
        setLyrics(value);
        break;
      case "typedChords":
        setTypedChords(value);
        break;
      default:
        break;
    }
  };

  const handleChordSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chordName = e.target.value;
    if (chordName && !selectedChords.includes(chordName)) {
      setSelectedChords([...selectedChords, chordName]);
    }
  };

  const handleRemoveChord = (chord: string) => {
    setSelectedChords(selectedChords.filter((c) => c !== chord));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedChordsArray = typedChords
      .split(",")
      .map((chord) => chord.trim())
      .filter((chord) => chord !== "");
    const combinedChords = Array.from(
      new Set([...typedChordsArray, ...selectedChords])
    );
    const songData = {
      id,
      title,
      lyrics,
      chords: combinedChords,
      date: new Date().toISOString().split("T")[0],
      isOwn,
      isCompleted,
    };

    console.log("Submitting song data:", songData);

    try {
      const res = await axios.put("/api/songs", songData);
      console.log("API response:", res.data);
      if (res.status !== 200) {
        toast.error(res.data.error || "Failed to update song");
      } else {
        toast.success("Song updated successfully");
        closeModal();
        await Promise.all([allSongs(), ownSongsList()]);
      }
    } catch (error: any) {
      console.error("Error updating song:", error);
      if (error.response?.status === 405) {
        toast.error("Method not allowed. Please check the API endpoint.");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    }
  };

  const resetForm = () => {
    setTitle(song.title);
    setLyrics(song.lyrics);
    setTypedChords("");
    setSelectedChords(song.chords);
    setIsOwn(song.isOwn);
    setIsCompleted(song.isCompleted);
  };

  useEffect(() => {
    return () => resetForm();
  }, [song]);

  const updateChordDisplay = () => {
    const typedChordsArray = typedChords
      .split(",")
      .map((chord) => chord.trim())
      .filter((chord) => chord !== "");
    const combinedChords = Array.from(
      new Set([...typedChordsArray, ...selectedChords])
    );
    return combinedChords.join(", ");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Edit Song</h1>
      <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          style={{ ...inputStyle, width: "400px" }}
          type="text"
          id="title"
          value={title}
          onChange={handleChange("title")}
          placeholder="Title of the song"
          required
        />
      </div>

      <ChordDisplay>
        Chords: {updateChordDisplay()}
      </ChordDisplay>

      <div className="input-control">
        <label htmlFor="lyrics">Lyrics</label>
        <textarea
          style={{ ...inputStyle, width: "100%" }}
          id="lyrics"
          value={lyrics}
          onChange={handleChange("lyrics")}
          placeholder="Lyrics of the song"
          required
        />
      </div>

      <div className="input-control">
        <label htmlFor="typedChords">Type Chords</label>
        <input
          style={{ ...inputStyle, width: "100%" }}
          type="text"
          id="typedChords"
          value={typedChords}
          onChange={handleChange("typedChords")}
          placeholder="Type chords e.g., G, Am, C, D"
        />
      </div>

      <div className="input-control">
        <label htmlFor="chords">Or Select Chords</label>
        <ChordsContainer>
          {selectedChords.map((chord) => (
            <ChordTag key={chord}>
              {chord}
              <RemoveCross onClick={() => handleRemoveChord(chord)}>
                ×
              </RemoveCross>
            </ChordTag>
          ))}
        </ChordsContainer>
        <select onChange={handleChordSelect} value="" style={inputStyle}>
          <option disabled value="">
            Select a chord
          </option>
          {mockChords.map((chord) => (
            <option key={chord.id} value={chord.name}>
              {chord.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Submit</button>
    </Form>
  );
}

const inputStyle: React.CSSProperties = {
  color: "#2d3748",
  backgroundColor: "#fff",
  wordWrap: "break-word",
};

const Form = styled.form`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow-y: auto;

  h1 {
    text-align: center;
    color: #2d3748;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .input-control {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #4a5568;
      font-weight: 600;
    }

    input[type="text"],
    textarea {
      background-image: linear-gradient(to bottom, transparent, transparent 31px, #dcdcdc 31px);
      background-size: 100% 32px;
      line-height: 32px;
      padding-left: 10px;
      background-attachment: local;
      word-wrap: break-word;
    }
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 1rem;
      transition: border-color 0.3s;

      &:focus {
        border-color: #4f46e5;
        outline: none;
      }
    }

    textarea {
      resize: vertical;
      height: 150px;
      word-wrap: break-word;
    }
  }

  button {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 6px;
    background: #4f46e5;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: #4338ca;
    }
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6b7280;
    border-radius: 6px;
    border: 3px solid #f3f4f6;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #4a5568;
  }
`;

const ChordDisplay = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  word-wrap: break-word;
`;

const ChordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChordTag = styled.div`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  color: #2d3748;
`;

const RemoveCross = styled.span`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #e53e3e;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;

  &:hover {
    color: #c53030;
  }
`;

export default EditContent;
