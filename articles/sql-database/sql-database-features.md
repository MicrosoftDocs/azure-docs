---
title: Azure SQL Database feature comparison | Microsoft Docs
description: This article compares the features of SQL Server that are available in different flavors of Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: bonova, carlrab
manager: craigg
ms.date: 09/25/2018
---

# Feature comparison: Azure SQL Database versus SQL Server 

Azure SQL Database shares a common code base with SQL Server. The features of SQL Server supported by Azure SQL Database depend on the type of Azure SQL database that you create. With Azure SQL Database, you can either create a database as part of a [managed instance](sql-database-managed-instance.md) or you can create a database that is part of Logical server and optionally placed in an Elastic pool. 

Microsoft continues to add features to Azure SQL Database. Visit the Service Updates webpage for Azure for the newest updates using these filters:

* Filtered to the [SQL Database service](https://azure.microsoft.com/updates/?service=sql-database).
* Filtered to General Availability [(GA) announcements](http://azure.microsoft.com/updates/?service=sql-database&update-type=general-availability) for SQL Database features.

## SQL Server feature support in Azure SQL Database

The following table lists the major features of SQL Server and provides information about whether the feature is partially or fully supported and a link to more information about the feature. 

| **SQL Feature** | **Supported in Azure SQL Database/Logical Server** | **Supported in Azure SQL Database/Managed Instance (Business Critical tier is in preview)** |
| --- | --- | --- |
| [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) | Yes - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md) | Yes - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md) |
| [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |
| [Attach a database](https://docs.microsoft.com/sql/relational-databases/databases/attach-a-database) | No | No |
| [Application roles](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/application-roles) | Yes | Yes |
|[Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | [Yes](sql-database-auditing.md)| [Yes](sql-database-managed-instance-auditing.md) |
| [Automatic backups](sql-database-automated-backups.md) | Yes | Yes |
| [Automatic tuning (plan forcing)](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning)| [Yes](sql-database-automatic-tuning.md)| [Yes](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) |
| [Automatic tuning (indexes)](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning)| [Yes](sql-database-automatic-tuning.md)| No |
| [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is) | Yes | Yes |
| [BACPAC file (export)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application) | Yes - see [SQL Database export](sql-database-export.md) | No |
| [BACPAC file (import)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database) | Yes - see [SQL Database import](sql-database-import.md) | No |
| [BACKUP command](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql) | No, only system-initiated automatic backups - see [Automated backups](sql-database-automated-backups.md) | System-initiated automated backups and user initiated copy-only backups  - see [Backup differences](sql-database-managed-instance-transact-sql-information.md#backup) |
| [Built-in functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-triggers) |
| [Change data capture](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-data-capture-sql-server) | No | Yes |
| [Change tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server) | Yes |Yes |
| [Collation statements](https://docs.microsoft.com/sql/t-sql/statements/collations) | Yes | Yes |
| [Columnstore indexes](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) | Yes - [Premium tier, Standard tier - S3 and above, General Purpose tier, and Business Critical tiers](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) |Yes |
| [Common language runtime (CLR)](https://docs.microsoft.com/sql/relational-databases/clr-integration/common-language-runtime-clr-integration-programming-concepts) | No | Yes - see [CLR differences](sql-database-managed-instance-transact-sql-information.md#clr) |
| [Contained databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) | Yes | Yes |
| [Contained users](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable) | Yes | Yes |
| [Control of flow language keywords](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow) | Yes | Yes |
| [Cross-database queries](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No - see [Elastic queries](sql-database-elastic-query-overview.md) | Yes, plus [Elastic queries](sql-database-elastic-query-overview.md) |
| [Cross-database transactions](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No | Yes - see [Linked server differences](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-transact-sql-information#linked-servers) |
| [Cursors](https://docs.microsoft.com/sql/t-sql/language-elements/cursors-transact-sql) | Yes |Yes | 
| [Data compression](https://docs.microsoft.com/sql/relational-databases/data-compression/data-compression) | Yes |Yes |
| [Database mail](https://docs.microsoft.com/sql/relational-databases/database-mail/database-mail) | No | Yes |
| [Data Migration Service (DMS)](https://docs.microsoft.com/sql/dma/dma-overview) | Yes | Yes |
| [Database mirroring](https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server) | No | No |
| [Database configuration settings](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) | Yes | Yes |
| [Data Quality Services (DQS)](https://docs.microsoft.com/sql/data-quality-services/data-quality-services) | No | No |
| [Database snapshots](https://docs.microsoft.com/sql/relational-databases/databases/database-snapshots-sql-server) | No | No |
| [Data types](https://docs.microsoft.com/sql/t-sql/data-types/data-types-transact-sql) | Yes |Yes |
| [DBCC statements](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) | Most - see individual statements | Yes - see [DBCC differences](sql-database-managed-instance-transact-sql-information.md#dbcc) |
| [DDL statements](https://docs.microsoft.com/sql/t-sql/statements/statements) | Most - see individual statements | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [DDL triggers](https://docs.microsoft.com/sql/relational-databases/triggers/ddl-triggers) | Database only |  Yes |
| [Distributed partition views](https://docs.microsoft.com/sql/t-sql/statements/create-view-transact-sql#partitioned-views) | No | Yes |
| [Distributed transactions - MS DTC](https://docs.microsoft.com/sql/relational-databases/native-client-ole-db-transactions/supporting-distributed-transactions) | No - see [Elastic transactions](sql-database-elastic-transactions-overview.md) |  No - see [Elastic transactions](sql-database-elastic-transactions-overview.md) |
| [DML statements](https://docs.microsoft.com/sql/t-sql/queries/queries) | Yes | Yes |
| [DML triggers](https://docs.microsoft.com/sql/relational-databases/triggers/create-dml-triggers) | Most - see individual statements |  Yes |
| [DMVs](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views) | Most - see individual DMVs |  Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
|[Dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking)|[Yes](sql-database-dynamic-data-masking-get-started.md)| [Yes](sql-database-dynamic-data-masking-get-started.md) |
| [Elastic pools](sql-database-elastic-pool.md) | Yes | Built-in - a single Managed Instance can have multiple databases that share the same pool of resources |
| [Event notifications](https://docs.microsoft.com/sql/relational-databases/service-broker/event-notifications) | No - see [Alerts](sql-database-insights-alerts-portal.md) | Yes |
| [Expressions](https://docs.microsoft.com/sql/t-sql/language-elements/expressions-transact-sql) |Yes | Yes |
| [Extended events](https://docs.microsoft.com/sql/relational-databases/extended-events/extended-events) | Some - see [Extended events in SQL Database](sql-database-xevent-db-diff-from-svr.md) | Yes - see [Extended events differences ](sql-database-managed-instance-transact-sql-information.md#extended-events) |
| [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/extended-stored-procedures-programming/creating-extended-stored-procedures) | No | No |
[Files and file groups](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups) | Primary file group only | Yes |
| [Filestream](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) | No | No |
| [Full-text search](https://docs.microsoft.com/sql/relational-databases/search/full-text-search) |  Third-party word breakers are not supported |Third-party word breakers are not supported |
| [Functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-triggers) |
| [Geo-restore](sql-database-recovery-using-backups.md#geo-restore) | Yes - General Purpose and Business Critical service tiers only | No – you can restore COPY_ONLY full backups that you take periodically - see [Backup differences](sql-database-managed-instance-transact-sql-information.md#backup) and [Restore differences](sql-database-managed-instance-transact-sql-information.md#restore-statement). |
| [Geo-replication](sql-database-geo-replication-overview.md) | Yes - General Purpose and Business Critical service tiers only| No |
| [Graph processing](https://docs.microsoft.com/sql/relational-databases/graphs/sql-graph-overview) | Yes | Yes |
| [In-memory optimization](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) | Yes - [Premium and Business Critical tiers only](sql-database-in-memory.md) | Yes - [Business Critical tier only - currently in preview](sql-database-managed-instance.md) |
| [JSON data support](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server) | [Yes](https://docs.microsoft.com/azure/sql-database/sql-database-json-features) | [Yes](https://docs.microsoft.com/azure/sql-database/sql-database-json-features) |
| [Language elements](https://docs.microsoft.com/sql/t-sql/language-elements/language-elements-transact-sql) | Most - see individual elements |  Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Linked servers](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) | Only to SQL Server and SQL Database |
| [Log shipping](https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |[High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |
| [Master Data Services (MDS)](https://docs.microsoft.com/sql/master-data-services/master-data-services-overview-mds) | No | No |
| [Minimal logging in bulk import](https://docs.microsoft.com/sql/relational-databases/import-export/prerequisites-for-minimal-logging-in-bulk-import) | No | No |
| [Modifying system data](https://docs.microsoft.com/sql/relational-databases/databases/system-databases) | No | Yes |
| [Online index operations](https://docs.microsoft.com/sql/relational-databases/indexes/perform-index-operations-online) | Yes | Yes |
| [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql)|No|Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENJSON](https://docs.microsoft.com/sql/t-sql/functions/openjson-transact-sql)|Yes|Yes|
| [OPENQUERY](https://docs.microsoft.com/sql/t-sql/functions/openquery-transact-sql)|No|Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql)|No|Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENXML](https://docs.microsoft.com/sql/t-sql/functions/openxml-transact-sql)|Yes|Yes|
| [Operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) | Most - see individual operators |Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Partitioning](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes) | Yes | Yes |
| [Point in time database restore](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-sql-server-database-to-a-point-in-time-full-recovery-model) | Yes - General Purpose and Business Critical service tiers only - see [SQL Database recovery](sql-database-recovery-using-backups.md#point-in-time-restore) | Yes - see [SQL Database recovery](sql-database-recovery-using-backups.md#point-in-time-restore) |
| [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) | No | No |
| [Policy-based management](https://docs.microsoft.com/sql/relational-databases/policy-based-management/administer-servers-by-using-policy-based-management) | No | No |
| [Predicates](https://docs.microsoft.com/sql/t-sql/queries/predicates) | Yes | Yes |
| [R Services](https://docs.microsoft.com/sql/advanced-analytics/r-services/sql-server-r-services) | Preview release; see [What's new in machine learning](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services)  | No |
| [Resource governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) | No | Yes |
| [RESTORE statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-for-restoring-recovering-and-managing-backups-transact-sql) | No | Yes - see [Restore differences](sql-database-managed-instance-transact-sql-information.md#restore-statement) |
| [Restore database from backup](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases#restore-data-backups) | From automated backups only - see [SQL Database recovery](sql-database-recovery-using-backups.md) | From automated backups - see [SQL Database recovery](sql-database-recovery-using-backups.md) and from full backups - see [Backup differences](sql-database-managed-instance-transact-sql-information.md#backup) |
| [Row Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) | Yes | Yes |
| [Semantic search](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) | No | No |
| [Sequence numbers](https://docs.microsoft.com/sql/relational-databases/sequence-numbers/sequence-numbers) | Yes | Yes |
| [Service Broker](https://docs.microsoft.com/sql/database-engine/configure-windows/sql-server-service-broker) | No | Yes - see [Service Broker differences](sql-database-managed-instance-transact-sql-information.md#service-broker) |
| [Server configuration settings](https://docs.microsoft.com/sql/database-engine/configure-windows/server-configuration-options-sql-server) | No | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Set statements](https://docs.microsoft.com/sql/t-sql/statements/set-statements-transact-sql) | Most - see individual statements | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [SMO](https://docs.microsoft.com/sql/relational-databases/server-management-objects-smo/sql-server-management-objects-smo-programming-guide) | Yes | Yes |
| [Spatial](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) | Yes | Yes |
| [SQL Data Sync](sql-database-get-started-sql-data-sync.md) | Yes | No |
| [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | No - see [Elastic jobs](sql-database-elastic-jobs-getting-started.md) | Yes - see [SQL Server Agent differences](sql-database-managed-instance-transact-sql-information.md#sql-server-agent) |
| [SQL Server Analysis Services (SSAS)](https://docs.microsoft.com/sql/analysis-services/analysis-services) | No -see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) | No - see [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) |
| [SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | No - see [SQL Database auditing](sql-database-auditing.md) | Yes - see [Auditing differences](sql-database-managed-instance-transact-sql-information.md#auditing) |
| [SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt) | Yes | Yes |
| [SQL Server Integration Services (SSIS)](https://docs.microsoft.com/sql/integration-services/sql-server-integration-services) | Yes, with a managed SSIS in Azure Data Factory (ADF) environment, where packages are stored in SSISDB hosted by Azure SQL Database and executed on Azure SSIS Integration Runtime (IR), see [Create Azure-SSIS IR in ADF](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). <br/><br/>To compare the SSIS features in SQL Database logical server and Managed Instance, see [Compare SQL Database logical server and Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#compare-sql-database-logical-server-and-sql-database-managed-instance). | Yes, with a managed SSIS in Azure Data Factory (ADF) environment, where packages are stored in SSISDB hosted by Managed Instance and executed on Azure SSIS Integration Runtime (IR), see [Create Azure-SSIS IR in ADF](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). <br/><br/>To compare the SSIS features in SQL Database and Managed Instance, see [Compare SQL Database logical server and Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#compare-sql-database-logical-server-and-sql-database-managed-instance). |
| [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) | Yes | Yes |
| [SQL Server PowerShell](https://docs.microsoft.com/sql/relational-databases/scripting/sql-server-powershell) | Yes | Yes |
| [SQL Server Profiler](https://docs.microsoft.com/sql/tools/sql-server-profiler/sql-server-profiler) | No - see [Extended events](sql-database-xevent-db-diff-from-svr.md) | Yes |
| [SQL Server Replication](https://docs.microsoft.com/sql/relational-databases/replication/sql-server-replication) | [Transactional and snapshot replication subscriber only](sql-database-cloud-migrate.md) | Yes - [Replication with SQL Database Managed Instance - public preview](http://docs.microsoft.com/sql/relational-databases/replication/replication-with-sql-database-managed-instance) |
| [SQL Server Reporting Services (SSRS)](https://docs.microsoft.com/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports) | No - [see Power BI](https://docs.microsoft.com/power-bi/) | No - [see Power BI](https://docs.microsoft.com/power-bi/) |
| [Stored procedures](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) | Yes | Yes |
| [System stored functions](https://docs.microsoft.com/sql/relational-databases/system-functions/system-functions-for-transact-sql) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-triggers) |
| [System stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) | Some - see individual stored procedures | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-triggers) |
| [System tables](https://docs.microsoft.com/sql/relational-databases/system-tables/system-tables-transact-sql) | Some - see individual tables | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [System catalog views](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/catalog-views-transact-sql) | Some - see individual views | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Temporary tables](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql#database-scoped-global-temporary-tables-azure-sql-database) | Local and database-scoped global temporary tables | Local and instance-scoped global temporary tables |
| [Temporal tables](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables) | [Yes](https://docs.microsoft.com/azure/sql-database/sql-database-temporal-tables) | [Yes](https://docs.microsoft.com/azure/sql-database/sql-database-temporal-tables) |
|Threat detection|  [Yes](sql-database-threat-detection.md)|[Yes](sql-database-managed-instance-threat-detection.md)|
| [Trace flags](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql) | No | No |
| [Variables](https://docs.microsoft.com/sql/t-sql/language-elements/variables-transact-sql) | Yes | Yes |
| [Transparent data encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) | Yes - General Purpose and Business Critical service tiers only| Partial, only with service-managed encryption |
[VNet](../virtual-network/virtual-networks-overview.md) | Partial - see [VNet Endpoints](sql-database-vnet-service-endpoint-rule-overview.md) | Yes, Resource Manager model only |
| [Windows Server Failover Clustering](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |
| [XML indexes](https://docs.microsoft.com/sql/t-sql/statements/create-xml-index-transact-sql) | Yes | Yes |

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about a Managed Instance, see [What is a Managed Instance?](sql-database-managed-instance.md).
