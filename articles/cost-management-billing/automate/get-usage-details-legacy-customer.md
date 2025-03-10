---
title: Get Azure cost details for a pay-as-you go subscription
titleSuffix: Microsoft Cost Management
description: This article explains how you get cost data if you have a MOSP pay-as-you-go subscription.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Get cost details for a pay-as-you-go subscription

If your subscription is through Microsoft Online Service Program (MOSP) pay-as-you-go, or Visual Studio, we suggest using [Exports](../costs/tutorial-export-acm-data.md) or the [Exports API](../costs/ingest-azure-usage-at-scale.md) to access detailed cost data, previously referred to as usage details. The [Cost Details](/rest/api/cost-management/generate-cost-details-report) API report isn't supported for your subscription type yet.

If you need to download small datasets and you don't want to use Azure Storage, you can also use the Consumption Usage Details API. To use the API, read the following instructions.

> [!NOTE]
> The API is deprecated for all customers except those with pay-as-you-go and Visual Studio subscriptions. If you're an EA or MCA customer don't use this API.

The exact date for discontinuing the API is undetermined. Before the Consumption Usage Details API is deprecated, the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API will get updates to support both pay-as-you-go and Visual Studio subscriptions.

## Example Consumption Usage Details API requests

The following example requests are used by Microsoft customers to address common scenarios.

### Get usage details for a scope during a specific date range

The data that gets returned by the request corresponds to the date when the data got received by the billing system. It might include costs from multiple invoices. The call to use varies by your subscription type.

For pay-as-you-go subscriptions, use the following call.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20'2020-02-01'%20and%20properties%2FusageEnd%20le%20'2020-02-29'&$top=1000&api-version=2019-10-01
```
### Get amortized cost details

If you need actual costs to show purchases as they're accrued, change the `metric` to `ActualCost` in the following request. To use amortized and actual costs, you must use version `2019-04-01-preview` or later.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&$filter=properties/usageStart+ge+'2019-04-01'+AND+properties/usageEnd+le+'2019-04-30'&api-version=2019-04-01-preview
```

## Related content

- Read the [Ingest cost details data](automation-ingest-usage-details-overview.md) article.
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
- [Understand cost details fields](understand-usage-details-fields.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
