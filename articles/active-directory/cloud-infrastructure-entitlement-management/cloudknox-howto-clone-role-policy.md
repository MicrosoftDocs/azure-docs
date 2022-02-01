---
title: Clone a role/policy in the JEP Controller in Microsoft CloudKnox Permissions Management 
description: How to clone a role/policy in the Just Enough Permissions (JEP) Controller.
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

# Clone a role/policy in the JEP Controller

This article describes how you can use the JEP Controller in Microsoft CloudKnox Permissions Management to clone roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **JEP Controller** tab, your role must be **Viewer**, **Controller**, or **Administrator**. To make changes on this tab, you must be a **Controller** or **Administrator**. If you don’t have access, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Clone a role/policy

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.
1. Select the role/policy you want to clone, and from the **Actions** column, select **Clone**.
1. **(AWS Only)** In the **Clone** box, the **Clone Resources** and **Clone Conditions** checkboxes are automatically selected. 
    Deselect the boxes if the resources and conditions are different from what is displayed.
1. Enter a name for each authorization system that was selected in the **Policy Name** boxes, and then select **Next**.

1. If the data collector hasn't been given controller privileges, the following message displays: **Only online/controller-enabled authorization systems can be submitted for cloning.**

   To clone this role manually, download the script and JSON file. 

1. Select **Submit**.
1. Refresh the **Role/Policies** tab to see the role/policy you cloned.

## Next steps

- For information on how to view roles/policies, see [View information about roles/policies in the JEP Controller](howto-view-role-policy.md).
- For information on how to create roles/policies, see [Create a role/policy in the JEP Controller](howto-create-role-policy.md).
- For information on how to modify roles/policies, see [Modify a role/policy in the JEP Controller](howto-modify-role-policy.md).
- For information on how to delete roles/policies, see [Delete a role/policy in the JEP Controller](howto-delete-role-policy.md).