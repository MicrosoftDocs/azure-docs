---
title: Create and manage Azure Database for MySQL server using Azure portal
description: This article describes how you can quickly create a new Azure Database for MySQL server and manage the server using the Azure Portal.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 02/28/2018
---

# Create and manage Azure Database for MySQL server using Azure portal
This topic describes how you can quickly create a new Azure Database for MySQL server. It also includes information about how to manage the server by using the Azure portal. Server management includes viewing server details and databases, resetting the password, scaling resources, and deleting the server.

## Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

## Create an Azure Database for MySQL server
Follow these steps to create an Azure Database for MySQL server named “mydemoserver.”

1. Click the **Create a resource** button located in the upper left-hand corner of the Azure portal.

2. On the New page, select **Databases**, and then on Databases page, select **Azure Database for MySQL**.

    > An Azure Database for MySQL server is created with a defined set of [compute and storage](./concepts-pricing-tiers.md) resources. The database is created within an Azure resource group and in an Azure Database for MySQL server.

   ![create-new-server](./media/howto-create-manage-server-portal/create-new-server.png)

3. Fill out the Azure Database for MySQL form by using the following information:

    | **Form Field** | **Field Description** |
    |----------------|-----------------------|
    | *Server name* | mydemoserver (server name is globally unique) |
    | *Subscription* | mysubscription (select from the drop-down menu) |
    | *Resource group* | myresourcegroup (create a new resource group or use an existing one) |
    | *Select source* | Blank (create a blank MySQL server) |
    | *Server admin login* | myadmin (setup admin account name) |
    | *Password* | set admin account password |
    | *Confirm password* | confirm admin account password |
    | *Location* | Southeast Asia (select between North Europe and West US) |
    | *Version* | 5.7 (choose Azure Database for MySQL server version) |

4. Click **Pricing tier** to specify the service tier and performance level for your new server. Select the **General Purpose** tab. *Gen 5*, *2 vCores*, *5 GB*, and *7 days* are the default values for **Compute Generation**, **vCore**, **Storage**, and **Backup Retention Period**. You can leave those sliders as is. To enable your server backups in geo-redundant storage select **Geographically Redundant** from the **Backup Redundancy Options**.

   ![create-server-pricing-tier](./media/howto-create-manage-server-portal/create-server-pricing-tier.png)

5. Click **Create** to provision the server. Provisioning takes a few minutes.

    > Select the **Pin to dashboard** option to allow easy tracking of your deployments.

## Update an Azure Database for MySQL server
After the new server has been provisioned, the user has several options for configuring the existing server, including resetting the administrator password and scaling the server up or down by changing vCore or storage.

### Change the administrator user password
1. From the server **Overview**, click **Reset password** to show the password reset window.

   ![overview](./media/howto-create-manage-server-portal/overview.png)

2. Enter a new password and confirm the password in the window as shown:

   ![reset-password](./media/howto-create-manage-server-portal/reset-password.png)

3. Click **OK** to save the new password.

### Scale vCores up/down

1. Click on **Pricing tier**, located under **Settings**.

2. Change the **vCore** setting by moving the slider to your desired value.

    ![scale-compute](./media/howto-create-manage-server-portal/scale-compute.png)

3. Click **OK** to save changes.

### Scale Storage up

1. Click on **Pricing tier**, located under **Settings**.

2. Change the **Storage** setting by moving the slider to your desired value.

    ![scale-storage](./media/howto-create-manage-server-portal/scale-storage.png)

3. Click **OK** to save changes.

## Delete an Azure Database for MySQL server

1. From the server **Overview**, click the **Delete** button to open the delete confirmation prompt.

    ![delete](./media/howto-create-manage-server-portal/delete.png)

2. Type the name of the server into the input box for double confirmation.

    ![confirm-delete](./media/howto-create-manage-server-portal/confirm.png)

3. Click the **Delete** button to confirm deleting the server. Wait for the “Successfully deleted MySQL server" pop up to appear in the notification bar.

## List the Azure Database for MySQL databases
From the server **Overview**, scroll down until you see the database tile at the bottom. All databases in the server are listed in the table.

   ![show-databases](./media/howto-create-manage-server-portal/show-databases.png)

## Show details of an Azure Database for MySQL server
Click on **Properties**, located under **Settings** to view detailed information about the server.

![properties](./media/howto-create-manage-server-portal/properties.png)

## Next steps

[Quickstart: Create Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)