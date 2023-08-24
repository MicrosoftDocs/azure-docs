---
title: Privileged Identity Management (PIM) for Groups
description: How to manage Azure AD Privileged Identity Management (PIM) for Groups.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 6/7/2023
ms.author: billmath
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev or IT admin, I want to manage group assignments in PIM, so that I can grant eligibility for elevation to a role assigned via group membership
---

# Privileged Identity Management (PIM) for Groups

With Azure Active Directory (Azure AD), part of Microsoft Entra, you can provide users just-in-time membership in the group and just-in-time ownership of the group using the Azure AD Privileged Identity Management for Groups feature. These groups can be used to govern access to various scenarios that include Azure AD roles, Azure roles, as well as Azure SQL, Azure Key Vault, Intune, other application roles, and third party applications.

## What is PIM for Groups?

PIM for Groups is part of Azure AD Privileged Identity Management – alongside with PIM for Azure AD Roles and PIM for Azure Resources, PIM for Groups enables users to activate the ownership or membership of an Azure AD security group or Microsoft 365 group. Groups can be used to govern access to various scenarios that include Azure AD roles, Azure roles, as well as Azure SQL, Azure Key Vault, Intune, other application roles, and third party applications.

With PIM for Groups you can use policies similar to ones you use in PIM for Azure AD Roles and PIM for Azure Resources: you can require approval for membership or ownership activation, enforce multi-factor authentication (MFA), require justification, limit maximum activation time, and more. Each group in PIM for Groups has two policies: one for activation of membership and another for activation of ownership in the group. Up until January 2023, PIM for Groups feature was called “Privileged Access Groups”.

[!INCLUDE [PIM for Groups note](../includes/pim-for-groups-include.md)]

## What are Azure AD role-assignable groups?

With Azure Active Directory (Azure AD), part of Microsoft Entra, you can assign a cloud Azure AD security group or Microsoft 365 group to an Azure AD role. This is possible only with groups that are created as role-assignable.

To learn more about Azure AD role-assignable groups, see [Create a role-assignable group in Azure Active Directory](../roles/groups-create-eligible.md). 

Role-assignable groups benefit from extra protections comparing to non-role-assignable groups:
-	For role-assignable groups, only the Global Administrator, Privileged Role Administrator, or the group Owner can manage the group. Also, no other users can change the credentials of the users who are (active) members of the group. This feature helps prevent an admin from elevating to a higher privileged role without going through a request and approval procedure.
-	For non-role-assignable groups, various Azure AD roles can manage group – that includes Exchange Administrators, Groups Administrators, User Administrators, etc. Also, various roles Azure AD roles can change the credentials of the users who are (active) members of the group – that includes Authentication Administrators, Helpdesk Administrators, User Administrators, etc.

To learn more about Azure AD built-in roles and their permissions, see [Azure AD built-in roles](../roles/permissions-reference.md).

One Azure AD tenant can have up to 500 role-assignable groups. To learn more about Azure AD service limits and restrictions, see [Azure AD service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md).

Azure AD role-assignable group feature is not part of Azure AD Privileged Identity Management (Azure AD PIM). It requires a Microsft Entra Premium P1, P2, or Micrsoft Entra ID Governance license.

## Relationship between role-assignable groups and PIM for Groups

Groups can be role-assignable or non-role-assignable. The group can be enabled in PIM for Groups or not enabled in PIM for Groups. These are independent properties of the group. Any Azure AD security group and any Microsoft 365 group (except dynamic groups and groups synchronized from on-premises environment) can be enabled in PIM for Groups. The group does not have to be role-assignable group to be enabled in PIM for Groups.

If you want to assign Azure AD role to a group, it has to be role-assignable. Even if you do not intend to assign Azure AD role to the group but the group provides access to sensitive resources, it is still recommended to consider creating the group as role-assignable. This is because of extra protections role-assignable groups have – see [“What are Azure AD role-assignable groups?”](#what-are-azure-ad-role-assignable-groups) in the section above.

Up until January 2023, it was required that every Privileged Access Group (former name for this PIM for Groups feature) had to be role-assignable group. This restriction is currently removed. Because of that, it is now possible to enable more than 500 groups per tenant in PIM, but only up to 500 groups can be role-assignable.

## Making group of users eligible for Azure AD role

There are two ways to make a group of users eligible for Azure AD role:
1. Make active assignments of users to the group, and then assign the group to a role as eligible for activation.
2. Make active assignment of a role to a group and assign users to be eligible to group membership.

To provide a group of users with just-in-time access to Azure AD directory roles with permissions in SharePoint, Exchange, or Security & Microsoft Purview compliance portal (for example, Exchange Administrator role), be sure to make active assignments of users to the group, and then assign the group to a role as eligible for activation (Option #1 above). If you choose to make active assignment of a group to a role and assign users to be eligible to group membership instead, it may take significant time to have all permissions of the role activated and ready to use.

## Privileged Identity Management and group nesting

In Azure AD, role-assignable groups can’t have other groups nested inside them. To learn more, see [Use Azure AD groups to manage role assignments](../roles/groups-concept.md). This is applicable to active membership: one group cannot be an active member of another group that is role-assignable.

One group can be an eligible member of another group, even if one of those groups is role-assignable.

If a user is an active member of Group A, and Group A is an eligible member of Group B, the user can activate their membership in Group B. This activation will be only for the user that requested the activation for, it does not mean that the entire Group A becomes an active member of Group B.

## Next steps

- [Bring groups into Privileged Identity Management](groups-discover-groups.md)
- [Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners](groups-approval-workflow.md)