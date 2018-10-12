---
title: 'Quickstart: Create an Azure Database for MariaDB server - Azure portal'
description: This article steps you through using the Azure portal to quickly create a sample Azure Database for MariaDB server in about five minutes. 
author: ajlam
ms.author: andrela
editor: jasonwhowell
services: mariadb
ms.service: mariadb
ms.custom: mvc
ms.topic: quickstart
ms.date: 09/24/2018
---

# Create an Azure Database for MariaDB server by using the Azure portal

Azure Database for MariaDB is a managed service that you use to run, manage, and scale highly available MariaDB databases in the cloud. This quickstart shows you how to create an Azure Database for MariaDB server in about five minutes by using the Azure portal.  

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal

In your web browser, go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MariaDB server

You create an Azure Database for MariaDB server with a defined set of compute and storage resources <!-- [compute and storage resources](./concepts-compute-unit-and-storage.md)-->. You create the server in an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

To create an Azure Database for MariaDB server:

1. Select the **Create a resource** button (+) in the upper-left corner of the portal.

2. In the search box, enter **Azure Database for MariaDB** to find the service.

   ![Azure Database for MariaDB option](./media/quickstart-create-mariadb-server-database-using-azure-portal/2_navigate-to-mariadb.png)

3. Enter or select the following server details:
   
   ![Create server form](./media/quickstart-create-mariadb-server-database-using-azure-portal/4-create-form.png)

    Setting | Suggested value | Description
    ---|---|---
    Server name | *a unique server name* | Choose a unique name that identifies your Azure Database for MariaDB server. For example, **mydemoserver**. The domain name *.mariadb.database.azure.com* is appended to the server name you enter. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain between 3 and 63 characters.
    Subscription | *your subscription* | Select the Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you are billed for the resource.
    Resource group | *myresourcegroup* | Enter a new or existing resource group name. 
    Select source | **Blank** | Select **Blank** to create a new server from scratch. (Select **Backup** if you are creating a server from a geo-backup of an existing Azure Database for MariaDB server.)
    Server admin login | *myadmin* | A sign-in account to use when you're connecting to the server. The admin sign-in name cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.
    Password | *your choice* | Provide a new password for the server admin account. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, and so on).
    Confirm password | *your choice*| Confirm the admin account password.
    Location | *the region closest to your users*| Choose the location that is closest to your users or to your other Azure applications.
    Version | *the latest version*| The latest version (unless you have specific requirements to use a different version).
    Pricing tier | See description. | The compute, storage, and backup configurations for your new server. Select **Pricing tier** > **General Purpose**. Keep the default values for the following settings:<br><ul><li>**Compute Generation** (Gen 5)</li><li>**vCore** (2 vCores)</li><li>**Storage** (5 GB)</li><li>**Backup Retention Period** (7 days)</li></ul><br>To enable your server backups in geo-redundant storage, for **Backup Redundancy Options**, select **Geographically Redundant**. <br><br>To save this pricing tier selection, select **OK**. The next screenshot captures these selections.
  
    > [!IMPORTANT]
    > The server admin sign-in and password that you specify here are required to sign in to the server and its databases later in this quickstart. Remember or record this information for later use.
    > 

   ![Create server - pricing tier window](./media/quickstart-create-mariadb-server-database-using-azure-portal/3-pricing-tier.png)

4.	Select **Create** to provision the server. Provisioning can take up to 20 minutes.
   
5.	Select **Notifications** on the toolbar (the bell icon) to monitor the deployment process.
   
  By default, the following databases are created under your server: **information_schema**, **mysql**, **performance_schema**, and **sys**.


## <a name="configure-firewall-rule"></a>Configure a server-level firewall rule

The Azure Database for MariaDB service creates a firewall at the server level. It prevents external applications and tools from connecting to the server or to any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. To create a server-level firewall rule:

1.	 After the deployment finishes, locate your server. If necessary, you can search for it. For example, select **All Resources** from the menu on the left. Then, enter the server name. For example, enter **mydemoserver** to search for your newly created server. Select the server name from the search result list. The **Overview** page for your server opens and provides options for further configuration.

2. On the server page, select **Connection security**.

