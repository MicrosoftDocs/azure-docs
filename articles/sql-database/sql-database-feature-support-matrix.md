---
title: Azure SQL Database Features | Microsoft Docs
description: This page describes the features of SQL Server supported by Azure SQL Database.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: monicar

ms.assetid: 
ms.service: sql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 11/17/2016
ms.author: carlrab

---
# Azure SQL Database features 

In this topic, you will learn about the features supported by SQL Database, links to those features, and a comparison to the features supported in Microsoft SQL Server.


| Feature | SQL Server | Azure SQL Database | 
| --- | :---: | :---: | 
| Always Encrypted | [Yes](https://msdn.microsoft.com/library/mt163865.aspx) | [Yes](sql-database-always-encrypted.md) |
| AlwaysOn Availability Groups | [Yes](https://msdn.microsoft.com/library/hh510230.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Attach a database | [Yes](https://msdn.microsoft.com/library/ms190209.aspx) | No |
| Auditing | [Yes](https://msdn.microsoft.com/library/cc280386.aspx) | [Yes](sql-database-auditing-get-started.md) |
| BACPAC file (export) | [Yes](https://msdn.microsoft.com/en-us/library/hh213241.aspx) | [Yes](sql-database-export.md) |
| BACPAC file (import) | [Yes](https://msdn.microsoft.com/en-us/library/hh710052.aspx) | [Yes](sql-database-import.md) |
| Change Data Capture | [Yes](https://msdn.microsoft.com/library/cc645937.aspx) | No |
| Change Tracking | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) |
| Columnstore indexes | [Yes](https://msdn.microsoft.com/library/gg492088.aspx) | [Premium edition only](https://msdn.microsoft.com/library/gg492088.aspx) |
| Common language runtime (CLR) | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) |
| Contained databases | [Yes](https://msdn.microsoft.com/library/ff929071.aspx) | Built-in |
| Contained users | [Yes](https://msdn.microsoft.com/library/ff929188.aspx) | [Yes](sql-database-manage-logins.md#non-administrator-users) |
| Cross-database queries | [Yes](https://msdn.microsoft.com/library/dn584627.aspx) | [Elastic queriues](sql-database-elastic-query-overview.md) |
| Data compression | [Yes](https://msdn.microsoft.com/library/cc280449.aspx) | [Yes](https://msdn.microsoft.com/library/cc280449.aspx) |
| Database backups | [Exposed for users](https://msdn.microsoft.com/library/ms187048.aspx) | [Built-in](sql-database-automated-backups.md) |
| Database mail | [Yes](https://msdn.microsoft.com/library/ms189635.aspx) | No |
| Database mirroring | [Yes](https://msdn.microsoft.com/library/ms189852.aspx) | No |
| Database configuration options | [Yes](https://msdn.microsoft.com/library/mt629158.aspx) | [Yes](https://msdn.microsoft.com/library/mt629158.aspx) |
| Data Quality Services (DQS) | [Yes](https://msdn.microsoft.com/library/ff877925.aspx) | No |
| Database snapshots | [Yes](https://msdn.microsoft.com/library/ms175158.aspx) | No |
| DBCC statements | [All](https://msdn.microsoft.com/library/ms188796.aspx) | [Some](https://msdn.microsoft.com/library/ms188796.aspx) |
| DDL triggers | [Yes](https://msdn.microsoft.com/library/ms175941.aspx) | [Database only](https://msdn.microsoft.com/library/ms175941.aspx) |
| Distributed transactions | [MS DTC](https://msdn.microsoft.com/library/ms131665.aspx) | Within SQL Database only |
| DML tirggers | [Yes](https://msdn.microsoft.com/library/ms178110.aspx) | [Yes](https://msdn.microsoft.com/library/ms178110.aspx) |
| DMVs | [All](https://msdn.microsoft.com/library/ms188754.aspx) | [Some](https://msdn.microsoft.com/library/ms188754.aspx) |
| Event notifications | [Yes](https://msdn.microsoft.com/library/ms186376.aspx) | [Yes](sql-database-insights-alerts-portal.md) |
| Extended events | [Yes](https://msdn.microsoft.com/library/bb630282.aspx) | [Some](sql-database-xevent-db-diff-from-svr.md) |
| Extended stored procedures | [Yes](https://msdn.microsoft.com/library/ms164627.aspx) | No |
| File groups | [Yes](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) | [Primary only](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) |
| Filestream | [Yes](https://msdn.microsoft.com/library/gg471497.aspx) | No |
| Full-text search | [Yes](https://msdn.microsoft.com/library/ms142571.aspx) | [No third-party word breakers](https://msdn.microsoft.com/library/ms142571.aspx) |
| In-memory optimization | [Yes](https://msdn.microsoft.com/library/dn133186.aspx) | [Premium edition only](https://msdn.microsoft.com/library/dn133186.aspx) |
| Jobs | [SQL Server Agent](https://msdn.microsoft.com/library/ms189237.aspx) | [Yes](sql-database-elastic-jobs-getting-started.md) |
| JSON data support | [Yes](https://msdn.microsoft.com/library/dn921897.aspx) | [Yes](sql-database-json-features.md) |
| Linked servers | [Yes](https://msdn.microsoft.com/library/ms188279.aspx) | No - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
| Log shipping | [Yes](https://msdn.microsoft.com/library/ms187103.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Master Data Services (MDS) | [Yes](https://msdn.microsoft.com/library/ff487003.aspx) | No |
| Minimal logging in bulk import | [Yes](https://msdn.microsoft.com/library/ms190422.aspx) | No |
| Modifying system data | [Yes](https://msdn.microsoft.com/library/ms178028.aspx) | No |
| Online index operations | [Yes](https://msdn.microsoft.com/library/ms177442.aspx) | [Transaction size limited by service tier](https://msdn.microsoft.com/library/ms177442.aspx) |
| Point in time database restore | [Yes](https://msdn.microsoft.com/library/ms179451.aspx) | [Yes](sql-database-recovery-using-backups.md#point-in-time-restore) |
| Policy-based management | [Yes](https://msdn.microsoft.com/library/bb510667.aspx) | No |
| Resource governor | [Yes](https://msdn.microsoft.com/library/bb933866.aspx) | [Built-in](sql-database-service-tiers.md) |
| Restore database from backup | [Yes](https://msdn.microsoft.com/library/ms187048.aspx#Restore data backups) | [[From built-in backups only](sql-database-recovery-using-backups.md)] |
| Row Level Security | [Yes](https://msdn.microsoft.com/library/dn765131.aspx) | [Yes](https://msdn.microsoft.com/library/dn765131.aspx) |
| Semantic search | [Yes](https://msdn.microsoft.com/library/gg492075.aspx) | No |
| Sequence numbers | [Yes](https://msdn.microsoft.com/library/ff878058.aspx) | [Yes](https://msdn.microsoft.com/library/ff878058.aspx) |
| Service Broker | [Yes](https://msdn.microsoft.com/library/bb522893.aspx) | [Inside database only](https://msdn.microsoft.com/library/bb522893.aspx) |
| Server configuration options | [Yes](https://msdn.microsoft.com/library/ms189631.aspx) | No - see [Database configuration options](https://msdn.microsoft.com/library/mt629158.aspx) |
| Spatial | [Yes](https://msdn.microsoft.com/library/bb933790.aspx) | [Yes](https://msdn.microsoft.com/library/bb933790.aspx) |
| SQL Server Agent | [Yes](https://msdn.microsoft.com/library/ms189237.aspx) | No - See [Elastic jobs](sql-database-elastic-jobs-getting-started.md) |
| SQL Server Analysis Services (SSAS) | [Yes](https://msdn.microsoft.co/library/bb522607.aspx) | No - see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) |
| SQL Server Integration Services (SSIS) | [Yes](https://msdn.microsoft.com/library/ms141026.aspx) | No - see [Azure Data Factory](https://azure.microsoft.com/en-us/services/data-factory/) |
| SQL Server PowerShell | [Yes](https://msdn.microsoft.com/library/hh245198.aspx) | [Yes](https://msdn.microsoft.com/library/hh245198.aspx) |
| SQL Server Profiler | [Yes](https://msdn.microsoft.com/library/ms181091.aspx) | No - see [Extended events](https://msdn.microsoft.com/library/ms181091.aspx) |
| SQL Server Replication | [Yes](https://msdn.microsoft.com/library/ms151198.aspx) | [Transactional replication subscriber only](sql-database-cloud-migrate-compatible-using-transactional-replication.md) |
| SQL Server Reporting Services (SSRS) | [Yes](https://msdn.microsoft.com/library/ms159106.aspx) | No |
| Stored procedures | [Yes](https://msdn.microsoft.com/library/ms190782.aspx) | [Yes](https://msdn.microsoft.com/library/ms190782.aspx) |
| Table Partitioning | [Yes](https://msdn.microsoft.com/library/ms190787.aspx) | [Primary filegroup only](https://msdn.microsoft.com/library/ms190787.aspx) |
| Temporary tables | [Local and global](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) | [Local only](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) |
| Temporal tables | [Yes](https://msdn.microsoft.com/library/dn935015.aspx) | [Yes](sql-database-temporal-tables.md) |
| Transparent data encryption (TDE)  | [Yes](https://msdn.microsoft.com/library/azure/bb934049) | [Yes](https://msdn.microsoft.com/library/azure/dn948096) |
| Windows Server Failover clustering | [Yes](https://msdn.microsoft.com/library/hh270278.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |

## Resources

For information about Transact-SQL support and differences, see [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md)
