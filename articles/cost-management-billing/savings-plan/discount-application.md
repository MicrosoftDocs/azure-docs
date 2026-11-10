---
title: How a savings plan discount is applied
titleSuffix: Microsoft Cost Management
description: Learn about how the discounts you receive are applied.
author: nwokolo
ms.author: onwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: concept-article
ms.date: 10/29/2026
---

# How a savings plan discount is applied

Savings plans save you money when you have consistent usage of eligible Azure compute or database resources. A savings plan lets you commit to a fixed hourly spend for a one-year or three-year term. Savings plans for compute offer savings of up to 65% compared with pay-as-you-go prices, while savings plans for databases offer savings of up to 35%. Discount rates per meter vary by commitment term (1-year or 3-year), not commitment amount.

Each hour, your savings plan discounts eligible usage until you reach your commitment amount. Usage beyond your commitment amount is priced at pay-as-you-go rates. Eligibility depends on the selected plan type: a compute savings plan applies to eligible compute usage, and a database savings plan applies to eligible database usage. The resource that generates the usage must also be within the savings plan's benefit scope. Each hour's benefit is _use-it-or-lose-it_, and can't be rolled over to another hour.

Azure first applies the benefit to the product with the greatest savings plan discount compared with the equivalent pay-as-you-go rate (see your price list for savings plan pricing). This priority order helps maximize the benefit of your savings plan investment. Azure multiplies the savings plan rate by that product's usage and deducts the result from the savings plan commitment. The process repeats until the commitment is exhausted or there's no more eligible usage.

A savings plan discount applies only to resources associated with an Enterprise Agreement, Microsoft Partner Agreement, or Microsoft Customer Agreement. Resources in subscriptions with other offer types don't receive the discount.

The following video shows how a compute savings plan applies to a compute environment.

>[!VIDEO https://www.youtube.com/embed/AZOyh1rl3kU]

## Changes to savings plan discounts

As with the pay-as-you-go model, savings plan prices are subject to change. All price changes take effect on the first day of the month. Current savings plan pricing applies to benefits regardless of when the active savings plan was purchased.

## Savings plans and reservations

If you have both dynamic and stable workloads, you might have both savings plans and reservations. Because reservation benefits are more restrictive than savings plan benefits and usually offer greater discounts, Azure applies reservation benefits first.

For a compute example, VM _X_ has the highest compute savings plan discount of all eligible compute resources you used in a particular hour. If you have an available VM reservation that's compatible with _X_, the reservation is consumed instead of the savings plan. The approach reduces the possibility of waste and it ensures that you’re always getting the best benefit.

## Savings plan and Azure consumption discounts

In most situations, a savings plan provides the best combination of flexibility and pricing. If you have an Azure consumption discount (ACD), you might occasionally have pay-as-you-go rates that are lower than the savings plan rate. In these cases, Azure uses the lower of the two rates.

For a compute example, VM _X_ has the highest compute savings plan discount of all eligible compute resources you used in a particular hour. If you have an ACD rate that is lower than the savings plan rate, the ACD rate is applied to your hourly usage. The result is decremented from your hourly commitment. The approach ensures you always get the best available rate.

## Benefit allocation window

With a savings plan, you get significant and flexible discounts off your pay-as-you-go rates in exchange for a one or three-year spend commitment. When you use an Azure resource, usage details are periodically reported to the Azure billing system. The billing system is tasked with quickly applying your savings plan in the most beneficial manner possible. The plan benefits are applied to usage that has the largest discount percentage first. For the application to be most effective, the billing system needs visibility to your usage in a timely manner.

The savings plan benefit application operates under a best fit benefit model. When your benefit application is evaluated for a given hour, the billing system incorporates usage arriving up to 48 hours after the given hour. During the sliding 48-hour window, you might see changes to charges, including the possibility of savings plan utilization that's greater than 100%. The situation happens because the system is constantly working to provide the best possible benefit application. Keep the 48-hour window in mind when you inspect your usage.

## Utilize multiple savings plans

Azure's intent is to always maximize the benefit you receive from savings plans. When you have multiple savings plans with different term lengths, Azure applies the benefits from the three-year plan first. The intent is to ensure that the best rates are applied first. If you have multiple savings plans that have different benefit scopes, Azure applies benefits from the more restrictively scoped plan first. The intent is to reduce the possibility of waste.

## When the savings plan term expires

At the end of the savings plan term, the billing discount expires, and the resources are billed at the pay-as-you-go price. By default, the savings plans aren't set to renew automatically. You can choose to enable automatic renewal of a savings plan by selecting the option in the renewal settings.

## Related content

- [Manage savings plans](manage-savings-plan.md)
