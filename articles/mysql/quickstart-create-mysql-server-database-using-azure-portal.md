---
title: 'Quickstart: Create a server - Azure portal - Azure Database for MySQL'
description: This article steps you through using the Azure portal to quickly create a sample Azure Database for MySQL server in about five minutes. 
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 7/15/2020
---

# Quickstart: Create an Azure Database for MySQL server in the Azure portal

Azure Database for MySQL is a managed service that you use to run, manage, and scale highly available MySQL Databases in the cloud. This Quickstart shows you how to create an Azure Database for MySQL server in about five minutes using the Azure portal.  

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Open your web browser, and then go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL server
You create an Azure Database for MySQL server with a defined set of [compute and storage resources](./concepts-pricing-tiers.md). You create the server within an [Azure resource group](../azure-resource-manager/management/overview.md).

Follow these steps to create an Azure Database for MySQL server:

1. Select **Create a resource** (+) in the upper-left corner of the  portal.

2. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.

  
>[!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/2_navigate-to-mysql.png" alt-text="Azure Database for MySQL option":::

3. Fill out the new server details form with the following information:
    
>[!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/4-create-form.png" alt-text="Create server form":::

**Setting** | **Suggested value** | **Field description** 
---|---|---
Subscription | Your subscription | Select the Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you get billed for the resource.
Resource group | *myresourcegroup* | Provide a new or existing resource group name. Resource group can be used organize your dependencies that belong to single project.
Server name | Unique server name | Enter a unique name that identifies your Azure Database for MySQL server. For example, 'mysqldbserver'.The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
Data source |*None* | Select *None* to create a new server from scratch. (You would select *Backup* if you were creating a server from a geo-backup of an existing Azure Database for MySQL server).
Server admin login | myadmin | Enter a username for your server administrator. You cannot use **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public** as the admin username.
Password | *Your choice* | Provide a new password for the server admin account. Password must be 8 to 128 characters in length with a combination of uppercase or lowercase letters, numbers, and non-alphanumeric characters (!, $, #, %, and so on).
Confirm password | *Your choice*| Confirm the admin account password.
Location | *The region closest to your users*| Choose the location that is closest to your users or your other Azure applications.
Version | *The latest major version*| The latest major version (unless you have specific requirements that require another version).
Compute + Storage | **General Purpose**, **Gen 5**, **2 vCores**, **5 GB**, **7 days**, **Geographically Redundant** |The compute, storage, and backup configurations for your new server. Select **Configure server**. Next, select the appropriate pricing tier, for more information, see the [pricing page](https://azure.microsoft.com/pricing/details/mysql/). To enable your server backups in geo-redundant storage, select **Geographically Redundant** from the **Backup Redundancy Options**. Select **OK**.

   > [!NOTE]
   > Consider using the Basic pricing tier if light compute and I/O are adequate for your workload. Note that servers created in the Basic pricing tier cannot later be scaled to General Purpose or Memory Optimized. 

4. Select **Review + create** to provision the server. Provisioning can take up to 20 minutes.
   
5. Select **Notifications** on the toolbar (the bell icon) to monitor the deployment process.
   
By default, the following databases are created under your server: **information_schema**, **mysql**, **performance_schema**, and **sys**.

## Configure a server-level firewall rule
By default the server created is protected with a firewall and is not accessible publicly. To give access to your IP, go to your server resource in the Azure portal and select **Connection security** from left-side menu for your server resource. Don't know how to find your resource, see [How to open a resource](../azure-resource-manager/management/manage-resources-portal.md#open-resources).

>[!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/add-current-ip-firewall.png" alt-text="Connection security - Firewall rules":::
   
Now select **Add current client IP address** and then select **Save**. You can add additional IPs or provide an IP range to connect to your server from those IPs. For more information, see [How to manage firewall rules on Azure Database for MySQL server](./concepts-firewall-rules.md)

> [!NOTE]
> Check if your network allows outbound traffic over port 3306 that is used by Azure Database for MySQL to avoid connectivity issues.  

## Connect to Azure Database for MySQL server using mysql command-line client
You can choose either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. In this quickstart, we will run **mysql.exe** in [Azure Cloud Shell](../cloud-shell/overview.md) to connect to the server.

1. Launch Azure Cloud Shell in the portal by clicking the highlighted icon on the top-left side. Make a note of your server name, server admin login name, password, and subscription for your newly created server from the **Overview** section as shown in the image below.

    >[!NOTE]
    >If you are launching cloud shell for the first time, you will see a prompt to create a resource group, storage account. This is a one-   time step and will be automatically attached for all sessions. 

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
>[Build a PHP app on Windows with MySQL](../app-service/tutorial-php-mysql-app.md)
>[Build PHP app on Linux with MySQL](../app-service/tutorial-php-mysql-app.md?pivots=platform-linux%253fpivots%253dplatform-linux)
>[Build Java based Spring App with MySQL](/azure/developer/java/spring-framework/spring-app-service-e2e?tabs=bash)