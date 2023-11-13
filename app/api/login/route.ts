import prisma from "@/prisma";
import { connectToDB } from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    await connectToDB();

    const existingUser = await prisma.user.findUnique({
      where: {
        email, //Shorthand email : email => email
      },
    });
    if (!existingUser) {
      console.log("Server : User tidak dapat ditemukan");
      return NextResponse.json(
        { message: "User tidak dapat ditemukan" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      console.log("Password tidak valid");
      return NextResponse.json(
        { message: "Password tidak valid" },
        { status: 403 }
      );
    }

    if (existingUser && isPasswordCorrect) {
      console.log("Anda berhasil login");
      return NextResponse.json({ existingUser }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
