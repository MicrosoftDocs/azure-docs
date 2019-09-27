---
title: Create My Apps Workspaces for end-user access panels  | Microsoft Docs
description: Use Access Panel Workspaces to organize applications and provide a cleaner, customized My Apps experience for your end users.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/26/2019
ms.author: mimart
ms.reviewer: kasimpso
ms.collection: M365-identity-device-management
---

# How to use My Apps workspaces to customize user access panels (preview)

The My Apps access panel at https://myapplications.microsoft.com is where end users can go to view and launch the cloud-based applications you give them access to. By default, all applications are listed together on a single page. But you can create a more streamlined access panel that's easier to use by setting up workspaces. With a workspace, you can group together related applications and present them on a separate tab, making them easier to find. You can use  workspaces to create logical groupings of applications for specific job roles, tasks, projects, and so on.

When you create a workspace, users viewing that workspace will only see the applications they have access to. If the workspace contains other applications the user doesn't have access to, the user can see them by selecting **Add app**. 

This article covers how an admin can enable and create workspaces. For information for the end user about how to use the My Apps access panel and workspaces, see [TBD](TBD.md).

## Enable My Apps preview features

First, enable the My Apps preview features, which include workspaces.

1. Open the [**Azure Portal**](https://portal.azure.com/) and sign in as a user administrator or Global Administrator.

2. Go to **Azure Active Directory** > **User settings** > **Manage settings for access panel preview features**.

3. Under **Users can use preview features of My Apps**, choose **Selected group of users** or **All** users.

   [SCREENSHOT]

## Create a workspace

1. Open the [**Azure Portal**](https://portal.azure.com/), select **Azure Active Directory**.

2. Select **Enterprise Applications**

3. Under **Manage**, select **Workspaces**.

4. Select **New workspace**. In the **New workspace** blade, enter a **Name** for the workspace (we recommend not using "workspace" in the name. Then enter a **Description**.

   [SCREENSHOT]

5. Select **Create**. The properties for the new workspace appear.

6. Select the **Applications** tab. Under **Add applications**, select all the applications you want to add to the workspace, or use the **Search** box to find applications. 

   [SCREENSHOT]

7. Select **Save**. The list of selected applications appears. You can use the up and down arrows to change the order of applications in the list.

   [SCREENSHOT]

8. Select the **Users and groups** tab. To add a user or group, select **Add user**. 

9. On the **Select members** blade, select the users or groups you want to assign the workspace to, or use the **Search** box to find users or groups.

   [SCREENSHOT]

10. When you're finished selecting users and groups, click **Select**.

11. To change a users role from **Default Access** to **Owner** or vice versa, click the current role, and then in the menu, select the new role. 

   [SCREENSHOT]

## View audit logs

You can view audit logs for My Apps in the Azure Active Directory portal. The following audit logs are generated from My Apps:

* Create workspace 
* Edit workspace 
* Delete workspace 
* Launch an application (end user) 
* Self-service add application (end user) 
* Self-service application deletion (end user) 

## Next steps
[End-user experiences for applications in Azure Active Directory](end-user-experiences.md)