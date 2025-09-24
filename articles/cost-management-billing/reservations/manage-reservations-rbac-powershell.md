---
title: Grant RBAC access to Azure reservations using PowerShell
description: Learn how to delegate access management for Azure reservations using PowerShell.
author: dekadays
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/21/2025
ms.author: liuyizhu

#CustomerIntent: As a billing administrator, I want to learn about granting RBAC access to Azure Reservations using PowerShell so that I can assign permissions effectively.

---

# Grant RBAC access to Azure reservations using PowerShell

This article shows you how to grant Role-Based Access Control (RBAC) access to Azure reservations using PowerShell. To view and manage RBAC access in Azure portal, see [Permissions to view and manage Azure reservations](view-reservations.md). 

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Grant access with PowerShell

Users that have owner access for reservations orders, users with elevated access, and [User Access Administrators](../../role-based-access-control/built-in-roles.md#user-access-administrator) can delegate access management for all reservation orders they have access to.

Access granted using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

## Assign the owner role for all reservations

Use the following Azure PowerShell script to give a user Azure RBAC access to all reservations orders in their Microsoft Entra tenant (directory).

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

**-ObjectId**  Microsoft Entra ObjectId of the user, group, or service principal.
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

[User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required before you can grant users or groups the Reservations Administrator, Reservations Contributor, and Reservations Reader roles at the tenant level. In order to get User Access Administrator rights at the tenant level, follow [Elevate access](../../role-based-access-control/elevate-access-global-admin.md) steps.

### Add a Reservations Administrator role, Reservations Contributor role, or Reservations Reader role at the tenant level
Only Global Administrators can assign these roles from the [Azure portal](https://portal.azure.com).

1. Sign in to the Azure portal and navigate to **Reservations**.
1. Select a reservation that you have access to.
1. At the top of the page, select **Role Assignment**.
1. Select the **Roles** tab.
1. To make modifications, add a user as a Reservations Administrator, Reservations Contributor, or Reservations Reader using Access control.

### Add a Reservation Administrator role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to add a Reservation Administrator role at the tenant level with PowerShell.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Administrator"
```

#### Parameters

**-ObjectId** Microsoft Entra ObjectId of the user, group, or service principal.
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

### Add a Reservation Contributor role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to add a Reservation Contributor role at the tenant level with PowerShell.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Contributor"
```

#### Parameters

**-ObjectId** Microsoft Entra ObjectId of the user, group, or service principal.
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

**-ObjectId** Microsoft Entra ObjectId of the user, group, or service principal.
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

- [Permissions to view and manage Azure reservations](view-reservations.md)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Azure built-in roles for reservations](../../role-based-access-control/built-in-roles.md#reservations-administrator)