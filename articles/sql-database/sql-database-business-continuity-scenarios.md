<properties
	pageTitle="Azure SQL Database business continuity scenarios | Microsoft Azure"
	description="Azure SQL Database business continuity scenarios"
	services="sql-database"
	documentationCenter=""
	authors="carlrabeler"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="06/16/2016"
	ms.author="carlrab"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>



# Business continuity scenarios for Azure SQL Database

> [AZURE.SELECTOR]
- [Business continuity](sql-database-business-continuity.md)
- [Scenarios](sql-database-business-continuity-scenarios.md)
- [Point-in-time restore](sql-database-point-in-time-retore.md)
- [Restore deleted database](sql-database-restore-deleted-database.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active Geo-Replication](sql-database-geo-replication)

In this article, you learn about several Azure SQL Database business continuity scenarios.

## Recover from an outage

[Restore an Azure SQL Database or failover to a secondary](sql-database-disaster-recovery.md) describes how to recover from an outage using the following capabilities:

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-geo-restore.md)

This article discussed when to initiate recovery, how to recover using each capability, how to configure your database after recovery, and how to configure your application after recovery.

## Recover from a user error

[Recover an Azure SQL Database from a user error](sql-database-user-error-recovery.md) describes how to recover from user errors or unintended data modification using the following capabilities:

- [Point-in-time restore](sql-database-point-in-time-restore.md) 
- [Restore deleted database](sql-database-restore-deleted-database.md)

## Perform a disaster recovery drill

[Performing a disaster recovery drill](sql-database-disaster-recovery-drills.md) descibes how to perform a disaster recovery drill using the following capabilities:

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-geo-restore.md)

It is recommended that validation of application readiness for recovery workflow is performed periodically. Verifying the application behavior and implications of data loss and/or the disruption that failover involves is a good engineering practice. It is also a requirement by most industry standards as part of business continuity certification.

Performing a disaster recovery drill consists of:

- Simulating data tier outage
- Recovering 
- Validate application integrity post recovery

## Manage security after disaster recovery

[How to manage security after disaster recovery](sql-database-geo-replication-security-config.md) describes the authentication requirements to configure and control [Active Geo-Replication](sql-database-geo-replication-overview.md) and the steps required to set up user access to the secondary database. It also describes how enable access to the recovered database after using [Geo-Restore](sql-database-geo-restore.md).

## Manage rolling upgrades of cloud applications uisng Active Geo-Replication

[Managing rolling upgrades of cloud applications using SQL Database Active Geo-Replication](sql-database-manage-application-rolling-upgrade.md) describes how to use [Geo-Replication](sql-database-geo-replication-overview.md) in SQL Database to enable rolling upgrades of your cloud application. Because upgrade is a disruptive operation, it should be part of your business continuity planning and design. This article looks at two different methods of orchestrating the upgrade process and discusses the benefits and trade-offs of each option. 

## Design an application for cloud disaster recovery using Active Geo-Replication

[Design an application for cloud disaster recovery using Active Geo-Replication in SQL Database](sql-database-designing-cloud-solutions-for-disaster-recovery.md) describes how to use [Active Geo-Replication](sql-database-geo-replication-overview.md) in SQL Database to design database applications resilient to regional failures and catastrophic outages. This article considers the application deployment topology, the service level agreement you are targeting, traffic latency, and costs and then looks at the common application patterns - each with benefits and trade-offs.

## Disaster recovery strategies for applications using elastic database pools

[Disaster recovery strategies for applications using SQL Database Elastic Pool](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md) describes the disaster recovery scenarios using [elastic database pools](sql-database-elastic-pool.md).

## Next steps

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-geo-restore.md)

## Additional resources

- [SQL Database business continuity and disaster recovery](sql-database-business-continuity.md)
- [Point-in-Time Restore](sql-database-point-in-time-restore.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Security Configuration for Geo-Replication](sql-database-geo-replication-security-config.md)
- [SQL Database BCDR FAQ](sql-database-bcdr-faq.md)
