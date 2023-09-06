---
title: Add and remove roles and tasks for groups, users, and service accounts for Microsoft Azure and Google Cloud Platform (GCP) identities in the Remediation dashboard in Permissions Management
description: How to attach and detach permissions for groups, users, and service accounts for Microsoft Azure and Google Cloud Platform (GCP) identities in the Remediation dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2023
ms.author: jfields
---

# Add and remove roles and tasks for Microsoft Azure and Google Cloud Platform (GCP) identities

This article describes how you can add and remove roles and tasks for Microsoft Azure and Google Cloud Platform (GCP) identities using the **Remediation** dashboard.

> [!NOTE]
> To view the **Remediation** tab, your must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

## View permissions

1. On the Entra home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP**.
1. To search for more parameters, you can make a selection from the **User States**, **Permission Creep Index**, and **Task Usage** dropdowns.
1. Select **Apply**.
    Entra displays a list of groups, users, and service accounts that match your criteria.
1. In **Enter a username**, enter or select a user.
1. In **Enter a Group Name**, enter or select a group, then select **Apply**.
1. Make a selection from the results list.

    The table displays the **Username** **Domain/Account**, **Source**, **Resource** and **Current Role**.


## Add a role

1. On the Entra home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To attach a role, select **Add role**.
1. In the **Add Role** page, from the **Available Roles** list, select the plus sign **(+)** to move the role to the **Selected Roles** list.
1. When you have finished adding roles, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Remove a role

1. On the Entra home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To remove a role, select **Remove Role**.
1. In the **Remove Role** page, from the **Available Roles** list, select the plus sign **(+)** to move the role to the **Selected Roles** list.
1. When you have finished selecting roles, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Add a task

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To attach a role, select **Add Tasks**.
1. In the **Add Tasks** page, from the **Available Tasks** list, select the plus sign **(+)** to move the task to the **Selected Tasks** list.
1. When you have finished adding tasks, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Remove a task

1. On the Entra home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To remove a task, select **Remove Tasks**.
1. In the **Remove Tasks** page, from the **Available Tasks** list, select the plus sign **(+)** to move the task to the **Selected Tasks** list.
1. When you have finished selecting tasks, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Next steps


- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md).
- For information on how to create a role/policy, see [Create a role/policy](how-to-create-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](how-to-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](how-to-delete-role-policy.md).
- For information on how to modify a role/policy, see [Modify a role/policy](how-to-modify-role-policy.md).
- For information on how to attach and detach permissions for Amazon Web Services (AWS) identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).