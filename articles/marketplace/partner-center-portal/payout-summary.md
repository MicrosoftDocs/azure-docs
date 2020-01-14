---
title: Commercial marketplace payout summary | Azure Marketplace
description: The Payout summary shows you details about the money you’ve earned with your offer. It also lets you know when you’ll receive payments and how much you'll be paid.
author: MaggiePucciEvans
manager: evansma
ms.author: evansma
ms.service: marketplace
ms.topic: guide
ms.date: 12/10/2019
---

# Payout reporting

The [**Payout summary**](https://docs.microsoft.com/windows/uwp/publish/payout-summary) shows you details about the money you’ve earned with Microsoft. It also lets you know when you’ll receive payments and how much you'll be paid.

If you sell offerings in the Azure Marketplace, you’ll also see info on successful payouts in the **Payout summary**. For more information regarding Azure Marketplace payment, see the [Microsoft Azure Marketplace Participation Policies](https://go.microsoft.com/fwlink/p/?LinkId=722436) and the [Microsoft Azure Marketplace Publisher Agreement](https://go.microsoft.com/fwlink/p/?LinkID=699560).

> [!NOTE]
> To be eligible for payout, your proceeds must reach the [payment threshold](payment-thresholds-methods-timeframes.md) of $50. For details about the payment threshold see this page and review the [Microsoft Azure Marketplace Publisher Agreement](https://go.microsoft.com/fwlink/p/?LinkID=699560).

- [Roles and permission to access the payout report](#roles-and-permission-to-access-the-payout-report)
- [Payout report: difference between Cloud Partner Portal and Partner Center](#payout-report-difference-between-cloud-partner-portal-and-partner-center)
- [Customer types](#customer-types)
- [Corelation between payout and usage](#corelation-between-payout-and-usage)
- [Transaction history download](#transaction-history-download-export)
- [Billing questions and support](#billing-questions-and-support)

## Roles and permission to access the payout report

| Reports/Pages    | Account owner    | Manager  | Developer | Business contributor |  Finance contributor | Marketer |
|------------------|------------------|----------|-----------|----|----|-----|
| Acquisition report (including Near Real Time data) | Can view | Can view | No access | No access | Can view | No access |
| Feedback report/responses | Can view and send feedback | Can view and send feedback | Can view and send feedback | No access | No access | Can view and send feedback |
| Health report (including near real time data) | Can view | Can view | Can view | Can view | No access | No access |
| Usage report | Can view | Can view | Can view | Can view | No access | No access |
| Payout account | Can update | No access | No access | No access | Can update | No access |
| Tax profile | Can update | No access | No access | No access | Can update | No access |
| Payout summary | Can view | No access | No access | No access | Can view | No access |

## Payout report: difference between Cloud Partner Portal and Partner Center

| | Cloud Partner Portal | Partner Center |
|---------|---------|---------|
| Links | https://cloudpartner.azure.com/ | https://partner.microsoft.com/dashboard/payouts/reports/transactionhistory and https://partner.microsoft.com/dashboard/payouts/reports/incentivepayments |
| Navigation | Payout reporting provided in Insights Payout | Payout reporting provided in Partner Center – Payout Icon |
| Scope | <ul> <li>Transaction per line item is visible, for collection in progress, collected, and paid </li> <li>Reporting – shows all line items once purchase order is created, including collection in progress  and billing in Progress, and collection status and line items that are not yet eligible to be paid. </li> </ul> | <ul> <li>Shows the line items once they are deemed as eligible earnings.</li> <li>The customers pay to Microsoft first, and then ISVs can see the payout report starting.</li> <li>Payout report will not show collection in progress and billing in progress.  </li> </ul>  |
| Transaction not ready for payout | Billing in Progress | Next estimated payment: The payout status is in the unprocessed state.  |
| Payout status |  | Unprocessed: <br> The earning is eligible for payment. It stays in this state for a cooling period as defined in the program guide for the Incentive program. <br> <br> Upcoming: <br> Payment order-generated pending internal reviews before payment is processed. <br> <br> Sent: <br> The payment has been sent to your bank. |

## Customer types 

### Enterprise agreement

Customers without an Enterprise Agreement in place are billed monthly for marketplace software licenses. Customers with an Enterprise Agreement are billed monthly via an invoice that is presented quarterly.

### Credit cards and monthly invoice

Customers can also pay using a credit card and a monthly invoice. In this case, your software license fees will be billed monthly.

### CSP and Direct Pay Users

For example, if the customer purchases using a credit card.

## Corelation between payout and usage 

|Description    |    Date  | Orders/Usage  | Payout |
|----------|----------|-----------|-------------|
|Order Period   | Aug 15, 2019 - Aug 30, 2019 | **Correlation Attributes Orders** <br> <ul> <li>OrderId</li> <li>CustomerId</li> </ul> <br> **Usage** <br> <ul> <li>CustomerId </li> <li>Customer Name</li> <li>(UsageReference)PurchaseRecordId/LineItemId</li> <li> Estimated Extended Charge <br> Estimated Payout (PC) </li> </ul> |  |
|Term Ending (month)   | Aug 30, 2019 | | |
|Billing Date | Sept 1, 2019 | | |
|Customer Payment Date | Sept 1, 2019 | | |
|Escrow Period (credit cards only, 30 days) | Sept 1, 2019 - Sept 30, 2019 | | **Correlation Attributes Orders:** <br> <ul><li>AssetId</li> <li>Customer ID</li> <li> Customer Name</li> </ul> <br> **Usage** <br> <ul> <li>AssetId</li> <li>CustomerId</li> <li>Customer Name</li> <li>OrderId</li> <li>LineItemId</li> <li>transactionAmount</li> <li>EarningAmountInLastPaymentCurrency</li> </ul> <br> **Payout Status:** Unprocessed |
|Collection Period Start | Sept 1, 2019 | | |
|Collection Period End (maximum, 30 days) | Sept 30, 2019 | | |
|Payout Calculation Date (monthly on the 15th) | Oct 1, 2019 | | **Correlation Attributes** <br> <ul><li>AssetId</li> <li>Customer ID</li> <li>Customer Name</li> </ul> <br> **Usage** <br> <ul> <li>AssetId</li> <li>CustomerId</li> <li>Customer Name</li> <li>OrderId</li> <li>LineItemId</li> <li>transactionAmount</li> <li>EarningAmountInLastPaymentCurrency</li> </ul> <br> **Payout Status:** UpComing |
|Payout Date | Oct 15, 2019 | | **Correlation Attributes** <br> <ul><li>AssetId</li> <li>Customer ID</li> <li> Customer Name</li> </ul> <br> **Usage** <br> <ul> <li>AssetId</li> <li>CustomerId</li> <li>Customer Name</li> <li>OrderId</li> <li>LineItemId</li> <li>transactionAmount</li> <li>EarningAmountInLastPaymentCurrency</li> </ul> <br> **Payout Status:** Payment sent |

### Enterprise agreement (quarterly/monthly customers)

| Description |    Date  | Usage | Payout |
|----------|----------|---------|-----------|
|Order Period | Aug 15, 2019 - Aug 30, 2019 | **Correlation attributes orders** <br> <ul> <li>OrderId</li> <li>CustomerId</li> </ul> <br> **Usage report** <br> <ul> <li>CustomerId </li> <li>Customer Name</li> <li>(UsageReference)PurchaseRecordId/LineItemId</li> <li> Estimated Extended Charge <br> Estimated Payout (PC) </li> </ul> | |
|Term Ending (quarter) | Sept 30, 2019 | | |
|Billing Date | Oct 15, 2019 | | |
|Escrow Period (credit cards only, 30 days) | n/a | | |
|Collection Period Start | Oct 15, 2019 | | |
|Credit cards only, 30 days | Nov 1, 2019 - Nov 30, 2019 | | |
|Collection Period End (maximum, 90 days) | Jan 15, 2020 | | |
|Customer Payment Date | Dec 30, 2019 | | |
|Payout Calculation | Jan 15, 2020 | | |
|Payout Date | Feb 15, 2020 | | **For quarterly based customers** <br> <br> **Orders report** <br> <ul><li>AssetId</li> <li>Customer ID</li> <li> Customer Name</li> </ul> <br> **Usage** <br> <ul> <li>AssetId</li> <li>CustomerId</li> <li>Customer Name</li> <li>OrderId</li> <li>LineItemId</li> <li>transactionAmount</li> <li>EarningAmountInLastPaymentCurrency</li> </ul> <br> **Payout Status:** sent |

## Transaction history download export

This option provides a download of each earning line item you see in the Transaction history page, earning type, date, associated transaction amount, customer, product, and other transactional details applicable to the Incentives program. 

| Column name     | Description    | 
|-------------|-------------------------------|
| earningId                      | Unique identifier for each earning                                                                                                       |
| participantId                  | The primary identity of the partner earning under the program                                                                            | 
| participantIdType              | Mostly program ID for Incentive programs and Seller IF for Store programs and Azure Marketplace                                          | 
| participantName                | Name of the earning partner                                                                                                              | 
| partnerCountryCode             | Location/country of the earning partner                                                                                                  |
| programName                    | Incentive/store program name                                                                                                             | 
| transactionId                  | Unique identifier for the transaction                                                                                                    | 
| transactionCurrency            | Currency in which the original customer transaction occurred (it is not the partner location currency)                                     | 
| transactionDate                | Date of the transaction. Useful for programs where many transactions contribute to one earning                                           | 
| transactionExchangeRate        | Exchange rate used to show the corresponding transaction USD amount                                                                 | 
| transactionAmount              | Transaction amount in the original transaction currency based on which earning is generated                                              | 
| transactionAmountUSD           | Transaction amount in USD                                                                                                                | 
| lever                          | Indicates business rule for the earning                                                                                                  | 
| earningRate                    | Incentive rate applied on transaction amount to generate an earning                                                                      | 
| quantity                       | Varies based on program. Indicates billed quantity for transactional programs                                                            | 
| quantityType                   | Indicates type of quantity, for example: Billed quantity, MAU                                                                                     |
| earningType                    | Indicates if it is fee, rebate, coop, sell etc.                                                                                          | 
| earningAmount                  | Earning Amount in the original transaction currency                                                                                      |
| earningAmountUSD               | Earning Amount in USD                                                                                                                    |
| earningDate                    | Date of the earning                                                                                                                      |
| calculationDate                | Date the earning was calculated in the system                                                                                            |
| earningExchangeRate            | Exchange rate used to show the corresponding USD amount                                                                                  |
| exchangeRateDate               | Exchange rate date used to calculate EarningAmount USD                                                                                   | 
| paymentAmountWOTax             | Earning amount (without tax) in Pay To currency for “Sent” payments only                                                                 |
| paymentCurrency                | Pay to currency chosen by partner in the Payment profile. Shown only for sent payments                                                   |
| paymentExchangeRate            | Exchange rate used to calculate paymentAmountWOTax in payment currency using ExchangeRateDate                                            |
| paymentId            | Unique identifier for the payment. This number is visible in your bank statement                                            |
| paymentStatus            | Payment status                                            |
| paymentStatusDescription            | Friendly description of payment status                                            |
| customerId                     | Will always be blank                                                                                                                     |
| customerName                   | Will always be blank                                                                                                                     |
| partNumber                     | Will always be blank                                                                                                                     |
| productName                    | Product name linked to transaction                                                                                                       |
| productId                      | Unique product identifier                                                                                                                |
| parentProductId                | Unique parent product identifier. Note: if there isn’t a parent product for the transaction, then Parent Product ID = Product ID. |
| parentProductName              | Name of the parent product. Note: if there isn’t a parent product for the transaction, then Parent Product Name = Product Name.   |
| productType                    | Type of product (such as App, Add-on, Game, etc.)                                                                                        |
| invoiceNumber                  | Invoice number (applicable for EA only)                                                                                                  |
| resellerId                     | Reseller identifier                                                                                                                      |
| resellerName                   | Reseller name                                                                                                                            |
| transactionType                | Type of transaction (such as purchase, refund, reversal, chargeback, etc.)                                                               |
| localProviderSeller            | Local provider/seller of record                                                                                                          |
| taxRemitted                    | Amount of tax remitted (sales, use, or VAT/GST taxes).                                                                                   |
| taxRemitModel                  | Party responsible for remitting taxes (sales, use, or VAT/GST taxes).                                                                    |
| storeFee                       | The amount retained by Microsoft as a fee for making the app or add-on available in the Store.                                            |
| transactionPaymentMethod       | Customer payment instrument used for the transaction (such as Card, Mobile Carrier Billing, PayPal, etc.)                                |
| tpan                           | Indicates the third-party ad network                                                                                                     |
| customerCountry                | Customer country                                                                                                                         |
| customerCity                   | Customer city                                                                                                                            |
| customerState                  | Customer state                                                                                                                           |
| customerZip                    | Customer zip/postal code                                                                                                                 |
| TenantID                       |                                                                                                                                          |
| externalReferenceId            | Unique identifier for the program                                                                                                        |
| externalReferenceIdLabel       | Unique identifier label                                                                                                                  |
| transactionCountryCode       | Country Code in which transaction happened                                                                                                                  |
| taxCountry       | Sold To Customer Country                                                                                                                  |
| taxState       | Sold To customer State                                                                                                                  |
| taxCity       | Sold to Customer City                                                                                                                  |
| taxZipCode       | Sold To Customer Zip                                                                                                                  |
| LicensingProgramName       |                                                                                                                   |
| Program Code       | String to map with the program name                                                                                                                   |
| earningAmountInLastPaymentCurrency       | Earning amount in the last payment currency (field will be empty, if no prior payments have been paid)                                                                                                                   |
| lastPaymentCurrency       | Last payment currency (field will be empty, if no prior payment has been paid)                                                                                                                   |
| AssetId       | The unique identifier for the customer orders for your marketplace service.  It represents the transacted purchase line items. There can be multiple assets.                                                                                                                   |
| OrderId       | relates to a customer's invoice                                                                                                                   |
| LineItemId       | individual line in a customer's invoice                                                                                                                   |
| Customer Country       | The country name provided by the customer.  This could be different than the country in a customer’s Azure Subscription.                                                                                                                   |
| Customer EmailAddress       | The e-mail address provided by the end customer.  This could be different from the e-mail address in a customer’s Azure Subscription.                                                                                                                   |
| SkuId       | SKU ID as defined during publishing. An offer may have many SKUs, but a SKU can only be associated with a single offer.                                                                                                                   |

>[!Note]
>All reporting and insights for the transact publishing option are available via the Insights section of the Cloud Partner Portal or Analytics section of Partner Center.

## Billing questions and support

To get help on billing questions, please contact [commercial marketplace publisher support](https://aka.ms/marketplacepublishersupport).
