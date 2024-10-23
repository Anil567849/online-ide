-- CreateTable
CREATE TABLE "IDE" (
    "id" SERIAL NOT NULL,
    "ide_name" TEXT NOT NULL,
    "container_ip" TEXT NOT NULL,

    CONSTRAINT "IDE_pkey" PRIMARY KEY ("id")
);
