---
title: 'Quickstart: Create server - Azure portal - Azure Database for PostgreSQL - Single Server'
description: Quickstart guide to creating and managing an Azure Database for PostgreSQL - Single Server by using the Azure portal user interface.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: mvc
ms.topic: quickstart
ms.date: 06/27/2020
---

# Quickstart: Create an Azure Database for PostgreSQL server in the Azure portal

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. This Quickstart shows you how to create an Azure Database for PostgreSQL server in about five minutes using the Azure portal.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for PostgreSQL server

An Azure Database for PostgreSQL server is created with a configured set of [compute and storage resources](./concepts-pricing-tiers.md). The server is created within an [Azure resource group](../azure-resource-manager/management/overview.md).

To create an Azure Database for PostgreSQL server, take the following steps:
1. Select **Create a resource** (+) in the upper-left corner of the portal.

2. Select **Databases** > **Azure Database for PostgreSQL**.

    ![The "Azure Database for PostgreSQL" in menu](./media/quickstart-create-database-portal/1-create-database.png)

3. Select the **Single server** deployment option.

   ![Select Azure Database for PostgreSQL - Single server deployment option](./media/quickstart-create-database-portal/select-deployment-option.png)

4. Fill out the **Basics** form with the following information:

    ![Create a server](./media/quickstart-create-database-portal/create-basics.png)

    Setting|Suggested Value|Description
    ---|---|---
    Subscription|Your subscription name|The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you're billed for the resource.
    Resource group|*myresourcegroup*| A new resource group name or an existing one from your subscription.
    Server name |*mydemoserver*|A unique name that identifies your Azure Database for PostgreSQL server. The domain name *postgres.database.azure.com* is appended to the server name you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain at least 3 through 63 characters.
    Data source | *None* | Select *None* to create a new server from scratch. (You would select *Backup* if you were creating a server from a geo-backup of an existing Azure Database for PostgreSQL server).
    Admin username |*myadmin*| Your own login account to use when you connect to the server. The admin login name can't be **azure_superuser**, **azure_pg_admin**, **admin**, **administrator**, **root**, **guest**, or **public**. It can't start with **pg_**.
    Password |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).
    Location|The region closest to your users| The location that is closest to your users.
    Version|The latest major version| The latest PostgreSQL major version, unless you have specific requirements otherwise.
    Compute + storage | **General Purpose**, **Gen 5**, **2 vCores**, **5 GB**, **7 days**, **Geographically Redundant** | The compute, storage, and backup configurations for your new server. Select **Configure server**. Next, select the **General Purpose** tab. *Gen 5*, *4 vCores*, *100 GB*, and *7 days* are the default values for **Compute Generation**, **vCore**, **Storage**, and **Backup Retention Period**. You can leave those sliders as is or adjust them. To enable your server backups in geo-redundant storage select **Geographically Redundant** from the **Backup Redundancy Options**. To save this pricing tier selection, select **OK**. The next screenshot captures these selections.

   > [!NOTE]
   > Consider using the Basic pricing tier if light compute and I/O are adequate for your workload. Note that servers created in the Basic pricing tier cannot later be scaled to General Purpose or Memory Optimized. See the [pricing page](https://azure.microsoft.com/pricing/details/postgresql/) for more information.
   
5. Select **Review + create** to review your selections. Select **Create** to provision the server. This operation may take a few minutes.

6. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this server on your Azure portal dashboard as a shortcut to the server's **Overview** page. Selecting **Go to resource** opens the server's **Overview** page.

By default, a **postgres** database is created under your server that you can use to connect to your server. You also have **azure_maintenance**  database that is used to separate the managed service processes from user actions and you cannot access this database.

## Configure a server-level firewall rule
By default the server created is not publicly accessible and you need to give permissions to your local machine IP. To give access to your IP , go to your server resource in the Azure portal and select **Connection security** from left side menu for your server resource.  If you are not sure how to find your resource , see [How to open a resource](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resources-portal#open-resources).

![Connection security - Firewall rules](./media/quickstart-create-database-portal/add-current-ip-firewall.png)
  
Now click on **Add current client IP address** and then click on **Save** . You can add additional IPs or provide an IP range to give access to your server. For more information, see [How to manage firewall rules on Azure Database for MySQL server](./concepts-firewall-rules.md)
   
    > [!IMPORTANT]
    > Check if you network allows outbound traffc over port 5432 that is used by Azure database for PostgreSQL to avoid connectivity issues.  

## Connect to your server using the psql client in Azure Cloud Shell
If you dont have any postgresql client installed , using [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview) in the portal is the easiest way to connect to your server .  
- Launch Azure Cloud Shell in the portal by clicking in this icon on the top left side. Make a note of your server name , server admin login name , password and subscription Id for your newly created server from the **Overview** section of your server as shown in the image below.
> Note: If you are launching cloud shell for the first time, you will see a prompt to create a resource group, storage account. This is a one-time step and will be automatically attached for all sessions. 


There are a number of applications you can use to connect to your Azure Database for PostgreSQL server. If your client computer has PostgreSQL installed, you can use a local instance of [psql](https://www.postgresql.org/docs/current/static/app-psql.html) to connect to an Azure PostgreSQL server. Let's now use the psql command-line utility to connect to the Azure PostgreSQL server.
- Azure cloud shell has **MySQL command-line tool** available to use to connect to your server and perform database operations , so you can run this command directly . Replace values with your actual server name and admin user login name . Admin username requires '@<servername> as shown below for Azure Database for MySQL  
    
 ```azurecli-interactive
   psql --host=<servername> --username=<user@servername> --dbname=postgres
   ```

  Here is how the experience looks like in the Cloud Shell terminal
```
Requesting a Cloud Shell.Succeeded.
Connecting terminal...

Welcome to Azure Cloud Shell

Type "az" to use Azure CLI
Type "help" to learn about Cloud Shell

user@Azure:~$psql --host=mydbserver.postgres.database.azure.com  --username=pgazadmin@mydbserver --dbname=postgres 
Enter password:
   psql (9.5.7, server 9.6.2)
   WARNING: psql major version 9.5, server major version 9.6.
    Some psql features might not work.
    SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-SHA384, bits: 256, compression: off)
   Type "help" for help.

   postgres=>
```
> **Manage your database from local machine**
>
>Ifcan connect with psql , if you have psql installed on your machine. You can also [Connect with pgAdmin](https://www.pgadmin.org/docs/pgadmin4/latest/connecting.html) if that is your tool of choice. 

- In the same Azure Cloud Shell terminal , create a database **myproject** 
```
mysql> CREATE DATABASE myproject;
Query OK, 1 row affected (0.27 sec)
```
- Now to switch connections to the newly created database **mypgsqldb**:
    ```bash
    \c mypgsqldb
    ```

- Type  `\q`, and then select the Enter key to quit psql. 

## Clean up resources
You can clean up the resources that you created in the Quickstart in one of two ways. You can delete the [Azure resource group](../azure-resource-manager/management/overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the server resource.

> [!TIP]
> Other Quickstarts in this collection build on this Quickstart. If you plan to continue working with Quickstarts, don't clean up the resources that you created in this Quickstart. If you don't plan to continue, follow these steps to delete the resources that were created by this Quickstart in the portal.

To delete the entire resource group, including the newly created server:
1. Locate your resource group in the portal. On the menu on the left, select **Resource groups**. Then select the name of your resource group, such as the example, **myresourcegroup**.

2. On your resource group page, select **Delete**. Enter the name of your resource group, such as the example, **myresourcegroup**, in the text box to confirm deletion. Select **Delete**.

To delete only the newly created server:
1. Locate your server in the portal, if you don't have it open. On the menu on the left, select **All resources**. Then search for the server you created.

2. On the **Overview** page, select **Delete**.

    ![The "Delete" button](./media/quickstart-create-database-portal/12-delete.png)

3. Confirm the name of the server you want to delete, and view the databases under it that are affected. Enter your server name in the text box, such as the example, **mydemoserver**. Select **Delete**.

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
