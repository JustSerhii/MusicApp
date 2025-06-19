import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/app/utils/connect";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { title, lyrics, chords, date, completed, isOwn } = await req.json();

    if (!title || !date) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const song = await prisma.song.create({
      data: {
        title,
        lyrics,
        chords: chords || [],
        date,
        isCompleted: completed || false,
        isOwn: isOwn || false, 
        userId,
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error("ERROR CREATING SONG: ", error);
    return NextResponse.json({ error: "Error creating song", status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const isOwn = searchParams.get("isOwn") === "true";

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const songs = await prisma.song.findMany({
      where: {
        userId,
        isOwn, 
      },
    });

    console.log("SONGS: ", songs);
    return NextResponse.json(songs);
  } catch (error) {
    console.log("ERROR GETTING SONGS: ", error);
    return NextResponse.json({ error: "Error getting songs", status: 500 });
  }
}

export async function PUT(req: Request) {
  try { 
    const { userId } = auth();
    const { id, isCompleted, title, lyrics, chords, date, isOwn } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const song = await prisma.song.update({
      where: {
        id,
      },
      data: {
        isCompleted,
        title,
        lyrics,
        chords,
        date,
        isOwn, 
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    console.log("ERROR UPDATING SONG: ", error);
    return NextResponse.json({ error: "Error updating song", status: 500 });
  }
}