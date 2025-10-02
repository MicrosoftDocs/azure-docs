---
title: Manage Azure costs with automation
description: This article explains how you can manage Azure costs with automation.
author: vikramdesai01
ms.author: vikdesai
ms.date: 07/03/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: vikdesai
---

# Manage costs with automation

You can use Cost Management automation to build a custom set of solutions to retrieve and manage cost data. This article covers common scenarios for Cost Management automation and options available based on your situation. If you want to develop using APIs, common API request examples and presented to help accelerate your development process.

## Automate cost data retrieval for offline analysis

You might need to download your Azure cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved. You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](./assign-access-acm-data.md).

## Suggestions for handling large datasets

If your organization has a large Azure presence across many resources or subscriptions, you'll have a large number of usage details data results. Excel often can't load such large files. In this situation, we recommend the following options:

**Power BI**

Power BI is used to ingest and handle large amounts of data. If you're an Enterprise Agreement customer, you can use the Power BI template app to analyze costs for your billing account. The report contains key views used by customers. For more information, see [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).

**Power BI data connector**

If you want to analyze your data daily, we recommend using the [Power BI data connector](/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. The connector keeps the reports up to date as more costs accrue.

**Cost Management exports**

You might not need to analyze the data daily. If so, consider using Cost Management's [Exports](./tutorial-improved-exports.md) feature to schedule data exports to an Azure Storage account. Then you can load the data into Power BI as needed, or analyze it in Excel if the file is small enough. Exports are available in the Azure portal or you can configure exports with the [Exports API](/rest/api/cost-management/exports).

**Cost Details API**

Consider using the [Cost Details API](/rest/api/cost-management/generate-cost-details-report) if you have a small cost data set. Here are recommended best practices:

- If you want to get the latest cost data, we recommend that you query at most once per day. Reports are refreshed every four hours. If you call more frequently, you'll receive identical data.
- Once you download your cost data for historical invoices, the charges aren't expected to change unless you're explicitly notified. We recommend caching your cost data in a queryable store to prevent repeated calls for identical data.
- Chunk your calls into small date ranges to get more manageable files that you can download. For example, we recommend chunking by day or by week if you have large Azure usage files month-to-month. 
- If you have scopes with a large amount of cost data (for example a Billing Account), consider placing multiple calls to child scopes so you get more manageable files that you can download.
- If your dataset is more than 2 GB month-to-month, consider using [exports](tutorial-improved-exports.md) as a more scalable solution.

## Automate retrieval with Cost Details API

The Cost Details API cables you to programmatically generate and download detailed, unaggregated cost data for your Enterprise Agreement (EA) or Microsoft Customer Agreement (MCA) billing account. Unlike the legacy Usage Details API, the Cost Details API is asynchronous and report-based: you submit a request to generate a report, poll for its completion, and then download the resulting file from a secure URL.

> [!IMPORTANT]
> The Cost Details API is only supported for Enterprise Agreement (EA) or Microsoft Customer Agreement (MCA) scopes. For other account types, we suggest using Exports. If you need to download small datasets and you don't want to use Azure Storage, you can also use the Consumption Usage Details API. See instructions on how to do this [here](../automate/get-usage-details-legacy-customer.md)

### How the Cost Details API works

1. **Create a report**: Submit a POST request to the Cost Details API specifying the scope, date range, and optional filters (such as meter, resource, or tag).
2. **Poll for status**: The API returns an operation ID. Poll the operation status endpoint until the report is complete.
3. **Download the report**: Once the report is ready, the API provides a secure download URL for the CSV file containing your cost data. The download link is valid for a limited time.

For full details, see [Get small usage datasets on demand](../automate/get-small-usage-datasets-on-demand.md) and the [Cost Details API reference](/rest/api/cost-management/generate-cost-details-report).

## Example: Generate and download a Cost Details report

To retrieve cost details using the Cost Details API, follow these steps:

### Step 1: Create a report

Submit a POST request to start report generation. Replace `{scope}` with your billing account or profile scope.

```http
POST https://management.azure.com/{scope}/providers/Microsoft.CostManagement/generateCostDetailsReport?api-version=2025-03-01
Content-Type: application/json

{
  "metric": "ActualCost",
  "timePeriod": {
    "start": "2025-03-01",
    "end": "2025-03-15"
  }
}
```

The response includes a `Location` header in the response that contains the polling link to be used in step 2.

### Step 2: Poll for status

Check the status of the report generation using the polling link:

```http
GET https://management.azure.com/{scope}/providers/Microsoft.CostManagement/generateCostDetailsReport/{operationId}?api-version=2025-03-01
```

When the report is ready, the response includes a `blobLink` property.

### Step 3: Download the report

Use the `blobLink` to download the CSV file containing your cost details.

> [!NOTE]
> The Cost Details API is asynchronous. You can't retrieve cost details directly with a GET request to `/generateCostDetailsReport`. Always use the report generation workflow described above. For more information, see the [Cost Details API documentation](/rest/api/cost-management/generate-cost-details-report).

### Best practices for using the Cost Details API

- **Request frequency**: We recommend that reports are generated no more than once per day for a given scope and date range. Cost data is refreshed every four hours, but more frequent requests returns the same data and may be throttled.
- **Date range**: For large datasets, limit the date range (for example, generate daily or weekly reports) to keep file sizes manageable.
- **Scope**: Use the highest-level scope available (such as billing account or billing profile) to minimize the number of API calls and ensure data completeness.
- **Data retention**: Download and store reports promptly. The download URL expires after a short period (typically one hour).

### Notes about pricing and data

- The Cost Details API provides actual and amortized cost data, including all usage, purchases, and refunds for the selected period.
- The data is unaggregated and suitable for detailed analysis, reconciliation, and integration with other systems.
- For more information about pricing behavior, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).

