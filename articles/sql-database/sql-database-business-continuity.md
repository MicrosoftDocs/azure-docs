---
title: Cloud business continuity - database recovery - SQL Database | Microsoft Docs
description: Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running.
keywords: business continuity,cloud business continuity,database disaster recovery,database recovery
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
manager: craigg
ms.date: 06/25/2019
---
# Overview of business continuity with Azure SQL Database

**Business continuity** in Azure SQL Database refers to the mechanisms, policies, and procedures that enable your business to continue operating in the face of disruption, particularly to its computing infrastructure. In the most of the cases, Azure SQL Database will handle the disruptive events that might happen in the cloud environment and keep your applications and business processes running. However, there are some disruptive events that cannot be handled by SQL Database automatically such as:

- User accidentally deleted or updated a row in a table.
- Malicious attacker succeeded to delete data or drop a database.
- Earthquake caused a power outage and temporary disabled data-center.

This overview describes the capabilities that Azure SQL Database provides for business continuity and disaster recovery. Learn about options, recommendations, and tutorials for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## SQL Database features that you can use to provide business continuity

From a database perspective, there are four major potential disruption scenarios:

- Local hardware or software failures affecting the database node such as a disk-drive failure.
- Data corruption or deletion typically caused by an application bug or human error. Such failures are application-specific and typically cannot be detected by the database service.
- Datacenter outage, possibly caused by a natural disaster. This scenario requires some level of geo-redundancy with application failover to an alternate datacenter.
- Upgrade or maintenance errors, unanticipated issues that occur during planned infrastructure maintenance or upgrades may require rapid rollback to a prior database state.

To mitigate the local hardware and software failures, SQL Database includes a [high availability architecture](sql-database-high-availability.md), which guarantees automatic recovery from these failures with up to 99.995% availability SLA.  

To protect your business from data loss, SQL Database automatically creates full database backups weekly, differential database backups every 12 hours, and transaction log backups every 5 - 10 minutes . The backups are stored in RA-GRS storage for at least 7 days for all service tiers. All service tiers except Basic support configurable backup retention period for point-in-time restore, up to 35 days. 

SQL Database also provides several business continuity features, that you can use to mitigate various unplanned scenarios. 

