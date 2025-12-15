---
title: Grant RBAC Access to Reservations by Using PowerShell
description: Learn how to delegate access management for Azure reservations by using PowerShell.
author: dekadays
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/21/2025
ms.author: liuyizhu

#CustomerIntent: As a billing administrator, I want to learn how to grant RBAC access to reservations by using PowerShell so that I can effectively assign permissions.

service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---

# Grant RBAC access to Azure reservations by using PowerShell

This article shows you how to grant role-based access control (RBAC) access to Azure reservations by using Azure PowerShell. To view and manage RBAC access in the Azure portal, see [Permissions to view and manage Azure reservations](view-reservations.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Grant access by using PowerShell

The following user types can delegate access management for all reservation orders that they can access:

- Users that have owner access for reservations orders
- Users with elevated access
- [User Access Administrators](../../role-based-access-control/built-in-roles.md#user-access-administrator)

When you grant access by using PowerShell, you can't view the roles in the Azure portal. Instead, you can view roles by using the `get-AzRoleAssignment` command in the following section.

## Assign the owner role for all reservations

Use the following PowerShell script to give a user RBAC access to all reservation orders in their Microsoft Entra tenant (directory).

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

When you use the PowerShell script to assign the ownership role and it runs successfully, a success message isn't returned.

### Parameters

The `-ObjectId` parameter is the Microsoft Entra `ObjectId` of the user, group, or service principal.

- **Type**: String
- **Aliases**: `Id`, `PrincipalId`
- **Position**:	Named
- **Default value**: None
- **Accept pipeline input**: True
- **Accept wildcard characters**:	False

The `-TenantId` parameter is the tenant's unique identifier.

- **Type**:	String
- **Position**:	5
- **Default value**: None
- **Accept pipeline input**: False
- **Accept wildcard characters**: False

## Grant tenant-level access

You need [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights before you can grant users or groups the following roles at the tenant level:

- Reservations Administrator
- Reservations Contributor
- Reservations Reader

To get User Access Administrator rights at the tenant level, follow the steps to [elevate access](../../role-based-access-control/elevate-access-global-admin.md).

### Add a Reservations Administrator role, Reservations Contributor role, or Reservations Reader role at the tenant level

Only users with the Global Administrator role can assign these roles from the [Azure portal](https://portal.azure.com).

1. Sign in to the Azure portal and go to **Reservations**.
1. Select a reservation that you can access.
1. At the top of the page, select **Role Assignment**.
1. Select the **Roles** tab.
1. To make modifications, add a user as a Reservations Administrator, Reservations Contributor, or Reservations Reader by using access control.

### Add a Reservations Administrator role at the tenant level by using an Azure PowerShell script

Use the following Azure PowerShell script to add a Reservations Administrator role at the tenant level.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Administrator"
```

#### Parameters

The `-ObjectId` parameter is the Microsoft Entra `ObjectId` of the user, group, or service principal.

- **Type**:	String
- **Aliases**: `Id`, `PrincipalId`
- **Position**:	Named
- **Default value**: None
- **Accept pipeline input**: True
- **Accept wildcard characters**: False

The `-TenantId` parameter is the tenant's unique identifier.

- **Type**:	String
- **Position**:	5
- **Default value**: None
- **Accept pipeline input**: False
- **Accept wildcard characters**: False

### Add a Reservations Contributor role at the tenant level by using an Azure PowerShell script

Use the following Azure PowerShell script to add a Reservations Contributor role at the tenant level.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Contributor"
```

#### Parameters

The `-ObjectId` parameter is the Microsoft Entra `ObjectId` of the user, group, or service principal.

- **Type**:	String
- **Aliases**: `Id`, `PrincipalId`
- **Position**:	Named
- **Default value**: None
- **Accept pipeline input**: True
- **Accept wildcard characters**: False

The `-TenantId` parameter is the tenant's unique identifier.

- **Type**:	String
- **Position**:	5
- **Default value**: None
- **Accept pipeline input**: False
- **Accept wildcard characters**: False

### Assign a Reservations Reader role at the tenant level by using an Azure PowerShell script

Use the following Azure PowerShell script to assign the Reservations Reader role at the tenant level.

```azurepowershell

Import-Module Az.Accounts
Import-Module Az.Resources

Connect-AzAccount -Tenant <TenantId>

New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <ObjectId> -RoleDefinitionName "Reservations Reader"
```

#### Parameters

The `-ObjectId` parameter is the Microsoft Entra `ObjectId` of the user, group, or service principal.

- **Type**:	String
- **Aliases**: `Id`, `PrincipalId`
- **Position**:	Named
- **Default value**: None
- **Accept pipeline input**: True
- **Accept wildcard characters**: False

The `-TenantId` parameter is the tenant's unique identifier.

- **Type**:	String
- **Position**:	5
- **Default value**: None
- **Accept pipeline input**: False
- **Accept wildcard characters**: False

## Related content

- [Permissions to view and manage Azure reservations](view-reservations.md)
- [Manage Azure reservations](manage-reserved-vm-instance.md)
- [Azure built-in roles for reservations](../../role-based-access-control/built-in-roles.md#reservations-administrator)
