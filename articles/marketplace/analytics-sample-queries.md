---
title: Sample queries for programmatic analytics
description: Use these sample queries to programmatically access Microsoft commercial marketplace analytics data. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.date: 3/08/2021
---

# Sample queries for programmatic analytics

This article provides sample queries for the Microsoft commercial marketplace Orders, Usage, and Customer reports. You can use these queries by calling the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API endpoint. If required, the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API call can be modified to add more columns, adjust the computation period, and add filter conditions. The supported time periods are six months (6M), 12 months (12M), and Custom Time Period.

For details about the column names, attributes, and descriptions, refer to the following tables:

- [Customer details table](customer-dashboard.md#customer-details-table)
- [Orders details table](orders-dashboard.md#orders-details-table)
- [Usage details table](usage-dashboard.md#usage-details-table)

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
|||

## Next steps

- [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md)
