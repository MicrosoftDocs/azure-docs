---
title: Plan and manage costs for Azure API Management
description: Learn how to plan for and manage costs for Azure API Management by using cost analysis in the Azure portal.
author: dlepow
ms.author: danlep
ms.custom: subject-cost-optimization
ms.service: api-management
ms.topic: how-to
ms.date: 06/11/2021
---


# Plan and manage costs for API Management

This article describes how you plan for and manage costs for Azure API Management. First, you use the Azure pricing calculator to help plan for API Management costs before you add any resources for the service to estimate costs. After you've started using API Management resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. 

Costs for API Management are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for API Management, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using API Management

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add API Management. 

1. Search for *API Management*, or select **Integration** > **API Management**.
1. Select **View** to add a default cost estimate for an API Management service instance.

> [!NOTE]
> The costs shown in this example are for demonstration purposes only. See [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/) for the latest pricing information.

:::image type="content" source="media/plan-manage-costs/pricing-calculator-developer-tier.png" alt-text="Estimate costs for Developer tier":::

* The default cost estimate is based on an API Management service instance in the **Developer** [service tier](api-management-features.md) with 1 [capacity unit](api-management-capacity.md). The Developer tier is for non-production use cases and evaluations. It isn't backed by a service-level agreement.

* To estimate costs for additional capacity units or a different service tier, select other options from the **Units** and **Tier** dropdowns.

* Depending on the feature availability and service tier, additional charges may apply for use of [self-hosted gateways](self-hosted-gateway-overview.md).

For additional pricing and feature details, see:

* [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/)
* [Feature-based comparison of the Azure API Management tiers](api-management-features.md)

### Using monetary credit with API Management

You can pay for API Management charges with your Azure Prepayment (previously called monetary commitment). However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

## Understand the full billing model

As you use Azure resources with API Management, you incur costs, or billable meters. Azure resource usage unit costs vary by:
* Time intervals (seconds, minutes, hours, and days)
* Unit usage (bytes, megabytes, and so on)
* Number of transactions

### How you're charged for API Management

When you create or use Azure resources with API Management, you'll get charged based on tiers you're working in. Learn more about [choosing the best tier](./api-management-features.md) for you.

| Tiers | Description |
| ----- | ----------- |
| Consumption | Incurs no fixed costs. You are billed based on the number of API calls to the service above a certain threshold. |
| Developer, Basic, Standard, and Premium | Incur monthly costs, based on the number of [units](./api-management-capacity.md) and [self-hosted gateways](./self-hosted-gateway-overview.md). Self-hosted gateways are free for the Developer tier. [Upgrade](./upgrade-and-scale.md) to a different service tier at any time. |

You may also incur additional charges when you use other Azure resources with API Management, like virtual networks, availability zones, and multi-region writes. At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all API Management costs. There's a separate line item for each meter.

## Monitor costs

As soon as API Management use starts, costs are incurred. You can see the costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) or via the Azure Pricing Calculator.

When you use cost analysis, you view API Management costs in graphs and tables for different time intervals (day, current and prior month, and year). You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

> [!NOTE]
> The costs shown in this example are for demonstration purposes only. Your costs will vary depending on resource usage and current pricing.

To view API Management costs in cost analysis:

1. Sign in to the [Azure portal](https://azure.microsoft.com).
1. Open the **Cost Management + Billing** window, select **Cost management** from the menu, and then select a **Billing scope**. For example, select a subscription from the list.
1. Select **Cost Management** from the menu, and then select **Cost analysis**.
1. By default, monthly costs for all services are shown in the first donut chart. 

    :::image type="content" source="media/plan-manage-costs/api-management-cost-analysis.png" alt-text="Monthly costs for subscription":::

1. To narrow costs for a single service, such as API Management, select **Add filter** and then select **Service name**. Then, select **API Management**.

    :::image type="content" source="media/plan-manage-costs/api-management-apim-cost-analysis.png" alt-text="Example showing accumulated costs for API Management":::

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and API Management costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more about the filter options when you when create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need others to do additional data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs for API Management

### Scale using capacity units

Except in the Consumption service tier, API Management supports scaling by adding or removing [*capacity units*](api-management-capacity.md). As the load increases on an API Management instance, adding capacity units may be more economical than upgrading to a higher service tier. The maximum number of units depends on the service tier.

Each capacity unit has a certain request processing capability that depends on the service’s tier. For example, a unit of the Basic tier has an estimated maximum throughput of approximately 1,000 requests per second. 

As you add or remove units, capacity and cost scale proportionally. For example, two units of the Standard tier provide an estimated throughput of approximately 2,000 requests per second. Actual throughput may differ because of the size of requests or responses, connection patterns, number of clients making requests, and other factors.

[Monitor](api-management-howto-use-azure-monitor.md) the Capacity metric for your API Management instance to help make decisions whether to scale or upgrade an API Management instance to accommodate more load.

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- Learn about API Management [capacity](api-management-capacity.md).
- See steps to scale and upgrade API Management using the [Azure portal](upgrade-and-scale.md), and learn about [autoscaling](api-management-howto-autoscale.md).
