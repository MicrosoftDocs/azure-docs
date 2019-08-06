---
title: Activate an Azure AD custom role in Privileged Identity Management (PIM)| Microsoft Docs
description: How to activate an Azure AD custom role for assignment Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: role-based-access-control
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/06/2019
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev, devops, or it admin, I want to learn how to activate Azure AD custom roles, so that I can grant access to resources using this new capability.
---

# Activate an Azure AD custom role in Privileged Identity Management

Azure AD Privileged Identity Management now supports just-in-time and time-bound assignment to custom roles created for Application Management in the Identity and Access Management administrative experience. View the details here [insert link to Vince’s docs] to learn more about and create custom roles for delegated application management.

> [!NOTE]
> Azure AD custom roles are not integrated with the built-in directory roles during preview. Once the capability is generally available, role management will appear as in the built-in roles experience.

## Activate a role

When you need to activate an Azure AD custom role, request activation by selecting the My roles navigation option in PIM.
1.	Sign in to the Azure portal.
2.	Open Azure AD Privileged Identity Management.
3.	Click My roles.
 
4.	Click Azure AD custom roles to see a list of your eligible Azure AD custom role assignments.
 
5.	In the Azure AD custom roles list, find the assignment you need to use
 
6.	Click Activate to open the Activate pane
7.	If your role requires multi-factor authentication (MFA), click Verify your identity before proceeding. You only have to authenticate once per session.
 
8.	Click Verify my identity and follow the instructions to provide additional security verification.
  
9.	To specify an application scope, click Scope to open the filter pane.
 
It's a best practice to only request access to the role at the scope you need. If your assignment was at an application scope, you will only be able to activate at that scope.
10.	If necessary, specify a custom activation start time. The member would be activated after the selected time.
11.	In the Ticket system, Ticket number, reason box, enter the reason for the activation request. These can be made required or not in the role setting
12.	Click Activate.
If the role does not require approval, it is activated and added to the list of active roles. If you want to use the role, follow the steps in next section.
If the role requires approval to activate, a notification will appear in the upper right corner of your browser informing you the request is pending approval.
 
## Next steps

- [License requirements to use PIM](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy PIM](pim-deployment-plan.md)
