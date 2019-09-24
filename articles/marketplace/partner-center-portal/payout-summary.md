---
title: Commercial marketplace payout summary
description: The Payout summary shows you details about the money you’ve earned with your offer. It also lets you know when you’ll receive payments and how much you'll be paid.
author: qianw211
manager: evansma
ms.author: v-qiwe
ms.service: marketplace
ms.topic: guide
ms.date: 09/24/2019
---

# Payout summary

The **Payout summary** shows you details about the money you’ve earned with Microsoft. It also lets you know when you’ll receive payments and how much you'll be paid.

If you sell products in the Azure Marketplace, you’ll also see info on successful payouts in the **Payout summary**. For more details regarding Azure Marketplace payment, see the [Microsoft Azure Marketplace Participation Policies](https://go.microsoft.com/fwlink/p/?LinkId=722436) and the [Microsoft Azure Marketplace Publisher Agreement](https://go.microsoft.com/fwlink/p/?LinkID=699560 ).

> [!NOTE]
> To be eligible for payout, your proceeds must reach the [payment threshold](payment-thresholds-methods-and-timeframes.md) of $50. For details about the payment threshold see this page and review the app developer agreement.

## Access the payout summary pages

To open one of the payout summary pages:

1. Select the Money icon in the upper-right corner.
2. Select Payments, Transaction history, or Export data.

## Payments page

The totals on this page represent all of the programs you participate in. You can filter by Participant ID, Program, Payment ID, and Earning type. Amounts are given in US dollars. The paid value is also displayed in pay to currency.

| Area                   | Description                                                                                  |
|------------------------|----------------------------------------------------------------------------------------------|
| Total paid this year   | The combined total paid out to you this year, in US dollars, for all of your programs.       |
| Next estimated payment | The single next payment coming to you (even if there are others coming soon), in US dollars. |
| Last payment           | The amount (in US dollars), program name, and program of your most recent payment.           |
| Payments by source     | Amount of payments, in US dollars, represented by program over the last 12 months.           |
| Payments               | Select Paid or Pending and then sort as you like. For additional details of a specific payment select View. To download a copy of the payment remittance statement, select Download. Note that transaction history data may take up to 24 hours to appear, so you may not see associated earnings right away. |

To export any of the data on this page, select Export and then follow directions on the Export data page.

## Transaction history page

This page displays all of your individual earnings, including the date, type, and earning for each. You can select a time period to view, and you can also filter by Enrollment ID, Program, Payment ID, Earning type, Lever, and Status. Data is available for the current fiscal year (July 1 – June 30) and the previous two fiscal years.

To see more details about an earning, select the down arrow at the right-hand side of the page. This will display the lever, revenue amount, and product. If for some reason any of this data is unavailable, but you need access to it, contact [support](https://developer.microsoft.com/en-us/windows/support)]. If the earning is the result of an adjustment, and not a transaction, the product fields will not be displayed.

To export any of the transaction data on this page, select Export and then follow directions on the Export data page. Files exported from the Transaction History page show data in transaction currency, earnings in both transaction currency and US dollars,and the paid value in pay to currency.

## Payment status

| Earning status           | Reason                                                                                                                                      | Partner action required?                                   |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| Unprocessed              | The earning is eligible for payment. It stays in this state for a cooling period as defined in the program guide for the Incentive program. | No                                                         |
| Upcoming                 | Payment order generated pending internal reviews before payment is processed.                                                               | No                                                         |
| Pending tax invoice      | Your tax invoice is incomplete or invalid.                                                                                                  | You need to update your tax invoice before you can be paid |
| Rejected during review   | The payment was rejected during review.                                                                                                     | Contact [Microsoft support](https://developer.microsoft.com/en-us/windows/support) for details                      |
| Failed                   | The payment failed due to a Microsoft system error.                                                                                         | Contact [Microsoft support](https://developer.microsoft.com/en-us/windows/support)  for details                      |
| In progress              | The payment is in progress.                                                                                                                 | No                                                         |
| Incorrect payment        | The payment recouping is in progress.                                                                                                       | No                                                         |
| Sent                     | The payment has been sent to your bank.                                                                                                     | No                                                         |
| Reprocessing             | The payment encountered a Microsoft system error and is being reprocessed.                                                                  | No                                                         |
| Reversed                 | The payment was reversed by your bank and will be sent again in the next payment cycle.                                                     | No                                                         |
| Tax invoice rejected     | Your tax invoice was rejected during review. All pending payments will be on hold until the tax invoice review is complete.                 | Contact [Microsoft support](https://developer.microsoft.com/en-us/windows/support)  for details                      |
| Tax invoice under review | Your tax invoice is being reviewed. Your payment will be released once the tax invoice has been approved.                                   | No                                                         |
| Rejected                 | The payment was rejected by your bank.                                                                                                      | Contact your bank for details.                             |

## Export data page

Follow the instructions on this page to export the data you want.

Notes:

- The Export data page does not refresh on its own. You may need to refresh the page manually to see the most recent data.
- Your filter may result in a No data available error. This probably means you’ve left the default time period selected at three months, and then selected a Payment ID from an earning that’s outside of that period. Expand your time period and try again.

## Payment download export

This option provides a download of the payments you received in your bank for a given program, the associated tax, and aggregated earning amount. This report is used for many Partner Center programs, so some columns may be inapplicable to your report. Those columns are marked below.

| Column name              | Description                                                                                                                               |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------  |
| participantID            | The primary identity of the partner earning under the program                                                                             |
| participantIDType        | Usually program id for Incentive programs and Seller ID for Store programs                                                                |
| participantName          | Name of the earning partner                                                                                                               |
| programName              | Incentive/store program name                                                                                                              |
| earned                   | Amount earned in the Pay To currency for that program/participantID                                                                       |
| earnedUSD                | Amount earned for the program/participant ID, in USD                                                                                      |
| withheldTax              | Amount of tax withheld in the Pay To currency for the program/participantID                                                               |
| salesTax                 | Total amount of sales tax in the Pay To currency for the program/participantID (applicable for incentive programs only)                   |
| serviceFeeTax            | Total amount of serviceFeeTax in Pay To currency for the program/participantID (applicable for store programs and Azure Marketplace only) |
| totalPayment             | Total payment in local currency excluding the withholding tax and including the sales tax (if applicable) for the program/participantID   |
| currencyCode             | Pay To currency code                                                                                                                      |
| paymentMethod            | The method used to pay the partner e.g. electronic bank transfer, credit note                                                             |
| paymentID                | Unique identifier for the payment. This number is usually visible in your bank statement. (applicable for SAP payments only)              |
| paymentStatus            | Payment status                                                                                                                            |
| paymentStatusDescription | Friendly description of payment status                                                                                                    |
| paymentDate              | Date payment was sent from Microsoft                                                                                                      |

## Transaction history download export

This option provides a download of each earning line item you see in the Transaction history page, earning type, date, associated transaction amount, customer, product, and other transactional details applicable to your programs.

| Column name                    | Description                                                                                                                              | Applicability for Incentives/Store/Azure Marketplace           |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| earningId                      | Unique identifier for each earning                                                                                                       | All                                                            |
| participantId                  | The primary identity of the partner earning under the program                                                                            | All                                                            |
| participantIdType              | Mostly program ID for Incentive programs and Seller IF for Store programs and Azure Marketplace                                          | All                                                            |
| participantName                | Name of the earning partner                                                                                                              | All                                                            |
| partnerCountryCode             | Location/country of the earning partner                                                                                                  | All                                                            |
| programName                    | Incentive/store program name                                                                                                             | All                                                            |
| transactionId                  | Unique identifier for the transaction                                                                                                    | All                                                            |
| transactionCurrency            | Currency in which the original customer transaction occurred (this is not partner location currency)                                     | All                                                            |
| transactionDate                | Date of the transaction. Useful for programs where many transactions contribute to one earning                                           | All                                                            |
| transactionExchangeRate        | Exchange rate date used to show the corresponding transaction USD amount                                                                 | All                                                            |
| transactionAmount              | Transaction amount in the original transaction currency based on which earning is generated                                              | All                                                            |
| transactionAmountUSD           | Transaction amount in USD                                                                                                                | All                                                            |
| lever                          | Indicates business rule for the earning                                                                                                  | All                                                            |
| earningRate                    | Incentive rate applied on transaction amount to generate an earning                                                                      | All                                                            |
| quantity                       | Varies based on program. Indicates billed quantity for transactional programs                                                            | All                                                            |
| quantityType                   | Indicates type of quantity e.g. Billed quantity, MAU                                                                                     | All                                                            |
| earningType                    | Indicates if it is fee, rebate, coop, sell etc.                                                                                          | All                                                            |
| earningAmount                  | Earning Amount in the original transaction currency                                                                                      | All                                                            |
| earningAmountUSD               | Earning Amount in USD                                                                                                                    | All                                                            |
| earningDate                    | Date of the earning                                                                                                                      | All                                                            |
| calculationDate                | Date the earning was calculated in the system                                                                                            | All                                                            |
| earningExchangeRate            | Exchange rate used to show the corresponding USD amount                                                                                  | All                                                            |
| exchangeRateDate               | Exchange rate date used to calculate EarningAmount USD                                                                                   | All                                                            |
| paymentAmountWOTax             | Earning amount (without tax) in Pay To currency for “Sent” payments only                                                                 | All                                                            |
| paymentCurrency                | Pay to currency chosen by partner in the Payment profile. Shown only for sent payments                                                   | All                                                            |
| paymentExchangeRate            | Exchange rate used to calculate paymentAmountWOTax in payment currency using ExchangeRateDate                                            | All                                                            |
| claimId                        | Unique identifier for claim                                                                                                              | Incentives - some programs only                                |
| planId                         | Unique identifier for plan                                                                                                               | Incentives - some programs only                                |
| paymentId                      | Unique identifier for the payment. This number is usually visible in your bank statement                                                 | SAP payments only                                              |
| paymentStatus                  | Payment status                                                                                                                           | All                                                            |
| paymentStatusDescription       | Friendly description of payment status                                                                                                   | All                                                            |
| customerId                     | Will always be blank                                                                                                                     | Incentive programs only (exception: OEM) and Azure Marketplace |
| customerName                   | Will always be blank                                                                                                                     | Incentive programs only (exception: OEM) and Azure Marketplace |
| partNumber                     | Will always be blank                                                                                                                     | Some Incentive and Store programs and Azure Marketplace        |
| productName                    | Product name linked to transaction                                                                                                       | All                                                            |
| productId                      | Unique product identifier                                                                                                                | Store and Azure Marketplace                                    |
| parentProductId                | Unique parent product identifier. Please note: if there isn’t a parent product for the transaction, then Parent Product ID = Product ID. | Store and Azure Marketplace                                    |
| parentProductName              | Name of the parent product. Please note: if there isn’t a parent product for the transaction, then Parent Product Name = Product Name.   | Store and Azure Marketplace                                    |
| productType                    | Type of product (such as App, Add-on, Game, etc.)                                                                                        | Store and Azure Marketplace                                    |
| invoiceNumber                  | Invoice number (applicable for EA only)                                                                                                  | Incentive and Azure Marketplace - some programs only           |
| subscriptionId                 | Subscription identifier associated with customer                                                                                         | Incentive - some programs only                                 |
| subscriptionStartDate          | Subscription start date                                                                                                                  | Incentive - some programs only                                 |
| subscriptionEndDate            | Subscription end date                                                                                                                    | Incentive - some programs only                                 |
| resellerId                     | Reseller identifier                                                                                                                      | Incentive - some programs only                                 |
| resellerName                   | Reseller name                                                                                                                            | Incentive - some programs only                                 |
| distributorId                  | Distributor identifier                                                                                                                   | Incentive - some programs only                                 |
| distributorName                | Distributor name                                                                                                                         | Incentive - some programs only                                 |
| agreementNumber                | Agreement number                                                                                                                         | Incentive - some programs only                                 |
| agreementStartDate             | Agreement start date                                                                                                                     | Incentive - some programs only                                 |
| agreementEndDate               | Agreement end date                                                                                                                       | Incentive - some programs only                                 |
| workload                       | Workload                                                                                                                                 | Incentive - some programs only                                 |
| transactionType                | Type of transaction (such as purchase, refund, reversal, chargeback, etc.)                                                               | Store and Azure Marketplace                                    |
| localProviderSeller            | Local provider/seller of record                                                                                                          | Store only                                                     |
| taxRemitted                    | Amount of tax remitted (sales, use, or VAT/GST taxes).                                                                                   | Store and Azure Marketplace                                    |
| taxRemitModel                  | Party responsible for remitting taxes (sales, use, or VAT/GST taxes).                                                                    | Store only                                                     |
| storeFee                       | The amount retained by Microsoft as a fee for making the app or add-on available in the Store.                                           | Store only                                                     |
| transactionPaymentMethod       | Customer payment instrument used for the transaction (such as Card, Mobile Carrier Billing, PayPal, etc.)                                | Store and Azure Marketplace                                    |
| tpan                           | Indicates the third-party ad network                                                                                                     | Store - Ads only                                               |
| customerCountry                | Customer country                                                                                                                         | Store and Azure Marketplace                                    |
| customerCity                   | Customer city                                                                                                                            | Store and Azure Marketplace                                    |
| customerState                  | Customer state                                                                                                                           | Store and Azure Marketplace                                    |
| customerZip                    | Customer zip/postal code                                                                                                                 | Store and Azure Marketplace                                    |
| purchaseTypeCode               | Will always be blank                                                                                                                     | Incentive program - CRI                                        |
| purchaseOrderType              | Will always be blank                                                                                                                     | Incentive program - CRI                                        |
| purchaseOrderCoverageStartDate | Will always be blank                                                                                                                     | Incentive program - CRI                                        |
| purchaseOrderCoverageEndDate   | Will always be blank                                                                                                                     | Incentive program - CRI                                        |
| programOfferingLevel           |                                                                                                                                          | Incentive program - CRI                                        |
| TenantID                       |                                                                                                                                          | Incentive programs                                             |
| externalReferenceId            | Unique identifier for the program                                                                                                        | Direct Pay programs (Incentive and Store)                      |
| externalReferenceIdLabel       | Unique identifier label                                                                                                                  | Direct Pay programs (Incentive and Store)                      |
