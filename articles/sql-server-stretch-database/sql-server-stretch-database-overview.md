<properties
	pageTitle="Stretch Database overview | Microsoft Azure"
	description="Learn how Stretch Database migrates your historical data transparently and securely to the Microsoft Azure cloud."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/17/2016"
	ms.author="douglasl"/>

# Stretch Database overview

Stretch Database migrates your historical data transparently and securely to the Microsoft Azure cloud.

If you just want to get started with Stretch Database right away, see [Get started by running the Enable Database for Stretch Wizard](sql-server-stretch-database-wizard.md).

## What are the benefits of Stretch Database?
Stretch Database provides the following benefits:

**Provides cost\-effective availability for cold data**
Stretch warm and cold transactional data dynamically from SQL Server to Microsoft Azure with SQL Server Stretch Database. Unlike typical cold data storage, your data is always online and available to query. You can provide longer data retention timelines without breaking the bank for large tables like Customer Order History. Benefit from the low cost of Azure rather than scaling expensive, on\-premises storage. You choose the pricing tier and configure settings in the Azure Portal to maintain control over costs. Scale up or down as needed. Visit the [SQL Server Stretch Database Pricing](https://azure.microsoft.com/pricing/details/sql-server-stretch-database/) page for details.

**Doesn’t require changes to queries or applications**
Access your SQL Server data seamlessly regardless of whether it’s on\-premises or stretched to the cloud.  You set the policy that determines where data is stored, and SQL Server handles the data movement in the background. The entire table is always online and queryable. And, Stretch Database doesn’t require any changes to existing queries or applications – the location of the data is completely transparent to the application.

**Streamlines on\-premises data maintenance**
Reduce on\-premises maintenance and storage for your data. Backups for the cloud portion of your data run automatically. Backups for your on\-premises data run faster and finish within the maintenance window. Your on\-premises storage needs are greatly reduced. Azure storage can be 80% less expensive than adding to on\-premises SSD.

**Keeps your data secure even during migration**
Enjoy peace of mind as you stretch your most important applications securely to the cloud. SQL Server’s Always Encrypted provides encryption for your data in motion. Row Level Security (RLS) and other advanced SQL Server security features also work with Stretch Database to protect your data.

## What does Stretch Database do?
After you enable Stretch Database for a SQL Server instance, a database, and at least one table, it silently begins to migrate your historical data to Azure.

-   If you store historical data in a separate table, you can migrate the entire table.

-   If your table contains both historical and current data, you can specify a filter predicate to select the rows to migrate.

Stretch Database ensures that no data is lost if a failure occurs during migration. It also has retry logic to handle connection issues that may occur during migration. A dynamic management view provides the status of migration.

You can pause data migration to troubleshoot problems on the local server or to maximize the available network bandwidth.

You don't have to change existing queries and client apps. You continue to have seamless access to both local and remote data, even during data migration. There is a small amount of latency for remote queries, but you only encounter this latency when you query the historical data.

![Stretch database overview][StretchOverviewImage1]

## Is Stretch Database for you?
If you can make the following statements, Stretch Database may help to meet your requirements and solve your problems.

|If you're a decision maker|If you're a DBA|
|------------------------------|-------------------|
|I have to keep transactional data for a long time.|The size of my tables is getting out of control.|
|Sometimes I have to query the historical data.|My users say that they want access to historical data, but they only rarely use it.|
|I have apps, including older apps, that I don’t want to update.|I have to keep buying and adding more storage.|
|I want to find a way to save money on storage.|I can’t backup or restore such large tables within the SLA.|

## What kind of databases and tables are candidates for Stretch Database?
Stretch Database targets transactional databases with large amounts of historical data, typically stored in a small number of tables. These tables may contain more than a billion rows.

If you use the temporal table feature of SQL Server 2016, use Stretch Database to migrate all or part of the associated history table to cost\-effective storage in Azure. For more info, see [Manage Retention of Historical Data in System-Versioned Temporal Tables](https://msdn.microsoft.com/library/mt637341.aspx).

Use Stretch Database Advisor, a feature of SQL Server 2016 Upgrade Advisor, to identify databases and tables for Stretch Database. For more info, see [Identify databases and tables for Stretch Database](sql-server-stretch-database-identify-databases.md). To learn more about potential blocking issues, see [Surface area limitations and blocking issues for Stretch Database](sql-server-stretch-database-limitations.md).

## <a name="FAQ"></a>Frequently asked questions about Stretch Database
**Does Stretch Database work with &lt;SQL Server feature name&gt;?**
-   For a list of SQL Server features that make a table ineligible for Stretch, see [Surface area limitations and blocking issues for Stretch Database](sql-server-stretch-database-limitations.md).

-   Optionally, download SQL Server 2016 Upgrade Advisor and run the Stretch Database Advisor to identify databases and tables that are candidates for Stretch Database. For more info, see [Identify databases and tables for Stretch Database](sql-server-stretch-database-identify-databases.md).

**Can I target another local SQL Server instance for Stretch Database?**
No. Stretch Database does not support another local SQL Server instance as the remote endpoint.

**Can I disable Stretch and move migrated data back to the local table?**
Yes. For more info, see [Disable Stretch Database and bring back remote data](sql-server-stretch-database-disable.md).

## Terms
**Local database**. The on\-premises SQL Server database.

**Remote endpoint**. The location in Microsoft Azure that contains the database’s remote data.

**Local data**. Data in a database with Stretch Database enabled that will not be moved to Azure based on the Stretch Database configuration of the tables in the database.

**Eligible data**. Data in a database with Stretch Database enabled that has not yet been moved, but will be moved to Azure based on the Stretch Database configuration of the tables in the database.

**Remote data**. Data in a database with Stretch Database enabled that has already been moved to Azure.

## Architecture
Stretch Database leverages the resources in Microsoft Azure to offload archival data storage and query processing.

When you enable Stretch Database on a database, it creates a secure linked server definition in the on\-premises SQL Server. This linked server definition has the remote endpoint as the target. When you enable Stretch Database on a table in the database, it provisions remote resources and begins to migrate eligible data, if migration is enabled.

Queries against tables with Stretch Database enabled automatically run against both the local database and the remote endpoint. Stretch Database leverages processing power in Azure to run queries against remote data by rewriting the query. You can see this rewriting as a "remote query" operator in the new query plan.

![Stretch Database architecture][StretchOverviewImage2]

## Security and permissions

### Enabling and disabling Stretch Database for a SQL Server instance
To begin configuring databases for Stretch Database, you must first change the "remote data archive" instance\-level configuration option using sp\_configure. This operation requires sysadmin or serveradmin privileges. With this option enabled, you can configure databases for Stretch Database, migrate data, and query data on the remote endpoint.

### Enabling and disabling a Stretch Database for a database or table
To configure a database for Stretch Database, you must have the CONTROL DATABASE permission. In addition, you have to provide administrator credentials for the remote endpoint.

To configure a table for Stretch Database, you must have ALTER privilege on the table, and the database must already be configured for Stretch Database.

### Data access
Only system processes can access the linked server definition behind Stretch Database. User logins can't issue queries through the linked server definition to the remote endpoint.

Stretch Database does not change the permissions model of an existing database. User logins can query the data in a table with Stretch Database enabled through the local database. The local database performs permission checks for any actions initiated by the user in the same way as it does for any other objects. If you're authorized to access the table with Stretch Database enabled, you have access to all its contents for which you're authorized regardless of where the data physically resides.

![Stretch Database data access model][StretchOverviewImage3]

## Test drive Stretch Database
**Test drive Stretch Database with the AdventureWorks sample database.** To get the AdventureWorks sample database, download at least the database file and the samples and scripts file from [here](https://www.microsoft.com/download/details.aspx?id=49502). After you restore the sample database to an instance of SQL Server 2016, unzip the samples file and open the Stretch DB Samples file from the Stretch DB folder. Run the scripts in this file to check the space used by your data before and after you enable Stretch Database,  to track the progress of data migration, and to confirm that you can continue to query existing data and insert new data both during and after data migration.

## Next step
**Identify databases and tables that are candidates for Stretch Database.** Download SQL Server 2016 Upgrade Advisor and run the Stretch Database Advisor to identify databases and tables that are candidates for Stretch Database. Stretch Database Advisor also identifies blocking issues. For more info, see [Identify databases and tables for Stretch Database](sql-server-stretch-database-identify-databases.md).

<!--Image references-->
[StretchOverviewImage1]: ./media/sql-server-stretch-database-overview/StretchDBOverview.png
[StretchOverviewImage2]: ./media/sql-server-stretch-database-overview/StretchDBOverview1.png
[StretchOverviewImage3]: ./media/sql-server-stretch-database-overview/StretchDBOverview2.png
