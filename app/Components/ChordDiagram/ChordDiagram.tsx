"use client";

import React from 'react';
import styled from 'styled-components';

const ChordDiagramStyled = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

interface ChordDiagramProps {
  chordName: string;
  imageUrl: string;
  soundUrl: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chordName, imageUrl, soundUrl }) => {
  const playSound = () => {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => console.error("Error playing the sound:", error));
  };

  return (
    <ChordDiagramStyled onClick={playSound}>
      <div className="chord-name">{chordName}</div>
      <img src={imageUrl} alt={`${chordName} chord`} />
    </ChordDiagramStyled>
  );
};

export default ChordDiagram;
