"use client";

import { useGlobalState } from "./context/globalProvider";
import Image from "next/image";
import Songs from "./Components/Songs/Songs"
import { useFormState } from "react-dom";

export default function Home() {
  
  const {songs} = useGlobalState();
  
  return (
    <Songs songs={songs} title={"Songs"}/>
  );
}
