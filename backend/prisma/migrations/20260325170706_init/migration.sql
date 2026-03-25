/*
  Warnings:

  - You are about to drop the column `documento` on the `Paciente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Paciente_documento_key";

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "documento",
ADD COLUMN     "cpf" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");
