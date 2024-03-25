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

- **Single resource group scope** - Applies the savings plan benefit to eligible resources in the selected resource group only.
- **Single subscription scope** - Applies the savings plan benefit to eligible resources in the selected subscription.
- **Management group** - Applies the savings plan benefit to eligible resources within all subscriptions contained in both the management group and billing scope.
- **Shared scope** - Applies the savings plan benefit to eligible resources within subscriptions that are in the billing context. If a subscription was moved to different billing context, the benefit will no longer be applied to this subscription and will continue to apply to other subscriptions in the billing context.
  - For Enterprise Agreement customers, the billing context is the enrollment. The savings plan shared scope would include multiple Microsoft Entra tenants in an enrollment.
  - For Microsoft Customer Agreement customers, the billing scope is the billing profile. Usage from all billing subscriptions under the billing profile, is eligible to receive benefits for a Shared scoped savings plan.


## Scope processing order

While applying savings plan benefits to your usage, Azure processes savings plans in the following order:

1. Savings plans with a single resource group scope.
2. Savings plans with a single subscription scope.
3. Savings plans scoped to a management group.
4. Savings plans with a shared scope.

You can always update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction, so your savings plan term isn't changed. For more information about updating the scope, see [Update the scope](manage-savings-plan.md#change-the-savings-plan-scope) after you purchase a savings plan.

## Next steps

- [Change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope).
