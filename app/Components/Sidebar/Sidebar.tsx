"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import Link from "next/link";
import Image from "next/image";
import menu from "@/app/utils/menu";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/app/utils/Icons";
import { useClerk } from "@clerk/nextjs";
import { UserButton, useUser } from "@clerk/nextjs";

function Sidebar() {
  const { theme } = useGlobalState();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  };
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleClick = (link) => {
    router.push(link);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarStyled theme={theme} isCollapsed={isCollapsed}>
      <div className="toggle-btn" onClick={toggleCollapse}>
        <span>{isCollapsed ? ">" : "<"}</span>
      </div>
      <div className="profile">
        <div className="profile-overlay"></div>
        <div className="image">
          <Image width={70} height={70} src={imageUrl} alt="profile" />
        </div>
        <div className="user-btn absolute z-20 top-0 w-full h-full">
          <UserButton />
        </div>
        <div className="user-name">
          <div className="first-name">{firstName}</div>
          <div className="last-name">{lastName}</div>
        </div>
      </div>

      <ul className="nav-items">
        {menu.map((item) => {
          const link = item.link;
          return (
            <li
              key={item.id}
              className={`nav-item ${pathname === link ? "active" : ""}`}
              onClick={() => {
                handleClick(link);
              }}
            >
              {item.icon}
              <Link href={link}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
      <div className="sign-out">
        <SignOutButton
          onClick={() => {
            signOut(() => router.push("/signin"));
          }}
        >
          <span className="icon">{logout}</span>
          <span>Sign Out</span>
        </SignOutButton>
      </div>
    </SidebarStyled>
  );
}

const SidebarStyled = styled.nav`
  position: relative;
  width: ${(props) => (props.isCollapsed ? "60px" : props.theme.sidebarWidth)};
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  height: 120%;
  transition: width 0.3s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #667eea, #764ba2);
    border-radius: 1rem 0 0 1rem;
  }

  .toggle-btn {
    position: absolute;
    top: 1rem;
    right: -1rem;
    width: 1.5rem;
    height: 1.5rem;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-weight: bold;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .user-btn {
    .cl-rootBox {
      width: 100%;
      height: 100%;

      .cl-userButtonBox {
        width: 100%;
        height: 100%;

        .cl-userButtonTrigger {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }

  .profile {
    margin: 1rem 0;
    padding: 1rem 0.8rem;
    position: relative;
    border-radius: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    color: #2d3748;
    display: flex;
    align-items: center;
    ${(props) => props.isCollapsed && "display: none;"}
  }

  .profile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    z-index: 0;
    background: rgba(248, 250, 252, 0.8);
    transition: all 0.55s linear;
    border-radius: 0.75rem;
    border: 1px solid rgba(226, 232, 240, 0.5);
    opacity: 0.5;
  }

  .user-name {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    font-size: 0.9rem;
    line-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #2d3748;
    ${(props) => props.isCollapsed && "display: none;"}
  }

  .first-name,
  .last-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .image,
  .user-name {
    position: relative;
    z-index: 1;
  }

  .image {
    flex-shrink: 0;
    display: inline-block;
    overflow: hidden;
    transition: all 0.5s ease;
    border-radius: 100%;
    width: 70px;
    height: 70px;
    border: 2px solid rgba(226, 232, 240, 0.8);

    img {
      border-radius: 100%;
      transition: all 0.5s ease;
    }
  }

  &:hover {
    .profile-overlay {
      opacity: 0.8;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    img {
      transform: scale(1.1);
    }
  }

  .sign-out {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    width: auto;
    ${(props) => props.isCollapsed && "display: none;"}
  }

  .nav-items {
    margin-top: 2rem;
    ${(props) => props.isCollapsed && "margin-top: 1rem;"}
  }

  .nav-item {
    position: relative;
    padding: ${(props) => (props.isCollapsed ? "0.5rem 0" : "0.8rem 1rem 0.9rem 2.1rem")};
    margin: 0.3rem 0;
    display: grid;
    grid-template-columns: ${(props) => (props.isCollapsed ? "1fr" : "40px 1fr")};
    cursor: pointer;
    align-items: center;
    justify-items: ${(props) => (props.isCollapsed ? "center" : "start")};
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background-color: rgba(237, 242, 247, 0.8);
      z-index: 1;
      transition: all 0.3s ease-in-out;
      border-radius: 0.5rem;
    }

    a {
      font-weight: 500;
      transition: all 0.3s ease-in-out;
      z-index: 2;
      line-height: 0;
      color: #4a5568;
      ${(props) => props.isCollapsed && "display: none;"}
    }

    i {
      display: flex;
      align-items: center;
      justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
      color: #4a5568;
      z-index: 2;
    }

    &:hover {
      &::after {
        width: 100%;
      }

      i, a {
        color: #2d3748;
      }
    }
  }

  .active {
    background-color: rgba(226, 232, 240, 0.5);

    i,
    a {
      color: #2d3748;
      font-weight: 600;
    }

    &::after {
      width: 100%;
      background-color: rgba(226, 232, 240, 0.8);
    }
  }

  > button {
    margin: 1.5rem;
  }
`;

const SignOutButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  background: rgba(226, 232, 240, 0.5);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  .icon {
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    color: #4a5568;
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgba(226, 232, 240, 0.8);
    color: #2d3748;

    .icon {
      color: #2d3748;
    }
  }
`;

export default Sidebar;