- [Temporal tables](sql-database-temporal-tables.md) enable you to restore row versions from any point in time.
- [Built-in automated backups](sql-database-automated-backups.md) and [Point in Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore) enables you to restore complete database to some point in time within the configured retention period up to 35 days.
- You can [restore a deleted database](sql-database-recovery-using-backups.md#deleted-database-restore) to the point at which it was deleted if the **SQL Database server has not been deleted**.
- [Long-term backup retention](sql-database-long-term-retention.md) enables you to keep the backups up to 10 years.
- [Active geo-replication](sql-database-active-geo-replication.md) enables you to create readable replicas and manually failover to any replica in case of a data center outage or application upgrade.
- [Auto-failover group](sql-database-auto-failover-group.md#auto-failover-group-terminology-and-capabilities) allows the application to automatically recovery in case of a data center outage.

## Recover a database within the same Azure region

You can use automatic database backups to restore a database to a point in time in the past. This way you can recover from data corruptions caused by human errors. The poin-in-time restore allows you to create a new database in the same server that represents the state of data prior to the corrupting event. For most databases the restore operations takes less than 12 hours. It may take longer to recover a very large or very active database. For more information about recovery time, see [database recovery time](sql-database-recovery-using-backups.md#recovery-time). 

If the maximum supported backup retention period for point-in-time restore (PITR) is not sufficient for your application, you can extend it by configuring a long-term retention (LTR) policy for the database(s). For more information, see [Long-term backup retention](sql-database-long-term-retention.md).

## Recover a database to another Azure region

Although rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes or might last for hours.

- One option is to wait for your database to come back online when the data center outage is over. This works for applications that can afford to have the database offline. For example, a development project or free trial you don't need to work on constantly. When a data center has an outage, you do not know how long the outage might last, so this option only works if you don't need your database for a while.
- Another option is to restore a database on any server in any Azure region using [geo-redundant database backups](sql-database-recovery-using-backups.md#geo-restore) (geo-restore). Geo-restore uses a geo-redundant backup as its source and can be used to recover a database even if the database or datacenter is inaccessible due to an outage.
- Finally, you can quickly recover from an outage if you have configured either geo-secondary using [active geo-replication](sql-database-active-geo-replication.md) or an [auto-failover group](sql-database-auto-failover-group.md) for your database or databases. Depending on your choice of these technologies, you can use either manual or automatic failover. While failover itself takes only a few seconds, the service will take at least 1 hour to activate it. This is necessary to ensure that the failover is justified by the scale of the outage. Also, the failover may result in small data loss due to the nature of asynchronous replication. 

As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event. The time required for application to fully recover is known as Recovery time objective (RTO). You also need to understand the maximum period of recent data updates (time interval) the application can tolerate losing when recovering from an unplanned disruptive event. The potential data loss is known as Recovery point objective (RPO).

Different recovery methods offer different levels of RPO and RTO. You can choose a specific recovery method, or use a combination of methods to achicethe the full application recovery. The following table compares RPO and RTO of each recovery option.

| Recovery method | RTO | RPO |
| --- | --- | --- | 
| Geo-restore from geo-replicated backups | 12 h | 1 h |
| Auto-failover groups | 1 h | 5 s |
| Manual database failover | 30 s | 5 s |

> [!NOTE]
> *Manual database failover* refers to failover of a single database to its geo-replicated secondary using the [unplanned mode](sql-database-active-geo-replication.md#active-geo-replication-terminology-and-capabilities).
See the table earlier in this article for details of the auto-failover RTO and RPO.


Use auto-failover groups if your application meets any of these criteria:

- Is mission critical.
- Has a service level agreement (SLA) that does not allow for 12 hours or more of downtime.
- Downtime may result in financial liability.
- Has a high rate of data change and 1 hour of data loss is not acceptable.
- The additional cost of active geo-replication is lower than the potential financial liability and associated loss of business.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-SQL-Database-protecting-important-DBs-from-regional-disasters-is-easy/player]
>

You may choose to use a combination of database backups and active geo-replication depending upon your application requirements. For a discussion of design considerations for stand-alone databases and for elastic pools using these business continuity features, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).

The following sections provide an overview of the steps to recover using either database backups or active geo-replication. For detailed steps including planning requirements, post recovery steps, and information about how to simulate an outage to perform a disaster recovery drill, see [Recover a SQL Database from an outage](sql-database-disaster-recovery.md).

### Prepare for an outage

Regardless of the business continuity feature you use, you must:

- Identify and prepare the target server, including server-level IP firewall rules, logins, and master database level permissions.
- Determine how to redirect clients and client applications to the new server
- Document other dependencies, such as auditing settings and alerts

If you do not prepare properly, bringing your applications online after a failover or a database recovery takes additional time and likely also require troubleshooting at a time of stress - a bad combination.

### Fail over to a geo-replicated secondary database

If you are using active geo-replication or auto-failover groups as your recovery mechanism, you can configure an automatic failover policy or use [manual unplanned failover](sql-database-active-geo-replication-portal.md#initiate-a-failover). Once initiated, the failover causes the secondary to become the new primary and ready to record new transactions and respond to queries - with minimal data loss for the data not yet replicated. For information on designing the failover process, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md).

> [!NOTE]
> When the data center comes back online the old primaries automatically reconnect to the new primary and become secondary databases. If you need to relocate the primary back to the original region, you can initiate a planned failover manually (failback).

### Perform a geo-restore

If you are using the automated backups with geo-redundant storage (enabled by default), you can recover the database using [geo-restore](sql-database-disaster-recovery.md#recover-using-geo-restore). Recovery usually takes place within 12 hours - with data loss of up to one hour determined by when the last log backup was taken and replicated. Until the recovery completes, the database is unable to record any transactions or respond to any queries. Note, geo-restore only restores the database to the last available point in time.

> [!NOTE]
> If the data center comes back online before you switch your application over to the recovered database, you can cancel the recovery.

### Perform post failover / recovery tasks

After recovery from either recovery mechanism, you must perform the following additional tasks before your users and applications are back up and running:

- Redirect clients and client applications to the new server and restored database
- Ensure appropriate server-level IP firewall rules are in place for users to connect or use [database-level firewalls](sql-database-firewall-configure.md#manage-server-level-ip-firewall-rules-using-the-azure-portal) to enable appropriate rules.
- Ensure appropriate logins and master database level permissions are in place (or use [contained users](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable))
- Configure auditing, as appropriate
- Configure alerts, as appropriate

> [!NOTE]
> If you are using a failover group and connect to the databases using the read-write lstener, the redirection after failover will happen automatically and transparently to the application.

## Upgrade an application with minimal downtime

Sometimes an application must be taken offline because of planned maintenance such as an application upgrade. [Manage application upgrades](sql-database-manage-application-rolling-upgrade.md) describes how to use active geo-replication to enable rolling upgrades of your cloud application to minimize downtime during upgrades and provide a recovery path if something goes wrong.

## Next steps

For a discussion of application design considerations for stand-alone databases and for elastic pools, see [Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Elastic pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).
