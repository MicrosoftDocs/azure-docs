---
title: Select group-based permissions settings in CloudKnox Permissions Management with the User management dashboard
description: How to select group-based permissions settings in CloudKnox Permissions Management with the User management dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Select group-based permissions settings

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can create  and manage group-based permissions in CloudKnox Permissions Management (CloudKnox) with the User management dashboard.

## Select administrative permissions settings for a group

1. To display the **User management** dashboard, select **User** (your initials) in the upper right of the screen, and then select **User management.**
1. Select the **Groups** tab, and then select **Create permission**.
1. In the **Set group permission** box, enter a name for your group.

    The group name must match the name in the identity provider.
1. Select the permission setting you want:

    - **Admin for all authorization system types** provides **View**, **Control**, and **Approve** permissions for all authorization system types.
    - **Admin for selected authorization system types** provides **View**, **Control**, and **Approve** permissions for selected authorization system types.
    - **Custom** allows you to set **View**, **Control**, and **Approve** permissions for the authorization system types that you select.

1. Select **Next**.

1. If you select **Custom**, select the **Authorization system types** you want.
1. Select **Viewer**, **Controller**, or **Approver** box for each account, and then select **Next**.
1. Confirm your settings, and then select **Save**.

    The following message appears: **New group has been created successfully.**
1. To see the group you created in the **Groups** table, refresh your screen.


## Next steps

- For information about how to manage user information, see [Manage users and groups with the User management dashboard](cloudknox-ui-user-management.md).
- For information about how to view information about active and completed tasks, see [View information about active and completed tasks](cloudknox-ui-tasks.md).
- For information about how to view personal and organization information, see [View personal and organization information](cloudknox-product-account-settings.md).

