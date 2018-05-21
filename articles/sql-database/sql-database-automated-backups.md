---
title: Azure SQL Database automatic, geo-redundant backups | Microsoft Docs
description: SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy.
services: sql-database
author: anosov1960
manager: craigg
ms.service: sql-database
ms.custom: business continuity
ms.topic: article
ms.workload: "Active"
ms.date: 05/18/2018
ms.author: sashan
ms.reviewer: carlrab

---
# Learn about automatic SQL Database backups

SQL Database automatically creates database backups and uses Azure read-access geo-redundant storage (RA-GRS) to provide geo-redundancy. These backups are created automatically and at no additional charge. You don't need to do anything to make them happen. Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. If you want to keep backups in your own storage container you can configure a long-term backup retention policy. For more information, see [Long-term retention](sql-database-long-term-retention.md).

## What is a SQL Database backup?

SQL Database uses SQL Server technology to create [full](https://msdn.microsoft.com/library/ms186289.aspx), [differential](http://msdn.microsoft.com/library/ms175526.aspx), and [transaction log](https://msdn.microsoft.com/library/ms191429.aspx) backups for the purposes of Point-in-time restore (PITR). The transaction log backups generally happen every 5 - 10 minutes, with the frequency based on the performance level and amount of database activity. Transaction log backups, with full and differential backups, allow you to restore a database to a specific point-in-time to the same server that hosts the database. When you restore a database, the service figures out which full, differential, and transaction log backups need to be restored.


You can use these backups to:

* Restore a database to a point-in-time within the retention period. This operation will create a new database in the same server as the original database.
* Restore a deleted database to the time it was deleted or any time within the retention period. The deleted database can only be restored in the same server where the original database was created.
* Restore a database to another geographical region. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world. 
* Restore a database from a specific long-term backup if the database has been configured with a long-term retention policy. This allows you to restore an old version of the database to satisfy a compliance request or to run an old version of the application. See [Long-term retention](sql-database-long-term-retention.md).
* To perform a restore, see [restore database from backups](sql-database-recovery-using-backups.md).

> [!NOTE]
> In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping multiple secondary databases synchronized with a primary database. 
> 

## How often do backups happen?
### Backups for point-in-time restore
SQL Database supports self-service for point-in-time restore (PITR) by automatically creating full backup, differential backups, and transaction log backups. Full database backups are created weekly, differential database backups are created every few hours, and transaction log backups are created every 5 - 10 minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the SQL Database service as it balances the overall system workload.

The PITR backups are geo-redundant and protected by [Azure Storage cross-regional replication](././storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage.md)

For more information, see [Point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore)

### Backups for long-term retention
SQL Database offers the option of configuring long-term retention (LTR) of full backups for up to 10 years. If LTR policy is enabled, the weekly full backups are automatically copied to a different RA-GRS storage container. To meet different compliance requirement, you can select different retention periods for weekly, monthly and/or yearly backups. The storage consumption depends on the selected frequency of backups and the retention period(s). You can use the [LTR pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=sql-database) to estimate the cost of LTR storage. 

Like PITR, the LTR backups are geo-redundant and protected by [Azure Storage cross-regional replication](././storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage.md).

For more information, see [Long-term retention](sql-database-long-term-retention.md).

## How long do you keep my backups?
Each SQL Database backup has a default retention period that is based on the service tier of the database, and differs between the  [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and the [vCore-based purchasing model (preview)](sql-database-service-tiers-vcore.md). You can update the backup retention period for a database. See [Change Backup Retention Period](#how-to-change-backup-retention-period) for more details.

### PITR Retention for DTU-based service tiers
The default retention period for a database created using the DTU-based purchasing model depends on the service tier:

* Basic service tier is 7 days.
* Standard service tier is 35 days.
* Premium service tier is 35 days.

If you reduce the current PITR retention period, all existing backups older than the new retention period will no longer be available. 

If you increase the current PITR retention period, SQL Database will keep the existing backups until the longer retention period is reached.

If you delete a database, SQL Database will keep the backups in the same way it would for an online database. For example, if you delete a Basic database that has a retention period of seven days, a backup that is four days old is saved for three more days.

> [!IMPORTANT]
> If you delete the Azure SQL server that hosts SQL Databases, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.

### PITR Retention for the vCore-based service tiers (preview)

During preview, the PITR retention period for databases created using the vCore-based purchasing model set to 7 days and cannot be changed. The associated storage is included for free.    

## Are backups encrypted?

If your database is encrypted with TDE the backups are automatically encrypted at rest, including LTR backups. When TDE is enabled for an Azure SQL database, backups are also encrypted. All new Azure SQL databases are configured with TDE enabled by default. For more information on TDE, see  [Transparent Data Encryption with Azure SQL Database](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql).

## Are the automatic backups compliant with GDPR?
If the backup contains personal data, which is subject to General Data Protection Regulation (GDPR), you are required to apply enhanced security measures to protect the data from unauthorized access. In order to comply with the GDPR, you need a way to manage the data requests of data owners without having to access backups. For short-term backups, one solution can be to shorten the backup window to under 30 days, which is the time allowed to complete the data access requests. If longer term backups are required, it is recommended to store only "pseudonymized" data in backups. For example, if data about a person needs to be deleted or updated, it will not require deleting or updating the existing backups. You can find more information about the GDPR best practices in  [Data Governance for GDPR Compliance](https://info.microsoft.com/DataGovernanceforGDPRCompliancePrinciplesProcessesandPractices-Registration.html). 

Because the default PITR retention for any Standard or Premium database in the DTU-based service tiers is 35 days, you must reduce it to be compliant with GDPR. See [Change Backup Retention Period](#how-to-change-backup-retention-period) for more details. 

## How to change backup retention period
Because of the default PITR retention included with DTU-based service tiers, you may want to reduce it to meet specific compliance requirements. You can change the default retention using REST API or PowerShell. The supported values are: 7, 14, 21, 28 or 35 days. 

The following examples illustrate how to change the PITR to the maximum retention that is GDPR compliant.

[!IMPORTANT] The below APIs are only supported by the DTU-based service tiers. If you are using a vCore-based service tier (preview) the PITR retention is fixed to 7 days and cannot be changed.

## Set backup retention period to 28 days using REST API
**Sample Request**
```http
PUT https://management.azure.com/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/resourceGroup/providers/Microsoft.Sql/servers/testserver/databases/testDatabase/backupShortTermRetentionPolicies/default?api-version=2017-03-01-preview
```
**Request Body**
```json
{
  "retentionDays": 28
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
See [Backup Retention REST API](https://docs.microsoft.com/rest/api/sql/backups) for more details.

### Set backup retention period to 28 days using PowerShell
```powershell
Set-AzureRmSqlDatabaseBackupShortTermRetentionPolicy -ResourceGroupName resourceGroup -ServerName testserver -DatabaseName testDatabase -RetentionDays 28
```
[!IMPORTANT] This APIs is included in PowerShell vxxx.x.x or newer. 

## Next steps

- Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](sql-database-recovery-using-backups.md).
- To restore to a point in time using PowerShell, see [restore database to a point in time using PowerShell](scripts/sql-database-restore-database-powershell.md).
- To configure, manage, and restore from long-term retention of automated backups in an Azure Recovery Services vault using the Azure portal, see [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md).
- To configure, manage, and restore from long-term retention of automated backups in an Azure Recovery Services vault using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).
