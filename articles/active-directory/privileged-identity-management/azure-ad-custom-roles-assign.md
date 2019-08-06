---
title: Assign an Azure AD custom role in Privileged Identity Management (PIM) | Microsoft Docs
description: How to assign an Azure AD custom role for assignment Privileged Identity Management (PIM)
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

# Assign an Azure AD custom role in Privileged Identity Management

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) now supports just-in-time and time-bound assignment to custom roles created for Application Management in the Identity and Access Management administrative experience. View the details here [insert link to Vince’s docs] to learn more about and create custom roles for delegated application management.

> [!NOTE]
> Azure AD custom roles are not integrated with the built-in directory roles during preview. Once the capability is generally available, role management will appear as in the built-in roles experience.

## Assign a role

Azure Active Directory (Azure AD) Privileged Identity Management (PIM) can manage custom roles you have created in Azure AD application management:
Assign a role
Follow these steps to make an eligible assignment to a custom directory role.
1.	Sign in to Azure portal with a user that is a member of the Privileged Role Administrator role.
1.	For information about how to grant another administrator access to manage PIM, see Grant access to other administrators to manage PIM.
1.	Open Azure AD Privileged Identity Management.
1.	If you haven't started PIM in the Azure portal yet, go to Start using PIM.
1.	Click Azure AD custom roles (Preview)
 
1.	Under Manage, click Roles to see a list of custom roles for Azure AD applications.
 
1.	Click Add member to open the assignment pane.
1.	Click the Scope tab to open and select an application scope. Choose the application scope for the custom role you would like to assign
 
1.	Click Select a role to open the “Select a role” pane.
 

1.	Click a role you want to assign and then click Select. The “Select a member” pane opens.

1.	Click a member you want to assign to the role and then click Select.
 

The Membership settings pane opens.
1.	In the Assignment type list, select Eligible or Active.
 
PIM for Azure AD custom roles provides two distinct assignment types:
- Eligible assignments require the member of the role to perform an action to use the role. Actions might include performing a multi-factor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers.
- Active assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role at all times.

1.	If the assignment should be permanent (permanently eligible or permanently assigned), select the “Permanent” check box.
1.	Depending on the role settings, the check box might not appear or might be unmodifiable.
1.	To specify a specific assignment duration, clear the check box and modify the start and/or end date and time boxes.
 
1.	To create the new role assignment, click Save and then Add. A notification of the status is displayed.

## Next steps

- [License requirements to use PIM](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy PIM](pim-deployment-plan.md)
