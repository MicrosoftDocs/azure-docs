---
title: What is Azure savings plans for compute?
titleSuffix: Microsoft Cost Management
description: Learn how Azure savings plans help you save money by committing an hourly spend for one-year or three-year plan for Azure compute resources.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: overview
ms.date: 04/25/2024
ms.author: banders
---

# What is Azure savings plans for compute?

Azure savings plan for compute enables organizations to reduce eligible compute usage costs by up to 65% (off list pay-as-you-go rates) by making an hourly spend commitment for 1 or 3 years.
Unlike Azure reservations, which are targeted at stable and predictable workloads, Azure savings plans are targeted for dynamic and/or evolving workloads. To learn more, visit [Decide between a savings plan and a reservation](decide-between-savings-plan-reservation.md). Savings plans is a billing discount - it doesn't affect the runtime state of your resources. 

Azure savings plans is available to organizations with either Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), or Microsoft Partner Agreement (MPA) agreements. Enterprise Agreement customers must have an offer type of MS-AZR-0017P (EA) or MS-AZR-0148P (DevTest) to purchase Azure savings plans. To learn more, visit [Buy an Azure savings plan](buy-savings-plan.md).

Savings plan rates are priced in USD for MCA and MPA customers, and in local currency for EA customers. Each hour, eligible compute usage, up to commitment amount, is discounted and used to burn down the hourly commitment. Once the commitment amount is consumed, the remainder of the usage is billed at the customer's pay-as-you-go rate. Any unused commitment from any hour is lost. To learn more, visit [How saving plan discount is applied](discount-application.md).

Azure savings plan for compute supports products in different compute services. To learn more, visit [savings plan-eligible services](https://azure.microsoft.com/pricing/offers/savings-plan-compute/#Select-services). Savings plan discounts vary by product and by commitment term (1- or 3-years), not the commitment amount. To learn about included products, visit [included compute products](download-savings-plan-price-sheet.md).  Usage from certain virtual machines that power select compute and non-compute services (e.g. Azure Virtual Desktop, Azure Kubernetes Service, Azure Red Hat OpenShift and Azure Machine Learning) may be eligible for savings plan benefits.

Azure provides commitment recommendations based on your savings plan-eligible on-demand usage, your pay-as-you-go rates (inclusive of any discounts) and the 1- and 3-year savings plan rates. To learn more, visit [Azure savings plan recommendations](purchase-recommendations.md).

You can buy savings plans in the Azure portal or with the Savings plan API. To learn more, visit [Buy an Azure savings plan](buy-savings-plan.md). You can pay for a savings plan up front or monthly. The total cost of the up-front and monthly savings plan is the same. Savings plans are billed in local currency. For MCA/MPA customers transacting in non-USD currencies, monthly billed amounts will vary, based on the current month's market exchange rate for the customer's local currency.

## Why buy a savings plan?

If you have consistent compute spend, but your use of disparate resources makes Azure reservations infeasible, buying a savings plan gives you the ability to reduce your costs. For example, if you consistently spend at least $X every hour, but your usage comes from different resources and/or different datacenter regions, you likely can't effectively cover these costs with reservations. When you buy a savings plan, your hourly usage, up to your commitment amount, is discounted. For this usage, you no longer charged at the pay-as-you-go rates.

## How savings plan benefits are applied

With Azure savings plan, hourly usage charges incurred from [savings plan-eligible resources](https://azure.microsoft.com/pricing/offers/savings-plan-compute/#how-it-works), which are within the benefit scope of the savings plan, are discounted and applied to your hourly commitment until the hourly commitment is reached. The savings apply to *all eligible resources*. Usage charges above the commitment are billed at your on-demand rate.

You don't need to assign a savings plan to your compute resources. The savings plan benefit is applied automatically to compute usage that matches the savings plan scope. A savings plan purchase covers only the compute part of your usage. For example, for Windows VMs, the usage meter is split into two separate meters. There's a compute meter, which is same as the Linux meter, and a Windows IP meter. The charges that you see when you make the purchase are only for the compute costs. Charges don't include Windows software costs. For more information about software costs, see [Software costs not included with Azure savings plans](software-costs-not-included.md).

For more information about how savings plan discounts are applied, see [Savings plan discount application](discount-application.md).

For more information about how savings plan scope works, see [Saving plan scopes](scope-savings-plan.md).

## Determine your savings plan commitment
Azure provides commitment recommendations based on usage from your last 30 days. The recommendations are found in:

- [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/%7E/score)
- The savings plan purchase experience in the [Azure portal](https://portal.azure.com/)
- Benefit [Recommendation APIs](/rest/api/cost-management/benefit-recommendations/list)

For more information, see [Choose an Azure saving plan commitment amount](choose-commitment-amount.md).

## Buy a savings plan

You can purchase savings from the [Azure portal](https://portal.azure.com/) and APIs. For more information, see [Buy a savings plan](buy-savings-plan.md).

## How to find products covered under a savings plan
To learn about included products, visit [included compute products](download-savings-plan-price-sheet.md).

## How is a savings plan billed?
The savings plan is charged to the payment method tied to the subscription. The savings plan cost is deducted from your Azure Prepayment (previously called monetary commitment) balance, if available. When your Azure Prepayment balance doesn't cover the cost of the savings plan, you're billed the overage. If you have a subscription from an individual plan with pay-as-you-go rates, the credit card you have in your account is billed immediately for up-front and for monthly purchases. Monthly payments that you've made appear on your invoice. When get billed by invoice, you see the charges on your next invoice.

## Who can buy a savings plan?
To determine what roles are permitted to purchase savings plans, see [Permissions to buy an Azure savings plan](permission-buy-savings-plan.md).

## Who can manage a savings plan by default?
To determine which roles are permitted to manage a savings plan, see [Manage savings plan resources](manage-savings-plan.md).

## Get savings plan details and utilization after purchase
With sufficient permissions, you can view the savings plan and usage in the Azure portal. You can get the data using APIs, as well. For more information about savings plan permissions in the Azure portal, see [Permissions to view and manage Azure savings plans](permission-view-manage.md).

## Manage savings plan after purchase
To understand which properties and settings of a savings plan can be modified after purchase, see [Manage Azure savings plans](manage-savings-plan.md).

## Cancellation and refund policy
Savings plan purchases can't be canceled or refunded.

## Charges covered by savings plan
Savings plan covers compute charges from [savings plan-eligible products](https://azure.microsoft.com/pricing/offers/savings-plan-compute/#Select-services). It doesn't cover software, networking, or storage charges. For Windows virtual machines and SQL Database, the savings plan discount doesn't apply to the software costs. You might be able to cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Need help? Contact us.
If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps
- Learn [how discounts apply to savings plans](discount-application.md).
- [Trade in reservations for a savings plan](reservation-trade-in.md).
- [Buy a savings plan](buy-savings-plan.md).
