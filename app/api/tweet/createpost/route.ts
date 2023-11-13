import prisma from "@/prisma";
import { connectToDB } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { tweet, userId } = await req.json();

    if (tweet.length < 1) {
      return NextResponse.json({ error: "Invalid Tweet" });
    }

    await connectToDB();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak dapat ditemukan" },
        { status: 404 }
      );
    }

    const newTweet = await prisma.tweets.create({
      data: {
        tweet,
        userId,
      },
    });

    return NextResponse.json({ newTweet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
