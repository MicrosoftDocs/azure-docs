---
title: How to configure Azure SQL Database | Microsoft Docs
description: Learn how to configure and manage Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
manager: craigg
ms.date: 01/25/2019
---
# How to use Azure SQL Database

In this section you can find various guides, scripts, and explanations that can help you to manage and configure your Azure SQL Database. You can also find specific how-to guides for [single database](sql-database-howto-single-database.md) and [Managed Instance](sql-database-howto-managed-instance.md).

## Load data

- [Copy a single database or pooled database within Azure](sql-database-copy.md)
- [Import a DB from a BACPAC](sql-database-import.md)
- [Export a DB to BACPAC](sql-database-export.md)
- [Load data with BCP](sql-database-load-from-csv-with-bcp.md)
- [Load data with ADF](../data-factory/connector-azure-sql-database.md?toc=/azure/sql-database/toc.json)

### Data sync

- [SQL Data Sync](sql-database-sync-data.md)
- [Data Sync Agent](sql-database-data-sync-agent.md)
- [Replicate schema changes](sql-database-update-sync-schema.md)
- [Monitor with OMS](sql-database-sync-monitor-oms.md)
- [Best practices for Data Sync](sql-database-best-practices-data-sync.md)
- [Troubleshoot Data Sync](sql-database-troubleshoot-data-sync.md)

## Monitoring and tuning

- [Manual tuning](sql-database-performance-guidance.md)
- [Use DMVs to monitor performance](sql-database-monitoring-with-dmvs.md)
- [Use Query store to monitor performance](sql-database-operate-query-store.md)
- [Troubleshoot performance with Intelligent Insights](sql-database-intelligent-insights-troubleshoot-performance.md)
- [Use Intelligent Insights diagnostics log](sql-database-intelligent-insights-use-diagnostics-log.md)
- [Monitor In-memory OLTP space](sql-database-in-memory-oltp-monitoring.md)

### Extended events

- [Extended events](sql-database-xevent-db-diff-from-svr.md)
- [Store Extended events into event file](sql-database-xevent-code-event-file.md)
- [Store Extended events into ring buffer](sql-database-xevent-code-ring-buffer.md)

## Configure features

- [Configure Azure AD auth](sql-database-aad-authentication-configure.md)
- [Configure Conditional Access](sql-database-conditional-access.md)
- [Multi-factor AAD auth](sql-database-ssms-mfa-authentication.md)
- [Configure multi-factor auth](sql-database-ssms-mfa-authentication-configure.md)
- [Configure temporal retention policy](sql-database-temporal-tables-retention-policy.md)
- [Configure TDE with BYOK](transparent-data-encryption-byok-azure-sql-configure.md)
- [Rotate TDE BYOK keys](transparent-data-encryption-byok-azure-sql-key-rotation.md)
- [Remove TDE protector](transparent-data-encryption-byok-azure-sql-remove-tde-protector.md)
- [Configure In-Memory OLTP](sql-database-in-memory-oltp-migration.md)
- [Configure Azure Automation](sql-database-manage-automation.md)

## Develop applications

- [Connectivity](sql-database-libraries.md)
- [Use Spark Connector](sql-database-spark-connector.md)
- [Authenticate app](sql-database-client-id-keys.md)
- [Error messages](sql-database-develop-error-messages.md)
- [Use batching for better performance](sql-database-use-batching-to-improve-performance.md)
- [Connectivity guidance](sql-database-connectivity-issues.md)
- [DNS aliases](dns-alias-overview.md)
- [Setup DNS alias PowerShell](dns-alias-powershell.md)
- [Ports - ADO.NET](sql-database-develop-direct-route-ports-adonet-v12.md)
- [C and C ++](sql-database-develop-cplusplus-simple.md)
- [Excel](sql-database-connect-excel.md)

## Design applications

- [Design for disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Design for elastic pools](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md)
- [Design for app upgrades](sql-database-manage-application-rolling-upgrade.md)

### Design Multi-tenant SaaS applications

- [SaaS design patterns](saas-tenancy-app-design-patterns.md)
- [SaaS video indexer](saas-tenancy-video-index-wingtip-brk3120-20171011.md)
- [SaaS app security](saas-tenancy-elastic-tools-multi-tenant-row-level-security.md)

## Next steps

- Learn more about [How-to guides for managed instances](sql-database-howto-managed-instance.md).
- Learn more about [How-to guides for single databases](sql-database-howto-single-database.md).
