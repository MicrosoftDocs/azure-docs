---
title: Migrate from the EA Billing Periods API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Billing Periods API.
author: bandersmsft
ms.author: banders
ms.date: 05/16/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: maminn
---

# Migrate from the EA Billing Periods API

EA customers that previously used the Billing periods Enterprise Reporting consumption.azure.com API to get their billing periods need to use different mechanisms to get the data they need. This article helps you migrate from the old API by using replacement APIs.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

Endpoints to migrate off:

| **Endpoint** | **API Comments** |
| --- | --- |
| /v2/enrollments/{enrollmentNumber}/billingperiods | • API method: GET  <br> • Synchronous (non polling)  <br> • Data format: JSON |

## New solutions

There's no new single API that has the same functionality that returns billing periods with consumption data and that returns the API routes for the four sets of data. Instead, you call each new API individually. If data of the requested type is available, it gets included in the response. Otherwise, no data is included in the response.

The Balance Summary and Price Sheet APIs use the billing period *as a parameter*. Create your GET request with the billing period using the year and month (_yyyyMM_) format.

### Balance Summary

Call the new Balances API to get either [the balances for all billing periods](/rest/api/consumption/balances/get-by-billing-account/) or the balances for a [specific billing period](/rest/api/consumption/balances/get-for-billing-period-by-billing-account/).

### Usage Details

To get usage details, use either Cost Management Exports or the [Cost Management Cost Details API](/rest/api/cost-management/generate-cost-details-report). You can get the cost and usage details data for a time period. If data exists for the specified period, it gets returned. Otherwise, no data is included in the response.

The billing period can be represented in the Usage Details alternatives by using the billing period time frame as the selected start and end date.

For more information about each option, see [Migrate from EA Usage Details APIs](migrate-ea-usage-details-api.md).

### Marketplace charges

Call the [List Marketplaces API](/rest/api/consumption/marketplaces/list/#marketplaceslistresult) to get a list of available marketplaces in reverse chronological order by billing period.

### Price Sheet

Call the new [Price Sheet API](/rest/api/consumption/price-sheet) to get the price sheet for either [the current billing period](/rest/api/consumption/price-sheet/get/) or for [a specific billing period](/rest/api/consumption/price-sheet/get-by-billing-period/).

## Related content

- Read the [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.
