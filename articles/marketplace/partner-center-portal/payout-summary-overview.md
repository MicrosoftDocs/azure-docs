---
title: Payout summary overview - Azure Marketplace
description: The Payout summary shows you details about the money you've earned with your offer. It also lets you know when you'll receive payments and how much you'll be paid.
author: mingshen
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/24/2020
---

# Payout summary overview

The [Payout summary](./payout-summary.md) shows you details about the money you've earned with Microsoft. It also lets you know when you'll receive payments and how much you'll be paid.

If you sell offerings in the Azure Marketplace, you'll also see info on successful payouts in the Payout summary. For more information about Azure Marketplace payment, see [Azure Marketplace participation policies](https://docs.microsoft.com/legal/marketplace/participation-policy) and [Microsoft Azure Marketplace Publisher Agreement](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3ypvt).

> [!NOTE]
> To be eligible for payout, your proceeds must reach the [payment threshold](./payment-thresholds-methods-timeframes.md) of $50. For details about the payment threshold, see the [Microsoft Azure Marketplace Publisher Agreement](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3ypvt).

All reporting and insights for the transact publishing option are available in the Analytics section of Partner Center, accessed using this icon in the upper-right corner of the portal:

![Illustrates the Payout icon in the upper right corner of the Partner Center portal.](./media/payout-overview.png)

## Roles and permissions

These are roles and permissions to access the payout report:

| Reports/Pages | Account owner | Manager | Developer | Business contributor | Finance contributor | Marketer |
| --- | --- | --- | --- | --- | --- | --- |
| Acquisition report (including near real-time data) | Can view | Can view | No access | No access | Can view | No access |
| Feedback report/responses | Can view and send feedback | Can view and send feedback | Can view and send feedback | No access | No access | Can view and send feedback |
| --- | --- | --- | --- | --- | --- | --- |
| Health report (including near real-time data) | Can view | Can view | Can view | Can view | No access | No access |
| Usage report | Can view | Can view | Can view | Can view | No access | No access |
| Payout account | Can update | No access | No access | No access | Can update | No access |
| Tax profile | Can update | No access | No access | No access | Can update | No access |
| Payout summary | Can view | No access | No access | No access | Can view | No access  |
| | | | | | | |

## Payout report differences

These are the differences in the payout report between Cloud Partner Portal (old) and Partner Center (new):

| Cloud Partner Portal | Partner Center |
| --- | --- |
| **Link**: https://cloudpartner.azure.com/ | **Link**: https://partner.microsoft.com/dashboard/payouts/reports/transactionhistory and https://partner.microsoft.com/dashboard/payouts/reports/incentivepayments |
| **Navigation**: Payout reporting provided in Insights Payout | **Navigation**: Payout reporting provided in Partner Center – Payout Icon |
| **Scope**:<ul><li>Transaction per line item is visible, for collection in progress, collected, and paid.</li><li>Reporting – shows all line items once purchase order is created, including collection in progress and billing in progress, and collection status and line items that are not yet eligible to be paid.</li></ul> | **Scope**:<ul><li>Shows the line items after they're deemed as eligible earnings.</li><li>The customers pay to Microsoft first, and then ISVs can see the payout report starting.</li><li>Payout report won't show collection in progress and billing in Progress.</li></ul> |
| **Transaction not ready for payout**: Billing in Progress | **Transaction not ready for payout**: Next estimated payment: The payout status is in the unprocessed state. |
| **Payout status**: n/a | **Payout status**:<ul><li>Unprocessed: The earning is eligible for payment.</li><li>Upcoming: The earning will be sent to the publisher in the next monthly payout.</li><li>Sent: The payment has been sent to your bank.</li></ul> |
| | |

## Payment schedules

