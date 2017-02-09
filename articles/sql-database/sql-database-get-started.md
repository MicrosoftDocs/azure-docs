---
title: 'SQL Database tutorial: Create a server, a server-level firewall rule, a sample database, a database-level firewall rule and connect with SQL Server Management Studio | Microsoft Docs'
description: Learn how to set up a SQL Database logical server, server firewall rule, SQL database, and sample data. Also, learn how to connect with client tools, configure users, and set up a database firewall rule.
keywords: sql database tutorial, create a sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: aeb8c4c3-6ae2-45f7-b2c3-fa13e3752eed
ms.service: sql-database
ms.custom: overview
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/23/2016
ms.author: carlrab

---
# Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio

In this getting-started tutorial, you learn how to use the Azure portal to:

* Create a new Azure resource group
* Create an Azure SQL logical server
* View Azure SQL logical server properties
* Create a server-level firewall rule
* Create the Adventure Works LT sample database as a standalone database
* View Adventure Works LT sample database properties in Azure

In this tutorial, you also use the most recent version of SQL Server Management Studio to:

* Connect to the logical server and its master database
* Query the master database
* Connect to the sample database
* Query the sample database

When you finish this tutorial, you will have a sample database and a blank database running in an Azure resource group and attached to a logical server. You will also have a server-level firewall rule configured to enable the server-level principal to log in to the server from a specified IP address (or IP address range). 

**Time estimate**: This tutorial will take you approximately 30 minutes (assuming you already meet the prerequisites).

## Prerequisites