3.	Under the **Firewall rules** heading, select the blank text box in the **Rule Name** column to begin creating the firewall rule. Specify the precise IP range of the clients that will connect to this server.
   
   ![Connection security - Firewall rules](./media/quickstart-create-mariadb-server-database-using-azure-portal/5-firewall-2.png)

4. On the upper toolbar of the **Connection security** page, select **Save**. Before you continue, wait until you see the notification that says the update has finished successfully. 

   > [!NOTE]
   > Connections to Azure Database for MariaDB communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. If this is the case, you can't connect to your server unless your IT department opens port 3306.
   > 

## Get the connection information

To connect to your database server, you need the full server name and admin sign-in credentials. You might have noted those values earlier in the quickstart article. If you didn't, you can easily find the server name and sign-in information on the server **Overview** page or on the **Properties** page in the Azure portal:

1. Go to your server's **Overview** page. Make a note of the values for **Server name** and **Server admin login name**. 

2. Place your cursor over the field you want to copy. The copy icon appears to the right of the text. Select the copy icon as needed to copy the values.

In this example, the server name is **mydemoserver.mariadb.database.azure.com** and the server admin sign-in is **myadmin@mydemoserver**.

## Connect to MariaDB by using the mysql command line

You can use a variety of applications to connect to your Azure Database for MariaDB server.

Let's first use the [mysql](https://dev.mysql.com/doc/refman/5.7/en/mysql.html) command-line tool to illustrate how to connect to the server. You can also use a web browser and Azure Cloud Shell as described here without installing additional software. If you have the mysql utility installed locally, you also can connect from there.

1. Start Azure Cloud Shell via the terminal icon (**>_**) on the upper right of the Azure portal.
![Azure Cloud Shell terminal symbol](./media/quickstart-create-mariadb-server-database-using-azure-portal/7-cloud-console.png)

2.  Azure Cloud Shell opens in your browser, where you can type bash shell commands.

   ![Command prompt--mysql command-line example](./media/quickstart-create-mariadb-server-database-using-azure-portal/8-bash.png)

