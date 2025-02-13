---
title: How an Azure saving plan discount is applied
titleSuffix: Microsoft Cost Management
description: Learn about how the discounts you receive are applied.
author: bandersmsft
ms.author: banders
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: conceptual
ms.date: 01/07/2025
---

# How saving plan discount is applied

Azure savings plans save you money when you have consistent usage of Azure compute resources. An Azure savings plan can help you save money by allowing you to commit to a fixed hourly spend on compute services for one-year or three-year terms. The savings can significantly reduce your resource costs by up to 65% from pay-as-you-go prices. Discount rates per meter vary by commitment term (1-year or 3-year), not commitment amount.

Each hour with savings plan, your eligible compute usage is discounted until you reach your commitment amount – subsequent usage after you reach your commitment amount is priced at pay-as-you-go rates.A resource within the savings plan's scope must generate the usage to be eligible for a savings plan benefit. Each hour's benefit is _use-it-or-lose-it_, and can't be rolled over to another hour.

The benefit is first applied to the product that has the greatest savings plan discount when compared to the equivalent pay-as-you-go rate (see your price list for savings plan pricing). The application prioritization is done to ensure that you receive the maximum benefit from your savings plan investment. We multiply the savings plan rate to that product's usage and deduct the result from the savings plan commitment. The process repeats until the commitment is exhausted (or until there's no more usage to consume the benefit).

A savings plan discount only applies to resources associated with Enterprise Agreement, Microsoft Partner Agreement, and Microsoft Customer Agreements. Resources that run in a subscription with other offer types don't receive the discount.

Here's a video that explains how an Azure savings plan is applied to the compute environment.

>[!VIDEO https://www.youtube.com/embed/AZOyh1rl3kU]

## Savings plans and VM reservations

If you have both dynamic and stable workloads, you likely have both Azure savings plans and VM reservations. Since reservation benefits are more restrictive than savings plans, and usually have greater discounts, Azure applies reservation benefits first.

For example, VM *X* has the highest savings plan discount of all savings plan-eligible resources you used in a particular hour. If you have an available VM reservation that's compatible with *X*, the reservation is consumed instead of the savings plan. The approach reduces the possibility of waste and it ensures that you’re always getting the best benefit.

## Savings plan and Azure consumption discounts

In most situations, an Azure savings plan provides the best combination of flexibility and pricing.  If you're operating under an Azure consumption discount (ACD), in rare occasions, you might have some pay-as-you-go rates that are lower than the savings plan rate. In these cases, Azure uses the lower of the two rates.

For example, VM *X* has the highest savings plan discount of all savings plan-eligible resources you used in a particular hour. If you have an ACD rate that is lower than the savings plan rate, the ACD rate is applied to your hourly usage. The result is decremented from your hourly commitment. The approach ensures you always get the best available rate.

## Benefit allocation window

With an Azure savings plan, you get significant and flexible discounts off your pay-as-you-go rates in exchange for a one or three-year spend commitment. When you use an Azure resource, usage details are periodically reported to the Azure billing system. The billing system is tasked with quickly applying your savings plan in the most beneficial manner possible. The plan benefits are applied to usage that has the largest discount percentage first. For the application to be most effective, the billing system needs visibility to your usage in a timely manner.

The Azure savings plan benefit application operates under a best fit benefit model. When your benefit application is evaluated for a given hour, the billing system incorporates usage arriving up to 48 hours after the given hour. During the sliding 48-hour window, you might see changes to charges, including the possibility of savings plan utilization that's greater than 100%. The situation happens because the system is constantly working to provide the best possible benefit application. Keep the 48-hour window in mind when you inspect your usage.

## Utilize multiple savings plans

Azure's intent is to always maximize the benefit you receive from savings plans. When you have multiple savings plans with the different term lengths, Azure applies the benefits from the three year plan first. The intent is to ensure that the best rates are applied first. If you have multiple savings plans that have different benefit scopes, Azure applies benefits from the more restrictively scoped plan first. The intent is to reduce the possibility of waste.

## When the savings plan term expires

At the end of the savings plan term, the billing discount expires, and the resources are billed at the pay-as-you go price. By default, the savings plans aren't set to renew automatically. You can choose to enable automatic renewal of a savings plan by selecting the option in the renewal settings.

## Related content

- [Manage Azure savings plans](manage-savings-plan.md)
