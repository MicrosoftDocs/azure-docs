---
title: Create My Apps Workspaces for end users  | Microsoft Docs
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

The **My Apps** portal at https://myapps.microsoft.com lets end users view and launch the cloud-based applications you've given them access to. By default, all applications are listed together on a single page. If you're an admin with an Azure AD Premium license, you can use My Apps workspaces to create logical groupings of applications for specific job roles, tasks, or projects. With a workspace, you group applications together and present them on a separate tab. Then users viewing that workspace will only see the applications they have access to. If the workspace contains other applications the user doesn't have access to, the user can see them by selecting **Add app**.

This article covers how an admin can enable and create workspaces. For information for the end user about how to use the My Apps access panel and workspaces, see [TBD](TBD.md).

## Enable My Apps preview features

First, enable the My Apps preview features, which include workspaces.

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a user administrator or Global Administrator.

2. Go to **Azure Active Directory** > **User settings**.

3. Under **User feature previews**, select **Manage user feature preview settings**.

4. Under **Users can use preview features for My Apps**, choose one of the following options:
   * **Selected** - Enables preview features for a specific group. Use the **Select a group** option to select the group for which you want to enable preview features.  
   * **All** - Enables preview features for all users.

   ![User preview features](media/access-panel-workspaces/user-preview-features.png)

## Create a workspace

1. Open the [**Azure Portal**](https://portal.azure.com/) and select **Azure Active Directory**.

2. Select **Enterprise Applications**

3. Under **Manage**, select **Workspaces (Preview)**.

4. Select **New workspace**. In the **New workspace** page, enter a **Name** for the workspace (we recommend not using "workspace" in the name. Then enter a **Description**.

   ![Create a new workspace](media/access-panel-workspaces/new-workspace.png)

5. Select **Review + Create**. The properties for the new workspace appear.

6. Select the **Applications** tab. Under **Add applications**, select all the applications you want to add to the workspace, or use the **Search** box to find applications. 

   ![Add applications to the workspace](media/access-panel-workspaces/add-applications.png)

7. Select **Add**. The list of selected applications appears. You can use the up and down arrows to change the order of applications in the list.

   ![List of applications in the workspace](media/access-panel-workspaces/add-applications-list.png)

8. Select the **Users and groups** tab. To add a user or group, select **Add user**. 

9. On the **Select members** blade, select the users or groups you want to assign the workspace to. Or use the **Search** box to find users or groups.

   ![Assign users and groups to the workspace](media/access-panel-workspaces/add-users-and-groups.png)

10. When you're finished selecting users and groups, choose **Select**.

11. To change a user's role from **Read Access** to **Owner** or vice versa, click the current role and select a new role.

    ![Assign roles to users and groups](media/access-panel-workspaces/users-groups-list-role.png)

## View audit logs

The Audit logs record My Apps workspaces operations, including workspace creation end-user actions. The following events are generated from My Apps:

* Create workspace 
* Edit workspace 
* Delete workspace 
* Launch an application (end user) 
* Self-service application adding (end user) 
* Self-service application deletion (end user) 

You can access audit logs in the [Azure portal](https://portal.azure.com) by selecting **Azure Active Directory** > **Enterprise Applications** > **Audit logs** in the Activity section. For **Service**, select **My Apps**.

   ![Assign roles to users and groups](media/access-panel-workspaces/users-groups-list-role.png)


## Next steps
[End-user experiences for applications in Azure Active Directory](end-user-experiences.md)