<properties
   pageTitle="Cloud business continuity - Builit-in backup - SQL Database | Microsoft Azure"
   description="Learn about SQL Database builit-in backups that enable you to roll back an Azure SQL Database to a previous point in time or copy a database to a new database in an geographic region (up to 35 days)."
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
   ms.workload="sqldb-features"
   ms.date="06/16/2016"
   ms.author="carlrab"/>

# Overview: SQL Database automated backups

The Azure SQL Database service protects all databases with an automated backup that is retained for 7 days for Basic, 14 days for Standard, and 35 days for Premium. You can use these automated backup to perform point-in-time restores and to restore a deleted database after accidental data corruption or deletion.

The database backups are taken automatically with no need to opt-in and no additional charges. These automated backups and point-in-time restore provide a zero-cost, zero-admin way to protect databases from accidental corruption or deletion, whatever the cause.

## Automated backup costs

Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you will be provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. 

## Automatic backup details

All Basic, Standard, and Premium databases are protected by automatic backups. Full backups are taken every week, differential backups every day, and log backups every 5 minutes. The first full backup is scheduled immediately after a database is created. Normally this completes within 30 minutes but it can take longer. If a database is already big, for example if it is created as the result of a database copy or restore from a large database, then the first full backup may take longer to complete. After the first full backup all further backups are scheduled automatically and managed silently in the background. Exact timing of full and differential backups is determined by the system to balance overall load. Backup files are stored in a geo-redundant storage account with read access (RA-GRS) to ensure availability for disaster recovery purposes.

## Next steps

- [Business continuity overview](sql-database-business-continuity.md)
- [Restore a deleted database](sql-database-restore-deleted-database.md)
- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Database copy](sql-database-copy.md)

## Additional resources

- [Recover from an outage](sql-database-disaster-recovery.md)
- [Recover from a user error](sql-database-user-error-recovery.md)
- [Performing a disaster recovery drill](sql-database-disaster-recovery-drills.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)