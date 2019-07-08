---
title: SQL Database disaster recovery | Microsoft Docs
description: Learn how to recover a database from a regional datacenter outage or failure with the Azure SQL Database active geo-replication, and geo-restore capabilities.
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
ms.date: 06/21/2019
---
# Restore an Azure SQL Database or failover to a secondary

Azure SQL Database offers the following capabilities for recovering from an outage:

- [Active geo-replication](sql-database-active-geo-replication.md)
- [Auto-failover groups](sql-database-auto-failover-group.md)
- [Geo-restore](sql-database-recovery-using-backups.md#point-in-time-restore)
- [Zone-redundant databases](sql-database-high-availability.md)

To learn about business continuity scenarios and the features supporting these scenarios, see [Business continuity](sql-database-business-continuity.md).

> [!NOTE]
> If you are using zone-redundant Premium or Business Critical databases or pools, the recovery process is automated and the rest of this material does not apply.

> [!NOTE]
> Both primary and secondary databases are required to have the same service tier. It is also strongly recommended that the secondary database is created with the same compute size (DTUs or vCores) as the primary. For more information, see [Upgrading or downgrading as primary database](sql-database-active-geo-replication.md#upgrading-or-downgrading-primary-database).

> [!NOTE]
> Use one or several failover groups to manage failover of multiple databases.
> If you add an existing geo-replication relationship to the failover group, make sure the geo-secondary is configured with the same service tier and compute size as the primary. For more information, see [Use auto-failover groups to enable transparent and coordinated failover of multiple databases](sql-database-auto-failover-group.md).

## Prepare for the event of an outage

For success with recovery to another data region using either failover groups or geo-redundant backups, you need to prepare a server in another data center outage to become the new primary server should the need arise as well as have well-defined steps documented and tested to ensure a smooth recovery. These preparation steps include:

- Identify the SQL Database server in another region to become the new primary server. For geo-restore, this is generally a server in the [paired region](../best-practices-availability-paired-regions.md) for the region in which your database is located. This eliminates the additional traffic cost during the geo-restoring operations.
- Identify, and optionally define, the server-level IP firewall rules needed on for users to access the new primary database.
- Determine how you are going to redirect users to the new primary server, such as by changing connection strings or by changing DNS entries.
- Identify, and optionally create, the logins that must be present in the master database on the new primary server, and ensure these logins have appropriate permissions in the master database, if any. For more information, see [SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md)
- Identify alert rules that need to be updated to map to the new primary database.
- Document the auditing configuration on the current primary database
- Perform a [disaster recovery drill](sql-database-disaster-recovery-drills.md). To simulate an outage for geo-restore, you can delete or rename the source database to cause application connectivity failure. To simulate an outage using failover groups, you can disable the web application or virtual machine connected to the database or failover the database to cause application connectivity failures.

## When to initiate recovery

The recovery operation impacts the application. It requires changing the SQL connection string or redirection using DNS and could result in permanent data loss. Therefore, it should be done only when the outage is likely to last longer than your application's recovery time objective. When the application is deployed to production you should perform regular monitoring of the application health and use the following data points to assert that the recovery is warranted:

1. Permanent connectivity failure from the application tier to the database.
2. The Azure portal shows an alert about an incident in the region with broad impact.

> [!NOTE]
> If you are using failover groups and chose automatic failover, the recovery process is automated and transparent to the application.

Depending on your application tolerance to downtime and possible business liability you can consider the following recovery options.

Use the [Get Recoverable Database](https://msdn.microsoft.com/library/dn800985.aspx) (*LastAvailableBackupDate*) to get the latest Geo-replicated restore point.

## Wait for service recovery

The Azure teams work diligently to restore service availability as quickly as possible but depending on the root cause it can take hours or days.  If your application can tolerate significant downtime you can simply wait for the recovery to complete. In this case, no action on your part is required. You can see the current service status on our [Azure Service Health Dashboard](https://azure.microsoft.com/status/). After the recovery of the region, your application’s availability is restored.

## Fail over to geo-replicated secondary server in the failover group

If your application’s downtime can result in business liability, you should be using failover groups. It enables the application to quickly restore availability in a different region in case of an outage. For a tutorial, see [Implement a geo-distributed database](sql-database-implement-geo-distributed-database.md).

To restore availability of the database(s) you need to initiate the failover to the secondary server using one of the supported methods.

Use one of the following guides to fail over to a geo-replicated secondary database:

- [Fail over to a geo-replicated secondary server using the Azure portal](sql-database-geo-replication-portal.md)
- [Fail over to the secondary server using PowerShell](scripts/sql-database-setup-geodr-and-failover-database-powershell.md)
- [Fail over to a secondary server using Transact-SQL (T-SQL)](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current#e-failover-to-a-geo-replication-secondary)

## Recover using geo-restore

If your application’s downtime does not result in business liability you can use [geo-restore](sql-database-recovery-using-backups.md) as a method to recover your application database(s). It creates a copy of the database from its latest geo-redundant backup.

## Configure your database after recovery

If you are using geo-restore to recover from an outage, you must make sure that the connectivity to the new databases is properly configured so that the normal application function can be resumed. This is a checklist of tasks to get your recovered database production ready.

### Update connection strings

Because your recovered database resides in a different server, you need to update your application’s connection string to point to that server.

For more information about changing connection strings, see the appropriate development language for your [connection library](sql-database-libraries.md).

### Configure Firewall Rules

You need to make sure that the firewall rules configured on server and on the database match those that were configured on the primary server and primary database. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

### Configure logins and database users

You need to make sure that all the logins used by your application exist on the server which is hosting your recovered database. For more information, see [Security Configuration for geo-replication](sql-database-geo-replication-security-config.md).

> [!NOTE]
> You should configure and test your server firewall rules and logins (and their permissions) during a disaster recovery drill. These server-level objects and their configuration may not be available during the outage.

### Setup telemetry alerts

You need to make sure your existing alert rule settings are updated to map to the recovered database and the different server.

For more information about database alert rules, see [Receive Alert Notifications](../monitoring-and-diagnostics/insights-receive-alert-notifications.md) and [Track Service Health](../monitoring-and-diagnostics/insights-service-health.md).

### Enable auditing

If auditing is required to access your database, you need to enable Auditing after the database recovery. For more information, see [Database auditing](sql-database-auditing.md).

## Next steps

- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- To learn about business continuity design and recovery scenarios, see [Continuity scenarios](sql-database-business-continuity.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
