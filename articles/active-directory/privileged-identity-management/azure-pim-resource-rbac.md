---
title: View who has Azure resource roles in PIM | Microsoft Docs
description: View who has Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.assetid:
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 03/30/2018
ms.author: rolyon

---
# View who has Azure resource roles in PIM

With Azure Active Directory Privileged Identity Management (PIM), you can manage, control, and monitor access to Azure resources within your organization. This includes subscriptions, resource groups, and even virtual machines. Any resource within the Azure portal that leverages the Azure role-based access control (RBAC) functionality can take advantage of the security and lifecycle management capabilities in Azure AD PIM. 

## PIM for Azure resources helps resource administrators

- See which users and groups are assigned roles for the Azure resources you administer
- Enable on-demand, "just in time" access to manage resources such as Subscriptions, Resource Groups, and more
- Expire assigned users/groups resource access automatically with new time-bound assignment settings
- Assign temporary resource access for quick tasks or on-call schedules
- Enforce Multi-Factor Authentication for resource access on any built-in or custom role 
- Get reports about resource access correlated resource activity during a user’s active session
- Get alerts when new users or groups are assigned resource access, and when they activate eligible assignments

## View activation and Azure resource activity

In the event you need to see what actions a specific user took on various resources, you can review the Azure resource activity associated with a given activation period (for eligible users). Start by selecting a user from the Members view or from the list of members in a specific role. The result displays a graphical view of the user’s actions on Azure resources by date, and the recent role activations over that same time period.

![](media/azure-pim-resource-rbac/user-details.png)

Selecting a specific role activation will show the role activation details, and corresponding Azure resource activity that occurred while that user was active.

![](media/azure-pim-resource-rbac/audits.png)

## Review who has access in a subscription

To review role assignments in your Subscription, select the Members tab from the left navigation, or select roles, and choose a specific role to review members. 

Select Review from the action bar to view existing access reviews and select Add to create a new review.

![](media/azure-pim-resource-rbac/owner.png)

[Learn more about access reviews](pim-how-to-perform-security-review.md)

>[!NOTE]
Reviews are only supported for Subscription resource types at this time.

## Next steps

- [Assign Azure resource roles in PIM](pim-resource-roles-assign-roles.md)
- [Approve or deny requests for Azure resource roles in PIM](pim-resource-roles-approval-workflow.md)
- [Built-in roles in Azure](../../role-based-access-control/built-in-roles.md)
