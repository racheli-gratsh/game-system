const { PrismaClient } = require('@prisma/client');
const { UserAlreadyJoinedError } = require('../errors');

const prisma = new PrismaClient();

const gameRepository = {
  /**
   * Find a game by its ID.
   * @param {string} gameId
   */
 async findById(gameId) {
  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      _count: {
        select: { participants: true } // זה מחזיר לנו שדה בשם _count עם מספר המשתתפים
      }
    }
  });
},

  /**
   * Find an existing participation record.
   * @param {string} userId
   * @param {string} gameId
   */
  async findParticipant(userId, gameId) {
    return prisma.gameParticipant.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });
  },

  /**
   * Register a user to a game inside a transaction.
   * Handles race conditions: if two requests pass the findParticipant check
   * simultaneously, the DB unique constraint (P2002) is caught and converted
   * to a clean UserAlreadyJoinedError instead of a raw Prisma error.
   * @param {string} userId
   * @param {string} gameId
   */
  async createParticipant(userId, gameId) {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.gameParticipant.create({
          data: {
            userId,
            gameId,
            role: 'Player',
          },
          include: {
            user: { select: { id: true, username: true } },
            game: { select: { id: true, title: true, status: true } },
          },
        });
      });
    } catch (err) {
      // P2002 = Unique constraint violation (race condition safety net)
      if (err.code === 'P2002') {
        throw new UserAlreadyJoinedError(userId, gameId);
      }
      throw err;
    }
  },

  /**
   * Seed: Create a demo user.
   */
  async createUser(data) {
    return prisma.user.create({ data });
  },

  /**
   * Seed: Create a demo game.
   */
  async createGame(data) {
    return prisma.game.create({ data });
  },

  async clearAll() {
    // שלב 1: מחיקת טבלת הקשר (Participants) כי היא תלויה בטבלאות האחרות
    await prisma.gameParticipant.deleteMany();
    
    // שלב 2: מחיקת המשתמשים והמשחקים
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();
  },

  /**
   * Disconnect Prisma client gracefully.
   */
  async disconnect() {
    await prisma.$disconnect();
  },
};

module.exports = gameRepository;
