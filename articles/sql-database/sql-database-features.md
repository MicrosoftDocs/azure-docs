---
title: Azure SQL Database feature comparison | Microsoft Docs
description: This article compares the features of SQL Server that are available in different flavors of Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: bonova, sstein
ms.date: 05/10/2019
---

# Feature comparison: Azure SQL Database versus SQL Server

Azure SQL Database shares a common code base with SQL Server. The features of SQL Server supported by Azure SQL Database depend on the type of Azure SQL database that you create. With Azure SQL Database, you can create a database as part of a [managed instance](sql-database-managed-instance.md), as a single database, or as part of an elastic pool.

Microsoft continues to add features to Azure SQL Database. Visit the Service Updates webpage for Azure for the newest updates using these filters:

- Filtered to the [SQL Database service](https://azure.microsoft.com/updates/?service=sql-database).
- Filtered to General Availability [(GA) announcements](https://azure.microsoft.com/updates/?service=sql-database&update-type=general-availability) for SQL Database features.

If you need more details about the differences, you can find them in the separate pages for [Single database and Elastic pools](sql-database-transact-sql-information.md) or [Managed Instance](sql-database-managed-instance-transact-sql-information.md).

## SQL features

The following table lists the major features of SQL Server and provides information about whether the feature is partially or fully supported in Managed Instance or Single Database and Elastic pools, with a link to more information about the feature.

| **SQL Feature** | **Single databases and elastic pools** | **Managed instances** |
| --- | --- | --- |
| [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) | Yes - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md) | Yes - see [Cert store](sql-database-always-encrypted.md) and [Key vault](sql-database-always-encrypted-azure-key-vault.md) |
| [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | [High availability](sql-database-high-availability.md) is included with every database and [cannot be managed by user](sql-database-managed-instance-transact-sql-information.md#always-on-availability). Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |
| [Attach a database](https://docs.microsoft.com/sql/relational-databases/databases/attach-a-database) | No | No |
| [Application roles](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/application-roles) | Yes | Yes |
| [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | [Yes](sql-database-auditing.md)| [Yes](sql-database-managed-instance-auditing.md), with some [differences](sql-database-managed-instance-transact-sql-information.md#auditing) |
| [Automatic backups](sql-database-automated-backups.md) | Yes. Full backups are taken every 7 days, differential 12 hours, and log backups every 5-10 min. | Yes. Full backups are taken every 7 days, differential 12 hours, and log backups every 5-10 min. |
| [Automatic tuning (plan forcing)](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning)| [Yes](sql-database-automatic-tuning.md)| [Yes](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning) |
| [Automatic tuning (indexes)](https://docs.microsoft.com/sql/relational-databases/automatic-tuning/automatic-tuning)| [Yes](sql-database-automatic-tuning.md)| No |
| [BACKUP command](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql) | No, only system-initiated automatic backups - see [Automated backups](sql-database-automated-backups.md) | Yes, user initiated copy-only backups to Azure Blob Storage (automatic system backups cannot be initiated by user) - see [Backup differences](sql-database-managed-instance-transact-sql-information.md#backup) |
| [Built-in functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-and-triggers) | 
| [BULK INSERT statement](https://docs.microsoft.com/sql/relational-databases/import-export/import-bulk-data-by-using-bulk-insert-or-openrowset-bulk-sql-server) | Yes, but just from Azure Blob storage as a source. | Yes, but just from Azure Blob Storage as a source - see [differences](sql-database-managed-instance-transact-sql-information.md#bulk-insert--openrowset). |
| [Certificates and asymmetric keys](https://docs.microsoft.com/sql/relational-databases/security/sql-server-certificates-and-asymmetric-keys) | Yes, without access to file system for `BACKUP` and `CREATE` operations. | Yes, without access to file system for `BACKUP` and `CREATE` operations - see [certificate differences](sql-database-managed-instance-transact-sql-information.md#certificates). | 
| [Change data capture - CDC](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-data-capture-sql-server) | No | Yes |
| [Change tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server) | Yes |Yes |
| [Collation - database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation) | Yes | Yes |
| [Collation - server/instance](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-server-collation) | No, default logical server collation `SQL_Latin1_General_CP1_CI_AS` is always used. | Yes, can be set when the [instance is created](scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md) and cannot be updated later. |
| [Columnstore indexes](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) | Yes - [Premium tier, Standard tier - S3 and above, General Purpose tier, and Business Critical tiers](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) |Yes |
| [Common language runtime - CLR](https://docs.microsoft.com/sql/relational-databases/clr-integration/common-language-runtime-clr-integration-programming-concepts) | No | Yes, but without access to file system in `CREATE ASSEMBLY` statement - see [CLR differences](sql-database-managed-instance-transact-sql-information.md#clr) |
| [Contained databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) | Yes | Currently no [due to defect in RESTORE including point-in-time RESTORE](sql-database-managed-instance-transact-sql-information.md#cant-restore-contained-database). This is a defect that will be fixed soon. |
| [Contained users](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable) | Yes | Yes |
| [Control of flow language keywords](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow) | Yes | Yes |
| [Credentials](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/credentials-database-engine) | Yes, but only [database scoped credentials](https://docs.microsoft.com/sql/t-sql/statements/create-database-scoped-credential-transact-sql). | Yes, but only **Azure Key Vault** and `SHARED ACCESS SIGNATURE` are supported see [details](sql-database-managed-instance-transact-sql-information.md#credential) |
| [Cross-database/three-part name queries](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No - see [Elastic queries](sql-database-elastic-query-overview.md) | Yes, plus [Elastic queries](sql-database-elastic-query-overview.md) |
| [Cross-database transactions](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No | Yes, within the instance. See [Linked server differences](sql-database-managed-instance-transact-sql-information.md#linked-servers) for cross-instance queries. |
| [Cursors](https://docs.microsoft.com/sql/t-sql/language-elements/cursors-transact-sql) | Yes |Yes |
| [Data compression](https://docs.microsoft.com/sql/relational-databases/data-compression/data-compression) | Yes |Yes |
| [Database mail - DbMail](https://docs.microsoft.com/sql/relational-databases/database-mail/database-mail) | No | Yes |
| [Database mirroring](https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server) | No | [No](sql-database-managed-instance-transact-sql-information.md#database-mirroring) |
| [Database configuration settings](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) | Yes | Yes |
| [Database snapshots](https://docs.microsoft.com/sql/relational-databases/databases/database-snapshots-sql-server) | No | No |
| [Data types](https://docs.microsoft.com/sql/t-sql/data-types/data-types-transact-sql) | Yes |Yes |
| [DBCC statements](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-transact-sql) | Most - see individual statements | Yes - see [DBCC differences](sql-database-managed-instance-transact-sql-information.md#dbcc) |
| [DDL statements](https://docs.microsoft.com/sql/t-sql/statements/statements) | Most - see individual statements | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [DDL triggers](https://docs.microsoft.com/sql/relational-databases/triggers/ddl-triggers) | Database only |  Yes |
| [Distributed partition views](https://docs.microsoft.com/sql/t-sql/statements/create-view-transact-sql#partitioned-views) | No | Yes |
| [Distributed transactions - MS DTC](https://docs.microsoft.com/sql/relational-databases/native-client-ole-db-transactions/supporting-distributed-transactions) | No - see [Elastic transactions](sql-database-elastic-transactions-overview.md) |  No - see [Linked server differences](sql-database-managed-instance-transact-sql-information.md#linked-servers) |
| [DML statements](https://docs.microsoft.com/sql/t-sql/queries/queries) | Yes | Yes |
| [DML triggers](https://docs.microsoft.com/sql/relational-databases/triggers/create-dml-triggers) | Most - see individual statements |  Yes |
| [DMVs](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/system-dynamic-management-views) | Most - see individual DMVs |  Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking)|[Yes](sql-database-dynamic-data-masking-get-started.md)| [Yes](sql-database-dynamic-data-masking-get-started.md) |
| [Event notifications](https://docs.microsoft.com/sql/relational-databases/service-broker/event-notifications) | No - see [Alerts](sql-database-insights-alerts-portal.md) | No |
| [Expressions](https://docs.microsoft.com/sql/t-sql/language-elements/expressions-transact-sql) |Yes | Yes |
| [Extended events (XEvent)](https://docs.microsoft.com/sql/relational-databases/extended-events/extended-events) | Some - see [Extended events in SQL Database](sql-database-xevent-db-diff-from-svr.md) | Yes - see [Extended events differences](sql-database-managed-instance-transact-sql-information.md#extended-events) |
| [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/extended-stored-procedures-programming/creating-extended-stored-procedures) | No | No |
| [Files and file groups](https://docs.microsoft.com/sql/relational-databases/databases/database-files-and-filegroups) | Primary file group only | Yes. File paths are automatically assigned and the file location cannot be specified in `ALTER DATABASE ADD FILE` [statement](sql-database-managed-instance-transact-sql-information.md#alter-database-statement).  |
| [Filestream](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) | No | [No](sql-database-managed-instance-transact-sql-information.md#filestream-and-filetable) |
| [Full-text search (FTS)](https://docs.microsoft.com/sql/relational-databases/search/full-text-search) |  Yes, but third-party word breakers are not supported | Yes, but [third-party word breakers are not supported](sql-database-managed-instance-transact-sql-information.md#full-text-semantic-search) |
| [Functions](https://docs.microsoft.com/sql/t-sql/functions/functions) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-and-triggers) |
| [Graph processing](https://docs.microsoft.com/sql/relational-databases/graphs/sql-graph-overview) | Yes | Yes |
| [In-memory optimization](https://docs.microsoft.com/sql/relational-databases/in-memory-oltp/in-memory-oltp-in-memory-optimization) | Yes - [Premium and Business Critical tiers only](sql-database-in-memory.md) Limited support for non-persistent In-Memory objects such as table types | Yes - [Business Critical tier only](sql-database-managed-instance.md) |
| [JSON data support](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server) | [Yes](sql-database-json-features.md) | [Yes](sql-database-json-features.md) |
| [Language elements](https://docs.microsoft.com/sql/t-sql/language-elements/language-elements-transact-sql) | Most - see individual elements |  Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Linked servers](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) | No - see [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) | Yes. Only to [SQL Server and SQL Database](sql-database-managed-instance-transact-sql-information.md#linked-servers) without distributed transactions. |
| [Linked servers](https://docs.microsoft.com/sql/relational-databases/linked-servers/linked-servers-database-engine) that read from files (CSV, Excel)| No. Use [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql#e-importing-data-from-a-csv-file) or [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql#g-accessing-data-from-a-csv-file-with-a-format-file) as an alternative for CSV format. | No. Use [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql#e-importing-data-from-a-csv-file) or [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql#g-accessing-data-from-a-csv-file-with-a-format-file) as an alternative for CSV format. Track this requests on [Managed Instance Feedback item](https://feedback.azure.com/forums/915676-sql-managed-instance/suggestions/35657887-linked-server-to-non-sql-sources)|
| [Log shipping](https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server) | [High availability](sql-database-high-availability.md) is included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | Natively built in as a part of DMS migration process. Not available as High availability solution, because other [High availability](sql-database-high-availability.md) methods are included with every database and it is not recommended to use Log-shipping as HA alternative. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md). Not available as a replication mechanism between databases - use secondary replicas on [Business Critical tier](sql-database-service-tier-business-critical.md), [auto-failover groups](sql-database-auto-failover-group.md), or [transactional replication](sql-database-managed-instance-transactional-replication.md) as the alternatives. |
| [Logins and users](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/principals-database-engine) | Yes, but `CREATE` and `ALTER` login statements do not offer all the options (no Windows and server-level Azure Active Directory logins). `EXECUTE AS LOGIN` is not supported - use `EXECUTE AS USER` instead.  | Yes, with some [differences](sql-database-managed-instance-transact-sql-information.md#logins-and-users). Windows logins are not supported and they should be replaced with Azure Active Directory logins. |
| [Minimal logging in bulk import](https://docs.microsoft.com/sql/relational-databases/import-export/prerequisites-for-minimal-logging-in-bulk-import) | No, only Full Recovery model is supported. | No, only Full Recovery model is supported. |
| [Modifying system data](https://docs.microsoft.com/sql/relational-databases/databases/system-databases) | No | Yes |
| [OLE Automation](https://docs.microsoft.com/sql/database-engine/configure-windows/ole-automation-procedures-server-configuration-option) | No | No |
| [Online index operations](https://docs.microsoft.com/sql/relational-databases/indexes/perform-index-operations-online) | Yes | Yes |
| [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql)|No|Yes, only to other Azure SQL Databases and SQL Servers. See [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENJSON](https://docs.microsoft.com/sql/t-sql/functions/openjson-transact-sql)|Yes|Yes|
| [OPENQUERY](https://docs.microsoft.com/sql/t-sql/functions/openquery-transact-sql)|No|Yes, only to other Azure SQL Databases and SQL Servers. See [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql)|Yes, only to import from Azure Blob storage. |Yes, only to other Azure SQL Databases and SQL Servers, and to import from Azure Blob storage. See [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [OPENXML](https://docs.microsoft.com/sql/t-sql/functions/openxml-transact-sql)|Yes|Yes|
| [Operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) | Most - see individual operators |Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Partitioning](https://docs.microsoft.com/sql/relational-databases/partitions/partitioned-tables-and-indexes) | Yes | Yes |
| Public IP address | Yes. The access can be restricted using firewall or service endpoints.  | Yes. Needs to be explicitly enabled and port 3342 must be enabled in NSG rules. Public IP can be disabled if needed. See [Public endpoint](sql-database-managed-instance-public-endpoint-securely.md) for more details. | 
| [Point in time database restore](https://docs.microsoft.com/sql/relational-databases/backup-restore/restore-a-sql-server-database-to-a-point-in-time-full-recovery-model) | Yes - all service tiers other than hyperscale - see [SQL Database recovery](sql-database-recovery-using-backups.md#point-in-time-restore) | Yes - see [SQL Database recovery](sql-database-recovery-using-backups.md#point-in-time-restore) |
| [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide) | No. You can query data in the files placed on Azure Blob Storage using `OPENROWSET` function. | No. You can query data in the files placed on Azure Blob Storage using `OPENROWSET` function. |
| [Predicates](https://docs.microsoft.com/sql/t-sql/queries/predicates) | Yes | Yes |
| [Query Notifications](https://docs.microsoft.com/sql/relational-databases/native-client/features/working-with-query-notifications) | No | Yes |
| [R Services](https://docs.microsoft.com/sql/advanced-analytics/r-services/sql-server-r-services) | Yes, in [public preview](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services)  | No |
| [Recovery models](https://docs.microsoft.com/sql/relational-databases/backup-restore/recovery-models-sql-server) | Only Full Recovery that guarantees high availability is supported. Simple and Bulk Logged recovery models are not available. | Only Full Recovery that guarantees high availability is supported. Simple and Bulk Logged recovery models are not available. | 
| [Resource governor](https://docs.microsoft.com/sql/relational-databases/resource-governor/resource-governor) | No | Yes |
| [RESTORE statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-for-restoring-recovering-and-managing-backups-transact-sql) | No | Yes, with mandatory `FROM URL` options for the backups files placed on Azure Blob Storage. See [Restore differences](sql-database-managed-instance-transact-sql-information.md#restore-statement) |
| [Restore database from backup](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases#restore-data-backups) | From automated backups only - see [SQL Database recovery](sql-database-recovery-using-backups.md) | From automated backups - see [SQL Database recovery](sql-database-recovery-using-backups.md) and from full backups placed on Azure Blob Storage - see [Backup differences](sql-database-managed-instance-transact-sql-information.md#backup) |
| [Restore database to SQL Server](https://docs.microsoft.com/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases#restore-data-backups) | No. Use BACPAC or BCP instead of native restore. | No, because SQL Server Database Engine used in Managed Instance has higher version than any RTM version of SQL Server used on-premises. Use BACPAC, BCP, or Transactional replication instead. |
| [Row Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) | Yes | Yes |
| [Semantic search](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) | No | No |
| [Sequence numbers](https://docs.microsoft.com/sql/relational-databases/sequence-numbers/sequence-numbers) | Yes | Yes |
| [Service Broker](https://docs.microsoft.com/sql/database-engine/configure-windows/sql-server-service-broker) | No | Yes, but only within the instance. See [Service Broker differences](sql-database-managed-instance-transact-sql-information.md#service-broker) |
| [Server configuration settings](https://docs.microsoft.com/sql/database-engine/configure-windows/server-configuration-options-sql-server) | No | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [Set statements](https://docs.microsoft.com/sql/t-sql/statements/set-statements-transact-sql) | Most - see individual statements | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md)|
| [Spatial](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) | Yes | Yes |
| [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent) | No - see [Elastic jobs](elastic-jobs-overview.md) | Yes - see [SQL Server Agent differences](sql-database-managed-instance-transact-sql-information.md#sql-server-agent) |
| [SQL Server Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine) | No - see [SQL Database auditing](sql-database-auditing.md) | Yes - see [Auditing differences](sql-database-managed-instance-transact-sql-information.md#auditing) |
| [Stored procedures](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) | Yes | Yes |
| [System stored functions](https://docs.microsoft.com/sql/relational-databases/system-functions/system-functions-for-transact-sql) | Most - see individual functions | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-and-triggers) |
| [System stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/system-stored-procedures-transact-sql) | Some - see individual stored procedures | Yes - see [Stored procedures, functions, triggers differences](sql-database-managed-instance-transact-sql-information.md#stored-procedures-functions-and-triggers) |
| [System tables](https://docs.microsoft.com/sql/relational-databases/system-tables/system-tables-transact-sql) | Some - see individual tables | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [System catalog views](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/catalog-views-transact-sql) | Some - see individual views | Yes - see [T-SQL differences](sql-database-managed-instance-transact-sql-information.md) |
| [TempDB](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database) | Yes. [32GB size per core for every database](sql-database-vcore-resource-limits-single-databases.md). | Yes. [24GB size per vCore for entire GP tier and limited by instance size on BC tier](sql-database-managed-instance-resource-limits.md#service-tier-characteristics)  |
| [Temporary tables](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql#database-scoped-global-temporary-tables-azure-sql-database) | Local and database-scoped global temporary tables | Local and instance-scoped global temporary tables |
| [Temporal tables](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables) | [Yes](sql-database-temporal-tables.md) | [Yes](sql-database-temporal-tables.md) |
| Time zone choice | No | [Yes](sql-database-managed-instance-timezone.md), and it must be configured when the Managed Instance is created. |
| Threat detection|  [Yes](sql-database-threat-detection.md)|[Yes](sql-database-managed-instance-threat-detection.md)|
| [Trace flags](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql) | No | No |
| [Transactional Replication](sql-database-managed-instance-transactional-replication.md) | Yes, [Transactional and snapshot replication subscriber only](sql-database-single-database-migrate.md) | Yes, in [public preview](https://docs.microsoft.com/sql/relational-databases/replication/replication-with-sql-database-managed-instance). See the constraints [here](sql-database-managed-instance-transact-sql-information.md#replication). |
| [Variables](https://docs.microsoft.com/sql/t-sql/language-elements/variables-transact-sql) | Yes | Yes |
| [Transparent data encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) | Yes - General Purpose and Business Critical service tiers only| [Yes](transparent-data-encryption-azure-sql.md) |
| [Windows Server Failover Clustering](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/windows-server-failover-clustering-wsfc-with-sql-server) | No. Other techniques that provide [high availability](sql-database-high-availability.md) are included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | No. Other techniques that provide [high availability](sql-database-high-availability.md) are included with every database. Disaster recovery is discussed in [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) |
| [XML indexes](https://docs.microsoft.com/sql/t-sql/statements/create-xml-index-transact-sql) | Yes | Yes |

## Platform capabilities

Azure platform provides a number of PaaS capabilities that are added as an additional value to the standard Database features. There is a number of external services that can be used with Azure SQL Database service. 

| **Platform Feature** | **Single databases and elastic pools** | **Managed instances** |
| --- | --- | --- |
| [Active geo-replication](sql-database-active-geo-replication.md) | Yes - all service tiers other than hyperscale | No, see [Auto-failover groups(preview)](sql-database-auto-failover-group.md) as an alternative |
| [Auto-failover groups](sql-database-auto-failover-group.md) | Yes - all service tiers other than hyperscale | Yes, in [public preview](sql-database-auto-failover-group.md)|
| [Azure Resource Health](/azure/service-health/resource-health-overview) | Yes | No |
| [Data Migration Service (DMS)](https://docs.microsoft.com/sql/dma/dma-overview) | Yes | Yes |
| File system access | No. Use [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql#f-importing-data-from-a-file-in-azure-blob-storage) or [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql#i-accessing-data-from-a-file-stored-on-azure-blob-storage) to access and load data from Azure Blob Storage as an alternative. | No. Use [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql#f-importing-data-from-a-file-in-azure-blob-storage) or [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql#i-accessing-data-from-a-file-stored-on-azure-blob-storage) to access and load data from Azure Blob Storage as an alternative. |
| [Geo-restore](sql-database-recovery-using-backups.md#geo-restore) | Yes - all service tiers other than hyperscale | Yes - using [Azure PowerShell](https://medium.com/azure-sqldb-managed-instance/geo-restore-your-databases-on-azure-sql-instances-1451480e90fa). |
| [Hyperscale architecture](sql-database-service-tier-hyperscale.md) | Yes | No |
| [Long-term backup retention - LTR](sql-database-long-term-retention.md) | Yes, keep automatically taken backups up to 10 years. | Not yet. Use `COPY_ONLY` [manual backups](sql-database-managed-instance-transact-sql-information.md#backup) as a temporary workaround. |
| [Policy-based management](https://docs.microsoft.com/sql/relational-databases/policy-based-management/administer-servers-by-using-policy-based-management) | No | No |
| Resource pools | Yes, as [Elastic pools](sql-database-elastic-pool.md) | Built-in - a single Managed Instance can have multiple databases that share the same pool of resources |
| Scaling up or down (online) | Yes, you can either change DTU or reserved vCores or max storage with the minimal downtime. | Yes, you can change reserved vCores or max storage with the minimal downtime. | 
| Auto-scale | Yes, in [serverless model](sql-database-serverless.md) | No, you need to choose reserved compute and storage. |
| Pause/resume | Yes, in [serverless model](sql-database-serverless.md) | No | 
| [SMO](https://docs.microsoft.com/sql/relational-databases/server-management-objects-smo/sql-server-management-objects-smo-programming-guide) | [Yes](https://www.nuget.org/packages/Microsoft.SqlServer.SqlManagementObjects) | Yes [version 150](https://www.nuget.org/packages/Microsoft.SqlServer.SqlManagementObjects) |
| [SQL Analytics](https://docs.microsoft.com/azure/azure-monitor/insights/azure-sql) | Yes | Yes |
| [SQL Data Sync](sql-database-get-started-sql-data-sync.md) | Yes | No |
| [SQL Server PowerShell](https://docs.microsoft.com/sql/relational-databases/scripting/sql-server-powershell) | Yes | Yes |
| [SQL Server Analysis Services (SSAS)](https://docs.microsoft.com/sql/analysis-services/analysis-services) | No, [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) is a separate Azure cloud service. | No, [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/) is a separate Azure cloud service. |
| [SQL Server Integration Services (SSIS)](https://docs.microsoft.com/sql/integration-services/sql-server-integration-services) | Yes, with a managed SSIS in Azure Data Factory (ADF) environment, where packages are stored in SSISDB hosted by Azure SQL Database and executed on Azure SSIS Integration Runtime (IR), see [Create Azure-SSIS IR in ADF](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). <br/><br/>To compare the SSIS features in SQL Database server and Managed Instance, see [Compare Azure SQL Database single databases/elastic pools and Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#compare-sql-database-single-databaseelastic-pool-and-sql-database-managed-instance). | Yes, with a managed SSIS in Azure Data Factory (ADF) environment, where packages are stored in SSISDB hosted by Managed Instance and executed on Azure SSIS Integration Runtime (IR), see [Create Azure-SSIS IR in ADF](https://docs.microsoft.com/azure/data-factory/create-azure-ssis-integration-runtime). <br/><br/>To compare the SSIS features in SQL Database and Managed Instance, see [Compare Azure SQL Database single databases/elastic pools and Managed Instance](../data-factory/create-azure-ssis-integration-runtime.md#compare-sql-database-single-databaseelastic-pool-and-sql-database-managed-instance). |
| [SQL Server Reporting Services (SSRS)](https://docs.microsoft.com/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports) | No - [see Power BI](https://docs.microsoft.com/power-bi/) | No - [see Power BI](https://docs.microsoft.com/power-bi/) |
| [Query Performance Insights (QPI)](sql-database-query-performance.md) | Yes | No. Use built-in reports in SQL Server Management Studio and Azure Data Studio. |
| [VNet](../virtual-network/virtual-networks-overview.md) | Partial, it enables restricted access using [VNet Endpoints](sql-database-vnet-service-endpoint-rule-overview.md) | Yes, Managed Instance is injected in customer's VNet. See [subnet](sql-database-managed-instance-transact-sql-information.md#subnet) and [VNet](sql-database-managed-instance-transact-sql-information.md#vnet) |

## Tools
Azure SQL database supports various data tools that can help you to manage your data.

| **SQL Tool** | **Single databases and elastic pools** | **Managed instances** |
| --- | --- | --- |
| [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is) | Yes | Yes |
| [BACPAC file (export)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/export-a-data-tier-application) | Yes - see [SQL Database export](sql-database-export.md) | Yes - see [SQL Database export](sql-database-export.md) |
| [BACPAC file (import)](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database) | Yes - see [SQL Database import](sql-database-import.md) | Yes - see [SQL Database import](sql-database-import.md) |
| [Data Quality Services (DQS)](https://docs.microsoft.com/sql/data-quality-services/data-quality-services) | No | No |
| [Master Data Services (MDS)](https://docs.microsoft.com/sql/master-data-services/master-data-services-overview-mds) | No | No |
| [SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt) | Yes | Yes |
| [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) | Yes | Yes [version 18.0 and higher](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) |
| [SQL Server Profiler](https://docs.microsoft.com/sql/tools/sql-server-profiler/sql-server-profiler) | No - see [Extended events](sql-database-xevent-db-diff-from-svr.md) | Yes |
| [System Center Operations Manager - SCOM](https://docs.microsoft.com/system-center/scom/welcome) | [Yes](https://www.microsoft.com/download/details.aspx?id=38829) | No |

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about a Managed Instance, see [What is a Managed Instance?](sql-database-managed-instance.md).
