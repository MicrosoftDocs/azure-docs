<properties
	pageTitle="Azure SQL Database business continuity scenarios | Microsoft Azure"
	description="Azure SQL Database business continuity scenarios"
	services="sql-database"
	documentationCenter=""
	authors="CarlRabeler"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/16/2016"
	ms.author="carlrab"
   ms.workload="sqldb-bcdr"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>



# Business continuity scenarios for Azure SQL Database

This article introduces serveral disaster recovery scenarios and several application design scenarios for business continuity.

## Recover from an outage

In the event of an outage, [Recover an Azure SQL Database from an outage](sql-database-disaster-recovery.md) describes how to use either of the following business continuity solutions to recover from the outage:

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-recovery-using.backups.md#geo-restore)

The specific steps and the length of time required to recover from an outage will differ depending on the business continuity solution that you choose. However, regardless of your business continuity solution, you need to know when to initiate recovery, the database recovery steps for each business continuity solution, how to configure your database after recovery, and how to configure your application after the recovery to complete your recovery from an outage.  

## Recover from an error

In the event of a user error or other unintended data modification error, [Recover an Azure SQL Database from an error](sql-database-user-error-recovery.md) describes how to use either of the following business continuity solutions to recover from the error:

- [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore) 
- [Restore deleted database](sql-database-recovery-using-backups.md#deleted-database-restore)

The specific steps and the length of time required to recover from an outage will differ depending on the business continuity solution that you choose. However, regardless of your business continuity solution, you need to know how to recover from an error for each business continuity solution. 

## Perform a disaster recovery drill to prepare for an outage

For your business continuity solution to be effective, it is recommended that validation of application readiness for recovery workflow be performed periodically. Verifying the application behavior and implications of data loss and/or the disruption that failover involves is a good engineering practice. It is also a requirement by most industry standards as part of business continuity certification.

Performing a disaster recovery drill consists of:

- Simulating data tier outage
- Recovering 
- Validate application integrity post recovery

[Performing a disaster recovery drill](sql-database-disaster-recovery-drills.md) descibes how to perform a disaster recovery drill using either of the following business continuity solutions:

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-recovery-using-backups.md#geo-restore)

## Manage rolling upgrades of cloud applications uisng Active Geo-Replication

Upgrading a cloud application with a SQL Database is a disruptive operation, and, as such, you need to include this scenario as part of your business continuity planning and design. [Manage application upgrades](sql-database-manage-application-rolling-upgrade.md) describes how to use [Geo-Replication](sql-database-geo-replication-overview.md) in SQL Database to enable rolling upgrades of your cloud application. Because upgrade  This article looks at two different methods of orchestrating the upgrade process and discusses the benefits and trade-offs of each option. 

## Design an application for cloud disaster recovery using Active Geo-Replication

[Design an application for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md) describes how to use [Active Geo-Replication](sql-database-geo-replication-overview.md) in SQL Database to design database applications resilient to regional failures and catastrophic outages. This article considers the application deployment topology, the service level agreement you are targeting, traffic latency, and costs and then looks at the common application patterns - each with benefits and trade-offs.

## Disaster recovery strategies for applications using elastic database pools

[Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md) describes the disaster recovery scenarios using [elastic database pools](sql-database-elastic-pool.md).

## Next steps

- For a business continuity overview, see [Business continuity overview](sql-database-business-continuity.md)
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- To learn about business continuity scenarios, see [Continuity scenarios](sql-database-business-continuity.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)
