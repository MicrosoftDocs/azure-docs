---
title: Revoke access to high-risk and unused tasks or assign read-only status for Microsoft Azure and Google Cloud Platform (GCP) identities in the Remediation dashboard
description: How to revoke access to high-risk and unused tasks or assign read-only status for Microsoft Azure and Google Cloud Platform (GCP) identities in the Remediation dashboard.
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

# Revoke access to high-risk and unused tasks or assign read-only status for Microsoft Azure and Google Cloud Platform (GCP) identities

This article describes how you can revoke high-risk and unused tasks or assign read-only status for Microsoft Azure and Google Cloud Platform (GCP) identities using the **Remediation** dashboard.

> [!NOTE]
> To view the **Remediation** tab, your must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

## View an identity's permissions

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search for** dropdown, select **Group**, **User**, or **APP/Service Account**.
1. To search for more parameters, you can make a selection from the **User States**, **Permission Creep Index**, and **Task Usage** dropdowns.
1. Select **Apply**.

    Permissions Management displays a list of groups, users, and service accounts that match your criteria.
1. In **Enter a username**, enter or select a user.
1. In **Enter a Group Name**, enter or select a group, then select **Apply**.
1. Make a selection from the results list.

    The table displays the **Username** **Domain/Account**, **Source**, **Resource** and **Current Role**.


## Revoke an identity's access to unused tasks

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search for** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To revoke an identity's access to tasks they aren't using, select **Revoke Unused Tasks**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Revoke an identity's access to high-risk tasks

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To revoke an identity's access to high-risk tasks, select **Revoke High-Risk Tasks**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Revoke an identity's ability to delete tasks

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To revoke an identity's ability to delete tasks, select **Revoke Delete Tasks**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Assign read-only status to an identity

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **Azure** or **GCP**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search for** dropdown, select **Group**, **User**, or **APP/Service Account**, and then select **Apply**.
1. Make a selection from the results list.

1. To assign read-only status to an identity, select **Assign Read-Only Status**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.


## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- For information on how to create a role/policy, see [Create a role/policy](how-to-create-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](how-to-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](how-to-delete-role-policy.md).
- For information on how to modify a role/policy, see [Modify a role/policy](how-to-modify-role-policy.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md).
- For information on how to attach and detach permissions for AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
- For information on how to add and remove roles and tasks for Azure and GCP identities, see [Add and remove roles and tasks for Azure and GCP identities](how-to-attach-detach-permissions.md).
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).
