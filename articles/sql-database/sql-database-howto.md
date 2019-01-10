---
title: How to configure Azure SQL Database | Microsoft Docs
description: Learn how to configure and manage Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: 
ms.devlang: 
ms.topic: howto
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: carlr
manager: craigg
ms.date: 12/14/2018
---
# How to use Azure SQL Database

In this section you can find various guides, scripts, and explanations that can help you to manage and configure your Azure SQL Database. You can also find specific how-to guides for [Single Database](sql-database-howto-single-database.md) and [Managed Instance](sql-database-howto-managed-instance.md).

## Load data

- [Copy a single database within Azure](https://docs.microsoft.com/azure/sql-database/sql-database-copy)
- [Import a DB from a BACPAC](https://docs.microsoft.com/azure/sql-database/sql-database-import)
- [Export a DB to BACPAC](https://docs.microsoft.com/azure/sql-database/sql-database-export)
- [Load data with BCP](https://docs.microsoft.com/azure/sql-database/sql-database-load-from-csv-with-bcp)
- [Load data with ADF](https://docs.microsoft.com/azure/data-factory/connector-azure-sql-database?toc=/azure/sql-database/toc.json)

### Data sync

- [SQL Data Sync](https://docs.microsoft.com/azure/sql-database/sql-database-sync-data)
- [Data Sync Agent](https://docs.microsoft.com/azure/sql-database/sql-database-data-sync-agent)
- [Replicate schema changes](https://docs.microsoft.com/azure/sql-database/sql-database-update-sync-schema)
- [Monitor with OMS](https://docs.microsoft.com/azure/sql-database/sql-database-sync-monitor-oms)
- [Best practices for Data Sync](https://docs.microsoft.com/azure/sql-database/sql-database-best-practices-data-sync)
- [Troubleshoot Data Sync](https://docs.microsoft.com/azure/sql-database/sql-database-troubleshoot-data-sync)

## Monitoring and tuning

-  [Manual tuning](https://docs.microsoft.com/azure/sql-database/sql-database-performance-guidance)
- [Use DMVs to monitor performance](https://docs.microsoft.com/azure/sql-database/sql-database-monitoring-with-dmvs)
- [Use Query store to monitor performance](https://docs.microsoft.com/azure/sql-database/sql-database-operate-query-store)
- [Troubleshoot performance with Intelligent Insights](https://docs.microsoft.com/azure/sql-database/sql-database-intelligent-insights-troubleshoot-performance)
- [Use Intelligent Insights diagnostics log](https://docs.microsoft.com/azure/sql-database/sql-database-intelligent-insights-use-diagnostics-log)
- [Monitor In-memory OLTP space](https://docs.microsoft.com/azure/sql-database/sql-database-in-memory-oltp-monitoring)

### Extended events

- [Extended events](https://docs.microsoft.com/azure/sql-database/sql-database-xevent-db-diff-from-svr)
- [Store Extended events into event file](https://docs.microsoft.com/azure/sql-database/sql-database-xevent-code-event-file)
- [Store Extended events into ring buffer](https://docs.microsoft.com/azure/sql-database/sql-database-xevent-code-ring-buffer)

## Configure features

- [Configure Azure AD auth](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure)
- [Configure conditional access](https://docs.microsoft.com/azure/sql-database/sql-database-conditional-access)
- [Multi-factor AAD auth](https://docs.microsoft.com/azure/sql-database/sql-database-ssms-mfa-authentication)
- [Configure multi-factor auth](https://docs.microsoft.com/azure/sql-database/sql-database-ssms-mfa-authentication-configure)
- [Configure temporal retention policy](https://docs.microsoft.com/azure/sql-database/sql-database-temporal-tables-retention-policy)
- [Configure TDE with BYOK](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-byok-azure-sql-configure)
- [Rotate TDE BYOK keys](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-byok-azure-sql-key-rotation)
- [Remove TDE protector](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-byok-azure-sql-remove-tde-protector)
- [Configure In-Memory OLTP](https://docs.microsoft.com/azure/sql-database/sql-database-in-memory-oltp-migration)
- [Configure Azure Automation](https://docs.microsoft.com/azure/sql-database/sql-database-manage-automation)

## Develop applications

- [Connectivity](https://docs.microsoft.com/azure/sql-database/sql-database-libraries)
- [Use Spark Connector](https://docs.microsoft.com/azure/sql-database/sql-database-spark-connector)
- [Authenticate app](https://docs.microsoft.com/azure/sql-database/sql-database-client-id-keys)
- [Error messages](https://docs.microsoft.com/azure/sql-database/sql-database-develop-error-messages)
- [Use batching for better performance](https://docs.microsoft.com/azure/sql-database/sql-database-use-batching-to-improve-performance)
- [Connectivity guidance](https://docs.microsoft.com/azure/sql-database/sql-database-connectivity-issues)
- [DNS aliases](https://docs.microsoft.com/azure/sql-database/dns-alias-overview)
- [Setup DNS alias PowerShell](https://docs.microsoft.com/azure/sql-database/dns-alias-powershell)
- [Ports - ADO.NET](https://docs.microsoft.com/azure/sql-database/sql-database-develop-direct-route-ports-adonet-v12)
- [C and C ++](https://docs.microsoft.com/azure/sql-database/sql-database-develop-cplusplus-simple)
- [Excel](https://docs.microsoft.com/azure/sql-database/sql-database-connect-excel)

## Design applications

- [Design for disaster recovery](https://docs.microsoft.com/azure/sql-database/sql-database-designing-cloud-solutions-for-disaster-recovery)
- [Design for elastic pools](https://docs.microsoft.com/azure/sql-database/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool)
- [Design for app upgrades](https://docs.microsoft.com/azure/sql-database/sql-database-manage-application-rolling-upgrade)

### Design Multi-tenant SaaS applications

- [SaaS design patterns](https://docs.microsoft.com/azure/sql-database/saas-tenancy-app-design-patterns)
- [SaaS video indexer](https://docs.microsoft.com/azure/sql-database/saas-tenancy-video-index-wingtip-brk3120-20171011)
- [SaaS app security](https://docs.microsoft.com/azure/sql-database/saas-tenancy-elastic-tools-multi-tenant-row-level-security)

## Next steps
- Learn more about [How-to guides in Managed Instance](sql-database-howto-managed-instance.md).
- Learn more about [How-to guides in Single Database](sql-database-howto-single-database.md).
