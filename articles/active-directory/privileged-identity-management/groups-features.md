---
title: Managing Privileged Access groups in Privileged Identity Management (PIM) | Microsoft Docs
description: How to manage members and owners of privileged access groups in Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/15/2022
ms.author: amsliu
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev or IT admin, I want to manage group assignments in PIM, so that I can grant eligibility for elevation to a role assigned via group membership
---

# Management capabilities for Privileged Access groups (preview)

In Privileged Identity Management (PIM), you can now assign eligibility for membership or ownership of privileged access groups. Starting with this preview, you can assign built-in roles in Azure Active Directory (Azure AD), part of Microsoft Entra, to cloud groups and use PIM to manage group member and owner eligibility and activation. For more information about role-assignable groups in Azure AD, see [Use Azure AD groups to manage role assignments](../roles/groups-concept.md).

> [!IMPORTANT]
> To provide a group of users with just-in-time access to Azure AD directory roles with permissions in SharePoint, Exchange, or Security & Compliance Center (for example, Exchange Administrator role), be sure to make active assignments of users to the group, and then assign the group to a role as eligible for activation. If instead you make active assignment of a role to a group and assign users to be eligible to group membership, it might take significant time to have all permissions of the role activated and ready to use.

> [!NOTE]
> For privileged access groups that are used to elevate into Azure AD roles, we recommend that you require an approval process for eligible member assignments. Assignments that can be activated without approval might create a security risk from administrators who have a lower level of permissions. For example, the Helpdesk Administrator has permissions to reset an eligible user's password.

## Require different policies for each role assignable group

Some organizations use tools like Azure AD business-to-business (B2B) collaboration to invite their partners as guests to their Azure AD organization. Instead of a single just-in-time policy for all assignments to a privileged role, you can create two different privileged access groups with their own policies. You can enforce less strict requirements for your trusted employees, and stricter requirements like approval workflow for your partners when they request activation into their assigned role.

## Activate multiple role assignments in a single request

With the privileged access groups preview, you can give workload-specific administrators quick access to multiple roles with a single just-in-time request. For example, your Tier 0 Office Admins might need just-in-time access to the Exchange Admin, Office Apps Admin, Teams Admin, and Search Admin roles to thoroughly investigate incidents daily. You can create a role-assignable group called “Tier 0 Office Admins”, and make it eligible for assignment to the four roles previously mentioned (or any Azure AD built-in roles) and enable it for Privileged Access in the group’s Activity section. Once enabled for privileged access, you can assign your admins and owners to the group. When the admins elevate the group into the roles, your staff will have permissions from all four Azure AD roles.

## Extend and renew group assignments

After you set up your time-bound owner or member assignments, the first question you might ask is what happens if an assignment expires? In this new version, we provide two options for this scenario:

- Extend – When a role assignment nears expiration, the user can use Privileged Identity Management to request an extension for the role assignment
- Renew – When a role assignment has already expired, the user can use Privileged Identity Management to request a renewal for the role assignment

Both user-initiated actions require an approval from a Global administrator or Privileged role administrator. Admins will no longer need to be in the business of managing these expirations. They can just wait for the extension or renewal requests and approve them if the request is valid.

## Next steps

- [Assign a privileged access group owner or member](groups-assign-member-owner.md)
- [Approve or deny activation requests for privileged access group members and owners](groups-approval-workflow.md)
