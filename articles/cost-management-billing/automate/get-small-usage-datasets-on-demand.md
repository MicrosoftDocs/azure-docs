---
title: Get small cost datasets on demand
titleSuffix: Microsoft Cost Management
description: The article explains how you can use the Cost Details API to get raw, unaggregated cost data that corresponds to your Azure bill.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Get small cost datasets on demand

Use the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if want to analyze smaller cost data sets of 2 GB (2 million rows) or less. However, you should use Exports for ongoing data ingestion workloads and for the download of larger datasets.

If you want to get large amounts of exported data regularly, see [Retrieve large cost datasets recurringly with exports](../costs/ingest-azure-usage-at-scale.md).

To learn more about the data in cost details (formerly referred to as *usage details*), see [Ingest cost details data](automation-ingest-usage-details-overview.md).

The [Cost Details](/rest/api/cost-management/generate-cost-details-report) report is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you're an MSDN, Pay-As-You-Go or Visual Studio customer, see [Get cost details for a pay-as-you-go subscription](get-usage-details-legacy-customer.md).

## Permissions

To use the Cost Details API, you need read only permissions for supported features and scopes.

>[!NOTE]
> The [Cost Details API](/rest/api/cost-management/generate-cost-details-report/create-operation) doesn't support management groups for either EA or MCA customers.

For more information, see: 

