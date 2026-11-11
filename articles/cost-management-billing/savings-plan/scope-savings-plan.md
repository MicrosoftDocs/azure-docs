---
title: Savings plan scopes
titleSuffix: Microsoft Cost Management
description: Learn about savings plan scopes and how they're processed.
author: nwokolo
ms.author: onwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: concept-article
ms.date: 10/29/2026
---

# Savings plan scopes

The scope of a savings plan determines where its benefits apply.

You have the following options to scope a savings plan, depending on your needs:

## Scope options

- **Resource group scope** - Applies benefits to eligible resources in the selected resource group.
- **Subscription scope** - Applies benefits to eligible resources in the selected subscription.
- **Management group** - Applies benefits to eligible resources from all subscriptions that are in both:
  - The management group.
  - The same enrollment or billing profile as the subscription used to purchase the benefit.
- **Shared scope** - Applies benefits to eligible resources within subscriptions in the EA enrollment or MCA billing profile. Shared scope benefits apply across all Microsoft Entra tenants in the enrollment or billing profile.

## Scope processing order
While applying savings plan benefits to your usage, Azure processes savings plans in the following order:
1. Savings plans with resource group scope.
2. Savings plans with subscription scope.
3. Savings plans with management group scope.
4. Savings plans with shared scope.

You can update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction, so it doesn't change your savings plan term. For more information, see [Update the scope](manage-savings-plan.md#change-the-savings-plan-scope).

## Related content

- [Change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope).
