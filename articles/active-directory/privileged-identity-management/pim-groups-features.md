---
title: Managing privileged access groups in Privileged Identity Management (PIM) | Microsoft Docs
description: How to manage members and owners of privileged access groups in Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.subservice: pim
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/27/2020
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev or IT admin, I want to manage group assignments in PIM, so that I can grant eligibility for elevation to a role assigned via group membership
---

# Management capabilities for privileged access groups (preview) in Privileged Identity Management

In Privileged Identity Management (PIM), you can now has been updated to add capabilities for assigning eligibility for membership or ownership of privileged access groups. Starting with this preview, you can assign Azure AD built-in roles to cloud groups and use PIM to manage group member and owner eligibility and activation.

## Require different JIT policies for each role assignable group

Some organizations work with partners to configure Microsoft Online Services and use tools like Azure AD B2B to invite these partners as guests to their Azure AD Tenant. Instead of having a single JIT policy for all assignments to a privileged role, you can create two distinct role assignable groups with their own JIT policies, enforcing less strict requirements for your trusted employees and more strict requirements (like approval workflow) for your partners when they request activation of their assigned role.

## Activate multiple directory roles in a single request

With Privileged access groups (preview), you can give workload specific administrators quick access to a broad set of roles with a single JIT request. For example, your Tier 3 Office Admins may need JIT access to the Exchange Admin, Office Apps Admin, Teams Admin, and Search Admin roles to thoroughly investigate incidents daily. Prior to today this would require four consecutive JIT requests, a process we all know takes some time. Instead, you can create a role assignable group called “Tier 3 Office Admins”, assign it to each of the four roles previously mentioned (or any combination of built-in directory roles), and enable it for Privileged Access in the group’s Activity section. Once enabled for privileged access you can configure the JIT settings for members of the group and assign your admins and owners as eligible. When the admins JIT into the group, they’ll become members of all four Azure AD roles!

## New group assignment settings

We are also adding new settings for privileged access group owner and member assignments. Previously, you could only configure activation settings on a per-assignment basis. That is, activation settings such as multi-factor authentication requirements and incident or request ticket requirements were applied to all users eligible for a specified owner or member assignment. Now, you can configure whether an individual user needs to perform multi-factor authentication before they can activate an assignment. Also, you can have advanced control over your Privileged Identity Management emails related to specific assignments.

## Extend and renew group assignments

As soon as you figure out time-bound owner or member assignment, the first question you might ask is what happens if an assignment is expired? In this new version, we provide two options for this scenario:

- Extend – When a role assignment nears expiration, the user can use Privileged Identity Management to request an extension for the role assignment
- Renew – When a role assignment has already expired, the user can use Privileged Identity Management to request a renewal for the role assignment

Both user-initiated actions require an approval from a Global administrator or Privileged role administrator. Admins will no longer need to be in the business of managing these expirations. They can just wait for the extension or renewal requests and approve them if the request is valid.

## Next steps

- [Assign an privileged access group owner or member](pim-groups-assign-member-owner.md)
- [Approve or deny activation requests for privileged access group members and owners](pim-groups-approval-workflow.md)
