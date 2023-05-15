---
title: List Azure deny assignments using Azure PowerShell - Azure RBAC
description: Learn how to list the users, groups, service principals, and managed identities that have been denied access to specific Azure resource actions at particular scopes using Azure PowerShell and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino

ms.service: role-based-access-control
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/24/2022
ms.author: rolyon
ms.reviewer: bagovind 
ms.custom: devx-track-azurepowershell
---

# List Azure deny assignments using Azure PowerShell

[Azure deny assignments](deny-assignments.md) block users from performing specific Azure resource actions even if a role assignment grants them access. This article describes how to list deny assignments using Azure PowerShell.

> [!NOTE]
> You can't directly create your own deny assignments. For more information, see [Azure deny assignments](deny-assignments.md).

## Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [Azure built-in roles](built-in-roles.md)
- [PowerShell in Azure Cloud Shell](../cloud-shell/overview.md) or [Azure PowerShell](/powershell/azure/install-azure-powershell)

## List deny assignments

### List all deny assignments

To list all deny assignments for the current subscription, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment
```

```Example
PS C:\> Get-AzDenyAssignment

Id                      : 22222222-2222-2222-2222-222222222222
DenyAssignmentName      : Deny assignment '22222222-2222-2222-2222-222222222222' created by Blueprint Assignment
                          '/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Blueprint/blueprintAssignments/assignment-locked-storageaccount-TestingBPLocks'.
Description             : Created by Blueprint Assignment '/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Blueprint/blueprintAssignments/assignment-locked-storageaccount-TestingBPLocks'.
Actions                 : {*}
NotActions              : {*/read}
DataActions             : {}
NotDataActions          : {}
Scope                   : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/TestingBPLocks
DoNotApplyToChildScopes : True
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
ExcludePrincipals       : {
                          ObjectType:   ServicePrincipal
                          }
IsSystemProtected       : True

Id                      : 33333333-3333-3333-3333-333333333333
DenyAssignmentName      : Deny assignment '33333333-3333-3333-3333-333333333333' created by Blueprint Assignment
                          '/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Blueprint/blueprintAssignments/assignment-locked-storageaccount-TestingBPLocks'.
Description             : Created by Blueprint Assignment '/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Blueprint/blueprintAssignments/assignment-locked-storageaccount-TestingBPLocks'.
Actions                 : {*}
NotActions              : {*/read}
DataActions             : {}
NotDataActions          : {}
Scope                   : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/TestingBPLocks/providers/Microsoft.Storage/storageAccounts/storep6vkuxmu4m4pq
DoNotApplyToChildScopes : True
Principals              : {
                          DisplayName:  All Principals
                          ObjectType:   SystemDefined
                          ObjectId:     00000000-0000-0000-0000-000000000000
                          }
ExcludePrincipals       : {
                          DisplayName:  assignment-locked-storageaccount-TestingBPLocks
                          ObjectType:   ServicePrincipal
                          ObjectId:     2311a0b7-657a-4ca2-af6f-d1c33f6d2fff
                          }
IsSystemProtected       : True
```

### List deny assignments at a resource group scope

To list all deny assignments at a resource group scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName <resource_group_name>
```

```Example
PS C:\> Get-AzDenyAssignment -ResourceGroupName TestingBPLocks | FL DenyAssignmentName, Scope

DenyAssignmentName : Deny assignment '22222222-2222-2222-2222-222222222222' created by Blueprint Assignment
                     '/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Blueprint/blueprintAssignments/assignment-locked-storageaccount-TestingBPLocks'.
Scope              : /subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/TestingBPLocks
Principals         : {
                     DisplayName:       All Principals
                     ObjectType:        SystemDefined
                     ObjectId:  00000000-0000-0000-0000-000000000000
                     }
```

### List deny assignments at a subscription scope

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment). To get the subscription ID, you can find it on the **Subscriptions** blade in the Azure portal or you can use [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription).

```azurepowershell
Get-AzDenyAssignment -Scope /subscriptions/<subscription_id>
```

```Example
PS C:\> Get-AzDenyAssignment -Scope /subscriptions/11111111-1111-1111-1111-111111111111
```

## Next steps

- [Understand Azure deny assignments](deny-assignments.md)
- [List Azure deny assignments using the Azure portal](deny-assignments-portal.md)
- [List Azure deny assignments using the REST API](deny-assignments-rest.md)
