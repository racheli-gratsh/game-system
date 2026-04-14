const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const gameRepository = {
  /**
   * Find a game by its ID.
   * @param {string} gameId
   */
  async findById(gameId) {
    return prisma.game.findUnique({ where: { id: gameId } });
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
   * @param {string} userId
   * @param {string} gameId
   */
  async createParticipant(userId, gameId) {
    return prisma.$transaction(async (tx) => {
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

  /**
   * Disconnect Prisma client gracefully.
   */
  async disconnect() {
    await prisma.$disconnect();
  },
};

module.exports = gameRepository;
