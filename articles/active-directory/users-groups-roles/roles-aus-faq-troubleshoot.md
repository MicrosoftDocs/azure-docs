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
ms.date: 04/10/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---


# Troubleshooting and FAQ for administrative units in Azure Active Directory

For more granular administrative control in Azure ACtive Directory (Azure AD), you can assign users to an Azure AD role with a scope limited to one or more administrative units (AUs). You can find sample Powershell scripts for common tasks at https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0.

## Frequently asked questions

**Q: I am not able to create an administrative unit**

**A:** Only a Global Administrator or Privileged Role Administrator can create an administrative unit in Azure AD. Check that the user trying to create the administrative unit is assigned either the Global Administrator or Privileged Role Administrator role.

**Q: I added a group to the administrative unit, but the members of the group are still not showing up in the administrative unit**

**A:** When you add a group to the administrative unit, that does not result in adding all the members of the group to the administrative unit. Users must be directly assigned to administrative unit.

**Q: I just added / removed a member of the administrative unit and it is still showing up in the UI**

**A:** Sometimes processing of the add / removal of one or more member of the administrative unit may take a few minutes to reflect under the Administrative Units blade. You may choose to wait for a few minutes for it to reflect under the administrative units. Alternatively, you can go directly to the associated resource's properties and see if the action has been completed. See List administrative units for a user and List administrative units for a group for more information.

**Q: As a delegated password administrator on an administrative unit, I am unable to reset a specific user's password**

**A:** An administrator assigned over an administrative unit you can reset password only for users assigned to your administrative unit. Make sure that the user for which the password reset is failing belongs to the administrative units over which you have been assigned the role. If the user belongs to the same administrative unit and you are still not able to reset the password of the user, check the roles that the user hold. To prevent an elevation of privilege, an administrative unit level administrator cannot reset the password of a user which holds a role on the directory level.

**Q: Why are administrative units necessary? Couldn't we have used security groups as the way to define a scope?**

**A:** Security Groups have an existing purpose and authorization model. A User administrator, for example, can manage membership of all security groups in the Azure AD organization. That is because is it reasonable that a User Administrator can use groups to manage access to applications like Salesforce. A User administrator should not have the ability to manage the delegation model itself, which would be the result if security groups were extended to support "resource grouping" scenarios. Administrative units, like Organizational Units in Windows Server Active Directory, are intended to provide a way to scope administration of a wide range of directory objects. Security groups themselves can be members of resource scopes. Using security groups to define the set of security groups an administrator can manage would get very confusing.

**Q: What does it mean to add a group to an administrative unit?**

**A:** Adding a group to an administrative unit brings the group itself into the management scope of any User administrator who is also scoped to that amin unit. User admins for the administrative unit can manage the name and membership of the group itself. It does not grant the User admin for the administrative unit any permission to manage the users of the group (for example, reset their passwords). To grant the User Administrator the ability to manage users, the users have to be direct members of the administrative unit.

**Q: Can a resource (user or group) be a member of more than one administrative unit?**

**A:** Yes, a resource can be a member of more than one administrative unit. The resource can be managed by all organization-wide and administrative unit-scoped admins who have permissions over the resource.

**Q: Are administrative units available in B2C organizations?**

**A:** No, administrative units are not available for B2C organizations.

**Q: Are nested administrative units supported?**

**A:** Nested administrative units are not supported.

**Q: Are administrative units supported in PowerShell and Graph API?**

**A:** Yes. Support for Administrative Units exists in [PowerShell cmdlet documentation](https://docs.microsoft.com/powershell/module/Azuread/?view=azureadps-2.0-preview) and [sample scripts](https://docs.microsoft.com/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0-preview), and support is in the Microsoft Graph for the [administrativeUnit resource type](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/administrativeunit).

## Next steps

- [Administrative units to restrict scope for roles overview](directory-administrative-units.md)
- [Manage administrative units](roles-aus-manage-admin-units.md)