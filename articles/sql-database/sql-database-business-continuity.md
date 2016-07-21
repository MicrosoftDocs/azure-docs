<properties
   pageTitle="Cloud business continuity - database recovery - SQL Database | Microsoft Azure"
   description="Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running."
   keywords="business continuity,cloud business continuity,database disaster recovery,database recovery"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/20/2016"
   ms.author="carlrab"/>

# Overview of business continuity with Azure SQL Database

This overview describes the capabilities that Azure SQL Database provides for business continuity and disaster recovery, along with their use cases and related tutorials. You can use these key business continuity features to keep your business running when a disruption to your business occurs due to a user or application error affecting data integrity or in the event of an Azure regional outage, or to prevent a disruption during an application upgrade. This overview also introduces application design considerations related to the use of these business continuity features for both standalone databases and elastic database pools.

## SQL Database features that you can use to provide business continuity

The first step in developing a business continuity plan for your business is to understand what SQL Database provides for you automatically based on your service tier and what the estimated recovery time (ERT) would be for each business disruption scenario using the built-in funtionality. Next, you need to understand additional options provided by SQL Datbase to reduce recovery time, potentially at the expense of a small amount of data loss related to recent updates. Once you understand these options, you can choose among them - and, in most scenarios, use a combination of all available features. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event - this is your recovery time objective (RTO). You also need to understand the maximum amount of recent data updates (time interval) the application can tolerate losing when recovering after the disruptive event - the recovery point objective (RPO). 

### Use database backups to recover a database

SQL Database automatically performs a combination of weekly full database backups, hourly differential database backups, and transaction log backups every 5 minutes in order to protect your businss from data loss. These backups are stored in locally redundant storage for 35 days for databases in the Standard and Premium service tiers and 7 days for databases in the Basic service tier - see [service tier](sql-database-service-tiers.md) for more details on service tiers. If the retention period for your service tier does not meet your business requirements, you can increase the retention period by [changing the service tier](sql-database-scale-up.md). The full and differential database backups are also replicated to another data center for protection against a data center outage - see [automatic database backups](sql-database-automated-backups.md) for more details.

You can use these automatic database backups to recover a database from a variety of disruptive events, both within your data center and to another data center. Using automatic database backups, the estimated time of recovery will depend on several factors including the total number of databases recovering in the same region at the same time, the database size, the transaction log size, and network bandwidth. In most cases, the recovery time is less than 12 hours. When recovering to another data region, the potential data loss is limited to 1 hour by the geo-redundant storage of hourly differential database backups. 

> [AZURE.IMPORTANT] To recover using automated backups, you must be the subscription owner. You can recover using the Azure portal, PowerShell or the REST API. You cannot use Transact-SQL.

If your application meets all of the following criteria, we recommend using automated backups for recovery:

- Is not considered mission critical.
- Doesn't have a binding SLA therefore the downtime of 24 hours or longer will not result in financial liability.
- Has a low rate of data change (e.g. transactions per hour) and losing up to an hour of change is an acceptable data loss. 
- Is cost sensitive. 

If you need faster recovery, use Active Geo-Replication (discussed next). If you need to be able to recover data from a period older than 35 days, consider archiving your database on a regular basis to a BACPAC file (a compressed file containing your database schema and associated data) stored either in Azure blob storage or in another location of your choice. For more information, see [create a database copy](sql-database-copy.md) and [export the database copy](sql-database-export.md) to create a transactionally consistent database archive. 

### Use Active Geo-Replication to reduce recovery time and limit data loss associated with a recovery

In addition to using database backups for database recovery in the event of a business disruption, you can configure a database to have up to 4 readable, online, secondary databases in the same or different regions. This feature is called [Active Geo-Replication](sql-database-geo-replication-overview.md). These secondary databases are kept synchronized with the primary database using an asynchronous replication mechanism. This feature is used to protect against business disruption in the event of a data center outage or during an application upgrade - these scenarios are discussed below. It is also used to provide better query performance for read-only queries to geographically dispersed users - this scenario is not discussed in any detail in this topic.

If the primary database goes offline unexpectedly or according to a plan, you can quickly promote a secondary to become the primary and configure applications to connect to the newly promoted primary (also called a failover). With a planned failover, there is no data loss. With an unplanned failover, there will be some small amount of data loss for very recent transactions due to the nature of asynchronous replication. After a failover, you can later failback - either according to a plan or when the data center comes back online. In all cases, users will experience extremely minimal downtime. See below for more details regarding the use of Active Geo-Replication to recover in a number of scenarios.

> [AZURE.IMPORTANT] To use Active Gee-Replication, you must either be the subscription owner or have administrative permissions in SQL Server. You can configure and failover using the Azure portal, PowerShell, or the REST API using permissions on the subscription or using Transact-SQL using permissions within SQL Server.

If your application meets any of these criteria, we recommend using Active Geo-Replication.

- Is mission critical.
- Has a service level agreement (SLA) that does not allow for 24 hours or more of downtime.
- Downtime will result in financial liability.
- Has a high rate of data change is high and losing an hour of data is not acceptable.
- The additional cost of active geo-replication is lower than the potential financial liability and associated loss of business.

