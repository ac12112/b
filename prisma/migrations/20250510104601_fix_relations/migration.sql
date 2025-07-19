/*
  Warnings:

  - You are about to drop the column `userId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `reportType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "userId",
ADD COLUMN     "reportType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Report_reportId_idx" ON "Report"("reportId");
