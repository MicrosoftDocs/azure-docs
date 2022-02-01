---
title: Attach and detach permissions for users, roles, and resources in the JEP Controller in Microsoft CloudKnox Permissions Management - 
description: How to attach and detach permissions for users, roles, and resources manually or using the JEP Controller in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/01/2022
ms.author: v-ydequadros
---

# Attach and detach permissions for identities

This article describes how you can attach and detach permissions for users, roles, and resources manually or allow Microsoft CloudKnox Permissions Management (CloudKnox) to do it for you using the Just Enough Permissions (JEP) Controller. You can create and approve requests for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems.

> [!NOTE]
> To view the **JEP Controller** tab, your role must be **Viewer**, **Controller**, or **Administrator**. To make changes on this tab, you must be a **Controller** or **Administrator**. If you don’t have access, contact your system administrator.

## Attach permissions manually

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Permissions** subtab.
1. From the **Select an authorization system type** dropdown, select the authorization system type you want to access: **AWS**, **Azure** or **GCP**.
1. From the **Select an authorization system** dropdown, select the accounts you want to access.

    > [!NOTE]
    > If you select **Azure**, you can only modify permissions for users. You can't modify permissions for groups.

1. From the **Search For** dropdown, select **Group**, **User**, or **Role**.
1. To search for more parameters, you can make a selection from the **User States**, **Privilege Creep Index**, and **Task usage** dropdowns.

    CloudKnox displays a list of users, roles, or resources who match your criteria.
1. In the **Enter a username** box, enter or select a user.
1. In the **Enter a group name** box, enter or select a group, then select **Apply**.

    The **Permissions** table displays the **Users**, **Username** **Domain/Account**, **Source** and **Policy name**.

    To locate a specific user, use **Search**.
1. To attach policies, select **Attach policies**.
1. In the **Attach policies** page, from the **Available policies** list, select the plus sign **(+)** to add the policy to the **Selected policies** list. 
1. When you have finished adding policies, select **Submit**.
1. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Close** to cancel the action.

## Detach permissions manually

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Permissions** subtab.
1. From the **Select an authorization system type** dropdown, select the authorization system type you want to access: **AWS**, **Azure** or **GCP**.
1. From the **Select an authorization system** dropdown, select the accounts you want to access.

    > [!NOTE]
    > If you select **Azure**, you can only modify permissions for users. You can't modify permissions for groups.
1. From the **Search For** dropdown, select **Group**, **User**, or **Role**.
1. To search for more parameters, you can make a selection from the **User States**, **Privilege Creep Index**, and **Task usage** dropdowns.

    CloudKnox displays a list of users, roles, or resources who match your criteria.
1. In the **Enter a username** box, enter or select a user.
1. In the **Enter a group name** box, enter or select a group, then select **Apply**.

    The **Permissions** table displays the **Users**, **Username** **Domain/Account**, **Source** and **Policy name**.

    To locate a specific user, use **Search**.
1. To attach policies, select **Detach policies**.
1. In the **Detach policies** page, from the **Available policies** list, select the plus sign **(+)** to add the policy to the **Selected policies** list. 
1. When you have finished adding policies, select **Submit**.
1. When the **Confirmation** box appears, select **Generate script** to change permission, or **Close** to discard your changes.

    CloudKnox displays a script for each policy you added. 
1. You can **Copy** or **Download** the script, or select **Close** to close the box.

13. When the following message displays: **Are you sure you want to change permissions?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Close** to cancel the action. 

<!---## Allow CloudKnox to attach permissions

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Permissions** subtab.
1. From the **Select an authorization system type** dropdown, select the authorization system type you want to access: **AWS**, **Azure** or **GCP**.
1. From the **Select an authorization system** dropdown, select the accounts you want to access.

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
1. From the **Search For** dropdown, select **User**, **Role**, or **Resources**.
1. From the list, select the user, role, or resources you want.
1. On the **Attach/Detach Policies** subtab, from the **Attachable** list select a policy you want to add.
    The policies you select appear in the **Selected to Attach** list on the right.
1. Click **Submit**.
1. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually attach/detach the policies you selected.
    - **Confirm** to allow CloudKnox to attach/detach the policies you selected.
    - **Cancel** to cancel the action. 
1. The **Activity** pane appears on the right. 

    The **Active** subtab displays a list of the tasks CloudKnox is currently processing.

    The **Completed** subtab displays a list of the tasks CloudKnox has completed processing.

## Allow CloudKnox to detach permissions

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Permissions** subtab.
1. From the **Select an authorization system type** dropdown, select the authorization system type you want to access: **AWS**, **Azure** or **GCP**.
1. From the **Select an authorization system** dropdown, select the accounts you want to access.

    > [!NOTE]
    > If you select Microsoft Azure, you can only modify permissions for users. You cannot modify permissions for groups.
1. From the **Search For** dropdown, select **User**, **Role**, or **Resources**.
1. From the list, select the user, role, or resources you want.
1. On the **Attach/Detach Policies** subtab, from the **Detachable** list, select a policy you want to remove.
    The policies you select appear in the **Selected to Detach** list on the left.
1. Click **Submit**.
1. When the following message displays: **Are you sure you want to change permissions?**, select: 
    - **Generate Script** to generate a script where you can manually attach/detach the policies you selected.
    - **Confirm** to allow CloudKnox to attach/detach the policies you selected.
    - **Cancel** to cancel the action. 
1. The **Activity** pane appears on the right.

    The **Active** subtab displays a list of the tasks CloudKnox is currently processing.

    The **Completed** subtab displays a list of the tasks CloudKnox has completed.--->


## Next steps

- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](cloudknox-howto-create-approve-privilege-request.md).

