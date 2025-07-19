import { PrismaClient } from "@prisma/client";

// ESLint-compatible global type declaration
declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = (() => {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }
  
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
})();

export default prisma;