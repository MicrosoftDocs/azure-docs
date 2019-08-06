---
title: Update or remove an Azure AD custom role assignments in Privileged Identity Management (PIM) | Microsoft Docs
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

# Update or remove an Azure AD custom role assignments in Privileged Identity Management

Azure AD Privileged Identity Management now supports just-in-time and time-bound assignment to custom roles created for Application Management in the Identity and Access Management administrative experience. View the details here [insert link to Vince’s docs] to learn more about and create custom roles for delegated application management.

> [!NOTE]
> Azure AD custom roles are not integrated with the built-in directory roles during preview. Once the capability is generally available, role management will appear as in the built-in roles experience.

## Update or remove an assignment

Follow these steps to update or remove an existing custom role assignment.

1. Open Azure AD Privileged Identity Management.
1. Click Azure AD custom roles
1. Under Manage, click Roles to see the list of Azure AD custom roles.
1. Click the role that you want to update or remove.
1. Find the role assignment on the Eligible roles or Active roles tabs.
1. Click Update or Remove to update or remove the role assignment.

## Next steps

- [License requirements to use PIM](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy PIM](pim-deployment-plan.md)
