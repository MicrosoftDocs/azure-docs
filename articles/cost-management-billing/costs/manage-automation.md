---
title: Manage Azure costs with automation
description: This article explains how you can manage Azure costs with automation.
author: bandersmsft
ms.author: banders
ms.date: 04/15/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: adwise
---

# Manage costs with automation

You can use Cost Management automation to build a custom set of solutions to retrieve and manage cost data. This article covers common scenarios for Cost Management automation and options available based on your situation. If you want to develop using APIs, common API request examples and presented to help accelerate your development process.

## Automate cost data retrieval for offline analysis

You might need to download your Azure cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved. You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](https://docs.microsoft.com/azure/cost-management-billing/costs/assign-access-acm-data).

## Suggestions for handling large datasets

If your organization has a large Azure presence across many resources or subscriptions, you'll have a large amount of usage details data. Excel often can't load such large files. In this situation, we recommend the following options:

**Power BI**

Power BI is used to ingest and handle large amounts of data. If you're an Enterprise Agreement customer, you can use the Power BI template app to analyze costs for your billing account. The report contains key views used by customers. For more information, see [Analyze Azure costs with the Power BI template app](https://docs.microsoft.com/azure/cost-management-billing/costs/analyze-cost-data-azure-cost-management-power-bi-template-app).

**Power BI data connector**

If you want to analyze your data daily, we recommend using the [Power BI data connector](https://docs.microsoft.com/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

**Cost Management exports**

You might not need to analyze the data daily. If so, consider using Cost Management's [Exports](https://docs.microsoft.com/azure/cost-management-billing/costs/tutorial-export-acm-data) feature to schedule data exports to an Azure Storage account. Then you can load the data into Power BI as needed, or analyze it in Excel if the file is small enough. Exports are available in the Azure portal or you can configure exports with the [Exports API](https://docs.microsoft.com/rest/api/cost-management/exports).

**Usage Details API**

Consider using the [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usageDetails) if you have a small cost data set. If you have a large amount of cost data, you should request the smallest amount of usage data as possible for a period. To do so, specify either a small time range or use a filter in your request. For example, in a scenario where you need three years of cost data, the API does better when you make multiple calls for different time ranges rather than with a single call. From there, you can load the data into Excel for further analysis.

## Automate retrieval with Usage Details API

The [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usageDetails) provides an easy way to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if you're looking to analyze smaller cost data sets. However, you should use other solutions identified previously if you have larger datasets. The data in Usage Details is provided on a per meter basis, per day. It's used when calculating your monthly bill. The general availability (GA) version of the APIs is `2019-10-01`. Use `2019-04-01-preview` to access the preview version for reservation and Azure Marketplace purchases with the APIs.

### Usage Details API suggestions

**Request schedule**

We recommend that you make _no more than one request_ to the Usage Details API per day. For more information about how often cost data is refreshed and how rounding is handled, see [Understand cost management data](https://docs.microsoft.com/azure/cost-management-billing/costs/understand-cost-mgt-data#rated-usage-data-refresh-schedule).

**Target top-level scopes without filtering**

Use the API to get all the data you need at the highest-level scope available. Wait until all needed data is ingested before doing any filtering, grouping, or aggregated analysis. The API is optimized specifically to provide large amounts of unaggregated raw cost data. To learn more about scopes available in Cost Management, see [Understand and work with scopes](https://docs.microsoft.com/azure/cost-management-billing/costs/understand-work-scopes). Once you've downloaded the needed data for a scope, use Excel to analyze data further with filters and pivot tables.

## Example Usage Details API requests

The following example requests are used by Microsoft customers to address common scenarios that you might come across.

### Get Usage Details for a scope during specific date range

The data that's returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20'2020-02-01'%20and%20properties%2FusageEnd%20le%20'2020-02-29'&$top=1000&api-version=2019-10-01

```

### Get amortized cost details

If you need actual costs to show purchases as they're accrued, change the *metric* to `ActualCost` in the following request. To use amortized and actual costs, you must use the `2019-04-01-preview` version. The current API version works the same as the `2019-10-01` version, except for the new type/metric attribute and changed property names. If you have a Microsoft Customer Agreement, your filters are `startDate` and `endDate` in the following example.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&$filter=properties/usageStart+ge+'2019-04-01'+AND+properties/usageEnd+le+'2019-04-30'&api-version=2019-04-01-preview
```

## Retrieve large cost datasets recurringly with Exports

The Exports feature is a solution for scheduling cost data dumps on a regular basis. It's the recommended way to retrieve unaggregated cost data for organizations whose usage files may be too large to reliably call and download data using the Usage Details API. Data is placed in an Azure Storage account of your choice. From there, you can load it into your own systems and analyze it as needed by your teams. To configure exports in the Azure portal, see [Export data](https://docs.microsoft.com/azure/cost-management-billing/costs/tutorial-export-acm-data).

## Data latency and rate limits

We recommend that you call the APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently won't provide any additional data. Instead, it will create increased load. To learn more about how often data changes and how data latency is handled, see [Understand cost management data](https://docs.microsoft.com/azure/cost-management-billing/costs/understand-cost-mgt-data).

### Error code 429 - Call count has exceeded rate limits

To enable a consistent experience for all Cost Management subscribers, Cost Management APIs are rate limited. When you reach the limit, you receive the HTTP status code `429: Too many requests`. The current throughput limits for our APIs are as follows:

- 30 calls per minute - It's done per scope, per user, or application.
- 200 calls per minute - It's done per tenant, per user, or application.

## Next steps

- [Analyze Azure costs with the Power BI template app](https://docs.microsoft.com/azure/cost-management-billing/costs/analyze-cost-data-azure-cost-management-power-bi-template-app).
- [Create and manage exported data](https://docs.microsoft.com/azure/cost-management-billing/costs/tutorial-export-acm-data) with Exports.
- Learn more about the [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usageDetails).