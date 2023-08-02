---
title: Modify a role/policy in the Remediation dashboard in Permissions Management
description: How to modify a role/policy in the Remediation dashboard in Microsoft Entra Permissions Management.
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

# Modify a role/policy in the Remediation dashboard

This article describes how you can use the **Remediation** dashboard in Microsoft Entra Permissions Management to modify roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems.

> [!NOTE]
> To view the **Remediation** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don't have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other cloud providers call *policy*. Permissions Management automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Modify a role/policy

1. On the Permissions Management home page, select the **Remediation** tab, and then select the **Role/Policies** tab.
1. Select the role/policy you want to modify, and from the **Actions** column, select **Modify**.

     You can't modify **System** policies and roles.

1. On the **Statements** page, make your changes to the **Tasks**, **Resources**, **Request conditions**, and **Effect** sections as required, and then select **Next**.

1. Review the changes to the JSON or script on the **Preview** page, and then select **Submit**.

## Next steps

- For information on how to view existing roles/policies, requests, and permissions, see [View roles/policies, requests, and permission in the Remediation dashboard](ui-remediation.md).
- For information on how to create a role/policy, see [Create a role/policy](how-to-create-role-policy.md).
- For information on how to clone a role/policy, see [Clone a role/policy](how-to-clone-role-policy.md).
- For information on how to delete a role/policy, see [Delete a role/policy](how-to-delete-role-policy.md).
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md).
- For information on how to attach and detach permissions for AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
- For information on how to revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities, see [Revoke high-risk and unused tasks or assign read-only status for Azure and GCP identities](how-to-revoke-task-readonly-status.md)
- For information on how to create or approve a request for permissions, see [Create or approve a request for permissions](how-to-create-approve-privilege-request.md).
- For information on how to view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md)
