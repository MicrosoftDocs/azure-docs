---
title: 'Quickstart: Create Azure Database for MySQL server - Azure portal | Microsoft Docs'
description: This article steps you through using the Azure portal to quickly create a sample Azure Database for MySQL server in about five minutes. 
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.custom: mvc
ms.topic: hero-article
ms.date: 08/15/2017
---

# Create an Azure Database for MySQL server using Azure portal
Azure Database for MySQL is a managed service that enables you to run, manage, and scale highly available MySQL databases in the cloud. This Quickstart shows you how to create an Azure Database for MySQL server using the Azure portal in about five minutes. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create Azure Database for MySQL server
An Azure Database for MySQL server is created with a defined set of [compute and storage resources](./concepts-compute-unit-and-storage.md). The server is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

Follow these steps to create an Azure Database for MySQL server:

1. Click the **New** button (+) found on the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Azure Database for MySQL** from the **Databases** page. You can also type **MySQL** in the New page search box to find the service.
![Azure portal - new - database - MySQL](./media/quickstart-create-mysql-server-database-using-azure-portal/2_navigate-to-mysql.png)

3. Fill out the new server details form with the following information, as shown on the preceding image:

    **Setting** | **Suggested value** | **Field Description** 
    ---|---|---
    Server name | myserver4demo | Choose a unique name that identifies your Azure Database for MySQL server. The domain name *mysql.database.azure.com* is appended to the server name you provide for applications to connect to. The server name can contain only lowercase letters, numbers, and the hyphen (-) character, and it must contain from 3 through 63 characters.
    Subscription | Your subscription | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
    Resource group | myresourcegroup | You may make a new resource group name, or use an existing one from your subscription.
    Server admin login | myadmin | Make your own login account to use when connecting to the server. The admin login name cannot be 'azure_superuser', 'admin', 'administrator', 'root', 'guest', or 'public'.
    Password | *Your choice* | Create a new password for the server admin account. Must contain from 8 to 128 characters. Your password must contain characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, etc.).
    Confirm password | *Your choice*| Confirm the admin account password.
    Location | *The region closest to your users*| Choose the location that is closest to your users or other Azure applications.
    Version | *Choose the latest version*| Choose the latest version unless you have specific requirements.
    Pricing Tier | **Basic**, **50 Compute Units** **50 GB** | Click **Pricing tier** to specify the service tier and performance level for your new database. Choose **Basic tier** in the tab at the top. Click the left end of the **Compute Units** slider to adjust the value to the least amount available for this Quickstart. Click **Ok** to save the pricing tier selection. See the following screenshot.
    Pin to dashboard | Check | Check the **Pin to dashboard** option to allow easy tracking of your server on the front dashboard page of your Azure portal.

    > [!IMPORTANT]
    > The server admin login and password that you specify here are required to log in to the server and its databases later in this Quickstart. Remember or record this information for later use.
    > 

    ![Azure portal - create MySQL by providing the required form input](./media/quickstart-create-mysql-server-database-using-azure-portal/3_create-server.png)

4.	Click **Create** to provision the server. Provisioning takes a few minutes, up to 20 minutes maximum.
   
5.	On the toolbar, click **Notifications** (bell icon) to monitor the deployment process.

## Configure a server-level firewall rule

The Azure Database for MySQL service creates a firewall at the server-level. This firewall prevents external applications and tools from connecting to the server and any databases on the server, unless a firewall rule is created to open the firewall for specific IP addresses. 

1.	Locate your server after the deployment completes. If needed, you can search for it. For example, click **All Resources** from the left-hand menu and type in the server name (such as the example *myserver4demo*) to search for your newly created server. Click on your server name listed in the search result. The **Overview** page for your server opens and provides options for further configuration.

2. In the server page, select **Connection security**.

