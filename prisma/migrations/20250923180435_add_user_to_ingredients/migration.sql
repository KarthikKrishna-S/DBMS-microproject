/*
  Warnings:

  - A unique constraint covering the columns `[name,creatorUsername]` on the table `Ingredients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorUsername` to the `Ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ingredients` ADD COLUMN `creatorUsername` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ingredients_name_creatorUsername_key` ON `Ingredients`(`name`, `creatorUsername`);

-- AddForeignKey
ALTER TABLE `Ingredients` ADD CONSTRAINT `Ingredients_creatorUsername_fkey` FOREIGN KEY (`creatorUsername`) REFERENCES `UserPass`(`user`) ON DELETE RESTRICT ON UPDATE CASCADE;
