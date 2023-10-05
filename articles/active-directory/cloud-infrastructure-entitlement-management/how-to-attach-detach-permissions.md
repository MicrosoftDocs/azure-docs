---
title: Attach and detach permissions for users, roles, and groups for Amazon Web Services (AWS) identities in the Remediation dashboard
description: How to attach and detach permissions for users, roles, and groups for Amazon Web Services (AWS) identities in the Remediation dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: jfields
---

# Attach and detach policies for Amazon Web Services (AWS) identities

This article describes how you can attach and detach permissions for users, roles, and groups for Amazon Web Services (AWS) identities using the **Remediation** dashboard.

> [!NOTE]
> To view the **Remediation** tab, your must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

## View permissions

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **AWS**.
1. From the **Authorization System** dropdown, select the accounts you want to access.
1. From the **Search For** dropdown, select **Group**, **User**, or **Role**.
1. To search for more parameters, you can make a selection from the **User States**, **Permission Creep Index**, and **Task Usage** dropdowns.
1. Select **Apply**.
    Permissions Management displays a list of users, roles, or groups that match your criteria.
1. In **Enter a username**, enter or select a user.
1. In **Enter a group name**, enter or select a group, then select **Apply**.
1. Make a selection from the results list.

    The table displays the related **Username** **Domain/Account**, **Source** and **Policy Name**.


## Attach policies

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **AWS**.
1. In **Enter a username**, enter or select a user.
1. In **Enter a Group Name**, enter or select a group, then select **Apply**.
1. Make a selection from the results list.
1. To attach a policy, select **Attach Policies**.
1. In the **Attach Policies** page, from the **Available policies** list, select the plus sign **(+)** to move the policy to the **Selected policies** list.
1. When you have finished adding policies, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Detach policies

1. On the Permissions Management Permissions Management home page, select the **Remediation** tab, and then select the **Permissions** subtab.
1. From the **Authorization System Type** dropdown, select **AWS**.
1. In **Enter a username**, enter or select a user.
1. In **Enter a Group Name**, enter or select a group, then select **Apply**.
1. Make a selection from the results list.
1. To remove a policy, select **Detach Policies**.
1. In the **Detach Policies** page, from the **Available policies** list, select the plus sign **(+)** to move the policy to the **Selected policies** list.
1. When you have finished selecting policies, select **Submit**.
1. When the following message displays: **Are you sure you want to change permission?**, select:
    - **Generate Script** to generate a script where you can manually add/remove the permissions you selected.
    - **Execute** to change the permission.
    - **Close** to cancel the action.

## Next steps

- To revoke high-risk and unused tasks or assign read-only status for Microsoft Azure and Google Cloud Platform (GCP) identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](how-to-revoke-task-readonly-status.md)
To create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).
