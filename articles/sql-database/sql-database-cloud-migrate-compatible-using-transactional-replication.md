---
title: Use transacation replication to migrate to Azure SQL Database | Microsoft Docs
description: In this article, you learn to migrate a compatible SQL Server database to Azure SQL Database with minimal downtime using SQL Server transactional replication.
keywords: Microsoft Azure SQL Database, database migration, import database, transactional replication
services: sql-database
documentationcenter: ''
author: jognanay
manager: jhubbard
editor: ''

ms.assetid: eebdd725-833d-4151-9b2b-a0303f39e30f
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: sqldb-migrate
ms.date: 12/09/2016
ms.author: carlrab; jognanay;

---
# Migrate SQL Server database to Azure SQL Database using transactional replication
> [!div class="op_single_selector"]
> * [SSMS Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
> * [Export to BACPAC File](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
> * [Import from BACPAC File](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
> * [Transactional Replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)
> 
> 

In this article, you learn to migrate a compatible SQL Server database to Azure SQL Database with minimal downtime using SQL Server transactional replication.

## Understanding the Transactional Replication architecture
When you cannot afford to remove your SQL Server database from production while the migration is occurring, you can use SQL Server transactional replication as your migration solution. To use this solution, you configure your Azure SQL Database as a subscriber to the on-premises SQL Server instance that you wish to migrate. The on-premises transactional replication distributor synchronizes data from the on-premises database to be synchronized (the publisher) while new transactions continue occur. 

You can also use transactional replication to migrate a subset of your on-premises database. The publication that you replicate to Azure SQL Database can be limited to a subset of the tables in the database being replicated. For each table being replicated, you can limit the data to a subset of the rows and/or a subset of the columns.

With transactional replication, all changes to your data or schema show up in your Azure SQL Database. Once the synchronization is complete and you are ready to migrate, change the connection string of your applications to point them to your Azure SQL Database. Once transactional replication drains any changes left on your on-premises database and all your applications point to Azure DB, you can uninstall transactional replication. Your Azure SQL Database is now your production system.

 ![SeedCloudTR diagram](./media/sql-database-cloud-migrate/SeedCloudTR.png)

## How Transactional Replication works

Transactional replication involves 3 main components. They are the publisher, the distributor and the subscriber. Together these components carry out replication. 
The distributor is responsible for controlling the processes which move your data between servers. When you set up distribution SQL will create a distribution database. Each publisher needs to be tied to a distribution database. The distribution database holds the metadata for each associated publication and data on the progress of each replication. For transaction replication it will hold all the transactions than need to be executed in the subscriber.

The publisher is the database where all data for migration originates. Within the publisher there can be many publications. These publications contain articles which map to all the tables and data that need to be replicated. Depending on how you define the publication and articles you can replicate either all or part of your database. 

In replication the subscriber is the server which receives all the data and transactions from the publication. Each publication can have many replications.

## Transactional Replication requirements
[Go to this link for an updated list of requirements.](https://msdn.microsoft.com/en-US/library/mt589530.aspx)
> [!IMPORTANT]
> Use the latest version of SQL Server Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. Older versions of SQL Server Management Studio cannot set up SQL Database as a subscriber. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
> 

## Migration to SQL Database using Transaction Replication workflow

1. Set up Distribution
   -  [Using SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms151192.aspx#Anchor_1)
   -  [Using Transact-SQL](https://msdn.microsoft.com/library/ms151192.aspx#Anchor_2)
2. Create Publication
   -  [Using SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms151160.aspx#Anchor_1)
   -  [Using Transact-SQL](https://msdn.microsoft.com/library/ms151160.aspx#Anchor_2)
3. Create Subscription
   -  [Using SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms152566.aspx#Anchor_0)
   -  [Using Transact-SQL](https://msdn.microsoft.com/library/ms152566.aspx#Anchor_1)

## Some tips and differences for migrating to SQL Database

1. Use a local distributor 
   - This will cause a performance impact on the server. 
   - If the performance impact is unacceptable you can use another server but it will add complexity in management and administration.
2. When selecting a snapshot folder make sure the folder you select is large enough to hold a BCP of every table you want to replicate. 
3. Note that snapshot creation will lock the associated tables until it is complete, keep this in mind when scheduling your snapshot. 
4. Only push subscriptions are supported in Azure SQL Database
   - You can only add subscribers from the side of your on premise database.

## Next steps
* [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)
* [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
* [SQL Server 2016 ](https://www.microsoft.com/sql-server/sql-server-2016)

## Additional resources
* To learn more about Transactional Replication, see [Transactional Replication](https://msdn.microsoft.com/library/mt589530.aspx).
* To learn about the overall migration process and options, see [SQL Server database migration to SQL Database in the cloud](sql-database-cloud-migrate.md).
