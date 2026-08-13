import { Page, Locator, expect } from '@playwright/test';
import { environment } from '../config/environment';

/**
 * Page Object Model for CIMB Loan Calculator
 * URL: configured with LOAN_CALCULATOR_URL in the environment file
 */
export class LoanCalculatorPage {
  readonly page: Page;
  readonly loanAmountInput: Locator;
  readonly loanTenureDropdown: Locator;
  readonly monthlyPaymentDisplay: Locator;
  readonly interestRateDisplay: Locator;
  readonly nextButton: Locator;
  readonly pageTitle: Locator;
  readonly monthlyIncomeInput: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    this.loanAmountInput = page.getByRole('textbox', { name: 'Loan Amount' });
    this.loanTenureDropdown = page.getByRole('combobox', { name: 'Loan Tenure' });
    this.monthlyPaymentDisplay = page.locator('h3').filter({ hasText: 'MYR' }).first();
    this.interestRateDisplay = page.locator('h6').filter({ hasText: '% p.a.' }).first();
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.pageTitle = page.locator('h1, [role="heading"][aria-level="1"]').first();
    this.monthlyIncomeInput = page.getByRole('textbox', { name: 'Gross Monthly Income' });
  }

  /**
   * Navigate to Loan Calculator page
   */
  async navigateToCalculator() {
    await this.page.goto(environment.loanCalculatorUrl, { waitUntil: 'networkidle' });
  }

  /**
   * Enter loan amount
   */
  async enterLoanAmount(amount: string) {
    await this.loanAmountInput.fill(amount);
    await this.loanAmountInput.blur();
  }

  /**
   * Get loan amount field value
   */
  async getLoanAmount(): Promise<string> {
    return await this.loanAmountInput.inputValue();
  }

  /**
   * Select loan tenure from dropdown
   */
  async selectLoanTenure(tenure: string) {
    await this.loanTenureDropdown.click();
    await this.page.getByRole('option', { name: tenure, exact: true }).click();
  }

  /**
   * Enter monthly income
   */
  async enterMonthlyIncome(income: string) {
    await this.monthlyIncomeInput.click();
    await this.monthlyIncomeInput.press('Control+A');
    await this.monthlyIncomeInput.press('Backspace');
    await this.monthlyIncomeInput.pressSequentially(income);
    await this.monthlyIncomeInput.blur();
  }

  async enterGrossMonthlyIncome(income: string) {
    const [wholePart, decimalPart = ''] = income.replace(/,/g, '').split('.');
    const centsValue = `${wholePart}${decimalPart.padEnd(2, '0').slice(0, 2)}`;
    await this.monthlyIncomeInput.fill(centsValue);
    await this.monthlyIncomeInput.blur();
  }

  /**
   * Get monthly payment value
   */
  async getMonthlyPayment(): Promise<string> {
    return await this.monthlyPaymentDisplay.textContent() || '';
  }

  /**
   * Click Next button
   */
  async clickNext() {
    await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
    await this.nextButton.click();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    const popupCloseButton = this.page.locator('#closeCimbPopupBtn');
    if (await popupCloseButton.isVisible().catch(() => false)) {
      await popupCloseButton.click();
    }
  }

  /**
   * Fill all calculator fields with values
   */
  async fillCalculatorForm(formData: {
    loanAmount?: string;
    tenure?: string;
    monthlyIncome?: string;
  }) {
    if (formData.loanAmount) await this.enterLoanAmount(formData.loanAmount);
    if (formData.tenure) await this.selectLoanTenure(formData.tenure);
    if (formData.monthlyIncome) await this.enterMonthlyIncome(formData.monthlyIncome);
  }

}
