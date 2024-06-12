---
title: Migrate from EA Marketplace Store Charge API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Marketplace Store Charge API.
author: bandersmsft
ms.author: banders
ms.date: 04/23/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: maminn
---

# Migrate from EA Marketplace Store Charge API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to get their marketplace store charges need to migrate to a replacement Azure Resource Manager API. This article helps you migrate by using the following instructions. It also explains the contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

Endpoints to migrate off:

|Endpoint|API Comments|
|---|---|
| `/v3/enrollments/{enrollmentNumber}/marketplacecharges` | • API method: GET <br><br> • Synchronous (non polling) <br><br> • Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/marketplacecharges` | • API method: GET <br><br> • Synchronous (non polling) <br><br>  • Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/marketplacechargesbycustomdate?startTime=2017-01-01&endTime=2017-01-10` | • API method: GET <br><br> • Synchronous (non polling) <br><br> • Data format: JSON |

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a service principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

### Call the Marketplaces API

Use the following request URIs when calling the new Marketplaces API. All Azure and Marketplace charges are merged into a single file that is available through the new solutions. You can identify which charges are *Azure* versus *Marketplace* charges by using the `PublisherType` field that is available in the new dataset.

Your enrollment number should be used as the `billingAccountId`.

#### Supported requests

You can call the API using the following scopes:

- Department: `/providers/Microsoft.Billing/departments/{departmentId}`
- Enrollment: `/providers/Microsoft.Billing/billingAccounts/{billingAccountId}`
- EnrollmentAccount: `/providers/Microsoft.Billing/enrollmentAccounts/{enrollmentAccountId}`
- Management Group: `/providers/Microsoft.Management/managementGroups/{managementGroupId}`
- Subscription: `/subscriptions/{subscriptionId}/`

For subscription, billing account, department, enrollment account, and management group scopes you can also add a billing period to the scope using `/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}`. For example, to specify a billing period at the department scope, use `/providers/Microsoft.Billing/departments/{departmentId}/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}`.

[List Marketplaces](/rest/api/consumption/marketplaces/list#marketplaceslistresult)

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/marketplaces?api-version=2023-05-01
```

With optional parameters:

```http
https://management.azure.com/{scope}/providers/Microsoft.Consumption/marketplaces?api-version=2023-05-01?&$filter={$filter}&$top={$top}&$skiptoken={$skiptoken}
```

#### Response body changes

>[!NOTE]
> The new response is missing the `AccountId`, `AccountOwnerId`, and `DepartmentId` fields. For account and department information, use the `AccountName` and `DepartmentName` fields.

Old response:


```json
[
            {
                "id": "id",
                "subscriptionGuid": "00000000-0000-0000-0000-000000000000",
                "subscriptionName": "subName",
                "meterId": "2core",
                "usageStartDate": "2015-09-17T00:00:00Z",
                "usageEndDate": "2015-09-17T23:59:59Z",
                "offerName": "Virtual LoadMaster&trade; (VLM) for Azure",
                "resourceGroup": "Res group",
                "instanceId": "id",
                "additionalInfo": "{\"ImageType\":null,\"ServiceType\":\"Medium\"}",
                "tags": "",
                "orderNumber": "order",
                "unitOfMeasure": "",
                "costCenter": "100",
                "accountId": 100,
                "accountName": "Account Name",
                "accountOwnerId": "account@live.com",
                "departmentId": 101,
                "departmentName": "Department 1",
                "publisherName": "Publisher 1",
                "planName": "Plan name",
                "consumedQuantity": 1.15,
                "resourceRate": 0.1,
                "extendedCost": 1.11,
                "isRecurringCharge": "False"
            },
            ...
        ]
```

New response:

```json
    {
      "id": "/subscriptions/subid/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/marketPlaces/marketplacesId1",
      "name": "marketplacesId1",
      "type": "Microsoft.Consumption/marketPlaces",
      "tags": {
        "env": "newcrp",
        "dev": "tools"
      },
      "properties": {
        "accountName": "Account1",
        "additionalProperties": "additionalProperties",
        "costCenter": "Center1",
        "departmentName": "Department1",
        "billingPeriodId": "/subscriptions/subid/providers/Microsoft.Billing/billingPeriods/201702",
        "usageStart": "2017-02-13T00:00:00Z",
        "usageEnd": "2017-02-13T23:59:59Z",
        "instanceName": "shared1",
        "instanceId": "/subscriptions/subid/resourceGroups/Default-Web-eastasia/providers/Microsoft.Web/sites/shared1",
        "currency": "USD",
        "consumedQuantity": 0.00328,
        "pretaxCost": 0.67,
        "isEstimated": false,
        "meterId": "00000000-0000-0000-0000-000000000000",
        "offerName": "offer1",
        "resourceGroup": "TEST",
        "orderNumber": "00000000-0000-0000-0000-000000000000",
        "publisherName": "xyz",
        "planName": "plan2",
        "resourceRate": 0.24,
        "subscriptionGuid": "00000000-0000-0000-0000-000000000000",
        "subscriptionName": "azure subscription",
        "unitOfMeasure": "10 Hours",
        "isRecurringCharge": false
      }
    }

```

## Related content

- Read the [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.