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
   ms.workload="data-management"
   ms.date="05/10/2016"
   ms.author="sstein"/>

# Overview: SQL Database Geo-Restore

Geo-restore enables you to restore a SQL database from the most recent daily backup, and is automatically enabled for all service tiers at no extra cost. Geo-restore uses a geo-redundant backup as its source and can be used to recover a database even if the database or datacenter is inaccessible due to an outage. 

Initiating geo-restore creates a new SQL database that can be created on any server in any Azure region.


|Task (Portal) | PowerShell | REST |
|:--|:--|:--|
| [Recover a SQL database from a copy in a different region](sql-database-geo-restore-portal.md) |  [PowerShell](sql-database-geo-restore-powershell.md) | [REST (createMode=Restore)](https://msdn.microsoft.com/library/azure/mt163685.aspx) |



Geo-restore provides the default recovery option when your database is unavailable because of an incident in the region where the database is hosted. Similar to [Point-in-time restore](sql-database-point-in-time-restore.md), geo-restore relies on database backups in geo-redundant Azure storage. It restores from the geo-replicated backup copy and therefore is resilient to the storage outages in the primary region.



## Geo-restore in detail

Geo-restore uses the same technology as point in time restore with one important difference. It restores the database from a copy of the most recent daily backup in geo-replicated blob storage (RA-GRS). For each active database, the service maintains a backup chain that includes a weekly full backup, multiple daily differential backups, and transaction logs saved every 5 minutes. These blobs are geo-replicated this guarantees that daily backups are available even after a massive failure in the primary region. The following shows Geo-replication of weekly and daily backups copied to the storage container(s).

![geo-restore](./media/sql-database-geo-restore/geo-restore-1.png)


If a large scale incident in a region results in unavailability of your database application, you can use geo-restore to restore a database from the most recent backup to a server in any other region. All backups are geo-replicated and can have a delay between when the backup is taken and geo-replicated to the Azure blob in a different region. This delay can be up to an hour so in the event of a disaster there can be up to 1 hour data loss, i.e., RPO of up to 1 hour. The following shows restore of the database from the last daily backup.


![geo-restore](./media/sql-database-geo-restore/geo-restore-2.png)



## Recovery time for a Geo-Restore

Recovery time is impacted by several factors: the size of the database and the performance level of the database, and the number of concurrent restore requests being processed in the target region. If there is prolonged outage in a region it is possible that there will be large numbers of geo-restore requests being processed by other regions. If there are a large number of requests this may increase the recovery time for databases in that region.


## Summary

While geo-restore is available with all service tiers, it is the most basic of the disaster recovery solutions available in SQL Database with the longest RPO and Estimate Recovery Time (ERT). For Basic databases with maximum size of 2 GB geo-restore provides a reasonable DR solution with an ERT of 12 hours. For larger Standard or Premium databases, if significantly shorter recovery times are desired, or to reduce the likelihood of data loss you should consider using active geo-replication. Active geo-replication offers a much lower RPO and ERT as it only requires you initiate a failover to a continuously replicated secondary. For details, see [Active Geo-Replication](sql-database-geo-replication-overview.md).

## Additional resources

- [SQL Database BCDR FAQ](sql-database-bcdr-faq.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Point-in-Time Restore](sql-database-point-in-time-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)