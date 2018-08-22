---
title:  Assign roles for Azure resources by using Privileged Identity Management | Microsoft Docs
description: Describes how to assign roles in PIM.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---

# Assign roles for Azure resources by using Privileged Identity Management

## Assign roles

To assign a user or group to a role when you're viewing the **Roles** pane, select the role, and then select **Add user**. 

!["Roles" pane with the "Add user" button](media/azure-pim-resource-rbac/rbac-assign-roles-1.png)

You can also select **Add user** from the **Members** pane.

!["Members" pane with the "Add user" button](media/azure-pim-resource-rbac/rbac-assign-roles-2.png)


If you're adding a user or group from the **Members** pane, you need to: 

1. Choose a role from the **Select a role** pane before you can select a user or group.

   !["Select a role" pane](media/azure-pim-resource-rbac/rbac-assign-roles-select-role.png)

2. Choose a user or group from the directory.

3. Choose the appropriate assignment type from the drop-down menu: 

   - **Just in time**: Provides the user or group members with eligible but not persistent access to the role for a specified period or indefinitely (if configured in role settings). 
   - **Direct**: Does not require the user or group members to activate the role assignment (known as persistent access). We recommend using direct assignment for short-term use, where access won’t be required when the task is complete. Examples are on-call shifts and time-sensitive activities.

4. If the assignment should be permanent (permanently eligible for a just-in-time assignment, or permanently active for a direct assignment), select the check box below the **Assignment type** box.

   !["Membership settings" pane with the "Assignment type" box and the related check box](media/azure-pim-resource-rbac/rbac-assign-roles-settings.png)

   >[!NOTE]
   >The check box might be unmodifiable if another administrator has specified the maximum assignment duration for each assignment type in the role settings.

   To specify a specific assignment duration, clear the check box and modify the start and/or end date and time boxes.

   !["Membership settings" pane with boxes for start date, start time, end date, and end time](media/azure-pim-resource-rbac/rbac-assign-roles-duration.png)


## Manage role assignments

Administrators can manage role assignments by selecting either **Roles** or **Members** from the left pane. Selecting **Roles** enables admins to scope their management tasks to a specific role. Selecting **Members** displays all user and group role assignments for the resource.

!["Roles" pane](media/azure-pim-resource-rbac/rbac-assign-roles-roles.png)

!["Members" pane](media/azure-pim-resource-rbac/rbac-assign-roles-members.png)

>[!NOTE]
If you have a role pending activation, a notification banner is displayed at the top of the pane when you're viewing membership.


## Modify existing assignments

To modify existing assignments from the user/group detail view, select **Change settings** from the action bar. Change the assignment type to **Just in time** or **Direct**.

!["User details" pane with the "Change settings" button](media/azure-pim-resource-rbac/rbac-assign-role-manage.png)
