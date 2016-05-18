<properties
   pageTitle="Database restore in Azure SQL Data Warehouse (Overview) | Microsoft Azure"
   description="Overview of the database restore options for recovering a database in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="elfisher"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/05/2016"
   ms.author="elfish;barbkess;sonyama"/>


# Database restore in Azure SQL Data Warehouse (Overview)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-overview-manage-database-restore.md)
- [Portal](sql-data-warehouse-manage-database-restore-portal.md)
- [PowerShell](sql-data-warehouse-manage-database-restore-powershell.md)
- [REST](sql-data-warehouse-manage-database-restore-rest-api.md)

Describes the options for restoring a database in Azure SQL Data Warehouse. These include restoring a live database, a deleted database, and restoring an inaccessible database. The live and deleted database are restored with a backup from the same data center. The inaccessible database might be offline due to an outage. In this case, the restore is from a data center in a different geographical location.


## Recovery scenarios

**Recovering from infrastructure failures:** This scenario refers to recovering from infrastructure issues such as disk failures etc. A customer would like to ensure business continuity with a fault tolerant and highly available infrastructure.

**Recovering from user errors:** This scenario refers to recovering from unintentional or incidental Data Corruption or Deletion. In the event that a user unintentionally or incidentally modifies or deletes data, a customer would like to ensure business continuity by restoring the database to an earlier point in time.

**Recovering from disasters (DR):** This scenario refers to recovering from a major catastrophe. In the scenario where a disruptive event like a natural disaster or a regional outage causes the database to become unavailable, a customer would like to recover the database in a different region to continue business operations.

## Backup policies

[AZURE.INCLUDE [SQL Data Warehouse backup retention policy](../../includes/sql-data-warehouse-backup-retention-policy.md)]


## Database restore capabilities

Let us take a look at how SQL Data Warehouse enhances the reliability of your database and allows for recoverability and continuous operation in the aforementioned scenarios.


### Data redundancy

Since SQL Data Warehouse separates compute and storage, all your data is directly written to geo-redundant Azure Storage (RA-GRS). Geo-redundant storage replicates your data to a secondary region that is hundreds of miles away from the primary region. In both primary and secondary regions, your data is replicated three times each, across separate fault domains and upgrade domains. This ensures that your data is durable even in the case of a complete regional outage or disaster that renders one of the regions unavailable. To learn more about Read-Access Geo-Redundant Storage, read [Azure storage redundancy options][].

### Database Restore

Database restore is designed to restore your database to an earlier point in time. Azure SQL Data Warehouse service protects all databases with automatic storage snapshots at least every 8 hours and retains them for 7 days to provide you with a discrete set of restore points. These backups are stored on RA-GRS Azure Storage and are therefore geo-redundant by default. The automatic backup and restore features come with no additional charges and provide a zero-cost and zero-admin way to protect databases from accidental corruption or deletion. To learn more about database restore, refer to [Database restore tasks][].

### Geo-Restore

Geo-Restore is designed to recover your database in case it becomes unavailable due to a disruptive event. You can contact support to restore a database from a geo-redundant backup to create a new database in any Azure region. Because the backup is geo-redundant it can be used to recover a database even if the database is inaccessible due to an outage. The restored database can be created on any server in any Azure region. In addition to recovering from an outage, geo-restore can also be used for other scenarios like migrating or copying a database to a different server or region. 

**When to initiate recovery**
The recovery operation requires changing the SQL connection string upon recovery and could result in permanent data loss. Therefore, it should be done only when the outage is likely to last longer than your application's RTO. Use the following data points to assert that the recovery is warranted:

- Permanent connectivity failure to the database.
- Your Azure Portal shows an alert about an incident in the region with broad impact.


## Next steps
For other important management tasks, see [Management overview][];

<!--Image references-->

<!--Article references-->
[Azure storage redundancy options]: ../storage/storage-redundancy.md#read-access-geo-redundant-storage
[Backup and restore tasks]: sql-data-warehouse-database-restore-portal.md
[Finalize a recovered database]: ../sql-database/sql-database-recovered-finalize.md
[Management overview]: sql-data-warehouse-overview-management.md

<!--MSDN references-->


<!--Other Web references-->
