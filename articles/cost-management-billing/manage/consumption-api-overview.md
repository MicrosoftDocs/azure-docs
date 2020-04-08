---
title: Azure consumption API overview
description: Learn how Azure Consumption APIs give you programmatic access to cost and usage data for your Azure resources.
author: bandersmsft
tags: billing
ms.service: cost-management-billing
ms.topic: reference
ms.date: 02/12/2020
ms.author: banders
---

# Azure consumption API overview

The Azure Consumption APIs give you programmatic access to cost and usage data for your Azure resources. These APIs currently only support Enterprise Enrollments and Web Direct Subscriptions (with a few exceptions). The APIs are continually updated to support other types of Azure subscriptions.

Azure Consumption APIs provide access to:
- Enterprise and Web Direct Customers
    - Usage Details
    - Marketplace Charges
    - Reservation Recommendations
    - Reservation Details
    - Reservation Summaries
- Enterprise Customers Only
    - Price sheet
    - Budgets
    - Balances

## Usage Details API

Use the Usage Details API to get charge and usage data for all Azure 1st party resources. Information is in the form of usage detail records which are currently emitted once per meter per resource per day. Information can be used to add up the costs across all resources or investigate costs / usage on specific resource(s).

The API includes:

-	**Meter Level Consumption Data** - See data including usage cost, the meter emitting the charge, and what Azure resource the charge pertains to. All usage detail records map to a daily bucket.
-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Filtering** - Trim your API result set down to a smaller set of usage detail records using the following filters:
    - Usage end / usage start
    - Resource Group
    - Resource Name
-	**Data Aggregation** - Use OData to apply expressions to aggregate usage details by tags or filter properties
-	**Usage for different offer types** - Usage detail information is currently available for Enterprise and Web Direct customers.

For more information, see the technical specification for the [Usage Details API](https://docs.microsoft.com/rest/api/consumption/usagedetails).

## Marketplace Charges API

Use the Marketplace Charges API to get charge and usage data on all Marketplace resources (Azure 3rd party offerings). This data can be used to add up costs across all Marketplace resources or investigate costs / usage on specific resource(s).

The API includes:

-	**Meter Level Consumption Data** - See data including marketplace usage cost, the meter emitting the charge, and what resource the charge pertains to. All usage detail records map to a daily bucket.
-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Filtering** - Trim your API result set down to a smaller set of marketplace records using the following filters:
    - Usage start / usage end
    - Resource Group
    - Resource Name
-	**Usage for different offer types** - Marketplace information is currently available for Enterprise and Web Direct customers.

For more information, see the technical specification for the [Marketplace Charges API](https://docs.microsoft.com/rest/api/consumption/marketplaces).

## Balances API

Enterprise customers can use the Balances API to get a monthly summary of information on balances, new purchases, Azure Marketplace service charges, adjustments, and overage charges. You can get this information for the current billing period or any period in the past. Enterprises can use this data to perform a comparison with manually calculated summary charges. This API does not provide resource-specific information and an aggregate view of costs.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Enterprise Customers Only** This API is only available EA customers.
    - Customers must have Enterprise Admin permissions to call this API

For more information, see the technical specification for the [Balances API](https://docs.microsoft.com/rest/api/consumption/balances).

## Budgets API

Enterprise customers can use this API to create either cost or usage budgets for resources, resource groups, or billing meters. Once this information has been determined, alerting can be configured to notify when user-defined budget thresholds are exceeded.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Enterprise Customers Only** - This API is only available EA customers.
-	**Configurable Notifications** - Specify user(s) to be notified when the budget is tripped.
-	**Usage or Cost Based Budgets** - Create your budget based on either consumption or cost as needed by your scenario.
-	**Filtering** - Filter your budget to a smaller subset of resources using the following configurable filters
    - Resource Group
    - Resource Name
    - Meter
-	**Configurable budget time periods** - Specify how often the budget should reset and how long the budget is valid for.

For more information, see the technical specification for the [Budgets API](https://docs.microsoft.com/rest/api/consumption/budgets).

## Reservation Recommendations API

Use this API to get recommendations for purchasing Reserved VM Instances. Recommendations are designed to allows customers to analyze expected cost savings and purchase amounts.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Filtering** - Tailor your recommendation results using the following filters:
    - Scope
    - Lookback period
-	**Reservation info for different offer types** - Reservation information is currently available for Enterprise and Web Direct customers.

For more information, see the technical specification for the [Reservation Recommendations API](https://docs.microsoft.com/rest/api/consumption/reservationrecommendations).

## Reservation Details API

Use the Reservation Details API to see info on previously purchased VM reservations such as how much consumption has been reserved versus how much is actually being used. You can see data at a per VM level detail.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Filtering** - Trim your API result set down to a smaller set of reservations using the following filter:
    - Date range
-	**Reservation info for different offer types** - Reservation information is currently available for Enterprise and Web Direct customers.

For more information, see the technical specification for the [Reservation Details API](https://docs.microsoft.com/rest/api/consumption/reservationsdetails).

## Reservation Summaries API

Use this API to see aggregate information on previously purchased VM reservations such as how much consumption has been reserved versus how much is actually being used in the aggregate.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Filtering** - Tailor your results when using the daily grain with the following filter:
    - Usage Date
-	**Reservation info for different offer types** - Reservation information is currently available for Enterprise and Web Direct customers.
-	**Daily or monthly aggregations** – Callers can specify whether they want their reservation summary data in the daily or monthly grain.

For more information, see the technical specification for the [Reservation Summaries API](https://docs.microsoft.com/rest/api/consumption/reservationssummaries).

## Price Sheet API
Enterprise customer can use this API to retrieve their custom pricing for all meters. Enterprises can use this in combination with usage details and marketplaces usage info to perform cost calculations using usage and marketplace data.

The API includes:

-	**Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com), the [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli) or [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
-	**Enterprise Customers Only** - This API is only available EA customers. Web Direct customers should use the RateCard API to get pricing.

For more information, see the technical specification for the [Price Sheet API](https://docs.microsoft.com/rest/api/consumption/pricesheet).

## Scenarios

Here are some of the scenarios that are made possible via the consumption APIs:

-	**Invoice Reconciliation** - Did Microsoft charge me the right amount?  What is my bill and can I calculate it myself?
-	**Cross Charges** - Now that I know how much I'm being charged, who in my org needs to pay?
-	**Cost Optimization** - I know how much I've been charged… how can I get more out of the money I am spending on Azure?
-	**Cost Tracking** - I want to see how much I am spending and using Azure over time. What are the trends? How could I be doing better?
-	**Azure spend during the month** - How much is my current month’s spend to date? Do I need to make any adjustments in my spending and/or usage of Azure? When during the month am I consuming Azure the most?
-	**Set up alerts** - I would like to set up resource-based consumption or monetary-based alerting based on a budget.

## Next Steps

- For information about using Azure Billing APIs to programmatically get insight into your Azure usage, see [Azure Billing API Overview](usage-rate-card-overview.md).
