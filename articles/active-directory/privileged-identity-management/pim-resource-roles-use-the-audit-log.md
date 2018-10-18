---
title: View audit history for Azure resource roles in PIM | Microsoft Docs
description: Learn how to view audit history for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---

# View audit history for Azure resource roles in PIM

Resource audit gives you a view of all role activity for the resource. You can filter the information using a predefined date or custom range.
![Filter information](media/azure-pim-resource-rbac/rbac-resource-audit.png)

Resource audit also provides quick access to a user’s activity detail. Under **Audit type**, select **Activate**. Select **(activity)** to see that user’s actions in Azure resources.
![Activity detail](media/azure-pim-resource-rbac/rbac-audit-activity.png)

![More activity detail](media/azure-pim-resource-rbac/rbac-audit-activity-details.png)

## My audit

My audit gives you a view of a user's personal role activity. You can filter the information using a predefined date or custom range.
![Personal role activity](media/azure-pim-resource-rbac/my-audit-time.png)

## View activation and Azure resource activity

To see what actions a specific user took in various resources, you can review the Azure resource activity that's associated with a given activation period. Start by selecting a user from the **Members** view or from the list of members in a specific role. The result displays a graphical view of the user’s actions in Azure resources by date. It also shows the recent role activations over that same time period.

![User details](media/azure-pim-resource-rbac/rbac-user-details.png)

Selecting a specific role activation shows the role activation details and corresponding Azure resource activity that occurred while that user was active.

![Select role activation](media/azure-pim-resource-rbac/rbac-user-resource-activity.png)

## Next steps

- [View audit history for Azure AD directory roles in PIM](pim-how-to-use-audit-log.md)
