<properties 
   pageTitle="SQL Database Design for Business Continuity" 
   description="Guidance for choosing In this section, guidance will be provided for how to choose which BCDR features should be used and when. This will include descriptions of what you automatically get by using SQL DB."
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
   ms.workload="data-management" 
   ms.date="05/27/2016"
   ms.author="carlrab"/>

# Design for business continuity

Designing your application for business continuity requires you to answer the following questions:

1. Which business continuity feature is appropriate for protecting my application from outages?
2. What level of redundancy and replication topology do I use?

For detailed recovery strategies when using an elastic pool, see [Disaster recovery strategies for applications using SQL Database Elastic Pool](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).

## When to use Geo-Restore

[Geo-Restore](sql-database-geo-restore.md) provides the default recovery option when a database is unavailable because of an incident in the region where it's hosted. SQL Database provides built-in basic protection for every database by default. It is done by performing and storing the [database backups](sql-database-automated-backups.md) in the geo-redundant Azure storage (GRS). If you choose this method, no special configuration or additional resource allocation is necessary. With these backups, you can recover your database in any region using the Geo-Restore command. Use [Recover from an outage](sql-database-disaster-recovery.md) section for the details of using geo-restore to recover your application.

You should use the built-in protection if your application meets the following criteria:

1. It is not considered mission critical. It doesn't have a binding SLA therefore the downtime of 24 hours or longer will not result in financial liability.
2. The rate of data change is low (e.g. transactions per hour). The RPO of 1 hour will not result in a massive data loss.
3. The application is cost sensitive and cannot justify the additional cost of Geo-Replication 

> [AZURE.NOTE] Geo-Restore does not pre-allocate the compute capacity in any particular region to restore active databases from the backup during the outage. The service will manage the workload associated with the geo-restore requests in a manner that minimizes the impact on the existing databases in that region and their capacity demands will have priority. Therefore, the recovery time of your database will depend on how many other databases will be recovering in the same region at the same time. 

## When to use Active Geo-Replication

[Active Geo-Replication](sql-database-geo-replication-overview.md) enables the creation of readable (secondary) databases in a different region from your primary. It guarantees that your database will have the necessary data and compute resources to support the application's workload after the recovery. Refer to [Recover from an outage](sql-database-disaster-recovery.md) section for using failover to recover your application.

You should use Geo-Replication if your application meets the following criteria:

1. It is mission critical. It has a binding SLA with aggressive RPO and RTO. Loss of data and availability will result in financial liability. 
2. The rate of data change is high (e.g. transactions per minute or seconds). The RPO of 1 hr associated with the default protection will likely result in unacceptable data loss.
3. The cost associated with using Geo-Replication is significantly lower than the potential financial liability and associated loss of business.

To enable Active Geo-Replication, see [Configure Geo-Replication for Azure SQL Database](sql-database-geo-replication-portal.md)

> [AZURE.NOTE] Active Geo-Replication also supports read-only access to the secondary database thus providing additional capacity for the read-only workloads. 

##How to choose the failover configuration 

When designing your application for business continuity you should consider several configuration options. The choice will depend on the application deployment topology and what parts of your applications are most vulnerable to an outage. Please refer to [Designing Cloud Solutions for Disaster Recovery Using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md) for guidance.

## Next steps

- [Designing Cloud Solutions for Disaster Recovery Using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)

## Additional resources

- [Disaster recovery strategies for applications using SQL Database Elastic Pool](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md) 