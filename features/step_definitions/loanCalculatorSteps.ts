import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { expect, Page, Browser, chromium } from "@playwright/test";
import { LoanCalculatorPage } from "../../tests/pages/LoanCalculatorPage";
import { VALID_TEST_DATA } from "../../tests/data/testData";
import { environment } from "../../tests/config/environment";

setDefaultTimeout(15000);

let page: Page;
let browser: Browser;
let calculatorPage: LoanCalculatorPage;

/**
 * Hooks for test setup and teardown
 */
Before({ name: "Launch browser" }, async function() {
  browser = await chromium.launch({ headless: environment.headless });
  page = await browser.newPage();
  calculatorPage = new LoanCalculatorPage(page);
});

After({ name: "Close browser" }, async function() {
  await page.close();
  await browser.close();
});

/**
 * Background Steps - Common setup for all scenarios
 */
Given("I am on the CIMB Group website", async function() {
  await page.goto(environment.websiteUrl, { waitUntil: "networkidle" });
});

Given("I navigate to the Personal Loan Calculator page", async function() {
  await calculatorPage.navigateToCalculator();
  await calculatorPage.waitForPageLoad();
});

/**
 * Page Load and Element Verification Steps
 */
When("I wait for the calculator page to load", async function() {
  await calculatorPage.waitForPageLoad();
});

Then("the page title should be visible", async function() {
  const pageTitle = calculatorPage.pageTitle;
  await expect(pageTitle).toBeVisible();
});

Then("the calculator form should be displayed", async function() {
  await expect(page.getByRole("textbox", { name: "Loan Amount" })).toBeVisible();
});

Then("the calculator fields should be required", async function() {
  const requiredFieldsCount = await page.locator("input[required], [aria-required=\"true\"]").count();
  expect(requiredFieldsCount).toBeGreaterThan(0);
});

When("I perform validation testing on all fields in the Loan Calculator page", async function() {
  const requiredFields = page.locator("input[aria-required=\"true\"], [role=\"combobox\"][aria-required=\"true\"]");
  for (const field of await requiredFields.all()) {
    await field.blur();
  }
});

Then("I verify that all fields in the Loan Calculator page and their respective validations are correct", async function() {
  const requiredFieldsCount = await page.locator("input[aria-required=\"true\"], [role=\"combobox\"][aria-required=\"true\"]").count();
  expect(requiredFieldsCount).toBe(3);
  await expect(calculatorPage.nextButton).toBeDisabled();
});

When("I select all the necessary fields and click Next", async function() {
  await calculatorPage.fillCalculatorForm(VALID_TEST_DATA);
  await calculatorPage.clickNext();
});

When("I enter gross monthly income of {string}", async function(income: string) {
  await calculatorPage.enterGrossMonthlyIncome(income);
});

When("I enter loan amount of {string}", async function(amount: string) {
  this.requestedLoanAmount = amount;
  await calculatorPage.enterLoanAmount(amount);
});

When("I select loan tenure of {string}", async function(tenure: string) {
  await calculatorPage.selectLoanTenure(`${tenure} Months`);
});

Then("the loan tenure should be {string}", async function(expectedTenure: string) {
  await expect(calculatorPage.loanTenureDropdown).toHaveText(expectedTenure);
});

Then("the monthly repayment should match the flat-rate calculation using {string} for {string} months", async function(rate: string, tenure: string) {
  const loanAmount = Number((await calculatorPage.getLoanAmount()).replace(/[^0-9.]/g, ''));
  const annualRate = Number(rate.replace('%', '')) / 100;
  const tenureMonths = Number(tenure);
  const calculatedRepayment = (loanAmount + loanAmount * annualRate * (tenureMonths / 12)) / tenureMonths;
  const expectedRepayment = Math.ceil(calculatedRepayment);
  const displayedRepayment = Number((await calculatorPage.getMonthlyPayment()).replace(/[^0-9.]/g, ''));
  const repaymentSummary = [
    `Requested loan amount: MYR ${Number(this.requestedLoanAmount).toFixed(2)}`,
    `Displayed loan amount: MYR ${loanAmount.toFixed(2)} (normalized to the nearest MYR 100)`,
    `Interest rate: ${rate}`,
    `Tenure: ${tenureMonths} months`,
    `Calculated repayment: MYR ${expectedRepayment.toFixed(2)}`,
    `Displayed repayment: MYR ${displayedRepayment.toFixed(2)}`
  ].join('\n');

  console.log(repaymentSummary);
  await this.attach(repaymentSummary, 'text/plain');

  expect(displayedRepayment).toBe(expectedRepayment);
});

Then("the interest rate should be {string}", async function(expectedRate: string) {
  await expect(calculatorPage.interestRateDisplay).toHaveText(expectedRate);
});

Then("the {string} field should be {string}", async function(fieldName: string, state: string) {
  const field = page.getByRole('textbox', { name: fieldName });
  await expect(field).toHaveClass(state === 'invalid' ? /ng-invalid/ : /ng-valid/);
});

Then("the displayed loan amount should be {string}", async function(expectedAmount: string) {
  const displayedAmount = (await calculatorPage.getLoanAmount()).replace(/[^0-9]/g, '');
  expect(displayedAmount).toBe(expectedAmount);
});

Then("the Next button should be {string}", async function(state: string) {
  if (state === 'enabled') {
    await expect(calculatorPage.nextButton).toBeEnabled();
  } else {
    await expect(calculatorPage.nextButton).toBeDisabled();
  }
});

Then("verify it navigates to the Lucy page successfully", async function() {
  await expect(page).toHaveURL(environment.lucyUrl, { timeout: 10000 });
});
