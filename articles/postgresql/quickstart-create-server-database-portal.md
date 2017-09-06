---
title: 'Azure portal: Create an Azure Database for PostgreSQL server | Microsoft Docs'
description: Quickstart guide to creating and managing an Azure Database for PostgreSQL server by using the Azure portal user interface.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.custom: mvc
ms.topic: quickstart
ms.date: 08/10/2017
---

# Create an Azure Database for PostgreSQL server in the Azure portal

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. This Quickstart shows you how to create an Azure Database for PostgreSQL server in about five minutes by using the Azure portal.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for PostgreSQL server

An Azure Database for PostgreSQL server is created with a defined set of [compute and storage resources](./concepts-compute-unit-and-storage.md). The server is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

To create an Azure Database for PostgreSQL server, take the following steps:
1. Select the **New** button (+) in the upper-left corner of the portal.

2. Select **Databases** > **Azure Database for PostgreSQL**.

    ![The "Azure Database for PostgreSQL" option](./media/quickstart-create-database-portal/1-create-database.png)

3. Fill out the new server details form with the following information, as shown in the preceding image:

    Setting|Suggested value|Description
    ---|---|---
    Server name |*mypgserver-20170401*|A unique name that identifies your Azure Database for PostgreSQL server. The domain name *postgres.database.azure.com* is appended to the server name you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain at least 3 through 63 characters.
    Subscription|Your subscription|The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you're billed for the resource.
    Resource group|*myresourcegroup*| A new resource group name or an existing one from your subscription.
    Server admin login |*mylogin*| Your own login account to use when you connect to the server. The admin login name can't be **azure_superuser,** **azure_pg_admin,** **admin,** **administrator,** **root,** **guest,** or **public.** It can't start with **pg_**.
    Password |Your choice | A new password for the server admin account. It must contain from 8 to 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and nonalphanumeric characters (!, $, #, %, etc.).
    Location|The region closest to your users| The location that's closest to your users.
    PostgreSQL version|The latest version| The latest version, unless you have specific requirements.
    Pricing tier | **Basic**, **50 Compute Units**, **50 GB** | The service tier and performance level for your new database. Select **Pricing tier**. Next, select the **Basic** tab. Then select the left end of the **Compute Units** slider to adjust the value to the least amount available for this Quickstart. To save the pricing tier selection, select **OK**. For more information, see the following screenshot. 
    Pin to dashboard | Check | Enables easy tracking of your server on the front dashboard page of your portal.

    > [!IMPORTANT]
    > The server admin login and password that you specify here are required to sign in to the server and its databases later in this Quickstart. Remember or record this information for later use.

    ![The "Pricing tier" pane](./media/quickstart-create-database-portal/2-service-tier.png)

4. Select **Create** to provision the server. Provisioning can take up to 20 minutes.

5. On the toolbar, select the **Notifications** symbol to monitor the deployment process.

    ![The "Notifications" pane](./media/quickstart-create-database-portal/3-notifications.png)
   
  By default, a **postgres** database is created under your server. The [postgres](https://www.postgresql.org/docs/9.6/static/app-initdb.html) database is a default database that's meant for use by users, utilities, and third-party applications. 

## Configure a server-level firewall rule

Azure Database for PostgreSQL creates a firewall at the server level. It prevents external applications and tools from connecting to the server and any databases on the server, unless you create a rule to open the firewall for specific IP addresses. 

1. After the deployment finishes, locate your server. If needed, you can search for it. For example, on the menu on the left, select **All resources**. Type your server name, such as the example, **mypgserver-20170401**, to search for your newly created server. Select your server name from the search result list. The **Overview** page for your server opens and provides options for further configuration.
 
    ![Server name search](./media/quickstart-create-database-portal/4-locate.png)

2. On the server page, select **Connection security**.

    ![The "Connection security" setting](./media/quickstart-create-database-portal/5-firewall-2.png)

3. Under the **Firewall rules** heading, in the **Rule Name** column, select the blank text box to begin creating the firewall rule. 

    For this Quickstart, let's allow all IP addresses into the server. Fill in the text box in each column with the following values:

    Rule name | Start IP | End IP 
    ---|---|---
    AllowAllIps | 0.0.0.0 | 255.255.255.255

4. On the upper toolbar of the **Connection security** page, select **Save**. Wait until the notification appears stating that the connection security update has finished successfully before you continue.

    > [!NOTE]
    > Connections to your Azure Database for PostgreSQL server communicate over port 5432. If you try to connect from within a corporate network, outbound traffic over port 5432 might not be allowed by your network's firewall. If so, you can't connect to your server unless your IT department opens port 5432.
    >

## Get the connection information

When you create your Azure Database for PostgreSQL server, a default database named **postgres** is created. To connect to your database server, you need your full server name and admin login credentials. You might have noted those values earlier in the Quickstart article. If you didn't, you can easily find the server name and login information on the server **Overview** page in the portal.

Open your server's **Overview** page. Make a note of the **Server name** and the **Server admin login name**. Hover your cursor over each field, and the copy symbol appears to the right of the text. Select the copy symbol as needed to copy the values.

 ![The server "Overview" page](./media/quickstart-create-database-portal/6-server-name.png)

## Connect to the PostgreSQL Database by using psql in Cloud Shell

There are a number of applications you can use to connect to your Azure Database for PostgreSQL server. Let's first use the psql command-line utility to illustrate how to connect to the server. You can use a web browser and Azure Cloud Shell as described here without the need to install any additional software. If you have the psql utility installed locally on your own machine, you can connect from there as well.

1. In the top navigation pane, select the terminal symbol to open Cloud Shell.

   ![Azure Cloud Shell terminal symbol](./media/quickstart-create-database-portal/7-cloud-console.png)

2. Cloud Shell opens in your browser, where you can type Bash shell commands.

   ![Cloud Shell Bash prompt](./media/quickstart-create-database-portal/8-bash.png)

3. At the Cloud Shell prompt, connect to a database in your Azure Database for PostgreSQL server by typing the psql command line.

    To connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility, use the following format:
    ```bash
    psql --host=<yourserver> --port=<port> --username=<server admin login> --dbname=<database name>
    ```

    For example, the following command connects to an example server:

    ```bash
    psql --host=mypgserver-20170401.postgres.database.azure.com --port=5432 --username=mylogin@mypgserver-20170401 --dbname=postgres
    ```

    psql parameter |Suggested value|Description
    ---|---|---
    --host | Server name | The server name value that you used when you created the Azure Database for PostgreSQL server earlier. Our example server shown is **mypgserver-20170401.postgres.database.azure.com.** Use the fully qualified domain name (**\*.postgres.database.azure.com**) as shown in the example. If you don't remember your server name, follow the steps in the previous section to get the connection information. 
    --port | 5432 | The port to use when you connect to the Azure Database for PostgreSQL server. 
    --username | Server admin login name |The server admin login username that you supplied when you created the Azure Database for PostgreSQL server earlier. If you don't remember your username, follow the steps in the previous section to get the connection information. The format is *username@servername*.
    --dbname | *postgres* | The default, system-generated database name that was created for the first connection. Later, you create your own database.

    After you run the psql command with your own parameter values, you're prompted to enter the server admin password. This password is the same one that you provided when you created the server. 

    psql parameter |Suggested value|Description
    ---|---|---
    password | Your admin password | The typed password characters aren't shown on the bash prompt. After you type all the characters, select the **Enter** key to authenticate and connect.

    After you connect, the psql utility displays a postgres prompt where you type sql commands. In the initial connection output, a warning might appear because the psql in Cloud Shell might be a different version than the Azure Database for PostgreSQL server version. 
    
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
    > If the firewall is not configured to allow the IP address of Cloud Shell, the following error occurs:
    > 
    > "psql: FATAL:  no pg_hba.conf entry for host "138.91.195.82", user "mylogin", database "postgres", SSL on FATAL: SSL connection is required.Specify SSL options and retry.
    > 
    > To resolve the error, make sure the server configuration matches the steps in the "Configure a server-level firewall rule" section of this article.

4. Create a blank database at the prompt by typing the following command:
    ```bash
    CREATE DATABASE mypgsqldb;
    ```
    The command might take a few minutes to finish. 

5. At the prompt, execute the following command to switch connections to the newly created database **mypgsqldb**:
    ```bash
    \c mypgsqldb
    ```

6. Type  `\q`, and then select the **Enter** key to quit psql. You can close Cloud Shell after you're finished.

Now you're connected to the Azure Database for PostgreSQL server, and you created a blank user database. Continue to the next section to connect by using another common tool, pgAdmin.

## Connect to the PostgreSQL Database by using pgAdmin

To connect to the Azure PostgreSQL server by using the GUI tool pgAdmin:
1. Open the pgAdmin application on your client computer. You can install pgAdmin from the [pgAdmin website](http://www.pgadmin.org/).

2. On the dashboard page, under the **Quick Links** section, select the **Add New Server** symbol.

3. In the **Create - Server** dialog box, on the **General** tab, enter a unique friendly name for the server, such as **Azure PostgreSQL Server**.

    ![The "General" tab](./media/quickstart-create-database-portal/9-pgadmin-create-server.png)

4. In the **Create - Server** dialog box, on the **Connection** tab, use the settings as specified, and then select **Save**.

   ![The "Connection" tab](./media/quickstart-create-database-portal/10-pgadmin-create-server.png)

    pgAdmin parameter |Suggested value|Description
    ---|---|---
    Host Name/Address | Server name | The server name value that you used when you created the Azure Database for PostgreSQL server earlier. Our example server is **mypgserver-20170401.postgres.database.azure.com.** Use the fully qualified domain name (**\*.postgres.database.azure.com**) as shown in the example. If you don't remember your server name, follow the steps in the previous section to get the connection information. 
    Port | 5432 | The port to use when you connect to the Azure Database for PostgreSQL server. 
    Maintenance database | *postgres* | The default system-generated database name.
    Username | Server admin login name | The server admin login username that you supplied when you created the Azure Database for PostgreSQL server earlier. If you don't remember the username, follow the steps in the previous section to get the connection information. The format is *username@servername*.
    Password | Your admin password | The password you chose when you created the server earlier in this Quickstart.
    Role | Leave blank | There's no need to provide a role name at this point. Leave the field blank.
    SSL mode | Required | By default, all Azure PostgreSQL servers are created with SSL enforcing turned on. To turn off SSL enforcing, see [Enforce SSL](./concepts-ssl-connection-security.md).
    
5. Select **Save**.

6. In the **Browser** pane on the left, expand the **Servers** node. Select your server, for example, **Azure PostgreSQL Server**. Click to connect to it.

7. Expand the server node, and then expand **Databases** under it. The list should include your existing *postgres* database and any newly created user database, such as **mypgsqldb**, which we created in the previous section. Notice that you can create multiple databases per server with Azure Database for PostgreSQL.

8. Right-click **Databases**, choose the **Create** menu, and then select **Database**.

9. Type a database name of your choice in the **Database** field, such as **mypgsqldb**, as shown in the example.

10. Select the **Owner** for the database from the list box. Choose your server admin login name, such as our example, **mylogin**.

11. Select **Save** to create a new blank database.

12. In the **Browser** pane, see the database that you created in the list of databases under your server name.

    ![The "Browser " pane](./media/quickstart-create-database-portal/11-pgadmin-database.png)


## Clean up resources
You can clean up the resources that you created in the Quickstart in one of two ways. You can delete the [Azure resource group](../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group. If you want to keep the other resources intact, delete only the single server resource.

> [!TIP]
> Other Quickstarts in this collection build on this Quickstart. If you plan to continue working with Quickstarts, don't clean up the resources that you created in this Quickstart. If you don't plan to continue, follow these steps to delete the resources that were created by this Quickstart in the portal.

To delete the entire resource group, including the newly created server:
1. Locate your resource group in the portal. On the menu on the left, select **Resource groups**. Then select the name of your resource group, such as our example, **myresourcegroup**.

2. On your resource group page, select **Delete**. Type the name of your resource group, such as our example, **myresourcegroup**, in the text box to confirm deletion. Select **Delete**.

To delete only the newly created server:
1. Locate your server in the portal, if you don't have it open. On the menu on the left, select **All resources**. Then search for the server you created.

2. On the **Overview** page, select **Delete**.

    ![The "Delete" button](./media/quickstart-create-database-portal/12-delete.png)

3. Confirm the server name you want to delete, and show the databases under it that are affected. Type your server name in the text box, such as our example, **mypgserver-20170401**. Select **Delete**.

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
