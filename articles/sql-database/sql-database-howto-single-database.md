---
title: How to configure a single database
description: Learn how to configure and manage Azure SQL Database - single database
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: carlr
ms.date: 01/14/2020
---
# How to use a single database in Azure SQL Database

In this section you can find various guides, scripts, and explanations that can help you to manage and configure your single database in Azure SQL Database

## Migrate

- [Migrate to SQL Database](sql-database-single-database-migrate.md) – Learn about the recommended migration process and tools for migration to a managed instance.
- Learn how to [manage SQL database after migration](sql-database-manage-after-migration.md).

## Configure features

- [Configure transactional replication](replication-to-sql-database.md) to replicate your date between databases.
- [Configure threat detection](sql-database-threat-detection.md) to let Azure SQL Database identify suspicious activities such as SQL Injection or access from suspicious locations.
- [Configure dynamic data masking](sql-database-dynamic-data-masking-get-started-portal.md) to protect your sensitive data.
- [Configure backup retention](sql-database-long-term-backup-retention-configure.md) for a database to keep your backups on Azure Blob Storage. As an alternative there is [Configure backup retention using Azure vault (deprecated)](sql-database-long-term-backup-retention-configure-vault.md) approach.
- [Configure geo-replication](sql-database-geo-replication-portal.md) to keep a replica of your database in another region.
- [Configure security for geo-replicas](sql-database-geo-replication-security-config.md).

## Monitor and tune your database

- [Enable automatic tuning](sql-database-automatic-tuning-enable.md) to let Azure SQL Database optimize performance of your workload.
- [Enable e-mail notifications for automatic tuning](sql-database-automatic-tuning-email-notifications.md) to get information about tuning recommendations.
- [Apply performance recommendations](sql-database-advisor-portal.md) and optimize your database.
- [Create alerts](sql-database-insights-alerts-portal.md) to get notifications from Azure SQL Database.
- [Troubleshoot connectivity](troubleshoot-connectivity-issues-microsoft-azure-sql-database.md) if you notice some connectivity issues between the applications and the database. You can also use [Resource Health for connectivity issues](sql-database-resource-health.md).
- [Manage file space](sql-database-file-space-management.md) to monitor storage usage in your database.

## Query distributed data

- [Query vertically partitioned data](sql-database-elastic-query-getting-started-vertical.md) across multiple databases.
- [Report across scaled-out data tier](sql-database-elastic-query-horizontal-partitioning.md).
- [Query across tables with different schemas](sql-database-elastic-query-vertical-partitioning.md).

## Elastic Database Jobs

- [Create and manage](elastic-jobs-powershell.md) Elastic Database Jobs using PowerShell.
- [Create and manage](elastic-jobs-tsql.md) Elastic Database Jobs using Transact-SQL.
- [Migrate from old Elastic job](elastic-jobs-migrate.md).

## Database sharding

- [Upgrade elastic database client library](sql-database-elastic-scale-upgrade-client-library.md).
- [Create sharded app](sql-database-elastic-scale-get-started.md).
- [Query horizontally sharded data](sql-database-elastic-query-getting-started.md).
- Run [Multi-shard queries](sql-database-elastic-scale-multishard-querying.md).
- [Move sharded data](sql-database-elastic-scale-configure-deploy-split-and-merge.md).
- [Configure security](sql-database-elastic-scale-split-merge-security-configuration.md) in database shards.
- [Add a shard](sql-database-elastic-scale-add-a-shard.md) to the current set of database shards.
- [Fix shard map problems](sql-database-elastic-database-recovery-manager.md).
- [Migrate sharded DB](sql-database-elastic-convert-to-use-elastic-tools.md).
- [Create counters](sql-database-elastic-database-perf-counters.md).
- [Use entity framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) to query sharded data.
- [Use Dapper framework](sql-database-elastic-scale-working-with-dapper.md) to query sharded data.

## Next steps
- Learn more about [How-to guides for managed instance](sql-database-howto-managed-instance.md)
