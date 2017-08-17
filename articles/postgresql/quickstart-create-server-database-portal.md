---
title: 'Azure portal: Create an Azure Database for PostgreSQL | Microsoft Docs'
description: Quick start guide to create and manage Azure Database for PostgreSQL server using Azure portal user interface.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.topic: hero-article
ms.date: 08/10/2017
---

# Create an Azure Database for PostgreSQL in the Azure portal

Azure Database for PostgreSQL is a managed service that enables you to run, manage, and scale highly available PostgreSQL databases in the cloud. This quickstart shows you how to create an Azure Database for PostgreSQL server using the Azure portal in about five minutes.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for PostgreSQL

An Azure Database for PostgreSQL server is created with a defined set of [compute and storage resources](./concepts-compute-unit-and-storage.md). The server is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

Follow these steps to create an Azure Database for PostgreSQL server:
1.	Click the **New** button (+) found on the upper left-hand corner of the Azure portal.
2.	Select **Databases** from the **New** page, and select **Azure Database for PostgreSQL** from the **Databases** page.
 ![Azure Database for PostgreSQL - Create the database](./media/quickstart-create-database-portal/1-create-database.png)

3.	Fill out the new server details form with the following information, as shown on the preceding image:

    Setting|Suggested value|Description
    ---|---|---
    Server name |*mypgserver-20170401*|Choose a unique name that identifies your Azure Database for PostgreSQL server. The domain name *postgres.database.azure.com* is appended to the server name you provide for applications to connect to. The server name can contain only lowercase letters, numbers, and the hyphen (-) character, and it must contain from 3 through 63 characters.
    Subscription|*Your subscription*|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
    Resource Group|*myresourcegroup*| You may make a new resource group name, or use an existing one from your subscription.
    Server admin login |*mylogin*| Make your own login account to use when connecting to the server. The admin login name cannot be 'azure_superuser', 'azure_pg_admin', 'admin', 'administrator', 'root', 'guest', or 'public', and cannot start with 'pg_'.
    Password |*Your choice* | Create a new password for the server admin account. Must contain from 8 to 128 characters. Your password must contain characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, etc.).
    Location|*The region closest to your users*| Choose the location that's closest to your users.
    PostgreSQL Version|*Choose the latest version*| Choose the latest version unless you have specific requirements.
    Pricing Tier | **Basic**, **50 Compute Units** **50 GB** | Click **Pricing tier** to specify the service tier and performance level for your new database. Choose Basic tier in the tab at the top. Click the left end of the Compute Units slider to adjust the value to the least amount available for this quickstart. Click **Ok** to save the pricing tier selection. See the following screenshot.
    | Pin to dashboard | Check | Check the **Pin to dashboard** option to allow easy tracking of your server on the front dashboard page of your Azure portal.

  > [!IMPORTANT]
  > The server admin login and password that you specify here are required to log in to the server and its databases later in this quick start. Remember or record this information for later use.

    ![Azure Database for PostgreSQL - pick the pricing tier](./media/quickstart-create-database-portal/2-service-tier.png)

4.	Click **Create** to provision the server. Provisioning takes a few minutes, up to 20 minutes maximum.

