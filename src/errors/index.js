class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class GameNotFoundError extends AppError {
  constructor(gameId) {
    super(`Game with ID "${gameId}" was not found.`, 404);
  }
}

class GameAlreadyStartedError extends AppError {
  constructor(gameId) {
    super(`Game with ID "${gameId}" has already started and is not open for joining.`, 409);
  }
}

class UserAlreadyJoinedError extends AppError {
  constructor(userId, gameId) {
    super(`User "${userId}" is already registered to game "${gameId}".`, 409);
  }
}

module.exports = {
  AppError,
  GameNotFoundError,
  GameAlreadyStartedError,
  UserAlreadyJoinedError,
};