3.	Under the **Firewall rules** heading, click in the blank text box in the **Rule Name** column to begin creating the firewall rule. 

    For this Quickstart, let's allow all IP addresses into the server by filling in the text box in each column with the following values:

    Rule Name | Start IP | End IP 
    ---|---|---
    AllowAllIps |  0.0.0.0 | 255.255.255.255

4. On the upper toolbar of the **Connection security** page, click **Save**. Wait for a few moments and notice the notification showing that updating connection security has finished successfully before continuing.

    > [!NOTE]
    > Connections to Azure Database for MySQL communicate over port 3306. If you are trying to connect from within a corporate network, outbound traffic over port 3306 may not be allowed by your network's firewall. If so, you will not be able to connect to your server unless your IT department opens port 3306.
    > 

## Get the connection information
To connect to your database server, you need to remember the full server name and admin login credentials. You may have noted those values earlier in the Quickstart article. In case you did not, you can easily find the server name and login information from the server **Overview** page or the **Properties** page in the Azure portal.

1. Open your server's **Overview** page. Make a note of the **Server name** and **Server admin login name**. 
    Hover your cursor over each field, and the copy icon appears to the right of the text. Click the copy icon as needed to copy the values.

    In this example, the server name is *myserver4demo.mysql.database.azure.com*, and the server admin login is *myadmin@myserver4demo*.

## Connect to MySQL using mysql command-line tool
There are a number of applications you can use to connect to your Azure Database for MySQL server. Let's first use the [mysql](https://dev.mysql.com/doc/refman/5.7/en/mysql.html) command-line tool to illustrate how to connect to the server.  You can use a web browser and the Azure Cloud Shell as described here without the need to install any additional software. If you have the mysql utility installed locally on your own machine, you can connect from there as well.

1. Launch the Azure Cloud Shell via the terminal icon ( >_ ) on the top right of the Azure portal web page.

2. The Azure Cloud Shell opens in your browser, enabling you to type bash shell commands.

    ![Command prompt - mysql command-line example](./media/quickstart-create-mysql-server-database-using-azure-portal/7_connect-to-server.png)

3. At the Cloud Shell prompt, connect to your Azure Database for MySQL server by typing the mysql command line at the green prompt.

    The following format is used to connect to an Azure Database for MySQL server with the mysql utility:
    ```bash
    mysql --host <yourserver> --user <server admin login> --password
    ```

    For example, the following command connects to our example server:
    ```azurecli-interactive
    mysql --host myserver4demo.mysql.database.azure.com --user myadmin@myserver4demo --password
    ```

    mysql parameter |Suggested value|Description
    ---|---|---
    --host | *server name* | Specify the server name value that was used when you created the Azure Database for MySQL earlier. Our example server shown is myserver4demo.mysql.database.azure.com. Use the fully qualified domain name (\*.mysql.database.azure.com) as shown in the example. Follow the steps in the previous section to get the connection information if you do not remember your server name. 
    --user | *server admin login name* |Type in the  server admin login username supplied when you created the Azure Database for MySQL earlier. Follow the steps in the previous section to get the connection information if you do not remember the username.  The format is *username@servername*.
    --password | *wait until prompted* | You will be prompted to "Enter password" after you enter the command. When prompted, type in the same password that you provided when you created the server.  Note the typed password characters are not shown on the bash prompt when you type them. Press enter after you have typed all the characters to authenticate and connect.

   Once connected, the mysql utility displays a `mysql>` prompt for you to type commands. 

    Example mysql output:
    ```bash
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 65505
    Server version: 5.6.26.0 MySQL Community Server (GPL)
    
    Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    mysql>
    ```
    > [!TIP]
    > If the firewall is not configured to allow the IP address of the Azure Cloud Shell, the following error occurs:
    >
    > ERROR 2003 (28000): Client with IP address 123.456.789.0 is not allowed to access the server.
    >
    > To resolve the error, make sure the server configuration matches the steps in the *Configure a server-level firewall rule* section of the article.

