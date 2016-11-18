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
| Backup | [Exposed for users](https://msdn.microsoft.com/library/ms187048.aspx) | [Built-in](sql-database-automated-backups.md) |
| BACPAC file (export) | [Yes](https://msdn.microsoft.com/en-us/library/hh213241.aspx) | [Yes](sql-database-export.md) |
| BACPAC file (import) | [Yes](https://msdn.microsoft.com/en-us/library/hh710052.aspx) | [Yes](sql-database-import.md) |
| Change Data Capture | [Yes](https://msdn.microsoft.com/library/cc645937.aspx) | No |
| Change Tracking | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) |
| CLR (Common language runtime) | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) |
| Columnstore indexes | [Yes](https://msdn.microsoft.com/library/gg492088.aspx) | [Premium edition only][Yes](https://msdn.microsoft.com/library/gg492088.aspx) |
| Contained databases | [Yes](https://msdn.microsoft.com/library/ff929071.aspx) | Built-in |
| Contained users | [Yes](https://msdn.microsoft.com/library/ff929188.aspx) | [Yes](sql-database-manage-logins.md#non-administrator-users) |
| Cross-database queries | [Yes](https://msdn.microsoft.com/library/dn584627.aspx) | [Elastic queriues](sql-database-elastic-query-overview.md) |
| Data compression | [Yes](https://msdn.microsoft.com/library/cc280449.aspx) | [Yes](https://msdn.microsoft.com/library/cc280449.aspx) |
| Database mail | [Yes](https://msdn.microsoft.com/library/ms189635.aspx) | No |
| Database mirroring | [Yes](https://msdn.microsoft.com/library/ms189852.aspx) | No |
| Database scoped configurations | [Yes](https://msdn.microsoft.com/library/mt629158.aspx) | [Yes](https://msdn.microsoft.com/library/mt629158.aspx) |
| Database snapshots | [Yes](https://msdn.microsoft.com/library/ms175158.aspx) | No |
| DBCC statements | [All](https://msdn.microsoft.com/library/ms188796.aspx) | [Some](https://msdn.microsoft.com/library/ms188796.aspx) |
| DDL triggers | [Yes](https://msdn.microsoft.com/library/ms175941.aspx) | [Database only](https://msdn.microsoft.com/library/ms175941.aspx) |
| Distributed transactions | [MS DTC](https://msdn.microsoft.com/library/ms131665.aspx) | Within SQL Database only |
| DML tirggers | [Yes](https://msdn.microsoft.com/library/ms178110.aspx) | [Yes](https://msdn.microsoft.com/library/ms178110.aspx) |
| DMVs | [All](https://msdn.microsoft.com/library/ms188754.aspx) | [Some](https://msdn.microsoft.com/library/ms188754.aspx) |
| DQS (Data Quality Services) | [Yes](https://msdn.microsoft.com/library/ff877925.aspx) | No |
| Event notifications | [Yes](https://msdn.microsoft.com/library/ms186376.aspx) | [Yes](sql-database-insights-alerts-portal.md) |
| Extended events | [Yes](https://msdn.microsoft.com/library/bb630282.aspx) | [Limited](sql-database-xevent-db-diff-from-svr.md) |
| Extended stored procedures | [Yes](https://msdn.microsoft.com/library/ms164627.aspx) | No |
| File groups | [Yes](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) | [Primary only](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) |
| Filestream | [Yes](https://msdn.microsoft.com/library/gg471497.aspx) | No |
| Full-text search | [Yes](https://msdn.microsoft.com/library/ms142571.aspx) | [No third-party word breakers](https://msdn.microsoft.com/library/ms142571.aspx) |
| In-memory optimization | [Yes](https://msdn.microsoft.com/library/dn133186.aspx) | [Premium edition only](https://msdn.microsoft.com/library/dn133186.aspx) |
| Jobs | [SQL Server Agent](https://msdn.microsoft.com/library/ms189237.aspx) | [Yes](sql-database-elastic-jobs-getting-started.md) |
| JSON data support | [Yes](https://msdn.microsoft.com/library/dn921897.aspx) | [Yes](sql-database-json-features.md) |
| Linked servers | [Yes](https://msdn.microsoft.com/library/ms188279.aspx) | No - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
| Log shipping | [Yes](https://msdn.microsoft.com/library/ms187103.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| MDS (Master Data Services) | [Yes](https://msdn.microsoft.com/library/ff487003.aspx) | No |
| Minimal logging in bulk import | [Yes](https://msdn.microsoft.com/library/ms190422.aspx) | No |
| Modifying system data | [Yes](https://msdn.microsoft.com/library/ms178028.aspx) | No |
| Online index operations | [Yes](https://msdn.microsoft.com/library/ms177442.aspx) | [Transaction size limited by service tier](https://msdn.microsoft.com/library/ms177442.aspx) |
| Point in time database restore | [Yes](https://msdn.microsoft.com/library/ms179451.aspx) | [Yes](sql-database-recovery-using-backups.md#point-in-time-restore) |
| Policy-based management | [Yes](https://msdn.microsoft.com/library/bb510667.aspx) | No |
| Resource governor | [Yes](https://msdn.microsoft.com/library/bb933866.aspx) | [Built-in](sql-database-service-tiers.md) |
| Restore database from backup | Yes | [From automatic backups only] |
| Row Level Security | Yes | Limited |
| Semantic search | Yes | Limited |
| Sequence Objects | Yes | Limited |
| Service Broker | Yes | Limited |
| sp_configure | Yes | Limited |
| Spatial | Yes | Limited |
| SQL Server Agent | [Yes](https://msdn.microsoft.com/library/ms189237.aspx) | No - See [Elastic jobs]] |
| SQL errorlog | Yes | Limited |
| SQL Server PowerShell | [Yes](https://msdn.microsoft.com/library/hh245198.aspx) | [Yes](https://msdn.microsoft.com/library/hh245198.aspx) |
| SQL Server Profiler | Yes | Limited |
| SQL Server Replication | [Yes](https://msdn.microsoft.com/library/ms151198.aspx) | [Transactional replication subscriber only](sql-database-cloud-migrate-compatible-using-transactional-replication.md) |
| SSAS (SQL Server Analysis Services) | Yes | Limited |
| SSIS (SQL Server Integration Services) | Yes | Limited |
| SSRS (SQL Server Reporting Services) | Yes | Limited |
| Statistical Semantic Search | Yes | Limited |
| Stored procedures | Yes | Limited |
| Table Partitioning | Yes | Limited |
| TDE (encryption at rest) | Yes | Limited |
| Temporary tables | [Yes](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) | [Local only](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) |
| Temporal tables |
| Transparent Data Encryption | Yes | Limited |
| Triggers | Yes | Limited |
| T-SQL Bulk insert / BCP | Yes | Limited |
| Windows Server Failover clustering | [Yes](https://msdn.microsoft.com/library/hh270278.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |

## Resources
[Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
