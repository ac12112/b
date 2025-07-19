import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return all reports since we don't have user association in the current schema
    // In a real implementation, you would filter by userId
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reportId: true,
        type: true,
        title: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        image: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reportType: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch user reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}