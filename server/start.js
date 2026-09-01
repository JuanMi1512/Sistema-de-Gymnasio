import { migrate } from './migrate.js';

try {
  await migrate();
  await import('./index.js');
} catch (error) {
  console.error('No se pudieron aplicar las migraciones:', error.message);
  process.exit(1);
}
