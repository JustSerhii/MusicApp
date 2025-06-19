"use client";

import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import menu from "@/app/utils/menu";

function Navbar() {
  const { theme } = useGlobalState();
  const router = useRouter();

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <NavbarStyles theme={theme}>
      <div className="logo">Chordmap</div>
      <ul className="nav-items">
        <li className="nav-item" onClick={() => handleClick("/")}>
          <Link href="/">Home</Link>
        </li>
        <li className="nav-item" onClick={() => handleClick("/chords")}>
          <Link href="/chords">Chords</Link>
        </li>
        <li className="nav-item" onClick={() => handleClick("/notes")}>
          <Link href="/notes">Notes</Link>
        </li>
      </ul>
    </NavbarStyles>
  );
}

const NavbarStyles = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3%;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: all 0.3s ease;

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .nav-items {
    display: flex;
    gap: 2rem;
    align-items: center;

    .nav-item {
      font-size: 1rem;
      font-weight: 500;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      padding: 0.5rem 0;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #4f46e5, #7c3aed);
        transition: width 0.3s ease;
      }

      &:hover {
        color: #2d3748;

        &::after {
          width: 100%;
        }
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    .nav-items {
      gap: 1.5rem;
    }
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 32, 42, 0.96);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    .nav-items .nav-item {
      color: #a0aec0;
      
      &:hover {
        color: #edf2f7;
      }
    }
  }
`;

export default Navbar;
