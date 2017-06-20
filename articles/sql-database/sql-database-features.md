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
ms.custom: features
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 03/03/2017
ms.author: carlrab; jognanay

---
# Azure SQL Database features

The following tables list the major features of Azure SQL Database and the equivalent features of SQL Server - and providing information about whether each particular feature is supported and a link to more information about the feature on each platform. For Transact-SQL differences to consider when migrating an existing database solution, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).

We continue to add features to Azure SQL Database. So we encourage you to visit our Service Updates webpage for Azure, and to use its filters:

* Filtered to the [SQL Database service](https://azure.microsoft.com/updates/?service=sql-database).
* Filtered to General Availability [(GA) announcements](http://azure.microsoft.com/updates/?service=sql-database&update-type=general-availability) for SQL Database features.

| **Feature** | **SQL Server** | **Azure SQL Database** | 
| --- | :---: | :---: | 
| Active Geo-Replication | Not supported - see [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) | [Supported](sql-database-geo-replication-overview.md)
| Always Encrypted | [Supported](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) | Supported - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md)|
| AlwaysOn Availability Groups | [Supported](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) | Not supported - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Attach a database | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/attach-a-database) | Not supported |
| Application roles | [Supported](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/application-roles) | [Supported](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/application-roles) |
| Auto scale | Not supported | Supported - see [Service tiers](sql-database-service-tiers.md) |
| Azure Active Directory | Not supported | [Supported](sql-database-aad-authentication.md) |
| Azure Data Factory | [Supported](../data-factory/data-factory-introduction.md) | [Supported](../data-factory/data-factory-introduction.md) |
| Auditing | [Supported](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | [Supported](sql-database-auditing.md) |
| BACPAC file (export) | [Supported](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application) | [Supported](sql-database-export.md) |
| BACPAC file (import) | [Supported](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database) | [Supported](sql-database-import.md) |
| BACKUP | [Supported](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql) | Not supported |
| Built-in functions | [Supported](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see [individual functions] (https://docs.microsoft.com/sql/t-sql/functions/functions) |
| Change data capture | [Supported](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-data-capture-sql-server) | Not supported |
| Change tracking | [Supported](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server) | [Supported](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server) |
| Collation statements | [Supported](https://docs.microsoft.com/sql/t-sql/statements/collations) | [Supported](https://docs.microsoft.com/sql/t-sql/statements/collations) |
| Columnstore indexes | [Supported](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) | [Premium edition only](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) |
| Common language runtime (CLR) | [Supported](https://docs.microsoft.com/sql/relational-databases/clr-integration/common-language-runtime-clr-integration-programming-concepts) | Not supported |
| Contained databases | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) |
| Contained users | [Supported](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable) | [Supported](sql-database-manage-logins.md#non-administrator-users) |
| Control of flow language keywords | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow) | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow) |
| Cross-database queries | [Supported](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/cross-database-queries) | Partial - see [Elastic queries](sql-database-elastic-query-overview.md) |
| Cursors | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/cursors-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/cursors-transact-sql) | 
| Data compression | [Supported](https://docs.microsoft.com/sql/relational-databases/data-compression/data-compression) | [Supported](https://docs.microsoft.com/sql/relational-databases/data-compression/data-compression) |
| Database backups | [User managed](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases) | [Managed by SQL Database service](sql-database-automated-backups.md) |
| Database mail | [Supported](https://docs.microsoft.com/sql/relational-databases/database-mail/database-mail) | Not supported |
| Database mirroring | [Supported](https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server) | Not supported |
| Database configuration settings | [Supported](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) |
| Data Quality Services (DQS) | [Supported](https://docs.microsoft.com/sql/data-quality-services/data-quality-services) | Not supported |
| Database snapshots | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/database-snapshots-sql-server) | Not supported |
| Data types | [Supported](https://docs.microsoft.com/sql/t-sql/data-types/data-types-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/data-types/data-types-transact-sql) |  
| DBCC statements | [Supported](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) | Most - see [individual statements](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) |
| DDL statements | [Supported](https://docs.microsoft.com/sql/t-sql/statements/statements) | Most - see [Individual statements](https://docs.microsoft.com/sql/t-sql/statements/statements)
| DDL triggers | [Supported](https://docs.microsoft.com/sql/relational-databases/triggers/ddl-triggers) | [Database only](https://docs.microsoft.com/sql/relational-databases/triggers/ddl-triggers) |
| Distributed transactions | [MS DTC](https://docs.microsoft.com/sql/relational-databases/native-client-ole-db-transactions/supporting-distributed-transactions) | Limited intra-SQL Database scenarios only |
| DML statements | [Supported](https://docs.microsoft.com/sql/t-sql/queries/queries) | Most - see [Individual statements]](https://docs.microsoft.com/sql/t-sql/queries/queries) |
| DML triggers | [Supported](https://docs.microsoft.com/sql/relational-databases/triggers/dml-triggers) | [Supported](https://docs.microsoft.com/sql/relational-databases/triggers/dml-triggers) |
| DMVs | [All](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views) | Some - see [Individual DMVs](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views) |
| Elastic pools | Not supported | [Supported](sql-database-elastic-pool.md) |
| Elastic jobs | Not supported - see [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | [Supported](sql-database-elastic-jobs-getting-started.md) | 
| Elastic queries | Not supported - see [Cross-database queries](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/cross-database-queries) | [Supported](sql-database-elastic-query-overview.md) |
| Event notifications | [Supported](https://docs.microsoft.com/sql/relational-databases/service-broker/event-notifications) | [Supported](sql-database-insights-alerts-portal.md) |
| Expressions | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/expressions-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/expressions-transact-sql) |
| Extended events | [Supported](https://docs.microsoft.com/sql/relational-databases/extended-events/extended-events) | Some - see [Individual events](sql-database-xevent-db-diff-from-svr.md) |
| Extended stored procedures | [Supported](https://docs.microsoft.com/sql/relational-databases/extended-stored-procedures-programming/creating-extended-stored-procedures) | Not supported |
| Files and file groups | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups) | [Primary only](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups) |
| Filestream | [Supported](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) | Not supported |
| Full-text search | [Supported](https://docs.microsoft.com/sql/relational-databases/search/full-text-search) | [Third-party word breakers not supported](https://docs.microsoft.com/sql/relational-databases/search/full-text-search) |
| Functions | [Supported](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see [Individual functions](https://docs.microsoft.com/sql/t-sql/functions/functions) |
| In-memory optimization | [Supported](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) | [Premium edition only](sql-database-in-memory.md) |
| Jobs | See [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | See [Elastic jobs](sql-database-elastic-jobs-getting-started.md) |
| JSON data support | [Supported](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server) | [Supported](sql-database-json-features.md) |
| Language elements | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/language-elements-transact-sql) | Most - See [Individual elements](https://docs.microsoft.com/sql/t-sql/language-elements/language-elements-transact-sql) |  
| Linked servers | [Supported](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | Not supported - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
| Log shipping | [Supported](https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server) | Not supported - see [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| Master Data Services (MDS) | [Supported](https://docs.microsoft.com/sql/master-data-services/master-data-services-overview-mds) | Not supported |
| Minimal logging in bulk import | [Supported](https://docs.microsoft.com/sql/relational-databases/import-export/prerequisites-for-minimal-logging-in-bulk-import) | Not supported |
| Modifying system data | [Supported](https://docs.microsoft.com/sql/relational-databases/databases/system-databases) | Not supported |
| Online index operations | [Supported](https://docs.microsoft.com/sql/relational-databases/indexes/perform-index-operations-online) | [Supported - transaction size limited by service tier](https://docs.microsoft.com/sql/relational-databases/indexes/perform-index-operations-online) |
| Operators | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) | Most - see [Individual operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) |
| Point in time database restore | [Supported](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-sql-server-database-to-a-point-in-time-full-recovery-model) | [Supported](sql-database-recovery-using-backups.md#point-in-time-restore) |
| Polybase | [Supported](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) | Not supported
| Policy-based management | [Supported](https://docs.microsoft.com/sql/relational-databases/policy-based-management/administer-servers-by-using-policy-based-management) | Not supported |
| Predicates | [Supported](https://docs.microsoft.com/sql/t-sql/queries/predicates) | Most - See [Individual predicates](https://docs.microsoft.com/sql/t-sql/queries/predicates)
| R Services | [Supported](https://docs.microsoft.com/sql/advanced-analytics/r-services/sql-server-r-services)
| Resource governor | [Supported](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) | Not supported |
| RESTORE statements | [Supported](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-for-restoring-recovering-and-managing-backups-transact-sql) | Not Supported | 
| Restore database from backup | [Supported](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases#restore-data-backups) | [From built-in backups only](sql-database-recovery-using-backups.md) |
| Row Level Security | [Supported](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) | [Supported](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) |
| Semantic search | [Supported](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) | Not supported |
| Sequence numbers | [Supported](https://docs.microsoft.com/sql/relational-databases/sequence-numbers/sequence-numbers) | [Supported](https://docs.microsoft.com/sql/relational-databases/sequence-numbers/sequence-numbers) |
| Service Broker | [Supported](https://docs.microsoft.com/sql/database-engine/configure-windows/sql-server-service-broker) | Not supported |
| Server configuration settings | [Supported](https://docs.microsoft.com/sql/database-engine/configure-windows/server-configuration-options-sql-server) | Not supported - see [Database configuration options](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) |
| Set statements | [Supported](https://docs.microsoft.com/sql/t-sql/statements/set-statements-transact-sql) | Most - See [Individual statements](https://docs.microsoft.com/sql/t-sql/statements/set-statements-transact-sql) 
| Spatial | [Supported](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) | [Supported](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) |
| SQL Server Agent | [Supported](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | Not supported - See [Elastic jobs](sql-database-elastic-jobs-getting-started.md) |
| SQL Server Analysis Services (SSAS) | [Supported](https://docs.microsoft.com/sql/analysis-services/analysis-services) | Not supported - see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) |
| SQL Server Integration Services (SSIS) | [Supported](https://docs.microsoft.com/sql/integration-services/sql-server-integration-services) | Not supported - see [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) |
| SQL Server PowerShell | [Supported](https://docs.microsoft.com/sql/relational-databases/scripting/sql-server-powershell) | [Supported](https://docs.microsoft.com/sql/relational-databases/scripting/sql-server-powershell) |
| SQL Server Profiler | [Supported](https://docs.microsoft.com/sql/tools/sql-server-profiler/sql-server-profiler) | Not supported - see [Extended events](sql-database-xevent-db-diff-from-svr.md) |
| SQL Server Replication | [Supported](https://docs.microsoft.com/sql/relational-databases/replication/sql-server-replication) | [Transactional and snapshot replication subscriber only](sql-database-cloud-migrate.md) |
| SQL Server Reporting Services (SSRS) | [Supported](https://docs.microsoft.com/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports) | Not supported |
| Stored procedures | [Supported](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) | [Supported](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) |
| System stored functions | [Supported](https://docs.microsoft.com/sql/relational-databases/system-functions/system-functions-for-transact-sql) | Some - See [Individual function](https://docs.microsoft.com/sql/relational-databases/system-functions/system-functions-for-transact-sql) |
| System stored procedures | [Supported](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) | Some - see [Individual stored procedure](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) |
| System tables | [Supported](https://docs.microsoft.com/sql/relational-databases/system-tables/system-tables-transact-sql) | Some - See [Individual table](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) |
| System catalog views | [Supported](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/catalog-views-transact-sql) | Some - See [Individual views](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/catalog-views-transact-sql)
| Table Partitioning | [Supported](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes) | Supported - [Primary filegroup only](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes) |
| Temporary tables | [Local and global](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql#temporary-tables) | [Local only](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql#temporary-tables) |
| Temporal tables | [Supported](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables) | [Supported](sql-database-temporal-tables.md) |
| Transactions | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/transactions-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/transactions-transact-sql) |
| Variables | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/variables-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/language-elements/variables-transact-sql) | 
| Transparent data encryption (TDE)  | [Supported](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) | [Supported](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) |
| Windows Server Failover Clustering | [Supported](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server) | Not supported - See [Active Geo-Replication](sql-database-geo-replication-overview.md) |
| XML indexes | [Supported](https://docs.microsoft.com/sql/t-sql/statements/create-xml-index-transact-sql) | [Supported](https://docs.microsoft.com/sql/t-sql/statements/create-xml-index-transact-sql) |

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about Transact-SQL support and differences, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).
