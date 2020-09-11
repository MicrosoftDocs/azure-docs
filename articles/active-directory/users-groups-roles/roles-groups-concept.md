---
title: Use cloud groups to manage role assignments in Azure Active Directory | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 08/11/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Use cloud groups to manage role assignments in Azure Active Directory (preview)

Azure Active Directory (Azure AD) is introducing a public preview in which you can assign a cloud group to Azure AD built-in roles. With this feature, you can use groups to grant admin access in Azure AD with minimal effort from your Global and Privileged role admins.

Consider this example: Contoso has hired people across geographies to manage and reset passwords for employees in its Azure AD organization. Instead of asking a Privileged role admin or Global admin to assign the Helpdesk admin role to each person individually, they can create a Contoso_Helpdesk_Administrators group and assign it to the role. When people join the group, they are assigned the role indirectly. Your existing governance workflow can then take care of the approval process and auditing of the group’s membership to ensure that only legitimate users are members of the group and are thus assigned to the Helpdesk admin role.

## How this feature works

Create a new Office 365 or security group with the ‘isAssignableToRole’ property set to ‘true’. You could also enable this property when creating a group in the Azure portal by turning on **Azure AD roles can be assigned to the group**. Either way, you can then assign the group to one or more Azure AD roles in the same way as you assign roles to users. A maximum of 200 role-assignable groups can be created in a single Azure AD organization (tenant).

If you do not want members of the group to have standing access to the role, you can use Azure AD Privileged Identity Management. Assign a group as an eligible member of an Azure AD role. Each member of the group is then eligible to have their assignment activated for the role that the group is assigned to. They can then activate their role assignment for a fixed time duration.

> [!Note]
> You must be on updated version of Privileged Identity Management to be able to assign a group to Azure AD role via PIM. You could be on older version of PIM because your Azure AD organization leverages the Privileged Identity Management API. Please reach out to the alias pim_preview@microsoft.com to move your organization and update your API. Learn more at [Azure AD roles and features in PIM](../privileged-identity-management/azure-ad-roles-features.md).

## Why we enforce creation of a special group for assigning it to a role

If a group is assigned a role, any IT admin who can manage group membership could also indirectly manage the membership of that role. For example, assume that a group Contoso_User_Administrators is assigned to User account admin role. An Exchange admin who can modify group membership could add themselves to the Contoso_User_Administrators group and in that way become a User account admin. As you can see, an admin could elevate their privilege in a way you did not intend.

Azure AD allows you to protect a group assigned to a role by using a new property called isAssignableToRole for groups. Only cloud groups that had the isAssignableToRole property set to ‘true’ at creation time can be assigned to a role. This property is immutable; once a group is created with this property set to ‘true’, it can’t be changed. You can't set the property on an existing group.
We designed how groups are assigned to roles to prevent that sort of potential breach from happening:

- Only Global admins and Privileged role admins can create a role-assignable group (with the "isAssignableToRole" property enabled).
- It can't be an Azure AD dynamic group; that is, it must have a membership type of "Assigned." Automated population of dynamic groups could lead to an unwanted account being added to the group and thus assigned to the role.
- By default, only Global admins and Privileged role admins can manage the membership of a role-assignable group, but you can delegate the management of role-assignable groups by adding group owners.
- To prevent elevation of privilege, the credentials of members and owners of a role-assignable group can be changed only by a Privileged Authentication administrator or a Global administrator.
- No nesting. A group can't be added as a member of a role-assignable group.

## Limitations

The following scenarios are not supported right now:  

- Assign cloud groups to Azure AD custom roles
- Assign cloud groups to Azure AD roles (built-in or custom) over an administrative unit or application scope.
- Assign on-premises groups to Azure AD roles (built-in or custom)

## Known issues

- You can't create or modify a dynamic group when the role is assigned via a group.
- The **Enable staged rollout for managed user sign-in** feature doesn't support assignment via group.
- *Azure AD P2 licensed customers only*: Don't assign a group as Active to a role through both Azure AD and Privileged Identity Management (PIM). Specifically, don't assign a role to a role-assignable group when it's being created *and* assign a role to the group using PIM later. This will lead to issues where users can’t see their active role assignments in the PIM as well as the inability to remove that PIM assignment. Eligible assignments are not affected in this scenario. If you do attempt to make this assignment, you might see unexpected behavior such as:
  - End time for the role assignment might display incorrectly.
  - In the PIM portal, **My Roles** can show only one role assignment regardless of how many methods by which the assignment is granted (through one or more groups and directly).
- *Azure AD P2 licensed customers only* Even after deleting the group, it is still shown an eligible member of the role in PIM UI. Functionally there's no problem; it's just a cache issue in the Azure portal.  
- Exchange Admin Center doesn't recognize role membership via group yet, but PowerShell cmdlet will work.
- Azure Information Protection Portal (the classic portal) doesn't recognize role membership via group yet. You can [migrate to the unified sensitivity labeling platform](/azure/information-protection/configure-policy-migrate-labels) and then use the Office 365 Security & Compliance center to use group assignments to manage roles.

We are fixing these issues.

## Required license plan

Using this feature requires you to have an available Azure AD Premium P1 license in your Azure AD organization. To use also Privileged Identity Management for just-in-time role activation requires you to have an available Azure AD Premium P2 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium plans](../fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses).

## Next steps

- [Create a role-assignable group](roles-groups-create-eligible.md)
- [Assign a role to a role-assignable group](roles-groups-assign-role.md)