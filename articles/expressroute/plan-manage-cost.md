---
title: Plan to manage costs for Azure ExpressRoute
description: Learn how to plan for and manage costs for Azure ExpressRoute by using cost analysis in the Azure portal.
author: duongau
ms.author: duau
ms.custom: subject-cost-optimization
ms.service: expressroute
ms.topic: how-to
ms.date: 12/27/2022
---

# Plan and manage costs for Azure ExpressRoute

This article describes how you can plan for and manage costs for Azure ExpressRoute. First, you use the Azure pricing calculator to help plan for ExpressRoute costs before you add any resources for the service to estimate costs. Next, as you add Azure resources, review the estimated costs. 

After you've started using Azure ExpressRoute resources, use the Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. The costs for Azure ExpressRoute are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure ExpressRoute, you're billed for all Azure services and resources used in your Azure subscription, including any third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Local vs. Standard vs. Premium

Azure ExpressRoute has three different circuit SKU: [*Local*](./expressroute-faqs.md#expressroute-local), *Standard*, and [*Premium*](./expressroute-faqs.md#expressroute-premium). The way you're charged for your ExpressRoute usage varies between these three SKU types. With Local SKU, you're automatically charged with an Unlimited data plan. With Standard and Premium SKU, you can select between a Metered or an Unlimited data plan. All ingress data are free of charge except when using the Global Reach add-on. It's important to understand which SKU types and data plan works best for your workload to best optimize cost and budget.

## Estimate costs before using Azure ExpressRoute

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you create an Azure ExpressRoute circuit. 

1. On the left, select **Networking**, then select **Azure ExpressRoute** to begin. 

1. Select the appropriate *Zone* depending on your peering location. Refer to [ExpressRoute connectivity providers](./expressroute-locations-providers.md#partners) to select the appropriate *Zone* in the drop-down. 

1. Then select the *SKU*, *Circuit Speed*, and the *Data Plan* you would like an estimate for. 

1. In the *Additional outbound data transfer*, enter an estimate in GB of how much outbound data you might use over the course of a month. 

1. Lastly, you can add the *Global Reach Add-on* to the estimate.

The following screenshot shows the cost estimation by using the calculator:

:::image type="content" source="media/plan-manage-cost/capacity-calculator-cost-estimate.png" alt-text="ExpressRoute Cost estimate in Azure calculator":::

For more information, see [Azure ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

### ExpressRoute gateway estimated cost

If you're using an ExpressRoute gateway to link a virtual network to the ExpressRoute circuit, use the following steps to estimate cost for gateway usage.

1. On the left, select **Networking**, then select **VPN Gateway** to begin. 

1. Select the *Region* for the gateway and then change *Type* to **ExpressRoute Gateways**.

1. Select the *Gateway Type* from the drop-down.

1. Enter the *Gateway hours*. (720 hours = 30 days)

## Understand the full billing model for ExpressRoute

Azure ExpressRoute runs on Azure infrastructure that accrues costs along with ExpressRoute when you deploy the new resource. It's important to understand that extra infrastructure might accrue cost. You need to manage that cost when you make changes to deployed resources. 

### Costs that typically accrue with ExpressRoute

#### ExpressRoute

When you create an ExpressRoute circuit, you might choose to create an ExpressRoute gateway to link your virtual networks to the circuit. ExpressRoute Gateways are charged at an hourly rate plus the cost of an ExpressRoute circuit. See [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute) and select ExpressRoute Gateways to see rates for different gateway SKUs.

Inbound data transfer is included in the monthly cost of the ExpressRoute circuit for all three SKUs. Outbound data transfer is only included for an unlimited data plan. For a Metered data plan, outbound data transfer is charged per GB used based on the zone number of the [peering location](expressroute-locations-providers.md#partners).

#### ExpressRoute Direct

ExpressRoute Direct has a monthly port fee that includes the circuit fee for Local and Standard SKU ExpressRoute circuits. For Premium SKU circuits, there's an extra circuit fee. Outbound data transfer is charged per GB used depending on the zone number of the peering location. The outbound data charge only applies to Standard and Premium SKUs.
 
#### ExpressRoute Global Reach

ExpressRoute Global Reach is an add-on you can enable for ExpressRoute and ExpressRoute Direct to link ExpressRoute circuits together. Inbound and outbound data transfer is charged per GB used depending on the zone number of the peering location.

### Costs might accrue after resource deletion

If you have an ExpressRoute gateway after deleting the ExpressRoute circuit, you'll still be charged for the cost until you delete it.

### Using Azure Prepayment credit

You can pay for ExpressRoute charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including the ones from the Azure Marketplace.

## Monitor costs

As you use Azure resources with ExpressRoute, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) As soon as ExpressRoute use starts, costs are incurred and you can see the costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view ExpressRoute circuit costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view ExpressRoute costs in cost analysis:

1. Sign in to the Azure portal.

1. Go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the menu. Select **Scope** to switch to a different scope in cost analysis. By default, cost for services are shown in the first donut chart.

    Actual monthly costs are shown when you initially open cost analysis. Here's an example showing all monthly usage costs.

    :::image type="content" source="media/plan-manage-cost/cost-analysis-pane.png" alt-text="Example showing accumulated costs for a subscription":::
    

1.  To narrow costs for a single service, like Expressroute, select **Add filter** and then select **Service name**. Then, select **ExpressRoute**.

    Here's an example showing costs for just ExpressRoute.

    :::image type="content" source="media/plan-manage-cost/cost-analysis-pane-expressroute.png" alt-text="Example showing accumulated costs for ExpressRoute":::

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and ExpressRoute costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets and alerts

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more about the filter options when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. Exporting cost data is helpful when you need or others to do data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Next steps

- Learn more on how pricing works with Azure ExpressRoute. See [Azure ExpressRoute Overview pricing](https://azure.microsoft.com/pricing/details/expressroute/).
- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
