---
title: Permissions to View and Manage Azure Reservations
description: Learn how to view and manage Azure reservations in the Azure portal.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 01/15/2026
ms.author: primittal
ms.custom:
  - devx-track-azurepowershell
  - sfi-ga-nochange
---

# Permissions to view and manage Azure reservations

This article explains how reservation permissions work in Azure and how authorized users can view and manage Azure reservations in the Azure portal and with Azure PowerShell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## <a name = "who-can-manage-a-reservation-by-default"></a> Users who can manage a reservation by default

By default, the following users can view and manage reservations:

- The user who buys a reservation
- The account administrator of the billing subscription used to buy the reservation
- Enterprise Agreement and Microsoft Customer Agreement billing administrators
- Users who have elevated access to manage all Azure subscriptions and management groups
- Users who have the Reservations Administrator or Reservations Contributor role, for reservations in their Microsoft Entra tenant (directory)

Users with the Reservations Reader role have read-only access to reservations in their Microsoft Entra tenant (directory).

The reservation lifecycle is independent of an Azure subscription. A reservation isn't a resource under the Azure subscription. It's a tenant-level resource with its own role-based access control permission that's separate from subscriptions. Reservations don't inherit permissions from subscriptions after the purchase.

## View and manage reservations

A user's ability to view, manage, and delegate permissions to reservations depends on two authorization methods:

- Billing admin roles
- Reservation role-based access control (RBAC) roles

## Billing admin roles

You can view, manage, and delegate permissions to reservations by using built-in billing admin roles. To learn more about Microsoft Customer Agreement and Enterprise Agreement billing roles, see [Understand Microsoft Customer Agreement administrative roles in Azure](../manage/understand-mca-roles.md) and [Managing Azure Enterprise Agreement roles](../manage/understand-ea-roles.md), respectively.

### Billing Admin roles required for reservation actions

#### View reservations

- **Microsoft Customer Agreement**: Users with the billing profile Reader role or higher
- **Enterprise Agreement**: Users with the Enterprise Administrator (read-only) role or higher
- **Microsoft Partner Agreement**: Not supported

#### Manage reservations (delegate permissions for the full billing profile or enrollment)

- **Microsoft Customer Agreement**: Users with the billing profile Contributor role or higher
- **Enterprise Agreement**: Users with the Enterprise Agreement Administrator role or higher
- **Microsoft Partner Agreement**: Not supported

#### Delegate reservation permissions

- **Microsoft Customer Agreement**: Users with the billing profile Contributor role or higher
- **Enterprise Agreement**: Users with the Enterprise Agreement Purchaser role or higher
- **Microsoft Partner Agreement**: Not supported

To purchase a reservation, Enterprise Agreement admins or billing profile owners must have Owner or Reservations Purchaser access on at least one Enterprise Agreement or Microsoft Customer Agreement subscription. This option is useful for enterprises that want a centralized team to purchase reservations. For more information, see [Buy an Azure reservation](prepare-buy-reservation.md).

### View and manage reservations as a Billing Admin

If you're a billing role user, follow these steps to view and manage all reservations and reservation transactions in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Cost Management + Billing**.
    - If you have an Enterprise Agreement account, select **Billing scopes** on the service menu. Then, select one of the billing scopes.
    - If you have a Microsoft Customer Agreement account, select **Billing profiles** on the service menu. Then, select one of the billing profiles.
1. On the service menu, select **Products + services** > **Reservations + Hybrid Benefit**. The complete list of reservations for your Enterprise Agreement enrollment or Microsoft Customer Agreement billing profile appears.

Users with the **Billing** role can take ownership of a reservation by selecting one or multiple reservations, and then selecting **Grant access** in the window that appears. If you have a Microsoft Customer Agreement account, the user should be in the same Microsoft Entra tenant (directory) as the reservation.

### Add billing admins

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- **Enterprise Agreement**: Users with the Enterprise Administrator role can view and manage all reservation orders that apply to the Enterprise Agreement. Users with the Enterprise Administrator role can view and manage reservations in **Cost Management + Billing**.
  - Users with the Enterprise Administrator (read-only) role can only view the reservation from **Cost Management + Billing**.
  - Department admins and account owners can't view reservations _unless_ you explicitly add them to the reservation by using the **Access control (IAM)** option. For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
- **Microsoft Customer Agreement**: Users with the billing profile Owner role or the billing profile Contributor role can manage all reservation purchases made by using the billing profile.
  - Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Azure reservation RBAC roles

Azure provides four reservation-specific RBAC roles with different permission levels:

- **Reservations Administrator**: Users with this role can manage one or more reservations in their Microsoft Entra tenant (directory). They can also [delegate RBAC roles](/azure/role-based-access-control/role-assignments-portal) to other users.
- **Reservations Purchaser**: Users with this role can purchase reservations with a specified subscription (even non-subscription owners).
- **Reservations Contributor**: Users with this role can manage one or more reservations in their Microsoft Entra tenant (directory) but can't delegate RBAC roles to other users.
- **Reservations Reader**: Users with this role have read-only access to one or more reservations in their Microsoft Entra tenant (directory).