5.	On the toolbar, click **Notifications** to monitor the deployment process.
 ![Azure Database for PostgreSQL - See notifications](./media/quickstart-create-database-portal/3-notifications.png)
   
  By default, **postgres** database gets created under your server. The [postgres](https://www.postgresql.org/docs/9.6/static/app-initdb.html) database is a default database meant for use by users, utilities, and third-party applications. 

## Configure a server-level firewall rule

The Azure Database for PostgreSQL service creates a firewall at the server-level. This firewall prevents external applications and tools from connecting to the server and any databases on the server, unless a firewall rule is created to open the firewall for specific IP addresses. 

1.	Locate your server after the deployment completes. If needed, you can search for it. For example, click **All Resources** from the left-hand menu and type in the server name (such as the example *mypgserver-20170401*) to search for your newly created server. Click on your server name listed in the search result. The **Overview** page for your server opens and provides options for further configuration.
 
    ![Azure Database for PostgreSQL - Search for server name](./media/quickstart-create-database-portal/4-locate.png)

2.	On the server page, select **Connection security**. 
    ![Azure Database for PostgreSQL - Create Firewall rule](./media/quickstart-create-database-portal/5-firewall-2.png)

3.	Under the **Firewall rules** heading, click in the blank text box in the **Rule Name** column to begin creating the firewall rule. 

    For this quick start, let's allow all IP addresses into the server by filling in the text box in each column with the following values:

    Rule Name | Start IP | End IP 
    ---|---|---
    AllowAllIps |  0.0.0.0 | 255.255.255.255

4. On the upper toolbar of the Connection security page, click **Save**. Wait for a few moments and notice the notification showing that updating connection security has finished successfully before continuing.

    > [!NOTE]
    > Connections to your Azure Database for PostgreSQL server communicate over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you will not be able to connect to your server unless your IT department opens port 5432.
    >

## Get the connection information

When we created our Azure Database for PostgreSQL server, a default database named **postgres** gets created. To connect to your database server, you need to remember the full server name and admin login credentials. You may have noted those values earlier in the quick start article. In case you did not, you can easily find the server name and login information from the server Overview page in the Azure portal.

1. Open your server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
    Hover your cursor over each field, and the copy icon appears to the right of the text. Click the copy icon as needed to copy the values.

 ![Azure Database for PostgreSQL - Server Admin Login](./media/quickstart-create-database-portal/6-server-name.png)

## Connect to PostgreSQL database using psql in Cloud Shell

There are a number of applications you can use to connect to your Azure Database for PostgreSQL server. Let's first use the psql command-line utility to illustrate how to connect to the server.  You can use a web browser and the Azure Cloud Shell as described here without the need to install any additional software. If you have the psql utility installed locally on your own machine, you can connect from there as well.

1. Launch the Azure Cloud Shell via the terminal icon on the top navigation pane.

   ![Azure Database for PostgreSQL - Azure Cloud Shell terminal icon](./media/quickstart-create-database-portal/7-cloud-console.png)

2. The Azure Cloud Shell opens in your browser, enabling you to type bash shell commands.

   ![Azure Database for PostgreSQL - Azure Shell Bash Prompt](./media/quickstart-create-database-portal/8-bash.png)

3. At the Cloud Shell prompt, connect to a database in your Azure Database for PostgreSQL server by typing the psql command line at the green prompt.

    The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:
    ```bash
    psql --host=<yourserver> --port=<port> --username=<server admin login> --dbname=<database name>
    ```

    For example, the following command connects to an example server:

    ```bash
    psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --dbname=postgres
    ```

    psql parameter |Suggested value|Description
    ---|---|---
    --host | *server name* | Specify the server name value that was used when you created the Azure Database for PostgreSQL earlier. Our example server shown is mypgserver-20170401.postgres.database.azure.com. Use the fully qualified domain name (\*.postgres.database.azure.com) as shown in the example. Follow the steps in the previous section to get the connection information if you do not remember your server name. 
    --port | **5432** | Always use port 5432 when connecting to Azure Database for PostgreSQL. 
    --username | *server admin login name* |Type in the  server admin login username supplied when you created the Azure Database for PostgreSQL earlier. Follow the steps in the previous section to get the connection information if you do not remember the username.  The format is *username@servername*.
    --dbname | **postgres** | Use the default system generated database name *postgres* for the first connection. Later you create your own database.

    After running the psql command, with your own parameter values, you are prompted to type the server admin password. This password is the same that you provided when you created the server. 

    psql parameter |Suggested value|Description
    ---|---|---
    password | *your admin password* | Note, the typed password characters are not shown on the bash prompt. Press enter after you have typed all the characters to authenticate and connect.

    Once connected, the psql utility displays a postgres prompt where you type sql commands. In the initial connection output, a warning may be displayed since the psql in the Azure Cloud Shell may be a different  version than the Azure Database for PostgreSQL server version. 
    
    Example psql output:
    ```bash
    psql (9.5.7, server 9.6.2)
    WARNING: psql major version 9.5, server major version 9.6.
        Some psql features might not work.
    SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-SHA384, bits: 256, compression: off)
    Type "help" for help.
   
    postgres=> 
    ```

    > [!TIP]
    > If the firewall is not configured to allow the IP address of the Azure Cloud Shell, the following error occurs:
    > 
    > "psql: FATAL:  no pg_hba.conf entry for host "138.91.195.82", user "mylogin", database "postgres", SSL on FATAL:  SSL connection is required. Please specify SSL options and retry.
    > 
    > To resolve the error, make sure the server configuration matches the steps in the *Configure a server-level firewall rule* section of the article.

4.  Create a blank database at the prompt by typing the following command:
    ```bash
    CREATE DATABASE mypgsqldb;
    ```
    The command may take a few moments to complete. 

5.  At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**.
    ```bash
    \c mypgsqldb
    ```

6.  Type \q and then press ENTER to quit psql. You can close the Azure Cloud Shell after you are done.

Now you have connected to the Azure Database for PostgreSQL and created a blank user database. Continue to the next section to connect using another common tool, pgAdmin.

## Connect to PostgreSQL database using pgAdmin

To connect to Azure PostgreSQL server using the GUI tool _pgAdmin_
1.	Launch the _pgAdmin_ application on your client computer. You can install _pgAdmin_ from http://www.pgadmin.org/.
2.	Click the **Add New Server** icon from the **Quick Links** section in the center of the Dashboard page.
3.	In the **Create - Server** dialog box **General** tab, enter a unique friendly Name for the server, such as **Azure PostgreSQL Server**.
![pgAdmin tool - create - server](./media/quickstart-create-database-portal/9-pgadmin-create-server.png)
4.	In the **Create - Server** dialog box, **Connection** tab, use the settings as specified and click **Save**.
   ![pgAdmin - Create - Server](./media/quickstart-create-database-portal/10-pgadmin-create-server.png)

    pgAdmin parameter |Suggested value|Description
    ---|---|---
    Host Name/Address | *server name* | Specify the server name value that was used when you created the Azure Database for PostgreSQL earlier. Our example server shown is mypgserver-20170401.postgres.database.azure.com. Use the fully qualified domain name (\*.postgres.database.azure.com) as shown in the example. Follow the steps in the previous section to get the connection information if you do not remember your server name. 
    Port | **5432** | Always use port 5432 when connecting to Azure Database for PostgreSQL.  
    Maintenance Database | **postgres** | Use the default system generated database name *postgres*.
    User Name | *server admin login name* | Type in the server admin login username supplied when you created the Azure Database for PostgreSQL earlier. Follow the steps in the previous section to get the connection information if you do not remember the username. The format is *username@servername*.
    Password | *your admin password* |  The password you chose when you created the server earlier in this quickstart.
    Role | *leave blank* | No need to provide a role name at this point. Leave the field blank.
    SSL Mode | Require | By default, all Azure PostgreSQL servers are created with SSL enforcing turned ON. To turn OFF SSL enforcing, see details in [Enforcing SSL](./concepts-ssl-connection-security.md).
    
5.	Click **Save**.
6.	In the Browser left pane, expand the **Servers** node. Choose your server, for example **Azure PostgreSQL Server** and click to connect to it.
7. Expand the server node, and then expand **Databases** under it. The list should include your existing *postgres* database, and any newly created user database, such as *mypgsqldb*, that we created in the previous section. Notice that you may create multiple databases per server with Azure Database for PostgreSQL.
8. Right-click on **Databases**, choose the **Create** menu, and click **Database**.
9.	Type a database name of your choice in the **Database** field, such as *mypgsqldb* shown in the example. 
10. Select the **Owner** for the database from the drop-down box. Choose your server admin login name, such as our example *mylogin*.
10. Click **Save** to create a new blank database.
11. In the **Browser** pane, see the database you created in the list of Databases under your server name.
 ![pgAdmin - Create - Database](./media/quickstart-create-database-portal/11-pgadmin-database.png)


## Clean up resources
Clean up the resources you created in the quickstart either by deleting the [Azure resource group](../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group, or by deleting the one server resource if you want to keep the other resources intact.

> [!TIP]
> Other quickstarts in this collection build upon this quick start. If you plan to continue on to work with subsequent quickstarts, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete resources created by this quickstart in the Azure portal.

To delete the entire resource group including the newly created server:
1.	Locate your resource group in the Azure portal. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of your resource group, such as our example **myresourcegroup**.
2.	On your resource group page, click **Delete**. Then type the name of your resource group, such as our example **myresourcegroup**, in the text box to confirm deletion, and then click **Delete**.

Or instead, to delete the newly created server:
1.	Locate your server in the Azure portal, if you do not have it open. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you created.
2.	On the **Overview** page, click the **Delete** button on the top pane.
![Azure Database for PostgreSQL - Delete server](./media/quickstart-create-database-portal/12-delete.png)
3.	Confirm the server name you want to delete, and show the databases under it that are affected. Type your server name in the text box, such as our example **mypgserver-20170401**, and then click **Delete**.

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
