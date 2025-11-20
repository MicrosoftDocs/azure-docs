---
title: Permissions to view and manage Azure reservations
description: Learn how to view and manage Azure reservations in the Azure portal.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 10/28/2025
ms.author: primittal
ms.custom:
  - devx-track-azurepowershell
  - sfi-ga-nochange
---

# Permissions to view and manage Azure reservations

This article explains how reservation permissions work in Azure and how authorized users can view and manage Azure reservations in the Azure portal and with Azure PowerShell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Who can manage a reservation by default

By default, the following users can view and manage reservations:

- The person who buys a reservation and the account administrator of the billing subscription used to buy the reservation are added to the reservation order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.
- Users with elevated access to manage all Azure subscriptions and management groups
- A Reservation administrator or Reservation contributor, for reservations in their Microsoft Entra tenant (directory)
- A Reservation reader has read-only access to reservations in their Microsoft Entra tenant (directory)

The reservation lifecycle is independent of an Azure subscription. A reservation isn't a resource under the Azure subscription but rather a tenant-level resource with its own Azure RBAC permission separate from subscriptions. Reservations don't inherit permissions from subscriptions after the purchase.

## View and manage reservations
Two different authorization methods control a user's ability to view, manage, and delegate permissions to reservations:

- Billing admin roles
- Reservation role-based access control (RBAC) roles

## Billing Admin roles
You can view, manage, and delegate permissions to reservations by using built-in billing admin roles. To learn more about Microsoft Customer Agreement and Enterprise Agreement billing roles, see [Understand Microsoft Customer Agreement administrative roles in Azure](../manage/understand-mca-roles.md) and [Managing Azure Enterprise Agreement roles](../manage/understand-ea-roles.md), respectively.

### Billing Admin roles required for reservation actions

**View reservations:**
- Microsoft Customer Agreement: Users with billing profile reader or above
- Enterprise Agreement: Users with Enterprise Administrator (read-only) or above
- Microsoft Partner Agreement: Not supported

**Manage reservations** (achieved by delegating permissions for the full billing profile/enrollment):
- Microsoft Customer Agreement: Users with billing profile contributor or above
- Enterprise Agreement: Users with Enterprise Agreement administrator or above
- Microsoft Partner Agreement: Not supported

**Delegate reservation permissions:**
- Microsoft Customer Agreement: Users with billing profile contributor or above
- Enterprise Agreement: Users with Enterprise Agreement purchaser or above
- Microsoft Partner Agreement: Not supported

EA admins or Billing Profile Owners must have owner or reservation purchaser access on at least one EA or MCA subscription to purchase a reservation. This option is useful for enterprises that want a centralized team to purchase reservations. For more information, see [Buy an Azure reservation](prepare-buy-reservation.md).

### View and manage reservations as a Billing Admin

If you're a billing role user, follow these steps to view and manage all reservations and reservation transactions in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're under an Enterprise Agreement account, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're under a Microsoft Customer Agreement account, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Reservations + Hybrid Benefit**. The complete list of reservations for your Enterprise Agreement enrollment or Microsoft Customer Agreement billing profile appears.

Billing role users can take ownership of a reservation by selecting one or multiple reservations, selecting **Grant access** in the window that appears. For a Microsoft Customer Agreement, the user should be in the same Microsoft Entra tenant (directory) as the reservation.

### Add Billing Admins

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- **Enterprise Agreement**: Add users with the _Enterprise administrator_ role to view and manage all reservation orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage reservations in **Cost Management + Billing**.
  - Users with the _Enterprise administrator (read-only)_ role can only view the reservation from **Cost Management + Billing**.
  - Department admins and account owners can't view reservations _unless_ they're explicitly added to them by using Access control (IAM). For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).

- **Microsoft Customer Agreement**: Users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile.
  - Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Reservation RBAC roles

### Overview 

Azure provides four reservation-specific RBAC roles with different permission levels:

- **Reservation administrator**: Allows management of one or more reservations in their Microsoft Entra Tenant (directory) and [delegation of RBAC roles](/azure/role-based-access-control/role-assignments-portal) to other users.
- **Reservation purchaser**: Allows purchase of reservations with a specified subscription even for non-subscription owners. 
- **Reservation contributor**: Allows management of one or more reservations in their Microsoft Entra tenant (directory) but not delegation of RBAC roles to other users.
- **Reservation reader**: Allows read-only access to one or more reservations in their Microsoft Entra tenant (directory).

