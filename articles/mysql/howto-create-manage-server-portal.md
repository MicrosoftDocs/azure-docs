---
title: Create and manage Azure Database for MySQL server using Azure portal | Microsoft Docs
description: This article describes how you can quickly create a new Azure Database for MySQL server and manage the server using the Azure Portal.
services: mysql
author: v-chenyh
ms.author: nolanwu
editor: jasonwhowell
manager: jhubbard
ms.service: mysql-database
ms.topic: article
ms.date: 09/15/2017
---

# Create and manage Azure Database for MySQL server using Azure portal
This topic describes how you can quickly create a new Azure Database for MySQL server. It also includes information about how to manage the server by using the Azure portal. Server management includes viewing server details and databases, resetting the password, and deleting the server.

## Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

## Create an Azure Database for MySQL server
Follow these steps to create an Azure Database for MySQL server named “mysqlserver4demo.”

1. Click the **New** button located in the upper left-hand corner of the Azure portal.

2. On the New page, select **Databases**, and then on Databases page, select **Azure Database for MySQL**.

    > An Azure Database for MySQL server is created with a defined set of [compute and storage](./concepts-compute-unit-and-storage.md) resources. The database is created within an Azure resource group and in an Azure Database for MySQL server.

   ![create-new-server](./media/howto-create-manage-server-portal/create-new-server.png)

3. Fill out the Azure Database for MySQL form by using the following information:

    | **Form Field** | **Field Description** |
    |----------------|-----------------------|
    | *Server name* | azure-mysql (server name is globally unique) |
    | *Subscription* | MySQLaaS (select from the drop-down menu) |
    | *Resource group* | myresource (create a new resource group or use an existing one) |
    | *Server admin login* | myadmin (setup admin account name) |
    | *Password* | setup admin account password |
    | *Confirm password* | confirm admin account password |
    | *Location* | North Europe (select between North Europe and West US) |
    | *Version* | 5.6 (choose Azure Database for MySQL server version) |

4. Click **Pricing tier** to specify the service tier and performance level for your new server. Compute Unit can be configured between 50 and 100 in Basic tier, between 100 and 200 in Standard tier, and storage can be added based on the included amount. For this HowTo guide, let’s choose 50 Compute Unit and 50 GB. Click **OK** to save your selection.

   ![create-server-pricing-tier](./media/howto-create-manage-server-portal/create-server-pricing-tier.png)

5. Click **Create** to provision the server. Provisioning takes a few minutes.

    > Select the **Pin to dashboard** option to allow easy tracking of your deployments.
    > [!NOTE]
    > Although up to 1,000 GB in Basic tier and 10,000 GB in Standard tier is supported for storage, for Public Preview the maximum storage is temporarily limited to 1,000 GB.</Include>

## Update an Azure Database for MySQL server
After new server is provisioned, the user has two options for editing an existing server: reset administrator password or scale the server up or down by changing the compute-units.

### Change the administrator user password
1. On the server **Overview** blade, click **Reset password** to populate a password input and confirmation window.

2. Enter new password and confirm the password in the window as shown:

   ![reset-password](./media/howto-create-manage-server-portal/reset-password.png)

3. Click **OK** to save the new password.

### Scale up/down by changing Compute Units

1. On the server blade, under **Settings**, click **Pricing tier** to open the Pricing tier blade for the Azure Database for MySQL server.

2. Follow Step 4 in **Create an Azure Database for MySQL server** to change Compute Units in the same pricing tier.

## Delete an Azure Database for MySQL server

1. On the server **Overview** blade, click the **Delete** command button to open the Deleting confirmation blade.

2. Type the correct server name into the input box of the blade for double confirmation.

3. Click the **Delete** button again to confirm the deleting action, and then wait for the “Deleting success” pop up to appear on the notification bar.

## List the Azure Database for MySQL databases
On the server **Overview** blade, scroll down until you see the database tile at the bottom. All the databases are listed in the table. Click the **Delete** command button to open the Deleting confirmation blade.

   ![show-databases](./media/howto-create-manage-server-portal/show-databases.png)

## Show details of an Azure Database for MySQL server
On the server blade, under **Settings**, click **Properties** to open the **Properties** blade, and then view all detailed information about the server.

## Next steps

[Quickstart: Create Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)