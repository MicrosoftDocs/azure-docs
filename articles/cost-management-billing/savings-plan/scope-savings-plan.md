---
title: Savings plan scopes
titleSuffix: Microsoft Cost Management
description: Learn about savings plan scopes and how they're processed.
author: bandersmsft
ms.author: banders
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: conceptual
ms.date: 11/17/2023
---

# Savings plan scopes

Setting the scope for a savings plan selects where the benefits apply.

You have the following options to scope a savings plan, depending on your needs:

## Scope options

- **Resource group scope** - Applies benefits to eligible resources in the selected resource group.
- **Subscription scope** - Applies benefits to eligible resources in the selected subscription.
- **Management group** - Applies benefits to eligible resources from all subscriptions in both the management group and billing scope.
- **Shared scope** - Applies benefits to eligible resources within subscriptions that are in the EA enrollment or MCA billing profile.
  - If a subscription is moved to different enrollment/billing profile, benefits will no longer be applied to the subscription.
  - For EA customers, shared scope can include multiple Microsoft Entra tenants in the enrollment.



## Scope processing order
While applying savings plan benefits to your usage, Azure processes savings plans in the following order:
1. Savings plans with resource group scope.
2. Savings plans with subscription scope.
3. Savings plans with management group scope.
4. Savings plans shared scope.

You can always update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction, so your savings plan term isn't changed. For more information about updating the scope, see [Update the scope](manage-savings-plan.md#change-the-savings-plan-scope) after you purchase a savings plan.

## Related content

- [Change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope).
