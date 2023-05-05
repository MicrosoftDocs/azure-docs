---
title: Migrate from the EA Reserved Instance Recommendations API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Recommendations API.
author: bandersmsft
ms.author: banders
ms.date: 07/15/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Migrate from EA Reserved Instance Recommendations API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance recommendations need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

## Assign permissions to an SPN to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

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
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-10-01 
```

#### Response body changes

Recommendations for Shared and Single scopes are combined into one API.

Old response:

```json
[{
    "subscriptionId": "1111111-1111-1111-1111-111111111111",
    "lookBackPeriod": "Last7Days",
    "meterId": "2e3c2132-1398-43d2-ad45-1d77f6574933",
    "skuName": "Standard_DS1_v2",
    "term": "P1Y",
    "region": "westus",
    "costWithNoRI": 186.27634908960002,
    "recommendedQuantity": 9,
    "totalCostWithRI": 143.12931642978083,
    "netSavings": 43.147032659819189,
    "firstUsageDate": "2018-02-19T00:00:00"
}
]
```

New response:

```json
{
  "value": [
    {
      "id": "billingAccount/123456/providers/Microsoft.Consumption/reservationRecommendations/00000000-0000-0000-0000-000000000000",
      "name": "00000000-0000-0000-0000-000000000000",
      "type": "Microsoft.Consumption/reservationRecommendations",
      "location": "westus",
      "sku": "Standard_DS1_v2",
      "kind": "legacy",
      "properties": {
        "meterId": "00000000-0000-0000-0000-000000000000",
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

## Next steps

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.