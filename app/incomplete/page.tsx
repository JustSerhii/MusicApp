"use client"

import React from 'react'
import Songs from '../Components/Songs/Songs';
import { useGlobalState } from '../context/globalProvider';

function page() {
  const { toLearnSongs } = useGlobalState();

  return <Songs title="Songs to learn" songs={toLearnSongs} />;
}
export default page
