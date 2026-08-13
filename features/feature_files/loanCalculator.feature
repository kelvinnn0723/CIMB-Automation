# language: en

@loan-calculator
Feature: CIMB Loan Calculator Form Validation

  # The calculator accepts a gross monthly income and loan amount, then estimates
  # the monthly repayment before allowing the applicant to continue to Lucy.

  # Business rules captured by this feature:
  # - Gross Monthly Income is required and accepts two decimal places.
  # - Gross Monthly Income below MYR 2,000 is invalid; MYR 2,000.00 and above is valid.
  # - Loan Amount is normalized down to the nearest MYR 100 when the value is not an exact MYR 100 increment.
  # - Loan eligibility depends on Gross Monthly Income and is capped at MYR 300,000.
  # - At MYR 10,000 income, MYR 150,000 is valid and MYR 150,100 is invalid.
  # - At MYR 100,000 income, MYR 300,000 is valid and MYR 300,100 is invalid.
  # - Loan Tenure options observed on the page are 24, 36, 48, 60, 72, and 84 months.
  # - The observed Interest Rate is fixed at 7.88% p.a. for the tested combinations.
  # - Monthly repayment follows a flat-rate calculation and is displayed rounded upward to the next whole MYR.
  # - Next Button is available only when the required fields are valid and complete.
  # - A successful submission must navigate to the exact configured Lucy URL.

  # Form completeness and Lucy navigation
  Scenario: Validate the Loan Calculator and proceed to Lucy
    Given I am on the CIMB Group website
    And I navigate to the Personal Loan Calculator page
    When I perform validation testing on all fields in the Loan Calculator page
    Then I verify that all fields in the Loan Calculator page and their respective validations are correct
    When I select all the necessary fields and click Next
    Then verify it navigates to the Lucy page successfully

  # Calculation uses the normalized displayed loan amount, not necessarily the raw entered amount.
  Scenario Outline: Calculate monthly repayment - Income RM<income>, Loan RM<loanAmount>, Tenure <tenure> months
    Given I am on the CIMB Group website
    And I navigate to the Personal Loan Calculator page
    When I enter gross monthly income of "<income>"
    And I enter loan amount of "<loanAmount>"
    And I select loan tenure of "<tenure>"
    Then the loan tenure should be "<tenure> Months"
    And the monthly repayment should match the flat-rate calculation using "<rate>%" for "<tenure>" months
    And the interest rate should be "<rate>% p.a."

    Examples:
      | income    | loanAmount | tenure | rate |
      | 3020.51   | 30520      | 24     | 7.88 |
      | 5069.75   | 50001      | 60     | 7.88 |
      | 10300.29  | 169403     | 84     | 7.88 |

  # Income boundary and decimal-place validation
  Scenario Outline: Validate gross monthly income boundary - RM<income> is <state>
    Given I am on the CIMB Group website
    And I navigate to the Personal Loan Calculator page
    When I enter gross monthly income of "<income>"
    Then the "Gross Monthly Income" field should be "<state>"

    Examples:
      | income  | state   |
      | 1999    | invalid |
      | 1999.99 | invalid |
      | 2000    | valid   |
      | 2000.00 | valid   |
      | 2000.01 | valid   |

  # The maximum eligible loan amount changes with income but never exceeds MYR 300,000.
  Scenario Outline: Validate income-dependent loan eligibility - Income RM<income>, Loan RM<loanAmount> is <state>
    Given I am on the CIMB Group website
    And I navigate to the Personal Loan Calculator page
    When I enter gross monthly income of "<income>"
    And I enter loan amount of "<loanAmount>"
    Then the "Loan Amount" field should be "<state>"

    Examples:
      | income | loanAmount | state   |
      | 10000  | 150000     | valid   |
      | 10000  | 150100     | invalid |
      | 100000 | 300000     | valid   |
      | 100000 | 300100     | invalid |

  # Input normalization is applied when the Loan Amount field loses focus.
  Scenario Outline: Normalize loan amount - Entered RM<enteredAmount> displays RM<normalizedAmount>
    Given I am on the CIMB Group website
    And I navigate to the Personal Loan Calculator page
    When I enter gross monthly income of "10000"
    And I enter loan amount of "<enteredAmount>"
    Then the displayed loan amount should be "<normalizedAmount>"

    Examples:
      | enteredAmount | normalizedAmount |
      | 30499         | 30400            |
      | 30500         | 30500            |
      | 30520         | 30500            |
      | 30599         | 30500            |
      | 30600         | 30600            |
