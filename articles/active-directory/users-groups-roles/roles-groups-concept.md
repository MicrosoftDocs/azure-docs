---
title: Use groups to manage role assignments in Azure Active Directory | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/14/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Use groups to manage role assignments in Azure Active Directory (preview)

Azure Active Directory (Azure AD) is introducing a public preview in which you can assign a role-enabled group to Azure AD built-in roles. Use it, for example, to assign the Helpdesk administrator role to a group of your Tier I helpdesk personnel. When members are added to the group, they are assigned to the role indirectly. Azure AD governance then takes care of the approval process and auditing of the group’s membership to ensure that only legitimate users are members of the group and are assigned the Helpdesk Administrator role.

You can use groups to grant admin access in Azure AD, which requires minimal effort from your Global administrators or Privileged role administrators, freeing them for more pressing matters.

## How this feature works

Create a new Office 365 or security group with the ‘isAssignableToRole’ property set to ‘true’. You can enable this property in UI by turning on **Enabled for role assignment** when creating a new group. Then assign this group to one or more Azure AD roles in the same way as you assign roles to users.

## Why we enforce creation of a special group for assigning it to a role

Azure AD allows you to protect a group assigned to a role by using a new property called isAssignableToRole for groups. Only cloud groups that had the isAssignableToRole property set to ‘true’ at creation time can be assigned to a role. This property is immutable; once a group is created with this property set to ‘true’, it can’t be changed. You can't set the property on an existing group.

If a group is assigned a role, any IT admin who can manage group membership could also indirectly manage the membership of that role. For example, assume that a group Contoso_User_Administrators is assigned to User account administrator role. An Exchange admin who can modify group membership could add themselves to the Contoso_User_Administrators group and become a User account administrator. As you can see, an admin could elevate their privilege in a way you did not intend. We designed how groups are assigned to roles to prevent that sort of potential breach from happening:

- Only Global Administrator and Privileged Role Administrator can create a group with the "isAssignableToRole" property enabled.
- It can't be an Azure AD dynamic group. It must have a membership type of "Assigned." Automated population of dynamic groups could lead to an unwanted account being added that then could then use the role permissions to manage group membership and thus assignments to the role.
- There can't be an owner of a role-enabled group. Only Global Administrator and Privileged Role Administrator can manage the membership of this group by default. We will bring the ability to delegate the management of such groups to other people in future.
- No nesting. A group can't be added as a member of a role-enable group.

> [!IMPORTANT]
> If you use Office 365 groups to assign to roles, they can expire. Because role-eligible groups can't have owners, the expiration email will be sent to the alternate email address you provide. Be sure to provide an email address that you monitor. Otherwise, use a security group for assigning to roles.

## Required license plan

Using this feature requires an Azure AD Premium P1 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium plans](../fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses).

## Supported in this preview

Scenario | Azure AD portal | MS Graph API | PowerShell
-------- | --------------- | ------------ | ----------
Create a new Office 365 cloud group with the isAssignableToRole property set to true. | Supported | Supported | Not supported
Assign new Office 365 cloud group with the isAssignableToRole set to true to a built-in Azure AD role.  | Supported | Supported  | Supported
Create a new security cloud group with the isAssignableToRole property set to true.  | Supported  | Supported  | Not supported
Assign new security group with the isAssignableToRole set to true to a built-in Azure AD role.  | Supported  | Supported  | Supported
Put users into a group and assign it to a built-in Azure AD role (assuming the group can be assigned to a role)  | Supported  | Supported  | Supported
Put service principals into a role-eligible group and assign it to a built-in Azure AD role | Supported  | Supported  | Not supported
Assign groups with isAssignableToRole set to true to built-in roles scoped to Admin Units.  | First half of calendar 2020  | First half of calendar 2020 | First half of calendar 2020
Delegate the management of group that has been assigned to a built-in role.  | First half of calendar 2020  | First half of calendar 2020  | First half of calendar 2020
Assign a new on-premises security group to an Azure AD role (no Office 365 group on-prem).  | First half of calendar 2020  | First half of calendar 2020  | First half of calendar 2020
Assign an existing on-premises security group to an Azure AD role (no Office 365 group on-premises). | First half of calendar 2020  | First half of calendar 2020  | First half of calendar 2020
Nest another group with isAssignableToRole set to true into a group that is assigned a role. | First half of calendar 2020  | First half of calendar 2020 | First half of calendar 2020
Assign a group (on-premises or cloud) to custom Azure AD role  | First half of calendar 2020  | First half of calendar 2020  | First half of calendar 2020
Use an existing Office 365 cloud group and assign it to a role  | Out of scope  | Out of scope  | Out of scope
Use an existing security cloud group and assign it to a role | Out of scope  | Out of scope  | Out of scope

## Next steps

- [Create a role-eligible group](roles-groups-create-eligible.md)
- [Assign a role to a group](roles-groups-assign-role.md)
- [View a group's role assignments](roles-groups-view-assignments.md)
- [Remove a group role assignment](roles-groups-remove-assignment.md)
