---
title: Sample queries for programmatic analytics | Azure Marketplace
description: Use these sample queries to programmatically access Microsoft commercial marketplace analytics data. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 2/23/2022
---

# Sample queries for programmatic analytics

This article provides sample queries for the Microsoft commercial marketplace Orders, Usage, and Customer reports. You can use these queries by calling the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API endpoint. If required, the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API call can be modified to add more columns, adjust the computation period, and add filter conditions. The supported time periods are six months (6M), 12 months (12M), and Custom Time Period.

For details about the column names, attributes, and descriptions, refer to the following tables:

- [Customer details table](customer-dashboard.md#customer-details-table)
- [Orders details table](orders-dashboard.md#orders-details-table)
- [Usage details table](usage-dashboard.md#usage-details-table)
- [Revenue details table](revenue-dashboard.md#data-dictionary-table)
- [Quality of service table](quality-of-service-dashboard.md#detailed-data)
- [Customer retention table](customer-retention-dashboard.md#dictionary-of-data-terms)

## Customers report queries

These sample queries apply to the Customers report.

| **Query Description** | **Sample Query** |
| --- | --- |
| List customer details with active customers of the partner until the date you choose | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE IsActive = 1` |
| List customer details with churned customers of the partner until the date you choose | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE IsActive = 0` |
| List of new customers from a specific geography in the last six months | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE DateAcquired <= ‘2020-06-30’ AND CustomerCountryRegion = ‘United States’` |

## Usage report queries

These sample queries apply to the Usage report.

| **Query Description** | **Sample Query** |
| --- | --- |
| List usage details with Virtual Machine (VM) normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| List usage details with VM Raw usage for “Billed through Azure” Marketplace License type for the last 12M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_1_YEAR` |
| List usage details with VM Normalized usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| List usage details with VM Raw usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| List usage details with Usage Date, daily total normalized usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, NormalizedUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST_MONTH` |
| List usage details with Usage Date, daily total raw usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, RawUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST\_MONTH` |
| List usage details with Offer Name, VM Normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT OfferName, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferName = ‘Example Offer Name’ TIMESPAN LAST_6_MONTHS` |
| List usage details with Offer Name, metered usage for the last 6M | `SELECT OfferName, MeteredUsage FROM ISVUsage WHERE OfferName = ‘Example Offer Name’ AND OfferType IN (‘SaaS’, ‘Azure Applications’) TIMESPAN LAST_6_MONTHS` |
| List all offer usage details of all offers for last 6M | `SELECT OfferType, OfferName, SKU, IsPrivateOffer, UsageReference, UsageDate, RawUsage, EstimatedPricePC FROM ISVUsage ORDER BY UsageDate DESC TIMESPAN LAST_MONTH` |
| List all offer usage details of private offers for last 6M | `SELECT OfferType, OfferName, SKU, IsPrivateOffer, UsageReference, UsageDate, RawUsage, EstimatedPricePC FROM ISVUsage WHERE IsPrivateOffer = '1' ORDER BY UsageDate DESC TIMESPAN LAST_MONTH` |

## Orders report queries

These sample queries apply to the Orders report.

| **Query Description** | **Sample Query** |
| --- | --- |
| List Order details for Azure License Type as “Enterprise” for the last 6M | `SELECT AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate FROM ISVOrder WHERE AzureLicenseType = 'Enterprise' TIMESPAN LAST_6_MONTHS` |
| List Order details for Azure License Type as “Pay as You Go” for the last 6M | `SELECT OfferName, AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate, OrderStatus, OrderCancelDate FROM ISVOrder WHERE AzureLicenseType = 'Pay as You Go' TIMESPAN LAST_6_MONTHS` |
| List Order details for specific offer name for the last 6M | `SELECT AssetId, PurchaseRecordId, PurchaseRecordLineItemId , OrderPurchaseDate FROM ISVOrder WHERE OfferName = Contoso test Services' TIMESPAN LAST_6_MONTHS` |
| List Order details for active orders for the last 6M | `SELECT OfferName, AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = 'Active' TIMESPAN LAST_6_MONTHS` |
| List Order details for cancelled orders for the last 6M | `SELECT OfferName, AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = 'Cancelled' TIMESPAN LAST_6_MONTHS` |
| List Order details with quantity, term start, term end date and estimatedcharges, currency for the last 6M | `SELECT AssetId, Quantity, PurchaseRecordId, PurchaseRecordLineItemId, TermStartDate, TermEndDate, BilledRevenue, Currency from ISVOrder WHERE OrderStatus = 'Active' TIMESPAN LAST_6_MONTHS` |
| List Order details for trial orders active for the last 6M | `SELECT AssetId, Quantity, PurchaseRecordId, PurchaseRecordLineItemId from ISVOrder WHERE OrderStatus = 'Active' and IsTrial = 'True' TIMESPAN LAST_6_MONTHS` |
| List Order details for all offers that are active for the last 6M | `SELECT OfferName, SKU, IsPrivateOffer, AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate, BilledRevenue FROM ISVOrder WHERE OrderStatus = 'Active' TIMESPAN LAST_6_MONTHS` |
| List Order details for private offers active for the last 6M | `SELECT OfferName, SKU, IsPrivateOffer, AssetId, PurchaseRecordId, PurchaseRecordLineItemId, OrderPurchaseDate, BilledRevenue FROM ISVOrder WHERE IsPrivateOffer = '1' and OrderStatus = 'Active' TIMESPAN LAST_6_MONTHS` |

## Revenue report queries

These sample queries apply to the Revenue report.

| **Query Description** | **Sample Query** |
| --- | --- |
| List billed revenue of the partner for last 1 month | `SELECT BillingAccountId, OfferName, OfferType, Revenue, EarningAmountCC, EstimatedRevenueUSD, EarningAmountUSD, PayoutStatus, PurchaseRecordId, LineItemId,TransactionAmountCC,TransactionAmountUSD, Quantity,Units FROM ISVRevenue TIMESPAN LAST_MONTH` |
| List estimated revenue in USD of all transactions with sent status in last 3 months | `SELECT BillingAccountId, OfferName, OfferType, EstimatedRevenueUSD, EarningAmountUSD, PayoutStatus, PurchaseRecordId, LineItemId, TransactionAmountUSD FROM ISVRevenue where PayoutStatus='Sent' TIMESPAN LAST_3_MONTHS` |
| List of non-trial transactions for subscription-based billing model | `SELECT BillingAccountId, OfferName,OfferType, TrialDeployment EstimatedRevenueUSD, EarningAmountUSD FROM ISVRevenue WHERE TrialDeployment=’False’ and BillingModel=’SubscriptionBased’` |

## Quality of service report queries

This sample query applies to the Quality of service report.

| **Query Description** | **Sample Query** |
| ------------ | ------------- |
| List deployment status of offers for last 6 months | `SELECT OfferId, Sku, DeploymentStatus, DeploymentCorrelationId, SubscriptionId, CustomerTenantId, CustomerName, TemplateType, StartTime, EndTime, DeploymentDurationInMilliSeconds, DeploymentRegion FROM ISVQualityOfService TIMESPAN LAST_6_MONTHS` |

## Customer retention report queries

This sample query applies to the Customer retention report.

| **Query Description** | **Sample Query** |
| ------------ | ------------- |
| List customer retention details for last 6 months | `SELECT OfferCategory, OfferName, ProductId, DeploymentMethod, ServicePlanName, Sku, SkuBillingType, CustomerId, CustomerName, CustomerCompanyName, CustomerCountryName, CustomerCountryCode, CustomerCurrencyCode, FirstUsageDate, AzureLicenseType, OfferType, Offset FROM ISVOfferRetention TIMESPAN LAST_6_MONTHS` |
| List usage activity and revenue details of all customers in last 6 months | `SELECT OfferCategory, OfferName, Sku, ProductId, OfferType, FirstUsageDate, Offset, CustomerId, CustomerName, CustomerCompanyName, CustomerCountryName, CustomerCountryCode, CustomerCurrencyCode FROM ISVOfferRetention TIMESPAN LAST_6_MONTHS` |

## Next steps

- [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md)
