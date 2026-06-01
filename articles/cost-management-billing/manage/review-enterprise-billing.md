---
title: Review Azure enterprise enrollment billing data with REST API
description: Learn how to use the Cost Details API to review enterprise enrollment billing information. You can use this asynchronous API to get detailed cost and usage data.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: article
ms.date: 07/28/2025
ms.author: vikdesai
---

# Review enterprise enrollment billing using REST APIs

Cost Management APIs help you review and manage your Azure costs.

The Cost Details API, in particular, helps you review and manage your Azure costs by providing detailed, unaggregated cost data.

This asynchronous API allows you to generate and download cost reports for your Enterprise Agreement (EA) billing accounts, departments, or enrollment accounts.

In this article, you learn to retrieve the billing information associated with EA billing accounts, departments, or enrollment accounts using the Cost Details API.

> [!TIP]
> This REST API is ideal for automation scenarios where you need to programmatically retrieve cost data on a regular basis. You can integrate it into scripts, applications, or automated workflows to pull cost reports for analysis, budgeting, or compliance reporting.

> [!IMPORTANT]
> The Cost Details API is asynchronous and report-based. You submit a request to generate a downloadable file (report), poll for its completion, and then download the resulting file from a secure URL.

## How the Cost Details API works

The Cost Details API uses an asynchronous workflow:

1. **Create a report**: Submit a POST request to generate a Cost Details report for your EA scope
2. **Poll for status**: Check the operation status until the report is complete
3. **Download the report**: Use the provided download URL to get the CSV file with your cost data

> [!NOTE]
> The API supports both **ActualCost** and **AmortizedCost** metrics. ActualCost shows charges as they were billed, while AmortizedCost spreads reservation and savings plans purchases across their term and reallocates costs to the resources that used the reservation or savings plan. For example, a 1-year reservation costing $365 will appear in ActualCost as a single charge on the purchase date. In AmortizedCost, that same $365 is spread out as a daily $1.00 charge across the usage that benefits from the reservation.

## Working with different EA scopes

The Cost Details API supports three EA scopes, each providing different levels of cost aggregation:

- **Billing account scope**: Cost details for the entire EA billing account
- **Department scope**: Cost details aggregated for all accounts in a specific department
- **Enrollment account scope**: Cost details for a specific account within an enrollment

## Step 1: Create a cost details report

Submit a POST request to generate a Cost Details report:

```http
POST https://management.azure.com/providers/Microsoft.Billing/{scope}/providers/Microsoft.CostManagement/generateCostDetailsReport?api-version=2025-03-01
Content-Type: application/json
Authorization: Bearer {access-token}

{
  "metric": "ActualCost",
  "timePeriod": {
    "start": "2025-07-01",
    "end": "2025-07-31"
  }
}
```

Where `{scope}` varies based on your desired scope:

- **Billing account scope**: `billingAccounts/{billingAccountId}`
- **Department scope**: `departments/{departmentId}`
- **Enrollment account scope**: `enrollmentAccounts/{enrollmentAccountId}`

## Step 2: Poll for report status

Check the operation status until the report is complete:

```http
GET https://management.azure.com/providers/Microsoft.Billing/{scope}/providers/Microsoft.CostManagement/costDetailsOperationStatus/{operationId}?api-version=2025-03-01
Authorization: Bearer {access-token}
```

Where `{scope}` uses the same values as in Step 1:

- **Billing account scope**: `billingAccounts/{billingAccountId}`
- **Department scope**: `departments/{departmentId}`
- **Enrollment account scope**: `enrollmentAccounts/{enrollmentAccountId}`

## Step 3: Download the report

When the report status shows "Completed," the response includes a `blobLink` for downloading the CSV file containing the cost details for your selected scope.

## Request parameters

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

When the report is complete, the polling endpoint returns status code 200 (OK) with the report details, including a `blobLink` for downloading the CSV file.

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

The downloaded CSV file contains detailed cost and usage data with key fields including:

- **Date** - The usage or purchase date of the charge
- **BillingAccountId** - Unique identifier for the EA billing account
- **InvoiceSectionId** - Unique identifier for the EA department (if applicable)
- **AccountId** - Unique identifier for the EA enrollment account
- **SubscriptionId** - Unique identifier for the Azure subscription
- **ResourceGroup** - Name of the resource group
- **CostInBillingCurrency** - Cost of the charge in the billing currency before credits or taxes
- **ChargeType** - Indicates whether the charge represents usage, a purchase, or a refund
- **PricingModel** - Identifier that indicates how the meter is priced

For a complete list of all fields and their descriptions, see [Understand cost details fields](../automate/understand-usage-details-fields.md).

## Best practices

- **Request frequency**: Generate reports at most once per day for a given scope and date range. Cost data is refreshed every four hours.
- **Date range**: For large datasets, limit the date range (for example, generate daily or weekly reports) to keep file sizes manageable.
- **Data retention**: Download and store reports promptly. The download URL expires after a short period (typically one hour).

## Next steps

- [Get started with Azure REST API](/rest/api/azure/)
- [Learn more about the Cost Details API](/rest/api/cost-management/generate-cost-details-report)
- [Get small cost datasets on demand](../automate/get-small-usage-datasets-on-demand.md)
- [Understand Cost Details fields](../automate/understand-usage-details-fields.md)