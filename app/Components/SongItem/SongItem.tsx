import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { trash, edit } from "@/app/utils/Icons";
import { useGlobalState } from "@/app/context/globalProvider";
import ViewContent from "../Modals/ViewContent";
import mockChords from "../../mockChords";

interface Props {
  title: string;
  lyrics: string;
  chords: string[];
  date: string;
  isCompleted: boolean;
  id: string;
  canPlay: boolean;
  isOwn: boolean;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

function SongItem({ title, lyrics, chords, date, isCompleted, id, canPlay, isOwn }: Props) {
  const { deleteSong, openModalForEdit, updateSong } = useGlobalState();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [hoveredChord, setHoveredChord] = useState<string | null>(null);
  const [chordPosition, setChordPosition] = useState<{ top: number; left: number } | null>(null);
  const chordRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleViewSong = () => {
    setIsViewModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleChordHover = (e: React.MouseEvent<HTMLDivElement>, chord: string) => {
    const chordData = mockChords.find((c) => c.name === chord);
    if (chordData) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredChord(chord);
      setChordPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleChordLeave = () => {
    setHoveredChord(null);
    setChordPosition(null);
  };

  const handleToggleCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSong({ id, isCompleted: !isCompleted, isOwn });
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <>
      <StyledSongItem onClick={handleViewSong}>
        <Header>
          <Title>{title}</Title>
        </Header>
        
        <Lyrics>{lyrics}</Lyrics>
        
        <ChordsContainer>
          {chords.map((chord, index) => (
            <ChordFrame
              key={index}
              ref={(el) => (chordRefs.current[chord + index] = el)}
              onMouseEnter={(e) => handleChordHover(e, chord)}
              onMouseLeave={handleChordLeave}
            >
              <ChordText>{chord}</ChordText>
            </ChordFrame>
          ))}
        </ChordsContainer>
        
        <Footer>
          <ActionsRow>
            <Actions>
              {isCompleted ? (
                <CompletedButton onClick={handleToggleCompletion}>
                  {isOwn ? "Finished" : "Learned"}
                </CompletedButton>
              ) : (
                <IncompleteButton onClick={handleToggleCompletion}>
                  {isOwn ? "To Finish" : "To Learn"}
                </IncompleteButton>
              )}
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  openModalForEdit({ id, title, lyrics, chords, date, isCompleted, isOwn });
                }}
                aria-label="Edit song"
              >
                {edit}
              </ActionButton>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSong(id);
                }}
                aria-label="Delete song"
              >
                {trash}
              </ActionButton>
            </Actions>
            {canPlay && (
              <PlayableBadge>
                <MusicNote>🎵</MusicNote>
                <span>Playable</span>
              </PlayableBadge>
            )}
          </ActionsRow>
        </Footer>
      </StyledSongItem>

      {isViewModalOpen && (
        <ModalBackdrop onClick={handleCloseViewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ViewContent
              song={{ id, title, lyrics, chords, date, isCompleted, isOwn }}
              onClose={handleCloseViewModal}
            />
          </ModalContent>
        </ModalBackdrop>
      )}

      {hoveredChord && chordPosition && (
        <ChordTooltip
          style={{
            top: chordPosition.top,
            left: chordPosition.left,
          }}
        >
          <ChordImage
            src={mockChords.find((c) => c.name === hoveredChord)?.imageUrl || ""}
            alt={`${hoveredChord} chord diagram`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-12h2v8h-2z'/%3E%3C/svg%3E";
            }}
          />
        </ChordTooltip>
      )}
    </>
  );
}

/* ========== STYLES ========== */
const StyledSongItem = styled.div`
  position: relative;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 0.35rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #667eea, #764ba2);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Lyrics = styled.p`
  color: #4a5568;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ChordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`;

const ChordFrame = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  transition: all 0.2s;
  position: relative;
  cursor: default;

  &:hover {
    background: #edf2f7;
    transform: translateY(-1px);
  }
`;

const ChordText = styled.span`
  color: #2d3748;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
`;

const ChordTooltip = styled.div`
  position: absolute;
  z-index: 100;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.55rem;
  animation: ${fadeIn} 0.15s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChordImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 0.5rem;
`;

const Footer = styled.div`
  margin-top: 1rem;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
`;

const PlayableBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
`;

const MusicNote = styled.span`
  font-size: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const buttonStyles = `
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CompletedButton = styled.button`
  ${buttonStyles}
  background-color: rgba(72, 187, 120, 0.1);
  color: #48bb78;

  &:hover {
    background-color: rgba(72, 187, 120, 0.2);
  }
`;

const IncompleteButton = styled.button`
  ${buttonStyles}
  background-color: rgba(246, 173, 85, 0.1);
  color: #f6ad55;

  &:hover {
    background-color: rgba(246, 173, 85, 0.2);
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #718096;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 90vw;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;

  @media (max-width: 640px) {
    width: 95vw;
    max-height: 85vh;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

export default SongItem;