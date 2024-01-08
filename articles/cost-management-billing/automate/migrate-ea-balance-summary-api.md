---
title: Migrate from EA Balance Summary API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Balance Summary API.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Balance Summary API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to get their balance summary need to migrate to a replacement Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

## Assign permissions to an SPN to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

### Call the Balance Summary API

Use the following request URIs when calling the new Balance Summary API. Your enrollment number should be used as the `billingAccountId`.

#### Supported requests

[Get for Enrollment](/rest/api/consumption/balances/getbybillingaccount)


```http
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/balances?api-version=2019-10-01
```

### Response body changes

Old response body:

```json
{
  "id": "enrollments/100/billingperiods/201507/balancesummaries",
  "billingPeriodId": 201507,
  "currencyCode": "USD",
  "beginningBalance": 0,
  "endingBalance": 1.1,
  "newPurchases": 1,
  "adjustments": 1.1,
  "utilized": 1.1,
  "serviceOverage": 1,
  "chargesBilledSeparately": 1,
  "totalOverage": 1,
  "totalUsage": 1.1,
  "azureMarketplaceServiceCharges": 1,
  "newPurchasesDetails": [
    {
      "name": "",
      "value": 1
    }
  ],
  "adjustmentDetails": [
    {
      "name": "Promo Credit",
      "value": 1.1
    },
    {
      "name": "SIE Credit",
      "value": 1
    }
  ]
}
```

New response body:

The same data is now available in the properties field of the new API response. There might be minor changes to the spelling on some of the field names.

```json
{
  "id": "/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/balances/balanceId1",
  "name": "balanceId1",
  "type": "Microsoft.Consumption/balances",
  "properties": {
    "currency": "USD  ",
    "beginningBalance": 3396469.19,
    "endingBalance": 2922371.02,
    "newPurchases": 0,
    "adjustments": 0,
    "utilized": 474098.17,
    "serviceOverage": 0,
    "chargesBilledSeparately": 0,
    "totalOverage": 0,
    "totalUsage": 474098.17,
    "azureMarketplaceServiceCharges": 609.82,
    "billingFrequency": "Month",
    "priceHidden": false,
    "newPurchasesDetails": [
      {
        "name": "Promo Purchase",
        "value": 1
      }
    ],
    "adjustmentDetails": [
      {
        "name": "Promo Credit",
        "value": 1.1
      },
      {
        "name": "SIE Credit",
        "value": 1
      }
    ]
  }
}
```

## Next steps

- Read the [Migrate from EA Reporting to ARM APIs – Overview](migrate-ea-reporting-arm-apis-overview.md) article.