import dotenv from 'dotenv';

dotenv.config();

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const slowMoMs = Number(process.env.SLOW_MO_MS ?? 0);

export const environment = {
  name: process.env.TEST_ENVIRONMENT || 'local',
  websiteUrl: requiredEnvironmentVariable('CIMB_WEBSITE_URL'),
  loanCalculatorUrl: requiredEnvironmentVariable('LOAN_CALCULATOR_URL'),
  lucyUrl: requiredEnvironmentVariable('LUCY_URL'),
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number.isFinite(slowMoMs) && slowMoMs >= 0 ? slowMoMs : 0
};
