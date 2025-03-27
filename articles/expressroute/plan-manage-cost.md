---
title: Plan to manage costs for Azure ExpressRoute
description: Learn how to plan for and manage costs for Azure ExpressRoute by using cost analysis in the Azure portal.
author: duongau
ms.author: duau
ms.custom: subject-cost-optimization
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 01/31/2025
---

# Plan and manage costs for Azure ExpressRoute

This article explains how to plan and manage costs for Azure ExpressRoute. Start by using the Azure pricing calculator to estimate costs before adding any resources. As you add resources, review the estimated costs.

Once you start using Azure ExpressRoute, use Cost Management features to set budgets and monitor costs. Review forecasted costs and spending trends to identify areas for action. Remember, Azure ExpressRoute costs are only part of your total Azure bill, which includes all services and resources in your subscription.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types. For a full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). You need at least read access to view cost data. For information on assigning access, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md).

## Local vs. Standard vs. Premium

Azure ExpressRoute offers three circuit SKUs: [*Local*](./expressroute-faqs.md#expressroute-local), *Standard*, and [*Premium*](./expressroute-faqs.md#expressroute-premium). Charges vary by SKU. Local SKU includes an Unlimited data plan. Standard and Premium SKUs offer Metered or Unlimited data plans. All ingress data is free except with the Global Reach add-on. Choose the best SKU and data plan for your workload to optimize costs.

## Estimate costs before using Azure ExpressRoute

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before creating an Azure ExpressRoute circuit.

1. Select **Networking** > **Azure ExpressRoute**.
2. Choose the appropriate *Zone* based on your peering location. Refer to [ExpressRoute connectivity providers](./expressroute-locations-providers.md#partners).
3. Select the *SKU*, *Circuit Speed*, and *Data Plan*.
4. Enter an estimate for *Additional outbound data transfer* in GB.
5. Optionally, add the *Global Reach Add-on*.

The following screenshot shows a cost estimate using the calculator:

:::image type="content" source="media/plan-manage-cost/capacity-calculator-cost-estimate.png" alt-text="ExpressRoute Cost estimate in Azure calculator":::

For more information, see [Azure ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute/).

### ExpressRoute gateway estimated cost

To estimate costs for an ExpressRoute gateway:

1. Select **Networking** > **VPN Gateway**.
2. Choose the *Region* and change *Type* to **ExpressRoute Gateways**.
3. Select the *Gateway Type*.
4. Enter the *Gateway hours* (720 hours = 30 days).

## Understand the full billing model for ExpressRoute

Azure ExpressRoute runs on Azure infrastructure, which accrues costs along with ExpressRoute. Manage these costs when making changes to deployed resources.

### Costs that typically accrue with ExpressRoute

#### ExpressRoute

Creating an ExpressRoute circuit may involve creating an ExpressRoute gateway, charged hourly plus the circuit cost. See [ExpressRoute pricing](https://azure.microsoft.com/pricing/details/expressroute) for rates.

Inbound data transfer is included in the monthly cost for all SKUs. Outbound data transfer is included only for Unlimited plans. Metered plans charge per GB based on the [peering location](expressroute-locations-providers.md#partners).

#### ExpressRoute Direct

ExpressRoute Direct has a monthly port fee, including the circuit fee for Local and Standard SKUs. Premium SKUs have an extra circuit fee. Outbound data transfer is charged per GB for Standard and Premium SKUs.

#### ExpressRoute Global Reach

ExpressRoute Global Reach links ExpressRoute circuits and charges per GB for inbound and outbound data transfer based on the peering location.

### Costs might accrue after resource deletion

Deleting an ExpressRoute circuit but keeping the gateway will still incur charges until the gateway is deleted.

### Using Azure Prepayment credit

You can use Azure Prepayment credit for ExpressRoute charges but not for partner products and services, including Azure Marketplace.

## Monitor costs

As you use Azure resources with ExpressRoute, costs accrue. Costs vary by time intervals or unit usage. View costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

To view ExpressRoute costs:

1. Sign in to the Azure portal.
2. Go to **Subscriptions**, select a subscription, and then select **Cost analysis**.
3. Select **Scope** to switch scopes. Costs for services are shown in the first donut chart.

    :::image type="content" source="media/plan-manage-cost/cost-analysis-pane.png" alt-text="Example showing accumulated costs for a subscription":::

4. To filter for ExpressRoute, select **Add filter** > **Service name** > **ExpressRoute**.

    :::image type="content" source="media/plan-manage-cost/cost-analysis-pane-expressroute.png" alt-text="Example showing accumulated costs for ExpressRoute":::

## Create budgets and alerts

Create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) and [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and notify stakeholders of spending anomalies. Budgets and alerts are useful for monitoring Azure subscriptions and resource groups.

Budgets can include filters for specific resources or services. For more on filter options, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

[Export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account for analysis. Exporting is useful for finance teams using Excel or Power BI. You can export costs daily, weekly, or monthly and set custom date ranges.

## Next steps

- Learn more on how pricing works with Azure ExpressRoute. See [Azure ExpressRoute Overview pricing](https://azure.microsoft.com/pricing/details/expressroute/).
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).
- Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md).
- Take the [Cost Management](/training/paths/control-spending-manage-bills) guided learning course.
