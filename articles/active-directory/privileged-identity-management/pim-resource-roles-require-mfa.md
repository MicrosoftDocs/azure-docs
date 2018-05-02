---
title: Privileged Identity Management for Azure Resources - MFA | Microsoft Docs
description: This document describes how to enable multi-factor authentication for PIM resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: mwahl
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource Roles - MFA

PIM for Azure resource roles enables resource administrators and identity administrators to protect critical Azure infrastructure with time-bound membership, and just-in-time access. In addition, PIM provides optional enforcement of Azure Multi-Factor Authentication (MFA) for two distinct scenarios.

## Require MFA to activate

Resource administrators can require eligible members of a role succeed Azure MFA before they can activate. This process ensures the user requesting activation is who they say they are with reasonable certainty. Enforcing this option protects critical resources in situations when the user account may have been compromised. 

To enforce this requirement, select a resource from the list of managed resources. From the [overview dashboard](pim-resource-roles-overview-dashboards.md), select a role from the list of roles in the bottom right of the screen.

Additionally, you can get to role settings from either the "Roles" or "Role settings" tabs in the left navigation menu.

>[!Note]
>If the options in the left navigation menu are grayed out and you see a banner at the top of the page that states "You have eligible roles that can be activated" you are not an active administrator, and must [activate](pim-resource-roles-activate-your-roles.md) before continuing.

![](media/azure-pim-resource-rbac/aadpim_rbac_manage_a_role_v2.png)

If viewing a role's membership, select "Role settings" from the bar at the top of the screen to open the "Role setting detail".

Click the **Edit** button at the top to modify the role settings.

In the section under **Activate**, click the checkbox to **Require Multi-Factor Authentication to activate**, then click save.

![](media/azure-pim-resource-rbac/aadpim_rbac_require_mfa.png)

## Require MFA on assignment

In some cases, a resource administrator may want to assign a member to a role for a short duration (one day for example), and not need the assigned member(s) to request activation. In this scenario, PIM cannot enforce MFA when the member uses their role assignment since they are already active in the role from the moment they are assigned.

To ensure the resource administrator fulfilling the assignment is who they say they are, you can enforce MFA on assignment.

From the same Role setting details screen, check the box to "Require Multi-Factor Authentication on assignment".

![](media/azure-pim-resource-rbac/aadpim_rbac_require_mfa_on_assignment.png)

## Next steps

[Require approval to activate](pim-resource-roles-approval-workflow.md)

[Use the audit log](pim-resource-roles-use-the-audit-log.md)



