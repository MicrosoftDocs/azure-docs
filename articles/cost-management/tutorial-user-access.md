---
title: Assign access in Azure Cost Management | Microsoft Docs
description: Assign access to cost management data with user accounts that define access levels to entities.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 10/11/2017
ms.topic: tutorial
ms.service: cost-management
ms.custom: mvc
manager: carmonm
---


# Assign access to cost management data

Access to cost management data is provided by user or entity management. Cloudyn user accounts determine access to *entities* and administrative functions. There two types of access: admin and user. Unless modified per user, admin access allows a user unrestricted use of all functions in the Cloudyn portal, including: user management, recipient lists management and root entity access to all entity data. User access is intended for end users to view reports and create reports using the access they have to entity data.

Entities are used to reflect your business organization's hierarchical structure. They identify departments, divisions, and teams in your organization in Cloudyn. The entity hierarchy helps you accurately track spending by the entities.

When you registered your Azure agreement or account, an account with admin permission was created in Cloudyn, so you can perform all the steps in this tutorial. This tutorial covers access to cost management data including  user management and entity management. You learn how to:

> [!div class="checklist"]
> * Create a user with admin access
> * Create a user with user access
> * Create entities



## Create a user with admin access

Although you already have admin access, coworkers in your organization might also need to have admin access. In the Cloudyn portal, click the gear symbol in the upper right and select **User Management**. Click **Add New User** to add a new user.

Enter required information about the user. You can leave the password field empty so that the user can set a new password on first sign in. A link with sign in information gets sent to the user by e-mail from Cloudyn when you select **Notify user by email**. Choose permissions to allow User Management so that the user can create and modify other users. Recipient Lists Management to allow the user to edit recipient lists.

Under **User has admin access**, the root entity of your organization is selected. Leave root selected and then save the user information. Selecting the root entity allows the user to have admin permission not only to the root entity in the tree, but also to all the entities that reside below it.  
  ![add new user with admin access](.\media\tutorial-user-access\new-admin-access.png)

## Create a user with user access
Typical users that need access to cost management data like dashboards and reports should have user access to view them. Create a new user with user access similar to the one you created with admin access, with the following differences:

- Clear **Allow User Management**, **Allow Recipient lists Management**, and clear all in the **User has admin access** list.
- Select the entities that the user needs access to in the **User has user access** list.
- You can also allow admin to access to specific entities, as needed.

![add new user with user access](.\media\tutorial-user-access\new-user-access.png)

To watch a tutorial video about adding users, see [Adding Users to Azure Cost Management by Cloudyn](https://youtu.be/Nzn7GLahx30).

## Create entities

When you define your cost entity hierarchy, a best practice is to identify the structure of your organization.

As you build the tree, consider how you want or need to see their costs segregated by business units, cost centers, environments, and sales departments. The entity tree in Cloudyn is flexible due to entity inheritance. Individual subscriptions for your cloud accounts are linked to specific entities. So, entities are multi-tenant. You can assign specific users access to only their segment of your business using entities. Doing so keeps data isolated, even across large portions of a business like subsidiaries. And, data isolation helps with governance.  

When you registered your Azure agreement or account with Cloudyn, your Azure resource data including usage, performance, billing, and tag data from your subscriptions was copied to your Cloudyn account. However, you must manually create your entity tree. If you skipped the Azure Resource Manager registration, then only billing data and a few asset reports are available in the Cloudyn portal.

In the Cloudyn portal, click **Settings** in the upper right and select **Cloud Accounts**. You start with a single entity (root) and build your entity tree under the root. Here's an example of an entity hierarchy that might resemble many IT organizations after the tree is complete:

![entity tree](.\media\tutorial-user-access\entity-tree.png)

Next to **Entities**, click **Add Entity**. Enter information about the person or department that you want to add. The **Full Name** and **Email** fields to do not have to match existing users. If you want to view a list of access levels, search in help for *Adding an entity*.

![add entity](.\media\tutorial-user-access\add-entity.png)

When you're done, **Save** the entity.


To watch a tutorial video about creating a cost entity hierarchy, see [Creating a Cost Entity Hierarchy in Azure Cost Management by Cloudyn](https://youtu.be/dAd9G7u0FmU).

If you are an Azure Enterprise Agreement user, watch a tutorial video about associating accounts and subscriptions to entities at [Connecting to Azure Resource Manager with Azure Cost Management by Cloudyn](https://youtu.be/oCIwvfBB6kk).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a user with admin access
> * Create a user with user access
> * Create entities

Advance to the next tutorial to learn how to forecast spending using historical data.

> [!div class="nextstepaction"]
> [Forecast future spending](tutorial-forecast-spending.md)
