---
title: Migrate from Enterprise Reporting to Azure Resource Manager APIs
description: This article helps you understand the differences between the Reporting APIs and the Azure Resource Manager APIs, what to expect when you migrate to the Azure Resource Manager APIs, and the new capabilities that are available with the new Azure Resource Manager APIs.
author: bandersmsft
ms.reviewer: adwise
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/10/2021
ms.author: banders
---

# Migrate from Enterprise Reporting to Azure Resource Manager APIs

This article helps developers who have built custom solutions using the [Azure Reporting APIs for Enterprise Customers](../manage/enterprise-api.md) to migrate onto the Azure Resource Manager APIs for Cost Management. Service Principal support for the newer Azure Resource Manager APIs is now generally available. Azure Resource Manager APIs are in active development. Consider migrating to them instead of using the older Azure Reporting APIs for Enterprise Customers. The older APIs are being deprecated. This article helps you understand the differences between the Reporting APIs and the Azure Resource Manager APIs, what to expect when you migrate to the Azure Resource Manager APIs, and the new capabilities that are available with the new Azure Resource Manager APIs.

## API differences

The following information describes the differences between the older Reporting APIs for Enterprise Customers and the newer Azure Resource Manager APIs.

| **Use** | **Enterprise Agreement APIs** | **Azure Resource Manager APIs** |
| --- | --- | --- |
| Authentication | API Key provisioned in the Enterprise Agreement (EA) portal | Azure Active Directory (Azure AD) Authentication using User tokens or Service Principals. Service Principals take the place of API Keys. |
| Scopes and Permissions | All requests are at the Enrollment scope. The API Key permission assignments will determine whether data for the entire Enrollment, a Department, or a specific Account is returned. No user authentication. | Users or Service Principals are assigned access to the Enrollment, Department, or Account scope. |
| URI Endpoint | https://consumption.azure.com | https://management.azure.com |
| Development Status | In maintenance mode. On the path to deprecation. | Actively being developed |
| Available APIs | Limited to what is available currently | Equivalent APIs are available to replace each EA API. <p> Additional [Cost Management APIs](/rest/api/cost-management/) are also available to you, including: <p> <ul><li>Budgets</li><li>Alerts<li>Exports</li></ul> |

