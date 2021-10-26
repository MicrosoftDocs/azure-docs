---
title: Usage details best practices | Azure
description: This article describes best practices recommended by Microsoft when you work with data in usage details files.
author: bandersmsft
ms.author: banders
ms.date: 10/22/2021
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Usage details best practices

There are multiple ways to work with the usage details dataset. If your organization has a large Azure presence across many resources or subscriptions, you'll have a large amount of usage details data. Excel often can't load such large files. In this situation, we recommend the options below.

## Exports

Exports is our recommended solution for ingesting usage details data. This solution is the most scalable for large enterprises. Exports are [configured in the Azure portal](../costs/tutorial-export-acm-data.md) or using the [Exports API](/rest/api/cost-management/exports).

To learn more about how to properly call the API and ingest usage details at scale, see [Retrieve large datasets with exports](../costs/ingest-azure-usage-at-scale.md).

## Generate Detailed Cost Report API

Consider using the [Generate Detailed Cost Report API-UNPUBLISHED](../index.yml) if you have a small cost data set. If you have a large amount of cost data, you should request the smallest amount of usage data as possible for a period. To do so, specify either a small time range or use a filter in your request. For example, in a scenario where you need three years of cost data, the API does better when you make multiple calls for different time ranges rather than with a single call. From there, you can load the data into Excel for further analysis.

To learn more about how to properly call the [Generate Detailed Cost Report API-UNPUBLISHED](../index.yml), see [Get small usage data sets on demand](get-small-usage-datasets-on-demand.md).

Please note that the [Generate Detailed Cost Report API-UNPUBLISHED](../index.yml); is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, pay-as-you-go or Visual Studio customer, see [Get usage details as a legacy customer](get-usage-details-legacy-customer.md).

## Power BI

Power BI is another solution that's used to work with Usage Details data. The following solutions are available:

- Azure Cost Management Template App: - If you're an Enterprise Agreement or Microsoft Customer Agreement customer, you can use the Power BI template app to analyze costs for your billing account. It includes predefined reports that are built on top of the Usage Details dataset, among others. For more information, see [Analyze Azure costs with the Power BI template app](../costs/analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- Azure Cost Management Connector: - If you want to analyze your data daily, you can use the [Power BI data connector](/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

## Azure portal download

Only [download your usage from the Azure portal](../understand/download-azure-daily-usage.md) if you have a small usage details dataset that is capable of being loaded in Excel. Usage files that are larger than 1 or 2 GB may take a very long time to generate on demand from the Azure portal. They'll take longer to transfer over a network to your local computer. We recommend using one of the above solutions if you have a large monthly usage dataset.

## Next steps

- Get an overview of [how to ingest usage data](automation-ingest-usage-details-overview.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- [Understand usage details fields](understand-usage-details-fields.md).
- Learn how to [get small usage datasets on demand](get-small-usage-datasets-on-demand.md).