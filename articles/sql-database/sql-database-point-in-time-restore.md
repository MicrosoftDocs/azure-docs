<properties
   pageTitle="Cloud business continuity - Point-in-Time Restore - SQL Database | Microsoft Azure"
   description="Learn about Point-in-Time Restore, that enables you to roll back an Azure SQL Database to a previous point in time (up to 35 days)."
   services="sql-database"
   documentationCenter=""
   authors="stevestein"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="05/10/2016"
   ms.author="sstein"/>

# Overview: SQL Database point-in-time restore

> [AZURE.SELECTOR]
- [Overview](sql-database-point-in-time-restore.md)
- [Azure portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

Point-in-time restore allows you to restore a database to an earlier point in time using [SQL Database automated backups](sql-database-automated-backups.md). You can restore to an earlier point in time using the [Azure portal](sql-database-point-in-time-restore-portal.md), [PowerShell](sql-database-point-in-time-restore-powershell.md) or the [REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx).

The database can be restored to any performance level or elastic pool. You need to ensure you have sufficient DTU quota on the server or pool keeping in mind that the restore creates a new database and that the service tier and performance level of the restored database may be different than the current state of the live database. Once complete, the restored database is a normal fully accessible online database charged at normal rates based on its service tier and performance level. If you are restoring the database for recovery purposes you can treat the restored database as a replacement for the original database, or use it to retrieve data from and then update the original database. If the restored database is intended as a replacement for the original database, you should verify the performance level and/or service tier are appropriate and scale the database if necessary. You can rename the original database and then give the restored database the original name using the ALTER DATABASE command in T-SQL. If you plan to retrieve data from the restored database, you will separately need to write and execute whatever data recovery scripts you need. Although the restore operation may take a long time to complete the database will be visible in the database list throughout. If you delete the database during the restore it will cancel the operation and you will not be charged. 

## Recovery time for a point-in-time restore

The time taken to restore a database depends on many factors, including the size of the database, the time point selected, and the amount of activity that needs to be replayed to reconstruct the state at the selected point. For a very large and/or active database the restore may take several hours. Restoring a database always creates a new database on the same server as the original database, so the restored database must be given a new name. 

## Backup/Restore vs. Copy/Export/Import

Point-in-time restore is the recommended approach for recovering Basic, Standard, and Premium databases from accidental data loss or corruption. Backup and restore is lower cost (there are no charges for backups unless they are excessive, whereas you are charged for the database copy needed to ensure a transactional consistent export and for storing the BACPAC file), zero admin (backups are automatic, whereas you must manage or schedule exports yourself) and has a better RPO (you can restore to a specific point in time with much finer (one minute) granularity than is practical with copy/export/import) and a better recovery time (restore from backups is typically much faster than import, which involves steps to create the schema, disable indexes, load data, and then enable indexes for each table individually). Note that copy and export continues to be the recommended solution for long term archival beyond the retention period.  


## Summary

Automatic backups and point-in-time restore protect your databases from accidental data corruption or data deletion. This zero-cost zero-admin solution is available with all SQL databases. Backup and restore provides a significant improvement over the alternative copy/export/import solution for short term recovery needs. We encourage you to use point-in-time restore as part of your business continuity strategy, and only to use export as needed for longer term archival or data migration purposes.


## Next steps

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Point-in-time restore using the Azure portal](sql-database-point-in-time-restore-portal.md)
- [Point-in-time restore using](sql-database-point-in-time-restore-powershell.md)
- [Point-in-time restore using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx)
- [SQL Database automated backups](sql-database-automated-backups.md)


## Additional resources

- [Restore a deleted database](sql-database-restore-deleted-database.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
