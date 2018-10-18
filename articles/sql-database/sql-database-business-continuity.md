---
title: Cloud business continuity - database recovery - SQL Database | Microsoft Docs
description: Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running.
keywords: business continuity,cloud business continuity,database disaster recovery,database recovery
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
ms.date: 09/19/2018
---
# Overview of business continuity with Azure SQL Database

Azure SQL Database is an implementation of the latest stable SQL Server Database Engine configured and optimized for Azure cloud environment that provides [high availability](sql-database-high-availability.md) and resiliency to the errors that might affect your business process. **Business continuity** in Azure SQL Database refers to the mechanisms, policies, and procedures that enable a business to continue operating in the face of disruption, particularly to its computing infrastructure.  In the most of the cases, Azure SQL Database will handle the disruptive events that might happen in the cloud environment and keep your business processes running. However, there are some disruptive events that cannot be handled by SQL Database such as:
 - User accidentally deleted or updated a row in a table.
 - Malicious attacker succeeded to delete data or drop a database.
 - Earthquake caused a power outage and temporary disabled data-center.
 
These cases cannot be controlled by Azure SQL Database, so you would need to do use the business continuity features in SQL Database that enables you to recover your data and keep your applications running.

This overview describes the capabilities that Azure SQL Database provides for business continuity and disaster recovery. Learn about options, recommendations, and tutorials for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## SQL Database features that you can use to provide business continuity

From a database perspective, there are four major potential disruption scenarios:
- **Local hardware or software failures** affecting the database node such as a disk-drive failure.
- **Data corruption or deletion** - typically caused by an application bug or human error.  Such failures are intrinsically application-specific and cannot as a rule be detected or mitigated automatically by the infrastructure.
- **Datacenter outage**, possibly caused by a natural disaster.  This scenario requires some level of geo-redundancy with application failover to an alternate datacenter.
- **Upgrade or maintenance errors** – unanticipated issues that occur during planned upgrades or maintenance to an application or database may require rapid rollback to a prior database state.

