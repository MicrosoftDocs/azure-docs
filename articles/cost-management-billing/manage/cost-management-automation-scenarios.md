---
title: Automation scenarios for Azure billing and cost management
description: Learn how common billing and cost management scenarios are mapped to different APIs.
author: vikramdesai01
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 07/08/2025
ms.author: vikdesai
---

# Automation scenarios for billing and cost management

This article lists common scenarios for Azure billing and cost management. It maps these scenarios to APIs that you can use. Under each scenario-to-API mapping, you can find a summary of the APIs and the functionality that they offer.

## Common scenarios

You can use the billing and cost management APIs in several scenarios to answer cost-related and usage-related questions. Here's an outline of common scenarios:

- **Invoice reconciliation**: Did Microsoft charge me the right amount?  What's my bill, and can I calculate it myself?

- **Cross-charges**: Now that I know how much I'm being charged, who in my organization needs to pay?

- **Cost optimization**: I know how much I've been charged. How can I get more out of the money I'm spending on Azure?

- **Cost tracking**: I want to see how much I'm spending and using Azure over time. What are the trends? How can I do better?

- **Azure spending during the month**: How much is my current month's spending to date? Do I need to make any changes in my spending and/or usage of Azure? When during the month am I consuming Azure the most?

- **Alerts**: How can I set up resource-based consumption or monetary-based alerts?

## Scenario-to-API mapping

|         API        | Invoice reconciliation    | Cross-charges    | Cost optimization    | Cost tracking    | Midmonth spending    | Alerts    |
|:---------------------------:|:-------------------------:|:----------------:|:--------------------:|:----------------:|:------------------:|:---------:|
| Budgets                     |                           |                  |           X          |                  |                    |     X     |
| Marketplace Charges                |             X             |         X        |           X          |         X        |          X         |     X     |
| Price Sheet                 |             X             |         X        |           X          |         X        |          X         |           |
| Reservation Recommendations |                           |                  |           X          |                  |                    |           |
| Reservation Details         |                           |                  |           X          |         X        |                    |           |
| Reservation Summaries       |                           |                  |           X          |         X        |                    |           |
| Cost Details               |             X             |         X        |           X          |         X        |          X         |     X     |
| Billing Periods             |             X             |         X        |           X          |         X        |                    |           |
| Invoices                    |             X             |         X        |           X          |         X        |                    |           |
| Azure Retail Prices                    |             X             |                  |           X          |         X        |                    |           |


## API summaries

### Consumption
Web Direct and Enterprise customers can use all the following APIs, except where noted:

-    [Budgets API](/rest/api/consumption/budgets) (*Enterprise customers only*): Create either cost or usage budgets for resources, resource groups, or billing meters. When you've created budgets, you can configure alerts to notify you when you've exceeded defined budget thresholds. You can also configure actions to occur when you've reached budget amounts.

-    [Marketplace Charges API](/rest/api/consumption/marketplaces): Get charge and usage data on all Azure Marketplace resources (Azure partner offerings). You can use this data to add up costs across all Marketplace resources or to investigate costs/usage on specific resources.

-    [Reservation Recommendations API](/rest/api/consumption/reservationrecommendations): Get recommendations for purchasing Reserved VM Instances. Recommendations help you analyze expected cost savings and purchase amounts. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Reservation Details API](/rest/api/consumption/reservationsdetails): See information on previously purchased VM reservations, such as how much consumption is reserved versus how much is used. You can see data at per-VM-level detail. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Reservation Summaries API](/rest/api/consumption/reservationssummaries): See aggregated information on VM reservations that your organization bought, like how much consumption is reserved versus how much is used in the aggregate. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Azure Retail Prices](/rest/api/cost-management/retail-prices/azure-retail-prices): Get meter rates with pay-as-you-go pricing. You can then use the returned information with your resource usage information to manually calculate the expected bill.

### Cost Management
The following APIs are part of the Cost Management family and support a wide range of automation scenarios for cost analysis, reporting, alerting, and benefit management:

