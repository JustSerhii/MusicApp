"use client";

import React from "react";
import Songs from "../Components/Songs/Songs";
import { useGlobalState } from "../context/globalProvider";

function MySongs() {
  const { ownSongs } = useGlobalState();

  return <Songs title="My Songs" songs={ownSongs} />;
}

export default MySongs;