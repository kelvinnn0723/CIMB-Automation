const { spawn } = require('child_process');

const args = process.argv.slice(2);
const cucumberArgs = [];
let headless = process.env.HEADLESS ?? 'true';
let slowMoMs = process.env.SLOW_MO_MS ?? '0';

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];

  if (arg === '--headed') {
    headless = 'false';
    continue;
  }

  if (arg === '--headless') {
    headless = 'true';
    continue;
  }

  if (arg === '--speed') {
    const nextArg = args[i + 1];
    if (nextArg && !nextArg.startsWith('--')) {
      slowMoMs = nextArg;
      i += 1;
      continue;
    }
    slowMoMs = '0';
    continue;
  }

  if (arg.startsWith('--speed=')) {
    slowMoMs = arg.split('=')[1] || '0';
    continue;
  }

  cucumberArgs.push(arg);
}

const child = spawn('npx', ['@cucumber/cucumber', ...cucumberArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    HEADLESS: headless,
    SLOW_MO_MS: slowMoMs
  }
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start Cucumber:', error.message);
  process.exit(1);
});
