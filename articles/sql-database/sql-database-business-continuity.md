<properties
   pageTitle="Cloud business continuity - database recovery - SQL Database | Microsoft Azure"
   description="Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running."
   keywords="business continuity,cloud business continuity,database disaster recovery,database recovery"
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
   ms.workload="sqldb-bcdr"
   ms.date="06/09/2016"
   ms.author="carlrab"/>

# Business continuity with Azure SQL Database

Azure SQL Database provides a number of business continuity solutions. Business continuity is about designing, deploying, and running applications in a way that is resilient to planned or unplanned disruptive events that result in permanent or temporary loss of the application’s ability to conduct its business function. Unplanned events range from human errors to permanent or temporary outages to regional disasters that could cause wide scale loss of facility in a particular Azure region. The planned events include application redeployment to a different region and application upgrades. The goal of business continuity is for your application to continue to function during these events with minimal impact on the business function.

To discuss SQL Database cloud business continuity solutions, there are several concepts with which you need be familiar. These are:

* **Disaster recovery (DR):** a process of restoring the normal business function of the application

* **Estimated Recovery Time (ERT):** The estimated duration for the database to be fully available after a restore or failover request.

* **Recovery time objective (RTO)**: The maximum acceptable time before the application fully recovers after the disruptive event. RTO measures the maximum loss of availability during the failures.

* **Recovery point objective (RPO)**: The maximum amount of last updates (time interval) the application can lose by the moment it fully recovers after the disruptive event. RPO measures the maximum loss of data during the failures.


## SQL Database cloud business continuity scenarios

The key scenarios to consider when planning for business continuity and database recovery are the following:

### Design applications for business continuity

The application I am building is critical for my business. I want to design and configure it to be able to survive a regional disaster of catastrophic failure of the service. I know the RPO and RTO requirements for my application and will choose the configuration that meets these requirements.

### Recover from human error

I have administrative rights to access the production version of the application. As part of regular maintenance process I made a mistake and deleted some critical data in production. I want to quickly restore the data in order to mitigate the impact of the error.

### Recover from an outage

I am running my application in production and receive an alert suggesting that there is a major outage in the region it is deployed in. I want to initiate the recovery process to bring it back in a different region to mitigate the impact on the business.

### Perform disaster recovery drill

Because the recovery from an outage will relocate the application’s data tier to a different region I want to periodically test the recovery process and evaluate its impact on the application to stay prepared.

### Application upgrade without downtime

I am releasing a major upgrade of my application. It involves the database schema changes, deployment of additional stored procs etc. This process will require stopping user access to the database. At the same I want to make sure the upgrade does not cause a significant disruption of the business operations.

## SQL Database business continuity features

The following table lists the SQL Database business continuity features and shows their differences across the [service tiers](sql-database-service-tiers.md):

| Capability | Basic tier | Standard tier |Premium tier
| --- |--- | --- | ---
| Point In Time Restore | Any restore point within 7 days | Any restore point within 35 days | Any restore point within 35 days
| Geo-Restore | ERT < 12h, RPO < 1h | ERT < 12h, RPO < 1h | ERT < 12h, RPO < 1h
| Active Geo-Replication | ERT < 30s, RPO < 5s | ERT < 30s, RPO < 5s | ERT < 30s, RPO < 5s

These features are provided to address the scenarios listed earlier. 

> [AZURE.NOTE] The ERT and RPO values are engineering goals and provide guidance only. They are not part of [SLA for SQL Database](https://azure.microsoft.com/support/legal/sla/sql-database/v1_0/)


###Point-in-time restore

[Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore) is designed to return your database to an earlier point in time. It uses the database backups, incremental backups and transaction log backups that the service automatically maintains for every user database. This capability is available for  all service tiers. You can go back 7 days with Basic, 35 days with Standard, and 35 days with Premium. 

### Geo-Restore

[Geo-Restore](sql-database-recovery-using-backups.md#geo-restore) is also available with Basic, Standard, and Premium databases. It provides the default recovery option when also  database is unavailable because of an incident in the region where your database is hosted. Similar to Point In Time Restore, Geo-Restore relies on database backups in geo-redundant Azure storage. It restores from the geo-replicated backup copy and therefore is resilient to the storage outages in the primary region. 

### Active Geo-Replication

[Active Geo-Replication](sql-database-geo-replication-overview.md) is available for all database tiers. It’s designed for applications that have more aggressive recovery requirements than Geo-Restore can offer. Using Active Geo-Replication, you can create up to four readable secondaries on servers in different regions. You can initiate failover to any of the secondaries.  In addition, Active Geo-Replication can be used to support the [application upgrade or relocation scenarios](sql-database-manage-application-rolling-upgrade.md), as well as load balancing for read-only workloads. 

## Choosing among the business continuity features

Designing your application for business continuity requires you to answer the following questions:

1. Which business continuity feature is appropriate for protecting my application from outages?
2. What level of redundancy and replication topology do I use?

### When to use Geo-Restore

[Geo-Restore](sql-database-recovery-using-backups.md#geo-restore) provides the default recovery option when a database is unavailable because of an incident in the region where it's hosted. SQL Database provides built-in basic protection for every database by default. It is done by performing and storing the [database backups](sql-database-automated-backups.md) in the geo-redundant Azure storage (GRS). If you choose this method, no special configuration or additional resource allocation is necessary. You can recover your database to any region by restoring from these automated geo-redundant backups to a new database. 

You should use the built-in protection if your application meets the following criteria:

1. It is not considered mission critical. It doesn't have a binding SLA therefore the downtime of 24 hours or longer will not result in financial liability.
2. The rate of data change is low (e.g. transactions per hour). The RPO of 1 hour will not result in a massive data loss.
3. The application is cost sensitive and cannot justify the additional cost of Geo-Replication 

> [AZURE.NOTE] Geo-Restore does not pre-allocate the compute capacity in any particular region to restore active databases from the backup during the outage. The service will manage the workload associated with the geo-restore requests in a manner that minimizes the impact on the existing databases in that region and their capacity demands will have priority. Therefore, the recovery time of your database will depend on how many other databases will be recovering in the same region at the same time, as well as the size of the DB, the number of transaction log, network bandwidth and etc. 

### When to use Active Geo-Replication

[Active Geo-Replication](sql-database-geo-replication-overview.md) enables the creation and maintenance of readable (secondary) databases in a different region from your primary, keeping them current using an aynchronous replication machanism. It guarantees that your database will have the necessary data and compute resources to support the application's workload after the recovery. 

You should use Active Geo-Replication if your application meets the following criteria:

1. It is mission critical. Loss of data and availability will result in financial liability. 
2. The rate of data change is high (e.g. transactions per minute or seconds). The RPO of 1 hr associated with the default protection will likely result in unacceptable data loss.
3. The cost associated with using Geo-Replication is significantly lower than the potential financial liability and associated loss of business.

## Design cloud solutions for disaster recovery. 

When designing your application for business continuity you should consider several configuration options. The choice will depend on the application deployment topology and what parts of your applications are most vulnerable to an outage. Please refer to [Designing Cloud Solutions for Disaster Recovery Using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md) for guidance.

For detailed recovery strategies when using an elastic pool, see [Disaster recovery strategies for applications using SQL Database Elastic Pool](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).

## Next steps

- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- To learn about business continuity design and recovery scenarios, see [Continuity scenarios](sql-database-business-continuity-scenarios.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)
