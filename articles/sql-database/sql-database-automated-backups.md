<properties
   pageTitle="Cloud business continuity - Built-in backup - SQL Database | Microsoft Azure"
   description="Learn about SQL Database built-in backups that enable you to roll back an Azure SQL Database to a previous point in time or copy a database to a new database in an geographic region (up to 35 days)."
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
   ms.date="09/22/2016"
   ms.author="carlrab"/>

# SQL Database automated backups

An automated backup is a database backup that the service performs automatically with no need to opt in and no additional charges. This article gives the description, benefits, and common use cases for the **automated backup** feature in SQL Database. 

## Description  

An automated backup is a database backup that the service performs automatically with no need to opt in and no additional charges. You can restore an automated backup to a point in time. These automated backups and point-in-time restore provide a zero-cost, zero-admin way to protect databases from accidental corruption or deletion, whatever the cause. 

Backup files are stored in a geo-redundant storage account with read access (RA-GRS) to ensure availability for disaster recovery purposes. This storage feature ensures that the backup files are replicated to a [paired data center](../best-practices-availability-paired-regions.md). The following shows the geo-replication of weekly and daily backups stored in a geo-redundant storage account with read access (RA-GRS) to ensure availability for disaster recovery purposes.

![geo-restore](./media/sql-database-geo-restore/geo-restore-1.png)

### Automated backup costs

Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you have 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support. Another option is to pay for extra backup storage that is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate. 

### Automated backup schedule

All Basic, Standard, and Premium databases are protected by automatic backups. Full database backups are taken every week, differential database backups are taken hourly, and transaction log backups are taken every five minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. Exact timing of full and differential backups is determined by the system to balance overall load. 

### Automated backup retention period

An automated backup is retained for 7 days for Basic, 35 days for Standard, and 35 days for Premium. For more information on features available with each service tier, see [Service-tiers](sql-database-service-tiers.md). 

**What happens to my restore point retention period when I downgrade/upgrade by service tier?**

After downgrading to a lower performance tier, the restore point’s retention period is immediately truncated to the retention period of the performance tier of the current database. If the service tier is upgraded, the retention period will begin extending only after the database is upgraded. For example, if a database is downgraded to Basic, the retention period changes from 35 days to 7 days. Immediately, all the restore points older than seven days are not available. When you upgrade a database Standard or Premium, the retention period begins with 7 days and grows until it reaches 35 days.

**How long is the retention period for a dropped DB?** 

The retention period is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less.

> [AZURE.IMPORTANT] If you delete an Azure SQL Database server instance, all databases that belong to the instance are also deleted and cannot be recovered. You cannot restore a deleted server.

## Benefits

Automated backups are provided as part of the service to make sure you always have a database backup in case you need to restore deleted or corrupted data.

## Common uses
You can [restore a database from automated backups](sql-database-recovery-using-backups.md) during their [retention period](sql-database-service-tiers.md). You can:

- restore a database to a point-in-time
- restore a deleted database
- restore a database to another geographical region 

You can use an automated backup to create a [database copy](sql-database-copy.md) on a logical server in any geographical region. The copy is transactionally consistent with the current SQL Database. 

You can use [export to a BACPAC](sql-database-export.md) to archive the database copy to long-term storage and store it beyond your retention period. Or, use the BACPAC to transfer a copy of your database to SQL Server, either on-premises or in an Azure virtual machine (Vm). 


## Related topics

<!-- ### Tasks -->

<!-- ### Tutorials -->

### Scenarios

- For a business continuity overview, see [Business continuity overview](sql-database-business-continuity.md)

### Features

- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md) 

