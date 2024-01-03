---
title: What is Azure savings plans for compute?
titleSuffix: Microsoft Cost Management
description: Learn how Azure savings plans help you save money by committing an hourly spend for one-year or three-year plan for Azure compute resources.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: overview
ms.date: 11/17/2023
ms.author: banders
---

# What is Azure savings plans for compute?

Azure savings plan for compute is a flexible pricing model. It provides savings up to 65% off pay-as-you-go pricing when you commit to spend a fixed hourly amount on compute services for one or three years. Committing to a savings plan allows you to get discounts, up to the hourly commitment amount, on the resources you use. Savings plan commitments are priced in USD for MCA and CSP customers, and in local currency for EA customers. Savings plan discounts vary by meter and by commitment term (1-year or 3-year), not commitment amount. Savings plans provide a billing discount and don't affect the runtime state of your resources

You can pay for a savings plan up front or monthly. The total cost of the up-front and monthly savings plan is the same.

You can buy savings plans in the [Azure portal](https://portal.azure.com/) or with the [Savings Plan Order Alias API](/rest/api/billingbenefits/savings-plan-order-alias).

## Why buy a savings plan?

If you have consistent compute spend, but your use of disparate resources makes reservations infeasible, buying a savings plan gives you the ability to reduce your costs. For example, if you consistently spend at least $X every hour, but your usage comes from different resources and/or different datacenter regions, you likely can't effectively cover these costs with reservations. When you buy a savings plan, your hourly usage, up to your commitment amount, is discounted. For this usage, you no longer charged at the pay-as-you-go rates.

## How savings plan benefits are applied

With Azure savings plan, hourly usage charges incurred from [savings plan-eligible resources](https://azure.microsoft.com/pricing/offers/savings-plan-compute/#how-it-works), which are within the benefit scope of the savings plan, are discounted and applied to your hourly commitment until the hourly commitment is reached. Usage charges above the commitment are billed at your on-demand rate.

You don't need to assign a savings plan to your compute resources. The savings plan benefit is applied automatically to compute usage that matches the savings plan scope. A savings plan purchase covers only the compute part of your usage. For example, for Windows VMs, the usage meter is split into two separate meters. There's a compute meter, which is same as the Linux meter, and a Windows IP meter. The charges that you see when you make the purchase are only for the compute costs. Charges don't include Windows software costs. For more information about software costs, see [Software costs not included with Azure savings plans](software-costs-not-included.md).

For more information about how savings plan discounts are applied, see [Savings plan discount application](discount-application.md).

For more information about how savings plan scope works, see [Saving plan scopes](scope-savings-plan.md).

## Determine your savings plan commitment

Usage from [savings plan-eligible resources](https://azure.microsoft.com/pricing/offers/savings-plan-compute/#how-it-works) is eligible for savings plan benefits.

In addition, virtual machines used with the [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/products/kubernetes-service/), [Azure Virtual Desktop (AVD)](https://azure.microsoft.com/products/virtual-desktop/), and [Azure Red Hat OpenShift (ARO)](https://azure.microsoft.com/products/openshift/) are eligible for the savings plan.

It's important to consider your hourly spend when you determine your hourly commitment. Azure provides commitment recommendations based on usage from your last 30 days. The recommendations are found in:

- [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/%7E/score)
- The savings plan purchase experience in the [Azure portal](https://portal.azure.com/)
- Benefit [Recommendation APIs](/rest/api/cost-management/benefit-recommendations/list)

For more information, see [Choose an Azure saving plan commitment amount](choose-commitment-amount.md).

## Buy a savings plan

You can purchase savings from the [Azure portal](https://portal.azure.com/) and APIs. For more information, see [Buy a savings plan](buy-savings-plan.md).

## How to find products covered under a savings plan

The complete list of savings plan eligible products is found in your price sheet, which can be downloaded from the [Azure portal](https://portal.azure.com). The EA portal price sheet doesn't include savings plan pricing. After you download the file, filter `Price Type` by `Savings Plan` to see the one-year and three-year prices.

## How is a savings plan billed?

The savings plan is charged to the payment method tied to the subscription. The savings plan cost is deducted from your Azure Prepayment (previously called monetary commitment) balance, if available. When your Azure Prepayment balance doesn't cover the cost of the savings plan, you're billed the overage. If you have a subscription from an individual plan with pay-as-you-go rates, the credit card you have in your account is billed immediately for up-front and for monthly purchases. Monthly payments that you've made appear on your invoice. When get billed by invoice, you see the charges on your next invoice.

## Who can buy a savings plan?

To determine what roles are permitted to purchase savings plans, see [Who can buy a savings plan](buy-savings-plan.md#who-can-buy-a-savings-plan).

## Who can manage a savings plan by default?

By default, the following users can view and manage savings plans:

- The person who buys a savings plan, and the account administrator of the billing subscription used to buy the savings plan are added to the savings plan order.
- EA and MCA billing administrators.

To allow other people to manage savings plans, see [Manage savings plan resources](manage-savings-plan.md).

## Get savings plan details and utilization after purchase

With sufficient permissions, you can view the savings plan and usage in the Azure portal. You can get the data using APIs, as well. For more information about savings plan permissions in the Azure portal, see [Permissions to view and manage Azure savings plans](permission-view-manage.md).

## Manage savings plan after purchase

After you buy an Azure savings plan, you can update the scope to apply the savings plan to a different subscription and change who can manage the savings plan. For more information, see [Manage Azure savings plans](manage-savings-plan.md).

## Cancellation and refund policy

Savings plan purchases can't be canceled or refunded.

## Charges covered by savings plan

- Virtual Machines - A savings plan only covers the virtual machine compute costs. It doesn't cover other software, Windows, networking, or storage charges. Virtual machines don't include BareMetal Infrastructure or the :::no-loc text="Av1"::: series. Spot VMs aren't covered by savings plans.
- Azure Dedicated Hosts - Only the compute costs are included with the dedicated hosts.
- Container Instances
- Azure Container Apps
- Azure Premium Functions
- Azure App Services - The Azure savings plan for compute can only be applied to the App Service upgraded Premium v3 plan and the upgraded Isolated v2 plan.
- On-demand Capacity Reservation

Exclusions apply to the above services.

For Windows virtual machines and SQL Database, the savings plan discount doesn't apply to the software costs. You might be able to cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps

- Learn [how discounts apply to savings plans](discount-application.md).
- [Trade in reservations for a savings plan](reservation-trade-in.md).
- [Buy a savings plan](buy-savings-plan.md).
