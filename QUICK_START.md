# Quick Start

## Prerequisites

- Node.js 18 or newer
- npm

## Install

```powershell
npm install
npx playwright install chromium
```

## Configure the Environment

Copy `.env.example` to `.env` and update the URLs when switching environments:

```env
TEST_ENVIRONMENT=prod
HEADLESS=true
CIMB_WEBSITE_URL=https://www.cimb.com.my
LOAN_CALCULATOR_URL=https://applynow.cimb.com.my/eform-app/loans/calculator?action=calc&language=en
LUCY_URL=https://applynow.cimb.com.my/eform-app/loans/lucy
```

## Run the Test

Headless:

```powershell
npm run loan-calculator
```

## Allure Reports

```powershell
npm run loan-calculator:allure
npm run allure:generate
npm run allure:open
```

## Key Files

- `features/feature_files/loanCalculator.feature` - BDD scenario
- `features/step_definitions/loanCalculatorSteps.ts` - step definitions
- `tests/pages/LoanCalculatorPage.ts` - page object
- `tests/data/testData.ts` -  test data
- `tests/config/environment.ts` - environment variables
