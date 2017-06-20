---
title: Azure SQL Database backups-automatic, geo-redundant | Microsoft Docs
description: SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy.
services: sql-database
documentationcenter: ''
author: anosov1960
manager: jhubbard
editor: ''

ms.assetid: 3ee3d49d-16fa-47cf-a3ab-7b22aa491a8d
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2016
ms.author: sashan

---
# Learn about SQL Database backups

SQL Database automatically creates a database backups and uses Azure read-access geo-redundant storage (RA-GRS) to provide geo-redundancy. These backups are created automatically and at no additional charge. You don't need to do anything to make them happen. Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. If you want to keep backups in your own storage container you can configure a long-term backup retention policy. For more information, see [Long-term retention](sql-database-long-term-retention.md).

## What is a SQL Database backup?

SQL Database uses SQL Server technology to create [full](https://msdn.microsoft.com/library/ms186289.aspx), [differential](https://msdn.microsoft.com/library/ms175526.aspx), and [transaction log](https://msdn.microsoft.com/library/ms191429.aspx) backups. The transaction log backups generally happen every 5 - 10 minutes, with the frequency based on the performance level and amount of database activity. Transaction log backups, with full and differential backups, allow you to restore a database to a specific point-in-time to the same server that hosts the database. When you restore a database, the service figures out which full, differential, and transaction log backups need to be restored.


You can use these backups to:

* Restore a database to a point-in-time within the retention period. This operation will create a new database in the same server as the original database.
* Restore a deleted database to the time it was deleted or any time within the retention period. The deleted database can only be restored in the same server where the original database was created.
* Restore a database to another geographical region. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world. 
* Restore a database from a specific backup stored in your Azure Recovery Services vault. This allows you to restore an old version of the database to satisfy a compliance request or to run an old version of the application. See [Long-term retention](sql-database-long-term-retention.md).
* To perform a restore, see [restore database from backups](sql-database-recovery-using-backups.md).

> [!NOTE]
> In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping to multiple secondary databases synchronized with a primary database. 
> 
> 

## How much backup storage is included at no cost?
SQL Database provides up to 200% of your maximum provisioned database storage as backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you have 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support. Another option is to pay for extra backup storage that is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate. 

## How often do backups happen?
Full database backups happen weekly, differential database backups generally happen every few hours, and transaction log backups generally happen every 5 - 10 minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the SQL Database service as it balances the overall system workload. 

The backup storage geo-replication occurs based on the Azure Storage replication schedule.

## How long do you keep my backups?
Each SQL Database backup has a retention period that is based on the [service-tier](sql-database-service-tiers.md) of the database. The retention period for a database in the:


* Basic service tier is 7 days.
* Standard service tier is 35 days.
* Premium service tier is 35 days.

If you downgrade your database from the Standard or Premium service tiers to Basic, the backups are saved for seven days. All existing backups older than seven days are no longer available. 

If you upgrade your database from the Basic service tier to Standard or Premium, SQL Database keeps existing backups until they are 35 days old. It keeps new backups as they occur for 35 days.

If you delete a database, SQL Database keeps the backups in the same way it would for an online database. For example, suppose you delete a Basic database that has a retention period of seven days. A backup that is four days old is saved for three more days.

> [!IMPORTANT]
> If you delete the Azure SQL server that hosts SQL Databases, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.
> 
> 

## How to extend the backup retention period?
If your application requires that the backups are available for longer period of time you can extend the built-in retention period by configuring the Long-term backup retention policy for individual databases (LTR policy). This allows you to extend the built-it retention period from 35 days to up to 10 years. For more information, see [Long-term retention](sql-database-long-term-retention.md).

Once you add the LTR policy to a database using Azure portal or API, the weekly full database backups will be automatically copied to your own Azure Backup Service Vault. If your database is encrypted with TDE the backups are automatically encrypted at rest.  The Services Vault will automatically delete your expired backups based on their timestamp and the LTR policy.  So you don't need to manage the backup schedule or worry about the cleanup of the old files. 
The restore API supports backups stored in the vault as long as the vault is in the same subscription as your SQL database. You can use the Azure portal or PowerShell to access these backups.

> [!TIP]
> For a How-to guide, see [Configure and restore from Azure SQL Database long-term backup retention](sql-database-long-term-backup-retention-configure.md)
>

## Next steps

- Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](sql-database-recovery-using-backups.md).
- To restore to a point in time using PowerShell, see [restore database to a point in time using PowerShell](scripts/sql-database-restore-database-powershell.md).
- To configure, manage, and restore from long-term retention of automated backups in an Azure Recovery Services vault using the Azure portal, see [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md).
- To configure, manage, and restore from long-term retention of automated backups in an Azure Recovery Services vault using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).
