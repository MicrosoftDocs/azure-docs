<properties
   pageTitle="Cloud business continuity - Point-in-Time Restore | Microsoft Azure"
   description="Learn about Point-in-Time Restore, that enables you to roll back an Azure SQL Database to a previous point in time (up to 35 days)."
   keywords="business continuity,cloud business continuity,database disaster recovery,database recovery"
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
   ms.date="05/01/2016"
   ms.author="sstein"/>

# Overview: SQL Database Point-in-Time Restore

Point-in-time restore allows you to restore a database to an earlier point in time.

The Azure SQL Database service protects all databases with an automated backup that is retained for 7 days for Basic, 14 days for Standard, and 35 days for Premium. Point-in-time restore is designed for recovering your database from these backups after accidental data corruption or deletion.

The database backups are taken automatically with no need to opt-in and no additional charges. These automated backups and point-in-time restore provide a zero-cost, zero-admin way to protect databases from accidental corruption or deletion, whatever the cause.


|Task (Portal) | PowerShell | REST |
|:--|:--|:--|
| [Restore a SQL database to a previous point in time](sql-database-point-in-time-restore-portal.md) |  [PowerShell](sql-database-point-in-time-restore-powershell.md) | [REST (createMode=PointInTimeRestore)](https://msdn.microsoft.com/library/azure/mt163685.aspx) |
| [Restore a deleted SQL database](sql-database-restore-deleted-databaase-portal.md) |  [PowerShell](sql-database-restore-deleted-database-powershell.md) | [REST (createMode=Restore)](https://msdn.microsoft.com/library/azure/mt163685.aspx)|



## Understanding automatic backups

All Basic, Standard, and Premium databases are protected by automatic backups. Full backups are taken every week, differential backups every day, and log backups every 5 minutes. The first full backup is scheduled immediately after a database is created. Normally this completes within 30 minutes but it can take longer. If a database is already big, for example if it is created as the result of a database copy or restore from a large database, then the first full backup may take longer to complete. After the first full backup all further backups are scheduled automatically and managed silently in the background. Exact timing of full and differential backups is determined by the system to balance overall load. Backup files are stored in a geo-redundant storage account with read access (RA-GRS) to ensure availability for disaster recovery purposes.


## Recovery time for a point-in-time restore

The time taken to restore a database depends on many factors, including the size of the database, the time point selected, and the amount of activity that needs to be replayed to reconstruct the state at the selected point. For a very large and/or active database the restore may take several hours. Restoring a database always creates a new database on the same server as the original database, so the restored database must be given a new name. The database is restored using the service tier that was applicable at the restore point with its default performance level. You need to ensure you have sufficient DTU quota on the server keeping in mind that the restore creates a new database and that the service tier and performance level of the restored database may be different than the current state of the live database. Once complete, the restored database is a normal fully accessible online database charged at normal rates based on its service tier and performance level. If you are restoring the database for recovery purposes you can treat the restored database as a replacement for the original database, or use it to retrieve data from and then update the original database. If the restored database is intended as a replacement for the original database you should verify the performance level and/or service tier are appropriate and scale the database if necessary. You can rename the original database and then give the restored database the original name using the ALTER DATABASE command in T-SQL. If you plan to retrieve data from the restored database you will separately need to write and execute whatever data recovery scripts you need. Although the restore operation may take a long time to complete the database will be visible in the database list throughout. If you delete the database during the restore it will cancel the operation and you will not be charged. 



## Restoring a Recently Deleted Database

If you delete a Basic, Standard, or Premium database the final backup is retained for the normal retention period allowing you to restore the database to the point at which it was deleted.

For deleted databases the restore point is fixed to the deletion time of the database. And as before, when restoring a deleted database, it can only be restored to the server that contained the original database. Be mindful of this when deleting a server as you will not be able to restore databases previously located on that server once it is deleted. 

## Backup/Restore vs. Copy/Export/Import

Point-in-time restore is the recommended approach for recovering Basic, Standard, and Premium databases from accidental data loss or corruption. Backup and restore is lower cost (there are no charges for backups unless they are excessive, whereas you are charged for the database copy needed to ensure a transactional consistent export and for storing the BACPAC file), zero admin (backups are automatic, whereas you must manage or schedule exports yourself) and has a better RPO (you can restore to a specific point in time with much finer (one minute) granularity than is practical with copy/export/import) and a better recovery time (restore from backups is typically much faster than import, which involves steps to create the schema, disable indexes, load data, and then enable indexes for each table individually). Note that copy and export continues to be the recommended solution for long term archival beyond the retention period.  


## Summary

Automatic backups and point-in-time restore protect your databases from accidental data corruption or deletion. This zero-cost zero-admin solution is available with all SQL databases. Backup and restore provides a significant improvement over the alternative copy/export/import solution for short term recovery needs. We encourage you to use point-in-time restore as part of your business continuity strategy, and only to use export as needed for longer term archival or data migration purposes.



## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)


