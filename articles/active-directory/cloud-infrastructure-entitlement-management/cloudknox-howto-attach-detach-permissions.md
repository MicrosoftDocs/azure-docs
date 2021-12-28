---
title: Microsoft CloudKnox Permissions Management - Attach and detach permissions for users, roles, and resources in the Just Enough Permissions (JEP) Controller
description: How to attach and detach permissions for users, roles, and resources manually or using the Just Enough Permissions (JEP) Controller in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/28/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Attach and detach permissions for users, roles, and resources in the Just Enough Permissions (JEP) Controller

This topic describes how you can attach and detach permissions for users, roles, and resources manually or allow CloudKnox to do it for you using the Just Enough Permissions (JEP) Controller.

> [!NOTE]
> You must have **Controller** access to the JEP Controller to perform these tasks. If you don’t have Controller access, contact your system administrator.

## Attach permissions for users manually

1. Select the **JEP Controller** tab.
2. Select the **Permissions** tab.
3. From the **Authorization System Type**  drop-down list, select the authorization system type you want.
4. From the **Authorization System**  drop-down list, select the authorization system you want. 

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
5. From the **Search For**  drop-down list, select **User**, **Role** or **Resources**.
6. To search for additional parameters, you can make a selection from the **User States**, **Privilege Creep Index**, and **User Name**  drop-down lists below.
7. Select **Search**.

    CloudKnox displays a list of users, roles, or resources who match your criteria.
8. Select a user, role, or resource from the list.

    CloudKnox displays the **Quick Actions**, **Roles**, and **Task** tabs.
9. To make a quick action, one-click selection, select the **Quick Actions** tab, and then select a task from the following options:
    - **Revoke Unused Tasks**
    - **Revoke High-Risk Tasks**
    - **Assign Read-Only Status**
    - **Revoke Deleted Tasks**
10. To make more granular selections by role, select the **Role** tab, and then select a role from the **Add Role** list.

    The roles you select appear in the **Selected to Add** list on the right.
11. To make more granular selections by task, select the **Task** tab, and then select a role from the **Available** list.

    The tasks you select appear in the **Selected to Grant** list on the right.
12. Click **Submit**.
13. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Cancel** to cancel the action. 

## Detach permissions for users manually

1. Select the **JEP Controller** tab.
2. Select the **Permissions** tab.
3. From the **Authorization System Type**  drop-down list, select the authorization system type you want.
4. From the **Authorization System**  drop-down list, select the authorization system you want.

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
5. From the **Search For**  drop-down list, select **User**, **Role** or **Resources**.
6. To search for additional parameters, you can make a selection from the **User States**, **Privilege Creep Index**, and **User Name**  drop-down lists below.
7. Select **Search**.

    CloudKnox displays a list of users, roles, or resources who match your criteria.
8. Select a user, role, or resource from the list.

    CloudKnox displays the **Quick Actions**, **Roles**, and **Task** tabs.
9. To make a quick action selection, select the **Quick Actions** tab, and then select a task from the following one-click options: 
    - **Revoke Unused Tasks** 
    - **Revoke High-Risk Tasks** 
    - **Assign Read-Only Status** 
    - **Revoke Deleted Tasks**
10. To make more granular selections by role, select the **Role** tab, and then select a role from the **Remove Role** list.

    The roles you select appear in the **Selected to Remove** list on the left.
11. To make more granular selections by task, select the **Task** tab, and then select a role from the **Revokable list**.

    The roles you select appear in the **Selected to Revoke** list on the left.
12. Click **Submit**.
13. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Cancel** to cancel the action. 

## Allow CloudKnox to attach permissions

1. Enable the **JEP Controller**.
    <!---How?.--->
2. Select the **Permissions** tab.
3. From the **Authorization System Type**  drop-down list, select the authorization system type you want.
4. From the **Authorization System**  drop-down list, select the authorization system you want.

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
5. From the **Search For**  drop-down list, select **User**, **Role** or **Resources**.
6. From the list, select the user, role, or resources you want.
7. On the **Attach/Detach Policies** tab, from the **Attachable** list select a policy you want to add.
    The policies you select appear in the **Selected to Attach** list on the right.
8. Click **Submit**.
9. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually attach/detach the policies you selected.
    - **Confirm** to allow CloudKnox to attach/detach the policies you selected.
    - **Cancel** to cancel the action. 
10. The **Activity** pane appears on the right. 

    The **Active** tab displays a list of the tasks CloudKnox is currently processing.

    The **Completed** tab displays a list of the tasks CloudKnox has completed.

## Allow CloudKnox to detach permissions

1. Enable the **JEP Controller**.
    <!---How?.--->
2. Select the **Permissions** tab.
3. From the **Authorization System Type**  drop-down list, select the authorization system type you want.
4. From the **Authorization System**  drop-down list, select the authorization system you want.

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
5. From the **Search For**  drop-down list, select **User**, **Role** or **Resources**.
6. From the list, select the user, role, or resources you want.
7. On the **Attach/Detach Policies** tab, from the **Detachable** list, select a policy you want to remove.
    The policies you select appear in the **Selected to Detach** list on the left.
8. Click **Submit**.
9. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually attach/detach the policies you selected.
    - **Confirm** to allow CloudKnox to attach/detach the policies you selected.
    - **Cancel** to cancel the action. 
10. The **Activity** pane appears on the right.

    The **Active** tab displays a list of the tasks CloudKnox is currently processing.

    The **Completed** tab displays a list of the tasks CloudKnox has completed.


<!---## Next steps--->
