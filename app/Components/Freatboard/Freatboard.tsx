"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const GuitarFretboardContainer = styled.div`
  text-transform: none;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  width: 100%;
  color: #2d3748;
  border-radius: 1rem;
  height: 100vh;
  overflow-y: auto;
  display: grid;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

const GuitarNeck = styled.div`
  position: relative;
  margin-top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 970px;
  height: 265px;
  background: linear-gradient(135deg, #d8b3fc, #c0a6fc);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), inset 0px 1px 8px rgba(255, 255, 255, 0.2);
  border-radius: 2px;
`;

const Fret = styled.div`
  float: left;
  width: 3px;
  height: 265px;
  background: linear-gradient(to right, #e5e5e5, #d1d1d1);
  margin-left: 77px;
  border-right: 2px solid rgba(180, 180, 180, 0.5);

  &.first {
    position: absolute;
    width: 50px;
    left: -52px;
    top: 0;
    margin-left: 0;
    background: linear-gradient(to bottom, #000000, #1a1a1a);
    border-radius: 2px 0 0 2px;
  }
`;

const Dots = styled.ul`
  position: absolute;
  width: 500px;
  height: 20px;
  top: 47%;
  left: 45%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;

  li {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(145deg, #ffffff, #e5e5e5);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const Strings = styled.ul`
  position: absolute;
  left: 0;
  top: 20px;
  width: 960px;
  height: 260px;

  li {
    height: 1px;
    width: 100%;
    background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
    margin-bottom: 38px;
    border-bottom: 2px solid rgba(160, 160, 170, 0.6);
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    &:nth-child(2) { height: 2px; }
    &:nth-child(3) { height: 3px; }
    &:nth-child(4) { height: 4px; }
    &:nth-child(5) { height: 5px; }
    &:nth-child(6) { height: 6px; }
  }
`;

const OpenNotes = styled.ul`
  position: absolute;
  top: 3px;
  left: -35px;

  li {
    margin-top: 5px;
    margin-bottom: 15px;
    font-size: 18px;
    color: #f8fafc;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: color 0.3s ease;

    &.active {
      color: #c7d2fe;
    }
  }
`;

const Notes = styled.div`
  position: absolute;
  left: 17px;
  top: -7px;
  width: 960px;
  height: 258px;
  overflow-x: hidden;

  .mask {
    position: absolute;
    right: -189px;
    bottom: 0;
    width: 1184px;
    height: 30px;

    ul {
      position: relative;
      float: left;

      li {
        float: left;
        width: 30px;
        height: 30px;
        margin-right: 50px;
        background: linear-gradient(145deg, #6366f1, #7c3aed);
        color: white;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        font-weight: 600;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15), 0 5px 5px rgba(0, 0, 0, 0.12);
        }
      }
    }

    &.a { bottom: 47px; }
    &.d { bottom: 93px; }
    &.g { bottom: 137px; }
    &.b { bottom: 181px; }
    &.high-e { bottom: 224px; }
  }
`;

const Controls = styled.div`
  position: relative;
  margin-top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  height: 300px;
  text-align: center;
  color: #4a5568;

  .buttons-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    a {
      text-decoration: none;
      background: linear-gradient(to right, #6366f1, #7c3aed);
      color: white;
      padding: 8px 16px;
      margin-right: 40px;
      cursor: pointer;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);

      &.down {
        margin-right: 0;
      }

      &:hover {
        background: linear-gradient(to right, #4f46e5, #6d28d9);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      }

      &:active {
        transform: translateY(1px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
    }
  }

  h2 {
    margin: 40px 0;
    color: #2d3748;
    font-weight: 600;
  }

  ul {
    display: flex;
    justify-content: center;
    padding: 0;
    flex-wrap: wrap;

    li {
      width: 40px;
      height: 30px;
      background: linear-gradient(145deg, #6366f1, #7c3aed);
      color: white;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background: linear-gradient(145deg, #4f46e5, #6d28d9);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      }

      &:active {
        transform: translateY(1px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
    }
  }
`;

const Fretboard: React.FC = () => {
  const [noteToShow, setNoteToShow] = useState('All');
  const [notes, setNotes] = useState({
    e: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    a: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    d: ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    g: ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    b: ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  });

  const tuneStep = (direction: 'up' | 'down') => {
    const newNotes = { ...notes };
    const shift = direction === 'up' ? -1 : 1;

    Object.keys(newNotes).forEach((string) => {
      const notesArray = newNotes[string as keyof typeof notes];
      if (shift === -1) {
        notesArray.unshift(notesArray.pop() as string);
      } else {
        notesArray.push(notesArray.shift() as string);
      }
    });

    setNotes(newNotes);
  };

  const handleNoteChange = (note: string) => {
    setNoteToShow(note);
  };

  const renderNotes = (string: keyof typeof notes) => {
    const notesArray = notes[string];
    return notesArray.map((note, index) => (
      <li key={index} data-note={note} style={{ opacity: noteToShow === 'All' || noteToShow === note ? 1 : 0 }}>
        {note}
      </li>
    ));
  };

  return (
    <GuitarFretboardContainer>
      <GuitarNeck>
        {Array.from({ length: 13 }, (_, i) => (
          <Fret key={i} className={i === 0 ? 'first' : ''}></Fret>
        ))}
        <Dots>
          {Array.from({ length: 4 }, (_, i) => <li key={i}></li>)}
        </Dots>
        <Strings>
          {Array.from({ length: 6 }, (_, i) => <li key={i}></li>)}
        </Strings>
        <OpenNotes>
          {['E', 'B', 'G', 'D', 'A', 'E'].map((note, index) => (
            <li key={index} className={note.toLowerCase()}>{notes[note.toLowerCase() as keyof typeof notes][0]}</li>
          ))}
        </OpenNotes>
        <Notes>
          <div className="mask low-e"><ul>{renderNotes('e')}</ul></div>
          <div className="mask a"><ul>{renderNotes('a')}</ul></div>
          <div className="mask d"><ul>{renderNotes('d')}</ul></div>
          <div className="mask g"><ul>{renderNotes('g')}</ul></div>
          <div className="mask b"><ul>{renderNotes('b')}</ul></div>
          <div className="mask high-e"><ul>{renderNotes('e')}</ul></div>
        </Notes>
      </GuitarNeck>
      <Controls>
        <div className="buttons-container">
          <a className="up" onClick={() => tuneStep('up')}>Tune 1/2 Step Up</a>
          <a className="down" onClick={() => tuneStep('down')}>Tune 1/2 Step Down</a>
        </div>
        <h2></h2>
        <ul>
          {['All', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'].map((note, i) => (
            <li key={i} onClick={() => handleNoteChange(note)}>{note}</li>
          ))}
        </ul>
      </Controls>
    </GuitarFretboardContainer>
  );
};

export default Fretboard;