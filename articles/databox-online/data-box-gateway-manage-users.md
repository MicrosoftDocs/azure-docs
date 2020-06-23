---
title: Azure Data Box Gateway manage users | Microsoft Docs 
description: Describes how to use the Azure portal to manage users on your Azure Data Box Gateway.
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: how-to
ms.date: 03/25/2019
ms.author: alkohli
---
# Use the Azure portal to manage users on your Azure Data Box Gateway

This article describes how to manage users on your Azure Data Box Gateway. You can manage the Azure Data Box Gateway via the Azure portal or via the local web UI. Use the Azure portal to add, modify, or delete users. 

In this article, you learn how to:

> [!div class="checklist"]
> * Add a user
> * Modify user
> * Delete a user

## About users

Users can be read-only or full privilege. As the names indicate, the read-only users can only view the share data. The full privilege users can read share data, write to these shares, and modify or delete the share data.

 - **Full privilege user** - A local user with full access.
 - **Read-only user** - A local user with read-only access. These users are associated with shares that allow read-only operations.

The user permissions are first defined when the user is created during share creation. Modification of share-level permissions is currently not supported.

## Add a user

Do the following steps in the Azure portal to add a user.

1. In the Azure portal, go to your Data Box Gateway resource and then navigate to **Overview**. Click **+ Add user** on the command bar.

    ![Click add user](media/data-box-gateway-manage-users/add-user-1.png)

2. Specify the username and password for the user you want to add. Confirm the password and click **Add**.

    ![Click add user](media/data-box-gateway-manage-users/add-user-2.png)

    > [!IMPORTANT] 
    > These users are reserved by the system and should not be used: Administrator, EdgeUser, EdgeSupport, HcsSetupUser, WDAGUtilityAccount, CLIUSR, DefaultAccount, Guest.  

3. You're notified when the user creation starts and is completed. Once the user is created, from the command bar, click **Refresh** to view the updated list of users.


## Modify user

You can change the password associated with a user once the user is created. Select and click from the list of users. Supply and confirm the new password. Save the changes.
 
![Modify user](media/data-box-gateway-manage-users/modify-user-1.png)


## Delete a user

Do the following steps in the Azure portal to delete a user.

1. Select and click a user from the list of users and then click **Delete**.  

   ![Delete a user](media/data-box-gateway-manage-users/delete-user-1.png)

2. When prompted, confirm the deletion. 

   ![Delete a user](media/data-box-gateway-manage-users/delete-user-2.png)

The list of users is updated to reflect the deleted user.

![Delete a user](media/data-box-gateway-manage-users/delete-user-3.png)


## Next steps

- Learn how to [Manage bandwidth](data-box-gateway-manage-bandwidth-schedules.md).
