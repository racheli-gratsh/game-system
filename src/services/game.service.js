const gameRepository = require('../repositories/game.repository');
const {
  GameNotFoundError,
  GameAlreadyStartedError,
  UserAlreadyJoinedError,
  GameFullError, 
} = require('../errors');

/**
 * Joins a user to a game.
 * * Business rules:
 * 1. Game must exist.
 * 2. Game status must be "Waiting".
 * 3. Game must not be full (new).
 * 4. User must not already be registered.
 */
async function joinGame(userId, gameId) {
  // 1. בדיקה שהמשחק קיים
  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new GameNotFoundError(gameId);
  }

  // 2. בדיקה שהסטטוס מאפשר הרשמה
  if (game.status !== 'Waiting') {
    throw new GameAlreadyStartedError(gameId);
  }

  // 3. בדיקת תפוסה (שימוש ב-_count שהוספנו ב-Repository)
  if (game._count.participants >= game.maxPlayers) {
    throw new GameFullError(gameId);
  }

  // 4. בדיקה שהמשתמש לא רשום כבר
  const existingParticipant = await gameRepository.findParticipant(userId, gameId);
  if (existingParticipant) {
    throw new UserAlreadyJoinedError(userId, gameId);
  }

  // 5. רישום בפועל
  return await gameRepository.createParticipant(userId, gameId);
}

module.exports = { joinGame };