## Migration checklist

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- Determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](#ea-api-mapping-to-new-azure-resource-manager-apis).
- Configure service authorization and authentication for the Azure Resource Manager APIs
  - If you're not already using Azure Resource Manager APIs, [register your client app with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad). Registration creates a service principal for you to use to call the APIs.
  - Assign the service principal access to the scopes needed, as outlined below.
  - Update any programming code to use [Azure AD authentication](/rest/api/azure/#create-the-request) with your Service Principal.
- Test the APIs and then update any programming code to replace EA API calls with Azure Resource Manager API calls.
- Update error handling to use new error codes. Some considerations include:
  - Azure Resource Manager APIs have a timeout period of 60 seconds.
  - Azure Resource Manager APIs have rate limiting in place. This results in a 429 throttling error if rates are exceeded. Build your solutions so that you don't place too many API calls in a short time period.
- Review the other Cost Management APIs available through Azure Resource Manager and assess for use later. For more information, see [Use additional Cost Management APIs](#use-additional-cost-management-apis).

## Assign Service Principal access to Azure Resource Manager APIs

After you create a Service Principal to programmatically call the Azure Resource Manager APIs, you need to assign it the proper permissions to authorize against and execute requests in Azure Resource Manager. There are two permission frameworks for different scenarios.

### Azure Billing Hierarchy Access

To assign Service Principal permissions to your Enterprise Billing Account, Departments, or Enrollment Account scopes, see [Assign roles to Azure Enterprise Agreement service principal names](../manage/assign-roles-azure-service-principals.md).

### Azure role-based access control

New Service Principal support extends to Azure-specific scopes, like management groups, subscriptions, and resource groups. You can assign Service Principal permissions to these scopes directly [in the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application) or by using [Azure PowerShell](../../active-directory/develop/howto-authenticate-service-principal-powershell.md#assign-the-application-to-a-role).

## EA API mapping to new Azure Resource Manager APIs

Use the table below to identify the EA APIs that you currently use and the replacement Azure Resource Manager API to use instead.

| **Scenario** | **EA APIs** | **Azure Resource Manager APIs** |
| --- | --- | --- |
| Balance Summary | [/balancesummary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) |[Microsoft.Consumption/balances](/rest/api/consumption/balances/getbybillingaccount) |
| Price Sheet | [/pricesheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) | [Microsoft.Consumption/pricesheets/default](/rest/api/consumption/pricesheet) – use for negotiated prices <p> [Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) – use for retail prices |
| Reserved Instance Details | [/reservationdetails](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.CostManagement/generateReservationDetailsReport](/rest/api/cost-management/generatereservationdetailsreport) |
| Reserved Instance Summary | [/reservationsummaries](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid) |
| Reserved Instance Recommendations | [/SharedReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation)<p>[/SingleReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation) | [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) |
| Reserved Instance Charges | [/reservationcharges](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges) | [Microsoft.Consumption/reservationTransactions](/rest/api/consumption/reservationtransactions/list) |

## Migration details by API

The following sections show old API request examples with new replacement API examples.

### Balance Summary API

Use the following request URIs when calling the new Balance Summary API. Your enrollment number should be used as the billingAccountId.

#### Supported requests

[Get for Enrollment](/rest/api/consumption/balances/getbybillingaccount)

```json
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/balances?api-version=2019-10-01
```

### Response body changes

_Old response body_:

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
              "value": 1.0
            }
          ]
    }

```

_New response body_:

The same data is now available in the `properties` field of the new API response. There might be minor changes to the spelling on some of the field names.

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

### Price Sheet

Use the following request URIs when calling the new Price Sheet API.

#### Supported requests

 You can call the API using the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`
- Subscription: `subscriptions/{subscriptionId}`

[_Get for current Billing Period_](/rest/api/consumption/pricesheet/get)


```json
https://management.azure.com/{scope}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01
```

[_Get for specified Billing Period_](/rest/api/consumption/pricesheet/getbybillingperiod)

```json
https://management.azure.com/{scope}/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01
```

#### Response body changes

_Old response_:

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

_New response_:

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

### Reserved instance usage details

Microsoft isn't actively working on synchronous-based Reservation Details APIs. We recommend at you move to the newer SPN-supported asynchronous API call pattern as a part of the migration. Asynchronous requests better handle large amounts of data and will reduce timeout errors.

#### Supported requests

Use the following request URIs when calling the new Asynchronous Reservation Details API. Your enrollment number should be used as the `billingAccountId`. You can call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

#### Sample request to generate a reservation details report

```json
POST 
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/generateReservationDetailsReport?startDate={startDate}&endDate={endDate}&api-version=2019-11-01

```

#### Sample request to poll report generation status

```json
GET
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/reservationDetailsOperationResults/{operationId}?api-version=2019-11-01

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

The response of the older synchronous based Reservation Details API is below.

_Old response_:

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

_New response_:

The new API creates a CSV file for you. See the following file fields.

| **Old Property** | **New Property** | **Notes** |
| --- | --- | --- |
|  | InstanceFlexibilityGroup | New property for instance flexibility. |
|  | InstanceFlexibilityRatio | New property for instance flexibility. |
| instanceId | InstanceName |  |
|  | Kind | It's a new property. Value is `None`, `Reservation`, or `IncludedQuantity`. |
| reservationId | ReservationId |  |
| reservationOrderId | ReservationOrderId |  |
| reservedHours | ReservedHours |  |
| skuName | SkuName |  |
| totalReservedQuantity | TotalReservedQuantity |  |
| usageDate | UsageDate |  |
| usedHours | UsedHours |  |

### Reserved Instance Usage Summary

Use the following request URIs to call the new Reservation Summaries API.

#### Supported requests

 Call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`

[_Get Reservation Summary Daily_](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid)

```json
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2019-10-01
```

[_Get Reservation Summary Monthly_](/rest/api/consumption/reservationssummaries/list#reservationsummariesmonthlywithbillingaccountid)

```json
https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&$filter=properties/usageDate ge 2017-10-01 AND properties/usageDate le 2017-11-20&api-version=2019-10-01
```

#### Response body changes

_Old response_:

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

_New response_:

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

### Reserved instance recommendations

Use the following request URIs to call the new Reservation Recommendations API.

#### Supported requests

 Call the API with the following scopes:

- Enrollment: `providers/Microsoft.Billing/billingAccounts/{billingAccountId}`
- Subscription: `subscriptions/{subscriptionId}`
- Resource Groups: `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`

[_Get Recommendations_](/rest/api/consumption/reservationrecommendations/list)

Both the shared and the single scope recommendations are available through this API. You can also filter on the scope as an optional API parameter.

```json
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-10-01
```

#### Response body changes

Recommendations for Shared and Single scopes are combined into one API.

_Old response_:

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

_New response_:

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

### Reserved instance charges

Use the following request URIs to call the new Reserved Instance Charges API.

#### Supported requests

[_Get Reservation Charges by Date Range_](/rest/api/consumption/reservationtransactions/list)

```json
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/reservationTransactions?$filter=properties/eventDate+ge+2020-05-20+AND+properties/eventDate+le+2020-05-30&api-version=2019-10-01
```

#### Response body changes

_Old response_:

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
        "eventDate": "string",
        "reservationOrderId": "00000000-0000-0000-0000-000000000000",
        "description": "Standard_F1s eastus 1 Year",
        "eventType": "Purchase",
        "quantity": int,
        "amount": double,
        "currency": "string",
        "reservationOrderName": "string"
    }
]

