---
title: 'Quickstart: Create a server - Azure portal - Azure Database for MySQL'
description: This article steps you through using the Azure portal to quickly create a sample Azure Database for MySQL server in about five minutes.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 11/04/2020
---

# Quickstart: Create an Azure Database for MySQL server in the Azure portal

Azure Database for MySQL is a managed service that you use to run, manage, and scale highly available MySQL Databases in the cloud. This quickstart shows you how to how to use the Azure portal to create an Azure Database for MySQL Single Server and connect to the server.

## Prerequisites
An Azure subscription is required. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Create an Azure Database for MySQL Single Server
Go to the [Azure portal](https://portal.azure.com/) to create an MySQL Single Server database. Search for and select *Azure Database for MySQL*.

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/findazuremysqlinportal.png" alt-text="Find Azure Database for MySQL":::

1. Select **Add**.

2. On the Create a Azure Database for MySQL page , select  **Single server**.
   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/choose-singleserver.png" alt-text="Choose single server":::

3. Now enter the basic settings for a new Single server.

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/4-create-form.png" alt-text="Create server form":::

   **Setting** | **Suggested value** | **Field description**
   ---|---|---
   Subscription | your subscription | Select the desired Azure Subscription.
   Resource group | *myresourcegroup* | A new or an existing resource group from your subscription.
   Server name | *mydemoserver* | Enter a unique name. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
   Data source |*None* | Select None to create a new server from scratch. Select Backup only if you were restoring from a geo-backup of an existing server.
   Admin username | *mydemoadmin* | Enter your server admin username. You cannot use **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public** as the admin username.
   Password | your password | A new password for the server admin user. Password must be 8 to 128 characters in length with a combination of uppercase or lowercase letters, numbers, and non-alphanumeric characters (!, $, #, %, and so on).
   Location |your desired location | Select a location from the dropdown list.
   Version | latest major version| Use the latest major version. See [all supported versions](https://docs.microsoft.com/azure/postgresql/concepts-supported-versions)
   Compute + Storage | use defaults| The default pricing tier is General Purpose with **4 vCores** and **100 GB** storage. Backup retention is set to **7 days** with Geographically Redundant backup option.<br/>Learn about the [pricing](https://azure.microsoft.com/pricing/details/mysql/) and update the defaults if needed.

   > [!NOTE]
   > Consider using the Basic pricing tier if light compute and I/O are adequate for your workload. Note that servers created in the Basic pricing tier cannot later be scaled to General Purpose or Memory Optimized.

4. Select **Review + create** to provision the server.

5. Wait for the portal page to display **your deployment is complete**. Select **Go to resource** to go to the newly created server page.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/deployment_complete.png" alt-text="successful deployment":::

[Having issues? Let us know](https://aka.ms/mysql-doc-feedback)

## Configure a server-level firewall rule

By default the server created is protected with a firewall. To connect you must give access to your IP by following these steps:

1. Go to **Connection security** from left-side menu for your server resource. Don't know how to find your resource, see [How to open a resource](https://docs.microsoft.com/azure/azure-resource-manager/management/manage-resources-portal#open-resources).

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/add-current-ip-firewall.png" alt-text="Connection security - Firewall rules":::

2. Select **Add current client IP address** and then select **Save**.

   > [!NOTE]
   > Check if your network allows outbound traffic over port 3306 that is used by Azure Database for MySQL to avoid connectivity issues.

You can add additional IPs or provide an IP range to connect to your server from those IPs. For more information, see [How to manage firewall rules on Azure Database for MySQL server](./concepts-firewall-rules.md)


[Having issues? Let us know](https://aka.ms/mysql-doc-feedback)

## Connect to the server with mysql command-line client
You can choose either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. In this quickstart, we will run **mysql.exe** in [Azure Cloud Shell](../cloud-shell/overview.md) to connect to the server.


1. Launch Azure Cloud Shell in the portal by clicking the highlighted icon on the top-left side. Make a note of your server name, server admin login name, password, and subscription for your newly created server from the **Overview** section as shown in the image below.

    > [!NOTE]
    > If you are launching cloud shell for the first time, you will see a prompt to create a resource group, storage account. This is a one-   time step and will be automatically attached for all sessions.

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/use-in-cloud-shell.png" alt-text="Portal Full View Cloud Shell":::
2. Run this command on Azure Cloud Shell terminal. Replace values with your actual server name and admin user login name. The admin username requires '@\<servername>' as shown below for Azure Database for MySQL

  ```azurecli-interactive
  mysql --host=mydemoserver.mysql.database.azure.com --user=myadmin@mydemoserver -p
  ```

  Here is how the experience looks like in the Cloud Shell terminal
  ```
  Requesting a Cloud Shell.Succeeded.
  Connecting terminal...

  Welcome to Azure Cloud Shell

  Type "az" to use Azure CLI
  Type "help" to learn about Cloud Shell

  user@Azure:~$mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
  Enter password:
  Welcome to the MySQL monitor.  Commands end with ; or \g.
  Your MySQL connection id is 64796
  Server version: 5.6.42.0 Source distribution

  Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

  Oracle is a registered trademark of Oracle Corporation and/or its
  affiliates. Other names may be trademarks of their respective
  owners.

  Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
  mysql>
  ```
3. In the same Azure Cloud Shell terminal, create a database **guest**
  ```
  mysql> CREATE DATABASE guest;
  Query OK, 1 row affected (0.27 sec)
  ```
4. Change to database **guest**
  ```
  mysql> USE guest;
  Database changed
  ```
5. Type ```quit```, and then select the Enter key to quit mysql.

[Having issues? Let us know](https://aka.ms/mysql-doc-feedback)

## Clean up resources
You have successfully created an Azure Database for MySQL server in a resource group.  If you don't expect to need these resources in the future, you can delete them by deleting the resource group or just delete the MySQL server. To delete the resource group, follow these steps:
1. In the Azure portal, search for and select **Resource groups**.
2. In the resource group list, choose the name of your resource group.
3. In the Overview page of your resource group, select **Delete resource group**.
4. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

To delete the server, you can click on **Delete** button on **Overview** page of your server as shown below:
> [!div class="mx-imgBorder"]
> :::image type="content" source="media/quickstart-create-mysql-server-database-using-azure-portal/delete-server.png" alt-text="Delete your resources":::

## Next steps
> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../app-service/app-service-web-tutorial-php-mysql.md) <br/>

> [!div class="nextstepaction"]
>[Build PHP app on Linux with MySQL](../app-service/containers/tutorial-php-mysql-app.md)<br/><br/>

[Cannot find what you are looking for? Let us know.](https://aka.ms/mysql-doc-feedback)