These roles can be scoped to either a specific resource entity (for example, subscription or reservation) or the Microsoft Entra tenant. To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).


### Reservation RBAC roles required for reservation actions

**View reservations:**
- Tenant scope: Users with reservation reader or above
- Reservation scope: Built-in reader or above

**Manage reservations:**
- Tenant scope: Users with reservation contributor or above
- Reservation scope: Built-in contributor or owner roles, or reservation contributor or above

**Delegate reservation permissions:**
- Tenant scope: [User Access administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required to grant RBAC roles to all reservations in the tenant. To gain these rights, follow [Elevate access steps](../../role-based-access-control/elevate-access-global-admin.md)
- Reservation scope: Reservation administrator or user access administrator

In addition, users who held the subscription owner role when the subscription was used to purchase a reservation can also view, manage, and delegate permissions for the purchased reservation.

### View and manage reservations with RBAC access

If you have reservation-specific RBAC roles (reservation administrator, purchaser, contributor, or reader), purchased reservations, or were added as an owner to reservations, follow these steps to view and manage reservations in the Azure portal:

1. Sign in to the Azure portal
2. Select **Home** > **Reservations** to list reservations to which you have access

> [!TIP]
> If you can't see your reservations, ensure you're signed in with the account that has the appropriate permissions. For cross-tenant scenarios, make sure you're in the correct tenant context.

### Delegate reservation RBAC roles

Under this section, you will find how to: 
- Delegate the Reservation Purchaser Role to a Specific Subscription
- Delegate the Reservation Administrator, Contributor, or Reader Roles to a Specific Reservation
- Delegate the Reservation Administrator, Contributor, or Reader Roles to All Reservations

Users and groups who gain the ability to purchase, manage, or view reservations via RBAC roles must do so from **Home** > **Reservation**.

_Enterprise administrators can take ownership of a reservation order. They can add other users to a reservation by using **Access control (IAM)**._

#### Delegate the Reservation Purchaser role to a specific subscription

To delegate the purchaser role to a specific subscription, and after you have elevated access:

1. Go to **Home** > **Reservations** to see all reservations that are in the tenant.
2. To make modifications to the reservation, add yourself as an owner of the reservation order by using **Access control (IAM)**.

#### Delegate Reservation Administrator, Contributor, or Reader roles to a specific reservation

To delegate the administrator, contributor, or reader roles to a specific reservation:

1. Go to **Home** > **Reservations**.
2. Select the reservation you want.
3. Select **Access control (IAM)** on the leftmost pane.
4. Select **Add**, and then select **Add role assignment** from the top navigation bar.

#### Delegate Reservation Administrator, Contributor, or Reader roles to all reservations

[User Access administrator rights](../../role-based-access-control/built-in-roles.md#user-access-administrator) are required to grant RBAC roles at the tenant level. To get User Access administrator rights, follow the steps for elevated access: [Elevate access steps](../../role-based-access-control/elevate-access-global-admin.md?toc=/azure/cost-management-billing/reservations/toc.json). 

Then, to delegate the administrator, contributor, or reader role to all reservations in a tenant: 
1. Go to **Home** > **Reservations**
2. Select **Role assignment** from the top navigation bar

## Grant access to individual reservations

Users who have owner access on the reservations and billing administrators can delegate access management for an individual reservation order in the Azure portal.

To allow other people to manage reservations, you have two options:

- **Delegate access management for an individual reservation order** by assigning the Owner role to a user at the resource scope of the reservation order. If you want to give limited access, select a different role.
  For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

- **Add a user as billing administrator** to an Enterprise Agreement or a Microsoft Customer Agreement:
  - For an Enterprise Agreement, add users with the Enterprise Administrator role to view and manage all reservation orders that apply to the Enterprise Agreement. Users with the _Enterprise Administrator (read-only)_ role can only view the reservation. Department admins and account owners can't view reservations unless they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).

_Enterprise Administrators can take ownership of a reservation order and they can add other users to a reservation using Access control (IAM)._

  - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).


## Grant access with PowerShell
Users that have owner access for reservations orders, users with elevated access, and User Access Administrators can delegate access management for all reservation orders they have access to.

Access granted using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

For details on granting access with PowerShell, see [Grant RBAC access to Azure Reservations using PowerShell](manage-reservations-rbac-powershell.md).


## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).
- [Grant RBAC access to Azure Reservations using PowerShell](manage-reservations-rbac-powershell.md).
- [Understand how reservation discounts are applied](reservation-discount-application.md).

