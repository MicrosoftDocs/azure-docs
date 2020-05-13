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
# Configure & manage content reference - Azure SQL Database

In this article you can find a content reference of various guides, scripts, and explanations that can help you to manage and configure your Azure SQL Database. 

## Load data

- [Migrate to SQL Database](../../sql-database/sql-database-single-database-migrate.md)
- Learn how to [manage SQL database after migration](manage-data-after-migrating-to-database.md).
- [Copy a database](database-copy.md)
- [Import a DB from a BACPAC](../../sql-database/sql-database-import.md)
- [Export a DB to BACPAC](database-export.md)
- [Load data with BCP](../../sql-database/sql-database-load-from-csv-with-bcp.md)
- [Load data with ADF](../../data-factory/connector-azure-sql-database.md?toc=/azure/sql-database/toc.json)

## Configure features

- [Configure Azure AD auth](../../sql-database/sql-database-aad-authentication-configure.md)
- [Configure Conditional Access](../../sql-database/sql-database-conditional-access.md)
- [Multi-factor AAD auth](../../sql-database/sql-database-ssms-mfa-authentication.md)
- [Configure multi-factor auth](../../sql-database/sql-database-ssms-mfa-authentication-configure.md)
- [Configure temporal retention policy](../../sql-database/sql-database-temporal-tables-retention-policy.md)
- [Configure TDE with BYOK](../../sql-database/transparent-data-encryption-byok-azure-sql-configure.md)
- [Rotate TDE BYOK keys](../../sql-database/transparent-data-encryption-byok-azure-sql-key-rotation.md)
- [Remove TDE protector](../../sql-database/transparent-data-encryption-byok-azure-sql-remove-tde-protector.md)
- [Configure In-Memory OLTP](../../sql-database/sql-database-in-memory-oltp-migration.md)
- [Configure Azure Automation](../../sql-database/sql-database-manage-automation.md)
- [Configure transactional replication](../../sql-database/replication-to-sql-database.md) to replicate your date between databases.
- [Configure threat detection](../../sql-database/sql-database-threat-detection.md) to let Azure SQL Database identify suspicious activities such as SQL Injection or access from suspicious locations.
- [Configure dynamic data masking](dynamic-data-masking-configure-portal.md) to protect your sensitive data.
- [Configure backup retention](long-term-backup-retention-configure.md) for a database to keep your backups on Azure Blob Storage. 
- [Configure geo-replication](active-geo-replication-overview.md) to keep a replica of your database in another region.
- [Configure security for geo-replicas](../../sql-database/sql-database-geo-replication-security-config.md).

## Monitor and tune your database

- [Manual tuning](../../sql-database/sql-database-performance-guidance.md)
- [Use DMVs to monitor performance](../../sql-database/sql-database-monitoring-with-dmvs.md)
- [Use Query store to monitor performance](https://docs.microsoft.com/sql/relational-databases/performance/best-practice-with-the-query-store#Insight)
- [Enable automatic tuning](automatic-tuning-enable.md) to let Azure SQL Database optimize performance of your workload.
- [Enable e-mail notifications for automatic tuning](automatic-tuning-email-notifications-configure.md) to get information about tuning recommendations.
- [Apply performance recommendations](database-advisor-find-recommendations-portal.md) and optimize your database.
- [Create alerts](alerts-insights-configure-portal.md) to get notifications from Azure SQL Database.
- [Troubleshoot connectivity](../../sql-database/troubleshoot-connectivity-issues-microsoft-azure-sql-database.md) if you notice some connectivity issues between the applications and the database. You can also use [Resource Health for connectivity issues](../../sql-database/sql-database-resource-health.md).
- [Troubleshoot performance with Intelligent Insights](../../sql-database/sql-database-intelligent-insights-troubleshoot-performance.md)
- [Manage file space](file-space-manage.md) to monitor storage usage in your database.
- [Use Intelligent Insights diagnostics log](../../sql-database/sql-database-intelligent-insights-use-diagnostics-log.md)
- [Monitor In-memory OLTP space](../../sql-database/sql-database-in-memory-oltp-monitoring.md)

### Extended events

- [Extended events](../../sql-database/sql-database-xevent-db-diff-from-svr.md)
- [Store Extended events into event file](../../sql-database/sql-database-xevent-code-event-file.md)
- [Store Extended events into ring buffer](../../sql-database/sql-database-xevent-code-ring-buffer.md)

## Query distributed data

- [Query vertically partitioned data](elastic-query-getting-started-vertical.md) across multiple databases.
- [Report across scaled-out data tier](elastic-query-horizontal-partitioning.md).
- [Query across tables with different schemas](elastic-query-vertical-partitioning.md).

### Data sync

- [SQL Data Sync](../../sql-database/sql-database-sync-data.md)
- [Data Sync Agent](data-sync-agent.md)
- [Replicate schema changes](../../sql-database/sql-database-update-sync-schema.md)
- [Monitor with OMS](../../sql-database/sql-database-sync-monitor-oms.md)
- [Best practices for Data Sync](sql-data-sync-best-practices.md)
- [Troubleshoot Data Sync](../../sql-database/sql-database-troubleshoot-data-sync.md)

## Elastic Database Jobs

- [Create and manage](../../sql-database/elastic-jobs-powershell.md) Elastic Database Jobs using PowerShell.
- [Create and manage](../../sql-database/elastic-jobs-tsql.md) Elastic Database Jobs using Transact-SQL.
- [Migrate from old Elastic job](../../sql-database/elastic-jobs-migrate.md).

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

- [Connectivity](sql-database-libraries.md)
- [Use Spark Connector](../../sql-database/sql-database-spark-connector.md)
- [Authenticate app](../../sql-database/sql-database-client-id-keys.md)
- [Use batching for better performance](../../sql-database/sql-database-use-batching-to-improve-performance.md)
- [Connectivity guidance](../../sql-database/sql-database-connectivity-issues.md)
- [DNS aliases](../../sql-database/dns-alias-overview.md)
- [Setup DNS alias PowerShell](../../sql-database/dns-alias-powershell.md)
- [Ports - ADO.NET](adonet-v12-develop-direct-route-ports.md)
- [C and C ++](../../sql-database/sql-database-develop-cplusplus-simple.md)
- [Excel](../../sql-database/sql-database-connect-excel.md)

## Design applications

- [Design for disaster recovery](../../sql-database/sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Design for elastic pools](disaster-recovery-strategies-for-applications-with-elastic-pool.md)
- [Design for app upgrades](../../sql-database/sql-database-manage-application-rolling-upgrade.md)

### Design Multi-tenant SaaS applications

- [SaaS design patterns](../../sql-database/saas-tenancy-app-design-patterns.md)
- [SaaS video indexer](../../sql-database/saas-tenancy-video-index-wingtip-brk3120-20171011.md)
- [SaaS app security](../../sql-database/saas-tenancy-elastic-tools-multi-tenant-row-level-security.md)

## Next steps
- Learn more about [How-to guides for SQL Managed Instance](../../sql-database/sql-database-howto-managed-instance.md)
