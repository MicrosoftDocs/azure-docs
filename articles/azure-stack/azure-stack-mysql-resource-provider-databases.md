---
title: Using databases provided by the MySQL Adapter RP on AzureStack | Microsoft Docs
description: How to create and manage MySQL databases provisioned using the MySQL Adapter Resource Provider
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: jeffgilb
ms.reviewer: jeffgo

---

# Create MySQL databases

You can create and manage self-service databases in the user portal. An Azure Stack user needs a subscription with an offer that includes the MySQL database service.

## Test your deployment by creating a MySQL database

1. Sign in to the Azure Stack user portal.
2. Select **+ Create a resource** > **Data + Storage** > **MySQL Database** > **Add**.
3. Under **Create MySQL Database**, enter the Database Name, and configure the other settings as required for your environment.

    ![Create a test MySQL database](./media/azure-stack-mysql-rp-deploy/mysql-create-db.png)

4. Under **Create Database**, select **SKU**. Under **Select a MySQL SKU**, pick the SKU for your database.

    ![Select a MySQL SKU](./media/azure-stack-mysql-rp-deploy/mysql-select-sku.png)

    >[!Note]
    >As hosting servers are added to Azure Stack, they're assigned a SKU. Databases are created in the pool of hosting servers in a SKU.

5. Under **Login**, select ***Configure required settings***.
6. Under **Select a Login**, you can choose an existing login or select **+ Create a new login** to set up a new login.  Enter a **Database login** name and **Password**, and then select **OK**.

    ![Create a new database login](./media/azure-stack-mysql-rp-deploy/create-new-login.png)

    >[!NOTE]
    >The length of the Database login name can't exceed 32 characters in MySQL 5.7. In earlier editions, it can't exceed 16 characters.

7. Select **Create** to finish setting up the database.

After the database is deployed, take note of the **Connection String** under **Essentials**. You can use this string in any application that needs to access the MySQL database.

![Get the connection string for the MySQL database](./media/azure-stack-mysql-rp-deploy/mysql-db-created.png)

## Update the administrative password

You can modify the password by changing it on the MySQL server instance.

1. Select **ADMINISTRATIVE RESOURCES** > **MySQL Hosting Servers**. Select the hosting server.
2. Under **Settings**, select **Password**.
3. Under **Password**, enter the new password and then select **Save**.

![Update the admin password](./media/azure-stack-mysql-rp-deploy/mysql-update-password.png)

## Next steps

[Update the MySQL resource provider](azure-stack-mysql-resource-provider-update.md)
