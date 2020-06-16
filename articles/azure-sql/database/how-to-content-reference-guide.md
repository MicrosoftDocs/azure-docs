---
title: Configure & manage content reference
description: Find a reference of content that teaches you to configure and manage Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: carlr
ms.date: 01/14/2020
---
# Configure and manage content reference - Azure SQL Database
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

In this article you can find a content reference of various guides, scripts, and explanations that can help you to manage and configure your Azure SQL Database. 

## Load data

- [Migrate to SQL Database](migrate-to-database-from-sql-server.md)
- Learn how to [manage SQL Database after migration](manage-data-after-migrating-to-database.md).
- [Copy a database](database-copy.md)
- [Import a DB from a BACPAC](database-import.md)
- [Export a DB to BACPAC](database-export.md)
- [Load data with BCP](../load-from-csv-with-bcp.md)
- [Load data with ADF](../../data-factory/connector-azure-sql-database.md?toc=/azure/sql-database/toc.json)

## Configure features

- [Configure Azure Active Directory (Azure AD) auth](authentication-aad-configure.md)
- [Configure Conditional Access](conditional-access-configure.md)
- [Multi-factor Azure AD auth](authentication-mfa-ssms-overview.md)
- [Configure Multi-Factor Authentication](authentication-mfa-ssms-configure.md)
- [Configure temporal retention policy](temporal-tables-retention-policy.md)
- [Configure TDE with BYOK](transparent-data-encryption-byok-configure.md)
- [Rotate TDE BYOK keys](transparent-data-encryption-byok-key-rotation.md)
- [Remove TDE protector](transparent-data-encryption-byok-remove-tde-protector.md)
- [Configure In-Memory OLTP](../in-memory-oltp-configure.md)
- [Configure Azure Automation](automation-manage.md)
- [Configure transactional replication](replication-to-sql-database.md) to replicate your date between databases.
- [Configure threat detection](threat-detection-configure.md) to let Azure SQL Database identify suspicious activities such as SQL Injection or access from suspicious locations.
- [Configure dynamic data masking](dynamic-data-masking-configure-portal.md) to protect your sensitive data.
- [Configure backup retention](long-term-backup-retention-configure.md) for a database to keep your backups on Azure Blob Storage. 
- [Configure geo-replication](active-geo-replication-overview.md) to keep a replica of your database in another region.
- [Configure security for geo-replicas](active-geo-replication-security-configure.md).

## Monitor and tune your database

- [Manual tuning](performance-guidance.md)
- [Use DMVs to monitor performance](monitoring-with-dmvs.md)
- [Use Query store to monitor performance](https://docs.microsoft.com/sql/relational-databases/performance/best-practice-with-the-query-store#Insight)
- [Enable automatic tuning](automatic-tuning-enable.md) to let Azure SQL Database optimize performance of your workload.
- [Enable e-mail notifications for automatic tuning](automatic-tuning-email-notifications-configure.md) to get information about tuning recommendations.
- [Apply performance recommendations](database-advisor-find-recommendations-portal.md) and optimize your database.
- [Create alerts](alerts-insights-configure-portal.md) to get notifications from Azure SQL Database.
- [Troubleshoot connectivity](troubleshoot-common-errors-issues.md) if you notice some connectivity issues between the applications and the database. You can also use [Resource Health for connectivity issues](resource-health-to-troubleshoot-connectivity.md).
- [Troubleshoot performance with Intelligent Insights](intelligent-insights-troubleshoot-performance.md)
- [Manage file space](file-space-manage.md) to monitor storage usage in your database.
- [Use Intelligent Insights diagnostics log](intelligent-insights-use-diagnostics-log.md)
- [Monitor In-memory OLTP space](../in-memory-oltp-monitor-space.md)

### Extended events

- [Extended events](xevent-db-diff-from-svr.md)
- [Store Extended events into event file](xevent-code-event-file.md)
- [Store Extended events into ring buffer](xevent-code-ring-buffer.md)

## Query distributed data

- [Query vertically partitioned data](elastic-query-getting-started-vertical.md) across multiple databases.
- [Report across scaled-out data tier](elastic-query-horizontal-partitioning.md).
- [Query across tables with different schemas](elastic-query-vertical-partitioning.md).

### Data sync

- [SQL Data Sync](sql-data-sync-data-sql-server-sql-database.md)
- [Data Sync Agent](sql-data-sync-agent-overview.md)
- [Replicate schema changes](sql-data-sync-update-sync-schema.md)
- [Monitor with OMS](sql-data-sync-monitor-sync.md)
- [Best practices for Data Sync](sql-data-sync-best-practices.md)
- [Troubleshoot Data Sync](sql-data-sync-troubleshoot.md)

## Elastic Database jobs

- [Create and manage](elastic-jobs-powershell-create.md) Elastic Database Jobs using PowerShell.
- [Create and manage](elastic-jobs-tsql-create-manage.md) Elastic Database Jobs using Transact-SQL.
- [Migrate from old Elastic job](elastic-jobs-migrate.md).

## Database sharding

- [Upgrade elastic database client library](elastic-scale-upgrade-client-library.md).
- [Create sharded app](elastic-scale-get-started.md).
- [Query horizontally sharded data](elastic-query-getting-started.md).
- Run [Multi-shard queries](elastic-scale-multishard-querying.md).
- [Move sharded data](elastic-scale-configure-deploy-split-and-merge.md).
- [Configure security](elastic-scale-split-merge-security-configuration.md) in database shards.
- [Add a shard](elastic-scale-add-a-shard.md) to the current set of database shards.
- [Fix shard map problems](elastic-database-recovery-manager.md).
- [Migrate sharded DB](elastic-convert-to-use-elastic-tools.md).
- [Create counters](elastic-database-perf-counters.md).
- [Use entity framework](elastic-scale-use-entity-framework-applications-visual-studio.md) to query sharded data.
- [Use Dapper framework](elastic-scale-working-with-dapper.md) to query sharded data.

## Develop applications

- [Connectivity](connect-query-content-reference-guide.md#libraries)
- [Use Spark Connector](spark-connector.md)
- [Authenticate app](application-authentication-get-client-id-keys.md)
- [Use batching for better performance](../performance-improve-use-batching.md)
- [Connectivity guidance](troubleshoot-common-connectivity-issues.md)
- [DNS aliases](dns-alias-overview.md)
- [Setup DNS alias PowerShell](dns-alias-powershell-create.md)
- [Ports - ADO.NET](adonet-v12-develop-direct-route-ports.md)
- [C and C ++](develop-cplusplus-simple.md)
- [Excel](connect-excel.md)

## Design applications

- [Design for disaster recovery](designing-cloud-solutions-for-disaster-recovery.md)
- [Design for elastic pools](disaster-recovery-strategies-for-applications-with-elastic-pool.md)
- [Design for app upgrades](manage-application-rolling-upgrade.md)

### Design Multi-tenant software as a service (SaaS) applications

- [SaaS design patterns](saas-tenancy-app-design-patterns.md)
- [SaaS video indexer](saas-tenancy-video-index-wingtip-brk3120-20171011.md)
- [SaaS app security](saas-tenancy-elastic-tools-multi-tenant-row-level-security.md)

## Next steps

- Learn more about [How-to guides for Azure SQL Managed Instance](../managed-instance/how-to-content-reference-guide.md)
