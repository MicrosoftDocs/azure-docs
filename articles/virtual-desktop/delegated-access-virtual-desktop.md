---
title: Delegated access in Windows Virtual Desktop - Azure
description: How to delegate administrative capabilities on a Windows Virtual Desktop deployment, including examples.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Delegated access in Windows Virtual Desktop

Windows Virtual Desktop has a delegated access model that lets you define the amount of access a particular user is allowed to have by assigning them a role. A role assignment has three components: service principal, role definition, and scope. The Windows Virtual Desktop delegated access model is based on the Azure RBAC model. To learn more about specific role assignments and their components, see [the Azure role-based access control overview](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles).

Windows Virtual Desktop delegated access supports the following values for each element of the role assignment:

* Security principal
    * Users
    * Service principals
* Role definition
    * Built-in roles
* Scope
    * Tenant groups
    * Tenants
    * Host pools
    * App groups

## Built-in roles

Delegated access in Windows Virtual Desktop has several built-in role definitions you can assign to users and service principals.

* An RDS Owner can manage everything, including access to resources.
* An RDS Contributor can manage everything but access to resources.
* An RDS Reader can view everything but can't make any changes.
* An RDS Operator can view diagnostic activities.

## PowerShell cmdlets for role assignments

You can run the following cmdlets to create, view, and edit role asignments:

* **Get-RdsRoleAssignment** displays a list of role assignments.
* **New-RdsRoleAssignment** creates a new role assignment.
* **Set-RdsRoleAssignment** edits role assignments.

### Accepted parameters

You can modify the basic three cmdlets with the following parameters:

* **AadTenantId**: specifies the Azure Active Directory tenant ID from which the service principal is a member.
* **AppGroupName**: name of the Remote Desktop app group.
* **Diagnostics**: indicates the diagnostics scope. (Must be paired with either the **Infrastructure** or **Tenant** parameters.)
* **HostPoolName**: name of the Remote Desktop host pool.
* **Infrastructure**: indicates the infrastructure scope.
* **RoleDefinitionName**: name of the Remote Desktop Services role-based access control role that needs to be assigned to the user, group, or app; for example, Remote Desktop Services Owner, Remote Desktop Services Reader, and so on.
* **ServerPrincipleName**: name of the Azure Active Directory application.
* **SignInName**: the user's email address or user principal name.
* **TenantName**: name of the Remote Desktop tenant.

## Next steps

For a more complete list of PowerShell cmdlets each role can use, see [PowerShell cmdlets](powershell-cmdlet-table.md).

For guidelines for how to set up a Windows Virtual Desktop environment, see [Set up a Windows Virtual Desktop environment](environment-setup.md).