<properties
   pageTitle="Migrate to SQL Database using transactional replication | Microsoft Azure"
   description="Microsoft Azure SQL Database, database migration, import database, transactional replication"
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-migrate"
   ms.date="06/07/2016"
   ms.author="carlrab"/>

# Migrate SQL Server database to Azure SQL Database using transactional replication

> [AZURE.SELECTOR]
- [SSMS Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
- [Export to BACPAC File](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
- [Import from BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [Transactional Replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)

In this article, you learn to migrate a compatible SQL Server database to Azure SQL Database with minimal downtime using SQL Server transactional replication.

## Understanding the Transactional Replication architecture

When you cannot afford to remove your SQL Server database from production while the migration is occurring, you can use SQL Server transactional replication as your migration solution. To use this solution, you configure your Azure SQL Database as a subscriber to the on-premises SQL Server instance that you wish to migrate. The on-premises transactional replication distibutor will synchronize data from the on-premises database to be synchronized (the publisher) while new transactions continue occur. 

You can also use transactional replication to migrate a subset of your on-premises database. The publication that you replicate to Azure SQL Database can be limited to a subset of the tables in the database being replicated. Additionally, for each table being replicated, you can limit the data to a subset of the rows and/or a subset of the columns.

With transactional replication, all changes to your data or schema that happen between the moment you start migrating and the moment you complete the migration will show up in your Azure SQL Database. 

Once the synchronization is complete and you are ready to migrate, you just need to change the connection string of your applications to point them to your Azure SQL Database instead of pointing them to your on-premises database. Once transactional replication drains any changes left on your on-premises database and all your applications point to Azure DB, you can now safely uninstall replication leaving your Azure SQL Database as the production system.

 ![SeedCloudTR diagram](./media/sql-database-cloud-migrate/SeedCloudTR.png)

## Transactional Replication requirements

Transactional replication is a technology built-in and integrated with SQL Server since SQL Server 6.5. It is a very mature and proven technology that most of DBAs know with which they have experience. With the [SQL Server 2016](https://www.microsoft.com/en-us/cloud-platform/sql-server), it is now possible to configure your Azure SQL Database as a [transactional replication subscriber](https://msdn.microsoft.com/library/mt589530.aspx) to your on-premises publication. The experience that you get setting it up from Management Studio is exactly the same as if you set up a transactional replication subscriber on an on-premises server. Support for this scenario is supported when the publisher and the distributor is at least one of the following SQL Server versions:

 - SQL Server 2016 and above 
 - SQL Server 2014 SP1 CU3 and above
 - SQL Server 2014 RTM CU10 and above
 - SQL Server 2012 SP2 CU8 and above
 - SQL Server 2013 SP3 when it will release


> [AZURE.IMPORTANT] You must use the latest version of SQL Server Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. Older versions of SQL Server Management Studio will not be able to set up SQL Database as a subscriber. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


## Next steps

- [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)
- [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
- [SQL Server 2016 ](https://www.microsoft.com/en-us/cloud-platform/sql-server)

## Additional resources

- [Transactional Replication](https://msdn.microsoft.com/library/mt589530.aspx)
- [SQL Database V12](sql-database-v12-whats-new.md)
- [Transact-SQL partially or unsupported functions](sql-database-transact-sql-information.md)
- [Migrate non-SQL Server databases using SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/)