3. At the Cloud Shell prompt, connect to your Azure Database for MariaDB server by typing the mysql command line.

    To connect to an Azure Database for MariaDB server with the mysql utility, use the following format:

    ```bash
    mysql --host <fully qualified server name> --user <server admin login name>@<server name> -p
    ```

    For example, the following command connects to our example server:

    ```azurecli-interactive
    mysql --host mydemoserver.mariadb.database.azure.com --user myadmin@mydemoserver -p
    ```

    mysql parameter |Suggested value|Description
    ---|---|---
    --host | *server name* | The server name value that you used to create the Azure Database for MariaDB server. Our example server is **mydemoserver.mariadb.database.azure.com**. Use the fully qualified domain name (**\*.mariadb.database.azure.com**) as shown in the example. If you don't remember your server name, complete the steps in the preceding section to get the connection information.
    --user | *server admin login name* |The server admin login user name that you used to create the Azure Database for MariaDB server. If you don't remember the user name, complete the steps in the preceding section to get the connection information. The format is *username@servername*.
    -p | *wait until prompted* |When prompted, enter the password that you used to create the server. The typed password characters are not shown on the bash prompt when you type them. After you've entered the password, press Enter.

   After it's connected, the mysql utility displays a **mysql>** prompt at which you can type commands. 

   Following is example mysql output:

    ```bash
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 65505
    Server version: 5.6.39.0 MariaDB Server
    
    Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    mysql>
    ```
    
    > [!TIP]
    > If the firewall isn't configured to allow the IP address of Azure Cloud Shell, the following error occurs:
    >
    > ERROR 2003 (28000): Client with IP address 123.456.789.0 is not allowed to access the server.
    >
    > To resolve the error, make sure that the server configuration matches the steps in [Configure a server-level firewall rule](#configure-firewall-rule).

4. To verify the connection, check the server status by entering **status** at the **mysql>** prompt.

    ```sql
    status
    ```

   > [!TIP]
   > For additional commands, see [MySQL 5.7 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.7/en/mysql.html).

5.  Create a blank database at the **mysql>** prompt by entering the following command:

    ```sql
    CREATE DATABASE quickstartdb;
    ```
    The command might take a few moments to complete. 

    You can create one or more databases in an Azure Database for MariaDB server. You can choose to create a single database per server to utilize all resources, or you can create multiple databases to share the resources. There's no limit on the number of databases that you can create, but multiple databases share the same server resources. 

6. To list the databases, at the **mysql>** prompt, enter the following command:

    ```sql
    SHOW DATABASES;
    ```

7.  Type **\q**, and then press the Enter key to close the mysql tool. Then, you can close Azure Cloud Shell.

Now you have connected to the Azure Database for MariaDB server and created a blank user database. In the next exercise, section you connect to the same server by using another common tool, MySQL Workbench.

## Connect to server by using MySQL Workbench

To connect to the server by using MySQL Workbench:

1. Open the MySQL Workbench application on your client computer. You can download and install MySQL Workbench from [Download MySQL Workbench](https://dev.mysql.com/downloads/workbench/).

2. Create a new connection. Select the plus (+) icon beside the **MySQL Connections** heading.

3. In the **Setup New Connection** dialog box, on the **Parameters** tab, enter your server connection information. Placeholder values are shown as an example. Replace the **Hostname**, **Username**, and **Password** with your own values.

   ![Set up new connection](./media/quickstart-create-mariadb-server-database-using-azure-portal/setup-new-connection.png)

    |Setting |Suggested value|Field description|
    |---|---|---|
     Connection name | Demo connection | A label for this connection. |
    Connection method | Standard (TCP/IP) | Standard (TCP/IP) is sufficient. |
    Hostname | *Server name* | The server name value that you used when you created the Azure Database for MariaDB server earlier. Our example server is **mydemoserver.mariadb.database.azure.com**. Use the fully qualified domain name (**\*.mariadb.database.azure.com**) as shown in the example. If you don't remember your server name, follow the steps in the previous section to get the connection information.|
     Port | 3306 | The port to use when connecting to your Azure Database for MariaDB server. |
    Username |  *Server admin login name* | The server admin sign-in information that you supplied when you created the Azure Database for MariaDB server earlier. Our example username is **myadmin@mydemoserver**. If you don't remember the username, follow the steps in the previous section to get the connection information. The format is *username@servername*.
    Password | *Your password* | Select the **Store in Vault...** button to save the password. |

4. Select **Test Connection** to test whether all parameters are  configured correctly. Then, select **OK** to save the connection. 

    > [!NOTE]
    > SSL is enforced by default on your server and requires extra configuration  to connect successfully. <!--For more information, see [Configure SSL connectivity in your application to securely connect to Azure Database for MariaDB](./howto-configure-ssl.md).--> To disable SSL for this Quickstart, go to the Azure portal. Then select the Connection security page to disable the **Enforce SSL** connection toggle button.

## Clean up resources

You can clean up the resources that you created in the Quickstart in two ways. You can delete the [Azure resource group](../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the one server resource.

> [!TIP]
> Other Quickstarts in this collection build on this Quickstart. If you plan to continue working with Quickstarts, don't clean up the resources that you created in this Quickstart. If you don't plan to continue, use the following steps to delete all the resources that you created with this Quickstart.
>

To delete the entire resource group including the newly created server, take the following steps:

1.	Locate your resource group in the Azure portal. On the menu on the left, select **Resource groups**, and then select the name of your resource group (such as our example, **myresourcegroup**).

2.	On your resource group page, select **Delete**. Then type the name of your resource group (such as our example **myresourcegroup**) in the box to confirm deletion, and select **Delete**.

To delete only the newly created server, take the following steps:

1.	Locate your server in the Azure portal if you don't already have it open. From the menu on the left in the Azure portal, select **All resources**. Then search for the server you created.

2.	On the **Overview** page, select **Delete**. 

   ![Azure Database for MariaDB--Delete server](./media/quickstart-create-mariadb-server-database-using-azure-portal/delete-server.png)

3.	Confirm the name of the server that you want to delete, and show the databases under it that are affected. Type your server name in the box (such as our example **mydemoserver**). Select **Delete**.

## Next steps

- [Design your first Azure Database for MariaDB database](./tutorial-design-database-using-portal.md)
