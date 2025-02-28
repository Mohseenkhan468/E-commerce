-- AlterTable
ALTER TABLE "orderproducts" ADD COLUMN     "status" "OrderEventStatus" NOT NULL DEFAULT 'PENDING';
