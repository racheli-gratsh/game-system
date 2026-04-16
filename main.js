const { joinGame } = require('./src/services/game.service');
const gameRepository = require('./src/repositories/game.repository');
const log = require('./src/logger');

async function main() {

  log.info('Connecting to database...');
  
  try {
   
    // ניקוי נתונים קודמים כדי למנוע שגיאות Unique
    log.info('Cleaning up old data...');
    await gameRepository.clearAll();
    // 1. יצירת נתוני דמי
    log.info('Seeding test data...');
    const user1 = await gameRepository.createUser({ username: 'player1', email: 'p1@test.com' });
    const user2 = await gameRepository.createUser({ username: 'player2', email: 'p2@test.com' });
    
    // יצירת משחק עם מקום ל2 שחקנים בלבד  
const game = await gameRepository.createGame({ title: 'Test Game', maxPlayers: 2 });
    // --- טסט 1: רישום מוצלח עם פירוט מלא ---
    log.info('Test 1: Joining game (Should succeed)...');
    const participant = await joinGame(user1.id, game.id);
    
    log.success(`Success: User joined game`);
    log.success(`  → User     : ${participant.user.username}`);
    log.success(`  → Game     : ${participant.game.title}`);
    log.success(`  → Role     : ${participant.role}`);
    log.success(`  → Joined at: ${participant.joinedAt}`);

    // --- טסט 2: בדיקת רישום כפול ---
    log.info('Test 2: Joining again (Should throw UserAlreadyJoinedError)...');
    try {
      await joinGame(user1.id, game.id);
    } catch (err) {
      log.info(`Test 2 caught expected error: [${err.name}]`);
    }

    // --- טסט 3: בדיקת משחק מלא ---
    log.info('Test 3: Joining full game (Should throw GameFullError)...');
    try {
      await joinGame(user2.id, game.id);
    } catch (err) {
      log.info(`Test 3 caught expected error: [${err.name}]`);
    }

  } catch (err) {
    log.error(`Unexpected failure: ${err.message}`);
    process.exit(1);
  } finally {
    await gameRepository.disconnect();
    log.info('Database connection closed.');
  }
}

main();