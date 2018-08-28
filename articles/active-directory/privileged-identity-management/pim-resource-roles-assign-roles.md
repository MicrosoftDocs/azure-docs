---
title: Assign Azure resource roles in PIM | Microsoft Docs
description: Learn how to assign Azure resource roles in Azure AD Privileged Identity Management (PIM).
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

# Assign Azure resource roles in PIM

Azure AD PIM can manage the built-in Azure resource roles, as well as custom roles, including (but not limited to):

- Owner
- User Access Administrator
- Contributor
- Security Admin
- Security Manager, and more

>[!NOTE]
Users or members of a group assigned to the Owner or User Access Administrator roles, and Global Administrators that enable subscription management in Azure AD are Resource Administrators. These administrators may assign roles, configure role settings, and review access using PIM for Azure Resources. View the list of [built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

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

## Next steps

- [Configure Azure resource role settings in PIM](pim-resource-roles-configure-role-settings.md)
- [Assign Azure AD directory roles in PIM](pim-how-to-add-role-to-user.md)
