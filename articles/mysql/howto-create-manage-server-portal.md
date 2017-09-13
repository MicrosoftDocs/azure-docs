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
ms.date: 05/10/2017
---

# Create and manage Azure Database for MySQL server using Azure portal
This article describes how you can quickly create a new Azure Database for MySQL server and manage the server using the Azure Portal. Server management includes viewing server details & databases, resetting password and deleting the server.

## Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

## Create an Azure Database for MySQL server
Follow these steps to create an Azure Database for MySQL server named “mysqlserver4demo”

1- Click **New** button found on the upper left-hand corner of the Azure portal.

2- Select **Databases** from the New page, and select **Azure Database for MySQL** from the Databases page.

> An Azure Database for MySQL server is created with a defined set of [compute and storage](./concepts-compute-unit-and-storage.md) resources. The database is created within an Azure resource group and in an Azure Database for MySQL server.

![create-new-server](./media/howto-create-manage-server-portal/create-new-server.png)

3- Fill out the Azure Database for MySQL form with the following information:

| **Form Field** | **Field Description** |
|----------------|-----------------------|
| *Server name* | azure-mysql (server name is globally unique) |
| *Subscription* | MySQLaaS (select from drop down) |
| *Resource group* | myresource (create a new resource group or use an existing one) |
| *Server admin login* | myadmin (setup admin account name) |
| *Password* | setup admin account password |
| *Confirm password* | confirm admin account password |
| *Location* | North Europe (select between North Europe and West US) |
| *Version* | 5.6 (choose Azure Database for MySQL server version) |

4- Click **Pricing tier** to specify the service tier and performance level for your new server. Compute Unit can be configured between 50 and 100 in Basic tier, 100 and 200 in Standard tier, and storage can be added based on included amount. For this HowTo guide, let’s choose 50 Compute Unit and 50GB. Click **OK** to save your selection.
![create-server-pricing-tier](./media/howto-create-manage-server-portal/create-server-pricing-tier.png)

5- Click **Create** to provision the server. Provisioning takes a few minutes.

> Check the **Pin to dashboard** option to allow easy tracking of your deployments.
> [!NOTE]
> Although up to 1000GB in Basic tier and 10000GB in Standard tier will be supported for storage, for Public Preview, the maximum storage is still limited to 1000GB temporarily. 
</Include>

## Update an Azure Database for MySQL server
After new server is provisioned, user has 2 options to edit an existing server: reset administrator password or scale up/down the server by changing the compute-units.

### Change the administrator user password
1- On the server **Overview** blade, click **Reset password** to populate a password input and confirmation window.

2- Enter new password and confirm the password in the window as below:
![reset-password](./media/howto-create-manage-server-portal/reset-password.png)

3- Click **OK** to save the new password.

### Scale up/down by changing Compute Units

1- On the server blade, under **Settings**, click **Pricing tier** to open the Pricing tier blade for the Azure Database for MySQL server.

2- Follow Step 4 in **Create an Azure Database for MySQL server** to change Compute Units in the same pricing tier.

## Delete an Azure Database for MySQL server

1- On the server **Overview** blade, click **Delete** command button to open the Deleting confirmation blade.

2- Type the correct server name in input box of the blade for double confirmation.

3- Click **Delete** button again to confirm deleting action and wait for “Deleting success” popup on the notification bar.

## List the Azure Database for MySQL databases
On the server **Overview** blade, scroll down until you see the database tile on the bottom. All the databases will be listed in the table. click **Delete** command button to open the Deleting confirmation blade.

![show-databases](./media/howto-create-manage-server-portal/show-databases.png)

## Show details of an Azure Database for MySQL server
Click **Properties** under **Settings** on the server blade will open the **Properties** blade. Then you can view all detailed information about the server.

## Next steps

[Quickstart: Create Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
