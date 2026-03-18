---
title: What are savings plans?
titleSuffix: Microsoft Cost Management
description: Learn how savings plans help you save money by committing an hourly spend for one-year or three-year plan to Microsoft Cloud resources.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: overview
ms.date: 01/08/2026
ms.author: onwokolo
---

# What are savings plans?

A savings plan is a commitment-based discount. You agree to spend a fixed dollar amount per hour for a set period (1 or 3 years), and in return you get lower prices on eligible usage. Savings plan discounts vary by product and by commitment term (1- or 3-year), not the commitment amount. Savings plans are billing offers - they don't affect the runtime state of your resources.

## How do savings plan discounts work?

Savings plan benefits are applied automatically each hour to eligible usage within the plan’s scope, starting with the usage that receives the highest discount. The discounted cost is then deducted from the plan’s hourly commitment, and any remaining eligible usage is billed at regular pay‑as‑you‑go rates once the commitment is fully used. Unused commitment for an hour expires and does not roll over. To learn more, visit [How savings plan discount is applied](discount-application.md).

## How do savings plans compare with reservations?

Savings plans and reservations both offer discounts for committing ahead of time, but they work differently.
Savings plans are based on a dollar‑per‑hour spend commitment and automatically apply across eligible services and regions, making them ideal for changing or dynamic workloads. Reservations lock in savings for a specific resource, size, and region, which delivers deeper discounts but works best when usage is stable and predictable. To learn more, visit [Decide between a savings plan and a reservation](decide-between-savings-plan-reservation.md).

## What savings plans are available

There are two savings plans - Savings plan for compute and Savings plan for databases.
The compute savings plan is available as a 1-year or 3-year commitment, while the database savings plan is available as a 1-year commitment.

Savings plan for compute applies to infrastructure costs from a broad set of Azure compute services, including:
- Azure Virtual Machines
- Azure App Service
- Azure Functions premium plan
- Azure Container Instances
- Azure Dedicated Host
- Azure Container Apps
- Azure Spring Apps for Enterprise

> [!NOTE]
> In addition, infrastructure costs from other services running on eligible compute infrastructure may also benefit from Savings plan for compute. Savings plan for compute doesn't cover software, networking, or storage charges. You might be able to cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

Savings plan for databases applies to infrastructure and software IP costs for database services which include:
- Azure SQL Database
- Azure SQL Managed Instance
- Azure SQL Database Hyperscale
- Azure SQL Database serverless
- Azure Database for PostgreSQL
- Azure Database for MySQL
- Azure Cosmos DB
- Azure DocumentDB
- Azure Database Migration Service
- SQL Server on Azure Virtual Machines hourly licenses
- SQL Server enabled by Azure Arc hourly licenses

> [!NOTE]
> Savings plan for databases will also be consumed by SQL Server on Azure Virtual Machines and SQL Server enabled by Azure Arc hourly license at the normal pay-as-you-go price.

## How are savings plans purchased?

You can make a new savings plan commitment or trade-in one or more eligible reservations for a savings plan.
Purchases and trade-ins can be made in Azure portal or with the Savings plan API. Savings plan rates are priced in USD for MCA and MPA customers, and in local currency for EA customers. Savings plans are always billed in local currency. For MCA/MPA customers transacting in non-USD currencies, monthly billed amounts will vary, based on the current month's market exchange rate for the customer's local currency. You can pay for a savings plan up front or monthly. The total cost of the up-front and monthly savings plan is the same.

## How is a savings plan billed?
The savings plan is charged to the payment method tied to the subscription. The savings plan cost is deducted from your Azure Prepayment (previously called monetary commitment) balance, if available. When your Azure Prepayment balance doesn't cover the cost of the savings plan, you're billed the overage. If you have a subscription from an individual plan with pay-as-you-go rates, the credit card you have in your account is billed immediately for up-front and for monthly purchases. Monthly payments that you've made appear on your invoice. When you get billed by invoice, you see the charges on your next invoice.

## Cancellation and refund policy
Savings plan purchases can't be canceled or refunded.

## Determine your savings plan commitment
Azure provides commitment recommendations based on your savings plan eligible on-demand usage, your pay-as-you-go rates (inclusive of any discounts) and the 1- and 3-year savings plan rates. The recommendations are found in:
- [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/%7E/score)
- The savings plan purchase experience in the [Azure portal](https://portal.azure.com/)
- Benefit [Recommendation APIs](/rest/api/cost-management/benefit-recommendations/list)
To learn more, visit [Savings plan recommendations](purchase-recommendations.md).

## How savings plan benefits are applied
With savings plan, hourly usage charges incurred from [savings plan-eligible resources](https://azure.microsoft.com/pricing/offers/savings-plan/#how-it-works), which are within the benefit scope of the savings plan, are discounted and applied to your hourly commitment until the hourly commitment is reached. The savings apply to *all eligible resources*. Usage charges above the commitment are billed at your on-demand rate.

## How to find products covered under a savings plan
To learn about included products, visit [included products](download-savings-plan-price-sheet.md).

## Which customers may purchase savings plans
Savings plans are available to organizations with either Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), or Microsoft Partner Agreement (MPA) agreements. Enterprise Agreement customers must have an offer type of MS-AZR-0017P (EA) or MS-AZR-0148P (DevTest) to purchase savings plans.

## Who can buy a savings plan?
To determine what roles are permitted to purchase savings plans, see [Permissions to buy an savings plan](permission-buy-savings-plan.md).

## Who can manage a savings plan by default?
To determine which roles are permitted to manage a savings plan, see [Manage savings plan resources](manage-savings-plan.md).

## Get savings plan details and utilization after purchase
With sufficient permissions, you can view the savings plan and usage in the Azure portal. You can get the data using APIs, as well. For more information about savings plan permissions in the Azure portal, see [Permissions to view and manage savings plans](permission-view-manage.md).

## Manage savings plan after purchase
To understand which properties and settings of a savings plan can be modified after purchase, see [Manage savings plans](manage-savings-plan.md).

## Changes to savings plans discounts
Like the pay-as-you-go model, prices under savings plans are subject to change. All price changes take effect on the first day of the month. Regardless of when an active savings plan was purchased, current savings plan pricing is used when applying savings plan benefits.

## Need help? Contact us.
If you have savings plan questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides savings plan expert support requests in English.

## Next steps
- Learn [how discounts apply to savings plans](discount-application.md).
- [Trade in reservations for a savings plan](reservation-trade-in.md).
- [Buy a savings plan](buy-savings-plan.md).
