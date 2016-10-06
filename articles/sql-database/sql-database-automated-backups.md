<properties
   pageTitle="SQL Database backups | Microsoft Azure"
   description="Learn about SQL Database built-in database backups that enable you to roll back an Azure SQL Database to a previous point in time or copy a database to a new database in an geographic region (up to 35 days)."
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/26/2016"
   ms.author="carlrab"/>

# SQL Database backups

SQL Database creates database backups automatically as part of the service offering, with no requirement to opt in and no additional cost. Use database backups to restore a database to a previous point in time. This article explains the specifics of the database backup feature in SQL Database.

## What is a database backup?  

A database backup is a file that stores information about the state of the database at a specific point-in-time. SQL Database creates [full](https://msdn.microsoft.com/library/ms186289.aspx), [differential](https://msdn.microsoft.com/library/ms175526.aspx ), and [transaction log](https://msdn.microsoft.com/library/ms191429.aspx) backups. When you restore a database to a point-in-time, the service figures out which backups need to be restored.

Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. For more information, see [Business continuity overview](sql-database-business-continuity.md).

## Geo-redundant storage

The SQL Database service stores database backup files in a geo-redundant storage account with read access (RA-GRS). The Azure Storage RA-GRS feature replicates the backup files to a [paired data center](../best-practices-availability-paired-regions.md). This geo-replication ensures you can restore a database in case you cannot access the database backup from your primary database region. In the following example, SQL Database creates database backups in the US East region and stores them in a RA-GRS account. Then, Azure Storage geo-replicates the backups to a paired data center in the US West region. 

![geo-restore](./media/sql-database-geo-restore/geo-restore-1.png)

>[AZURE.NOTE] In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping to multiple secondary databases synchronized with a primary database. 

To learn more about:
- Geo-redundant storage, see [Azure Storage replication](../storage/storage-redundancy.md).
- RA-GRS storage, see [Read-access geo-redundant storage](../storage/storage-redundancy.md#read-access-geo-redundant-storage).

## Database backup costs

Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage as backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you have 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support. Another option is to pay for extra backup storage that is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate. 

## Database backup schedule

All Basic, Standard, and Premium databases are protected by automatic backups. Full database backups are taken every week, differential database backups are taken hourly, and transaction log backups are taken every five minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of full and [differential](https://msdn.microsoft.com/library/ms175526.aspx) database backups is determined as it balances the overall system workload. 

## Database backup retention period

Each SQL Database backup is retained for 7 days for Basic, 35 days for Standard, and 35 days for Premium. For more information on features available with each service tier, see [Service-tiers](sql-database-service-tiers.md). 

### What happens to my restore point retention period when I downgrade/upgrade by service tier?

After downgrading to a lower performance tier, the restore point’s retention period is immediately truncated to the retention period of the performance tier of the current database. If the service tier is upgraded, the retention period will begin extending only after the database is upgraded. For example, if a database is downgraded to Basic, the retention period changes from 35 days to 7 days. Immediately, all the restore points older than seven days are not available. When you upgrade a database Standard or Premium, the retention period begins with 7 days and grows until it reaches 35 days.

### How long is the retention period for a dropped DB? 

The retention period is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less.

> [AZURE.IMPORTANT] If you delete an Azure SQL Database server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.


## Common uses for database backups

The primary use for database backups is to be able to restore a database to a point-in-time within the retention period. With a database backup you can restore a database to a point-in-time, restore a deleted database to the time it was deleted, or restore a database to another geographical region. 

- To learn about database restore, see [restore a database from automated backups](sql-database-recovery-using-backups.md).

You can use a database backup to copy a database to a logical SQL server in any geographical region. The copy is transactionally consistent with the current SQL Database. 

- To learn about copying a database, see [database copy](sql-database-copy.md).

You can also archive automated backups beyond the retention period by creating a database copy that you [export to a BACPAC](sql-database-export.md) file. Once you have the BACPAC file, you can archive it to long-term storage and store it beyond your retention period. Or, use the BACPAC to transfer a copy of your database to SQL Server, either on-premises or in an Azure virtual machine (VM).

- To learn about archiving a database backup, see [database copy](sql-database-copy.md)


## Related topics

### Scenarios

- For a business continuity overview, see [Business continuity overview](sql-database-business-continuity.md)

### Features

To learn about:

- Restoring a database backup, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
- Archiving a database backup, see [database copy](sql-database-copy.md).
- Faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md).

<!-- ### Tasks -->

<!-- ### Tutorials -->

