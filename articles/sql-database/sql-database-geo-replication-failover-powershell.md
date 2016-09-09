<properties 
    pageTitle="Initiate a planned or unplanned failover for Azure SQL Database with PowerShell | Microsoft Azure" 
    description="Initiate a planned or unplanned failover for Azure SQL Database using PowerShell" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management" 
    ms.date="07/19/2016"
    ms.author="sstein"/>

# Initiate a planned or unplanned failover for Azure SQL Database with PowerShell



> [AZURE.SELECTOR]
- [Azure portal](sql-database-geo-replication-failover-portal.md)
- [PowerShell](sql-database-geo-replication-failover-powershell.md)
- [T-SQL](sql-database-geo-replication-failover-transact-sql.md)


This article shows you how to Initiate a planned or unplanned failover for SQL Database with PowerShell. To configure Geo-Replication, see [Configure Geo-Replication for Azure SQL Database](sql-database-geo-replication-powershell.md).



## Initiate a planned failover

Use the **Set-AzureRmSqlDatabaseSecondary** cmdlet with the **-Failover** parameter to promote a secondary database to become the new primary database, demoting the existing primary to become a secondary. This functionality is designed for a planned failover, such as during disaster recovery drills, and requires that the primary database be available.

The command performs the following workflow:

1. Temporarily switch replication to synchronous mode. This will cause all outstanding transactions to be flushed to the secondary.

2. Switch the roles of the two databases in the Geo-Replication partnership.  

This sequence guarantees that the two databases are synchronized before the roles switch and therefore no data loss will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. For more information, see [Set-AzureRmSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt619393.aspx).




This cmdlet will return when the process of switching the secondary database to primary is completed.

The following command switches the roles of the database named "mydb” on the server "srv2” under the resource group "rg2” to primary. The original primary to which "db2” was connected to will switch to secondary after the two databases are fully synchronized.

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" –ResourceGroupName "rg2” –ServerName "srv2”
    $database | Set-AzureRmSqlDatabaseSecondary -Failover


> [AZURE.NOTE] In rare cases it is possible that the operation cannot complete and may appear unresponsive. In this case the user can call the force failover command (unplanned failover) and accept data loss.


## Initiate an unplanned failover from the primary database to the secondary database


You can use the **Set-AzureRmSqlDatabaseSecondary** cmdlet with **–Failover** and **-AllowDataLoss** parameters to promote a secondary database to become the new primary database in an unplanned fashion, forcing the demotion of the existing primary to become a secondary at a time when the primary database is no longer available.

This functionality is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable. When forced failover is invoked, the specified secondary database immediately becomes the primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database after the forced failover operation, an incremental backup is taken on the original primary database and the old primary database is made into a secondary database for the new primary database; subsequently, it is merely a replica of the new primary.

But because Point In Time Restore is not supported on secondary databases, if you wish to recovery data committed to the old primary database which had not been replicated to the new primary database, you should engage CSS to restore a database to the known log backup.

> [AZURE.NOTE] If the command is issued when the both primary and secondary are online the old primary will become the new secondary immediately without data synchronization. If the primary is committing transactions when the command is issued some data loss may occur.


If the primary database has multiple secondaries the command will partially succeed. The secondary on which the command was executed will become primary. The old primary however will remain primary, i.e. the two primaries will end up in inconsistent state and connected by a suspended replication link. The user will have to manually repair this configuration using a “remove secondary” API on either of these primary databases.


The following command switches the roles of the database named "mydb” to primary when the primary is unavailable. The original primary to which "mydb” was connected to will switch to secondary after it is back online. At that point the synchronization may result in data loss.

    $database = Get-AzureRmSqlDatabase –DatabaseName "mydb" –ResourceGroupName "rg2” –ServerName "srv2”
    $database | Set-AzureRmSqlDatabaseSecondary –Failover -AllowDataLoss




## Next steps   

- To learn recovering after a disaster using Active Geo-Replication, including pre and post recovery steps and performing a disaster recovery drill, see [Disaster Recovery Drills](sql-database-disaster-recovery.md)
- For a Sasha Nosov blog post about Active Geo-Replication, see [Spotlight on new Geo-Replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
- For information about designing cloud applications to use Active Geo-Replication, see [Designing cloud applications for business continuity using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- For information about using Active Geo-Replication with elastic database pools, see [Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).
- For an overview of business continurity, see [Business Continuity Overview](sql-database-business-continuity.md)
