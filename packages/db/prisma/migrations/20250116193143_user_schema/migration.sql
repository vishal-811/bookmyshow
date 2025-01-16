-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "isverified" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");
