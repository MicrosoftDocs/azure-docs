---
title: Azure billing and cost management automation scenarios | Microsoft Docs
description: Learn how common billing and cost management scenarios are mapped to different APIs.
services: 'billing'
documentationcenter: ''
author: Erikre
manager: dougeby
editor: ''
tags: billing

ms.assetid: 204b15b2-6667-4b6c-8ea4-f32c06f287fd
ms.service: billing
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: billing
ms.date: 6/13/2018
ms.author: erikre
 
---

# Billing and cost management automation scenarios

Common scenarios for the billing and cost management space are identified below and mapped to different APIs that can be used in those scenarios. A summary of all the APIs available and the functionality they offer can be found underneath the scenario to API mapping. 

## Common scenarios

You can use the billing and cost management APIs in a variety of scenarios to answer cost and usage related questions.  An outline of common scenarios is provided below.

- **Invoice reconciliation** - Did Microsoft charge me the right amount?  What is my bill and can I calculate it myself?

- **Cross charges** - Now that I know how much I'm being charged, who in my organization needs to pay?

- **Cost optimization** - I know how much I've been charged, however, how can I get more out of the money I am spending on Azure?

- **Cost tracking** – I want to see how much I am spending and using Azure over time. What are the trends? How could I be doing better?

- **Azure spend during the month** – How much is my current month’s spend to date? Do I need to make any adjustments in my spending and/or usage of Azure? When during the month am I consuming Azure the most?

- **Set up alerts** – I would like to set up resource-based consumption or monetary-based alerting.

## Scenario to API mappings

|         API/Scenario        | Invoice Reconciliation    | Cross Charges    | Cost Optimization    | Cost Tracking    | Mid Month Spend    | Alerts    |
|:---------------------------:|:-------------------------:|:----------------:|:--------------------:|:----------------:|:------------------:|:---------:|
| Budgets                     |                           |                  |           X          |                  |                    |     X     |
| Marketplaces                |             X             |         X        |           X          |         X        |          X         |     X     |
| Price Sheet                 |             X             |         X        |           X          |         X        |          X         |           |
| Reservation recommendations |                           |                  |           X          |                  |                    |           |
| Reservation details         |                           |                  |           X          |         X        |                    |           |
| Reservation summaries       |                           |                  |           X          |         X        |                    |           |
| Usage details               |             X             |         X        |           X          |         X        |          X         |     X     |
| Billing periods             |             X             |         X        |           X          |         X        |                    |           |
| Invoices                    |             X             |         X        |           X          |         X        |                    |           |
| RateCard                    |             X             |                  |           X          |         X        |          X         |           |
| Unrated usage               |             X             |                  |           X          |                  |          X         |           |

> [!NOTE]
> The scenario to API mappings below do not include the Enterprise Consumption APIs. Where possible, please utilize the general Consumption APIs to address net new development scenarios moving forward.

## API summaries

### Consumption
(*Web Direct + Enterprise customers for all APIs except those called out below*)

