const gameRepository = require('../repositories/game.repository');
const {
  GameNotFoundError,
  GameAlreadyStartedError,
  UserAlreadyJoinedError,
} = require('../errors');

/**
 * Joins a user to a game.
 *
 * Business rules:
 * 1. Game must exist.
 * 2. Game status must be "Waiting".
 * 3. User must not already be registered to this game.
 *
 * @param {string} userId
 * @param {string} gameId
 * @returns {Promise<GameParticipant>} The created participant record.
 * @throws {GameNotFoundError}       If game does not exist.
 * @throws {GameAlreadyStartedError} If game status is not Waiting.
 * @throws {UserAlreadyJoinedError}  If user is already registered.
 */
async function joinGame(userId, gameId) {
  // 1. Verify game exists
  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new GameNotFoundError(gameId);
  }

  // 2. Verify game is still open
  if (game.status !== 'Waiting') {
    throw new GameAlreadyStartedError(gameId);
  }

  // 3. Verify user is not already in the game
  const existingParticipant = await gameRepository.findParticipant(userId, gameId);
  if (existingParticipant) {
    throw new UserAlreadyJoinedError(userId, gameId);
  }

  // 4. Register user as Player (inside a DB transaction)
  const participant = await gameRepository.createParticipant(userId, gameId);

  return participant;
}

module.exports = { joinGame };
