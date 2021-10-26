---
title: Manage Azure costs with automation
description: This article explains how you can manage Azure costs with automation.
author: bandersmsft
ms.author: banders
ms.date: 10/25/2021
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Manage costs with automation

You can use Cost Management automation to build a custom set of solutions to retrieve and manage cost data. This article covers common scenarios for Cost Management automation and options available based on your situation. If you want to develop using APIs, common API request examples and presented to help accelerate your development process.

## Automate cost data retrieval for offline analysis

You might need to download your Azure cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved. You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](./assign-access-acm-data.md).

## Suggestions for handling large datasets

If your organization has a large Azure presence across many resources or subscriptions, you'll have a large amount of usage details data. Excel often can't load such large files. In this situation, we recommend the following options:

**Power BI**

Power BI is used to ingest and handle large amounts of data. If you're an Enterprise Agreement customer, you can use the Power BI template app to analyze costs for your billing account. The report contains key views used by customers. For more information, see [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).

**Power BI data connector**

If you want to analyze your data daily, we recommend using the [Power BI data connector](/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

**Cost Management exports**

You might not need to analyze the data daily. If so, consider using Cost Management's [Exports](./tutorial-export-acm-data.md) feature to schedule data exports to an Azure Storage account. Then you can load the data into Power BI as needed, or analyze it in Excel if the file is small enough. Exports are available in the Azure portal or you can configure exports with the [Exports API](/rest/api/cost-management/exports).

**Usage Details API**

Consider using the [Usage Details API](/rest/api/consumption/usageDetails) if you have a small cost data set. If you have a large amount of cost data, you should request the smallest amount of usage data as possible for a period. To do so, specify either a small time range or use a filter in your request. For example, in a scenario where you need three years of cost data, the API does better when you make multiple calls for different time ranges rather than with a single call. From there, you can load the data into Excel for further analysis.

## Automate retrieval with Usage Details API

The [Usage Details API](/rest/api/consumption/usageDetails) provides an easy way to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if you're looking to analyze smaller cost data sets. However, you should use other solutions identified previously if you have larger datasets. The data in Usage Details is provided on a per meter basis, per day. It's used when calculating your monthly bill. The general availability (GA) version of the APIs is `2019-10-01`. Use `2019-04-01-preview` to access the preview version for reservation and Azure Marketplace purchases with the APIs.

If you want to get large amounts of exported data regularly, see [Retrieve large cost datasets recurringly with exports](ingest-azure-usage-at-scale.md).

### Usage Details API suggestions

**Request schedule**

We recommend that you make _no more than one request_ to the Usage Details API per day. For more information about how often cost data is refreshed and how rounding is handled, see [Understand cost management data](./understand-cost-mgt-data.md).

**Target top-level scopes without filtering**

Use the API to get all the data you need at the highest-level scope available. Wait until all needed data is ingested before doing any filtering, grouping, or aggregated analysis. The API is optimized specifically to provide large amounts of unaggregated raw cost data. To learn more about scopes available in Cost Management, see [Understand and work with scopes](./understand-work-scopes.md). Once you've downloaded the needed data for a scope, use Excel to analyze data further with filters and pivot tables.

### Notes about pricing

If you want to reconcile usage and charges with your price sheet or invoice, note the following information.

Price Sheet price behavior - The prices shown on the price sheet are the prices that you receive from Azure. They're scaled to a specific unit of measure. Unfortunately, the unit of measure doesn't always align to the unit of measure at which the actual resource usage and charges are emitted.

Usage Details price behavior - Usage files show scaled information that may not match precisely with the price sheet. Specifically:

- Unit Price - The price is scaled to match the unit of measure at which the charges are actually emitted by Azure resources. If scaling occurs, then the price won't match the price seen in the Price Sheet.
- Unit of Measure - Represents the unit of measure at which charges are actually emitted by Azure resources.
- Effective Price / Resource Rate - The price represents the actual rate that you end up paying per unit, after discounts are taken into account. It's the price that should be used with the Quantity to do Price * Quantity calculations to reconcile charges. The price takes into account the following scenarios and the scaled unit price that's also present in the files. As a result, it might differ from the scaled unit price.
  - Tiered pricing - For example: $10 for the first 100 units, $8 for the next 100 units.
  - Included quantity - For example: The first 100 units are free and then $10 per unit.
  - Reservations
  - Rounding that occurs during calculation – Rounding takes into account the consumed quantity, tiered/included quantity pricing, and the scaled unit price.

### A single resource might have multiple records for a single day

Azure resource providers emit usage and charges to the billing system and populate the `Additional Info` field of the usage records. Occasionally, resource providers might emit usage for a given day and stamp the records with different datacenters in the `Additional Info` field of the usage records. It can cause multiple records for a meter/resource to be present in your usage file for a single day. In that situation, you aren't overcharged. The multiple records represent the full cost of the meter for the resource on that day.

## Example Usage Details API requests

The following example requests are used by Microsoft customers to address common scenarios that you might come across.

### Get Usage Details for a scope during specific date range

The data that's returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. The call to use varies by your subscription type.

For legacy customers with an Enterprise Agreement (EA) or a pay-as-you-go subscription, use the following call:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20'2020-02-01'%20and%20properties%2FusageEnd%20le%20'2020-02-29'&$top=1000&api-version=2019-10-01
```

For modern customers with a Microsoft Customer Agreement, use the following call:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?startDate=2020-08-01&endDate=2020-08-05&$top=1000&api-version=2019-10-01
```

### Get amortized cost details

If you need actual costs to show purchases as they're accrued, change the *metric* to `ActualCost` in the following request. To use amortized and actual costs, you must use the `2019-04-01-preview` version. The current API version works the same as the `2019-10-01` version, except for the new type/metric attribute and changed property names. If you have a Microsoft Customer Agreement, your filters are `startDate` and `endDate` in the following example.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&$filter=properties/usageStart+ge+'2019-04-01'+AND+properties/usageEnd+le+'2019-04-30'&api-version=2019-04-01-preview
```

## Automate alerts and actions with budgets

There are two critical components to maximizing the value of your investment in the cloud. One is automatic budget creation. The other is configuring cost-based orchestration in response to budget alerts. There are different ways to automate Azure budget creation. Various alert responses happen when your configured alert thresholds are exceeded.

The following sections cover available options and provide sample API requests to get you started with budget automation.

### How costs are evaluated against your budget threshold

Your costs are evaluated against your budget threshold once per day. When you create a new budget or at your budget reset day, the costs compared to the threshold will be zero/null because the evaluation might not have occurred.

When Azure detects that your costs have crossed the threshold, a notification is triggered within the hour of the detecting period.

### View your current cost

To view your current costs, you need to make a GET call using the [Query API](/rest/api/cost-management/query).

A GET call to the Budgets API won't return the current costs shown in Cost Analysis. Instead, the call returns your last evaluated cost.

## Data latency and rate limits

We recommend that you call the APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn't provide more data. Instead, it creates increased load. For more information, see [Cost Management API latency and rate limits](api-latency-rate-limits.md)

## Next steps

- [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- [Create and manage exported data](./tutorial-export-acm-data.md) with Exports.
- Learn more about the [Usage Details API](/rest/api/consumption/usageDetails).
