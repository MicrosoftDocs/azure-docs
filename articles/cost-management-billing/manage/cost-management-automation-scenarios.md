---
title: Automation scenarios for Azure billing and cost management
description: Learn how common billing and cost management scenarios are mapped to different APIs.
author: bandersmsft
ms.reviewer: adwise
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/22/2025
ms.author: banders
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
| Usage Details               |             X             |         X        |           X          |         X        |          X         |     X     |
| Billing Periods             |             X             |         X        |           X          |         X        |                    |           |
| Invoices                    |             X             |         X        |           X          |         X        |                    |           |
| Azure Retail Prices                    |             X             |                  |           X          |         X        |                    |           |


> [!NOTE]
> The scenario-to-API mapping doesn't include the Enterprise Consumption APIs. Where possible, use the general Consumption APIs for new development scenarios.

## API summaries

### Consumption
Web Direct and Enterprise customers can use all the following APIs, except where noted:

-    [Budgets API](/rest/api/consumption/budgets) (*Enterprise customers only*): Create either cost or usage budgets for resources, resource groups, or billing meters. When you've created budgets, you can configure alerts to notify you when you've exceeded defined budget thresholds. You can also configure actions to occur when you've reached budget amounts.

-    [Marketplace Charges API](/rest/api/consumption/marketplaces): Get charge and usage data on all Azure Marketplace resources (Azure partner offerings). You can use this data to add up costs across all Marketplace resources or to investigate costs/usage on specific resources.

-    [Price Sheet API](/rest/api/consumption/pricesheet) (*Enterprise customers only*): Get custom pricing for all meters. Enterprises can use this data in combination with usage details and marketplace usage information to calculate costs by using usage and marketplace data.

-    [Reservation Recommendations API](/rest/api/consumption/reservationrecommendations): Get recommendations for purchasing Reserved VM Instances. Recommendations help you analyze expected cost savings and purchase amounts. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Reservation Details API](/rest/api/consumption/reservationsdetails): See information on previously purchased VM reservations, such as how much consumption is reserved versus how much is used. You can see data at per-VM-level detail. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Reservation Summaries API](/rest/api/consumption/reservationssummaries): See aggregated information on VM reservations that your organization bought, like how much consumption is reserved versus how much is used in the aggregate. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

-    [Usage Details API](/rest/api/consumption/usagedetails): Get charge and usage information on all Azure resources from Microsoft. Information is in the form of usage detail records, which are currently emitted once per meter per day. You can use the information to add up the costs across all resources or investigate costs/usage on specific resources.

-    [Azure Retail Prices](/rest/api/cost-management/retail-prices/azure-retail-prices): Get meter rates with pay-as-you-go pricing. You can then use the returned information with your resource usage information to manually calculate the expected bill.

### Billing
-    Billing Periods API: Determine a billing period to analyze, along with the invoice IDs for that period. You can use invoice IDs with the Invoices API.

-    [Invoices API](/rest/api/billing/2019-10-01-preview/invoices): Get the download URL for an invoice for a billing period in PDF form.

### Enterprise consumption
The following APIs are for Enterprise only:

-    Balance Summary API: Get a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges. You can get this information for the current billing period or any period in the past. Enterprises can use this data to compare with manually calculated summary charges. This API does not provide resource-specific information or an aggregate view of costs.

-    Usage Details API: Get information about Azure usage (of Microsoft offerings) for the current month, a specific billing period, or a custom date period. Enterprises can use this data to manually calculate bills based on rate and consumption. Enterprises can also use department/organization information to attribute costs across organizations. The data provides a resource-specific view of usage/cost.

-    Marketplace Store Charge API: Get information about Azure usage (of partner offerings) for the current month, a specific billing period, or a custom date period. Enterprises can use this data to manually calculate bills based on rate and consumption. Enterprises can also use department/organization information to attribute costs across organizations. This API provides a resource-specific view of usage/cost.

-    Price Sheet API: Get the applicable rate for each meter for the given enrollment and billing period. You can use this rate information in combination with usage details and marketplace usage information to manually calculate the expected bill.

-    Billing Periods API: Get a list of billing periods. The API also gives you a property that points to the API route for the four sets of Enterprise API data that pertain to the billing period: BalanceSummary, UsageDetails, Marketplace Charges, and PriceSheet.

-    Reserved Instance Recommendations API: Look at 7 days, 30 days, or 60 days of virtual machine usage and get Single and Shared Purchase recommendations. You can use this API to analyze expected cost savings and recommended purchase amounts. For more information, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

## Frequently asked questions

### What's the difference between the Enterprise Reporting APIs and the Consumption APIs? When should I use each?
These APIs have a similar set of functionality and can answer the same broad set of questions in the billing and cost management space. But they target different audiences:

- Enterprise Reporting APIs are available to customers who have signed an Enterprise Agreement with Microsoft that grants them access to negotiated Azure Prepayment (previously called monetary commitment) and custom pricing. The APIs require a key that you can get from the Azure portal.

- Consumption APIs are available to all customers, with a few exceptions. For more information, see [Cost Management automation overview](../automate/automation-overview.md). We recommend the provided APIs as the solution for the latest development scenarios.

### What's the difference between the Invoice API and the Usage Details API?
These APIs provide a different view of the same data:

- The [Invoice API](/rest/api/billing/2019-10-01-preview/invoices) is for Web Direct customers only. It provides a monthly rollup of your bill based on the aggregate charges for each meter type.

- The [Usage Details API](/rest/api/consumption/usagedetails) provides a granular view of the usage/cost records for each day. Both Enterprise and Web Direct customers can use it.

### What's the difference between the Price Sheet API and the RateCard API?
These APIs provide similar sets of data but have different audiences:

- The [Price Sheet API](/rest/api/consumption/pricesheet) provides the custom pricing that was negotiated for an Enterprise customer.

- The [Azure Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) provides public-facing pay-as-you-go pricing that applies to Web Direct customers.

## Next steps

- For information about using REST APIs retrieve prices for all Azure services, see [Azure Retail Prices overview](/rest/api/cost-management/retail-prices/azure-retail-prices).

- To compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal, see [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md).

- If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).