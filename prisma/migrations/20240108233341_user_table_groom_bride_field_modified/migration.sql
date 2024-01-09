/*
  Warnings:

  - You are about to drop the column `groomBride` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "groomBride",
ADD COLUMN     "isGroom" BOOLEAN NOT NULL DEFAULT false;
