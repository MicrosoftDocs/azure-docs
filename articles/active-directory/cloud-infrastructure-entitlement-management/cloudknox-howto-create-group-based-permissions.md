---
title: Microsoft CloudKnox Permissions Management - Create group-based permissions
description: How to create group-based permissions in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/17/2022
ms.author: v-ydequadros
---

# Create group-based permissions

This topic describes how you can create group-based permissions in Microsoft CloudKnox Permissions Management.

## Create a group with a custom set of permissions settings

1. To display the **User Management** dashboard, select **User** (your initials) in the upper right of the screen, and then select **User Management.**
2. Select the **Groups** tab.
3. Select **Create Permission**.
4. In the **Set Group Permission** box, enter a name for your group.

    The group name must match the name in the identity provider.
5. CloudKnox displays the permission settings available to  you:
    **Admin for all Authorization System Types**
    **Admin for selected Authorization System Types**
    **Custom**
6. To set permissions for specific accounts in **Auth System Types**, select **Custom**. Then select **Next**.
7. Select the **Auth System Type**, and then select the **Viewer**, **Controller**, or **Approver** box for each account. Then select **Next**.
8. To save your group permission settings, select **Save**.

    The following message appears: **New Group has been created successfully**.

## Create a group with administrative permissions for selected authorization system types

1. To display the **User Management** dashboard, select **User** (your initials) in the upper right of the screen, and then select **User Management**.
2. Select the **Groups** tab.
3. Select **Create Permission**.
4. In the **Set Group Permission** box, enter a name for your group.

    The group name must match the name in the identity provider.
5. CloudKnox displays the permission settings available to  you:
    **Admin for all Authorization System Types**
    **Admin for selected Authorization System Types**
    **Custom**
6. To set administrative permissions for specific authorization system types you want, select **Admin for selected Authorization System Types**. Then select **Next**.
7. Select the **Auth System Type**, and then select the **Viewer**, **Controller**, or **Approver** box. Then select **Next**.
8. To save your group permission settings, select **Save**.

    The following message appears: **New Group has been created successfully**.

## Create a group with administrative permissions for all authorization system types

1. To display the **User Management** dashboard, select **User** (your initials) in the upper right of the screen, and then select **User Management**.
2. Select the **Groups** tab.
3. Select **Create Permission**.
4. In the **Set Group Permission** box, enter a name for your group.

    The group name must match the name in the identity provider.
5. CloudKnox displays the permission settings available to  you:
    **Admin for all Authorization System Types**
    **Admin for selected Authorization System Types**
    **Custom**
6. To set administrative permissions for all authorization system types, select **Admin for all Authorization System Types**. Then select **Next**.
7. To save your group permission settings, select **Save**.

    The following message appears: **New Group has been created successfully**.


<!---## Next steps--->

<!---For information about how to request privileges on-demand (POD), adjust permissions, and remediate excessive permissions, see [Manage permissions with the JEP Controller](cloudknox-product-jep-controller.html).--->
<!---For information about how to create group-based permissions, see [Attach and detach permissions in the JEP Controller](cloudknox-howto-attach-detach-permissions.html).--->
<!---For information about how to create and view the Permissions Analytics report, see [The Permissions Analytics report](cloudknox-product-permissions-analytics-reports).--->
<!---For information about how to view user management information, see [The User Management dashboard](cloudknox-ui-user-management.html).--->
