---
title: What's th difference between Privileged Access groups and role-assignable groups - Azure AD | Microsoft Docs
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

To incorporate another protection offered by Azure Active Directory (Azure AD) role-assignable groups, Privileged Identity Management (PIM) supports the ability to enable privileged access on role-assignable groups. Because an available role-assignable group is a prerequisite for creating a privileged access group, it is easy to confuse the two.

## What are Azure AD role-assignable groups?

Azure AD lets you assign a cloud Azure AD security group to an Azure AD role. Global Administrators and Privileged Role Administrators must create a new security group and make the group role-assignable at creation time. Only users in the Global Administrator, Privileged Role Administrator, or the group's Owner roles can change the membership of the group. We also prevent other users from resetting the password of the users who are members of the group. This feature helps prevent an elevation of privileged where a less privileged admin gets access to a higher privileged role without going through a request and approval procedure.

## What are Privileged Access groups?

Privileged Access groups enable support of just-in-time access for the owner and member role of an Azure AD security group. This feature allows IT administrators to set up just-in-time workflows for not only Azure AD and Azure roles in batches, but also enables just-in-time scenarios for other use cases like Azure SQL, Azure Key Vault, Intune, or other application roles.  

Eligible members of the group can still have their password reset by the Helpdesk Administrator role. You can also use Privileged Identity Management to manage access to the Helpdesk Administrator role can improve your security posture.

## When to use each type of group

If you want to set up just-in-time access to permissions and roles beyond Azure AD and Azure Resource roles on resources that can be added via an access control list (ACL) to an Azure AD security group (for AKV, Intune, Azure SQL, or other apps and services), you should enable privileged access on the group and assign users with eligible membership to the group.

If you want to assign a group to an Azure AD or Azure Resource role and require activation via PIM, there are two ways you can achieve this result:

- Assign the group as eligible for a role through PIM. Everyone in the group must activate their assignment to get access to the role. This path requires a role-assignable group for the Azure AD role, and a security group for Azure resources.

- Assign the group as active (permanent) to a role. You then grant users eligible member access to the group in PIM. Eligible users must then activate their membership to get into the group that is permanently assigned to the role. This path requires a role-assignable group to be enabled in PIM as a privileged access group for the Azure AD role.

Either of these methods will work for the end-to-end scenario. We recommend that you use the first method in most cases. You should use the second method only if you are trying to:

- Assign a group to multiple Azure AD and / or Azure Resource roles and have user’s activate once to get access to multiple roles.
- Maintain different activation policies for different sets of users to access an Azure AD or Azure resource role. For example, if you want some users to be approved before becoming a Global Administrator while allowing other users to be auto-approved, you can set up two privileged access groups, assign them both persistently (a "permanent" assignment in Privileged Identity Management) to the Global Administrator role and then use a different activation policy for the member role for each group.
