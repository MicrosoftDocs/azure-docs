---
title: Assign access in Azure Cost Management | Microsoft Docs
description: Assign access to cost management data with user accounts that define access levels to entities.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/16/2017
ms.topic: article
ms.service: cost-management
ms.custom: mvc
manager: carmonm
---


# Assign access to cost management data

Access to cost management data is provided by user and entity management. Cloudyn user accounts determine access levels to *entities* and administrative functions. There two types of access: admin and user. Unless modified per user, admin access allows a user unrestricted use of all functions in the Cloudyn portal, including: allow user management, allow Recipient lists Management and root access to all entity data. User access is intended for end users to view reports and create reports using the access they have to entity data.

Entities define your business organization in a hierarchical structure and identify departments, divisions, and teams in your organization. The entity hierarchy helps you accurately track spending by the entities.

When you registered your Azure agreement or account, an account with admin permission was created in Cloudyn, so you can perform all the steps in this tutorial. This tutorial covers access to cost management data including  user management and entity management. You learn how to:

> [!div class="checklist"]
> * Create a user with admin access
> * Create a user with user access
> * Create entities



## Create a user with admin access

Although you already have admin access, coworkers in your organization might also need to have admin access. In the Cloudyn portal, click **Settings** in the upper right and select **User Management**. Click **Add New User** to add a new user.

Enter required information about the user. You can leave the password field empty and the user will set a new password using information from a confirmation e-mail sent by Cloudyn, when you select **Notify user by email**. Choose permissions to allow User Management so that the user can create and modify other users. Recipient Lists Management to allow the user to edit recipient lists.

Under **User has admin access**, the root entity of your organization is selected. Leave root selected and then save the user information.
  ![add new user with admin access](.\media\tutorial-user-access\new-admin-access.png)

## Create a user with user access
Typical users that need access to cost management data like dashboards and reports should have user access to view them. Create a new user with user access similar to the one you created with admin access, with the following differences:

- Clear **Allow User Management**, **Allow Recipient lists Management**, and clear all in the **User has admin access** list.
- Select entities that the users needs access to in the **User has user access** list.
- You can also allow admin to access to specific entities, as needed.

![add new user with user access](.\media\tutorial-user-access\new-user-access.png)

## Create entities

When your define your cost entity hierarchy, it identifies the structure of your organization. How you build and organize the structure is up to you. Individual subscriptions for your cloud accounts are linked to specific entities. So, entities are multi-tenant. You can assign specific users access to only their segment of your business using entities. Doing so keeps data isolated, even across large portions of a business like subsidiaries. And, data isolation helps with governance.  

When you registered your Azure agreement or account with Cloudyn, your Azure resource data including usage, performance, billing, and tag data from your subscriptions was copied to your Cloudyn account. That data was used to create entities in Cloudyn.

In the Cloudyn portal, click **Settings** in the upper right and select **Cloud Accounts**. Review the entity tree to see how the structure looks. Here's an example of a entity hierarchy that might resemble many IT organizations:

![entity tree](.\media\tutorial-user-access\entity-tree.png)

Next to **Entities**, click **Add Entity**. Enter information about the person or department that you want to add. If you want to view a list of access levels, search in help for *Adding an entity*.

![add entity](.\media\tutorial-user-access\add-entity.png)

When you're done, **Save** the entity.

We'll look more at entities in later tutorials.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a user with admin access
> * Create a user with user access
> * Create entities

<!--
Advance to the next tutorial to learn about [summarized title of next article].

> [!div class="nextstepaction"]
> [Article title](file-name.md)
-->
