---
title: Cost details best practices
titleSuffix: Microsoft Cost Management
description: This article describes best practices recommended by Microsoft when you work with data in cost details files.
author: bandersmsft
ms.author: banders
ms.date: 07/15/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Choose a cost details solution

There are multiple ways to work with the cost details dataset (formerly referred to as usage details). If your organization has a large Azure presence across many resources or subscriptions, you'll have a large amount of cost details data. Excel often can't load such large files. In this situation, we recommend the options below.

## Exports

Exports are recurring data dumps to storage that can be configured to run on a custom schedule. We recommend Exports as the solution to ingest cost details data. It's the most scalable for large enterprises. Exports are [configured in the Azure portal](../costs/tutorial-export-acm-data.md) or using the [Exports API](/rest/api/cost-management/exports). Review the considerations below for analyzing whether this solution is best for your particular data ingestion workload.

- Exports are most scalable solution for your workloads.
- Can be configured to use file partitioning for bigger datasets.
- Great for establishing and growing a cost dataset that can be integrated with your own queryable data stores.
- Requires access to a storage account that can hold the data.

To learn more about how to properly call the API and ingest cost details at scale, see [Retrieve large datasets with exports](../costs/ingest-azure-usage-at-scale.md).

## Cost Details API

The [Cost Details](/rest/api/cost-management/generate-cost-details-report) API is the go to solution for on demand download of the cost details dataset. Review the considerations below to analyze whether this solution is best for your particular data ingestion workload.

- Useful for small cost datasets. Exports scale better than the API. The API may not be a good solution if you need to ingest many gigabytes worth of cost data month over month. A GB of cost details data is roughly 1 million rows of data.
- Useful for scenarios when Exports to Azure storage aren't feasible due to security or manageability concerns.

If the Cost Details API is your chosen solution, review the best practices to call the API below.

- If you want to get the latest cost data, we recommend that you query at most once per day. Reports are refreshed every four hours. If you call more frequently, you'll receive identical data.
- Once you download your cost data for historical invoices, the charges won't change unless you're explicitly notified. We recommend caching your cost data in a queryable store on to prevent repeated calls for identical data.
- Chunk your calls into small date ranges to get more manageable files that you can download. For example, we recommend chunking by day or by week if you have large Azure usage files month-to-month. 
- If you have scopes with a large amount of usage data (for example a Billing Account), consider placing multiple calls to child scopes so you get more manageable files that you can download.
- If you're bound by rate limits at a lower scope, consider calling a higher scope to download data.
- If your dataset is more than 2 GB month-to-month, consider using [exports](../costs/tutorial-export-acm-data.md) as a more scalable solution.

To learn more about how to properly call the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API, see [Get small usage data sets on demand](get-small-usage-datasets-on-demand.md).

The Cost Details API is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you're an MSDN, pay-as-you-go or Visual Studio customer, see [Get usage details for pay-as-you-go subscriptions](get-usage-details-legacy-customer.md).

## Power BI

Power BI is another solution that's used to work with cost details data. The following Power BI solutions are available:

- Azure Cost Management Template App: - If you're an Enterprise Agreement or Microsoft Customer Agreement customer, you can use the Power BI template app to analyze costs for your billing account. It includes predefined reports that are built on top of the cost details dataset, among others. For more information, see [Analyze Azure costs with the Power BI template app](../costs/analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- Azure Cost Management Connector: - If you want to analyze your data daily, you can use the [Power BI data connector](/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

## Azure portal download

Only [download your usage from the Azure portal](../understand/download-azure-daily-usage.md) if you have a small cost details dataset that is capable of being loaded in Excel. Cost files that are larger than one or 2 GB may take an exceedingly long time to generate on demand from the Azure portal. They'll take longer to transfer over a network to your local computer. We recommend using one of the above solutions if you have a large monthly usage dataset.

## Next steps

- Get an overview of [how to ingest cost data](automation-ingest-usage-details-overview.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- [Understand cost details fields](understand-usage-details-fields.md).
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
