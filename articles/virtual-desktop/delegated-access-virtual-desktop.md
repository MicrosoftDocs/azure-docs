---
title: Delegated access in Azure Virtual Desktop - Azure
description: How to delegate administrative capabilities on a Azure Virtual Desktop deployment, including examples.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Delegated access in Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/delegated-access-virtual-desktop-2019.md).

Azure Virtual Desktop has a delegated access model that lets you define the amount of access a particular user is allowed to have by assigning them a role. A role assignment has three components: security principal, role definition, and scope. The Azure Virtual Desktop delegated access model is based on the Azure RBAC model. To learn more about specific role assignments and their components, see [the Azure role-based access control overview](../role-based-access-control/built-in-roles.md).

Azure Virtual Desktop delegated access supports the following values for each element of the role assignment:

* Security principal
    * Users
    * User groups
    * Service principals
* Role definition
    * Built-in roles
    * Custom roles
* Scope
    * Host pools
    * Application groups
    * Workspaces

## PowerShell cmdlets for role assignments

Before you start, make sure to follow the instructions in [Set up the PowerShell module](powershell-module.md) to set up the Azure Virtual Desktop PowerShell module if you haven't already.

Azure Virtual Desktop uses Azure role-based access control (Azure RBAC) while publishing application groups to users or user groups. The Desktop Virtualization User role is assigned to the user or user group and the scope is the application group. This role gives the user special data access on the application group.

Run the following cmdlet to add Microsoft Entra users to an application group:

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

Run the following cmdlet to add Microsoft Entra user group to an application group:

```powershell
New-AzRoleAssignment -ObjectId <usergroupobjectid> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <appgroupname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

## Next steps

For a more complete list of PowerShell cmdlets each role can use, see the [PowerShell reference](/powershell/module/az.desktopvirtualization).

For a complete list of roles supported in Azure RBAC, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

For guidelines for how to set up a Azure Virtual Desktop environment, see [Azure Virtual Desktop environment](environment-setup.md).
