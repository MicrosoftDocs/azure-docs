<properties
   pageTitle="Cloud business continuity - Geo-Restore | Microsoft Azure"
   description="Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running."
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
   ms.workload="sqldb-bcdr"
   ms.date="06/17/2016"
   ms.author="sstein"/>

# Overview: Restore an Azure SQL Database from a geo-redundant backup

> [AZURE.SELECTOR]
- [Business continuity overview](sql-database-business-continuity.md)
- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Restore deleted database](sql-database-restore-deleted-database.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Business continuity scenarios](sql-database-business-continuity-scenarios.md)


Geo-Restore enables you to restore a SQL database on any server in any Azure region from the most recent [automated daily backup](sql-database-automated-backups.md). Geo-Restore uses a geo-redundant backup as its source and can be used to recover a database even if the database or datacenter is inaccessible due to an outage. You can use the [Azure portal](sql-database-geo-restore-portal.md), [PowerShell](sql-database-geo-restore-powershell.md), or the [REST (createMode=Restore)](https://msdn.microsoft.com/library/azure/mt163685.aspx) 

> [AZURE.SELECTOR]
- [Overview](sql-database-geo-restore.md)
- [Azure portal](sql-database-geo-restore-portal.md)
- [PowerShell](sql-database-geo-restore-powershell.md)

Geo-Restore is the default recovery option when your database is unavailable because of an incident in the region where the database is hosted. The database can be created on any server in any Azure region. Geo-Restore relies on [automated database backups](sql-database-automated-backups.md) in geo-redundant Azure storage and restores from the geo-replicated backup copy and therefore is resilient to the storage outages in the primary region.

## Geo-Restore in detail

Geo-Restore uses the same technology as point in time restore with one important difference. It restores the database from a copy of the most recent daily backup in geo-replicated blob storage (RA-GRS). For each active database, the service maintains a backup chain that includes a weekly full backup, multiple daily differential backups, and transaction logs saved every 5 minutes. These blobs are geo-replicated this guarantees that daily backups are available even after a massive failure in the primary region. The following shows Geo-Replication of weekly and daily backups copied to the storage container(s).

![geo-restore](./media/sql-database-geo-restore/geo-restore-1.png)


If a large scale incident in a region results in unavailability of your database application, you can use Geo-Restore to restore a database from the most recent backup to a server in any other region. All backups are geo-replicated and can have a delay between when the backup is taken and geo-replicated to the Azure blob in a different region. This delay can be up to an hour so in the event of a disaster there can be up to 1 hour data loss, i.e., RPO of up to 1 hour. The following shows restore of the database from the last daily backup.


![geo-restore](./media/sql-database-geo-restore/geo-restore-2.png)

Use the [Get Recoverable Database](https://msdn.microsoft.com/library/dn800985.aspx) (*LastAvailableBackupDate*) to get the latest Geo-replicated restore point.

## Recovery time for a Geo-Restore

Recovery time is impacted by several factors: the size of the database and the performance level of the database, and the number of concurrent restore requests being processed in the target region. If there is prolonged outage in a region it is possible that there will be large numbers of Geo-Restore requests being processed by other regions. If there are a large number of requests this may increase the recovery time for databases in that region. The duration it takes to restore a DB depends on multiple factors such as the size of the DB, the number of transaction log, network bandwidth and etc. The majority of database restores complete within 12 hours.

## Summary

While Geo-Restore is available with all service tiers, it is the most basic of the disaster recovery solutions available in SQL Database with the longest RPO and Estimate Recovery Time (ERT). For Basic databases with maximum size of 2 GB Geo-Restore provides a reasonable DR solution with an ERT of 12 hours. For larger Standard or Premium databases, if significantly shorter recovery times are desired, or to reduce the likelihood of data loss you should consider using Active Geo-Replication. Active Geo-Replication offers a much lower RPO and ERT as it only requires you initiate a failover to a continuously replicated secondary. For details, see [Active Geo-Replication](sql-database-geo-replication-overview.md).

## Next steps

- For detailed steps on how to restore an Azure SQL Database using the Azure portal from a geo-redundant backup, see [Geo-Restore using the Azure Portal](sql-database-geo-restore-portal.md)
- For detailed steps on how to restore an Azure SQL Database using PowerShell from a geo-redundant backup, see[Geo-Restore using PowerShell](sql-database-geo-restore-powershell.md)
- For a full discussion about how to recover from an outage, see [Recover from an outage](sql-database-disaster-recovery.md)

## Additional resources

- [Business Continuity Scenarios](sql-database-business-continuity-scenarios.md)
