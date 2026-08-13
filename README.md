# CIMB Loan Calculator BDD Tests

Cucumber BDD tests using Playwright and TypeScript for the CIMB Personal Loan Calculator.

## Run

Install dependencies and the Chromium browser:

```powershell
npm install
npx playwright install chromium
```

Run the tagged Loan Calculator scenario:

```powershell
npm run loan-calculator
```

Run the same scenario in headed mode, and optionally slow down browser actions to make the flow visible:

```powershell
npm run loan-calculator:headed
npm run loan-calculator:speed
npm run test:gherkin:headed -- --tags @loan-calculator --speed=500
```

The `--speed` value is in milliseconds and works with the browser launch config. `--headed` forces a visible browser window.

Generate and open an Allure report:

```powershell
npm run loan-calculator:allure
npm run allure:generate
npm run allure:open
```

## Environment

Configure URLs in `.env` using `.env.example` as a template:

- `CIMB_WEBSITE_URL`
- `LOAN_CALCULATOR_URL`
- `LUCY_URL`
- `HEADLESS`

## Structure

```text
features/
  feature_files/
    loanCalculator.feature
  step_definitions/
    loanCalculatorSteps.ts
tests/
  config/environment.ts
  data/testData.ts
  pages/LoanCalculatorPage.ts
```

The final step verifies that the browser reaches the exact configured `LUCY_URL`.
