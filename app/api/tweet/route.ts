import prisma from "@/prisma";
import { connectToDB } from "@/utils";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectToDB();
    const tweetsPost = await prisma.tweets.findMany();
    console.log("Tweet Posts: ", tweetsPost);

    return NextResponse.json({ tweetsPost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