### A single resource might have multiple records for a single day

Azure resource providers might emit usage and charges to the billing system with different attributes (such as datacenter location), resulting in multiple records for a resource on a single day. This behavior is expected and doesn't indicate overcharging; all records together represent the full cost for that resource and day.

## Automate alerts and actions with budgets

There are two critical components to maximizing the value of your investment in the cloud. One is automatic budget creation. The other is configuring cost-based orchestration in response to budget alerts. There are different ways to automate budget creation. Various alert responses happen when your configured alert thresholds are exceeded.

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

You can configure budgets to start automated actions using Azure Action Groups. To learn more about automating actions using budgets, see [Automation with budgets](../manage/cost-management-budget-scenario.md).

## Data latency and rate limits

We recommend that you call the APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn't provide more data. Instead, it creates increased load.

### Query API query processing units

In addition to the existing rate limiting processes, the [Query API](/rest/api/cost-management/query) also limits processing based on the cost of API calls. The cost of an API call is expressed as query processing units (QPUs). QPU is a performance currency, like [Cosmos DB RUs](/azure/cosmos-db/request-units). They abstract system resources like CPU and memory.

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

The quotas maybe be changed as needed and more quotas can be added.

#### Response headers

You can examine the response headers to track the number of QPUs consumed by an API request and number of QPUs remaining.

`x-ms-ratelimit-microsoft.costmanagement-qpu-retry-after`

Indicates the time to back-off in seconds. When a request is throttled with 429, back off for the time specified in this header before retrying the request.

`x-ms-ratelimit-microsoft.costmanagement-qpu-consumed`

QPUs consumed by an API call.

`x-ms-ratelimit-microsoft.costmanagement-qpu-remaining`

List of remaining quotas.

## Related content

- [Analyze Azure costs with the Power BI template app](./analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- [Create and manage exported data](./tutorial-improved-exports.md) with Exports.
- Learn more about the [Cost Details API](/rest/api/cost-management/generate-cost-details-report).