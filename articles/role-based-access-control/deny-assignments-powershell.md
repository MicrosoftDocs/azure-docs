---
title: List deny assignments for Azure resources using Azure PowerShell | Microsoft Docs
description: Learn how to list the users, groups, service principals, and managed identities that have been denied access to specific Azure resource actions at particular scopes using Azure PowerShell.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/16/2019
ms.author: rolyon
ms.reviewer: bagovind
---

# List deny assignments for Azure resources using Azure PowerShell

[Deny assignments](deny-assignments.md) block users from performing specific Azure resource actions even if a role assignment grants them access. This article describes how to use Azure PowerShell to list deny assignments.

> [!NOTE]
> At this time, the only way you can add your own deny assignments is by using Azure Blueprints. For more information, see [Protect new resources with Azure Blueprints resource locks](../governance/blueprints/tutorials/protect-new-resources.md).

[!INCLUDE [az-powershell-update](../../includes/updated-for-az.md)]

## Prerequisites

To get information about a deny assignment, you must have:

- `Microsoft.Authorization/denyAssignments/read` permission, which is included in most [built-in roles for Azure resources](built-in-roles.md)
- [PowerShell in Azure Cloud Shell](/azure/cloud-shell/overview) or [Azure PowerShell](/powershell/azure/install-az-ps)

## List deny assignments

### List deny assignments for a user

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment -SignInName <email_or_userprincipalname>
```

```Example
PS C:\> Get-AzDenyAssignment -SignInName isabella@example.com | FL DisplayName, DenyAssignmentName, Scope
```

### List deny assignments at a resource group scope

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment).

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName <resource_group_name>
```

```Example
PS C:\> Get-AzDenyAssignment -ResourceGroupName pharma-sales | FL DisplayName, DenyAssignmentName, Scope
```

### List deny assignments at a subscription scope

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment). To get the subscription ID, you can find it on the **Subscriptions** blade in the Azure portal or you can use [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription).

```azurepowershell
Get-AzDenyAssignment -Scope /subscriptions/<subscription_id>
```

```Example
PS C:\> Get-AzDenyAssignment -Scope /subscriptions/00000000-0000-0000-0000-000000000000
```

### List deny assignments at a management group scope

To list all deny assignments at a subscription scope, use [Get-AzDenyAssignment](/powershell/module/az.resources/get-azdenyassignment). To get the management group ID, you can find it on the **Management groups** blade in the Azure portal or you can use [Get-AzManagementGroup](/powershell/module/az.resources/get-azmanagementgroup).

```azurepowershell
Get-AzDenyAssignment -Scope /providers/Microsoft.Management/managementGroups/<group_id>
```

```Example
PS C:\> Get-AzDenyAssignment -Scope /providers/Microsoft.Management/managementGroups/marketing-group
```

## Next steps

- [Understand deny assignments for Azure resources](deny-assignments.md)
- [List deny assignments for Azure resources using the Azure portal](deny-assignments-portal.md)
- [List deny assignments for Azure resources using the REST API](deny-assignments-rest.md)