SQL Database provides several business continuity features, including automated backups and optional database replication that can mitigate these scenarios. First, you need to understand how SQL Database [high availability architecture](sql-database-high-availability.md) provides 99.99% availability and resiliency to some disruptive events that might affect your business process.
Then, you can learn about the additional mechanisms that you can use to recover from the disruptive events that cannot be handled by SQL Database high availability architecture, such as:
 - [Temporal tables](sql-database-temporal-tables.md) enable you to restore row versions from any point in time.
 - [Built-in automated backups](sql-database-automated-backups.md) and [Point in Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore) enables you to restore complete database to some point in time within the last 35 days.
 - You can [restore a deleted database](sql-database-recovery-using-backups.md#deleted-database-restore) to the point at which it was deleted if the **logical server has not been deleted**.
 - [Long-term backup retention](sql-database-long-term-retention.md) enables you to keep the backups up to 10 years.
 - [Auto-failover group](sql-database-geo-replication-overview.md#auto-failover-group-capabilities) allows the application to automatically recovery in case of a data center scale outage.

Each has different characteristics for estimated recovery time (ERT) and potential data loss for recent transactions. Once you understand these options, you can choose among them - and, in most scenarios, use them together for different scenarios. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event. The time required for application to fully recover is known as recovery time objective (RTO). You also need to understand the maximum period of recent data updates (time interval) the application can tolerate losing when recovering after the disruptive event. The time period of updates that you might afford to lose is known as recovery point objective (RPO).

The following table compares the ERT and RPO for each service tier for the three most common scenarios.

| Capability | Basic | Standard | Premium  | General Purpose | Business Critical
| --- | --- | --- | --- |--- |--- |
| Point in Time Restore from backup |Any restore point within seven days |Any restore point within 35 days |Any restore point within 35 days |Any restore point within configured period (up to 35 days)|Any restore point within configured period (up to 35 days)|
| Geo-restore from geo-replicated backups |ERT < 12 h<br> RPO < 1 h |ERT < 12 h<br>RPO < 1 h |ERT < 12 h<br>RPO < 1 h |ERT < 12 h<br>RPO < 1 h|ERT < 12 h<br>RPO < 1 h|
| Auto-failover groups |RTO = 1 h<br>RPO < 5s |RTO = 1 h<br>RPO < 5 s |RTO = 1 h<br>RPO < 5 s |RTO = 1 h<br>RPO < 5 s|RTO = 1 h<br>RPO < 5 s|

## Recover a database to the existing server

SQL Database automatically performs a combination of full database backups weekly, differential database backups generally taken every 12 hours, and transaction log backups every 5 - 10 minutes to protect your business from data loss. The backups are stored in RA-GRS storage for 35 days for all service tiers except Basic DTU service tiers where the backups are stored for 7 days. For more information, see [automatic database backups](sql-database-automated-backups.md). You can restore an existing database form the automated backups to an earlier point in time as a new database on the same logical server using the Azure portal, PowerShell, or the REST API. For more information, see [Point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore).

If the maximum supported point-in-time restore (PITR) retention period is not sufficient for your application, you can extend it by configuring a long-term retention (LTR) policy for the database(s). For more information, see [Long-term backup retention](sql-database-long-term-retention.md).

You can use these automatic database backups to recover a database from various disruptive events, both within your data center and to another data center. Using automatic database backups, the estimated time of recovery depends on several factors including the total number of databases recovering in the same region at the same time, the database size, the transaction log size, and network bandwidth. The recovery time is usually less than 12 hours. It may take longer to recover a very large or active database. For more information about recovery time, see [database recovery time](sql-database-recovery-using-backups.md#recovery-time). When recovering to another data region, the potential data loss is limited to 1 hour with use of geo-redundant backups.

Use automated backups and [point-in-time restore](sql-database-recovery-using-backups.md#point-in-time-restore) as your business continuity and recovery mechanism if your application:

* Is not considered mission critical.
* Doesn't have a binding SLA - a downtime of 24 hours or longer does not result in financial liability.
* Has a low rate of data change (low transactions per hour) and losing up to an hour of change is an acceptable data loss.
* Is cost sensitive.

If you need faster recovery, use [failover groups](sql-database-geo-replication-overview.md#auto-failover-group-capabilities
) (discussed next). If you need to be able to recover data from a period older than 35 days, use [Long-term retention](sql-database-long-term-retention.md). 

## Recover a database to another region
<!-- Explain this scenario -->

Although rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes or might last for hours.

* One option is to wait for your database to come back online when the data center outage is over. This works for applications that can afford to have the database offline. For example, a development project or free trial you don't need to work on constantly. When a data center has an outage, you do not know how long the outage might last, so this option only works if you don't need your database for a while.
* Another option is to restore a database on any server in any Azure region using [geo-redundant database backups](sql-database-recovery-using-backups.md#geo-restore) (geo-restore). Geo-restore uses a geo-redundant backup as its source and can be used to recover a database even if the database or datacenter is inaccessible due to an outage.
* Finally, you can quickly recover from an outage if you have configured a [auto-failover group](sql-database-geo-replication-overview.md#auto-failover-group-capabilities) for your database or databases. You can customize the failover policy to use automatic or manual failover. While failover itself takes only a few seconds, the service will take at least 1 hour to activate it. This is necessary to ensure that the failover is justified by the scale of the outage. Also, the failover may result in small data loss due to the nature of asynchronous replication. See the table earlier in this article for details of the auto-failover RTO and RPO.   

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-protecting-important-DBs-from-regional-disasters-is-easy/player]
>


> [!IMPORTANT]
> To use active geo-replication and auto-failover groups, you must either be the subscription owner or have administrative permissions in SQL Server. You can configure and fail over using the Azure portal, PowerShell, or the REST API using Azure subscription permissions or using Transact-SQL with SQL Server permissions.
> 

Use active auto-failover groups if your application meets any of these criteria:

* Is mission critical.
* Has a service level agreement (SLA) that does not allow for 12 hours or more of downtime.
* Downtime may result in financial liability.
* Has a high rate of data change and 1 hour of data loss is not acceptable.
* The additional cost of active geo-replication is lower than the potential financial liability and associated loss of business.

When you take action, how long it takes you to recover, and how much data loss you incur depends upon how you decide to use these business continuity features in your application. Indeed, you may choose to use a combination of database backups and active geo-replication depending upon your application requirements. For a discussion of application design considerations for stand-alone databases and for elastic pools using these business continuity features, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).

The following sections provide an overview of the steps to recover using either database backups or active geo-replication. For detailed steps including planning requirements, post recovery steps, and information about how to simulate an outage to perform a disaster recovery drill, see [Recover a SQL Database from an outage](sql-database-disaster-recovery.md).

### Prepare for an outage
Regardless of the business continuity feature you use, you must:

* Identify and prepare the target server, including server-level firewall rules, logins, and master database level permissions.
* Determine how to redirect clients and client applications to the new server
* Document other dependencies, such as auditing settings and alerts

If you do not prepare properly, bringing your applications online after a failover or a database recovery takes additional time and likely also require troubleshooting at a time of stress - a bad combination.

### Fail over to a geo-replicated secondary database
If you are using active geo-replication and auto-failover groups as your recovery mechanism, you can configure an automatic failover policy or use [manual failover](sql-database-disaster-recovery.md#fail-over-to-geo-replicated-secondary-server-in-the-failover-group). Once initiated, the failover causes the secondary to become the new primary and ready to record new transactions and respond to queries - with minimal data loss for the data not yet replicated. For information on designing the failover process, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

> [!NOTE]
> When the data center comes back online the old primaries automatically reconnect to the new primary and become secondary databases. If you need to relocate the primary back to the original region, you can initiate a planned failover manually (failback). 
> 

### Perform a geo-restore
If you are using the automated backups with geo-redundant storage (enabled by default), you can recover the database using [geo-restore](sql-database-disaster-recovery.md#recover-using-geo-restore). Recovery usually takes place within 12 hours - with data loss of up to one hour determined by when the last log backup was taken and replicated. Until the recovery completes, the database is unable to record any transactions or respond to any queries. Note, geo-restore only restores the database to the last available point in time.

> [!NOTE]
> If the data center comes back online before you switch your application over to the recovered database, you can cancel the recovery.  

### Perform post failover / recovery tasks
After recovery from either recovery mechanism, you must perform the following additional tasks before your users and applications are back up and running:

* Redirect clients and client applications to the new server and restored database
* Ensure appropriate server-level firewall rules are in place for users to connect (or use [database-level firewalls](sql-database-firewall-configure.md#creating-and-managing-firewall-rules))
* Ensure appropriate logins and master database level permissions are in place (or use [contained users](https://msdn.microsoft.com/library/ff929188.aspx))
* Configure auditing, as appropriate
* Configure alerts, as appropriate

> [!NOTE]
> If you are using a failover group and connect to the databases using the read-write lstener,  the redirection after failover will happen automatically and transparently to the application.  
>
>

## Upgrade an application with minimal downtime
Sometimes an application must be taken offline because of planned maintenance such as an application upgrade. [Manage application upgrades](sql-database-manage-application-rolling-upgrade.md) describes how to use active geo-replication to enable rolling upgrades of your cloud application to minimize downtime during upgrades and provide a recovery path if something goes wrong. 

## Next steps
For a discussion of application design considerations for stand-alone databases and for elastic pools, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).