## Recover a database after a user or application error

*No one is perfect! A user might accidentally delete some data, inadvertently drop an important table, or even drop an entire database. Or, an application might accidentally overwrite good data with bad data due to a an application defect. 

In this scenario, these are your recovery options.

### Perform a point-in-time restore

You can use the automated backups to recover a copy of your database to a known good point in time, provided that time is  within the database retention period. After the database is restored, you can either replace the original database with the restored database or copy the needed data from the restored data into the original database. If the database uses Active Geo-Replication, we recommend restoring to a database copy and then copying the required data into the original database. If you replace the original database with the restored database, you will need to reconfigure Active Geo-Replication. 

For more information and for detailed steps for restoring a database to a point in time using the Azure Portal or using PowerShell, see [point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore). You cannot recover using Transact-SQL.

### Restore a deleted database

If the database is deleted but the logical server has not been deleted, you can restore the deleted database to the point at which it was deleted. This restores a database backup to the same logical SQL server from which it was deleted. You can restore it using the original or provide a new database name.

For more information and for detailed steps for restoring a deleted database using the Azure Portal or using PowerShell, see [restore a deleted database](sql-database-recovery-using-backups.md#deleted-database-restore). You cannot restore using Transact-SQL.

> [AZURE.IMPORTANT] If the logical server is also deleted, you cannot recover the database. 

### Import from a database archive

If the data loss occurred outside the current retention period for automated backups and you have been archiving the database, you can [Import an archived BACPAC file](sql-database-import.md) to a new database. At this point, you can either replace the original database with the imported database or copy the needed data from the imported data into the original database. 

## Recover a database to another region from an Azure regional data center outage

<!-- Explain this scenario -->

Although rare, an Azure region can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes or might last for hours. 

- One option is to wait for your database to come back online when the data center outage is over. This works for applications that can afford to have the database offline. For example, a development project or free trial you don't need to work on constantly. When a data center has an outage, you won't know how long the outage will last, so this option only works if you don't need your database for a while.
- Another option is to either failover to another data region if you are using Active Geo-Replication or the recover using geo-redundant database backups (Geo-Restore). Failover will only take a few seconds while recovery from backups will take hours.

When you take action, how long it takes you to recover, and how much data loss you incur in the event of a data center outage depends upon your business continuity plan, your service tier and how you decide to use the business continuity features discussed above in your application. Indeed, you may choose to use a combination of database backups and Active Geo-Replication depending upon your application requirements. For a discussion of application design considerations for stand-alone databases and for elastic pools, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).

The sections below provide an overview of the steps to recover using either database backups or Active Geo-Replication. For detailed failover / recovery steps including planning requirements, post recovery steps and information about how to simulate an outage to perform a disaster recovery drill, see [Recover a SQL Database from an outage](sql-database-disaster-recovery.md).

### Prepare for an outage

Regardless of the business continuity feature you will use, you must:

- Identify and prepare the target server, including server-level firewall rules, logins and master database level permissions.
- Determine how you will redirect clients and client applications to the new server
- Document other dependencies, such as auditing settings and alerts 

### Failover to a geo-replicated secondary database if that is your recovery mechanism

If you are using Active Geo-Replication as your recovery mechanism, [force a failover to a geo-replicated secondary](sql-database-disaster-recovery.md#failover-to-geo-replicated-secondary-database). Within seconds, the secondary is promoted to become the new primary and is ready to record new transactions and respond to any queries - with only a few seconds of data loss for the data that had not yet been replicated. 

> [AZURE.NOTE] For information on automating the failover process, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

When the data center comes back online, you can failback to the original primary (or not).

### Perform a geo-restore if that is your recovery mechanism

If you are using automated backups with geo-redundant storage replication as your recovery mechanism, [initiate a database recovery using Geo-Restore](sql-database-disaster-recovery.md#recover-using-geo-restore). Recovery will take place within 12 hours in most cases - with data loss of up to 1 hour determined by when the last hourly differential backup with takan and replicated. Until the recovery completes, the database will be unable to record any transactions or respond to any queries. 

> [AZURE.NOTE] If the data center comes back online before you switch your application over to the recovered database, you can simply cancel the recovery.  

### Perform post failover / recovery tasks 

After recovery from either recovery mechanism, you must:

- Redirect clients and client applications to the new server
- Ensure appropriate server-level firewall rules are in place
- Ensure appropriate logins and master database level permissions are in place
- Configure auditing, as appropriate
- Configure alerts, as appropriate

## Upgrade an application with minimal downtime

Sometimes an application needs to be take offline because of planned maintenance such as an application upgrade. [Manage application upgrades](sql-database-manage-application-rolling-upgrade.md) describes how to use Active Geo-Replication to enable rolling upgrades of your cloud application. This article looks at two different methods of orchestrating the upgrade process and discusses the benefits and trade-offs of each option.

## Next steps

For a discussion of application design considerations for stand-alone databases and for elastic pools, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).






