---
title: Difference between Privileged Access groups and role-assignable groups - Azure AD | Microsoft Docs
description: Learn how to tell the difference between Privileged Access groups and role-assignable groups in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 07/02/2021
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# What's the difference between Privileged Access groups and role-assignable groups

## What are Azure AD role-assignable groups?

Azure AD supports the ability to assign a cloud native Azure AD security group to an Azure AD role. In order to add additional security for this scenario, Global Administrators and Privileged Role Administrators must create a new Azure AD security group and enable the ability to assign the group to a role while creating the new group. Once this setting is turned on, only the Global admin, privileged role admin, and owner of the group can modify the membership of the group. Additional protection is also added to prevent non global administrators and privileged role administrators from resetting the password of the user’s who are a member of the group. This helps to prevent an elevation of privileged where a lesser privileged admin gets access to a higher privileged role without going through standard procedure. 

## What are Privileged Access groups?

Privileged Access Group which is a feature within Azure AD that enables support of just-in-time access for the owner and member role of an Azure AD security group. This allows IT administrators to setup just-in-time workflows for not only Azure AD and Azure RBAC roles in batches, but also enables just-in-time scenarios for other use cases like Azure SQL, Azure Key Vault, Intune, and 3rd party application roles.  

To incorporate the additional protection offered by role assignable groups, we currently only support the ability to enable privileged access on Azure AD role assignable groups. Since role assignable group is a pre-requisite for privileged access group, it is easy to confuse the two.

[Insert note here related to security concern where eligible members of the group can still have their password reset by a helpdesk administrator]

## When to use each type of group

If you want to set up just-in-time access to permissions and roles beyond Azure AD and Azure Resource roles on resources that can be ackled to an azure ad security group (AKV, Intune, Azure SQL etc.) you should try to enable privileged access on the group and assign user’s with eligible membership to the group.

If you want to assign a group to an Azure AD or Azure Resource role and require activation via PIM, there are two ways you can achieve this:

(1) Assign the group as eligible for a role through PIM. Everyone in the group must activate their assignment to get access to the role. This path requires a role-assignable group for the Azure AD role, and a security group for Azure resources.

(2) Assign the group as active (permanent) to a role. You then grant users eligible member access to the group in PIM. Eligible users must then activate their membership to get into the group that is permanently assigned to the role. This path requires a role-assignable group to be enabled in PIM as a privileged access group for the Azure AD role.

Either of these methods will work for the end-to-end scenario. We recommend you to use (1) in most cases. You should only use (2) if you are trying to:

- If you want to assign a group to multiple Azure AD and / or Azure Resource roles and have user’s activate once to get access to multiple roles.
- If you want to have different activation policies for different sets of users to access an Azure AD or Azure Resource role. E.G. if you wanted some users to get approval before becoming a global admin while allowing other users to be auto-approved, you can setup two privileged access group, assign them both persistently to a global admin role and have different activation policy for the member role of each of the groups.
