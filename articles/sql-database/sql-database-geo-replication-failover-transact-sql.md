---
title: 'TSQL:Initiate failover for Azure SQL Database | Microsoft Docs'
description: Initiate a planned or unplanned failover for Azure SQL Database using Transact-SQL
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 5eb2d256-025d-4f5a-99d4-17f702b37f14
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-management
ms.date: 01/10/2017
ms.author: carlrab

---
# Initiate a planned or unplanned failover for Azure SQL Database with Transact-SQL

This article shows you how to initiate failover to a secondary SQL Database using Transact-SQL. To configure geo-replication, see [Configure geo-replication for Azure SQL Database](sql-database-geo-replication-transact-sql.md).

To initiate failover, you need the following:

* A login that is DBManager on the primary
* Have db_ownership of the local database that you will geo-replicate
* Be DBManager on the partner server(s) to which you will configure geo-replication
* Newest version of SQL Server Management Studio (SSMS)

> [!IMPORTANT]
> It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
>  

## Initiate a planned failover promoting a secondary database to become the new primary
You can use the **ALTER DATABASE** statement to promote a secondary database to become the new primary database in a planned fashion, demoting the existing primary to become a secondary. This statement is executed on the master database on the Azure SQL Database logical server in which the geo-replicated secondary database that is being promoted resides. This functionality is designed for planned failover, such as during the DR drills, and requires that the primary database be available.

The command performs the following workflow:

1. Temporarily switches replication to synchronous mode, causing all outstanding transactions to be flushed to the secondary and blocking all new transactions;
2. Switches the roles of the two databases in the geo-replication partnership.  

This sequence guarantees that the two databases are synchronized before the roles switch and therefore no data loss will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. If the primary database has multiple secondary databases, the command will automatically reconfigure the other secondaries to connect to the new primary.  The entire operation should take less than a minute to complete under normal circumstances. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).

Use the following steps to initiate a planned failover.

1. In Management Studio, connect to the Azure SQL Database logical server in which a geo-replicated secondary database resides.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following **ALTER DATABASE** statement to switch the secondary database to the primary role.
   
        ALTER DATABASE <MyDB> FAILOVER;
4. Click **Execute** to run the query.

> [!NOTE]
> In rare cases, it is possible that the operation cannot complete and may appear stuck. In this case, the user can execute the force failover command and accept data loss.
> 
> 

## Initiate an unplanned failover from the primary database to the secondary database
You can use the **ALTER DATABASE** statement to promote a secondary database to become the new primary database in an unplanned fashion, forcing the demotion of the existing primary to become a secondary at a time when the primary database is no longer available. This statement is executed on the master database on the Azure SQL Database logical server in which the geo-replicated secondary database that is being promoted resides.

This functionality is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable. When forced failover is invoked, the specified secondary database immediately becomes the primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database, an incremental backup is taken on the original primary database and the old primary database is made into a secondary database for the new primary database; subsequently, it is merely a synchronizing replica of the new primary.

However, because Point In Time Restore is not supported on the secondary databases, if the user wishes to recover data committed to the old primary database that had not been replicated to the new primary database before the forced failover occurred, the user will need to engage support to recover this lost data.

If the primary database has multiple secondary databases, the command will automatically reconfigure the other secondaries to connect to the new primary.

Use the following steps to initiate an unplanned failover.

1. In Management Studio, connect to the Azure SQL Database logical server in which a geo-replicated secondary database resides.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following **ALTER DATABASE** statement to switch the secondary database to the primary role.
   
        ALTER DATABASE <MyDB>   FORCE_FAILOVER_ALLOW_DATA_LOSS;
4. Click **Execute** to run the query.

> [!NOTE]
> If the command is issued when both primary and secondary are online the old primary will become the new secondary immediately without data synchronization. If the primary is committing transactions when the command is issued some data loss may occur.
> 
> 

## Next steps
* After failover, ensure the authentication requirements for your server and database are configured on the new primary. For details, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md).
* To learn recovering after a disaster using active geo-replication, including pre-recovery and post-recovery steps and performing a disaster recovery drill, see [Disaster Recovery](sql-database-disaster-recovery.md)
* For a Sasha Nosov blog post about active geo-replication, see [Spotlight on new geo-replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
* For information about designing cloud applications to use active geo-replication, see [Designing cloud applications for business continuity using geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
* For information about using active geo-replication with elastic pools, see [Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).
* For an overview of business continuity, see [Business Continuity Overview](sql-database-business-continuity.md)

