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
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 08/25/2017
ms.author: carlrab

---
# Azure SQL Database features

Azure SQL Database shares a common code base with SQL Server and, at the database level, supports most of the same features. The major feature differences between Azure SQL Database and SQL Server are at the instance level. 

We continue to add features to Azure SQL Database. So we encourage you to visit our Service Updates webpage for Azure, and to use its filters:

* Filtered to the [SQL Database service](https://azure.microsoft.com/updates/?service=sql-database).
* Filtered to General Availability [(GA) announcements](http://azure.microsoft.com/updates/?service=sql-database&update-type=general-availability) for SQL Database features.

## SQL Server and SQL Database feature support

The following table lists the major features of SQL Server and provides information about whether each particular feature is supported and a link to more information about the feature. For Transact-SQL differences to consider when migrating an existing database solution, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).


| **SQL Server Feature** | **Supported in Azure SQL Database** | 
| --- | --- |  
| [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) | Yes - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md)|
| [AlwaysOn Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) | No - see [Failover groups and active geo-replication](sql-database-geo-replication-overview.md) |
| [Attach a database](https://docs.microsoft.com/sql/relational-databases/databases/attach-a-database) | No |
| [Application roles](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/application-roles) | Yes |
| [BACPAC file (export)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application) | Yes - see [SQL Database export](sql-database-export.md) |
| [BACPAC file (import)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database) | Yes - see [SQL Database import](sql-database-import.md) |
| [BACKUP command](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql) | No - see [Automated backups](sql-database-automated-backups.md) |
| [Built-in functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions |
| [Change data capture](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-data-capture-sql-server) | No |
| [Change tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server) | Yes |
| [Collation statements](https://docs.microsoft.com/sql/t-sql/statements/collations) | Yes |
| [Columnstore indexes](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) | Yes - [Premium edition only](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) |
| [Common language runtime (CLR)](https://docs.microsoft.com/sql/relational-databases/clr-integration/common-language-runtime-clr-integration-programming-concepts) | No |
| [Contained databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) | Yes |
| [Contained users](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable) | Yes |
| [Control of flow language keywords](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow) | Yes |
| [Cross-database queries](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/cross-database-queries) | Partial - see [Elastic queries](sql-database-elastic-query-overview.md) |
| [Cursors](https://docs.microsoft.com/sql/t-sql/language-elements/cursors-transact-sql) | Yes | 
| [Data compression](https://docs.microsoft.com/sql/relational-databases/data-compression/data-compression) | Yes |
| [Database mail](https://docs.microsoft.com/sql/relational-databases/database-mail/database-mail) | No |
| [Database mirroring](https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server) | No |
| [Database configuration settings](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) | Yes |
| [Data Quality Services (DQS)](https://docs.microsoft.com/sql/data-quality-services/data-quality-services) | No |
| [Database snapshots](https://docs.microsoft.com/sql/relational-databases/databases/database-snapshots-sql-server) | No |
| [Data types](https://docs.microsoft.com/sql/t-sql/data-types/data-types-transact-sql) | Yes |  
| [DBCC statements](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) | Most - see individual statements |
| [DDL statements](https://docs.microsoft.com/sql/t-sql/statements/statements) | Most - see individual statements
| [DDL triggers](https://docs.microsoft.com/sql/relational-databases/triggers/ddl-triggers) | Database only |
| [Distributed transactions - MS DTC](https://docs.microsoft.com/sql/relational-databases/native-client-ole-db-transactions/supporting-distributed-transactions) | No - see [Elastic transactions](sql-database-elastic-transactions-overview.md) |
| [DML statements](https://docs.microsoft.com/sql/t-sql/queries/queries) | Most - see individual statements |
| [DML triggers](https://docs.microsoft.com/sql/relational-databases/triggers/dml-triggers) |
| [DMVs](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views) | Some - see individual DMVs |
| [Event notifications](https://docs.microsoft.com/sql/relational-databases/service-broker/event-notifications) | No - see [Alerts](sql-database-insights-alerts-portal.md) |
| [Expressions](https://docs.microsoft.com/sql/t-sql/language-elements/expressions-transact-sql) |Yes |
| [Extended events](https://docs.microsoft.com/sql/relational-databases/extended-events/extended-events) | Some - see individual events |
| [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/extended-stored-procedures-programming/creating-extended-stored-procedures) | No |
| [Files and file groups](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups) | Primary file group only |
| [Filestream](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) | No |
| [Full-text search](https://docs.microsoft.com/sql/relational-databases/search/full-text-search) | Third-party word breakers are not supported |
| [Functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions |
| [Graph processing](/sql/relational-databases/graphs/sql-graph-overview) | Yes |
| [In-memory optimization](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) | Yes - [Premium edition only](sql-database-in-memory.md) |
| [JSON data support](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server) | Yes |
| [Language elements](https://docs.microsoft.com/sql/t-sql/language-elements/language-elements-transact-sql) | Most - see individual elements |  
| [Linked servers](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
| [Log shipping](https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server) | No - see [Failover groups and active geo-replication](sql-database-geo-replication-overview.md) |
| [Master Data Services (MDS)](https://docs.microsoft.com/sql/master-data-services/master-data-services-overview-mds) | No |
| [Minimal logging in bulk import](https://docs.microsoft.com/sql/relational-databases/import-export/prerequisites-for-minimal-logging-in-bulk-import) | No |
| [Modifying system data](https://docs.microsoft.com/sql/relational-databases/databases/system-databases) | No |
| [Online index operations](https://docs.microsoft.com/sql/relational-databases/indexes/perform-index-operations-online) | Supported - transaction size limited by service tier |
| [Operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) | Most - see individual operators |
| [Point in time database restore](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-sql-server-database-to-a-point-in-time-full-recovery-model) | Yes - see [SQL Database recovery](sql-database-recovery-using-backups.md#point-in-time-restore) |
| [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) | No |
| [Policy-based management](https://docs.microsoft.com/sql/relational-databases/policy-based-management/administer-servers-by-using-policy-based-management) | No |
| [Predicates](https://docs.microsoft.com/sql/t-sql/queries/predicates) | Most - see individual predicates |
| [R Services](https://docs.microsoft.com/sql/advanced-analytics/r-services/sql-server-r-services) | No |
| [Resource governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) | No |
| [RESTORE statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-for-restoring-recovering-and-managing-backups-transact-sql) | No | 
| [Restore database from backup](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases#restore-data-backups) | From built-in backups only - see [SQL Database recovery](sql-database-recovery-using-backups.md) |
| [Row Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) | Yes |
| [Semantic search](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) | No |
| [Sequence numbers](https://docs.microsoft.com/sql/relational-databases/sequence-numbers/sequence-numbers) | Yes |
| [Service Broker](https://docs.microsoft.com/sql/database-engine/configure-windows/sql-server-service-broker) | No |
| [Server configuration settings](https://docs.microsoft.com/sql/database-engine/configure-windows/server-configuration-options-sql-server) | No |
| [Set statements](https://docs.microsoft.com/sql/t-sql/statements/set-statements-transact-sql) | Most - see individual statements 
| [Spatial](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) | Yes |
| [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | Nos- see [Elastic jobs](sql-database-elastic-jobs-getting-started.md) |
| [SQL Server Analysis Services (SSAS)](https://docs.microsoft.com/sql/analysis-services/analysis-services) | No - see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) |
| [SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | No - see [SQL Database auditing](sql-database-auditing.md) |
| [SQL Server Integration Services (SSIS)](https://docs.microsoft.com/sql/integration-services/sql-server-integration-services) | No - see [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) |
| [SQL Server PowerShell](https://docs.microsoft.com/sql/relational-databases/scripting/sql-server-powershell) | Yes |
| [SQL Server Profiler](https://docs.microsoft.com/sql/tools/sql-server-profiler/sql-server-profiler) | No - see [Extended events](sql-database-xevent-db-diff-from-svr.md) |
| [SQL Server Replication](https://docs.microsoft.com/sql/relational-databases/replication/sql-server-replication) | [Transactional and snapshot replication subscriber only](sql-database-cloud-migrate.md) |
| [SQL Server Reporting Services (SSRS)](https://docs.microsoft.com/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports) | No |
| [Stored procedures](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) | Yes |
| [System stored functions](https://docs.microsoft.com/sql/relational-databases/system-functions/system-functions-for-transact-sql) | Some - see individual functions |
| [System stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) | Some - see individual stored procedures |
| [System tables](https://docs.microsoft.com/sql/relational-databases/system-tables/system-tables-transact-sql) | Some - see individual tables |
| [System catalog views](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/catalog-views-transact-sql) | Some - see individual views |
| [Table partitioning](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes) | Yes - primary filegroup only |
| [Temporary tables](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql#temporary-tables) | Local and database-scoped global temporary tables only |
| [Temporal tables](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables) | Yes |
| [Transactions](https://docs.microsoft.com/sql/t-sql/language-elements/transactions-transact-sql) | No |
| [Variables](https://docs.microsoft.com/sql/t-sql/language-elements/variables-transact-sql) | Yes | 
| [Transparent data encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) | Yes |
| [Windows Server Failover Clustering](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server) | No - see [Failover groups and active geo-replication](sql-database-geo-replication-overview.md) |
| [XML indexes](https://docs.microsoft.com/sql/t-sql/statements/create-xml-index-transact-sql) | Yes |

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about Transact-SQL support and differences, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).
