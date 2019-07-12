---
title: Azure SQL Database automatic, geo-redundant backups | Microsoft Docs
description: SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy.
services: sql-database
ms.service: sql-database
ms.subservice: backup-restore
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
manager: craigg
ms.date: 06/27/2019
---
# Automated backups

SQL Database automatically creates the database backups that are kept between 7 and 35 days, and uses Azure [read-access geo-redundant storage (RA-GRS)](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage) to ensure that they are preserved even if the data center is unavailable. These backups are created automatically. Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. If your security rules require that your backups are available for an extended period of time (up to 10 years), you can configure a [long-term retention](sql-database-long-term-retention.md) on Singleton databases and Elastic pools.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## What is a SQL Database backup

SQL Database uses SQL Server technology to create [full backups](https://docs.microsoft.com/sql/relational-databases/backup-restore/full-database-backups-sql-server) every week, [differential backups](https://docs.microsoft.com/sql/relational-databases/backup-restore/differential-backups-sql-server) every 12 hours, and [transaction log backups](https://docs.microsoft.com/sql/relational-databases/backup-restore/transaction-log-backups-sql-server) every 5-10 minutes. The backups are stored in [RA-GRS storage blobs](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage) that are replicated to a [paired data center](../best-practices-availability-paired-regions.md) for protection against a data center outage. When you restore a database, the service figures out which full, differential, and transaction log backups need to be restored.

You can use these backups to:

- **Restore an existing database to a point-in-time in the past** within the retention period using the Azure portal, Azure PowerShell, Azure CLI, or REST API. In Single database and Elastic pools, this operation will create a new database in the same server as the original database. In Managed Instance, this operation can create a copy of the database or same or different Managed Instance under the same subscription.
  - **[Change Backup Retention Period](#how-to-change-the-pitr-backup-retention-period)** between 7 to 35 days to configure your backup policy.
  - **Change long-term retention policy up to 10 years** on Single Database and Elastic Pools using [the Azure portal](sql-database-long-term-backup-retention-configure.md#configure-long-term-retention-policies) or [Azure PowerShell](sql-database-long-term-backup-retention-configure.md#use-powershell-to-configure-long-term-retention-policies-and-restore-backups).
- **Restore a deleted database to the time it was deleted** or anytime within the retention period. The deleted database can only be restored in the same logical server or Managed Instance where the original database was created.
- **Restore a database to another geographical region**. Geo-restore allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world.
- **Restore a database from a specific long-term backup** on Single Database or Elastic Pool if the database has been configured with a long-term retention policy (LTR). LTR allows you to restore an old version of the database using [the Azure portal](sql-database-long-term-backup-retention-configure.md#view-backups-and-restore-from-a-backup-using-azure-portal) or [Azure PowerShell](sql-database-long-term-backup-retention-configure.md#use-powershell-to-configure-long-term-retention-policies-and-restore-backups) to satisfy a compliance request or to run an old version of the application. For more information, see [Long-term retention](sql-database-long-term-retention.md).
- To perform a restore, see [restore database from backups](sql-database-recovery-using-backups.md).

> [!NOTE]
> In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping multiple secondary databases synchronized with a primary database.

You can try some of these operations using the following examples:

| | The Azure portal | Azure PowerShell |
|---|---|---|
| Change backup retention | [Single Database](sql-database-automated-backups.md#change-pitr-backup-retention-period-using-the-azure-portal) <br/> [Managed Instance](sql-database-automated-backups.md#change-pitr-for-a-managed-instance) | [Single Database](sql-database-automated-backups.md#change-pitr-backup-retention-period-using-powershell) <br/>[Managed Instance](https://docs.microsoft.com/powershell/module/az.sql/set-azsqlinstancedatabasebackupshorttermretentionpolicy) |
| Change Long-term backup retention | [Single database](sql-database-long-term-backup-retention-configure.md#configure-long-term-retention-policies)<br/>Managed Instance - N/A  | [Single Database](sql-database-long-term-backup-retention-configure.md#use-powershell-to-configure-long-term-retention-policies-and-restore-backups)<br/>Managed Instance - N/A  |
| Restore database from point-in-time | [Single database](sql-database-recovery-using-backups.md#point-in-time-restore) | [Single database](https://docs.microsoft.com/powershell/module/az.sql/restore-azsqldatabase) <br/> [Managed Instance](https://docs.microsoft.com/powershell/module/az.sql/restore-azsqlinstancedatabase) |
| Restore deleted database | [Single database](sql-database-recovery-using-backups.md#deleted-database-restore-using-the-azure-portal) | [Single database](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldeleteddatabasebackup) <br/> [Managed Instance](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldeletedinstancedatabasebackup)|
| Restore database from Azure Blob Storage | Single database - N/A <br/>Managed Instance - N/A  | Single database - N/A <br/>[Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-get-started-restore) |

## How long are backups kept

Each SQL Database has a default backup retention period between 7 and 35 days that depends on the purchasing model and service tier. You can update the backup retention period for a database on SQL Database server. For more information, see [Change Backup Retention Period](#how-to-change-the-pitr-backup-retention-period).

If you delete a database, SQL Database will keep the backups in the same way it would for an online database. For example, if you delete a Basic database that has a retention period of seven days, a backup that is four days old is saved for three more days.

If you need to keep the backups for longer than the maximum retention period, you can modify the backup properties to add one or more long-term retention periods to your database. For more information, see [Long-term retention](sql-database-long-term-retention.md).

> [!IMPORTANT]
> If you delete the Azure SQL server that hosts SQL databases, all elastic pools and databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server. But if you configured long-term retention, the backups for the databases with LTR will not be deleted and these databases can be restored.

### Default backup retention period

#### DTU-based purchasing model

The default retention period for a database created using the DTU-based purchasing model depends on the service tier:

- Basic service tier is **one** week.
- Standard service tier is **five** weeks.
- Premium service tier is **five** weeks.

#### vCore-based purchasing model

If you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), the default backup retention period is **seven** days (for single, pooled, and instance databases). For all Azure SQL databases (single, pooled, and instance databases, you can [change backup retention period up to 35 days](#how-to-change-the-pitr-backup-retention-period).

> [!WARNING]
> If you reduce the current retention period, all existing backups older than the new retention period are no longer available. If you increase the current retention period, SQL Database will keep the existing backups until the longer retention period is reached.

## How often do backups happen

### Backups for point-in-time restore

SQL Database supports self-service for point-in-time restore (PITR) by automatically creating full backup, differential backups, and transaction log backups. Full database backups are created weekly, differential database backups are generally created every 12 hours, and transaction log backups are generally created every 5 - 10 minutes, with the frequency based on the compute size and amount of database activity. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the SQL Database service as it balances the overall system workload. You cannot change or disable the backup jobs. 

The PITR backups are geo-redundant and protected by [Azure Storage cross-regional replication](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage)

For more information, see [Point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore)

### Backups for long-term retention

Single and pooled databases offer the option of configuring long-term retention (LTR) of full backups for up to 10 years in Azure Blob storage. If LTR policy is enabled, the weekly full backups are automatically copied to a different RA-GRS storage container. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. The storage consumption depends on the selected frequency of backups and the retention period(s). You can use the [LTR pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=sql-database) to estimate the cost of LTR storage.

Like PITR, the LTR backups are geo-redundant and protected by [Azure Storage cross-regional replication](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage).

For more information, see [Long-term backup retention](sql-database-long-term-retention.md).

## Storage costs
Seven days of automated backups of your databases are copied to RA-GRS Standard blob storage by default. The storage is used by weekly full backups, daily differential backups, and transaction log backups copied every 5 minutes. The size of the transaction log depends on the rate of change of the database. A minimum storage amount equal to 100% of database size is provided at no extra charge. Additional consumption of backup storage will be charged in GB/month.

For more information about storage prices, see the [pricing](https://azure.microsoft.com/pricing/details/sql-database/single/) page. 

## Are backups encrypted

If your database is encrypted with TDE, the backups are automatically encrypted at rest, including LTR backups. When TDE is enabled for an Azure SQL database, backups are also encrypted. All new Azure SQL databases are configured with TDE enabled by default. For more information on TDE, see  [Transparent Data Encryption with Azure SQL Database](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql).

## How does Microsoft ensure backup integrity

On an ongoing basis, the Azure SQL Database engineering team automatically tests the restore of automated database backups of databases placed in Logical servers and Elastic pools (this is not available in Managed Instance). Upon point-in-time restore, databases also receive integrity checks using DBCC CHECKDB.

Managed Instance takes automatic initial backup with `CHECKSUM` of the databases restored using native `RESTORE` command or Data Migration Service once the migration is completed.

Any issues found during the integrity check will result in an alert to the engineering team. For more information about data integrity in Azure SQL Database, see [Data Integrity in Azure SQL Database](https://azure.microsoft.com/blog/data-integrity-in-azure-sql-database/).

## How do automated backups impact compliance

When you migrate your database from a DTU-based service tier with the default PITR retention of 35 days, to a vCore-based service tier, the PITR retention is preserved to ensure that your application's data recovery policy is not compromised. If the default retention doesn't meet your compliance requirements, you can change the PITR retention period using PowerShell or REST API. For more information, see [Change Backup Retention Period](#how-to-change-the-pitr-backup-retention-period).

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## How to change the PITR backup retention period

You can change the default PITR backup retention period using the Azure portal, PowerShell, or the REST API. The supported values are: 7, 14, 21, 28 or 35 days. The following examples illustrate how to change PITR retention to 28 days.

> [!NOTE]
> These APIs will only impact the PITR retention period. If you configured LTR for your database, it will not be impacted. For more information about how to change the LTR retention period(s), see [Long-term retention](sql-database-long-term-retention.md).

### Change PITR backup retention period using the Azure portal

To change the PITR backup retention period using the Azure portal, navigate to the server object whose retention period you wish to change within the portal and then select the appropriate option based on which server object you're modifying.

#### Change PITR for a SQL Database server

![Change PITR Azure portal](./media/sql-database-automated-backup/configure-backup-retention-sqldb.png)

#### Change PITR for a Managed Instance

![Change PITR Azure portal](./media/sql-database-automated-backup/configure-backup-retention-sqlmi.png)

### Change PITR backup retention period using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

```powershell
Set-AzSqlDatabaseBackupShortTermRetentionPolicy -ResourceGroupName resourceGroup -ServerName testserver -DatabaseName testDatabase -RetentionDays 28
```

### Change PITR retention period using REST API

#### Sample Request

```http
PUT https://management.azure.com/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/resourceGroup/providers/Microsoft.Sql/servers/testserver/databases/testDatabase/backupShortTermRetentionPolicies/default?api-version=2017-10-01-preview
```

#### Request Body

```json
{
  "properties":{
    "retentionDays":28
  }
}
```

#### Sample Response

Status code: 200

```json
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/providers/Microsoft.Sql/resourceGroups/resourceGroup/servers/testserver/databases/testDatabase/backupShortTermRetentionPolicies/default",
  "name": "default",
  "type": "Microsoft.Sql/resourceGroups/servers/databases/backupShortTermRetentionPolicies",
  "properties": {
    "retentionDays": 28
  }
}
```

For more information, see [Backup Retention REST API](https://docs.microsoft.com/rest/api/sql/backupshorttermretentionpolicies).

## Next steps

- Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](sql-database-recovery-using-backups.md).
- To restore to a point in time using PowerShell, see [restore database to a point in time using PowerShell](scripts/sql-database-restore-database-powershell.md).
- To configure, manage, and restore from long-term retention of automated backups in Azure Blob storage using the Azure portal, see [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md).
- To configure, manage, and restore from long-term retention of automated backups in Azure Blob storage using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).
