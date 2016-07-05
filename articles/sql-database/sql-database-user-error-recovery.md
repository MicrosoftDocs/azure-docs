<properties 
   pageTitle="SQL Database User Error Recovery | Microsoft Azure" 
   description="Learn how to recover from user error, accidental data corruption, or a deleted database using the Point-in-time Restore (PITR) feature of Azure SQL Database." 
   services="sql-database" 
   documentationCenter="" 
   authors="carlrabeler" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="06/16/2016"
   ms.author="carlrab"/>

# Recover an Azure SQL Database from an error

Azure SQL Database offers two core capabilities for recovering from user error or unintended data modification.

- [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore)  
- [Restore deleted database](sql-database-recovery-using-backups.md#deleted-database-restore)

Azure SQL Database always restores to a new database when performing point-in-time restore, but can restore to the same database name when restoring from a deleted database. These restore capabilities are offered to all Basic, Standard, and Premium databases.

##Point-in-time restore

In the event of a user error or unintended data modification, point-in-time restore can be used to restore your database to any point in time within your databases retention period. 

Basic databases have 7 days of retention, Standard databases have 35 days of retention, and Premium databases have 35 days of retention. To learn more about database backup retention, please see [automated backups](sql-database-automated-backups.md).

To perform a point-in-time restore see:

- [Point in Time Restore with the Azure Portal](sql-database-point-in-time-restore-portal.md)
- [Point in Time Restore with PowerShell](sql-database-point-in-time-restore-powershell.md)
- [Point in Time Restore with REST API (createmode=PointInTimeRestore)](https://msdn.microsoft.com/library/azure/mt163685.aspx) 


## Restore a deleted database

In the event a database is deleted, Azure SQL Database allows you to restore the deleted database to the point-in-time of deletion. Azure SQL Database stores the deleted database backup for the retention period of the database.

The retention period of a deleted database is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less. To learn more about database retention, see [automated backups](sql-database-automated-backups.md).

To restore a deleted database:

- [Restore a deleted database with the Azure Portal](sql-database-restore-deleted-database-portal.md)
- [Restore a deleted database with PowerShell](sql-database-restore-deleted-database-powershell.md)
- [Restore a deleted database with REST API (createmode=Restore)](https://msdn.microsoft.com/library/azure/mt163685.aspx)


## Next steps

- For a business continuity overview, see [Business continuity overview](sql-database-business-continuity.md)
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- To learn about business continuity design and recovery scenarios, see [Continuity scenarios](sql-database-business-continuity-scenarios.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about using Active Geo-Replication, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)
