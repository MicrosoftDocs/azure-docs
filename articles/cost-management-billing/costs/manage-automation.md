---
title: Manage Azure costs with automation
description: This article explains how you can manage Azure costs with automation.
author: bandersmsft
ms.author: banders
ms.date: 11/22/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Manage costs with automation

You can use Cost Management automation to build a custom set of solutions to retrieve and manage cost data. This article covers common scenarios for Cost Management automation and options available based on your situation. If you want to develop using APIs, common API request examples and presented to help accelerate your development process.

## Automate cost data retrieval for offline analysis

You might need to download your Azure cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved. You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](./assign-access-acm-data.md).

## Suggestions for handling large datasets

If your organization has a large Azure presence across many resources or subscriptions, you'll have a large amount of usage details data. Excel often can't load such large files. In this situation, we recommend the following options:

**Power BI**

Power BI is used to ingest and handle large amounts of data. If you're an Enterprise Agreement customer, you can use the Power BI template app to analyze costs for your billing account. The report contains key views used by customers. For more information, see [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).

**Power BI data connector**

If you want to analyze your data daily, we recommend using the [Power BI data connector](/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

**Cost Management exports**

You might not need to analyze the data daily. If so, consider using Cost Management's [Exports](./tutorial-export-acm-data.md) feature to schedule data exports to an Azure Storage account. Then you can load the data into Power BI as needed, or analyze it in Excel if the file is small enough. Exports are available in the Azure portal or you can configure exports with the [Exports API](/rest/api/cost-management/exports).

**Usage Details API**

Consider using the [Usage Details API](/rest/api/consumption/usageDetails) if you have a small cost data set. Here are recommended best practices:

- If you want to get the latest cost data, we recommend that you query at most once per day. Reports are refreshed every four hours. If you call more frequently, you'll receive identical data.
- Once you download your cost data for historical invoices, the charges won't change unless you're explicitly notified. We recommend caching your cost data in a queryable store on to prevent repeated calls for identical data.
- Chunk your calls into small date ranges to get more manageable files that you can download. For example, we recommend chunking by day or by week if you have large Azure usage files month-to-month. 
- If you have scopes with a large amount of usage data (for example a Billing Account), consider placing multiple calls to child scopes so you get more manageable files that you can download.
- If your dataset is more than 2 GB month-to-month, consider using [exports](tutorial-export-acm-data.md) as a more scalable solution.

## Automate retrieval with Usage Details API

The [Usage Details API](/rest/api/consumption/usageDetails) provides an easy way to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if you're looking to analyze smaller cost data sets. However, you should use other solutions identified previously if you have larger datasets. The data in Usage Details is provided on a per meter basis, per day. It's used when calculating your monthly bill. The general availability (GA) version of the APIs is `2019-10-01`. Use `2019-04-01-preview` to access the preview version for reservation and Azure Marketplace purchases with the APIs.

If you want to get large amounts of exported data regularly, see [Retrieve large cost datasets recurringly with exports](ingest-azure-usage-at-scale.md).

### Usage Details API suggestions

**Request schedule**

We recommend that you make _no more than one request_ to the Usage Details API per day. For more information about how often cost data is refreshed and how rounding is handled, see [Understand cost management data](./understand-cost-mgt-data.md).

**Target top-level scopes without filtering**

Use the API to get all the data you need at the highest-level scope available. Wait until all needed data is ingested before doing any filtering, grouping, or aggregated analysis. The API is optimized specifically to provide large amounts of unaggregated raw cost data. To learn more about scopes available in Cost Management, see [Understand and work with scopes](./understand-work-scopes.md). Once you've downloaded the needed data for a scope, use Excel to analyze data further with filters and pivot tables.

### Notes about pricing

If you want to reconcile usage and charges with your price sheet or invoice, note the following information.

Price Sheet price behavior - The prices shown on the price sheet are the prices that you receive from Azure. They're scaled to a specific unit of measure. Unfortunately, the unit of measure doesn't always align to the unit of measure at which the actual resource usage and charges are emitted.

Usage Details price behavior - Usage files show scaled information that may not match precisely with the price sheet. Specifically:

- Unit Price - The price is scaled to match the unit of measure at which the charges are actually emitted by Azure resources. If scaling occurs, then the price won't match the price seen in the Price Sheet.
- Unit of Measure - Represents the unit of measure at which charges are actually emitted by Azure resources.
- Effective Price / Resource Rate - The price represents the actual rate that you end up paying per unit, after discounts are taken into account. It's the price that should be used with the Quantity to do Price * Quantity calculations to reconcile charges. The price takes into account the following scenarios and the scaled unit price that's also present in the files. As a result, it might differ from the scaled unit price.
  - Tiered pricing - For example: $10 for the first 100 units, $8 for the next 100 units.
  - Included quantity - For example: The first 100 units are free and then $10 per unit.
  - Reservations
  - Rounding that occurs during calculation – Rounding takes into account the consumed quantity, tiered/included quantity pricing, and the scaled unit price.

### A single resource might have multiple records for a single day

Azure resource providers emit usage and charges to the billing system and populate the `Additional Info` field of the usage records. Occasionally, resource providers might emit usage for a given day and stamp the records with different datacenters in the `Additional Info` field of the usage records. It can cause multiple records for a meter/resource to be present in your usage file for a single day. In that situation, you aren't overcharged. The multiple records represent the full cost of the meter for the resource on that day.

## Example Usage Details API requests

The following example requests are used by Microsoft customers to address common scenarios that you might come across.

### Get Usage Details for a scope during specific date range

The data that's returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. The call to use varies by your subscription type.

For legacy customers with an Enterprise Agreement (EA) or a pay-as-you-go subscription, use the following call:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20'2020-02-01'%20and%20properties%2FusageEnd%20le%20'2020-02-29'&$top=1000&api-version=2019-10-01
```

For modern customers with a Microsoft Customer Agreement, use the following call:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?startDate=2020-08-01&endDate=2020-08-05&$top=1000&api-version=2019-10-01
```

> [!NOTE]
> The `$filter` parameter isn't supported by Microsoft Customer Agreements.

### Get amortized cost details

If you need actual costs to show purchases as they're accrued, change the *metric* to `ActualCost` in the following request. To use amortized and actual costs, you must use the `2019-04-01-preview` version. The current API version works the same as the `2019-10-01` version, except for the new type/metric attribute and changed property names. If you have a Microsoft Customer Agreement, your filters are `startDate` and `endDate` in the following example.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&$filter=properties/usageStart+ge+'2019-04-01'+AND+properties/usageEnd+le+'2019-04-30'&api-version=2019-04-01-preview
```

## Automate alerts and actions with budgets

There are two critical components to maximizing the value of your investment in the cloud. One is automatic budget creation. The other is configuring cost-based orchestration in response to budget alerts. There are different ways to automate Azure budget creation. Various alert responses happen when your configured alert thresholds are exceeded.

The following sections cover available options and provide sample API requests to get you started with budget automation.

### How costs are evaluated against your budget threshold

Your costs are evaluated against your budget threshold once per day. When you create a new budget or at your budget reset day, the costs compared to the threshold will be zero/null because the evaluation might not have occurred.

When Azure detects that your costs have crossed the threshold, a notification is triggered within the hour of the detecting period.

### View your current cost

To view your current costs, you need to make a GET call using the [Query API](/rest/api/cost-management/query).

A GET call to the Budgets API won't return the current costs shown in Cost Analysis. Instead, the call returns your last evaluated cost.

### Automate budget creation

You can automate budget creation using the [Budgets API](/rest/api/consumption/budgets). You can also create a budget with a [budget template](quick-create-budget-template.md). Templates are an easy way for you to standardize Azure deployments while ensuring cost control is properly configured and enforced.

### Supported locales for budget alert emails

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

### Common Budgets API configurations

There are many ways to configure a budget in your Azure environment. Consider your scenario first and then identify the configuration options that enable it. Review the following options:

- **Time Grain** - Represents the recurring period your budget uses to accrue and evaluate costs. The most common options are Monthly, Quarterly, and Annual.
- **Time Period** - Represents how long your budget is valid. The budget actively monitors and alerts you only while it remains valid.
- **Notifications**
  - Contact Emails – The email addresses receive alerts when a budget accrues costs and exceeds defined thresholds.
  - Contact Roles - All users who have a matching Azure role on the given scope receive email alerts with this option. For example, Subscription Owners could receive an alert for a budget created at the subscription scope.
  - Contact Groups - The budget calls the configured action groups when an alert threshold is exceeded.
- **Cost dimension filters** - The same filtering you can do in Cost Analysis or the Query API can also be done on your budget. Use this filter to reduce the range of costs that you're monitoring with the budget.

After you've identified the budget creation options that meet your needs, create the budget using the API. The example below helps get you started with a common budget configuration.

**Create a budget filtered to multiple resources and tags**

Request URL: `PUT https://management.azure.com/subscriptions/{SubscriptionId} /providers/Microsoft.Consumption/budgets/{BudgetName}/?api-version=2019-10-01`

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

### Configure cost-based orchestration for budget alerts

You can configure budgets to start automated actions using Azure Action Groups. To learn more about automating actions using budgets, see [Automation with Azure Budgets](../manage/cost-management-budget-scenario.md).

## Data latency and rate limits

We recommend that you call the APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn't provide more data. Instead, it creates increased load.

### Query API query processing units

In addition to the existing rate limiting processes, the [Query API](/rest/api/cost-management/query) also limits processing based on the cost of API calls. The cost of an API call is expressed as query processing units (QPUs). QPU is a performance currency, like [Cosmos DB RUs](../../cosmos-db/request-units.md). They abstract system resources like CPU and memory.

#### QPU calculation

Currently, one QPU is deducted for one month of data queried from the allotted quotas. This logic might change without notice.

#### QPU factors

The following factor affects the number of QPUs consumed by an API request.

- Date range, as the date range in the request increases, the number of QPUs consumed increases.

Other QPU factors might be added without notice.

#### QPU quotas

The following quotas are configured per tenant. Requests are throttled when any of the following quotas are exhausted.

- 12 QPU per 10 seconds
- 60 QPU per 1 min
- 600 QPU per 1 hour

The quotas maybe be changed as needed and more quotas may be added.

#### Response headers

You can examine the response headers to track the number of QPUs consumed by an API request and number of QPUs remaining.

`x-ms-ratelimit-microsoft.costmanagement-qpu-retry-after`

Indicates the time to back-off in seconds. When a request is throttled with 429, back off for the time specified in this header before retrying the request.

`x-ms-ratelimit-microsoft.costmanagement-qpu-consumed`

QPUs consumed by an API call.

`x-ms-ratelimit-microsoft.costmanagement-qpu-remaining`

List of remaining quotas.

## Next steps

- [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- [Create and manage exported data](./tutorial-export-acm-data.md) with Exports.
- Learn more about the [Usage Details API](/rest/api/consumption/usageDetails).
