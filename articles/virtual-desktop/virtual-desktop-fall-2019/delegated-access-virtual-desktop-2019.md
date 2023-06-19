---
title: Delegated access in Azure Virtual Desktop (classic) - Azure
description: How to delegate administrative capabilities on a Azure Virtual Desktop (classic) deployment, including examples.
author: Heidilohr
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Delegated access in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../delegated-access-virtual-desktop.md).

Azure Virtual Desktop has a delegated access model that lets you define the amount of access a particular user is allowed to have by assigning them a role. A role assignment has three components: security principal, role definition, and scope. The Azure Virtual Desktop delegated access model is based on the Azure RBAC model. To learn more about specific role assignments and their components, see [the Azure role-based access control overview](../../role-based-access-control/built-in-roles.md).

Azure Virtual Desktop delegated access supports the following values for each element of the role assignment:

* Security principal
    * Users
    * Service principals
* Role definition
    * Built-in roles
* Scope
    * Tenant groups
    * Tenants
    * Host pools
    * Application groups

## Built-in roles

Delegated access in Azure Virtual Desktop has several built-in role definitions you can assign to users and service principals.

* An RDS Owner can manage everything, including access to resources.
* An RDS Contributor can manage everything, but can't access resources.
* An RDS Reader can view everything, but can't make any changes.
* An RDS Operator can view diagnostic activities.

## PowerShell cmdlets for role assignments

You can run the following cmdlets to create, view, and remove role assignments:

* **Get-RdsRoleAssignment** displays a list of role assignments.
* **New-RdsRoleAssignment** creates a new role assignment.
* **Remove-RdsRoleAssignment** deletes role assignments.

### Accepted parameters

You can modify the basic three cmdlets with the following parameters:

* **AadTenantId**: specifies the Azure Active Directory tenant ID from which the service principal is a member.
* **AppGroupName**: name of the Remote Desktop application group.
* **Diagnostics**: indicates the diagnostics scope. (Must be paired with either the **Infrastructure** or **Tenant** parameters.)
* **HostPoolName**: name of the Remote Desktop host pool.
* **Infrastructure**: indicates the infrastructure scope.
* **RoleDefinitionName**: name of the Remote Desktop Services role-based access control role assigned to the user, group, or app. (For example, Remote Desktop Services Owner, Remote Desktop Services Reader, and so on.)
* **ServerPrincipleName**: name of the Azure Active Directory application.
* **SignInName**: the user's email address or user principal name.
* **TenantName**: name of the Remote Desktop tenant.

## Next steps

For a more complete list of PowerShell cmdlets each role can use, see the [PowerShell reference](/powershell/windows-virtual-desktop/overview).

For guidelines for how to set up a Azure Virtual Desktop environment, see [Azure Virtual Desktop environment](environment-setup-2019.md).
