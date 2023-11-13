import prisma from "@/prisma";
import { connectToDB } from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const saltRounds = 10;
    const { name, email, password } = await req.json();

    // Validasi untuk name, email, dan password
    if (!name || name.length < 3) {
      throw new Error("Nama harus memiliki minimal 3 karakter");
    }
    if (!email || !email.includes("@")) {
      throw new Error("Email tidak valid");
    }
    if (!password || password.length < 8) {
      throw new Error("Password harus memiliki minimal 8 karakter");
    }

    await connectToDB();
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User sudah terdaftar, silahkan login" },
        { status: 403 }
      );
    }

    const hashedPasswords = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPasswords,
      },
    });
    console.log("users: ", user);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
