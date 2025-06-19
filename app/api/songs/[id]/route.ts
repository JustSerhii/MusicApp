import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const { id } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const song = await prisma.song.delete({
      where: {
        id,
      },
    });

    console.log("SONG DELETED: ", song);

    return NextResponse.json(song);
  } catch (error) {
    console.log("ERROR DELETING song: ", error);
    return NextResponse.json({ error: "Error deleting song", status: 500 });
  }
}