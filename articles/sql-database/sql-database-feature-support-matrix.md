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
| BACPAC files | [Yes](https://msdn.microsoft.com/en-us/library/ee210546.aspx#Anchor_4) | [Yes](sql-database-export.md) |
| Change Data Capture | [Yes](https://msdn.microsoft.com/library/cc645937.aspx) | No |
| Change Tracking | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) | [Yes](https://msdn.microsoft.com/library/bb933875.aspx) |
| CLR | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) | [Yes](https://msdn.microsoft.com/library/ms131102.aspx) |
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
| Temporary tables | [Yes](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) | [Local only](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) |
| HADR | Yes | Limited |
| In-Memory | Yes | Limited |
| Jobs | Yes | Limited |
| JSON support | Yes | Limited |
| Linked servers | Yes | Limited |
| Log shipping | Yes | Limited |
| Long term retention | Yes | Limited |
| MDS (Master Data Services) | Yes | Limited |
| Minimal and bulk logging | Yes | Limited |
| Modifying system DBs master, msdb, model | Yes | Limited |
| Online Index Rebuild | Yes | Limited |
| Parallel Queries | Yes | Limited |
| Point in Time Restore | Yes | Limited |
| Policy-based management | Yes | Limited |
| PowerShell | Yes | Limited |
| Replication | Yes | Limited |
| Resource Governor | Yes | Limited |
| Restore a backup from on-premises database | Yes | Limited |
| Restore from backup | Yes | Limited |
| Row Level Security | Yes | Limited |
| Semantic search | Yes | Limited |
| Sequence Objects | Yes | Limited |
| Service Broker | Yes | Limited |
| sp_configure | Yes | Limited |
| Spatial | Yes | Limited |
| SQL Agent | Yes | Limited |
| SQL errorlog | Yes | Limited |
| SQL Server Profiler | Yes | Limited |
| SSAS (SQL Server Analysis Services) | Yes | Limited |
| SSIS (SQL Server Integration Services) | Yes | Limited |
| SSRS (SQL Server Reporting Services) | Yes | Limited |
| Statistical Semantic Search | Yes | Limited |
| Stored procedures | Yes | Limited |
| Table Partitioning | Yes | Limited |
| TDE (encryption at rest) | Yes | Limited |
| Transparent Data Encryption | Yes | Limited |
| Triggers | Yes | Limited |
| T-SQL Bulk insert / BCP | Yes | Limited |
| Windows Server Failover clustering | [Yes](https://msdn.microsoft.com/library/hh270278.aspx) | No - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |

## Resources
[Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)
