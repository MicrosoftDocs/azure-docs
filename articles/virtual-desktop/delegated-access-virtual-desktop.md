---
title: Delegated access in Windows Virtual Desktop - Azure
description: How to delegate administrative capabilities on a Windows Virtual Desktop deployment, including examples.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Delegated access in Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/delegated-access-virtual-desktop-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Windows Virtual Desktop has a delegated access model that lets you define the amount of access a particular user is allowed to have by assigning them a role. A role assignment has three components: security principal, role definition, and scope. The Windows Virtual Desktop delegated access model is based on the Azure RBAC model. To learn more about specific role assignments and their components, see [the Azure role-based access control overview](../role-based-access-control/built-in-roles.md).

Windows Virtual Desktop delegated access supports the following values for each element of the role assignment:

* Security principal
    * Users
    * User groups
    * Service principals
* Role definition
    * Built-in roles
    * Custom roles
* Scope
    * Host pools
    * App groups
    * Workspaces

## PowerShell cmdlets for role assignments

Before you start, make sure to follow the instructions in [Set up the PowerShell module](powershell-module.md) to set up the Windows Virtual Desktop PowerShell module if you haven't already.

Windows Virtual Desktop uses Azure role-based access control (RBAC) while publishing app groups to users or user groups. The Desktop Virtualization User role is assigned to the user or user group and the scope is the app group. This role gives the user special data access on the app group.  

Run the following cmdlet to add Azure Active Directory users to an app group:

```powershell
New-AzRoleAssignment -SignInName <userupn> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <hostpoolname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'  
```

Run the following cmdlet to add Azure Active Directory user group to an app group:

```powershell
New-AzRoleAssignment -ObjectId <usergroupobjectid> -RoleDefinitionName "Desktop Virtualization User" -ResourceName <hostpoolname> -ResourceGroupName <resourcegroupname> -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups' 
```

## Next steps

For a more complete list of PowerShell cmdlets each role can use, see the [PowerShell reference](/powershell/windows-virtual-desktop/overview).

For a complete list of roles supported in Azure RBAC, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

For guidelines for how to set up a Windows Virtual Desktop environment, see [Windows Virtual Desktop environment](environment-setup.md).
