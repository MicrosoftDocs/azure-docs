---
title: Get Azure usage details as a legacy customer
description: This article explains how you get usage data if you're a legacy customer.
author: bandersmsft
ms.author: banders
ms.date: 05/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Get usage details as a legacy customer

If you have an MSDN, pay-as-you-go, or Visual Studio Azure subscription, we recommend that you use [Exports](../costs/tutorial-export-acm-data.md) or the [Exports API](../costs/ingest-azure-usage-at-scale.md) to get usage details data. The [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml)  isn't supported for your subscription type yet.

If you need to download small datasets and you don't want to use Azure Storage, you can also use the Consumption Usage Details API. Instructions about how to use the API are below. The API is deprecated. The date that the API will be turned off is still being determined.

## Example Consumption Usage Details API requests

The following example requests are used by Microsoft customers to address common scenarios.

### Get usage details for a scope during a specific date range

The data that's returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. The call to use varies by your subscription type.

For legacy customers, use the following call.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20'2020-02-01'%20and%20properties%2FusageEnd%20le%20'2020-02-29'&$top=1000&api-version=2019-10-01
```
### Get amortized cost details

If you need actual costs to show purchases as they're accrued, change the `metric` to `ActualCost` in the following request. To use amortized and actual costs, you must use version `2019-04-01-preview` or later.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&$filter=properties/usageStart+ge+'2019-04-01'+AND+properties/usageEnd+le+'2019-04-30'&api-version=2019-04-01-preview
```
## Next steps

- Read the [Ingest usage details data](automation-ingest-usage-details-overview.md) article.
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
- [Understand usage details fields](understand-usage-details-fields.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.