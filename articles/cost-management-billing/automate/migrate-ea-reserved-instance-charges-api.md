---
title: Migrate from the EA Reserved Instance Charges API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Reserved Instance Charges API.
author: bandersmsft
ms.author: banders
ms.date: 04/23/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Reserved Instance Charges API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance charges need to migrate to a parity Azure Resource Manager API. The following instructions help you migrate and discuss any contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the Reserved Instance Charges API

Use the following request URIs to call the new Reserved Instance Charges API.

#### Supported requests

[Get Reservation Charges by Date Range](/rest/api/consumption/reservationtransactions/list)

```http
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/reservationTransactions?$filter=properties/eventDate+ge+2020-05-20+AND+properties/eventDate+le+2020-05-30&api-version=2023-05-01 
```

#### Response body changes

Old response:

```json
[
    {
        "purchasingEnrollment": "string",
        "armSkuName": "Standard_F1s",
        "term": "P1Y",
        "region": "eastus",
        "PurchasingsubscriptionGuid": "00000000-0000-0000-0000-000000000000",
        "PurchasingsubscriptionName": "string",
        "accountName": "string",
        "accountOwnerEmail": "string",
        "departmentName": "string",
        "costCenter": "",
        "currentEnrollment": "string",
        "billingFrequency": "OneTime",
        "eventDate": "string",
        "reservationOrderId": "00000000-0000-0000-0000-000000000000",
        "description": "Standard_F1s eastus 1 Year",
        "eventType": "Purchase",
        "quantity": int,
        "amount": double,
        "currency": "string",
        "reservationOrderName": "string"
    },
]
```

New response:

```json
{
  "id": "/billingAccounts/123456/providers/Microsoft.Consumption/reservationtransactions/201909091919",
  "name": "201909091919",
  "type": "Microsoft.Consumption/reservationTransactions",
  "tags": [],
  "properties": {
    "eventDate": "2019-09-09T19:19:04Z",
    "reservationOrderId": "00000000-0000-0000-0000-000000000000",
    "description": "Standard_DS1_v2 westus 1 Year",
    "eventType": "Refund",
    "quantity": 1,
    "amount": -21,
    "currency": "USD",
    "reservationOrderName": "Transaction-DS1_v2",
    "purchasingEnrollment": "123456",
    "armSkuName": "Standard_DS1_v2",
    "term": "P1Y",
    "region": "westus",
    "purchasingSubscriptionGuid": "a838a8c3-a408-49e1-ac90-42cb95bff9b2",
    "purchasingSubscriptionName": "Infrastructure Subscription",
    "accountName": "Microsoft Infrastructure",
    "accountOwnerEmail": "admin@microsoft.com",
    "departmentName": "Unassigned",
    "costCenter": "",
    "currentEnrollment": "123456",
    "billingFrequency": "recurring",
    "billingMonth": 20190901,
    "monetaryCommitment": 523123.9,
    "overage": 23234.49
}
```

## Related content

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.