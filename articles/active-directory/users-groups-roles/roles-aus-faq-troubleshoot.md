---
title: Troubleshooting administrative units and FAQ - Azure Active Directory | Microsoft Docs
description: Investigate administrative units to delegation of permissions with restricted scope in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/09/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---


# Create an administrative unit in Azure Active Directory

For more granular administrative control in Azure ACtive Directory (Azure AD), you can assign users to an Azure AD role with a scope limited to one or more administrative units (AUs).

## Frequently asked questions

**Why are Administrative Units necessary? Couldn't we have used Security Groups as the way to define a scope?**
Security Groups have an existing purpose and authorization model. A User Administrator, for example, can manage membership of all Security Groups in the directory. That is because is it reasonable that a User Administrator can manage access to applications like Salesforce. A User Administrator should not have the ability to manage the delegation model itself, which would be the result if Security Groups were extended to support 'resource grouping' scenarios. Administrative Units, like Organizational Units in Windows Server Active Directory, are intended to provide a way to scope administration of a wide range of directory objects. Security Groups themselves can be members of resource scopes. Using Security Groups to define the set of Security Groups an administrator can manage would get very confusing.

**What does it mean to add a Group to an Administrative Unit?**
Adding a group to an administrative unit brings the group itself into the management scope of any administrative unit-scoped User Administrators. User Administrators for the administrative unit can manage the name and membership of the group itself. It does not grant the User Administrator for the administrative unit any permission to manage the users of the group (for example, reset their passwords). To grant the User Administrator the ability to manage users, the users have to be direct members of the administrative unit.

**Can a resource (user, group, etc.) be a member of more than one Administrative Unit?**
Yes, a resource can be a member of more than one administrative unit. The resource can be managed by all tenant and administrative unit-scoped admins who have permissions over the resource.

**Are nested Administrative Units supported?**
Nesting administrative units is not supported.

**Are Administrative Units supported in PowerShell and Graph API?**
Yes. Support for Administrative Units exists in [PowerShell cmdlet documentation](https://docs.microsoft.com/powershell/module/Azuread/?view=azureadps-2.0-preview) and [sample scripts](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0-preview), and support is in the Microsoft Graph for the [administrativeUnit resource type](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/administrativeunit).

## Next steps

- [Administrative units to restrict scope for roles overview](roles-scope-admin-units.md)
- [Manage administrative units](roles-scope-manave-admin-units.md)