---
title: Administrative units troubleshooting and FAQ - Azure Active Directory | Microsoft Docs
description: Investigate administrative units to grant permissions with restricted scope in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/16/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---


# Azure AD administrative units: Troubleshooting and FAQ

For more granular administrative control in Azure Active Directory (Azure AD), you can assign users to an Azure AD role with a scope that's limited to one or more administrative units (AUs). For sample PowerShell scripts for common tasks, see [Work with administrative units](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0).

## Frequently asked questions

**Q: Why am I unable to create an administrative unit?**

**A:** Only a *Global Administrator* or *Privileged Role Administrator* can create an administrative unit in Azure AD. Check to ensure that the user who's trying to create the administrative unit is assigned either the *Global Administrator* or *Privileged Role Administrator* role.

**Q: I added a group to the administrative unit. Why are the group members still not showing up there?**

**A:** When you add a group to the administrative unit, that does not result in all the group's members being added to it. Users must be directly assigned to the administrative unit.

**Q: I just added (or removed) a member of the administrative unit. Why is the member not showing up (or still showing up) in the user interface?**

**A:** Sometimes, processing of the addition or removal of one or more members of the administrative unit might take a few minutes to be reflected on the **Administrative units** page. Alternatively, you can go directly to the associated resource's properties and see whether the action has been completed. For more information about users and groups in AUs, see [List administrative units for a user](roles-admin-units-add-manage-users.md) and [List administrative units for a group](roles-admin-units-add-manage-groups.md).

**Q: I am a delegated password administrator on an administrative unit. Why am I unable to reset a specific user's password?**

**A:** As an administrator of an administrative unit, you can reset passwords only for users who are assigned to your administrative unit. Make sure that the user whose password reset is failing belongs to the administrative unit to which you've been assigned. If the user belongs to the same administrative unit but you still can't reset their password, check the roles that are assigned to the user. 

To prevent an elevation of privilege, an administrative unit-scoped administrator can't reset the password of a user who's assigned to a role with an organization-wide scope.

**Q: Why are administrative units necessary? Couldn't we have used security groups as the way to define a scope?**

**A:** Security groups have an existing purpose and authorization model. A *User Administrator*, for example, can manage membership of all security groups in the Azure AD organization. The role might use groups to manage access to applications such as Salesforce. A *User Administrator* should not be able to manage the delegation model itself, which would be the result if security groups were extended to support "resource grouping" scenarios. Administrative units, such as organizational units in Windows Server Active Directory, are intended to provide a way to scope administration of a wide range of directory objects. Security groups themselves can be members of resource scopes. Using security groups to define the set of security groups that an administrator can manage could become confusing.

**Q: What does it mean to add a group to an administrative unit?**

**A:** Adding a group to an administrative unit brings the group itself into the management scope of any *User Administrator* who is also scoped to that administrative unit. User administrators for the administrative unit can manage the name and membership of the group itself. It does not grant the *User Administrator* for the administrative unit permissions to manage the users of the group (for example, to reset their passwords). To grant the *User Administrator* the ability to manage users, the users have to be direct members of the administrative unit.

**Q: Can a resource (user or group) be a member of more than one administrative unit?**

**A:** Yes, a resource can be a member of more than one administrative unit. The resource can be managed by all organization-wide and administrative unit-scoped administrators who have permissions over the resource.

**Q: Are administrative units available in B2C organizations?**

**A:** No, administrative units are not available for B2C organizations.

**Q: Are nested administrative units supported?**

**A:** No, nested administrative units are not supported.

**Q: Are administrative units supported in PowerShell and the Graph API?**

**A:** Yes. You'll find support for administrative units in [PowerShell cmdlet documentation](https://docs.microsoft.com/powershell/module/Azuread/?view=azureadps-2.0-preview) and [sample scripts](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0-preview). 

Find support for the [administrativeUnit resource type](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/administrativeunit) in Microsoft Graph.

## Next steps

- [Restrict scope for roles by using administrative units](directory-administrative-units.md)
- [Manage administrative units](roles-admin-units-manage.md)
