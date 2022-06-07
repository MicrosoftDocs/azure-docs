---
title: Permissions to view and manage Azure reservations
description: Learn how to view and manage Azure reservations in the Azure portal.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 11/18/2021
ms.author: banders
---

# Permissions to view and manage Azure reservations

This article explains how reservation permissions work and how users can view and manage Azure reservations in the Azure portal and with Azure PowerShell.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Who can manage a reservation by default

The following users can [list](#list-reservations), [view](#manage-your-reservation) and [manage](#manage-reservations) reservations:

- The person who buys a reservation and the account administrator of the billing subscription used to buy the selected reservation
- Manually [added users](#grant-access-to-individual-reservations) for selected reservation
- Enterprise Agreement and Microsoft Customer Agreement [billing administrators](#add-billing-administrators) for all reservations
- Users with [elevated access](../../role-based-access-control/elevate-access-global-admin.md?toc=/azure/cost-management-billing/reservations/toc.json) 
- A [Reservation administrators](#add-reservation-administrators) for reservations in their Azure Active Directory (Azure AD) tenant (directory)

The following users can only [list](#list-reservations) reservations:

- Enterprise Agreement and Microsoft Customer Agreement [Enterprise Administrator (read-only)](#add-billing-administrators)
- A [Reservation reader](#add-reservation-administrators) for reservations in their Azure Active Directory (Azure AD) tenant (directory)

The reservation lifecycle is independent of an Azure subscription, so the reservation isn't a resource under the Azure subscription. Instead, it's a tenant-level resource with its own Azure RBAC permission separate from subscriptions. Reservations don't inherit permissions from subscriptions after the purchase.

## Manage your reservation

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services** > **Reservations** to list reservations that you have access to.
2. Select your reservation.

## List reservations

1. Sign into the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select **Products + services** > **Reservations**.
1. The complete list of reservations for your EA enrollment or billing profile is shown.

## Manage reservations

1. [List reservations](#list-reservations)
1. Select a reservation
    - For each reservation, Billing administrators need to take ownership of a reservation by selecting one or multiple reservations, selecting **Grant access** and selecting **Grant access** in the window that appears.
    - For each reservation, Elevated users need to add tehmselves as an _Owner_ of the reservation using **Access control (IAM)**.
 
You can now delegate access to individual reservation or all reservations in the following ways:

### Grant access to individual reservations

Users with RBAC role can view and/or manage selected reservation.

Assign desired role to a user in **Access control (IAM)** of the reservation:
  - Users with _Owner_ role can manage reservaton and further delegate access
  - Users with _Contributor_ role can manage reservation
  - Users with _Reader_ role can list reservation
For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

### Add billing administrators

Billing administrators can view all reservations in the billing scope.

- For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all reservations within the Enterprise Agreement:
    - Users with _Enterprise administrator_ role can list, view and manage reservations 
    - Users with _Enterprise Administrator (read only)_ role can only list reservations
    - Department admins and account owners can't view reservations _unless_ they're explicitly [added to them](#grant-access-to-individual-reservations) using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).
- For a Microsoft Customer Agreement, add users with the _billing profile_ to manage all reservation purchases made using the billing profile:
    - Users with _Billing profile owner_ or _billing profile contributor_ role can list, view and manage reservations
    - Users with _Billing profile reader_ or _invoice manager_ role can only list reservations
    For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).


### Add reservation administraors

Reservation administrators with RBAC role can view all reservations in the Azure AD tenant.

Assign desired role to a user in the tenant:
 - Users with _Reservation administrator_ role can manage all reservations
 - Users with _Reservation reader_ role can only list all reservations
 
>NOTE: Currently, are only available to assign using PowerShell. They can't be viewed or assigned in the Azure portal.

Access granted using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

Use the following Azure PowerShell script to add a _Reservation Administrator_ or _Reservation Reader_ role at the tenant level with PowerShell.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Administrator" # or "Reservations Reader"
```

#### Parameters

**-ObjectId** Azure AD ObjectId of the user, group, or service principal.
- Type:	String
- Aliases: Id, PrincipalId
- Position:	Named
- Default value: None
- Accept pipeline input: True
- Accept wildcard characters: False

**-TenantId** Tenant unique identifier.
- Type:	String
- Position:	5
- Default value: None
- Accept pipeline input: False
- Accept wildcard characters: False

## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md).
