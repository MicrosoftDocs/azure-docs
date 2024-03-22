---
title: Tutorial - Seed a historical cost dataset with the Exports API
description: This tutorial helps your seed a historical cost dataset to visualize cost trends over time.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Tutorial: Seed a historical cost dataset with the Exports API

Large organizations often need to analyze their historical costs going back a year or more. Creating the dataset might be needed for targeted one-time inquiries or to set up reporting dashboards to visualize cost trends over time. In either case, you need a way to get the data reliably so that you can load it into a data store that you can query. After your historical cost dataset is seeded, your data store can then be updated as new costs come in so that your reporting is kept up to date. Historical costs rarely change and if so, you'll be notified. So we recommend that you refresh your historical costs no more than once a month.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Get a bearer token for your service principal
> * Format the request
> * Execute the requests in one-month chunks

## Prerequisites

You need proper permissions to successfully call the Exports API. We recommend using a Service Principal in automation scenarios.

- To learn more, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).
- To learn more about the specific permissions needed for the Exports API, see [Understand and work with scopes](../costs/understand-work-scopes.md).

Additionally, you'll need a way to query the API directly. For this tutorial, we recommend using [PostMan](https://www.postman.com/).

## Get a bearer token for your service principal

To learn how to get a bearer token with a service principal, see [Acquire an Access token](/rest/api/azure/#acquire-an-access-token).

## Format the request

See the following example request and create your own one-time data Export. The following example request creates a one-month Actual Cost dataset in the specified Azure storage account. We recommend that you request no more than one month's of data per report. If you have a large dataset every month, we recommend setting `partitionData = true` for your one-time export to split it into multiple files. For more information, see [File partitioning for large datasets](../costs/tutorial-export-acm-data.md#file-partitioning-for-large-datasets).

```http
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{enrollmentId}/providers/Microsoft.CostManagement/exports/{ExportName}?api-version=2021-10-01
```


**Request Headers**

```
Authorization: <YOUR BEARER TOKEN>
Accept: /*/
Content-Type: application/json
```

**Request Body**

```json
{
  "properties": {
    "definition": {
      "dataset": {
        "granularity": "Daily",
        "grouping": []
      },
      "timePeriod": {
        "from": "2021-09-01T00:00:00.000Z",
        "to": "2021-09-30T00:00:00.000Z"
      },
      "timeframe": "Custom",
      "type": "ActualCost"
    },
    "deliveryInfo": {
      "destination": {
        "container": "{containerName}",
        "rootFolderPath": "{folderName}",
        "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
      }
    },
    "format": "Csv",
    "partitionData": false
  }
}
```

## Create Exports in one-month chunks

We recommend creating one-time data exports in one month chunks. If you want to seed a one-year historical dataset, then you should execute 12 Exports API requests - one for each month. After you've seeded your historical dataset, you can then create a scheduled export to continue populating your cost data in Azure storage as your charges accrue over time.

## Run each Export

Now that you have created the Export for each month, you need to manually run each by calling the [Execute API](/rest/api/cost-management/exports/execute). An example request to the API is below.

```http
POST https://management.azure.com/{scope}/providers/Microsoft.CostManagement/exports/{exportName}/run?api-version=2021-10-01
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Get a bearer token for your service principal
> * Format the request
> * Execute the requests in one-month chunks

To learn more about cost details, see [ingest cost details data](automation-ingest-usage-details-overview.md).

To learn more about what data is available in the cost details dataset, see [Understand cost details data fields](understand-usage-details-fields.md).
