const { joinGame } = require('./src/services/game.service');
const gameRepository = require('./src/repositories/game.repository');
const log = require('./src/logger');

async function main() {
  log.info('Connecting to database...');

  try {
    // --- Seed: Create demo User and Game ---
    log.info('Creating demo user...');
    const user = await gameRepository.createUser({
      username: 'demo_player',
      email:    'demo@example.com',
    });
    log.info(`User created → id: ${user.id}, username: ${user.username}`);

    log.info('Creating demo game...');
    const game = await gameRepository.createGame({
      title:  'Demo Game #1',
      status: 'Waiting',
    });
    log.info(`Game created → id: ${game.id}, title: ${game.title}, status: ${game.status}`);

    // --- Business Logic: Join game ---
    log.info(`Attempting to join game...`);
    const participant = await joinGame(user.id, game.id);

    log.success(`Success: User joined game`);
    log.success(`  → User     : ${participant.user.username}`);
    log.success(`  → Game     : ${participant.game.title}`);
    log.success(`  → Role     : ${participant.role}`);
    log.success(`  → Joined at: ${participant.joinedAt}`);

  } catch (err) {
    log.error(`Operation failed: [${err.name}] ${err.message}`);
    process.exit(1);
  } finally {
    await gameRepository.disconnect();
    log.info('Database connection closed.');
  }
}

main();
