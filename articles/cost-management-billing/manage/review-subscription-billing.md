---
title: Review Azure subscription billing data with REST API
description: Learn how to use the Cost Details API to review subscription billing details. You can use this asynchronous API to get detailed cost and usage data.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: article
ms.date: 07/28/2025
ms.author: vikdesai
# Customer intent: As an administrator or developer, I want to use REST APIs to review subscription billing data for a specified period.
---

# Review subscription billing using REST APIs

Cost Management APIs help you review and manage your Azure costs.

The Cost Details API, in particular, helps you review and manage your Azure costs by providing detailed, unaggregated cost and usage data.

This asynchronous API allows you to generate and download cost reports for your subscription.

In this article, you learn to use the Cost Details API to return subscription billing details for a given date range.

> [!TIP]
> This REST API is ideal for automation scenarios where you need to programmatically retrieve cost data on a regular basis. You can integrate it into scripts, applications, or automated workflows to pull cost reports for analysis, budgeting, or compliance reporting.

> [!IMPORTANT]
> The Cost Details API is asynchronous and report-based. You submit a request to generate a downloadable file (report), poll for its completion, and then download the resulting file from a secure URL.

## How the Cost Details API works

The Cost Details API uses an asynchronous workflow:

1. **Create a report**: Submit a POST request to generate a Cost Details report for your subscription
2. **Poll for status**: Check the operation status until the report is complete
3. **Download the report**: Use the provided download URL to get the CSV file with your cost data

> [!NOTE]
> The API supports both **ActualCost** and **AmortizedCost** metrics. ActualCost shows charges as they were billed, while AmortizedCost spreads reservation and savings plans purchases across their term and reallocates costs to the resources that used the reservation or savings plan. For example, a 1-year reservation costing $365 will appear in ActualCost as a single charge on the purchase date. In AmortizedCost, that same $365 is spread out as a daily $1.00 charge across the usage that benefits from the reservation.

## Step 1: Create a report

Submit a POST request to start report generation for your subscription scope:

```http
POST https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.CostManagement/generateCostDetailsReport?api-version=2025-03-01
Content-Type: application/json
Authorization: Bearer {access-token}

{
  "metric": "ActualCost",
  "timePeriod": {
    "start": "2025-07-01",
    "end": "2025-07-15"
  }
}
```

## Step 2: Poll for report status

The initial request returns a `Location` header. Use this URL to check the report status:

```http
GET https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.CostManagement/costDetailsOperationStatus/{operationId}?api-version=2025-03-01
Authorization: Bearer {access-token}
```

## Step 3: Download the report

When the response is "200 - Succeeded" or the **status** field is "Completed", the response includes a `blobLink` for downloading the CSV file.

## Request parameters

The `{subscriptionID}` parameter is required and identifies the target subscription.

The request body supports the following parameters:

- **metric** - The type of report requested. Can be either `ActualCost` or `AmortizedCost`. If not specified, defaults to `ActualCost`.
- **timePeriod** - The requested date range for your data. Specify `start` and `end` dates in YYYY-MM-DD format. Can't be used alongside invoiceId or billingPeriod parameters.
- **invoiceId** - The requested invoice for your data. This parameter is supported for Microsoft Customer Agreement customers at the Billing Profile or Customer scope. Can't be used alongside billingPeriod or timePeriod parameters.
- **billingPeriod** - The requested billing period for your data. This parameter is supported for Enterprise Agreement customers. Use the YearMonth format (for example, 202408). Can't be used alongside invoiceId or timePeriod parameters.

> [!NOTE]
> If none of the timePeriod, invoiceId, or billingPeriod parameters are provided in the request body, the API returns the current month's cost.

The following headers are required:

|Request header|Description|
|--------------------|-----------------|
|*Content-Type:*|Required. Set to `application/json`.|
|*Authorization:*|Required. Set to a valid `Bearer` [access token](/rest/api/azure/#authorization-code-grant-interactive-clients). |

## Response

### Initial response (HTTP 202 Accepted)

The initial POST request returns status code 202 (Accepted) with response headers:

| Name | Type | Description |
| --- | --- | --- |
| Location | String | URL to check the status of the asynchronous operation |
| Retry-After | Integer | Expected time in seconds for the report to be generated |

### Polling response (HTTP 200 OK)

When the report is complete, the polling endpoint returns status code 200 (OK) with the report details:

```json
{
  "id": "subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.CostManagement/operationResults/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
  "name": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
  "status": "Completed",
  "manifest": {
    "manifestVersion": "2025-05-01",
    "dataFormat": "Csv",
    "blobCount": 1,
    "byteCount": 160769,
    "compressData": false,
    "requestContext": {
      "requestScope": "subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "requestBody": {
        "metric": "ActualCost",
        "timePeriod": {
          "start": "2025-07-01",
          "end": "2025-07-15"
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
  "validTill": "2025-07-28T08:08:46.1973252Z"
}
```

### Key response fields

|Response property|Description|
|----------------|----------|
|**status** | Status of the report generation (InProgress, Completed, Failed) |
|**dataFormat** | Format of the generated report (CSV) |
|**blobCount** | Number of blob files in the report dataset |
|**byteCount** | Total size of the report dataset in bytes |
|**blobLink** | Download URL for the Cost Details CSV file |
|**validTill** | Expiration date/time for the download URL |

## Cost Details file fields

The downloaded CSV file contains detailed cost and usage data with the following key fields:

|Field|Description|
|----------------|----------|
|**Date** | The usage or purchase date of the charge |
|**SubscriptionId** | Unique identifier for the Azure subscription |
|**SubscriptionName** | Name of the Azure subscription |
|**ResourceGroup** | Name of the resource group the resource is in |
|**ResourceName** | Name of the resource |
|**ResourceId** | Unique identifier of the Azure Resource Manager resource |
|**MeterCategory** | Name of the classification category for the meter (for example, Cloud services, Networking) |
|**MeterName** | The name of the meter |
|**Quantity** | The number of units consumed by a product or service |
|**UnitOfMeasure** | The unit of measure for billing for the service |
|**CostInBillingCurrency** | Cost of the charge in the billing currency before credits or taxes |
|**BillingCurrency** | Currency associated with the billing account |
|**ChargeType** | Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund) |
|**PricingModel** | Identifier that indicates how the meter is priced (OnDemand, Reservation, Spot, SavingsPlan) |

For a complete list of all fields and their descriptions, see [Understand cost details fields](../automate/understand-usage-details-fields.md).

## Best practices

- **Request frequency**: Generate reports at most once per day for a given scope and date range. Cost data is refreshed every four hours.
- **Date range**: For large datasets, limit the date range (for example, generate daily or weekly reports) to keep file sizes manageable.
- **Data retention**: Download and store reports promptly. The download URL expires after a short period (typically one hour).

## Error handling

Other status codes indicate error conditions. The response object explains why the request failed:

```json
{
  "error": [
    {
      "code": "Error type.",
      "message": "Error response describing why the operation failed."
    }
  ]
}
```

## Next steps

- [Get started with Azure REST API](/rest/api/azure/)
- [Learn more about the Cost Details API](/rest/api/cost-management/generate-cost-details-report)
- [Get small cost datasets on demand](../automate/get-small-usage-datasets-on-demand.md)
- [Understand Cost Details fields](../automate/understand-usage-details-fields.md)