---
title: Automate budget creation
titleSuffix: Microsoft Cost Management
description: This article helps you create budgets with the Budget API and a budget template.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Automate budget creation

You can automate budget creation using the [Budgets API](/rest/api/consumption/budgets). You can also create a budget with a [budget template](../costs/quick-create-budget-template.md). Templates are an easy way for you to standardize Azure deployments while ensuring cost control is properly configured and enforced.

## Common Budgets API configurations

There are many ways to configure a budget in your Azure environment. Consider your scenario first and then identify the configuration options that enable it. Review the following options:

- **Time Grain** - Represents the recurring period your budget uses to accrue and evaluate costs. The most common options are Monthly, Quarterly, and Annual.
- **Time Period** - Represents how long your budget is valid. The budget actively monitors and alerts you only while it remains valid.
- **Notifications**
  - Contact Emails – The email addresses receive alerts when a budget accrues costs and exceeds defined thresholds.
  - Contact Roles - All users who have a matching Azure role on the given scope receive email alerts with this option. For example, Subscription Owners could receive an alert for a budget created at the subscription scope.
  - Contact Groups - The budget calls the configured action groups when an alert threshold is exceeded.
- **Cost dimension filters** - The same filtering you can do in Cost Analysis or the Query API can also be done on your budget. Use this filter to reduce the range of costs that you're monitoring with the budget.

After you've identified the budget creation options that meet your needs, create the budget using the API. The example below helps get you started with a common budget configuration.

### Create a budget filtered to multiple resources and tags

Request URL: `PUT https://management.azure.com/subscriptions/{SubscriptionId}/providers/Microsoft.Consumption/budgets/{BudgetName}/?api-version=2019-10-01`

```json
{
  "eTag": "\"1d34d016a593709\"",
  "properties": {
    "category": "Cost",
    "amount": 100.65,
    "timeGrain": "Monthly",
    "timePeriod": {
      "startDate": "2017-10-01T00:00:00Z",
      "endDate": "2018-10-31T00:00:00Z"
    },
    "filter": {
      "and": [
        {
          "dimensions": {
            "name": "ResourceId",
            "operator": "In",
            "values": [
              "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{meterName}",
              "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{meterName}"
            ]
          }
        },
        {
          "tags": {
            "name": "category",
            "operator": "In",
            "values": [
              "Dev",
              "Prod"
            ]
          }
        },
        {
          "tags": {
            "name": "department",
            "operator": "In",
            "values": [
              "engineering",
              "sales"
            ]
          }
        }
      ]
    },
    "notifications": {
      "Actual_GreaterThan_80_Percent": {
        "enabled": true,
        "operator": "GreaterThan",
        "threshold": 80,
        "contactEmails": [
          "user1@contoso.com",
          "user2@contoso.com"
        ],
        "contactRoles": [
          "Contributor",
          "Reader"
        ],
        "contactGroups": [
          "/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/microsoft.insights/actionGroups/{actionGroupName}
        ],
        "thresholdType": "Actual"
      }
    }
  }
}
```

## Supported locales for budget alert emails

With budgets, you're alerted when costs cross a set threshold. You can set up to five email recipients per budget. Recipients receive the email alerts within 24 hours of crossing the budget threshold. However, your recipient might need to receive an email in a different language. You can use the following language culture codes with the Budgets API. Set the culture code with the `locale` parameter similar to the following example.

```json
{
  "eTag": "\"1d681a8fc67f77a\"",
  "properties": {
    "timePeriod": {
      "startDate": "2020-07-24T00:00:00Z",
      "endDate": "2022-07-23T00:00:00Z"
    },
    "timeGrain": "BillingMonth",
    "amount": 1,
    "currentSpend": {
      "amount": 0,
      "unit": "USD"
    },
    "category": "Cost",
    "notifications": {
      "actual_GreaterThan_10_Percent": {
        "enabled": true,
        "operator": "GreaterThan",
        "threshold": 20,
        "locale": "en-us",
        "contactEmails": [
          "user@contoso.com"
        ],
        "contactRoles": [],
        "contactGroups": [],
        "thresholdType": "Actual"
      }
    }
  }
}
```

Languages supported by a culture code:

| Culture code| Language |
| --- | --- |
| en-us	| English (United States) |
| ja-jp	| Japanese (Japan) |
| zh-cn	| Chinese (Simplified, China) |
| de-de	| German (Germany) |
| es-es	| Spanish (Spain, International) |
| fr-fr	| French (France) |
| it-it	| Italian (Italy) |
| ko-kr	| Korean (Korea) |
| pt-br	| Portuguese (Brazil) |
| ru-ru	| Russian (Russia) |
| zh-tw	| Chinese (Traditional, Taiwan) |
| cs-cz	| Czech (Czech Republic) |
| pl-pl | Polish (Poland) |
| tr-tr	| Turkish (Türkiye) |
| da-dk	| Danish (Denmark) |
| en-gb	| English (United Kingdom) |
| hu-hu	| Hungarian (Hungary) |
| nb-no	| Norwegian Bokmal (Norway) |
| nl-nl	| Dutch (Netherlands) |
| pt-pt	| Portuguese (Portugal) |
| sv-se	| Swedish (Sweden) |

## Configure cost-based orchestration for budget alerts

You can configure budgets to start automated actions using Azure Action Groups. To learn more about automating actions using budgets, see [Automation with budgets](../manage/cost-management-budget-scenario.md).

## Next steps

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).
- [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).