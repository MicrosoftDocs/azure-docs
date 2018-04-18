---
title:  Privileged Identity Management for Azure Resources - Assign roles| Microsoft Docs
description: Describes how to assign roles in PIM.
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

# Privileged Identity Management - Resource Roles - Assign

## Assign roles

To assign a user or group to a role, select the role (if viewing Roles), 

![](media/azure-pim-resource-rbac/rbac-assign-roles-1.png)

or click Add from the action bar (if on the Members view).

![](media/azure-pim-resource-rbac/rbac-assign-roles-2.png)


If adding a user or group from the Members tab, you’ll need to: 

1. Choose a role from the Add menu before you can select a user or group.

![](media/azure-pim-resource-rbac/rbac-assign-roles-select-role.png)

2. Choose a user or group from the directory.

3. Choose the appropriate assignment type from the dropdown menu. 

    - **Just In Time Assignment:** It provides the user or group members with eligible but not persistent access to the role for a specified period of time or indefinitely (if configured in role settings). 
    - **Direct Assignment:** It does not require the user or group members to activate the role assignment (known as persistent access). Microsoft recommends using direct assignment for short-term use such as on-call shifts, or time sensitive activities, where access won’t be required when the task is complete.

A check box below the assignment type dropdown allows you to specify if the assignment should be permanent (permanently eligible to activate Just in Time Assignment/permanently active for Direct Assignment).

![](media/azure-pim-resource-rbac/rbac-assign-roles-settings.png)

>[!NOTE]
>The check box may be unmodifiable if another administrator has specified the maximum assignment duration for each assignment type in the role settings.

 To specify a specific assignment duration, unselect the check box and modify the start and/or end date and time fields.

![](media/azure-pim-resource-rbac/rbac-assign-roles-duration.png)


## Manage role assignments

Administrators can manage role assignments by selecting either Roles or Members from the left navigation. Selecting roles allows admins to scope their management tasks to a specific role, while Members displays all user and group role assignments for the resource.

![](media/azure-pim-resource-rbac/rbac-assign-roles-roles.png)

![](media/azure-pim-resource-rbac/rbac-assign-roles-members.png)

>[!NOTE]
If you have a role pending activation, a notification banner is displayed at the top of the page when viewing membership.


## Modify existing assignments

To modify existing assignments from the user/group detail view, select Change Settings from the action bar at the top of the page. Change the assignment type to Just In Time Assignment or Direct Assignment.

![](media/azure-pim-resource-rbac/rbac-assign-role-manage.png)
