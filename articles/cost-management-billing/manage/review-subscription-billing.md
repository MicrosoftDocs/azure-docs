---
title: Review Azure subscription billing data with REST API
description: Learn how to use Azure REST APIs to review subscription billing details. You can use filters to help customize results.
author: bandersmsft
ms.reviewer: adwise
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: article
ms.date: 03/21/2024
ms.author: banders
# Customer intent: As an administrator or developer, I want to use REST APIs to review subscription billing data for a specified period.
---

# Review subscription billing using REST APIs

Azure Reporting APIs help you review and manage your Azure costs.

Filters help customize results to meet your needs.

Here, you learn to use a REST API to return subscription billing details for a given date range.

``` http
GET https://management.azure.com/subscriptions/${subscriptionID}/providers/Microsoft.Billing/billingPeriods/${billingPeriod}/providers/Microsoft.Consumption/usageDetails?$filter=properties/usageEnd ge '${startDate}' AND properties/usageEnd le '${endDate}'
Content-Type: application/json
Authorization: Bearer
```

## Build the request

The `{subscriptionID}` parameter is required and identifies the target subscription.

The `{billingPeriod}` parameter is required and specifies a current [billing period](/rest/api/billing/enterprise/billing-enterprise-api-billing-periods). The billingPeriod parameter must be formatted without dashes. For example, `202112`. If a day of the month is added to billingPeriod, it is ignored.

The `${startDate}` and `${endDate}` parameters are required for this example, but optional for the endpoint. They specify the date range as strings in the form of YYYY-MM-DD. For example, `2018-05-01` and `2018-06-15`. Dashes are required for startDate and endDate.

The following headers are required:

|Request header|Description|
|--------------------|-----------------|
|*Content-Type:*|Required. Set to `application/json`.|
|*Authorization:*|Required. Set to a valid `Bearer` [access token](/rest/api/azure/#authorization-code-grant-interactive-clients). |

## Response

Status code 200 (OK) is returned for a successful response, which contains a list of detailed costs for your account.

``` json
{
  "value": [
    {
      "id": "/subscriptions/{$subscriptionID}/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/usageDetails/{$detailsID}",
      "name": "{$detailsID}",
      "type": "Microsoft.Consumption/usageDetails",
      "properties": {
        "billingPeriodId": "/subscriptions/${subscriptionID}/providers/Microsoft.Billing/billingPeriods/${billingPeriod}",
        "invoiceId": "/subscriptions/${subscriptionID}/providers/Microsoft.Billing/invoices/${invoiceID}",
        "usageStart": "${startDate}}",
        "usageEnd": "${endDate}",
        "currency": "USD",
        "usageQuantity": "${usageQuantity}",
        "billableQuantity": "${billableQuantity}",
        "pretaxCost": "${cost}",
        "meterId": "${meterID}",
        "meterDetails": "${meterDetails}"
      }
    }
  ],
  "nextLink": "${nextLinkURL}"
}
```

Each item in **value** represents a details regarding the use of a service:

|Response property|Description|
|----------------|----------|
|**subscriptionGuid** | Globally unique ID for the subscription. |
|**startDate** | Date the use started. |
|**endDate** | Date the use ended. |
|**useageQuantity** | Quantity used. |
|**billableQuantity** | Quantity actually billed. |
|**pretaxCost** | Cost invoiced, before applicable taxes. |
|**meterDetails** | Detailed information about the use. |
|**nextLink**| When set, specifies a URL for the next "page" of details. Blank when the page is the last one. |

This example is abbreviated; see [List usage details](/rest/api/consumption/usagedetails/list#usagedetailslistforbillingperiod-legacy) for a complete description of each response field.

Other status codes indicate error conditions. In these cases, the response object explains why the request failed.

``` json
{
  "error": [
    {
      "code": "Error type.",
      "message": "Error response describing why the operation failed."
    }
  ]
}
```

## Next steps
- Review [Enterprise reporting overview](./enterprise-api.md)
- Investigate [Enterprise Billing REST API](/rest/api/billing/)
- [Get started with Azure REST API](/rest/api/azure/)