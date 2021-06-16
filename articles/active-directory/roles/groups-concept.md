---
title: Use role-assignable groups to simplify role assignment management in Azure AD (preview)
description: Role-assignable groups can simplify the role assignment management in Azure Active Directory by enabling you to assign Azure AD roles to groups.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: article
ms.date: 06/13/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Use role-assignable groups to simplify role assignment management in Azure AD (preview)

> [!IMPORTANT]
> Role-assignable groups is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Groups in Azure Active Directory (Azure AD) that have been set as role assignable (currently in public preview) enables you to assign Azure AD built-in roles to a group. With role-assignable groups, you can simplify the role assignment management in Azure AD with minimal effort from your Global Administrators and Privileged Role Administrators.

## Why use role-assignable groups?

Consider the example where the Contoso company has hired people across geographies to manage and reset passwords for employees in its Azure AD organization. Instead of asking a Privileged Role Administrator or Global Administrator to assign the Helpdesk Administrator role to each person individually, they can create a Contoso_Helpdesk_Administrators group and assign it to the role. When people join the group, they are assigned the role indirectly. Your existing governance workflow can then take care of the approval process and auditing of the group's membership to ensure that only legitimate users are members of the group and are thus assigned to the Helpdesk Administrator role.

## How role-assignable groups work

To create a role-assignable group, you must create a new security or Microsoft 365 group with the `isAssignableToRole` property set to `true`. In the Azure portal, you set the **Azure AD roles can be assigned to the group** option to **Yes**. Either way, you can then assign one or more Azure AD roles to the group in the same way as you assign roles to users. A maximum of 300 role-assignable groups can be created in a single Azure AD organization (tenant).

![Screenshot of the Roles and administrators page](./media/groups-concept/role-assignable-group.png)

## Role-assignable groups property

Role-assignable groups have the following restrictions:

- You can only set the role-assignable property for new groups.
- The role-assignable property is **immutable**. Once a group is created with this property set, it can't be changed.
- You can't make an existing group a role-assignable group.

## How are role-assignable groups protected?

If a group is assigned a role, any IT administrator who can manage group membership could also indirectly manage the membership of that role. For example, assume that a group named Contoso_User_Administrators is assigned the User Administrator role. An Exchange Administrator who can modify group membership could add themselves to the Contoso_User_Administrators group and in that way become a User Administrator. As you can see, an administrator could elevate their privilege in a way you did not intend.

Only groups that have the `isAssignableToRole` property set to `true` at creation time can be assigned to a role. This property is immutable. Once a group is created with this property set, it can't be changed. You can't set the property on an existing group. Role-assignable groups are designed to help prevent potential breaches by having the following restrictions:

- Only Global Administrators and Privileged Role Administrators can create a role-assignable group.
- The membership type for role-assignable groups must be Assigned and can't be an Azure AD dynamic group. Automated population of dynamic groups could lead to an unwanted account being added to the group and thus assigned to the role.
- By default, only Global Administrators and Privileged Role Administrators can manage the membership of a role-assignable group, but you can delegate the management of role-assignable groups by adding group owners.
- To prevent elevation of privilege, only a Privileged Authentication Administrator or a Global Administrator can change the credentials or reset MFA for members and owners of a role-assignable group.
- Group nesting is not supported. A group can't be added as a member of a role-assignable group.

## Role-assignable groups and PIM

If you do not want members of the group to have standing access to a role, you can use [Azure AD Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md). Assign a group as an eligible member of an Azure AD role. Each member of the group is then eligible to have their assignment activated for the role that the group is assigned to. They can then activate their role assignment for a fixed time duration.

> [!Note]
> You must be on updated version of PIM to be able to assign a group to an Azure AD role via PIM. You could be on older version of PIM because your Azure AD organization leverages the PIM API. Send email to pim_preview@microsoft.com to move your organization and update your API. For more information, see [Azure AD roles and features in PIM](../privileged-identity-management/azure-ad-roles-features.md).

## Scenarios not supported

The following scenarios are not supported:  

- Assign Azure AD roles (built-in or custom) to on-premises groups.

## Known issues

The following are known issues with role-assignable groups:

- *Azure AD P2 licensed customers only*: Don't assign a group as Active to a role through both Azure AD and PIM. Specifically, don't assign a role to a role-assignable group when it's being created *and* assign a role to the group using PIM later. This will lead to issues where users can't see their active role assignments in the PIM and the inability to remove that PIM assignment. Eligible assignments are not affected in this scenario. If you do attempt to make this assignment, you might see unexpected behavior such as:
  - End time for the role assignment might display incorrectly.
  - In the PIM portal, **My Roles** can show only one role assignment regardless of how many methods by which the assignment is granted (through one or more groups and directly).
- *Azure AD P2 licensed customers only*: Even after deleting the group, it is still shown an eligible member of the role in PIM UI. Functionally there's no problem; it's just a cache issue in the Azure portal.  
- Use the new [Exchange admin center](https://admin.exchange.microsoft.com/) for role assignments via group membership. The old Exchange admin center doesn't support this feature yet. Exchange PowerShell cmdlets will work as expected.
- Azure Information Protection Portal (the classic portal) doesn't recognize role membership via group yet. You can [migrate to the unified sensitivity labeling platform](/azure/information-protection/configure-policy-migrate-labels) and then use the Office 365 Security & Compliance center to use group assignments to manage roles.
- [Apps admin center](https://config.office.com/) doesn't support this feature yet. Assign users directly to Office Apps Administrator role.
- [Microsoft 365 Compliance Center](https://compliance.microsoft.com/) doesn't support this feature yet. Assign users directly to appropriate Azure AD roles to use this portal.

## License requirements

Using this feature requires an Azure AD Premium P1 license. To also use Privileged Identity Management for just-in-time role activation, requires an Azure AD Premium P2 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

## Next steps

- [Create a role-assignable group](groups-create-eligible.md)
- [Assign a role to a role-assignable group](groups-assign-role.md)
