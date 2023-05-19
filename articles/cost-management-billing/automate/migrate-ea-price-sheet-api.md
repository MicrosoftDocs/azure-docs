---
title: Migrate from the EA Price Sheet API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Price Sheet API.
author: bandersmsft
ms.author: banders
ms.date: 04/05/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Migrate from EA Price Sheet API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to get their price sheet need to migrate to a replacement Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

## Assign permissions to an SPN to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

### Call the Price Sheet API

Use the following request URIs when calling the new Price Sheet API.

#### Supported requests

You can call the API using the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`
- Subscription: `subscriptions/{subscriptionId}`

[Get for current Billing Period](/rest/api/consumption/pricesheet/get)

```http
https://management.azure.com/{scope}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01 
```

[Get for specified Billing Period](/rest/api/consumption/pricesheet/getbybillingperiod)

```http
https://management.azure.com/{scope}/billingPeriods/{billingPeriodName}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01 
```

#### Response body changes

Old response:

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

New response:

Old data is now in the `pricesheets` field of the new API response. Meter details information is also provided.

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/pricesheets/default",
  "name": "default",
  "type": "Microsoft.Consumption/pricesheets",
  "properties": {
    "nextLink": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.consumption/pricesheets/default?api-version=2018-01-31&$skiptoken=AQAAAA%3D%3D&$expand=properties/pricesheets/meterDetails",
    "pricesheets": [
      {
        "billingPeriodId": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702",
        "meterId": "00000000-0000-0000-0000-000000000000",
        "unitOfMeasure": "100 Hours",
        "includedQuantity": 100,
        "partNumber": "XX-11110",
        "unitPrice": 0.00000,
        "currencyCode": "EUR",
        "offerId": "OfferId 1",
        "meterDetails": {
          "meterName": "Data Transfer Out (GB)",
          "meterCategory": "Networking",
          "unit": "GB",
          "meterLocation": "Zone 2",
          "totalIncludedQuantity": 0,
          "pretaxStandardRate": 0.000
        }
      }
    ]
  }
}
```

## Next steps

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.