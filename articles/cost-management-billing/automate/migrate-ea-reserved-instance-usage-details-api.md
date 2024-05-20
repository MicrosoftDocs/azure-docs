---
title: Migrate from the EA Reserved Instance Usage Details API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Usage Details API.
author: bandersmsft
ms.author: banders
ms.date: 04/23/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Reserved Instance Usage Details API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance usage details need to migrate to a parity Azure Resource Manager API. The following instructions help you migrate and discuss any contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the Reserved instance usage details API

Microsoft isn't updating the older synchronous-based Reservation Details APIs. We recommend at you move to the newer SPN-supported asynchronous API call pattern as a part of the migration. Asynchronous requests better handle large amounts of data and reduce timeout errors.

#### Supported requests

Use the following request URIs when calling the new Asynchronous Reservation Details API. Your enrollment number should be used as the billingAccountId. You can call the API with the following scope:

Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

[Generate report by billing account ID](/rest/api/cost-management/generate-reservation-details-report/by-billing-account-id)

#### Sample request to generate a reservation details report

```http
POST https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/generateReservationDetailsReport?startDate={startDate}&endDate={endDate}&api-version=2023-11-01 
```

The POST request returns a location to poll the report generation status as outlined in the following response:

#### Sample response

Status code 202

```http
Location: https://management.azure.com/providers/Microsoft.Billing/billingAccounts/9845612/providers/Microsoft.CostManagement/reservationDetailsOperationResults/cf9f95c9-af6b-41dd-a622-e6f4fc60c3ee?api-version=2023-11-01
Retry-After: 60
```

Status code 200

```json
{
  "status": "Completed",
  "properties": {
    "reportUrl": "https://storage.blob.core.windows.net/details/20200911/00000000-0000-0000-0000-000000000000?sv=2016-05-31&sr=b&sig=jep8HT2aphfUkyERRZa5LRfd9RPzjXbzB%2F9TNiQ",
    "validUntil": "2020-09-12T02:56:55.5021869Z"
  }
}
```

#### Sample request to poll report generation status

```http
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/reservationDetailsOperationResults/{operationId}?api-version=2023-11-01 
```

#### Sample poll response

```json
{
  "status": "Completed",
  "properties": {
    "reportUrl": "https://storage.blob.core.windows.net/details/20200911/00000000-0000-0000-0000-000000000000?sv=2016-05-31&sr=b&sig=jep8HT2aphfUkyERRZa5LRfd9RPzjXbzB%2F9TNiQ",
    "validUntil": "2020-09-12T02:56:55.5021869Z"
  }
}
```

#### Response body changes

The following information is an example of the response of the older synchronous based Reservation Details API.

Old response:

```json
{
    "reservationOrderId": "00000000-0000-0000-0000-000000000000",
    "reservationId": "00000000-0000-0000-0000-000000000000",
    "usageDate": "2018-02-01T00:00:00",
    "skuName": "Standard_F2s",
    "instanceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/resourvegroup1/providers/microsoft.compute/virtualmachines/VM1",
    "totalReservedQuantity": 18.000000000000000,
    "reservedHours": 432.000000000000000,
    "usedHours": 400.000000000000000
}
```

New response:

The new API creates a CSV file for you. See the following file fields.

| Old property | New property | Notes |
| --- | --- | --- |
| | InstanceFlexibilityGroup | The new instance size flexibility property. |
| | InstanceFlexibilityRatio | The new instance size flexibility property. |
| instanceId | InstanceName |  |
| | Kind | It's a new property. Value is `None`, `Reservation`, or `IncludedQuantity`. |
| reservationId | ReservationId |  |
| reservationOrderId | ReservationOrderId |  |
| reservedHours | ReservedHours |  |
| skuName | SkuName |  |
| totalReservedQuantity | TotalReservedQuantity |  |
| usageDate | UsageDate |  |
| usedHours | UsedHours |  |

## Related content

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.