---
title: Permissions to view and manage Azure reservations
description: Learn how to view and manage Azure reservations in the Azure portal.
author: bandersmsft
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/03/2023
ms.author: banders
---

# Permissions to view and manage Azure reservations

This article explains how reservation permissions work and how users can view and manage Azure reservations in the Azure portal and with Azure PowerShell.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Who can manage a reservation by default

By default, the following users can view and manage reservations:

- The person who buys a reservation and the account administrator of the billing subscription used to buy the reservation are added to the reservation order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.
- Users with elevated access to manage all Azure subscriptions and management groups
- A Reservation administrator for reservations in their Azure Active Directory (Azure AD) tenant (directory)
- A Reservation reader has read-only access to reservations in their Azure Active Directory tenant (directory)

The reservation lifecycle is independent of an Azure subscription, so the reservation isn't a resource under the Azure subscription. Instead, it's a tenant-level resource with its own Azure RBAC permission separate from subscriptions. Reservations don't inherit permissions from subscriptions after the purchase.

## View and manage reservations

If you're a billing administrator, use following steps to view and manage all reservations and reservation transactions in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select **Products + services** > **Reservations**.
1. The complete list of reservations for your EA enrollment or billing profile is shown.
1. Billing administrators can take ownership of a reservation by selecting one or multiple reservations, selecting **Grant access** and selecting **Grant access** in the window that appears. For a Microsoft Customer Agreement, user should be in the same Azure Active Directory (Azure AD) tenant (directory) as the reservation.

### Add billing administrators

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all reservation orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage reservations in **Cost Management + Billing**.
    - Users with the _Enterprise Administrator (read only)_ role can only view the reservation from **Cost Management + Billing**. 
    - Department admins and account owners can't view reservations _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).
- For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations.
    For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## View reservations with Azure RBAC access

If you purchased the reservation or you're added to a reservation, use the following steps to view and manage reservations in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services** > **Reservations** to list reservations that you have access to.

## Manage subscriptions and management groups with elevated access

You can elevate a user's [access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md?toc=/azure/cost-management-billing/reservations/toc.json).

After you have elevated access:

1. Navigate to **All Services** > **Reservation** to see all reservations that are in the tenant.
1. To make modifications to the reservation, add yourself as an owner of the reservation order using Access control (IAM).

## Grant access to individual reservations

Users who have owner access on the reservations and billing administrators can delegate access management for an individual reservation order in the Azure portal.

To allow other people to manage reservations, you have two options:

- Delegate access management for an individual reservation order by assigning the Owner role to a user at the resource scope of the reservation order. If you want to give limited access, select a different role.  
     For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
    - For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all reservation orders that apply to the Enterprise Agreement. Users with the _Enterprise Administrator (read only)_ role can only view the reservation. Department admins and account owners can't view reservations _unless_ they're explicitly added to them using Access control (IAM). For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).

        _Enterprise Administrators can take ownership of a reservation order and they can add other users to a reservation using Access control (IAM)._
    - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all reservation purchases made using the billing profile. Billing profile readers and invoice managers can view all reservations that are paid for with the billing profile. However, they can't make changes to reservations.
    For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Grant access with PowerShell

Users that have owner access for reservations orders, users with elevated access, and [User Access Administrators](../../role-based-access-control/built-in-roles.md#user-access-administrator) can delegate access management for all reservation orders they have access to.

Access granted using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

## Assign the owner role for all reservations

Use the following Azure PowerShell script to give a user Azure RBAC access to all reservations orders in their Azure AD tenant (directory).

```azurepowershell

Import-Module Az.Accounts
Import-Module Az.Resources
 
Connect-AzAccount -Tenant <TenantId>
 
$response = Invoke-AzRestMethod -Path /providers/Microsoft.Capacity/reservations?api-version=2020-06-01 -Method GET
 
$responseJSON = $response.Content | ConvertFrom-JSON
 
$reservationObjects = $responseJSON.value
 
foreach ($reservation in $reservationObjects)
{
  $reservationOrderId = $reservation.id.substring(0, 84)
  Write-Host "Assigning Owner role assignment to "$reservationOrderId
  New-AzRoleAssignment -Scope $reservationOrderId -ObjectId <ObjectId> -RoleDefinitionName Owner
}
```

When you use the PowerShell script to assign the ownership role and it runs successfully, a success message isn’t returned.

### Parameters

**-ObjectId**  Azure AD ObjectId of the user, group, or service principal.
- Type: String
- Aliases: Id, PrincipalId
- Position:	Named
- Default value: None
- Accept pipeline input: True
- Accept wildcard characters:	False

**-TenantId** Tenant unique identifier.
- Type:	String
- Position:	5
- Default value: None
- Accept pipeline input: False
- Accept wildcard characters: False

## Tenant-level access

[User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required before you can grant users or groups the Reservations Administrator and Reservations Reader roles at the tenant level. In order to get User Access Administrator rights at the tenant level, follow [Elevate access](../../role-based-access-control/elevate-access-global-admin.md) steps.

### Add a Reservations Administrator role or Reservations Reader role at the tenant level
You can assign these roles from the [Azure portal](https://portal.azure.com).

1. Sign in to the Azure portal and navigate to **Reservations**.
1. Select a reservation that you have access to.
1. At the top of the page, select **Role Assignment**.
1. Select the **Roles** tab.
1. To make modifications, add a user as a Reservations Administrator or Reservations Reader using Access control.

### Add a Reservation Administrator role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to add a Reservation Administrator role at the tenant level with PowerShell.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Administrator"
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

### Assign a Reservation Reader role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to assign the Reservation Reader role at the tenant level with PowerShell.

```azurepowershell

Import-Module Az.Accounts
Import-Module Az.Resources

Connect-AzAccount -Tenant <TenantId>

New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Reader"
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
