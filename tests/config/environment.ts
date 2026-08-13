import dotenv from 'dotenv';

dotenv.config();

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const environment = {
  name: process.env.TEST_ENVIRONMENT || 'local',
  websiteUrl: requiredEnvironmentVariable('CIMB_WEBSITE_URL'),
  loanCalculatorUrl: requiredEnvironmentVariable('LOAN_CALCULATOR_URL'),
  lucyUrl: requiredEnvironmentVariable('LUCY_URL'),
  headless: process.env.HEADLESS !== 'false'
};