For a discussion of payment schedules, including holding periods, partner visibility, and when the customer uses a credit card or invoice, refer to the [Payment schedules](./payout-policy-details.md#payment-schedules) section of the **Payout details** topic.

## Transaction history download export

This option provides a download of each earning line item you see on the Transaction history page. This includes earning type, date, associated transaction amount, customer, product, and other transactional details related to the Incentives program.

| Column name | Description |
| --- | --- |
| earningId | Unique identifier for each earning |
| participantId | The primary identity of the partner earning under the program |
| participantIdType | Program ID for Incentive programs and Seller if the program is for Store programs and Azure Marketplace |
| participantName | Name of the earning partner |
| partnerCountryCode | Location/country/region of the earning partner |
| programName | Incentive/store program name |
| transactionId | Unique identifier for the transaction |
| transactionCurrency | Currency in which the original customer transaction occurred (it is not the partner location currency) |
| transactionDate | Date of the transaction. Useful for programs where many transactions contribute to one earning |
| transactionExchangeRate | Exchange rate used to show the corresponding transaction USD amount |
| transactionAmount | Transaction amount in the original transaction currency based on which earning is generated |
| transactionAmountUSD | Transaction amount in US dollars (USD) |
| lever | Business rule for the earning |
| earningRate | Incentive rate applied on transaction amount to generate an earning |
| quantity | Billed quantity for transactional programs. Varies based on program |
| quantityType | Type of quantity, for example: Billed quantity, Monthly Active Users (MAU) |
| earningType | Indicates if it is fee, rebate, coop, sell, and so on |
| earningAmount | Earning Amount in the original transaction currency |
| earningAmountUSD | Earning Amount in USD |
| earningDate | Date of the earning |
| calculationDate | Date the earning was calculated in the system |
| earningExchangeRate | Exchange rate used to show the corresponding USD amount |
| exchangeRateDate | Exchange rate date used to calculate EarningAmount USD |
| paymentAmountWOTax | Earning amount (without tax) in Pay To currency for &quot;Sent&quot; payments only |
| paymentCurrency | Pay to currency chosen by partner in the Payment profile. Shown only for sent payments |
| paymentExchangeRate | Exchange rate used to calculate paymentAmountWOTax in payment currency using ExchangeRateDate |
| paymentId | Unique identifier for the payment. This number is visible in your bank statement |
| paymentStatus | Payment status |
| paymentStatusDescription | Description of payment status |
| customerId | Will always be blank |
| customerName | Will always be blank |
| partNumber | Will always be blank |
| productName | Product name linked to the transaction |
| productId | Unique product identifier |
| parentProductId | Unique parent product identifier. If there isn't a parent product for the transaction, then Parent Product ID = Product ID. |
| parentProductName | Name of the parent product. If there isn't a parent product for the transaction, then Parent Product Name = Product Name. |
| productType | Type of product (such as App, Add-on, and Game) |
| invoiceNumber | Invoice number (for Enterprise Agreements only) |
| resellerId | Reseller identifier |
| resellerName | Reseller name |
| transactionType | Type of transaction (such as purchase, refund, reversal, and chargeback) |
| localProviderSeller | Local provider/seller of record |
| taxRemitted | Amount of tax remitted (sales, use, or VAT/GST taxes). |
| taxRemitModel | Party responsible for remitting taxes (sales, use, or VAT/GST taxes). |
| storeFee | The amount retained by Microsoft as a fee for making the app or add-on available in the commercial marketplace. |
| transactionPaymentMethod | Customer payment instrument used for the transaction (such as Card, Mobile Carrier Billing, and PayPal) |
| tpan | Third-party ad network |
| customerCountry | Customer country/region |
| customerCity | Customer city |
| customerState | Customer state |
| customerZip | Customer zip/postal code |
| TenantID | The ID of the Tenant |
| externalReferenceId | Unique identifier for the program |
| externalReferenceIdLabel | Unique identifier label |
| transactionCountryCode | Country/region code in which the transaction happened |
| taxCountry | Customer's country/region |
| taxState | Customer's state |
| taxCity | Customer's city |
| taxZipCode | Customer's zip/postal code |
| LicensingProgramName | Name of the licensing program |
| Program Code | String to map with the program name |
| earningAmountInLastPaymentCurrency | Earning amount in the last payment currency (field will be empty if no prior payments have been paid) |
| lastPaymentCurrency | Last payment currency (field will be empty if no prior payment has been paid) |
| AssetId | The unique identifier for the customer orders for your marketplace service. It represents the purchase line items. There can be multiple assets. |
| OrderId | Relates to a customer's invoice |
| LineItemId | Individual line in a customer's invoice |
| Customer Country/Region | The country/region name provided by the customer. This could be different than the country/region in a customer's Azure Subscription. |
| Customer EmailAddress | The e-mail address provided by the customer. This could be different from the e-mail address in a customer's Azure Subscription. |
| SkuId | SKU ID as defined during publishing. An offer may have many SKUs, but a SKU can only be associated with a single offer. |

> [!NOTE]
> All reporting and insights for the transact publishing option can be found in the Analytics section of Partner Center.

## Billing questions and support
For billing support, contact commercial marketplace [publisher support](https://partner.microsoft.com/support/v2/?stage=1).

## Next Step

- [Payout summaries](./payout-summary.md)
