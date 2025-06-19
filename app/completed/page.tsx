"use client";

import React from 'react'
import Songs from '../Components/Songs/Songs';
import { useGlobalState } from '../context/globalProvider';

function page() {
  const { learnedSongs } = useGlobalState();

  return <Songs title="Songs I learned" songs={learnedSongs} />;
}

export default page