4. View server status to ensure the connection is functional. Type `status` at the mysql> prompt once it is connected.
    ```sql
    status
    ```

   > [!TIP]
   > For additional commands, see [MySQL 5.7 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.7/en/mysql.html).

5.  Create a blank database at the mysql> prompt by typing the following command:
    ```sql
    CREATE DATABASE quickstartdb;
    ```
    The command may take a few moments to complete. 

    Within an Azure Database for MySQL server, you can create one or multiple databases. You can opt to create a single database per server to utilize all the resources, or create multiple databases to share the resources. There is no limit to the number of databases that can be created, but multiple databases share the same server resources. 

6. List the databases at the mysql> prompt by typing the following command:

    ```sql
    SHOW DATABASES;
    ```

7.  Type `\q` and then press ENTER to quit the mysql tool. You can close the Azure Cloud Shell after you are done.

Now you have connected to the Azure Database for MySQL and created a blank user database. Continue to the next section to repeat a similar exercise to connect to the same server using another common tool, MySQL Workbench.

## Connect to the server using the MySQL Workbench GUI tool
To connect to Azure MySQL server using the GUI tool MySQL Workbench:

1.	Launch the MySQL Workbench application on your client computer. You can download and install MySQL Workbench from [here](https://dev.mysql.com/downloads/workbench/).

2.	In **Setup New Connection** dialog box, enter the following information on **Parameters** tab:

    ![setup new connection](./media/quickstart-create-mysql-server-database-using-azure-portal/setup-new-connection.png)

    | **Setting** | **Suggested value** | **Field Description** |
    |---|---|---|
    |	Connection Name | Demo Connection | Specify a label for this connection. |
    | Connection Method | Standard (TCP/IP) | Standard (TCP/IP) is sufficient. |
    | Hostname | *server name* | Specify the server name value that was used when you created the Azure Database for MySQL earlier. Our example server shown is myserver4demo.mysql.database.azure.com. Use the fully qualified domain name (\*.mysql.database.azure.com) as shown in the example. Follow the steps in the previous section to get the connection information if you do not remember your server name.  |
    | Port | 3306 | Always use port 3306 when connecting to Azure Database for MySQL. |
    | Username |  *server admin login name* | Type in the server admin login username supplied when you created the Azure Database for MySQL earlier. Our example username is myadmin@myserver4demo. Follow the steps in the previous section to get the connection information if you do not remember the username. The format is *username@servername*.
    | Password | your password | Click Store in Vault... button to save the password. |

    Click **Test Connection** to test if all parameters are correctly configured. Click OK to save the connection. 

    > [!NOTE]
    > SSL is enforced by default on your server, and requires extra configuration in order to connect successfully. See [Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](./howto-configure-ssl.md).  If you want to disable SSL for this Quickstart, visit the Azure portal and click the Connection security page to disable the Enforce SSL connection toggle button.

## Clean up resources
Clean up the resources you created in the quickstart either by deleting the [Azure resource group](../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group, or by deleting the one server resource if you want to keep the other resources intact.

> [!TIP]
> Other Quickstarts in this collection build upon this Quickstart. If you plan to continue on to work with subsequent quickstarts, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart in the Azure portal.
>

To delete the entire resource group including the newly created server:
1.	Locate your resource group in the Azure portal. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of your resource group, such as our example **myresourcegroup**.
2.	On your resource group page, click **Delete**. Then type the name of your resource group, such as our example **myresourcegroup**, in the text box to confirm deletion, and then click **Delete**.

Or instead, to delete the newly created server:
1.	Locate your server in the Azure portal, if you do not have it open. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you created.
2.	On the **Overview** page, click the **Delete** button on the top pane.
![Azure Database for MySQL - Delete server](./media/quickstart-create-mysql-server-database-using-azure-portal/delete-server.png)
3.	Confirm the server name you want to delete, and show the databases under it that are affected. Type your server name in the text box, such as our example **myserver4demo**, and then click **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Design your first Azure Database for MySQL database](./tutorial-design-database-using-portal.md)

