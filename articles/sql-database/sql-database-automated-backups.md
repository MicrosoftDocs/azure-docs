---
title: Azure SQL Database automatic, geo-redundant backups | Microsoft Docs
description: SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 09/25/2018
---
# Learn about automatic SQL Database backups

SQL Database automatically creates database backups and uses Azure read-access geo-redundant storage (RA-GRS) to provide geo-redundancy. These backups are created automatically and at no additional charge. You don't need to do anything to make them happen. Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. If your security rules require that your backups are available for an extended period of time, you can configure a long-term backup retention policy. For more information, see [Long-term retention](sql-database-long-term-retention.md).

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## What is a SQL Database backup?

SQL Database uses SQL Server technology to create [full](https://msdn.microsoft.com/library/ms186289.aspx), [differential](https://docs.microsoft.com/sql/relational-databases/backup-restore/differential-backups-sql-server), and [transaction log](https://msdn.microsoft.com/library/ms191429.aspx) backups for the purposes of Point-in-time restore (PITR). The transaction log backups generally occur every 5 - 10 minutes and differential backups generally occur every 12 hours, with the frequency based on the compute size and amount of database activity. Transaction log backups, with full and differential backups, allow you to restore a database to a specific point-in-time to the same server that hosts the database. The backups are stored in RA-GRS storage blobs that are replicated to a [paired data center](../best-practices-availability-paired-regions.md) for protection against a data center outage. When you restore a database, the service figures out which full, differential, and transaction log backups need to be restored.


You can use these backups to:

* Restore a database to a point-in-time within the retention period. This operation will create a new database in the same server as the original database.
* Restore a deleted database to the time it was deleted or any time within the retention period. The deleted database can only be restored in the same server where the original database was created.
* Restore a database to another geographical region. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world. 
* Restore a database from a specific long-term backup if the database has been configured with a long-term retention policy (LTR). This allows you to restore an old version of the database to satisfy a compliance request or to run an old version of the application. See [Long-term retention](sql-database-long-term-retention.md).
* To perform a restore, see [restore database from backups](sql-database-recovery-using-backups.md).

> [!NOTE]
> In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping multiple secondary databases synchronized with a primary database. 
> 

## How long are backups kept?
Each SQL Database backup has a default retention period that is based on the service tier of the database, and differs between the  [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and the [vCore-based purchasing model](sql-database-service-tiers-vcore.md). You can update the backup retention period for a database. See [Change Backup Retention Period](#how-to-change-backup-retention-period) for more details.

If you delete a database, SQL Database will keep the backups in the same way it would for an online database. For example, if you delete a Basic database that has a retention period of seven days, a backup that is four days old is saved for three more days.

If you need to keep the backups for longer than the maximum PITR retention period, you can modify the backup properties to add one or more long-term retention periods to your database. See [Long-term backup retention](sql-database-long-term-retention.md) for more details.

> [!IMPORTANT]
> If you delete the Azure SQL server that hosts SQL databases, all elastic pools and databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server. But if you configured long-term retention, the backups for the databases with LTR will not be deleted and these databases can be restored.

### PITR retention period
The default retention period for a database created using the DTU-based purchasing model depends on the service tier:

* Basic service tier is 1 week.
* Standard service tier is 5 weeks.
* Premium service tier is 5 weeks.

If you're using the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), the default backup retention period is 7 days (both on Logical Servers and Managed Instances).
On Logical Server you can [change backup retention period up to 35 days](#how-to-change-backup-retention-period). Changing backup retention period is not available in Managed Instance. 

If you reduce the current PITR retention period, all existing backups older than the new retention period will no longer be available. 

If you increase the current PITR retention period, SQL Database will keep the existing backups until the longer retention period is reached.

## How often do backups happen?
### Backups for point-in-time restore
SQL Database supports self-service for point-in-time restore (PITR) by automatically creating full backup, differential backups, and transaction log backups. Full database backups are created weekly, differential database backups are generally created every 12 hours, and transaction log backups are generally created every 5 - 10 minutes, with the frequency based on the compute size and amount of database activity. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the SQL Database service as it balances the overall system workload.

The PITR backups are geo-redundant and protected by [Azure Storage cross-regional replication](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage)

For more information, see [Point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore)

### Backups for long-term retention
SQL Database hosted in Logical Server offers the option of configuring long-term retention (LTR) of full backups for up to 10 years in Azure blob storage. If LTR policy is enabled, the weekly full backups are automatically copied to a different RA-GRS storage container. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. The storage consumption depends on the selected frequency of backups and the retention period(s). You can use the [LTR pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=sql-database) to estimate the cost of LTR storage. 

Like PITR, the LTR backups are geo-redundant and protected by [Azure Storage cross-regional replication](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage).

For more information, see [Long-term backup retention](sql-database-long-term-retention.md).

## Are backups encrypted?

If your database is encrypted with TDE, the backups are automatically encrypted at rest, including LTR backups. When TDE is enabled for an Azure SQL database, backups are also encrypted. All new Azure SQL databases are configured with TDE enabled by default. For more information on TDE, see  [Transparent Data Encryption with Azure SQL Database](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql).

## How does Microsoft ensure backup integrity

On an ongoing basis, the Azure SQL Database engineering team automatically tests the restore of automated database backups of databases across the service. Upon restore, databases also receive integrity checks using DBCC CHECKDB. Any issues found during the integrity check will result in an alert to the engineering team. For more information about data integrity in Azure SQL Database, see [Data Integrity in Azure SQL Database](https://azure.microsoft.com/blog/data-integrity-in-azure-sql-database/).

## How do automated backups impact my compliance?

When you migrate your database from a DTU-based service tier with the default PITR retention of 35 days, to a vCore-based service tier, the PITR retention is preserved to ensure that your application's data recovery policy is not compromised. If the default retention doesn't meet your compliance requirements, you can change the PITR retention period using PowerShell or REST API. See [Change Backup Retention Period](#how-to-change-backup-retention-period) for more details.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## How to change backup retention period

> [!Note]
> Default backup retention period (7 days) cannot be changed on Managed Instance. 

You can change the default retention using REST API or PowerShell. The supported values are: 7, 14, 21, 28 or 35 days. The following examples illustrate how to change PITR retention to 28 days. 

> [!NOTE]
> Thes APIs will only impact the PITR retention period. If you configured LTR for your database, it will not be impacted. See [Long-term backup retention](sql-database-long-term-retention.md) for details of how to change the LTR retention period(s).

### Change PITR backup retention period using PowerShell
```powershell
Set-AzureRmSqlDatabaseBackupShortTermRetentionPolicy -ResourceGroupName resourceGroup -ServerName testserver -DatabaseName testDatabase -RetentionDays 28
```
> [!IMPORTANT]
> This API is included in AzureRM.Sql PowerShell Module starting from version [4.7.0-preview](https://www.powershellgallery.com/packages/AzureRM.Sql/4.7.0-preview). 

### Change PITR retention period using REST API
**Sample Request**
```http
PUT https://management.azure.com/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/resourceGroup/providers/Microsoft.Sql/servers/testserver/databases/testDatabase/backupShortTermRetentionPolicies/default?api-version=2017-10-01-preview
```
**Request Body**
```json
{
  "properties":{  
      "retentionDays":28
   }
}
```
**Sample Response**

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
See [Backup Retention REST API](https://docs.microsoft.com/rest/api/sql/backupshorttermretentionpolicies) for more details.

## Next steps

- Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](sql-database-recovery-using-backups.md).
- To restore to a point in time using PowerShell, see [restore database to a point in time using PowerShell](scripts/sql-database-restore-database-powershell.md).
- To configure, manage, and restore from long-term retention of automated backups in Azure blob storage using the Azure portal, see [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md).
- To configure, manage, and restore from long-term retention of automated backups in Azure blog storage using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).