- [Exports API](/rest/api/cost-management/exports) – Schedule and manage recurring exports of cost details data to Azure Storage. Recommended for large-scale, automated cost data ingestion and historical analysis. See [Retrieve large cost datasets with exports](../costs/ingest-azure-usage-at-scale.md).

- [Generate Cost Details Report API](/rest/api/cost-management/generate-cost-details-report) – Generate and download a cost details CSV file on demand for a specific date range and scope. Useful for ad-hoc or small dataset retrieval. See [Get small cost datasets on demand](../automate/get-small-usage-datasets-on-demand.md).

- [Query API](/rest/api/cost-management/query) – Run custom queries for cost, usage, and forecast data. Supports grouping, filtering, and aggregation for advanced reporting and dashboards. See [Query cost data](../costs/cost-analysis-common-uses.md).

- [Alerts API](/rest/api/cost-management/alerts) – Manage cost-related alerts generated by budgets or other triggers. Integrate with monitoring and automation workflows.

- [Cost Allocation API](/rest/api/cost-management/cost-allocation-rules) – Allocate costs across subscriptions, resource groups, or custom dimensions for internal chargeback and showback scenarios. See [Allocate costs](../costs/allocate-costs.md).

- [Cost Management Dimensions API](/rest/api/cost-management/dimensions) – List and manage available dimensions (such as resource, tag, or meter) for use in cost analysis and reporting.

- [Cost Management Forecast API](/rest/api/cost-management/forecast) – Retrieve forecasted cost data to predict future spending and support proactive budgeting.

- [Price Sheet API](/rest/api/cost-management/price-sheet) – Retrieve the full list of meter prices and rates for your Azure account, including negotiated and retail prices. Useful for cost estimation, reconciliation, and custom reporting. 
  
- [Benefit Recommendations API](/rest/api/cost-management/benefit-recommendations) – Get recommendations for optimizing your Azure costs by identifying potential savings opportunities, such as reserved instances or savings plans, based on your historical and forecasted usage.

- [Benefit Utilization Summaries API](/rest/api/cost-management/generate-benefit-utilization-summaries-report) – Retrieve summaries of Azure Savings Plans and Reservations utilization.

- [Savings Plan Utilization Summaries API](/rest/api/cost-management/benefit-utilization-summaries) – Retrieve Azure Savings Plan utilization summaries.


These APIs enable automation for scenarios such as:
- Invoice reconciliation
- Cross-charging and cost allocation
- Cost optimization and trend analysis
- Budgeting and alerting
- Custom reporting and dashboarding
- Tracking and optimizing benefit utilization
- Analyzing savings from Reservations and Savings Plans
- Automating reservation and savings plan reporting
- Forecasting and planning future benefit purchases

For a full list of Cost Management APIs and their capabilities, see the [Cost Management REST API reference](/rest/api/cost-management/operation-groups).

### Billing
-    Billing Periods API: Determine a billing period to analyze, along with the invoice IDs for that period. You can use invoice IDs with the Invoices API.

-    [Invoices API](/rest/api/billing/2019-10-01-preview/invoices): Get the download URL for an invoice for a billing period in PDF form.

## Frequently asked questions

### What's the difference between the Invoice API and the Cost Details API?
These APIs provide a different view of the same data:

- The [Invoice API](/rest/api/billing/2019-10-01-preview/invoices) is for Web Direct customers only. It provides a monthly rollup of your bill based on the aggregate charges for each meter type.

- The [Cost Details API](/rest/api/cost-management/generate-cost-details-report) provides a granular view of the usage/cost records for each day. This is only available to enterprise customers.

### What's the difference between the Price Sheet API and the RateCard API?
These APIs provide similar sets of data but have different audiences:

- The [Price Sheet API](/rest/api/cost-management/price-sheet) provides the custom pricing that was negotiated for an Enterprise customer.

- The [Azure Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) provides public-facing pay-as-you-go pricing that applies to Web Direct customers.

## Next steps

- For information about using REST APIs retrieve prices for all Azure services, see [Azure Retail Prices overview](/rest/api/cost-management/retail-prices/azure-retail-prices).

- To compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal, see [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md).

- If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).