---
title: 'Quickstart: Create a server - Azure portal - Azure Database for MySQL'
description: This quickstart walks you through using the Azure portal to quickly create a sample Azure Database for MySQL server in about five minutes. 
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 7/15/2020
---

# Quickstart: Create an Azure Database for MySQL server by using the Azure portal

Azure Database for MySQL is a managed service that you use to run, manage, and scale highly available MySQL databases in the cloud. This quickstart shows you how to create an Azure Database for MySQL server in about five minutes by using the Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
In a web browser, go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL server
You create an Azure Database for MySQL server with a defined set of [compute and storage resources](./concepts-pricing-tiers.md). You create the server within an [Azure resource group](../azure-resource-manager/management/overview.md).

Complete these steps to create an Azure Database for MySQL server:

1. Select **Create a resource** in the upper-left corner of the  portal.

2. Select **Databases** > **Azure Database for MySQL**. You can also enter **MySQL** in the search box to find the service.

  
   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/2_navigate-to-mysql.png" alt-text="Screenshot that shows the Azure Database for MySQL option.":::

3. Enter the following information on the **Create MySQL server** page:
    
   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/4-create-form.png" alt-text="Screenshot that shows the Create MySQL server page.":::

   **Setting** | **Suggested value** | **Description** 
   ---|---|---
   Subscription | Your subscription | Select the Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription for which you want to be billed for the resource.
   Resource group | **myresourcegroup** | Provide a new or existing resource group name. You can use resource groups to organize dependencies that belong to a single project.
   Server name | A unique server name | Enter a unique name that identifies your Azure Database for MySQL server. For example, **mysqldbserver**. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain between 3 and 63 characters.
   Data source |**None** | Select **None** to create a new server from scratch. (You would select **Backup** to create a server from a geo-backup of an existing Azure Database for MySQL server.)
   Location | The region closest to your users| Select the location that's closest to your users or your other Azure applications.
   Version | The latest major version| Enter the latest major version (unless you require a different version).
   Compute + storage | **General Purpose**, **Gen 5**, **2 vCores**, **5 GB**, **7 days**, **Geographically Redundant** |Enter the compute, storage, and backup configurations for your new server. Select **Configure server**. Next, select the appropriate pricing tier. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/mysql/). To enable your server backups in geo-redundant storage, select **Geographically Redundant** from the **Backup Redundancy Options**. Select **OK**.
   Server admin user name | **myadmin** | Enter a user name for your server administrator. You can't use **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public** for the admin user name.
   Password | A secure password | Provide a new password for the server admin account. The password must be between 8 and 128 characters long and have a combination of uppercase or lowercase letters, numbers, and non-alphanumeric characters (!, $, #, %, and so on).
   Confirm password | The password entered earlier| Confirm the admin account password.


   > [!NOTE]
   > Consider using the Basic pricing tier if light compute and I/O are adequate for your workload. Note that servers created in the Basic pricing tier can't later be scaled to General Purpose or Memory Optimized. 

4. Select **Review + create** to provision the server. Provisioning can take up to 20 minutes.
   
5. Select **Notifications** on the toolbar (the bell button) to monitor the deployment process.
   
By default, the following databases are created under your server: information_schema, mysql, performance_schema, and sys.

## Configure a server-level firewall rule
By default, the new server is protected with a firewall and isn't accessible publicly. To provide access to your IP, complete these steps: 
1. Go to your server resource in the Azure portal and select **Connection security** from left pane for your server resource. 
  
   If you don't know how to find your resource, see [How to open a resource](../azure-resource-manager/management/manage-resources-portal.md#open-resources).

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/add-current-ip-firewall.png" alt-text="Screenshot that shows the Connection security > Firewall rules page.":::
   
1. Select **Add current client IP address** and then select **Save**. 
   
   You can add more IPs or provide an IP range to connect to your server from those IPs. For more information, see [How to manage firewall rules on an Azure Database for MySQL server](./concepts-firewall-rules.md).

> [!NOTE]
> To avoid connectivity issues, check if your network allows outbound traffic over port 3306, which is used by Azure Database for MySQL.  

## Connect to an Azure Database for MySQL server by using mysql.exe
You can use either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. In this quickstart, we'll use mysql.exe in [Azure Cloud Shell](../cloud-shell/overview.md) to connect to the server.

1. Open Azure Cloud Shell in the portal by selecting the first button on the toolbar, as shown in the following screenshot. Note the server name, server admin user name, and subscription for your new server in the **Overview** section, as shown in the screenshot.

    >[!NOTE]
    >If you're opening Cloud Shell for the first time, you'll be prompted to create a resource group and storage account. This is a one-time step. It will be automatically attached for all sessions. 

   >[!div class="mx-imgBorder"]
   > :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-portal/use-in-cloud-shell.png" alt-text="Screenshot that shows Cloud Shell in the Azure portal.":::
2. Run the following command in the Azure Cloud Shell terminal. Replace the values shown here with your actual server name and admin user name. For Azure Database for MySQL, you need to add `@\<servername>` to the admin user name, as shown here:  

     ```azurecli-interactive
     mysql --host=mydemoserver.mysql.database.azure.com --user=myadmin@mydemoserver -p 
     ```

     Here's what it looks like in the Cloud Shell terminal:
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
3. In the same Azure Cloud Shell terminal, create a database named `guest`: 
     ```
     mysql> CREATE DATABASE guest;
     Query OK, 1 row affected (0.27 sec)
     ```
4. Switch to the `guest` database:
     ```
     mysql> USE guest;
     Database changed 
     ```
5. Enter `quit`, and then select **Enter** to quit mysql.   

## Clean up resources
You have now created an Azure Database for MySQL server in a resource group.  If you don't expect to need these resources in the future, you can delete them by deleting the resource group, or you can just delete the MySQL server. To delete the resource group, take these steps:
1. In the Azure portal, search for and select **Resource groups**. 
2. In the list of resource groups, select the name of your resource group.
3. On the **Overview** page for your resource group, select **Delete resource group**.
4. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

To delete the server, you can select **Delete** on the **Overview** page for your server, as shown here:
> [!div class="mx-imgBorder"]
> :::image type="content" source="media/quickstart-create-mysql-server-database-using-azure-portal/delete-server.png" alt-text="Screenshot that shows the Delete button on the server overview page.":::

## Next steps
> [!div class="nextstepaction"]
>[Build a PHP app on Windows with MySQL](../app-service/tutorial-php-mysql-app.md)
