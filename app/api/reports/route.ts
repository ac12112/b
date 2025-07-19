export const dynamic = 'force-dynamic'; // Add this at the top
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ReportStatus, ReportType, type Report } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Define response type for the reports list
interface ReportApiResponse {
  id: string;
  reportId: string;
  type: ReportType;
  title: string;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | null;
    const type = searchParams.get("type") as ReportType | null;

    const where = {
      ...(status && { status }),
      ...(type && { type }),
    };

    const reports = await Promise.race([
      prisma.report.findMany({
        where,
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
        },
      }) as Promise<ReportApiResponse[]>, // Explicit type assertion

      new Promise<ReportApiResponse[]>((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 15000)
      )
    ]);

    return NextResponse.json(reports);
  } catch (error: unknown) {
    console.error("Failed to fetch reports:", error);

    // Handle Prisma errors
    if (error instanceof Error) {
      const message = error.message;
      if (message.includes("P1001")) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 503 }
        );
      }
      if (message.includes("P2024")) {
        return NextResponse.json(
          { error: "Database timeout" },
          { status: 504 }
        );
      }
      if (message === "Database timeout") {
        return NextResponse.json(
          { error: "Request timeout" },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (process.env.VERCEL) {
      await prisma.$disconnect();
    }
  }
}