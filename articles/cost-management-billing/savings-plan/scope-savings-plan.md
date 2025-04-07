---
title: Savings plan scopes
titleSuffix: Microsoft Cost Management
description: Learn about savings plan scopes and how they're processed.
author: nwokolo
ms.author: onwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: conceptual
ms.date: 02/26/2025
---

# Savings plan scopes

Setting the scope for a savings plan selects where the benefits apply.

You have the following options to scope a savings plan, depending on your needs:

## Scope options

- **Resource group scope** - Applies benefits to eligible resources in the selected resource group.
- **Subscription scope** - Applies benefits to eligible resources in the selected subscription.
- **Management group** - Applies benefits to eligible resources from all subscriptions that are in both:
  - the management group
  - the same Enrollment/Billing Profile as the subscription used to purchase the benefit
- **Shared scope** - Applies benefits to eligible resources within subscriptions that are in the EA Enrollment or MCA Billing Profile. The shared scope benefits applied to all Microsoft Entra tenants in the Enrollment/Billing Profile.

## Scope processing order
While applying savings plan benefits to your usage, Azure processes savings plans in the following order:
1. Savings plans with resource group scope.
2. Savings plans with subscription scope.
3. Savings plans with management group scope.
4. Savings plans shared scope.

You can always update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction, so your savings plan term isn't changed. For more information about updating the scope, see [Update the scope](manage-savings-plan.md#change-the-savings-plan-scope) after you purchase a savings plan.

## Related content

- [Change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope).
