---
title: Sample queries for programmatic analytics
description: Use these sample queries to programmatically access Microsoft commercial marketplace analytics data. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Sample queries for programmatic analytics

This article provides sample queries for the Microsoft commercial marketplace Orders, Usage, and Customer reports. You can use these queries by calling the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API endpoint. If required, the [Create Report Query](analytics-programmatic-access.md#create-report-query-api) API call can be modified to add more columns, adjust the computation period, and add filter conditions. The supported time periods are six months (6M), 12 months (12M), and Custom Time Period.

For details about the column names, attributes, and descriptions, refer to the following tables:

- [Customer details table](https://review.docs.microsoft.com/en-us/azure/marketplace/customer-dashboard?branch=pr-en-us-146484#customer-details-table)
- [Orders details table](https://review.docs.microsoft.com/en-us/azure/marketplace/orders-dashboard?branch=pr-en-us-146484#orders-details-table)
- [Usage details table](https://review.docs.microsoft.com/en-us/azure/marketplace/usage-dashboard?branch=pr-en-us-146484#usage-details-table)

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
| Virtual Machine (VM) normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST\_6\_MONTHS` |
| VM Raw usage for “Billed through Azure” Marketplace License type for the last 12M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST\_1\_YEAR` |
| VM Normalized usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST\_6\_MONTHS` |
| VM Raw usage for “Bring Your Own License” Marketplace License type for the last 6M | `SELECT MonthStartDate, RawUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Bring Your Own License’ AND OfferType NOT IN (‘Azure Applications’, ‘SaaS’) TIMESPAN LAST\_6\_MONTHS` |
| Based on Usage Date, daily total normalized usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, NormalizedUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST\_MONTH` |
| Based on Usage Date, daily total raw usage and “Estimated Extended Charges (PC/CC)” for Paid plans for the last month | `SELECT UsageDate, RawUsage, EstimatedExtendedChargePC FROM ISVUsage WHERE SKUBillingType = ‘Paid’ ORDER BY UsageDate DESC TIMESPAN LAST\_MONTH` |
| For a specific Offer Name, VM Normalized usage for “Billed through Azure” Marketplace License type for the last 6M | `SELECT OfferName, NormalizedUsage FROM ISVUsage WHERE MarketplaceLicenseType = ‘Billed Through Azure’ AND OfferName = ‘Example Offer Name’ TIMESPAN LAST\_6\_MONTHS` |
| For a specific Offer Name, metered usage for the last 6M | `SELECT OfferName, MeteredUsage FROM ISVUsage WHERE OfferName = ‘Example Offer Name’ AND OfferType IN (‘SaaS’, ‘Azure Applications’) TIMESPAN LAST\_6\_MONTHS` |
|||

## Orders report queries

These sample queries apply to the Orders report.

| **Query Description** | **Sample Query** |
| --- | --- |
| Orders report for Azure License Type as “Enterprise” for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE AzureLicenseType = ‘Enterprise’ TIMESPAN LAST\_6\_MONTHS` |
| Orders report for Azure License Type as “Pay as You Go” for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE AzureLicenseType = ‘Pay as You Go’ TIMESPAN LAST\_6\_MONTHS` |
| Orders report for specific offer name for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OfferName = ‘Example Offer Name’ TIMESPAN LAST\_6\_MONTHS` |
| Orders report for active orders for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = ‘Active’ TIMESPAN LAST\_6\_MONTHS` |
| Orders report for cancelled orders for the last 6M | `SELECT OrderId, OrderPurchaseDate FROM ISVOrder WHERE OrderStatus = ‘Cancelled’ TIMESPAN LAST\_6\_MONTHS` |
|||
