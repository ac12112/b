/*
  Warnings:

  - You are about to drop the column `image` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportType` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Report` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Report_reportId_idx";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "image",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "reportType",
DROP COLUMN "type",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
