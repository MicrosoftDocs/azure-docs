---
title:  Privileged Identity Management for Azure Resources - Activate roles| Microsoft Docs
description: Describes how to activate roles in PIM.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource Roles - Activate
Activating roles for Azure Resources introduces a new experience that allows eligible role members to schedule activation for a future date/time and select a specific activation duration within the maximum (configured by administrators). Learn about [activating Azure AD roles here](../active-directory-privileged-identity-management-how-to-activate-role.md).

## Activate roles
Navigate to the My roles section on the left navigation bar. Click on "Activate" for the role you wish to activate into.
![](media/azure-pim-resource-rbac/rbac-roles.png)

From the Activations menu, input the desired start date and time to activate the role. Optionally decrease the activation duration (the length of time the role is active) and enter a justification if required; click activate.

If the start date and time is not modified, the role will be activated within seconds. You will see a role queued for activation banner message on the My Roles page. Click the refresh button to clear this message.

![](media/azure-pim-resource-rbac/rbac-activate-notification.png)

If the activation is scheduled for a future date time, the pending request will appear in the Pending Requests tab of the left navigation menu. In the event the role activation is no longer required, the user may cancel the request by clicking the Cancel button on the right side of the page.

![](media/azure-pim-resource-rbac/rbac-activate-pending.png)


## Just enough administration

Using just enough administration (JEA) best practices with your resource role assignments is simple with PIM for Azure Resources. Users and group members with assignments in Azure Subscriptions or Resource Groups can activate their existing role assignment at a reduced scope. 

From the search page, find the subordinate resource you need to manage.

![](media/azure-pim-resource-rbac/azure-resources-02.png)

Select My roles from the left navigation menu and choose the appropriate role to activate. Notice the assignment type is Inherited, since the role was assigned at the subscription, rather than the resource group, as shown below.

![](media/azure-pim-resource-rbac/my-roles-02.png)
