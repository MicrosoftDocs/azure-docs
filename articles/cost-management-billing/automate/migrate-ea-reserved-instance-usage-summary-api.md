---
title: Migrate from the EA Reserved Instance Usage Summary API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Usage Summary API.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Reserved Instance Usage Summary API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance usage summaries need to migrate to a parity Azure Resource Manager API. The following instructions help you migrate and discuss any contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the Reserved Instance Usage Summary API

Use the following request URIs to call the new Reservation Summaries API.

#### Supported requests

Call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

[Get Reservation Summary Daily](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid)

```http
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2023-05-01 
```

[Get Reservation Summary Monthly](/rest/api/consumption/reservationssummaries/list#reservationsummariesmonthlywithbillingaccountid)

```http
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2023-05-01 
```

#### Response body changes

Old response:

```json
[
     {
        "reservationOrderId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
        "reservationId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
        "skuName": "Standard_F1s",
        "reservedHours": 24,
        "usageDate": "2018-05-01T00:00:00",
        "usedHours": 23,
        "minUtilizationPercentage": 0,
        "avgUtilizationPercentage": 95.83,
        "maxUtilizationPercentage": 100
    }
]
```

New response:

```json
{
  "value": [
    {
      "id": "/providers/Microsoft.Billing/billingAccounts/12345/providers/Microsoft.Consumption/reservationSummaries/reservationSummaries_Id1",
      "name": "reservationSummaries_Id1",
      "type": "Microsoft.Consumption/reservationSummaries",
      "tags": null,
      "properties": {
        "reservationOrderId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
        "reservationId": "bbbbbbbb-1111-2222-3333-cccccccccccc",
        "skuName": "Standard_B1s",
        "reservedHours": 720,
        "usageDate": "2018-09-01T00:00:00-07:00",
        "usedHours": 0,
        "minUtilizationPercentage": 0,
        "avgUtilizationPercentage": 0,
        "maxUtilizationPercentage": 0
      }
    }
  ]
}
```

## Related content

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.