* You need an Azure account. You can [open a free Azure account](/pricing/free-trial/?WT.mc_id=A261C142F) or [Activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

* You must be able to connect to the Azure portal using an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

> [!TIP]
> You can perform these same tasks in a getting started tutorial by using either [C#](sql-database-get-started-csharp.md) or [PowerShell](sql-database-get-started-powershell.md).
>

### Sign in by using your existing account
Using your [existing subscription](https://account.windowsazure.com/Home/Index), follow these steps to connect to the Azure portal.

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription.
   
   ![Sign in](./media/sql-database-get-started/login.png)


<a name="create-logical-server-bk"></a>

## Create a new logical SQL server in the Azure portal

1. Click **New**, type **sql server**, and then click **ENTER**.

    ![logical sql server](./media/sql-database-get-started/logical-sql-server.png)
2. Click **SQL server (logical server)**.
   
    ![create-logical sql server](./media/sql-database-get-started/create-logical-sql-server.png)
3. Click **Create** to open the new SQL Server (logical server) blade.

    ![new-logical sql server](./media/sql-database-get-started/new-logical-sql-server.png)
3. In the Server name text box, provide a valid name for the new logical server. A green check mark indicates that you have provided a valid name.
    
    ![new server name](./media/sql-database-get-started/new-server-name.png)

    > [!IMPORTANT]
    > The fully qualified name for your new server will be <your_server_name>.database.windows.net.
    >
    
4. In the Server admin login text box, provide a user name for the SQL authentication login for this server. This login is known as the server principal login. A green check mark indicates that you have provided a valid name.
    
    ![SQL admin login](./media/sql-database-get-started/sql-admin-login.png)
5. In the **Password** and **Confirm password** text boxes, provide a password for the server principal login account. A green check mark indicates that you have provided a valid password.
    
    ![SQL admin password](./media/sql-database-get-started/sql-admin-password.png)
6. Select a subscription in which you have permission to create objects.

    ![subscription](./media/sql-database-get-started/subscription.png)
7. In the Resource group text box, select **Create new** and then, in the resource group text box, provide a valid name for the new resource group (you can also use an existing resource group if you have already created one for yourself). A green check mark indicates that you have provided a valid name.

    ![new resource group](./media/sql-database-get-started/new-resource-group.png)

8. In the **Location** text box, select a data center appropriate to your location - such as "Australia East".
    
    ![server location](./media/sql-database-get-started/server-location.png)
    
    > [!TIP]
    > The checkbox for **Allow azure services to access server** cannot be changed on this blade. You can change this setting on the server firewall blade. For more information, see [Get started with security](sql-database-get-started-security.md).
    >
    
9. Click **Create**.

    ![create button](./media/sql-database-get-started/create.png)

## View the logical SQL Server properties in the Azure portal

1. In the Azure portal, click **More services**.

    ![more services](./media/sql-database-get-started/more-services.png)
2. In the Filter text box, type **SQL** and then click the star for SQL servers to specify SQL servers as a favorite within Azure. 

    ![set favorite](./media/sql-database-get-started/favorite.png)
3. In the default blade, click **SQL servers** to open the list of SQL servers in your Azure subscription. 

    ![new sql server](./media/sql-database-get-started/new-sql-server.png)

4. Click your new SQL server to view its properties in the Azure portal. Subsequent tutorials help you understand the options available to you on this blade.

    ![sql server blade](./media/sql-database-get-started/sql-server-blade.png)
5. Under Settings, click **Properties** to view various properties of the logical SQL server.

    ![sql server properties](./media/sql-database-get-started/sql-server-properties.png)
6. Copy the fully qualified server name to your clipboard for use a bit later in this tutorial.

    ![sql server full name](./media/sql-database-get-started/sql-server-full-name.png)

## Create a server-level firewall rule in the Azure portal

1. On the SQL server blade, under Settings, click **Firewall** to open the Firewall blade for the SQL server.

    ![sql server firewall](./media/sql-database-get-started/sql-server-firewall.png)

2. Review the client IP address displayed and validate that this is your IP address on the Internet using a browser of your choice (ask "what is my IP address). Occasionally they do not match for a various reasons.

    ![your IP address](./media/sql-database-get-started/your-ip-address.png)

3. Assuming that the IP addresses match, click **Add client IP** on the toolbar.

    ![add client IP](./media/sql-database-get-started/add-client-ip.png)

    > [!NOTE]
    > You can open the SQL Database firewall on the server to a single IP address or an entire range of addresses. Opening the firewall enables SQL administrators and users to login to any database on the server to which they have valid credentials.
    >

4. Click **Save** on the toolbar to save this server-level firewall rule and then click **OK**.

    ![add client IP](./media/sql-database-get-started/save-firewall-rule.png)

## Connect to SQL server using SQL Server Management Studio (SSMS)

1. If you have not already done so, download and install the latest version of SSMS at [Download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx). To stay up-to-date, the latest version of SSMS prompts you when there is a new version available to download.

2. After installing, type **Microsoft SQL Server Management Studio** in the Windows search box and click **Enter** to open SSMS:

    ![SQL Server Management Studio](./media/sql-database-get-started/ssms.png)
3. In the Connect to Server dialog box, enter the necessary information to connect to your SQL server using SQL Server Authentication.

    ![connect to server](./media/sql-database-get-started/connect-to-server.png)
4. Click **Connect**.

    ![connected to server](./media/sql-database-get-started/connected-to-server.png)
5. In Object Explorer, expand **Databases**, expand **System Databases**, expand **master** to view objects in the master database.

    ![master database](./media/sql-database-get-started/master-database.png)
6. Right-click **master** and then click **New Query**.

    ![query master database](./media/sql-database-get-started/query-master-database.png)

8. In the query window, type the following query:

   ```select * from sys.objects```

9.  On toolbar, click **Execute** to return a list of all system objects in the master database.

    ![query master database system objects](./media/sql-database-get-started/query-master-database-system-objects.png)

    > [!NOTE]
    > To explore SQL security, see [Get Started with SQL security](sql-database-get-started-security.md)
    >

## Create new database in the Azure portal using Adventure Works LT sample

1. In Azure portal, click **SQL databases** in the default blade.

    ![sql databases](./media/sql-database-get-started/new-sql-database.png)
2. On the SQL databases blade, click **Add**.

    ![add sql database](./media/sql-database-get-started/add-sql-database.png)
3. On the SQL Database blade, review the information completed for you.

    ![sql database blade](./media/sql-database-get-started/sql-database-blade.png)
4. Provide a valid database name.

    ![sql database name](./media/sql-database-get-started/sql-database-name.png)
5. Under Select source, click **Sample** and then underSelect sample, click **AdventureWorksLT [V12]**.
   
    ![adventure works lt](./media/sql-database-get-started/adventureworkslt.png)
6. Under Server, provide the server admin login user name and password.

    ![server credentials](./media/sql-database-get-started/server-credentials.png)

    > [!NOTE]
    > When adding a database to a server, it can be added as a standalone database (this is the default) or added to an elastic pool. For more information on elastic pools, see [Elastic pools](sql-database-elastic-pool.md).
    >

7. Under Pricing tier, change the pricing tier to **Basic** (you can increase the pricing tier later if desired, but for learning purposes, we recommend you use the lowest cost tier).

    ![pricing tier](./media/sql-database-get-started/pricing-tier.png)
8. Click **Create**.

    ![create button](./media/sql-database-get-started/create.png)

## View database properties in the Azure portal

1. On the SQL databases blade, click your new database to view its properties in the Azure portal. Subsequent tutorials help you understand the options available to you on this blade. 

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)
2. Click **Properties** to view additional information about your database.

    ![new sample db properties](./media/sql-database-get-started/new-sample-db-properties.png)

3. Click **Show database connection strings**.

    ![new sample db connection strings](./media/sql-database-get-started/new-sample-db-connection-strings.png)
4. Click **Overview** and then click your server name in the Essentials pane.
    
    ![new sample db essentials pane](./media/sql-database-get-started/new-sample-db-essentials-pane.png)
5. In the Essentials pane for your server, see your newly added database.

    ![new sample db in server essentials pane](./media/sql-database-get-started/new-sample-db-server-essentials-pane.png)

## Connect and query sample database using SQL Server Management Studio

1. Switch to SQL Server Management Studio and, in Object Explorer, click **Databases** and then click **Refresh** on the toolbar to view the sample database.

    ![new sample db with ssms](./media/sql-database-get-started/new-sample-db-ssms.png)
2. In Object Explorer, expand your new database to view its objects.

    ![new sample db objects with ssms](./media/sql-database-get-started/new-sample-db-objects-ssms.png)
3. Right-click your sample database and then click **New Query**.

    ![new sample db query with ssms](./media/sql-database-get-started/new-sample-db-query-ssms.png)
4. In the query window, type the following query:

   ```select * from sys.objects```
   
9.  On toolbar, click **Execute** to return a list of all system objects in the sample database.

    ![new sample db query system objects with ssms](./media/sql-database-get-started/new-sample-db-query-objects-ssms.png)

## Create a new blank database using SQL Server Management Studio

1. In Object Explorer, right-click **Databases** and then click **New database**.

    ![new blank database with ssms](./media/sql-database-get-started/new-blank-database-ssms.png)

    > [!NOTE]
    > You can also have SSMS create a create database script for you to create a new database using Transact-SQL.
    >

2. In the New Database dialog box, provide a database name in the Database name text box. 

    ![new blank database name with ssms](./media/sql-database-get-started/new-blank-database-name-ssms.png)

3. In the New Database dialog box, click **Options** and then change the Edition to **Basic**.

    ![new blank database options with ssms](./media/sql-database-get-started/new-blank-database-options-ssms.png)

    > [!TIP]
    > Review the other options in this dialog box that you can modify for an Azure SQL Database. For more information on these options, see [Create Database](https://msdn.microsoft.com/library/dn268335.aspx).
    >

4. Click **OK** to create the blank database.
5. When complete, refresh the Database node in Object Explorer to view the newly created blank database. 

    ![new blank database in object explorer](./media/sql-database-get-started/new-blank-database-object-explorer.png)

> [!TIP]
> You can save some money while you are learning by deleting databases that you are not using. For Basic edition databases, you can restore them within seven days. However, do not delete a server. If you do so, you cannot recover the server or any of its deleted databases.
>


## Next steps
Now that you've completed this tutorial, there are number of additional tutorials that you may wish to explore that build what you have learned in this tutorial. 

* If you want to start exploring Azure SQL Database security, see [Getting started with security](sql-database-get-started-security.md).
* If you know Excel, learn how to [Connect to a SQL database in Azure with Excel](sql-database-connect-excel.md).
* If you're ready to start coding, choose your programming language at [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).
* If you want to move your on-premises SQL Server databases to Azure, see [Migrating a database to SQL Database](sql-database-cloud-migrate.md).
* If you want to load some data into a new table from a CSV file by using the BCP command-line tool, see [Loading data into SQL Database from a CSV file using BCP](sql-database-load-from-csv-with-bcp.md).
* If you want to start creating tables and other objects, see the "To create a table" topic in [Creating a table](https://msdn.microsoft.com/library/ms365315.aspx).

## Additional resources
[What is SQL Database?](sql-database-technical-overview.md)

