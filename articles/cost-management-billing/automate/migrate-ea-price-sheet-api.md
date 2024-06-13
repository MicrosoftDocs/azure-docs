---
title: Migrate from the EA Price Sheet API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Price Sheet API.
author: bandersmsft
ms.author: banders
ms.date: 04/23/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Price Sheet API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to get their price sheet need to migrate to a replacement Azure Resource Manager API. The following instructions help you  migrate and they also describe any contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a service principal (SPN) with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the Price Sheet API

The Price Sheet API generates the price sheet asynchronously and produces a file that you download.

Use the following request URIs when calling the new Price Sheet API:

#### Supported requests

You can call the API using the following scope:

Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

[Download by billing account for the specified billing period](/rest/api/cost-management/price-sheet/download-by-billing-account)

```HTTP
POST https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingPeriods/{billingPeriodName}/providers/Microsoft.CostManagement/pricesheets/default/download?api-version=2023-11-01
```

The POST request returns a location to poll the report generation status as outlined in the following response:

### Sample response

Status code: 202

```http
Location: https://management.azure.com/providers/Microsoft.Billing/billingAccounts/0000000/providers/Microsoft.CostManagement/operationResults/00000000-0000-0000-0000-000000000000?api-version=2023-09-01
Retry-After: 60
```

Status code: 200

```json
{
  "status": "Completed",
  "properties": {
    "downloadUrl": "https://myaccount.blob.core.windows.net/?restype=service&comp=properties&sv=2015-04-05&ss=bf&srt=s&st=2015-04-29T22%3A18%3A26Z&se=2015-04-30T02%3A23%3A26Z&sr=b&sp=rw&spr=https&sig=G%2TEST%4B",
    "validTill": "2023-09-30T17:32:28Z"
  }
}
```

### Sample request to poll report generation status

```HTTP
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/0000000/providers/Microsoft.CostManagement/operationResults/00000000-0000-0000-0000-000000000000?api-version=2023-09-01
```

### Response body changes

```json
[
        {
              "id": "enrollments/57354989/billingperiods/201601/products/343/pricesheets",
              "billingPeriodId": "201704",
            "meterId": "dc210ecb-97e8-4522-8134-2385494233c0",
              "meterName": "A1 VM",
              "unitOfMeasure": "100 Hours",
              "includedQuantity": 0,
              "partNumber": "N7H-00015",
              "unitPrice": 0.00,
              "currencyCode": "USD"
        },
        {
              "id": "enrollments/57354989/billingperiods/201601/products/2884/pricesheets",
              "billingPeriodId": "201404",
            "meterId": "dc210ecb-97e8-4522-8134-5385494233c0",
              "meterName": "Locally Redundant Storage Premium Storage - Snapshots - AU East",
              "unitOfMeasure": "100 GB",
              "includedQuantity": 0,
              "partNumber": "N9H-00402",
              "unitPrice": 0.00,
              "currencyCode": "USD"
        },
        ...
]
```

### New response changes

The price sheet properties are as follows:

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| basePrice | string | The unit price at the time the customer signs on or the unit price at the time of service meter GA launch if it is after sign-on.<br><br>It applies to Enterprise Agreement users |
| currencyCode | string | Currency in which the Enterprise Agreement was signed |
| effectiveEndDate | string | Effective end date of the Price Sheet billing period |
| effectiveStartDate | string | Effective start date of the Price Sheet billing period |
| enrollmentNumber | string | Unique identifier for the EA billing account. |
| includedQuantity | string | Quantities of a specific service to which an EA customer is entitled to consume without incremental charges. |
| marketPrice | string | The current list price for a given product or service. This price is without any negotiations and is based on your Microsoft Agreement type.<br><br>For PriceType Consumption, market price is reflected as the pay-as-you-go price.<br><br>For PriceType Savings Plan, market price reflects the Savings plan benefit on top of pay-as-you-go price for the corresponding commitment term.<br><br>For PriceType ReservedInstance, market price reflects the total price of the one or three-year commitment.<br><br>Note: For EA customers with no negotiations, market price might appear rounded to a different decimal precision than unit price. |
| meterCategory | string | Name of the classification category for the meter. For example, Cloud services, Networking, etc. |
| meterId | string | Unique identifier of the meter |
| meterName | string | Name of the meter. The meter represents the deployable resource of an Azure service. |
| meterRegion | string | Name of the Azure region where the meter for the service is available. |
| meterSubCategory | string | Name of the meter subclassification category. |
| meterType | string | Name of the meter type |
| partNumber | string | Part number associated with the meter |
| priceType | string | Price type for a product. For example, an Azure resource with a pay-as-you-go rate with priceType as Consumption. Other price types include ReservedInstance and Savings Plan. |
| product | string | Name of the product accruing the charges. |
| productId | string | Unique identifier for the product whose meter is consumed. |
| serviceFamily | number | Type of Azure service. For example, Compute, Analytics, and Security. |
| skuId | string | Unique identifier of the SKU |
| term | string | Term length for Azure Savings Plan or Reservation term – one year or three years (P1Y or P3Y) |
| unitOfMeasure | string | How usage is measured for the service |
| unitPrice | string | The per-unit price at the time of billing for a given product or service, inclusive of any negotiated discounts on top of the market price.<br><br>For PriceType ReservedInstance, unit price reflects the total cost of the one or three-year commitment including discounts.<br><br>Note: The unit price isn't the same as the effective price in usage details downloads when services have differential prices across tiers.<br><br>If services are multi-tiered pricing, the effective price is a blended rate across the tiers and doesn't show a tier-specific unit price. The blended price or effective price is the net price for the consumed quantity spanning across the multiple tiers (where each tier has a specific unit price). |

## Related content

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.