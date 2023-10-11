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
ms.date: 09/14/2023
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
- To view information about roles/policies, see [View information about roles/policies](how-to-view-role-policy.md)
