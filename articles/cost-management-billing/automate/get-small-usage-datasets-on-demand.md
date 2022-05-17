---
title: Get small usage datasets on demand | Azure
description: The article explains how you can use the Cost Details API to get raw, unaggregated cost data that corresponds to your Azure bill.
author: bandersmsft
ms.author: banders
ms.date: 10/22/2021
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Get small usage datasets on demand

Use the [Cost Details API-UNPUBLISHED](../index.yml) to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if want to analyze smaller cost data sets. However, you should use Exports for ongoing data ingestion workloads and for the download of larger datasets.

If you want to get large amounts of exported data regularly, see [Retrieve large cost datasets recurringly with exports](../costs/ingest-azure-usage-at-scale.md).

To learn more about the data in usage details, see [Ingest usage details data](automation-ingest-usage-details-overview.md).

The [Cost Details API-UNPUBLISHED](../index.yml) is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, Pay-As-You-Go or Visual Studio customer, please see [Get usage details as a legacy customer](get-usage-details-legacy-customer.md).

## Cost Details API best practices

Microsoft recommends the following best practices as you use the Cost Details API.

### Request schedule

If you want to get the latest cost data, we recommend you query at most once per day. Reports are refreshed every four hours. If you call more frequently than this you will receive identical data. Once you download your cost data for historical invoices, the charges will not change unless you are explicitly notified. We recommend caching your cost data in a queryable store on your side to prevent repeated calls for identical data.

### Chunk your requests 

Chunk your calls into small date ranges to get more manageable files that you can download over the network. For example, we recommend chunking by day or by week if you have a large Azure usage file month-to-month. If you have scopes with a large amount of usage data (for example a Billing Account), consider placing multiple calls to child scopes so you get more manageable files that you can download. For more information about Cost Management scopes, see [Understand and work with scopes](../costs/understand-work-scopes.md). After you download the data, use Excel to analyze data further with filters and pivot tables.

If your dataset is more than two GB month-to-month, consider using [Exports](../costs/tutorial-export-acm-data.md) as a more scalable solution.

### Latency and rate limits

On demand calls to the API are rate limited. The time it takes to generate your usage details file is directly correlated with the amount of data in the file. To understand the expected amount of time before your file becomes available for download, you can use the `retry-after` header in the API response.

For more information, see [Cost Management API latency and rate limits](api-latency-rate-limits.md).

## Example Cost Details API requests

The following example requests are used by Microsoft customers to address common scenarios. 

### Get Usage Details for a scope during specific date range

The data that's returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. Note that it is an Asynchronous API. As such, you place an initial call to request your report and receive a polling link in the response header. From there, you can poll the link provided until the report is available for you.

Use the `retry-after` header in the API response to dictate when to poll the API next. The header provides an estimated minimum time that your report will take to generate.

To learn more about the API contract, see [Cost Details API-UNPUBLISHED](../index.yml).

### Actual cost versus amortized cost

You can control whether you would like to see an actual cost or amortized cost report by changing the value used for the metric field in the initial request body. The available metric values are `ActualCost` or `AmortizedCost`.

Amortized cost breaks down your reservation purchases into daily chunks and spreads them over the duration of the reservation term. For example, instead of seeing a $365 purchase on January 1, you'll see a $1.00 purchase every day from January 1 to December 31. In addition to basic amortization, the costs are also reallocated and associated by using the specific resources that used the reservation. For example, if the $1.00 daily charge was split between two virtual machines, you'd see two $0.50 charges for the day. If part of the reservation isn't utilized for the day, you'd see one $0.50 charge associated with the applicable virtual machine and another $0.50 charge with a charge type of `UnusedReservation`. Unused reservation costs are seen only when viewing amortized cost.

Because of the change in how costs are represented, it's important to note that actual cost and amortized cost views will show different total numbers. In general, the total cost of months over time for a reservation purchase will decrease when viewing amortized costs. The months following a reservation purchase will increase. Amortization is available only for reservation purchases and doesn't currently apply to Azure Marketplace purchases.

### Initial request to create report

```http
POST https://management.azure.com/{scope}/providers/Microsoft.CostManagement/generateDetailedCostReport?api-version=2021-10-01
```

Request body:

```json
{
    metric: ActualCost,
    timePeriod: {
        start: “2021-09-01”,
        end: “2021-09-05”
    }
}

```

`Response Status: 202 – Accepted` : Indicates that the request will be processed. Use the `Location` header to check the status.

Response headers:

| Name | Type | Format | Description |
| --- | --- | --- | --- |
| Location | String |  | The URL to check the result of the asynchronous operation. |
| Azure-Consumption-AsyncOperation | String |  | The URL to check the status of the asynchronous operation. |
| Azure-AsyncOperation | String |  | The URL to check the status of the asynchronous operation. |
| Retry-After | Integer | Int32 | The expected time for your report to be generated. Wait for this duration before polling again. |

Report polling request:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.CostManagement/operationStatus/{operationId}?api-version=2021-10-01
```

`Response Status 200 – Succeeded`: Indicates that the request has succeeded.

```JSON
{
    "id": "{scope}/providers/Microsoft.CostManagement/operationStatus/{operationId}",
    "name": "{operationId}",
    "status": "Completed",
    "startTime": "2021-09-23T18:17:52.8762706Z",
    "endTime": "2021-09-23T18:18:49.8498271Z",
    "properties": {
        "downloadUrl": "{downloadUrl},
        "validTill": "2021-09-24T06:20:19.9295378Z"
    },
    "error": {
        "code": 0,
        "message": null
    }
}
```

## Next steps

- Read the [Ingest usage details data](automation-ingest-usage-details-overview.md) article.
- Learn more about [usage details best practices](usage-details-best-practices.md).
- [Understand usage details fields](understand-usage-details-fields.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