These roles can be scoped to either a specific resource entity (for example, subscription or reservation) or the Microsoft Entra tenant. To learn more about RBAC, see [What is role-based access control (RBAC)?](../../role-based-access-control/overview.md).

### Azure reservation RBAC roles that you need for reservation actions

#### View reservations

- **Tenant scope**: Users with the Reservations Reader role or higher
- **Reservation scope**: Built-in reader roles or higher

#### Manage reservations

- **Tenant scope**: Users with the Reservations Contributor role or higher
- **Reservation scope**: Built-in contributor or owner roles, or Reservations Contributor or higher

#### Delegate reservation permissions

- **Tenant scope**: You need [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights to grant RBAC roles to all reservations in the tenant. To gain these rights, follow [Elevate access steps](../../role-based-access-control/elevate-access-global-admin.md).
- **Reservation scope**: Users with the Reservations Administrator or User Access Administrator role.

In addition, users who were subscription owners when the subscription was used to purchase a reservation can also view, manage, and delegate permissions for the purchased reservation.

### View and manage reservations with RBAC access

If you have reservation-specific RBAC roles (Reservations Administrator, Purchaser, Contributor, or Reader), if you purchased reservations, or if you were added as an owner to reservations, follow these steps to view and manage reservations in the Azure portal:

1. Sign in to the Azure portal.
1. Select **Home** > **Reservations** to list reservations to which you have access.

> [!TIP]
> If you can't see your reservations, ensure you're signed in with the account that has the appropriate permissions. For cross-tenant scenarios, make sure you're in the correct tenant context.

### Delegate reservation RBAC roles

In this section, you learn how to:

- Delegate the Reservations Purchaser role to a specific subscription.
- Delegate the Reservations Administrator, Contributor, or Reader roles to a specific reservation.
- Delegate the Reservations Administrator, Contributor, or Reader roles to all reservations.

Users and groups who gain the ability to purchase, manage, or view reservations via RBAC roles must access reservations from **Home** > **Reservation**.

> [!NOTE]
> Enterprise administrators can take ownership of a reservation order. They can add other users to a reservation by using the **Access control (IAM)** option.

#### Delegate the Reservation Purchaser role to a specific subscription

To delegate the Reservations Purchaser role to a specific subscription, first make sure you have elevated access. Then, follow these steps:

1. Go to **Home** > **Reservations** to see all reservations in the tenant.
2. To make modifications to the reservation, add yourself as an owner of the reservation order by using the **Access control (IAM)** option.

#### Delegate Reservation Administrator, Contributor, or Reader roles to a specific reservation

To delegate the Administrator, Contributor, or Reader roles to a specific reservation:

1. Go to **Home** > **Reservations**.
1. Select the reservation.
1. Select **Access control (IAM)** on the service menu.
1. Select **Add**, and then select **Add role assignment** from the top navigation bar.

#### Delegate Reservation Administrator, Contributor, or Reader roles to all reservations

You need [User Access administrator rights](../../role-based-access-control/built-in-roles.md#user-access-administrator) to grant RBAC roles at the tenant level. To get User Access administrator rights, [follow the steps to elevate access](../../role-based-access-control/elevate-access-global-admin.md?toc=/azure/cost-management-billing/reservations/toc.json).

To delegate the Administrator, Contributor, or Reader role to all reservations in a tenant:

1. Go to **Home** > **Reservations**.
1. Select **Role assignment** from the top navigation bar and choose the role that you want.

## Grant access to individual reservations

Users who have owner access on the reservations and billing administrators can delegate access management for an individual reservation order in the Azure portal.

To allow other people to manage reservations, you have two options:

- Delegate access management for an individual reservation order by assigning the Owner role to a user at the resource scope of the reservation order. If you want to give limited access, select a different role.
  For detailed steps, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
  - **Enterprise Agreement**: Users with the Enterprise Administrator role can view and manage all reservation orders that apply to the Enterprise Agreement. Users with the Enterprise Administrator (read-only) role can only view the reservation. Department admins and account owners can't view reservations _unless_ you explicitly add them to the reservation by using the **Access control (IAM)** option. For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).
  - **Microsoft Customer Agreement**: Users with the billing profile Owner role or the billing profile Contributor role can manage all reservation purchases made by using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

> [!NOTE]
> Enterprise administrators can take ownership of a reservation order. They can add other users to a reservation by using the **Access control (IAM)** option.

## Grant access by using PowerShell

Users who have owner access for reservations orders, users who have elevated access, and users who have the User Access Administrator role can delegate access management for all reservation orders that they have access to.

Access that you grant by using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command to view assigned roles.

For details on granting access by using PowerShell, see [Grant RBAC access to reservations by using PowerShell](manage-reservations-rbac-powershell.md).

## Related content

- [Manage Azure reservations](manage-reserved-vm-instance.md)
- [Understand how reservation discounts are applied](reservation-discount-application.md)
