---
title: Privileged Identity Management (PIM) for Groups
description: How to manage Microsoft Entra Privileged Identity Management (PIM) for Groups.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 9/12/2023
ms.author: barclayn
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev or IT admin, I want to manage group assignments in PIM, so that I can grant eligibility for elevation to a role assigned via group membership
---

# Privileged Identity Management (PIM) for Groups

Microsoft Entra ID allows you to grant users just-in-time membership and ownership of groups through Privileged Identity Management (PIM) for Groups. Groups can be used to control access to a variety of scenarios, including Microsoft Entra roles, Azure roles, Azure SQL, Azure Key Vault, Intune, other application roles, and third-party applications.

## What is PIM for Groups?

PIM for Groups is part of Microsoft Entra Privileged Identity Management – alongside with PIM for Microsoft Entra roles and PIM for Azure Resources, PIM for Groups enables users to activate the ownership or membership of a Microsoft Entra security group or Microsoft 365 group. Groups can be used to govern access to various scenarios that include Microsoft Entra roles, Azure roles, Azure SQL, Azure Key Vault, Intune, other application roles, and third party applications.

With PIM for Groups you can use policies similar to ones you use in PIM for Microsoft Entra roles and PIM for Azure Resources: you can require approval for membership or ownership activation, enforce multi-factor authentication (MFA), require justification, limit maximum activation time, and more. Each group in PIM for Groups has two policies: one for activation of membership and another for activation of ownership in the group. Up until January 2023, PIM for Groups feature was called “Privileged Access Groups”.

[!INCLUDE [PIM for Groups note](../includes/pim-for-groups-include.md)]

<a name='what-are-entra-id-role-assignable-groups'></a>

## What are Microsoft Entra role-assignable groups?

When working with Microsoft Entra ID, you can assign a Microsoft Entra security group or Microsoft 365 group to a Microsoft Entra role. This is possible only with groups that are created as role-assignable.

To learn more about Microsoft Entra role-assignable groups, see [Create a role-assignable group in Microsoft Entra ID](../roles/groups-create-eligible.md). 

Role-assignable groups benefit from extra protections comparing to non-role-assignable groups:

- **Role-assignable groups** - only the Global Administrator, Privileged Role Administrator, or the group Owner can manage the group. Also, no other users can change the credentials of the users who are (active) members of the group. This feature helps prevent an admin from elevating to a higher privileged role without going through a request and approval procedure.
- **Non-role-assignable groups** - various Microsoft Entra roles can manage these groups – that includes Exchange Administrators, Groups Administrators, User Administrators, etc. Also, various roles Microsoft Entra roles can change the credentials of the users who are (active) members of the group – that includes Authentication Administrators, Helpdesk Administrators, User Administrators, etc.

To learn more about Microsoft Entra built-in roles and their permissions, see [Microsoft Entra built-in roles](../roles/permissions-reference.md).

Microsoft Entra role-assignable group feature is not part of Microsoft Entra Privileged Identity Management (Microsoft Entra PIM). For more information on licensing, see [Microsoft Entra ID Governance licensing fundamentals](../../active-directory/governance/licensing-fundamentals.md) .


## Relationship between role-assignable groups and PIM for Groups

Groups in Microsoft Entra ID can be classified as either role-assignable or non-role-assignable. Additionally, any group can be enabled or not enabled for use with Microsoft Entra Privileged Identity Management (PIM) for Groups. These are independent properties of the group. Any Microsoft Entra security group and any Microsoft 365 group (except dynamic groups and groups synchronized from on-premises environment) can be enabled in PIM for Groups. The group doesn't have to be role-assignable group to be enabled in PIM for Groups.

If you want to assign a Microsoft Entra role to a group, it has to be role-assignable. Even if you don't intend to assign a Microsoft Entra role to the group but the group provides access to sensitive resources, it is still recommended to consider creating the group as role-assignable. This is because of extra protections role-assignable groups have – see [“What are Microsoft Entra role-assignable groups?”](#what-are-entra-id-role-assignable-groups) in the section above.

>[!IMPORTANT]
> Up until January 2023, it was required that every Privileged Access Group (former name for this PIM for Groups feature) had to be role-assignable group. This restriction is currently removed. Because of that, it is now possible to enable more than 500 groups per tenant in PIM, but only up to 500 groups can be role-assignable.

<a name='making-group-of-users-eligible-for-entra-id-role'></a>

## Making group of users eligible for Microsoft Entra role

There are two ways to make a group of users eligible for Microsoft Entra role:

1. Make active assignments of users to the group, and then assign the group to a role as eligible for activation.
2. Make active assignment of a role to a group and assign users to be eligible to group membership.

To provide a group of users with just-in-time access to Microsoft Entra roles with permissions in SharePoint, Exchange, or Security & Microsoft Purview compliance portal (for example, Exchange Administrator role), be sure to make active assignments of users to the group, and then assign the group to a role as eligible for activation (Option #1 above). If you choose to make active assignment of a group to a role and assign users to be eligible to group membership instead, it may take significant time to have all permissions of the role activated and ready to use.

## Privileged Identity Management and group nesting

In Microsoft Entra ID, role-assignable groups can’t have other groups nested inside them. To learn more, see [Use Microsoft Entra groups to manage role assignments](../roles/groups-concept.md). This is applicable to active membership: one group can't be an active member of another group that is role-assignable.

One group can be an eligible member of another group, even if one of those groups is role-assignable.

If a user is an active member of Group A, and Group A is an eligible member of Group B, the user can activate their membership in Group B. This activation is only for the user that requested the activation for, it doesn't mean that the entire Group A becomes an active member of Group B.

## Privileged Identity Management and app provisioning (Public Preview)

If the group is configured for [app provisioning](../app-provisioning/index.yml), activation of group membership will trigger provisioning of group membership (and user account itself if it wasn’t provisioned previously) to the application using SCIM protocol. 

In Public Preview we have a functionality that triggers provisioning right after group membership is activated in PIM.
Provisioning configuration depends on the application. Generally, we recommend having at least two groups assigned to the application. Depending on the number of roles in your application, you may choose to define additional “privileged groups.”:


|Group|Purpose|Members|Group membership|Role assigned in the application|
|-----|-----|-----|-----|-----|
|All users group|Ensure that all users that need access to the application are constantly provisioned to the application.|All users that need to access application.|Active|None, or low-privileged role|
|Privileged group|Provide just-in-time access to privileged role in the application.|Users that need to have just-in-time access to privileged role in the application.|Eligible|Privileged role|

## Next steps

- [Bring groups into Privileged Identity Management](groups-discover-groups.md)
- [Assign eligibility for a group in Privileged Identity Management](groups-assign-member-owner.md)
- [Activate your group membership or ownership in Privileged Identity Management](groups-activate-roles.md)
- [Approve activation requests for group members and owners](groups-approval-workflow.md)
