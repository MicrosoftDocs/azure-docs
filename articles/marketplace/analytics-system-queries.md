---
title: List of system queries
description: Learn about system queries you can use to programmatically get analytics data about your offers in the Microsoft commercial marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# List of system queries

The following system queries can be used in the [Create Report API](analytics-programmatic-access.md#create-report-api) directly with a `QueryId`. The system queries are like the export reports in Partner Center for a six month (6M) computation period.

For more information on the column names, attributes, and description, see these articles:

- [Customers dashboard in commercial marketplace analytics](customer-dashboard.md#customer-details-table)
- [Orders dashboard in commercial marketplace analytics](orders-dashboard.md#orders-details-table)
- [Usage dashboard in commercial marketplace analytics](usage-dashboard.md#usage-details-table)
- [Marketplace Insights dashboard in commercial marketplace analytics](insights-dashboard.md#marketplace-insights-details-table)

The following sections provide report queries for various reports.

## Customers report query

**Report description**: Customers report for the last 6M

**QueryID**:  `b9df4929-073f-4795-b0cb-a2c81b11e28d`

**Report query**:

`SELECT MarketplaceSubscriptionId,DateAcquired,DateLost,ProviderName,ProviderEmail,FirstName,LastName,Email,CustomerCompanyName,CustomerCity,CustomerPostalCode,CustomerCommunicationCulture,CustomerCountryRegion,AzureLicenseType,PromotionalCustomers,CustomerState,CommerceRootCustomer,CustomerId,BillingAccountId,ID  FROM ISVCustomer TIMESPAN LAST_6_MONTHS`

## Orders report query

**Report description**: Orders report for the last 6M

**QueryID**:  `fd0f299c-5a1c-4929-9f48-bfc6cc44355d`

**Report query**:

`SELECT MarketplaceSubscriptionId,MonthStartDate,OfferType,AzureLicenseType,MarketplaceLicenseType,Sku,CustomerCountry,IsPreviewSKU,OrderId,OrderQuantity,CloudInstanceName,IsNewCustomer,OrderStatus,OrderCancelDate,CustomerCompanyName,CustomerName,OrderPurchaseDate,OfferName,TrialEndDate,CustomerId,BillingAccountId FROM ISVOrder TIMESPAN LAST_6_MONTHS`

## Usage report queries

**Report description**: VM Normalized usage report for the last 6M

**QueryID**:  `2c6f384b-ad52-4aed-965f-32bfa09b3778`

**Report query**:

`SELECT MarketplaceSubscriptionId,MonthStartDate,OfferType,AzureLicenseType,MarketplaceLicenseType,SKU,CustomerCountry,IsPreviewSKU,SKUBillingType,IsInternal,VMSize,CloudInstanceName,ServicePlanName,OfferName,DeploymentMethod,CustomerName,CustomerCompanyName,UsageDate,IsNewCustomer,CoreSize,TrialEndDate,CustomerCurrencyCC,PriceCC,PayoutCurrencyPC,EstimatedPricePC,UsageReference,UsageUnit,CustomerId,BillingAccountId,NormalizedUsage,EstimatedExtendedChargeCC,EstimatedExtendedChargePC FROM ISVUsage WHERE OfferType IN ('vm core image', 'Virtual Machine Licenses', 'multisolution') TIMESPAN LAST_6_MONTHS`

**Report description**: VM Raw usage report for the last 6M

**QueryID**:  `3f19fb95-5bc4-4ee0-872e-cedd22578512`

**Report query**:

`SELECT MarketplaceSubscriptionId,MonthStartDate,OfferType,AzureLicenseType,MarketplaceLicenseType,SKU,CustomerCountry,IsPreviewSKU,SKUBillingType,IsInternal,VMSize,CloudInstanceName,ServicePlanName,OfferName,DeploymentMethod,CustomerName,CustomerCompanyName,UsageDate,IsNewCustomer,CoreSize,TrialEndDate,CustomerCurrencyCC,PriceCC,PayoutCurrencyPC,EstimatedPricePC,UsageReference,UsageUnit,CustomerId,BillingAccountId,RawUsage,EstimatedExtendedChargeCC,EstimatedExtendedChargePC FROM ISVUsage WHERE OfferType IN ('vm core image', 'Virtual Machine Licenses', 'multisolution') TIMESPAN LAST_6_MONTHS`

**Report description**: Metered usage report for the last 6M

**QueryID**:  `f0c4927f-1f23-4c99-be4a-1371a5a9a086`

**Report query**:

`SELECT MarketplaceSubscriptionId,MonthStartDate,OfferType,AzureLicenseType,MarketplaceLicenseType,SKU,CustomerCountry,IsPreviewSKU,SKUBillingType,IsInternal,VMSize,CloudInstanceName,ServicePlanName,OfferName,DeploymentMethod,CustomerName,CustomerCompanyName,UsageDate,IsNewCustomer,CoreSize,TrialEndDate,CustomerCurrencyCC,PriceCC,PayoutCurrencyPC,EstimatedPricePC,UsageReference,UsageUnit,CustomerId,BillingAccountId,MeteredUsage,EstimatedExtendedChargeCC,EstimatedExtendedChargePC FROM ISVUsage WHERE OfferType IN ('SaaS', 'Azure Applications') TIMESPAN LAST_6_MONTHS`

## Marketplace insights report query

**Report description**: Marketplace Insights report for the last 6M

**QueryID**:  `6fd7624b-aa9f-42df-a61d-67d42fd00e92`

**Report query**:

`Date,OfferName,ReferralDomain,CountryName,PageVisits,GetItNow,ContactMe,TestDrive,FreeTrial FROM ISVMarketplaceInsights TIMESPAN LAST_6_MONTHS`

## Next steps

- [APIs for accessing commercial marketplace analytics data](analytics-available-apis.md)
- [Sample application for accessing commercial marketplace analytics data](analytics-sample-application.md)