```
_New response_:

```json
{
  "value": [
    {
      "id": "/billingAccounts/123456/providers/Microsoft.Consumption/reservationtransactions/201909091919",
      "name": "201909091919",
      "type": "Microsoft.Consumption/reservationTransactions",
      "tags": {},
      "properties": {
        "eventDate": "2019-09-09T19:19:04Z",
        "reservationOrderId": "00000000-0000-0000-0000-000000000000",
        "description": "Standard_DS1_v2 westus 1 Year",
        "eventType": "Cancel",
        "quantity": 1,
        "amount": -21,
        "currency": "USD",
        "reservationOrderName": "Transaction-DS1_v2",
        "purchasingEnrollment": "123456",
        "armSkuName": "Standard_DS1_v2",
        "term": "P1Y",
        "region": "westus",
        "purchasingSubscriptionGuid": "11111111-1111-1111-1111-11111111111",
        "purchasingSubscriptionName": "Infrastructure Subscription",
        "accountName": "Microsoft Infrastructure",
        "accountOwnerEmail": "admin@microsoft.com",
        "departmentName": "Unassigned",
        "costCenter": "",
        "currentEnrollment": "123456",
        "billingFrequency": "recurring"
      }
    },
  ]
}

```

## Use additional Cost Management APIs

After you've migrated to Azure Resource Manager APIs for your existing reporting scenarios, you can use many other APIs, too. The APIs are also available through Azure Resource Manager and can be automated using Service Principal-based authentication. Here's a quick summary of the new capabilities that you can use.

- [Budgets](/rest/api/consumption/budgets/createorupdate) - Use to set thresholds to proactively monitor your costs, alert relevant stakeholders, and automate actions in response to threshold breaches.

- [Alerts](/rest/api/cost-management/alerts) - Use to view alert information including, but not limited to, budget alerts, invoice alerts, credit alerts, and quota alerts.

- [Exports](/rest/api/cost-management/exports) - Use to schedule recurring data export of your charges to an Azure Storage account of your choice. It's the recommended solution for customers with a large Azure presence who want to analyze their data and use it in their own internal systems.

## Next steps

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- If needed, determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](#ea-api-mapping-to-new-azure-resource-manager-apis).
- If you're not already using Azure Resource Manager APIs, [register your client app with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad).
- If needed, update any of your programming code to use [Azure AD authentication](/rest/api/azure/#create-the-request) with your Service Principal.