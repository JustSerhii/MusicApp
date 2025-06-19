import React, { useEffect, useState } from "react";
import axios from "axios";
import mockChords from "../../mockChords";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import { usePathname } from "next/navigation"; // Import usePathname

interface Props {
  song?: {
    id: string;
    title: string;
    lyrics: string;
    chords: string[];
    date: string;
    isCompleted: boolean;
    isOwn?: boolean;
  };
}

function CreateContent({ song }: Props) {
  const { closeModal, allSongs, ownSongsList } = useGlobalState();
  const pathname = usePathname(); // Get current pathname
  const isMySongsPage = pathname === "/mysongs"; // Check if on My Songs page

  const [id, setId] = useState(song?.id || "");
  const [title, setTitle] = useState(song?.title || "");
  const [lyrics, setLyrics] = useState(song?.lyrics || "");
  const [typedChords, setTypedChords] = useState("");
  const [selectedChords, setSelectedChords] = useState<string[]>(song?.chords || []);

  const handleChange = (name: string) => (e: any) => {
    let value = e.target.value;
    if (name === "typedChords") {
      value = value.replace(/^ +| +$|( ) +/g, "$1");
    }

    switch (name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "lyrics":
        setLyrics(e.target.value);
        break;
      case "typedChords":
        setTypedChords(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleChordSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chordName = e.target.value;
    if (!selectedChords.includes(chordName)) {
      setSelectedChords([...selectedChords, chordName]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const typedChordsArray = typedChords
      .split(",")
      .map((chord) => chord.trim())
      .filter((chord) => chord !== "");
    const combinedChords = Array.from(new Set(typedChordsArray.concat(selectedChords)));
    const songData = {
      title,
      lyrics,
      chords: combinedChords,
      date: new Date().toISOString().split("T")[0],
      isOwn: isMySongsPage, // Set isOwn based on page
    };

    try {
      let res;

      if (id) {
        res = await axios.put(`/api/songs/${id}`, { ...songData, id });
      } else {
        res = await axios.post("/api/songs", songData);
      }
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(`Song ${id ? "updated" : "created"} successfully.`);
        closeModal();
        if (isMySongsPage) {
          ownSongsList(); // Refresh own songs
        } else {
          allSongs(); // Refresh all songs
        }
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const resetForm = () => {
    setId("");
    setTitle("");
    setLyrics("");
    setTypedChords("");
    setSelectedChords([]);
  };

  useEffect(() => {
    return () => resetForm();
  }, []);

  const updateChordDisplay = () => {
    const typedChordsArray = typedChords
      .split(",")
      .map((chord) => chord.trim())
      .filter((chord) => chord !== "");

    const combinedChords = Array.from(
      new Set(typedChordsArray.concat(selectedChords))
    );

    return combinedChords.join(", ");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>{id ? "Edit Song" : "Add a Song"}</h1>
      <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          style={inputStyle}
          type="text"
          id="title"
          value={title}
          onChange={handleChange("title")}
          placeholder="Title of the song"
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
          placeholder="Type chords e.g., G Am C D"
        />
      </div>

      <div className="input-control">
        <label htmlFor="chords">Or Select Chords</label>
        <div>Selected Chords: {selectedChords.join(", ")}</div>
        <select onChange={handleChordSelect} defaultValue="" style={inputStyle}>
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

export default CreateContent;