---
title: Delete a role/policy in the JEP Controller in Microsoft CloudKnox Permissions Management 
description: How to delete a role/policy in the Just Enough Permissions (JEP) Controller.
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

# Delete a role/policy in the JEP Controller

This article describes how you can use the JEP Controller in Microsoft CloudKnox Permissions Management to delete roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **JEP Controller** tab, you must have **Viewer**, **Controller**, or **Administrator** permissions. To make changes on this tab, you must have **Controller** or **Administrator** permissions. If you don’t have these permissions, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Delete a role/policy

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.
1. Select the role/policy you want to delete, and from the **Actions** column, select **Delete**.

    You can only delete a role/policy if it isn't assigned to an identity. 

    You can't delete system roles/policies.

1. On the **Preview** screen, review the role/policy information to make sure you want to delete it, and then select **Submit**.
1. Refresh the **Role/Policies** tab to see the role/policy you modified.

## Next steps

- For information on how to view roles/policies, see [View information about roles/policies in the JEP Controller](cloudknox-howto-view-role-policy.md).
- For information on how to create roles/policies, see [Create a role/policy in the JEP Controller](cloudknox-howto-create-role-policy.md).
- For information on how to clone roles/policies, see [Clone a role/policy in the JEP Controller](cloudknox-howto-clone-role-policy.md).
- For information on how to modify roles/policies, see [Modify a role/policy in the JEP Controller](cloudknox-howto-modify-role-policy.md).
