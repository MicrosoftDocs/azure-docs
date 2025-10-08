---
title: Plan and Manage Costs for Azure API Management
description: Learn how to plan for and manage costs for Azure API Management by using cost analysis in the Azure portal.
author: dlepow
ms.author: danlep
ms.custom: subject-cost-optimization
ms.service: azure-api-management
ms.topic: how-to
ms.date: 10/08/2025
# Customer intent: As an API admin, I want to plan and manage costs for API Management by using cost analysis in the Azure portal. 
---


# Plan and manage costs for API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes how to plan for and manage costs for Azure API Management. First, you use the Azure pricing calculator to estimate costs to help plan for API Management costs before you add any resources for the service. After you start using API Management resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to take action. 

Costs for API Management are only a portion of the monthly costs on your Azure bill. Although this article explains how to plan for and manage costs for API Management, you're billed for all Azure services and resources used in your Azure subscription, including third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using API Management

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add API Management. 

1. Search for *API Management*, or select **Integration** > **API Management**.
1. Select **Add to estimate** > **View** to add a default cost estimate for an API Management service instance.

> [!NOTE]
> The costs shown in this example are for demonstration only. See [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/) for the latest pricing information.

:::image type="content" source="media/plan-manage-costs/pricing-calculator-developer-tier.png" alt-text="Screenshot that shows an estimate in the Azure pricing calculator.":::

* The default cost estimate is based on an API Management service instance in the **Basic** [service tier](api-management-features.md) with 1 [capacity unit](api-management-capacity.md).  

* To estimate costs for additional capacity units or a different service tier, select other options in the **Base Unit**, **Scale Out Units**, and **Tier** boxes.

* Depending on the feature availability and service tier, additional charges might apply for use of [self-hosted gateways](self-hosted-gateway-overview.md).

For additional pricing and feature details, see:

* [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/)
* [Feature-based comparison of the Azure API Management tiers](api-management-features.md)

### Using monetary credit with API Management

You can pay for API Management charges with your Azure Prepayment (previously called monetary commitment). However, you can't use Azure Prepayment credit to pay for charges for third-party products and services, including those from Azure Marketplace.

## Understand the full billing model

As you use Azure resources with API Management, you incur costs, or billable meters. Azure resource usage unit costs vary by:
* Time intervals (seconds, minutes, hours, and days)
* Unit usage (bytes, megabytes, and so on)
* Number of transactions

### How you're charged for API Management

When you create or use Azure resources with API Management, you're charged based on tiers that you work in. To choose the best tier for your scenario, see [Comparison of the Azure API Management tiers](./api-management-features.md).

| Tiers | Description |
| ----- | ----------- |
| Consumption | Incurs no fixed costs. You're billed based on the number of API requests to the service above a certain threshold. |
| Developer, Basic, Standard, Premium | Incur monthly costs, based on the number of [units](./api-management-capacity.md), [workspaces](workspaces-overview.md), and [self-hosted gateways](./self-hosted-gateway-overview.md). Self-hosted gateways are free in the Developer tier.  |
| Basic v2, Standard v2, Premium v2 | Incur monthly costs, based on the number of [units](./api-management-capacity.md). Above a certain threshold of API requests, additional requests are billed.  |

Different [upgrade](./upgrade-and-scale.md) options are available, depending on your service tier.

You might also incur additional charges when you use other Azure resources with API Management, like virtual networks, availability zones, and multi-region writes. At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all API Management costs. There's a separate line item for each meter.

## Monitor costs

As soon as you start using API Management, costs are incurred. You can see the costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) or in the Azure pricing calculator.

In cost analysis, you can view API Management costs in graphs and tables for different time intervals (week, month, year, and more). You can also view costs against budgets and forecasted costs. Switching to longer time intervals can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

> [!NOTE]
> The costs shown in this example are for demonstration only. Your costs will vary depending on resource usage and current pricing.

To view API Management costs in cost analysis:

1. Sign in to the [Azure portal](https://azure.microsoft.com).
1. In the left pane, select **Cost Management + Billing**. 
1. In the left pane, select **Billing scopes**. 
1. On the **Billing scopes** page, select a **Billing scope**. For example, select a subscription from the list.
1. In the left pane, under **Cost Management**, select **Cost analysis**.
1. By default, monthly costs for all services are shown in the first donut chart. 

    :::image type="content" source="media/plan-manage-costs/api-management-cost-analysis.png" alt-text="Screenshot that shows monthly costs for a subscription." lightbox="media/plan-manage-costs/api-management-cost-analysis.png":::

1. To view costs for a single service, such as API Management, select **Add filter** and then select **Service name**. Then select **API Management**.

    :::image type="content" source="media/plan-manage-costs/api-management-apim-cost-analysis.png" alt-text="Screenshot that shows accumulated costs for API Management." lightbox="media/plan-manage-costs/api-management-apim-cost-analysis.png":::

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and API Management costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

You can create budgets with filters for specific resources or services in Azure if you want more granularity in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-improved-exports.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. Exporting data is helpful when you need others to do additional data analysis for costs. For example, a finance team can analyze the data by using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs for API Management

### Scale by using capacity units

Except in the Consumption and Developer service tiers, API Management supports scaling by adding or removing [*capacity units*](api-management-capacity.md). As the load increases on an API Management instance, adding capacity units might be more economical than upgrading to a higher service tier. The maximum number of units depends on the service tier.

Each capacity unit has a certain request processing capability that depends on the service's tier. For example, a unit of the Basic tier has an estimated maximum throughput of approximately 1,000 requests per second. 

As you add or remove units, capacity and cost scale proportionally. For example, two units of the Standard tier provide an estimated throughput of approximately 2,000 requests per second. Actual throughput might differ because of the size of requests or responses, connection patterns, number of clients making requests, and other factors.

[Monitor](api-management-howto-use-azure-monitor.md) the Capacity metric for your API Management instance to help make decisions about whether to scale or upgrade an API Management instance to accommodate more load.

## Related content

- [Optimize your cloud investment by using Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs by using [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about [preventing unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)  course.
- Learn about API Management [capacity](api-management-capacity.md).
- Get steps for scaling and upgrading API Management by using the [Azure portal](upgrade-and-scale.md), and learn about [autoscaling](api-management-howto-autoscale.md).
