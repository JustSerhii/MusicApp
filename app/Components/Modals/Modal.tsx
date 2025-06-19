"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import React, { useState } from "react";
import styled from "styled-components";
import CreateContent from "./CreateContent";
import EditContent from "./EditContent";

interface Props {
  content?: React.ReactNode;
}

function Modal({ content }: Props) {
  const { closeModal, currentSong } = useGlobalState();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleWidth = () => {
    setIsExpanded(!isExpanded);
  };

  const contentToRender = currentSong ? <EditContent song={currentSong} /> : <CreateContent />;

  return (
    <ModalStyled>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className={`modal-content ${isExpanded ? "expanded" : ""}`}>
        <ToggleButton onClick={toggleWidth} aria-label={isExpanded ? "Shrink modal" : "Expand modal"}>
          {isExpanded ? "↔" : "↔"}
        </ToggleButton>
        {content || contentToRender}
      </div>
    </ModalStyled>
  );
}

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.45);
  }

  .modal-content {
    margin: 0 1rem;
    padding: 0;
    position: relative;
    max-width: 500px;
    width: 100%;
    overflow: hidden;
    z-index: 100;
    border-radius: 1rem;
    background: transparent;
    transition: max-width 0.3s ease;

    &.expanded {
      max-width: 800px;
    }

    & > form {
      max-height: calc(100vh - 4rem);
      overflow-y: auto;
    }

    @media screen and (max-width: 850px) {
      &.expanded {
        max-width: 95vw;
      }
    }

    @media screen and (max-width: 450px) {
      font-size: 90%;
    }
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 101;
  transition: background-color 0.3s;

  &:hover {
    background: #4338ca;
  }
`;

export default Modal;