- [Azure RBAC scopes - role permissions for feature behavior](../costs/understand-work-scopes.md#feature-behavior-for-each-role)
- [Enterprise Agreement scopes - role permissions for feature behavior](../costs/understand-work-scopes.md#feature-behavior-for-each-role-1)
- [Microsoft Customer Agreement scopes - role permissions for feature behavior](../costs/understand-work-scopes.md#feature-behavior-for-each-role-2)

## Cost Details API best practices

Microsoft recommends the following best practices as you use the Cost Details API.

### Request schedule

If you want to get the latest cost data, we recommend you query at most once per day. Reports are refreshed every four hours. If you call more frequently, you'll receive identical data. Once you download your cost data for historical invoices, the charges won't change unless you're explicitly notified. We recommend caching your cost data in a queryable store on your side to prevent repeated calls for identical data.

### Chunk your requests 

Chunk your calls into small date ranges to get more manageable files that you can download over the network. For example, we recommend chunking by day or by week if you have a large Azure cost file month-to-month. If you have scopes with a large amount of cost data (for example a Billing Account), consider placing multiple calls to child scopes so you get more manageable files that you can download. For more information about Cost Management scopes, see [Understand and work with scopes](../costs/understand-work-scopes.md). After you download the data, use Excel to analyze data further with filters and pivot tables.

If your dataset is more than 2 GB (or roughly 2 million rows) month-to-month, consider using [Exports](../costs/tutorial-export-acm-data.md) as a more scalable solution.

### Latency and rate limits

On demand calls to the API are rate limited. The time it takes to generate your cost details file is directly correlated with the amount of data in the file. To understand the expected amount of time before your file becomes available for download, you can use the `retry-after` header in the API response.

<!-- For more information, see [Cost Management API latency and rate limits](api-latency-rate-limits.md). -->

### Supported dataset time ranges

The Cost Details API supports a maximum data set time range of one month per report. Historical data can be retrieved for up to 13 months back from the current date. If you're looking to seed a 13 month historical dataset, we recommend placing 13 calls for one month datasets going back 13 months.

## Example Cost Details API requests

The following example requests are used by Microsoft customers to address common scenarios. The data that's returned by the request corresponds to the date when the cost was received by the billing system. It might include costs from multiple invoices. It's an asynchronous API. As such, you place an initial call to request your report and receive a polling link in the response header. From there, you can poll the link provided until the report is available for you.

Use the `retry-after` header in the API response to dictate when to poll the API next. The header provides an estimated minimum time that your report will take to generate.

To learn more about the API contract, see [Cost Details](/rest/api/cost-management/generate-cost-details-report) API.

### Actual cost versus amortized cost

To control whether you would like to see an actual cost or amortized cost report, change the value used for the metric field in the initial request body. The available metric values are `ActualCost` or `AmortizedCost`.

Amortized cost breaks down your reservation purchases into daily chunks and spreads them over the duration of the reservation term. For example, instead of seeing a $365 purchase on January 1, you'll see a $1.00 purchase every day from January 1 to December 31. In addition to basic amortization, the costs are also reallocated and associated by using the specific resources that used the reservation. For example, if the $1.00 daily charge was split between two virtual machines, you'd see two $0.50 charges for the day. If part of the reservation isn't utilized for the day, you'd see one $0.50 charge associated with the applicable virtual machine and another $0.50 charge with a charge type of `UnusedReservation`. Unused reservation costs are seen only when viewing amortized cost.

Because of the change in how costs are represented, it's important to note that actual cost and amortized cost views will show different total numbers. In general, the total cost of months over time for a reservation purchase will decrease when viewing amortized costs. The months following a reservation purchase will increase. Amortization is available only for reservation purchases and doesn't currently apply to Azure Marketplace purchases.

### Initial request to create report

```http
POST https://management.azure.com/{scope}/providers/Microsoft.CostManagement/generateCostDetailsReport?api-version=2022-05-01
```

**Request body:**

An example request for an ActualCost dataset for a specified date range is provided below.

```json
{
  "metric": "ActualCost",
  "timePeriod": {
    "start": "2020-03-01",
    "end": "2020-03-15"
  }
}

```

Available *{scope}* options to build the proper URI are documented at [Identify the resource ID for a scope](../costs/understand-work-scopes.md#identify-the-resource-id-for-a-scope).

The available fields you can provide in the report request body are summarized below.

- **metric** - The type of report requested. It can be either ActualCost or AmortizedCost. Not required. If the field isn't specified, the API will default to an ActualCost report.
- **timePeriod** - The requested date range for your data. Not required. This parameter can't be used alongside either the invoiceId or billingPeriod parameters. If a timePeriod, invoiceId or billingPeriod parameter isn't provided in the request body the API will return the current month's cost.
- **invoiceId** - The requested invoice for your data. This parameter can only be used by Microsoft Customer Agreement customers. Additionally, it can only be used at the Billing Profile or Customer scope. This parameter can't be used alongside either the billingPeriod or timePeriod parameters. If a timePeriod, invoiceId or billingPeriod parameter isn't provided in the request body the API will return the current month's cost.
- **billingPeriod** - The requested billing period for your data. This parameter can be used only by Enterprise Agreement customers. Use the YearMonth format. For example, 202008. This parameter can't be used alongside either the invoiceId or timePeriod parameters. If a timePeriod, invoiceId or billingPeriod parameter isn't provided in the request body the API will return the current month's cost.

**API response:**

`Response Status: 202 – Accepted` : Indicates that the request will be processed. Use the `Location` header to check the status.

Response headers:

| Name | Type | Format | Description |
| --- | --- | --- | --- |
| Location | String |  | The URL to check the result of the asynchronous operation. |
| Retry-After | Integer | Int32 | The expected time for your report to be generated. Wait for this duration before polling again. |

### Report polling and download

Once you've requested to create a Cost Details report, poll for the report using the endpoint provided in the `location` header of the API response. An example polling request is below.

Report polling request:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.CostManagement/costDetailsOperationStatus/{operationId}?api-version=2022-05-01
```

`Response Status 200 – Succeeded`: Indicates that the request has succeeded.

```JSON
{
  "id": "subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.CostManagement/operationResults/00000000-0000-0000-0000-000000000000",
  "name": "00000000-0000-0000-0000-000000000000",
  "status": "Completed",
  "manifest": {
    "manifestVersion": "2022-05-01",
    "dataFormat": "Csv",
    "blobCount": 1,
    "byteCount": 160769,
    "compressData": false,
    "requestContext": {
      "requestScope": "subscriptions/00000000-0000-0000-0000-000000000000",
      "requestBody": {
        "metric": "ActualCost",
        "timePeriod": {
          "start": "2020-03-01",
          "end": "2020-03-15"
        }
      }
    },
    "blobs": [
      {
        "blobLink": "{downloadLink}",
        "byteCount": 32741
      }
    ]
  },
  "validTill": "2022-05-10T08:08:46.1973252Z"
}
```

A summary of the key fields in the API response is below:

- **manifestVersion** - The version of the manifest contract that is used in the response. At this time, the manifest version will remain the same for a given API version.
- **dataFormat** - CSV is the only supported file format provided by the API at this time.
- **blobCount** - Represents the number of individual data blobs present in the report dataset. It's important to note that this API may provide a partitioned dataset of more than one file in the response. Design your data pipelines to be able to handle partitioned files accordingly. Partitioning will allow you to be able to ingest larger datasets more quickly moving forward.
- **byteCount** - The total byte count of the report dataset across all partitions.
- **compressData** - Compression is always set to false for the first release. The API will support compression in the future, however.
- **requestContext** - The initial configuration requested for the report.
- **blobs** - A list of n blob files that together comprise the full report.
  - **blobLink** - The download URL of an individual blob partition.
  - **byteCount** - The byte count of the individual blob partition.
- **validTill** - The date at which the report will no longer be accessible.

## Next steps

- Read the [Ingest cost details data](automation-ingest-usage-details-overview.md) article.
- Learn more about [Choose a cost details solution](usage-details-best-practices.md).
- [Understand cost details fields](understand-usage-details-fields.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
