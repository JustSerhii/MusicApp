"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import mockChords from '../mockChords';
import ChordDiagram from '../Components/ChordDiagram/ChordDiagram';

/** Можливі вміння користувача */
const chordCategories = [
  { id: 'open', label: 'Open chords' },
  { id: 'barre', label: 'Barre chords' },
  { id: 'power', label: 'Power chords' }
];

/** Можливі типи акордів */
const chordTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'major', label: 'Major' },
  { id: 'minor', label: 'Minor' },
  { id: 'diminished', label: 'Diminished' },
  { id: 'augmented', label: 'Augmented' },
  { id: 'seventh', label: 'Seventh' }
];

/** Дані для Квінтового кола */
const circleOfFifths = [
  { key: 'C', related: ['C', 'G', 'F', 'Am', 'Dm', 'Em'] },
  { key: 'G', related: ['G', 'D', 'C', 'Em', 'Am', 'Bm'] },
  { key: 'D', related: ['D', 'A', 'G', 'Bm', 'Em', 'F#m'] },
  { key: 'A', related: ['A', 'E', 'D', 'F#m', 'Bm', 'C#m'] },
  { key: 'E', related: ['E', 'B', 'A', 'C#m', 'F#m', 'G#m'] },
  { key: 'B', related: ['B', 'F#', 'E', 'G#m', 'C#m', 'D#m'] },
  { key: 'F#', related: ['F#', 'C#', 'B', 'D#m', 'G#m', 'A#m'] },
  { key: 'C#', related: ['C#', 'G#', 'F#', 'A#m', 'D#m', 'Fm'] },
  { key: 'G#', related: ['G#', 'D#', 'C#', 'Fm', 'A#m', 'Cm'] },
  { key: 'D#', related: ['D#', 'A#', 'G#', 'Cm', 'Fm', 'Gm'] },
  { key: 'A#', related: ['A#', 'F', 'D#', 'Gm', 'Cm', 'Dm'] },
  { key: 'F', related: ['F', 'C', 'A#', 'Dm', 'Gm', 'Am'] }
];

/** СТИЛІ */
const PageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);  
  min-height: 100vh;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SkillsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const SkillButton = styled.button<{ active: boolean }>`
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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 40px;
  height: 20px;
  background: #e2e8f0;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;

  &:checked {
    background: #4f46e5;
  }

  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

const CircleOfFifthsContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const CircleOfFifthsTitle = styled.h3`
  margin-bottom: 1rem;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
`;

const KeyButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const KeyButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, #ed64a6 0%, #f687b3 100%)' 
    : 'linear-gradient(90deg, #e2e8f0 0%, #d1d9e6 100%)'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active 
    ? '0 2px 4px rgba(237, 100, 166, 0.2)' 
    : '0 1px 3px rgba(0, 0, 0, 0.1)'};

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(90deg, #d53f8c 0%, #ed64a6 100%)' 
      : 'linear-gradient(90deg, #d1d9e6 0%, #c4cee2 100%)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.active 
      ? '0 4px 8px rgba(237, 100, 166, 0.3)' 
      : '0 2px 5px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.active 
      ? '0 2px 4px rgba(237, 100, 166, 0.2)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  }
`;

const RelatedChords = styled.div`
  font-size: 0.9rem;
  color: #718096;
`;

const ChordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const ChordCard = styled.div`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 1rem;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ChordsPage = () => {
  // Ініціалізуємо стан з localStorage відразу
  const [skills, setSkills] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chordSkills');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          console.warn('Invalid skills format in localStorage:', e);
        }
      }
    }
    return [];
  });

  // Нові стани для фільтрації та функціоналу
  const [selectedChordType, setSelectedChordType] = useState('all');
  const [showVariations, setShowVariations] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Зберігаємо в localStorage при кожній зміні skills
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chordSkills', JSON.stringify(skills));
    }
  }, [skills]);

  const toggleSkill = (id: string) => {
    setSkills(prev =>
      prev.includes(id)
        ? prev.filter(skill => skill !== id)
        : [...prev, id]
    );
  };

  // Фільтруємо акорди на основі вибраних навичок, типу акорду та тональності
  const filteredChords = mockChords
    .filter(chord => {
      // Фільтр за навичками (виправлено: skills порівнюється з category, а не type)
      if (skills.length > 0 && !skills.includes(chord.type)) {
        return false;
      }
      // Фільтр за типом акорду
      if (selectedChordType !== 'all') {
        const chordType = chord.name.toLowerCase().includes('m') 
          ? 'minor' 
          : chord.name.toLowerCase().includes('dim') 
          ? 'diminished' 
          : chord.name.toLowerCase().includes('aug') 
          ? 'augmented' 
          : chord.name.toLowerCase().includes('7') 
          ? 'seventh' 
          : 'major';
        return chordType === selectedChordType;
      }
      return true;
    })
    .filter(chord => {
      // Фільтр за тональністю
      if (!selectedKey) return true;
      const relatedChords = circleOfFifths.find(k => k.key === selectedKey)?.related || [];
      return relatedChords.some(key => chord.name.startsWith(key));
    });

  return (
    <PageContainer>
      <SectionTitle>Explore Chords</SectionTitle>

      <CircleOfFifthsContainer>
        <CircleOfFifthsTitle>Circle of Fifths</CircleOfFifthsTitle>
        <KeyButtons>
          {circleOfFifths.map(({ key }) => (
            <KeyButton
              key={key}
              active={selectedKey === key}
              onClick={() => setSelectedKey(selectedKey === key ? null : key)}
            >
              {key}
            </KeyButton>
          ))}
        </KeyButtons>
        {selectedKey && (
          <RelatedChords>
            Related Chords in {selectedKey}: {circleOfFifths.find(k => k.key === selectedKey)?.related.join(', ')}
          </RelatedChords>
        )}
      </CircleOfFifthsContainer>

      <SkillsContainer>
        {chordCategories.map(category => (
          <SkillButton
            key={category.id}
            active={skills.includes(category.id)}
            onClick={() => toggleSkill(category.id)}
          >
            {category.label}
          </SkillButton>
        ))}
      </SkillsContainer>

      <FilterContainer>
        <Select
          value={selectedChordType}
          onChange={(e) => setSelectedChordType(e.target.value)}
        >
          {chordTypes.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </Select>
        {/* <ToggleLabel>
          Show Variations
          <ToggleInput
            type="checkbox"
            checked={showVariations}
            onChange={() => setShowVariations(prev => !prev)}
          />
        </ToggleLabel> */}
      </FilterContainer>

      <ChordsGrid>
        {filteredChords.map(chord => (
          <ChordCard key={chord.id}>
            <ChordDiagram
              chordName={chord.name}
              imageUrl={chord.imageUrl}
              soundUrl={chord.soundUrl}
            />
          </ChordCard>
        ))}
      </ChordsGrid>
    </PageContainer>
  );
};

export default ChordsPage;