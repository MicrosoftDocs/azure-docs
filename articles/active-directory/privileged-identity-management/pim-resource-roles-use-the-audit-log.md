---
title: Privileged Identity Management for Azure Resources - Resource audit| Microsoft Docs
description: Explains how to get a view of all role activity for the a given resource.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource Roles - Audit

Resource audit gives you a view of all role activity for the resource. You can filter the information using a predefined date or custom range.
![](media/azure-pim-resource-rbac/rbac-resource-audit.png)

Resource audit also provides quick access to view a user’s activity detail. Under "Audit type" select "Activate". Click on "(activity)" to see that user’s actions on Azure Resources.
![](media/azure-pim-resource-rbac/rbac-audit-activity.png)

![](media/azure-pim-resource-rbac/rbac-audit-activity-details.png)

# My audit

My audit gives you a view of a user's personal role activity. You can filter the information using a predefined date or custom range.
![](media/azure-pim-resource-rbac/my-audit-time.png)

## View activation and Azure Resource activity

In the event you need to see what actions a specific user took on various resources, you can review the Azure Resource activity associated with a given activation period (for eligible users). Start by selecting a user from the Members view or from the list of members in a specific role. The result displays a graphical view of the user’s actions on Azure Resources by date, and the recent role activations over that same time period.

![](media/azure-pim-resource-rbac/rbac-user-details.png)

Selecting a specific role activation will show the role activation details, and corresponding Azure Resource activity that occurred while that user was active.

![](media/azure-pim-resource-rbac/rbac-user-resource-activity.png)

