---
title: Migrate from the EA Reserved Instance Recommendations API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Recommendations API.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Reserved Instance Recommendations API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance recommendations need to migrate to a parity Azure Resource Manager API. The following instructions help you migrate and describe any contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## Assign permissions to a service principle to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the reserved instance recommendations API

Use the following request URIs to call the new Reservation Recommendations API.

#### Supported requests

Call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`
- Subscription: `subscriptions/{subscriptionId}`
- Resource Groups: `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`

[Get Recommendations](/rest/api/consumption/reservationrecommendations/list)

Both the shared and the single scope recommendations are available through this API. You can also filter on the scope as an optional API parameter.

```http
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Consumption/reservationRecommendations?api-version=2023-05-01 
```

#### Response body changes

In the new API, recommendations for Shared and Single scopes are combined into one API.

Old response for Shared scope:

```json
{
        "lookBackPeriod": "Last60Days",
        "meterId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
        "skuName": "Standard_B1s",
        "term": "P3Y",
        "region": "eastus",
        "costWithNoRI": 39.773316464000011,
        "recommendedQuantity": 2,
        "totalCostWithRI": 22.502541385887369,
        "netSavings": 17.270775078112642,
        "firstUsageDate": "2024-02-23T00:00:00",
        "resourceType": "virtualmachines",
        "instanceFlexibilityRatio": 2.0,
        "instanceFlexibilityGroup": "BS Series",
        "normalizedSize": "Standard_B1ls",
        "recommendedQuantityNormalized": 4.0,
        "skuProperties": [
          {
            "name": "Cores",
            "value": "1"
          },
          {
            "name": "Ram",
            "value": "1"
          }
        ]
    },
```

Old response for Single scope:

```json
{
      "subscriptionId": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "lookBackPeriod": "Last60Days",
      "meterId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
      "skuName": "Standard_B1s",
      "term": "P3Y",
      "region": "eastus",
      "costWithNoRI": 19.892601567999996,
      "recommendedQuantity": 1,
      "totalCostWithRI": 11.252968788943683,
      "netSavings": 8.6396327790563134,
      "firstUsageDate": "2024-02-23T00:00:00",
      "resourceType": "virtualmachines",
      "instanceFlexibilityRatio": 2.0,
      "instanceFlexibilityGroup": "BS Series",
      "normalizedSize": "Standard_B1ls",
      "recommendedQuantityNormalized": 2.0,
      "skuProperties": [
        {
          "name": "Cores",
          "value": "1"
        },
        {
          "name": "Ram",
          "value": "1"
        }
      ]
}
```

New response:

```json
{
  "value": [
    {
      "id": "billingAccount/123456/providers/Microsoft.Consumption/reservationRecommendations/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "name": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
      "type": "Microsoft.Consumption/reservationRecommendations",
      "location": "westus",
      "sku": "Standard_DS1_v2",
      "kind": "legacy",
      "properties": {
        "meterId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
        "term": "P1Y",
        "costWithNoReservedInstances": 12.0785105,
        "recommendedQuantity": 1,
        "totalCostWithReservedInstances": 11.4899644807748,
        "netSavings": 0.588546019225182,
        "firstUsageDate": "2019-07-07T00:00:00-07:00",
        "scope": "Shared",
        "lookBackPeriod": "Last7Days",
        "instanceFlexibilityRatio": 1,
        "instanceFlexibilityGroup": "DSv2 Series",
        "normalizedSize": "Standard_DS1_v2",
        "recommendedQuantityNormalized": 1,
        "skuProperties": [
          {
            "name": "Cores",
            "value": "1"
          },
          {
            "name": "Ram",
            "value": "1"
          }
        ]
      }
    },
   ]
}
```

## Related content

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.