-	**Budgets** (*Enterprise customers ONLY*): Use the [Budgets API](https://docs.microsoft.com/rest/api/consumption/budgets) to create either cost or usage budgets for resources, resource groups, or billing meters.  Once you have created budgets, alerting can be configured to notify when user defined budget thresholds are exceeded. Actions can also be configured to occur when budget amounts are reached.
-	**Marketplaces**: Use the [Marketplace Charges API](https://docs.microsoft.com/rest/api/consumption/marketplaces) to get charge and usage data on all Marketplace resources (Azure 3rd party offerings). This data can be used to add up costs across all Marketplace resources or investigate costs/usage on specific resource(s).
-	**Price sheet** (*Enterprise customers ONLY*): Enterprise customers can use the [Price Sheet API](https://docs.microsoft.com/rest/api/consumption/pricesheet) to retrieve their custom pricing for all meters. Enterprises can use this data in combination with usage details and marketplaces usage info to perform cost calculations using usage and marketplace data. 
-	**Reservation recommendations**: Use the [Reservation Recommendations API](https://docs.microsoft.com/rest/api/consumption/reservationrecommendations) to get recommendations for purchasing Reserved VM Instances. Recommendations are designed to allows customers to analyze expected cost savings and purchase amounts.
-	**Reservation details**: Use the [Reservation Details API](https://docs.microsoft.com/rest/api/consumption/reservationsdetails) to see info on previously purchased VM reservations, such as how much consumption has been reserved versus how much is actually being used. You can see data at per-VM-level detail.
-	**Reservation summaries**: Use the [Reservation Summaries API](https://docs.microsoft.com/rest/api/consumption/reservationssummaries) to see aggregate information on previously purchased VM reservations, such as how much consumption has been reserved versus how much is actually being used in the aggregate. 
-	**Usage details**: Use the [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usagedetails) to get charge and usage on all Azure 1st party resources. Information is in the form of usage detail records, which are currently emitted once per meter per day. Information can be used to add up the costs across all resources or investigate costs/usage on specific resource(s).
-	**RateCard**: Web Direct customers can use the [RateCard API](https://msdn.microsoft.com/library/azure/mt219005.aspx) to get their meter rates. They can then use the returned information with their resource usage information to manually calculate expected bill. 
-	**Unrated usage**: You can use the [Unrated Usage API](https://msdn.microsoft.com/library/azure/mt219003.aspx) to obtain raw usage information, prior to any metering/charging done by Azure.

### Billing
-	**Billing periods**: Use the [Billing Periods API](https://docs.microsoft.com/rest/api/billing/billingperiods) to determine a billing period to analyze, along with the invoice ID’s for that period. Invoice ID’s can be used with the Invoice API below. 
-	**Invoices**: Use the [Invoices API](https://docs.microsoft.com/rest/api/billing/invoices) to get the download URL for an invoice for a given billing period in PDF form.

### Enterprise consumption
*(All APIs Enterprise ONLY)*

-	**Balance summary**: Use the [Balance Summary API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) to get a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges. You can get this information for the current billing period or any period in the past. Enterprises can use this data to perform a comparison with manually calculated summary charges. This API does not provide resource-specific information or an aggregate view of costs.
-	**Usage details**: Use the [Usage Details API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) to get 1st party Azure usage detail information for the current month, a specific billing period, or a custom date period. Enterprises can use this data to manually calculate bill based on rate and consumption and can also use department/organization information present to attribute costs across organizations. The data provides a resource-specific view of usage/cost.
-	**Marketplace store charge**: Use the [Marketplace Store Charge API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge) to get 3rd party Azure usage detail information for the current month, a specific billing period, or a custom date period. Enterprises can use this data to manually calculate bill based on rate and consumption and can also use department/organization information present to attribute costs across organizations. The Marketplace store charge API provides a resource-specific view of usage/cost.
-	**Price sheet**: The [Price Sheet API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) provides the applicable rate for each Meter for the given Enrollment and Billing Period. This rate information can be used in combination with usage details and marketplaces usage info to manually calculate expected bill.
-	**Billing periods**: Use the [Billing Periods API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-billing-periods) to get a list of billing periods along with a property pointing to the API route for the four sets of Enterprise API data that pertain to that billing period - BalanceSummary, UsageDetails, Marketplace Charges, and PriceSheet.
-	**Azure reservation recommendations**: The [Reserved Instance Recommendations API](https://docs.microsoft.com/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation) looks at Customer's 7 days, 30 days, or 60 days of virtual machine usage and offers Single and Shared Purchase recommendations. The reserved instance API allows customers to analyze expected cost savings and recommended purchase amounts.

## Frequently asked questions

### What is the difference between the Enterprise Reporting APIs and the Consumption APIs? When should I use each?
These APIs have a similar set of functionality and can answer the same broad set of questions in the billing and cost management space. However, each API targets different audiences: 

- **Enterprise Reporting APIs**: These APIs are available to customers who have signed an Enterprise Agreement with Microsoft that grants them access to negotiated monetary commitments and custom pricing. The APIs require a key to use that can be obtained through the [Enterprise Portal](https://ea.azure.com). For a description of these APIs, see [Overview of Reporting APIs for Enterprise customers](billing-enterprise-api.md).

- **Consumption APIs**: These APIs are available to all customers, with a few exceptions. For more information, see [Azure consumption API overview](billing-consumption-api-overview.md) and the [Azure Consumption API reference](https://docs.microsoft.com/rest/api/consumption/). The provided APIs are the recommended solution for the latest development scenarios. 

### What is the difference between the Usage Details API and the Usage API?
These APIs provide fundamentally different data:

- **Usage Details**: The [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usagedetails) provides Azure usage and cost information per meter instance. The data provided has already passed through Azure’s cost metering system and had cost applied to it along with other possible changes:

    - Changes to account for the use of prepaid monetary commitments
    - Changes to account for usage discrepancies discovered by Azure

- **Usage**: The [Usage API](https://msdn.microsoft.com/library/Mt219003.aspx) provides raw Azure usage information before it passes through Azure’s cost metering system. This data may not have any correlation with the usage and/or charge amount that is seen after the Azure charge metering system.

### What is the difference between the Invoice API and the Usage Details API?
These APIs provide a different view of the same data. The [Invoice API](https://docs.microsoft.com/rest/api/billing/invoices) is for Web Direct customers only and provides a monthly roll up of your bill based on the aggregate charges for each meter type. The [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usagedetails) provides a granular view of the usage/cost records for each day and can be used by both Enterprise and Web Direct customers.

### What is the difference between the Price Sheet API and the RateCard API?
These APIs provide similar sets of data but have different audiences. Information below.

- Price Sheet API: The [Price Sheet API](https://docs.microsoft.com/rest/api/consumption/pricesheet) provides the custom pricing that has been negotiated for an Enterprise customer.
- RateCard API: THe [RateCard API](https://msdn.microsoft.com/library/mt219005.aspx) provides the public facing pricing that applies to Web Direct customers.

## Next Steps

- For information about using Azure APIs to programmatically get insight into your Azure usage, see [Azure Consumption API Overview](billing-consumption-api-overview.md) and [Azure Billing API Overview](billing-usage-rate-card-overview.md).
- To compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md)
- If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
