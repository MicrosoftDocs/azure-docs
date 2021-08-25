---
title: Use Azure AD groups to manage role assignments - Azure Active Directory
description: Use Azure AD groups to simplify role assignment management in Azure Active Directory.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: article
ms.date: 07/30/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Use Azure AD groups to manage role assignments

Azure Active Directory (Azure AD) lets you target Azure AD groups for role assignments. Assigning roles to groups can simplify the management of role assignments in Azure AD with minimal effort from your Global Administrators and Privileged Role Administrators.

## Why assign roles to groups?

Consider the example where the Contoso company has hired people across geographies to manage and reset passwords for employees in its Azure AD organization. Instead of asking a Privileged Role Administrator or Global Administrator to assign the Helpdesk Administrator role to each person individually, they can create a Contoso_Helpdesk_Administrators group and assign the role to the group. When people join the group, they are assigned the role indirectly. Your existing governance workflow can then take care of the approval process and auditing of the group's membership to ensure that only legitimate users are members of the group and are thus assigned the Helpdesk Administrator role.

## How role assignments to groups work

To assign a role to a group, you must create a new security or Microsoft 365 group with the `isAssignableToRole` property set to `true`. In the Azure portal, you set the **Azure AD roles can be assigned to the group** option to **Yes**. Either way, you can then assign one or more Azure AD roles to the group in the same way as you assign roles to users.

![Screenshot of the Roles and administrators page](./media/groups-concept/role-assignable-group.png)

## Restrictions for role-assignable groups

Role-assignable groups have the following restrictions:

- You can only set the `isAssignableToRole` property or the **Azure AD roles can be assigned to the group** option for new groups.
- The `isAssignableToRole` property is **immutable**. Once a group is created with this property set, it can't be changed.
- You can't make an existing group a role-assignable group.
- A maximum of 300 role-assignable groups can be created in a single Azure AD organization (tenant).

## How are role-assignable groups protected?

If a group is assigned a role, any IT administrator who can manage group membership could also indirectly manage the membership of that role. For example, assume that a group named Contoso_User_Administrators is assigned the User Administrator role. An Exchange administrator who can modify group membership could add themselves to the Contoso_User_Administrators group and in that way become a User Administrator. As you can see, an administrator could elevate their privilege in a way you did not intend.

Only groups that have the `isAssignableToRole` property set to `true` at creation time can be assigned a role. This property is immutable. Once a group is created with this property set, it can't be changed. You can't set the property on an existing group.

Role-assignable groups are designed to help prevent potential breaches by having the following restrictions:

- Only Global Administrators and Privileged Role Administrators can create a role-assignable group.
- The membership type for role-assignable groups must be Assigned and can't be an Azure AD dynamic group. Automated population of dynamic groups could lead to an unwanted account being added to the group and thus assigned to the role.
- By default, only Global Administrators and Privileged Role Administrators can manage the membership of a role-assignable group, but you can delegate the management of role-assignable groups by adding group owners.
- RoleManagement.ReadWrite.All Microsoft Graph permission is required to be able to be able to manage the membership of such groups; Group.ReadWrite.All won't work.
- To prevent elevation of privilege, only a Privileged Authentication Administrator or a Global Administrator can change the credentials or reset MFA for members and owners of a role-assignable group.
- Group nesting is not supported. A group can't be added as a member of a role-assignable group.

## Use PIM to make a group eligible for a role assignment

If you do not want members of the group to have standing access to a role, you can use [Azure AD Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) to make a group eligible for a role assignment. Each member of the group is then eligible to activate the role assignment for a fixed time duration.

> [!Note]
> You must be using an updated version of PIM to be able to assign a Azure AD role to a group. You could be using an older version of PIM because your Azure AD organization leverages the PIM API. Send email to pim_preview@microsoft.com to move your organization and update your API. For more information, see [Azure AD roles and features in PIM](../privileged-identity-management/pim-configure.md).

## Scenarios not supported

The following scenarios are not supported:  

- Assign Azure AD roles (built-in or custom) to on-premises groups.

## Known issues

The following are known issues with role-assignable groups:

- *Azure AD P2 licensed customers only*: Even after deleting the group, it is still shown an eligible member of the role in PIM UI. Functionally there's no problem; it's just a cache issue in the Azure portal.  
- Use the new [Exchange admin center](https://admin.exchange.microsoft.com/) for role assignments via group membership. The old Exchange admin center doesn't support this feature yet. Exchange PowerShell cmdlets will work as expected.
- Azure Information Protection Portal (the classic portal) doesn't recognize role membership via group yet. You can [migrate to the unified sensitivity labeling platform](/azure/information-protection/configure-policy-migrate-labels) and then use the Office 365 Security & Compliance center to use group assignments to manage roles.
- [Apps admin center](https://config.office.com/) doesn't support this feature yet. Assign users directly to Office Apps Administrator role.

## License requirements

Using this feature requires an Azure AD Premium P1 license. To also use Privileged Identity Management for just-in-time role activation, requires an Azure AD Premium P2 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## Next steps

- [Create a role-assignable group](groups-create-eligible.md)
- [Assign Azure AD roles to groups](groups-assign-role.md)
