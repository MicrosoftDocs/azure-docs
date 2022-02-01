---
title: Modify a role/policy in the JEP Controller in Microsoft CloudKnox Permissions Management 
description: How to modify a role/policy in the Just Enough Permissions (JEP) Controller.
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

# Modify a role/policy in the JEP Controller

This article describes how you can use the JEP Controller in Microsoft CloudKnox Permissions Management to modify roles/policies for the Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) authorization systems. 

> [!NOTE]
> To view the **JEP Controller** tab, your role must be **Viewer**, **Controller**, or **Administrator**. To make changes on this tab, you must be a **Controller** or **Administrator**. If you don’t have access, contact your system administrator.

> [!NOTE]
> Microsoft Azure uses the term *role* for what other Cloud providers call *policy*. CloudKnox automatically makes this terminology change when you select the authorization system type. In the user documentation, we use *role/policy* to refer to both.

## Modify a role/policy

1. On the CloudKnox home page, select the **JEP Controller** tab, and then select the **Role/Policies** tab.
1. Select the role/policy you want to modify, and from the **Actions** column, select **Modify**.

     You can't modify **System** policies and roles.

1. On the **Statements** screen, make your changes to the **Tasks**, **Resources**, **Request conditions**, and **Effect** sections as required, and then select **Next**.

1. Review the edits on the **Preview** screen, and then select **Submit**.
1. Refresh the **Role/Policies** tab to see the role/policy you modified.
