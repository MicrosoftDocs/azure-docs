---
title: Manage users and groups with the User management dashboard in Permissions Management
description: How to manage users and groups in the User management dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 09/15/2023
ms.author: jfields
---

# Manage users and groups with the User management dashboard

This article describes how to use the Permissions Management **User management** dashboard to view and manage users and groups.

**To display the User management dashboard**:

- In the upper right of the Permissions Management home page, select **User** (your initials) in the upper right of the screen, and then select **User management.**

    The **User Management** dashboard has two tabs:

    - **Users**: Displays information about registered users.
    - **Groups**: Displays information about groups.

## Manage users

Use the **Users** tab to display the following information about users:

- **Name** and **Email Address**: The user's name and email address.
- **Joined On**: The date the user registered on the system.
- **Recent Activity**: The date the user last used their permissions to access the system.
- The ellipses **(...)**  menu: Select the ellipses, and then select **View Permissions** to open the **View User Permission** box.

    - To view details about the user's permissions, select one of the following options:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all authorization system types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for selected authorization system types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for the authorization system types you select.

You can also select the following options:

- **Reload**: Select this option to refresh the information displayed in the **User** table.
- **Search**: Enter a name or email address to search for a specific user.

## Manage groups

Use the **Groups** tab to display the following information about groups:

- **Name**: Displays the registered user's name and email address.
- **Permissions**:
    - The **Authorization Systems** and the type of permissions the user has been granted: **Admin for all Authorization System Types**, **Admin for selected Authorization System Types**, or **Custom**.
    - Information about the **Viewer**, **Controller**, **Approver**, and **Requestor**.
- **Modified By**: The email address of the user who modified the group.
- **Modified On**: The date the user last modified the group.

- The ellipses **(...)** menu: Select the ellipses to:

    - **View Permissions**:  Select this option to view details about the group's permissions, and then select one of the following options:
        - **Admin for all Authorization System Types** provides **View**, **Control**, and **Approve** permissions for all authorization system types.
        - **Admin for selected Authorization System Types** provides **View**, **Control**, and **Approve** permissions for selected authorization system types.
        - **Custom** provides **View**, **Control**, and **Approve** permissions for specific authorization system types that you select.

    - **Edit Permissions**: Select this option to modify the group's permissions.
    - **Delete**: Select this option to delete the group's permissions.

        The **Delete Permission** box asks you to confirm that you want to delete the group.
        - Select **Delete** if you want to delete the group, **Cancel** to discard your changes.


You can also select the following options:

- **Reload**: Select this option to refresh the information displayed in the **User** table.
- **Search**: Enter a name or email address to search for a specific user.
- **Filters**: Select the authorization systems and accounts you want to display.
- **Create Permission**: Create a group and set up its permissions. For more information, see [Create group-based permissions](how-to-create-group-based-permissions.md)



## Next steps

- For information about how to view personal and organization information, see [View personal and organization information](product-account-settings.md).
