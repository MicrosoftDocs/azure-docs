---
title: Sample queries for programmatic analytics | Azure Marketplace
description: Use these sample queries to programmatically access Microsoft commercial marketplace analytics data. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 1/25/2022
---

# Sample queries for programmatic analytics

This article provides sample queries for the Microsoft commercial marketplace Orders, Usage, and Customer reports. You can use these queries by calling the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API endpoint. If required, the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API call can be modified to add more columns, adjust the computation period, and add filter conditions. The supported time periods are six months (6M), 12 months (12M), and Custom Time Period.

For details about the column names, attributes, and descriptions, refer to the following tables:

- [Customer details table](customer-dashboard.md#customer-details-table)
- [Orders details table](orders-dashboard.md#orders-details-table)
- [Usage details table](usage-dashboard.md#usage-details-table)
- [Revenue details table](revenue-dashboard.md#data-dictionary-table)
- [Quality of service table](quality-of-service-dashboard.md#offer-deployment-details)

## Customers report queries

These sample queries apply to the Customers report.

| **Query Description** | **Sample Query** |
| --- | --- |
| Active customers of the partner until the date you choose | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE IsActive = 1` |
| Churned customers of the partner until the date you choose | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE IsActive = 0` |
| List of new customers from a specific geography in the last six months | `SELECT DateAcquired,CustomerCompanyName,CustomerId FROM ISVCustomer WHERE DateAcquired <= ‘2020-06-30’ AND CustomerCountryRegion = ‘United States’` |
|||

## Usage report queries

These sample queries apply to the Usage report.

| **Query Description** | **Sample Query** |
| --- | --- |
| Virtual Machine (VM) normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| VM Raw usage for “Billed through Azure” Marketplace License type for the last 12M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_1_YEAR` |
| VM Normalized usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| VM Raw usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST_6_MONTHS` |
| Based on Usage Date, daily total normalized usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, NormalizedUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST_MONTH` |
| Based on Usage Date, daily total raw usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, RawUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST\_MONTH` |
| For a specific Offer Name, VM Normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT OfferName, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferName = ‘Example Offer Name’ TIMESPAN LAST_6_MONTHS` |
| For a specific Offer Name, metered usage for the last 6M | `SELECT OfferName, MeteredUsage FROM ISVUsage WHERE OfferName = ‘Example Offer Name’ AND OfferType IN (‘SaaS’, ‘Azure Applications’) TIMESPAN LAST_6_MONTHS` |
|||

## Orders report queries

These sample queries apply to the Orders report.

| **Query Description** | **Sample Query** |
| --- | --- |
| Orders report for Azure License Type as “Enterprise” for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE AzureLicenseType = ‘Enterprise’ TIMESPAN LAST\_6\_MONTHS` |
| Orders report for Azure License Type as “Pay as You Go” for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE AzureLicenseType = ‘Pay as You Go’ TIMESPAN LAST_6_MONTHS` |
| Orders report for specific offer name for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OfferName = ‘Example Offer Name’ TIMESPAN LAST_6_MONTHS` |
| Orders report for active orders for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = ‘Active’ TIMESPAN LAST_6_MONTHS` |
| Orders report for canceled orders for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = ‘Cancelled’ TIMESPAN LAST_6_MONTHS` |
| Orders report with term start, term end date and estimatedcharges, currency | `SELECT OrderId, TermStartId, TermEndId, estimatedcharges from ISVOrderV2 WHERE OrderStatus = ‘Active’ TIMESPAN LAST_6_MONTHS` |
| Orders report for trial orders active for the last 6M | `SELECT OrderId from ISVOrderV2 WHERE OrderStatus = ‘Active’ and HasTrial = ‘True’ TIMESPAN LAST_6_MONTHS` |
|||

## Revenue report queries

These sample queries apply to the Revenue report.

| **Query Description** | **Sample Query** |
| --- | --- |
| Show billed revenue of the partner for last 1 month | `SELECT BillingAccountId, OfferName, OfferType, Revenue, EarningAmountCC, EstimatedRevenueUSD, EarningAmountUSD, PayoutStatus, PurchaseRecordId, LineItemId,TransactionAmountCC,TransactionAmountUSD, Quantity,Units FROM ISVRevenue TIMESPAN LAST_MONTH` |
| List estimated revenue in USD of all transactions with sent status in last 3 months | `SELECT BillingAccountId, OfferName, OfferType, EstimatedRevenueUSD, EarningAmountUSD, PayoutStatus, PurchaseRecordId, LineItemId, TransactionAmountUSD FROM ISVRevenue where PayoutStatus='Sent' TIMESPAN LAST_3_MONTHS` |
| List of non-trial transactions for subscription-based billing model | `SELECT BillingAccountId, OfferName,OfferType, TrialDeployment EstimatedRevenueUSD, EarningAmountUSD FROM ISVRevenue WHERE TrialDeployment=’False’ and BillingModel=’SubscriptionBased’` |
|||

## Quality of service report queries

This sample query applies to the Quality of service report.

| **Query Description** | **Sample Query** |
| ------------ | ------------- |
| Show deployment status of offers for last 6 months | `SELECT OfferId, Sku, DeploymentStatus, DeploymentCorrelationId, SubscriptionId, CustomerTenantId, CustomerName, TemplateType, StartTime, EndTime, DeploymentDurationInMilliSeconds, DeploymentRegion FROM ISVQualityOfService TIMESPAN LAST_6_MONTHS` |
|||

## Next steps

- [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md)
