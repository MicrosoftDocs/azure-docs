---
title: Azure SQL Database Features Overview | Microsoft Docs
description: This page provides an overview of the Azure SQL Database logical servers and databases, and includes a feature support matrix with links each listed feature.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: d1a46fa4-53d2-4d25-a0a7-92e8f9d70828
ms.service: sql-database
ms.custom: overview
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 03/03/2017
ms.author: carlrab; jognanay

---
# Azure SQL Database features
This topic provides an overview of the Azure SQL Database logical servers and databases, and includes a feature support matrix with links each listed feature. 

## What is an Azure SQL Database logical server?
An Azure SQL Database logical server acts as a central administrative point for multiple databases. In SQL Database, a server is a logical construct that is distinct from a SQL Server instance that you may be familiar with in the on-premises world. Specifically, the SQL Database service makes no guarantees regarding location of the databases in relation to their logical servers, and exposes no instance-level access or features. For more information about Azure SQL logical servers, see [Logical servers](sql-database-server-overview.md). 

## What is an Azure SQL database?
Each database in Azure SQL Database is associated with a logical server. The database can be:

- A single database with its [own set of resources](sql-database-what-is-a-dtu.md#what-are-database-transaction-units-dtus) (DTUs)
- Part of a [pool of databases](sql-database-elastic-pool.md) that [shares a set of resources](sql-database-what-is-a-dtu.md#what-are-elastic-database-transaction-units-edtus) (eDTUs)
- Part of a [scaled-out set of sharded databases](sql-database-elastic-scale-introduction.md#horizontal-and-vertical-scaling), which can be either single or pooled databases
- Part of a set of databases participating in a [multitenant SaaS design pattern](sql-database-design-patterns-multi-tenancy-saas-applications.md), and whose databases can either be single or pooled databases (or both) 

For more information about Azure SQL databases, see [SQL databases](sql-database-overview.md).

## What features are supported?

The following tables list the major features of Azure SQL Database and SQL Server, specifies its supportability, and provides a link to more information about the feature on each platform. For Transact-SQL features, follow the link in the table for the category of the feature. See also [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md) for more background on the reasons for lack of support for certain types of features.

We continue to add features to V12. So we encourage you to visit our Service Updates webpage for Azure, and to use its filters:

* Filtered to the [SQL Database service](https://azure.microsoft.com/updates/?service=sql-database).
* Filtered to General Availability [(GA) announcements](http://azure.microsoft.com/updates/?service=sql-database&update-type=general-availability) for SQL Database features.

> [!TIP]
> To test an existing database for compatibility with Azure SQL Database, see [Migrate a SQL Server database to Azure](sql-database-cloud-migrate.md).
>

| **Feature** | **SQL Server** | **Azure SQL Database** | 
| --- | :---: | :---: | 
| Active Geo-Replication | Not supported - see [AlwaysOn Availability Groups](https://msdn.microsoft.com/library/hh510230.aspx) | [Supported](sql-database-geo-replication-overview.md)
| Always Encrypted | [Supported](https://msdn.microsoft.com/library/mt163865.aspx) | [Supported](sql-database-always-encrypted.md) |
| AlwaysOn Availability Groups | [Supported](https://msdn.microsoft.com/library/hh510230.aspx) | Not supported - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Attach a database | [Supported](https://msdn.microsoft.com/library/ms190209.aspx) | Not supported |
| Application roles | [Supported](https://msdn.microsoft.com/library/ms190998.aspx) | [Supported](https://msdn.microsoft.com/library/ms190998.aspx) |
| Auto scale | Not supported | [Supported](sql-database-service-tiers.md) |
| Azure Active Directory | Not supported | [Supported](sql-database-aad-authentication.md) |
| Azure Data Factory | [Supported](../data-factory/data-factory-introduction.md) | [Supported](../data-factory/data-factory-introduction.md) |
| Auditing | [Supported](https://msdn.microsoft.com/library/cc280386.aspx) | [Supported](sql-database-auditing.md) |
| BACPAC file (export) | [Supported](https://msdn.microsoft.com/library/hh213241.aspx) | [Supported](sql-database-export.md) |
| BACPAC file (import) | [Supported](https://msdn.microsoft.com/library/hh710052.aspx) | [Supported](sql-database-import-portal.md) |
| BACKUP and RESTORE statements | [Supported](https://msdn.microsoft.com/library/ff848768.aspx) | Not supported |
| Built-in functions | [Supported](https://msdn.microsoft.com/library/ms174318.aspx) | [Most](https://msdn.microsoft.com/library/ms174318.aspx) |
| Change data capture | [Supported](https://msdn.microsoft.com/library/cc645937.aspx) | Not supported |
| Change tracking | [Supported](https://msdn.microsoft.com/library/bb933875.aspx) | [Supported](https://msdn.microsoft.com/library/bb933875.aspx) |
| Collation statements | [Supported](https://msdn.microsoft.com/library/ff848763.aspx) | [Supported](https://msdn.microsoft.com/library/ff848763.aspx) |
| Columnstore indexes | [Supported](https://msdn.microsoft.com/library/gg492088.aspx) | [Premium edition only](https://msdn.microsoft.com/library/gg492088.aspx) |
| Common language runtime (CLR) | [Supported](https://msdn.microsoft.com/library/ms131102.aspx) | Not supported |
| Contained databases | [Supported](https://msdn.microsoft.com/library/ff929071.aspx) | Built-in |
| Contained users | [Supported](https://msdn.microsoft.com/library/ff929188.aspx) | [Supported](sql-database-manage-logins.md#non-administrator-users) |
| Control of flow language keywords | [Supported](https://msdn.microsoft.com/library/ms174290.aspx) | [Supported](https://msdn.microsoft.com/library/ms174290.aspx) |
| Cross-database queries | [Supported](https://msdn.microsoft.com/library/dn584627.aspx) | [Elastic queries](sql-database-elastic-query-overview.md) |
| Cursors | [Supported](https://msdn.microsoft.com/library/ms181441.aspx) | [Supported](https://msdn.microsoft.com/library/ms181441.aspx) | 
| Data compression | [Supported](https://msdn.microsoft.com/library/cc280449.aspx) | [Supported](https://msdn.microsoft.com/library/cc280449.aspx) |
| Database backups | [Exposed for users](https://msdn.microsoft.com/library/ms187048.aspx) | [Built-in](sql-database-automated-backups.md) |
| Database mail | [Supported](https://msdn.microsoft.com/library/ms189635.aspx) | Not supported |
| Database mirroring | [Supported](https://msdn.microsoft.com/library/ms189852.aspx) | Not supported |
| Database configuration options | [Supported](https://msdn.microsoft.com/library/mt629158.aspx) | [Supported](https://msdn.microsoft.com/library/mt629158.aspx) |
| Data Quality Services (DQS) | [Supported](https://msdn.microsoft.com/library/ff877925.aspx) | Not supported |
| Database snapshots | [Supported](https://msdn.microsoft.com/library/ms175158.aspx) | Not supported |
| Data types | [Supported](https://msdn.microsoft.com/library/ms187752.aspx) | [Supported](https://msdn.microsoft.com/library/ms187752.aspx) |  
| DBCC statements | [All](https://msdn.microsoft.com/library/ms188796.aspx) | [Some](https://msdn.microsoft.com/library/ms188796.aspx) |
| DDL statements | [Supported](https://msdn.microsoft.com/library/ff848799.aspx) | [Most](https://msdn.microsoft.com/library/ff848799.aspx)
| DDL triggers | [Supported](https://msdn.microsoft.com/library/ms175941.aspx) | [Database only](https://msdn.microsoft.com/library/ms175941.aspx) |
| Distributed transactions | [MS DTC](https://msdn.microsoft.com/library/ms131665.aspx) | Limited intra-SQL Database scenarios only |
| DML statements | [Supported](https://msdn.microsoft.com/library/ff848766.aspx) | [Most](https://msdn.microsoft.com/library/ff848766.aspx) |
| DML triggers | [Supported](https://msdn.microsoft.com/library/ms178110.aspx) | [Supported](https://msdn.microsoft.com/library/ms178110.aspx) |
| DMVs | [All](https://msdn.microsoft.com/library/ms188754.aspx) | [Some](https://msdn.microsoft.com/library/ms188754.aspx) |
| elastic pools | Not supported | [Supported](sql-database-elastic-pool.md) |
| Elastic jobs | Not supported - see [SQL Server Agent](https://msdn.microsoft.com/library/ms189237.aspx) | [Supported](sql-database-elastic-jobs-getting-started.md) | 
| Elastic queries | Not supported - see [Cross-database queries](https://msdn.microsoft.com/library/dn584627.aspx) | [Supported](sql-database-elastic-query-overview.md) |
| Event notifications | [Supported](https://msdn.microsoft.com/library/ms186376.aspx) | [Supported](sql-database-insights-alerts-portal.md) |
| Expressions | [Supported](https://msdn.microsoft.com/library/ms190286.aspx) | [Supported](https://msdn.microsoft.com/library/ms190286.aspx) |
| Extended events | [Supported](https://msdn.microsoft.com/library/bb630282.aspx) | [Some](sql-database-xevent-db-diff-from-svr.md) |
| Extended stored procedures | [Supported](https://msdn.microsoft.com/library/ms164627.aspx) | Not supported |
| File groups | [Supported](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) | [Primary only](https://msdn.microsoft.com/library/ms189563.aspx#Anchor_2) |
| Filestream | [Supported](https://msdn.microsoft.com/library/gg471497.aspx) | Not supported |
| Full-text search | [Supported](https://msdn.microsoft.com/library/ms142571.aspx) | [Not supported third-party word breakers](https://msdn.microsoft.com/library/ms142571.aspx) |
| Functions | [Supported](https://msdn.microsoft.com/library/ms174318.aspx) | [Most](https://msdn.microsoft.com/library/ms174318.aspx) |
| In-memory optimization | [Supported](https://msdn.microsoft.com/library/dn133186.aspx) | [Premium edition only](https://msdn.microsoft.com/library/dn133186.aspx) |
| Jobs | [SQL Server Agent](https://msdn.microsoft.com/library/ms189237.aspx) | [Supported](sql-database-elastic-jobs-getting-started.md) |
| JSON data support | [Supported](https://msdn.microsoft.com/library/dn921897.aspx) | [Supported](sql-database-json-features.md) |
| Language elements | [Supported](https://msdn.microsoft.com/library/ff848807.aspx) | [Most](https://msdn.microsoft.com/library/ff848807.aspx) |  
| Linked servers | [Supported](https://msdn.microsoft.com/library/ms188279.aspx) | Not supported - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
| Log shipping | [Supported](https://msdn.microsoft.com/library/ms187103.aspx) | Not supported - see [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Management commands | [Supported](https://msdn.microsoft.com/library/ms190286.aspx)| [Not supported](https://msdn.microsoft.com/library/ms190286.aspx) |
| Master Data Services (MDS) | [Supported](https://msdn.microsoft.com/library/ff487003.aspx) | Not supported |
| Minimal logging in bulk import | [Supported](https://msdn.microsoft.com/library/ms190422.aspx) | Not supported |
| Modifying system data | [Supported](https://msdn.microsoft.com/library/ms178028.aspx) | Not supported |
| Online index operations | [Supported](https://msdn.microsoft.com/library/ms177442.aspx) | [Transaction size limited by service tier](https://msdn.microsoft.com/library/ms177442.aspx) |
| Operators | [Supported](https://msdn.microsoft.com/library/ms174986.aspx) | [Most](https://msdn.microsoft.com/library/ms174986.aspx) |
| Point in time database restore | [Supported](https://msdn.microsoft.com/library/ms179451.aspx) | [Supported](sql-database-recovery-using-backups.md#point-in-time-restore) |
| Polybase | [Supported](https://msdn.microsoft.com/library/mt143171.aspx) | [Not supported]
| Policy-based management | [Supported](https://msdn.microsoft.com/library/bb510667.aspx) | Not supported |
| Predicates | [Supported](https://msdn.microsoft.com/library/ms189523.aspx) | [Most](https://msdn.microsoft.com/library/ms189523.aspx)
| R Services | [Supported](https://msdn.microsoft.com/library/mt604845.aspx)
| Resource governor | [Supported](https://msdn.microsoft.com/library/bb933866.aspx) | Not supported |
| Restore database from backup | [Supported](https://msdn.microsoft.com/library/ms187048.aspx#anchor_6) | [From built-in backups only](sql-database-recovery-using-backups.md) |
| Row Level Security | [Supported](https://msdn.microsoft.com/library/dn765131.aspx) | [Supported](https://msdn.microsoft.com/library/dn765131.aspx) |
| Security statements | [Supported](https://msdn.microsoft.com/library/ff848791.aspx) | [Some](https://msdn.microsoft.com/library/ff848791.aspx) |
| Semantic search | [Supported](https://msdn.microsoft.com/library/gg492075.aspx) | Not supported |
| Sequence numbers | [Supported](https://msdn.microsoft.com/library/ff878058.aspx) | [Supported](https://msdn.microsoft.com/library/ff878058.aspx) |
| Service Broker | [Supported](https://msdn.microsoft.com/library/bb522893.aspx) | Not supported |
| Server configuration options | [Supported](https://msdn.microsoft.com/library/ms189631.aspx) | Not supported - see [Database configuration options](https://msdn.microsoft.com/library/mt629158.aspx) |
| Set statements | [Supported](https://msdn.microsoft.com/library/ms190356.aspx) | [Most](https://msdn.microsoft.com/library/ms190356.aspx) 
| Spatial | [Supported](https://msdn.microsoft.com/library/bb933790.aspx) | [Supported](https://msdn.microsoft.com/library/bb933790.aspx) |
| SQL Server Agent | [Supported](https://msdn.microsoft.com/library/ms189237.aspx) | Not supported - See [Elastic jobs](sql-database-elastic-jobs-getting-started.md) |
| SQL Server Analysis Services (SSAS) | [Supported](https://msdn.microsoft.com/library/bb522607.aspx) | Not supported - see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) |
| SQL Server Integration Services (SSIS) | [Supported](https://msdn.microsoft.com/library/ms141026.aspx) | Not supported - see [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) |
| SQL Server PowerShell | [Supported](https://msdn.microsoft.com/library/hh245198.aspx) | [Supported](https://msdn.microsoft.com/library/hh245198.aspx) |
| SQL Server Profiler | [Supported](https://msdn.microsoft.com/library/ms181091.aspx) | Not supported - see [Extended events](https://msdn.microsoft.com/library/ms181091.aspx) |
| SQL Server Replication | [Supported](https://msdn.microsoft.com/library/ms151198.aspx) | [Transactional and snapshot replication subscriber only](sql-database-cloud-migrate.md) |
| SQL Server Reporting Services (SSRS) | [Supported](https://msdn.microsoft.com/library/ms159106.aspx) | Not supported |
| Stored procedures | [Supported](https://msdn.microsoft.com/library/ms190782.aspx) | [Supported](https://msdn.microsoft.com/library/ms190782.aspx) |
| System stored functions | [Supported](https://msdn.microsoft.com/library/ff848780.aspx) | [Some](https://msdn.microsoft.com/library/ff848780.aspx) |
| System stored procedures | [Supported](https://msdn.microsoft.com/library/ms187961.aspx) | [Some](https://msdn.microsoft.com/library/ms187961.aspx) |
| System tables | [Supported](https://msdn.microsoft.com/library/ms179932.aspx) | [Some](https://msdn.microsoft.com/library/ms179932.aspx) |
| System views | [Supported](https://msdn.microsoft.com/library/ms177862.aspx) | [Some](https://msdn.microsoft.com/library/ms177862.aspx)
| Table Partitioning | [Supported](https://msdn.microsoft.com/library/ms190787.aspx) | [Primary filegroup only](https://msdn.microsoft.com/library/ms190787.aspx) |
| Temporary tables | [Local and global](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) | [Local only](https://msdn.microsoft.com/library/ms174979.aspx#Anchor_4) |
| Temporal tables | [Supported](https://msdn.microsoft.com/library/dn935015.aspx) | [Supported](sql-database-temporal-tables.md) |
| Transaction statements | [Supported](https://msdn.microsoft.com/library/ms174377.aspx) | [Supported](https://msdn.microsoft.com/library/ms174377.aspx) |
| Variables | [Supported](https://msdn.microsoft.com/library/ff848809.aspx) | | [Supported](https://msdn.microsoft.com/library/ff848809.aspx) | 
| Transparent data encryption (TDE)  | [Supported](https://msdn.microsoft.com/library/bb934049.aspx) | [Supported](https://msdn.microsoft.com/dn948096.aspx) |
| Windows Server Failover clustering | [Supported](https://msdn.microsoft.com/library/hh270278.aspx) | Not supported - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| XML indexes | [Supported](http://msdn.microsoft.com/library/bb934097.aspx) | [Supported](http://msdn.microsoft.com/library/bb934097.aspx) |
| XML statements | [Supported](https://msdn.microsoft.com/library/ff848798.aspx) | [Supported](https://msdn.microsoft.com/library/ff848798.aspx) |

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For an overview of Azure SQL logical servers, see [SQL Database logical server overview](sql-database-server-overview.md)
- For an overview of Azure SQL databases, see [SQL Database overview](sql-database-overview.md)
- For information about Transact-SQL support and differences, see [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md).
- For information about specific resource quotas and limitations based on your **service tier**. For an overview of service tiers, see [SQL Database service tiers](sql-database-service-tiers.md).
- For an overview of security, see [Azure SQL Database Security Overview](sql-database-security-overview.md).
- For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).
