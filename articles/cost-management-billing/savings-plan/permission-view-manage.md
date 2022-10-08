---
title: Permissions to view and manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to view and manage your savings plan in the Azure portal.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/12/2022
ms.author: banders
---

# Permissions to view and manage Azure savings plans

This article explains how savings plan permissions work and how users can view and manage Azure savings plans in the Azure portal.

## Who can manage a savings plan by default

By default, the following users can view and manage savings plans:

- The person who buys a savings plan and the account administrator of the billing subscription used to buy the savings plan are added to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.
- Users with elevated access to manage all Azure subscriptions and management groups

The savings plan lifecycle is independent of an Azure subscription, so the savings plan isn't a resource under the Azure subscription. Instead, it's a tenant-level resource with its own Azure RBAC permission separate from subscriptions. Savings plans don't inherit permissions from subscriptions after the purchase.

## View and manage savings plans

If you're a billing administrator, use following steps to view, and manage all savings plans and savings plan transactions in the Azure portal.

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to  **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select **Products + services** > **Savings plans**.
1. The complete list of savings plans for your EA enrollment or billing profile is shown.

## Add billing administrators

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all savings plan orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage savings plans in  **Cost Management + Billing**.
  - Users with the _Enterprise Administrator (read only)_ role can only view the savings plan from  **Cost Management + Billing**.
  - Department admins and account owners can't view savings plans _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).
- For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## View savings plans with Azure RBAC access

If you purchased the savings plan or you're added to a savings plan, use the following steps to view and manage savings plans in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select  **All Services** > **Savings plans** to list savings plans that you have access to.

## Manage subscriptions and management groups with elevated access

You can elevate a user's [access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md). After you have elevated access:

1. Navigate to  **All Services** > **Savings plan** to see all savings plans that are in the tenant.
2. To make modifications to the savings plan, add yourself as an owner of the savings plan order using Access control (IAM).

## Grant access to individual savings plans

Users who have owner access on the savings plans, and billing administrators can delegate access management for an individual savings plan order in the Azure portal. To allow other people to manage savings plans, you have two options:

- Delegate access management for an individual savings plan order by assigning the Owner role to a user at the resource scope of the savings plan order. If you want to give limited access, select a different role.
 For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
  - For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all savings plan orders that apply to the Enterprise Agreement. Users with the _Enterprise Administrator (read only)_ role can only view the savings plan. Department admins and account owners can't view savings plans _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).
  - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Next steps

- [Manage savings plans](manage-savings-plan.md).
