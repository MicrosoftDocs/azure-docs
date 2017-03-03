---
title: 'Azure portal QuickStart: Your first Azure SQL Database | Microsoft Docs'
description: Learn how to create a SQL Database logical server, server-level firewall rule, and databases in the Azure portal. You also learn to query an Azure SQL database using the Azure portal.
keywords: sql database tutorial, create a sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: single databases
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 02/26/2017
ms.author: carlrab

---
# Create and query your first Azure SQL database in the Azure portal

In this QuickStart, you learn how to create and query an Azure SQL database in the Azure portal. After you complete this quick start, you will:

* Have created an Azure SQL database in a resource group and in a logical server.
* Have created a server-level firewall rule.
* Viewed the server and database properties in the Azure portal.
* Queried your database in the Azure portal.
* Be ready to connect to and manage your database and its server using [SQL Server Management Studio](sql-database-connect-query-ssms.md).

**Time estimate**: This QuickStart takes approximately 10 minutes.

> [!TIP]
> For a series of tutorials teaching you how to create, connect to, and query an Azure SQL database using different methods and tools, see [Azure portal](sql-database-get-started-portal.md), [PowerShell](sql-database-get-started-powershell.md), or [C#](sql-database-get-started-csharp.md).
>

### Prerequisites

* **An Azure account**. You can [open a free Azure account](https://azure.microsoft.com/free/) or [Activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits/). 

* **Azure create permissions**. You must be able to connect to the Azure portal with an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

### Sign in to the Azure portal

The steps in this procedure show you how to sign in to the Azure portal using your [Azure account](https://account.windowsazure.com/Home/Index).

1. Open your browser of choice and connect to the [Azure portal](https://portal.azure.com/).
2. Sign in to the [Azure portal](https://portal.azure.com/).
3. On the **Sign in** page, provide the credentials for your subscription and sign in.
 
## Create a database

The steps in this procedure show you how to create a database with sample data in the Azure portal. For more information on databases and servers, see [Database overview](sql-database-overview.md) and [Server overview](sql-database-server-overview.md).

1. In Azure portal, click **SQL databases** in the default blade and then click **Add** to open a new SQL Database blade.

2. On the SQL databases blade, provide the following information to provision a new Azure SQL database and, when complete, click **Create**.:

   * **Database name**: a valid database name
   * **Subscription**: select the subscription to use for this database
   * **Resource group**: select an existing resource group or specify a valid resource group name
   * **Select source**: select **Sample (AdventureWorksLT)**
   * **Server**: select an existing server or create a new server
      * For a new server:
         * **Server name**: a globally unique server name
         * **Server admin login**: a SQL server administrator login
         * **Password**: the SQL server login password
         * **Confirm password**: re-enter the password
         * **Location**: select the data center location for the server
   * **Want to use SQL elastic pool**: select **Not now**
   * **Pricing tier**: select your tier of choice

      ![create sql database2](./media/sql-database-get-started/create-database2.png)

3. Provisioning takes a few minutes. When it completes, click your new database to view its properties. Pay particular attention to the fully qualified server name that you use to connect to the database and the server using SQL Server Management Studio and other tools. Notice also the Set server firewall link that you will learn about in the next procedure.

## Create a server-level firewall rule

The steps in this procedure show you how to create a server-level firewall rule in the Azure portal. By default, an Azure SQL Database firewall prevents external connectivity to your logical server and its databases. To enable you to connect to your server, you need to create a firewall rule for the IP address of the computer from which you connect in the next procedure. For more information, see [Overview of Azure SQL Database firewall rules](sql-database-firewall-configure.md).

1. On the **SQL database blade** for your new database, click **Set server firewall** to open the Firewall blade for your server. Notice that the IP address is displayed for your client computer.

2. Click **Add client IP** on the toolbar and then click **Save** to create a firewall rule for your current IP address.

    ![add client IP](./media/sql-database-get-started/add-client-ip.png)

    > [!NOTE]
    > You can create a firewall rule for a single IP address or an entire range of addresses. Opening the firewall enables SQL administrators and users to log in to any database on the server for which they have valid credentials.
    >

3.  Click **OK** and then close the firewall blade.

## Query the database

The steps in this procedure show you how to query the database directly in the Azure portal. 

1. On the **SQL database blade** for your database, click **Tools** on the toolbar.

2. On the Tools blade, click **Query editor (preview)** and then click the checkbox to acknowledge that the query editor is a preview feature and then click **OK**. 

3. On the **Query editor** blade, click **Login** and then, when prompted provide the server admin login and password that you specified earlier. Click **OK** to log in to your database.

4. After you are authenticated, type a query, such as the following query in the query window, and then click **Run**.

   ```
   select * from sys.objects
   ```

5. Review the query results in the **Results** pane.

    ![query editor results](./media/sql-database-get-started/query-editor-results.png)

## Troubleshoot connectivity

You receive error messages when the connection to Azure SQL Database fails. The connection problems can be caused by SQL Azure database reconfiguration, firewall settings, connection time-out, or incorrect login information. For a connectivity troubleshooter tool, see [Troubleshooting connectivity issues with Microsoft Azure SQL Database](https://support.microsoft.com/help/10085/troubleshooting-connectivity-issues-with-microsoft-azure-sql-database).

## Delete the database

The steps in this procedure show you how to delete a single database with the Azure portal.

1. On the **SQL database blade** for your database, click **Delete**.

2. Click **Yes** to confirm that you want to delete this database permanently.

> [!TIP]
> During the retention period for your database, you can restore it from the service-initiated automatic backups (provided you do not delete the server itself). For Basic edition databases, you can restore them within seven days. For all other editions, you can restore them within 35 days. If you do delete the server itself, you cannot recover the server or any of its deleted databases. For more information about database backups, see [Learn about SQL Database backups](sql-database-automated-backups.md) and for information about restoring a database from backups, see [Database recovery](sql-database-recovery-using-backups.md). For a how-to article on restoring a deleted database, see [Restore a deleted Azure SQL database - Azure portal](sql-database-restore-deleted-database-portal.md).
>

## Next steps

- To connect, query and manage your database and its server using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md) or see the [Create your first database in the Azure portal tutorial](sql-database-get-started-portal.md).
- To connect using Visual Studio, see [Connect and query with Visual Studio](sql-database-connect-query.md)
- For a getting started with SQL Server authentication tutorial, see [SQL authentication and authorization](sql-database-control-access-sql-authentication-get-started.md)
* If you're ready to start coding, choose your programming language at [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).
* If you want to move your on-premises SQL Server databases to Azure, see [Migrating a database to SQL Database](sql-database-cloud-migrate.md).
* For a technical overview of SQL Database, see [About the SQL Database service](sql-database-technical-overview.md).

