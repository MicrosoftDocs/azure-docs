---
title: Clone a role/policy in the Remediation dashboard in Microsoft Entra Permissions Management
description: How to clone a role/policy in Microsoft Entra Permissions Management.
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

# Clone a role/policy in the Remediation dashboard

This article describes how you can use the **Remediation** dashboard in Microsoft Entra Permissions Management to clone roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems.

> [!NOTE]
> To view the **Remediation** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. Permissions Management automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Clone a role/policy

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Role/Policies** tab.
1. Select the role/policy you want to clone, and from the **Actions** column, select **Clone**.
1. **(AWS Only)** In the **Clone** box, the **Clone Resources** and **Clone Conditions** checkboxes are automatically selected.
    Deselect the boxes if the resources and conditions are different from what is displayed.
1. Enter a name for each authorization system that was selected in the **Policy Name** boxes, and then select **Next**.

1. If the data collector hasn't been given controller privileges, the following message displays: **Only online/controller-enabled authorization systems can be submitted for cloning.**

   To clone this role manually, download the script and JSON file.

1. Select **Submit**.
1. Refresh the **Role/Policies** tab to see the role/policy you cloned.

## Next steps


- To view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- To create a role/policy, see [Create a role/policy](how-to-create-role-policy.md).
- To delete a role/policy, see [Delete a role/policy](how-to-delete-role-policy.md).
- To modify a role/policy, see [Modify a role/policy](how-to-modify-role-policy.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md).
- To attach and detach permissions for AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
- To revoke high-risk and unused tasks or assign read-only status for  Azure and GCP identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](how-to-revoke-task-readonly-status.md)
- To create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md)
