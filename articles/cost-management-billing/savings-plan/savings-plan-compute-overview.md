---
title: What are Azure savings plans for compute?
titleSuffix: Microsoft Cost Management
description: Learn how Azure savings plans help you save money by committing an hourly spend for one-year or three-year plan for Azure compute resources.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: overview
ms.date: 10/12/2022
ms.author: banders
---

# What are Azure savings plans for compute?

Azure savings plans save you money when you have consistent usage of Azure compute resources. An Azure savings plan helps you save money by allowing you to commit to a fixed hourly spend on compute services for one-year or three-year terms. A savings plan can significantly reduce your resource costs by up to 66% from pay-as-you-go prices. Discount rates per meter vary by commitment term (1-year or 3-year), not commitment amount.

Each hour with savings plan, your compute usage is discounted until you reach your commitment amount – subsequent usage afterward is priced at pay-as-you-go rates. Savings plan commitments are priced in USD for Microsoft Customer Agreement and Microsoft Partner Agreement customers, and in local currency for Enterprise Agreement customers. Usage from compute services such as VMs, dedicated hosts, container instances, Azure premium functions, and Azure app services are eligible for savings plan discounts.

You can acquire a savings plan by making a new commitment, or you can trade in one or more active reservations for a savings plan. When you acquire a savings plan with a reservation trade in, the reservation is canceled. The prorated residual value of the unused reservation benefit is converted to the equivalent hourly commitment for the savings plan. The commitment may not be sufficient for your needs, and while you may not reduce it, you can increase it to cover your needs.

After you purchase a savings plan, the discount automatically applies to matching resources. Savings plans provide a billing discount and don't affect the runtime state of your resources.

You can pay for a savings plan up front or monthly. The total cost of up-front and monthly savings plan is the same and you don't pay any extra fees when you choose to pay monthly.

You can buy a savings plan in the Azure portal.

## Why buy a savings plan?

If you have consistent compute spend, buying a savings plan gives you the option to reduce your costs. For example, when you continuously run instances of a service without a savings plan, you're charged at pay-as-you-go rates. When you buy a savings plan, your compute usage is immediately eligible for the savings plan discount. Your discounted rates add-up to the commitment amount. Usage covered by a savings plan receives discounted rates, not the pay-as-you-go rates.

## How savings plan discount is applied

Almost immediately after purchase the savings plan benefit begins to apply without other action required by you. Every hour, we apply benefit to savings plan-eligible meters that are within the savings plan's scope. The benefits are applied to the meter with the greatest discount percentage first. Savings plan scope selects where the savings plan benefit applies.

For more information about how discount is applied, see [Savings plan discount application](discount-application.md).

For more information about how savings plan scope works, see [Scope savings plans](buy-savings-plan.md#scope-savings-plans).

## Determine what to purchase

Usage from compute services such as VMs, dedicated hosts, container instances, Azure premium functions and Azure app services are eligible for savings plan benefits. Consider savings plan purchases based on your consistent compute usage. You can determine your optimal commitment by analyzing your usage data or by using the savings plan recommendation. Recommendations are available in:

- Azure Advisor (VMs only)
- Savings plan purchase experience in the Azure portal
- Cost Management Power BI app
- APIs

For more information, see [Choose an Azure saving plan commitment amount](choose-commitment-amount.md)

## Buying a savings plan

You can purchase savings plans from the Azure portal. For more information, see [Buy a savings plan](buy-savings-plan.md).

## How is a savings plan billed?

The savings plan is charged to the payment method tied to the subscription. The savings plan cost is deducted from your Azure Prepayment (previously called monetary commitment) balance, if available. When your Azure Prepayment balance doesn't cover the cost of the savings plan, you're billed the overage. If you have a subscription from an individual plan with pay-as-you-go rates, the credit card you have on your account is billed immediately for up-front and for monthly purchases. Monthly payments that's you've made appear on your invoice. When you're billed by invoice, you see the charges on your next invoice.

## Who can manage a savings plan by default

By default, the following users can view and manage savings plans:

- The person who buys a savings plan, and the account administrator of the billing subscription used to buy the savings plan are added to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.

To allow other people to manage savings plans, see [Manage savings plan resources](manage-savings-plan.md).

## Get savings plan details and utilization after purchase

With sufficient permissions, you can view the savings plan and usage in the Azure portal. You can get the data using APIs, as well.

For more information about savings plan permissions in the Azure portal, see [Permissions to view and manage Azure savings plans](permission-view-manage.md)

## Manage savings plan after purchase

After you buy an Azure savings plan, you can update the scope to apply the savings plan to a different subscription and change who can manage the savings plan.

For more information, see [Manage Azure savings plans](manage-savings-plan.md).

## Cancellation and refund policy

Savings plan purchases can't be canceled or refunded.

## Charges covered by savings plan

- **Virtual Machines** - A savings plan only covers the virtual machine and cloud services compute costs. It doesn't cover other software, Windows, networking, or storage charges.
- **Azure Dedicated Host** - Only the compute costs are included with the Dedicated host.
- **Container Instances** 
- **Azure Premium Functions**
- **Azure App Services** - Not all App Services are eligible.

Some exclusions apply to the above services.

For Windows virtual machines and SQL Database, the savings plan discount doesn't apply to the software costs. You can cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- Learn [how discounts apply to savings plans](discount-application.md).
- [Trade in reservations for a savings plan](reservation-trade-in.md).
- [Buy a savings plan](buy-savings-plan.md).
