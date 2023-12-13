---
title: Migrate from the EA Reserved Instance Usage Summary API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Usage Summary API.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Reserved Instance Usage Summary API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance usage summaries need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

## Assign permissions to an SPN to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

### Call the Reserved Instance Usage Summary API

Use the following request URIs to call the new Reservation Summaries API.

#### Supported requests

Call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

[Get Reservation Summary Daily](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid)

```http
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2019-10-01 
```

[Get Reservation Summary Monthly](/rest/api/consumption/reservationssummaries/list#reservationsummariesmonthlywithbillingaccountid)

```http
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2019-10-01 
```

#### Response body changes

Old response:

```json
[
     {
        "reservationOrderId": "00000000-0000-0000-0000-000000000000",
        "reservationId": "00000000-0000-0000-0000-000000000000",
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
        "reservationOrderId": "00000000-0000-0000-0000-000000000000",
        "reservationId": "00000000-0000-0000-0000-000000000000",
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

## Next steps

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.