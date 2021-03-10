---
title: Managing privileged Azure AD groups in Privileged Identity Management (PIM) | Microsoft Docs
description: How to manage members and owners of privileged access groups in Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/01/2020
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev or IT admin, I want to manage group assignments in PIM, so that I can grant eligibility for elevation to a role assigned via group membership
---

# Management capabilities for privileged access Azure AD groups (preview)

In Privileged Identity Management (PIM), you can now assign eligibility for membership or ownership of privileged access groups. Starting with this preview, you can assign Azure Active Directory (Azure AD) built-in roles to cloud groups and use PIM to manage group member and owner eligibility and activation. For more information about role-assignable groups in Azure AD, see [Use cloud groups to manage role assignments in Azure Active Directory (preview)](../roles/groups-concept.md).

>[!Important]
> To assign a privileged access group to a role for administrative access to Exchange, Security and Compliance center, or SharePoint, use the Azure AD portal **Roles and Administrators** experience and not in the Privileged Access Groups experience to make the user or group eligible for activation into the group.

## Require different policies for each role assignable group

Some organizations use tools like Azure AD business-to-business (B2B) collaboration to invite their partners as guests to their Azure AD organization. Instead of a single just-in-time policy for all assignments to a privileged role, you can create two different privileged access groups with their own policies. You can enforce less strict requirements for your trusted employees, and stricter requirements like approval workflow for your partners when they request activation into their assigned group.

## Activate multiple role assignments in a single request

With the privileged access groups preview, you can give workload-specific administrators quick access to multiple roles with a single just-in-time request. For example, your Tier 3 Office Admins might need just-in-time access to the Exchange Admin, Office Apps Admin, Teams Admin, and Search Admin roles to thoroughly investigate incidents daily. Before today it would require four consecutive requests, which are a process that takes some time. Instead, you can create a role assignable group called “Tier 3 Office Admins”, assign it to each of the four roles previously mentioned (or any Azure AD built-in roles) and enable it for Privileged Access in the group’s Activity section. Once enabled for privileged access, you can configure the just-in-time settings for members of the group and assign your admins and owners as eligible. When the admins elevate into the group, they’ll become members of all four Azure AD roles.

## Extend and renew group assignments

After you set up your time-bound owner or member assignments, the first question you might ask is what happens if an assignment expires? In this new version, we provide two options for this scenario:

- Extend – When a role assignment nears expiration, the user can use Privileged Identity Management to request an extension for the role assignment
- Renew – When a role assignment has already expired, the user can use Privileged Identity Management to request a renewal for the role assignment

Both user-initiated actions require an approval from a Global administrator or Privileged role administrator. Admins will no longer need to be in the business of managing these expirations. They can just wait for the extension or renewal requests and approve them if the request is valid.

## Next steps

- [Assign an privileged access group owner or member](groups-assign-member-owner.md)
- [Approve or deny activation requests for privileged access group members and owners](groups-approval-workflow.md)
