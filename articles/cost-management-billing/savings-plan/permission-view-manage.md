---
title: Permissions to view and manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to view and manage your savings plan in the Azure portal.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Permissions to view and manage Azure savings plans

This article explains how savings plan permissions work and how users can view and manage Azure savings plans in the Azure portal.

After you buy an Azure savings plan, with sufficient permissions, you can make the following types of changes to a savings plan:

- Change who has access to, and manage, a savings plan
- Update savings plan name
- Update savings plan scope
- Change auto-renewal settings

Except for auto-renewal, none of the changes cause a new commercial transaction or change the end date of the savings plan.

You can't make the following types of changes after purchase:

- Hourly commitment
- Term length
- Billing frequency

## Who can manage a savings plan by default

By default, the following users can view and manage savings plans:

- The person who buys a savings plan and the account administrator of the billing subscription used to buy the savings plan are added to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.
- Users with elevated access to manage all Azure subscriptions and management groups.

The savings plan lifecycle is independent of an Azure subscription, so the savings plan isn't a resource under the Azure subscription. Instead, it's a tenant-level resource with its own Azure RBAC permission separate from subscriptions. Savings plans don't inherit permissions from subscriptions after the purchase.

## Grant access to individual savings plans

Users who have owner access on the savings plan and billing administrators can delegate access management for an individual savings plan order in the Azure portal.

To allow other people to manage savings plans, you have two options:

- Delegate access management for an individual savings plan order by assigning the Owner role to a user at the resource scope of the savings plan order. If you want to give limited access, select a different role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
  - For an Enterprise Agreement, add users with the Enterprise Administrator role to view and manage all savings plan orders that apply to the Enterprise Agreement. Users with the Enterprise Administrator (read only) role can only view the savings plan. Department admins and account owners can't view savings plans unless they're explicitly added to them using Access control (IAM). For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
  - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## View and manage savings plans as a billing administrator

If you're a billing administrator, use following steps to view and manage all savings plans and savings plan transactions in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select **Products + services** > **Savings plans**.
    The complete list of savings plans for your EA enrollment or billing profile is shown.
1. Billing administrators can take ownership of a savings plan with the [Savings Plan Order - Elevate REST API](/rest/api/billingbenefits/savings-plan-order/elevate) to give themselves Azure RBAC roles.

### Adding billing administrators

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- For an Enterprise Agreement, add users with the Enterprise Administrator role to view and manage all savings plan orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage savings plan in **Cost Management + Billing**.
  - Users with the _Enterprise Administrator (read only)_ role can only view the savings plan from **Cost Management + Billing**.
  - Department admins and account owners can't view savings plans unless they're explicitly added to them using Access control (IAM). For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
- For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. 
    - Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## View savings plans with Azure RBAC access

If you purchased the savings plan or you're added to a savings plan, use the following steps to view and manage savings plans in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Savings plans** to list savings plans that you have access to.

## Manage subscriptions and management groups with elevated access

You can [elevate a user's access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).

After you have elevated access:

1. Navigate to **All Services** > **Savings plans** to see all savings plans that are in the tenant.
2. To make modifications to the savings plan, add yourself as an owner of the savings plan order using Access control (IAM).

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md).
