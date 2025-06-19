import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import mockChords from "../../mockChords";

interface Props {
  song: {
    id: string;
    title: string;
    lyrics: string;
    chords: string[];
    date: string;
    isCompleted: boolean;
    isOwn: boolean; // Add isOwn
  };
  onClose: () => void;
}

function ViewContent({ song, onClose }: Props) {
  const [id, setId] = useState(song.id);
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics);
  const [selectedChords, setSelectedChords] = useState<string[]>(song.chords);
  const [date, setDate] = useState(song.date);
  const [hoveredChord, setHoveredChord] = useState<string | null>(null);
  const [chordPopupPosition, setChordPopupPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const resizableRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resizable = resizableRef.current;
    if (!resizable) return;

    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = resizable.getBoundingClientRect();
      if (e.clientY > rect.bottom - 10 && e.clientY < rect.bottom + 10) {
        isResizing = true;
        startY = e.clientY;
        startHeight = resizable.offsetHeight;
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newHeight = startHeight + (e.clientY - startY);
      if (newHeight > 200) {
        resizable.style.height = `${newHeight}px`;
      }
      e.preventDefault();
    };

    const handleMouseUp = () => {
      isResizing = false;
    };

    resizable.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizable.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (song) {
      setId(song.id);
      setTitle(song.title);
      setLyrics(song.lyrics);
      setSelectedChords(song.chords);
      setDate(song.date);
    }
  }, [song]);

  const getChordDiagram = (chordName: string) => {
    return mockChords.find(chord => chord.name === chordName);
  };

  const handleChordHover = (chord: string, e: React.MouseEvent) => {
    setHoveredChord(chord);
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const x = e.clientX - containerRect.left + 20;
      const y = e.clientY - containerRect.top - 140;
      setChordPopupPosition({ x, y });
    }
  };

  const renderChordsWithHover = () => {
    return selectedChords.map((chord, index) => (
      <ChordFrame
        key={index}
        onMouseEnter={(e) => handleChordHover(chord, e)}
        onMouseLeave={() => setHoveredChord(null)}
      >
        <ChordText>{chord}</ChordText>
      </ChordFrame>
    ));
  };

  return (
    <Form ref={containerRef}>
      <h1>{title}</h1>
      
      <ChordDisplay>
        Chords: <ChordsContainer>{renderChordsWithHover()}</ChordsContainer>
      </ChordDisplay>

      <div className="input-control">
        <label htmlFor="lyrics">Lyrics</label>
        <LyricsContainer>
          <LyricsDisplay
            ref={resizableRef}
            value={lyrics}
            disabled
            readOnly
          />
          <ResizeHandle />
        </LyricsContainer>
      </div>

      <button type="button" onClick={onClose}>Close</button>

      {hoveredChord && (
        <ChordPopup 
          style={{ 
            top: `${chordPopupPosition.y}px`, 
            left: `${chordPopupPosition.x}px` 
          }}
        >
          <ChordName>{hoveredChord}</ChordName>
          {getChordDiagram(hoveredChord)?.imageUrl ? (
            <img 
              src={getChordDiagram(hoveredChord)?.imageUrl} 
              alt={`${hoveredChord} chord diagram`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          ) : (
            <NoChordImage>No diagram available</NoChordImage>
          )}
        </ChordPopup>
      )}
    </Form>
  );
}

const Form = styled.div`
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow-y: auto;
  position: relative;

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

const LyricsContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

const LyricsDisplay = styled.textarea`
  background: #fff;
  padding: 0.5rem 0.75rem 0.75rem 10px;
  border-radius: 4px;
  color: #2d3748;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 200px;
  width: 100%;
  font-weight: 550;
  overflow-y: auto;
  resize: vertical;
  border: 1px solid #e2e8f0;
  background-image: linear-gradient(to bottom, transparent, transparent 31px, #dcdcdc 31px);
  background-size: 100% 32px;
  line-height: 32px;
  font-family: "Courier New", monospace;
  background-attachment: local;
  font-size: 16px;

  &:disabled {
    background-color: #fff;
    opacity: 1;
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

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  cursor: ns-resize;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ChordDisplay = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Courier New", monospace;
  color: #2d3748;
  word-wrap: break-word;
`;

const ChordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6b7280;
    border-radius: 2px;
  }
`;

const ChordFrame = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e6e6e6;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  padding: 4px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #d4d4d4;
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ChordText = styled.span`
  color: #2d3748;
  font-family: monospace;
  font-weight: 600;
  font-size: 14px;
`;

const ChordPopup = styled.div`
  position: absolute;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 120px;
  text-align: center;
  pointer-events: none;
`;

const ChordName = styled.div`
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 5px;
`;

const NoChordImage = styled.div`
  padding: 10px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #4a5568;
`;

export default ViewContent;