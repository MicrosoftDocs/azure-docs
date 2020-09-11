---
title: Features and Capabilities of Azure Arc enabled SQL Managed Instance
description: Features and Capabilities of Azure Arc enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu 
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Features and Capabilities of Azure Arc enabled SQL Managed Instance

Azure Arc enabled SQL Managed Instance share a common code base with the latest stable version of SQL Server. Most of the standard SQL language, query processing, and database management features are identical. The features that are common between SQL Server and SQL Database or SQL Managed Instance are:

- Language features - [Control of flow language keywords](/sql/t-sql/language-elements/control-of-flow), [Cursors](/sql/t-sql/language-elements/cursors-transact-sql), [Data types](/sql/t-sql/data-types/data-types-transact-sql), [DML statements](/sql/t-sql/queries/queries), [Predicates](/sql/t-sql/queries/predicates), [Sequence numbers](/sql/relational-databases/sequence-numbers/sequence-numbers), [Stored procedures](/sql/relational-databases/stored-procedures/stored-procedures-database-engine), and [Variables](/sql/t-sql/language-elements/variables-transact-sql).
- Database features - [Automatic tuning (plan forcing)](/sql/relational-databases/automatic-tuning/automatic-tuning), [Change tracking](/sql/relational-databases/track-changes/about-change-tracking-sql-server), [Database collation](/sql/relational-databases/collations/set-or-change-the-database-collation), [Contained databases](/sql/relational-databases/databases/contained-databases), [Contained users](/sql/relational-databases/security/contained-database-users-making-your-database-portable), [Data compression](/sql/relational-databases/data-compression/data-compression), [Database configuration settings](/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql), [Online index operations](/sql/relational-databases/indexes/perform-index-operations-online), [Partitioning](/sql/relational-databases/partitions/partitioned-tables-and-indexes), and [Temporal tables](/sql/relational-databases/tables/temporal-tables) ([see getting started guide](/sql/relational-databases/tables/getting-started-with-system-versioned-temporal-tables)).
- Security features - [Application roles](/sql/relational-databases/security/authentication-access/application-roles), [Dynamic data masking](/sql/relational-databases/security/dynamic-data-masking) ([Get started with SQL Database dynamic data masking with the Azure portal](../../azure-sql/database/dynamic-data-masking-configure-portal.md)), [Row Level Security](/sql/relational-databases/security/row-level-security)
- Multi-model capabilities - [Graph processing](/sql/relational-databases/graphs/sql-graph-overview), [JSON data](/sql/relational-databases/json/json-data-sql-server), [OPENXML](/sql/t-sql/functions/openxml-transact-sql), [Spatial](/sql/relational-databases/spatial/spatial-data-sql-server), [OPENJSON](/sql/t-sql/functions/openjson-transact-sql), and [XML indexes](/sql/t-sql/statements/create-xml-index-transact-sql).



[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Features of Azure Arc enabled SQL Managed Instance

###  <a name="RDBMSHA"></a> RDBMS High Availability  
  
|Feature|Azure Arc enabled SQL Managed Instance|
|-------------|----------------|
|Log shipping|Yes| 
|Backup compression|Yes|
|Database snapshot|Yes|
|Always On failover cluster instance<sup>1</sup>| Not Applicable. Similar capabilities available |
|Always On availability groups<sup>2</sup>|HA capabilities are planned.|
|Basic availability groups <sup>2</sup>|HA capabilities are planned.|
|Minimum replica commit availability group <sup>2</sup>|HA capabilities are planned.|
|Clusterless availability group|Yes|
|Online page and file restore|Yes|
|Online indexing|Yes|
|Resumable online index rebuilds|Yes|
|Online schema change|Yes|
|Fast recovery|Yes|
|Mirrored backups|Yes|
|Hot add memory and CPU|Yes|
|Encrypted backup|Yes|
|Hybrid backup to Azure (backup to URL)|Yes|

<sup>1</sup> In the scenario where there is pod failure, a new SQL Managed Instance will start up and re-attach to the persistent volume containing your data. [Learn more about Kubernetes persistent volumes here](https://kubernetes.io/docs/concepts/storage/persistent-volumes).

<sup>2</sup> Future releases will provide AG capabilities 

###  <a name="RDBMSSP"></a> RDBMS Scalability and Performance  

|Feature|Azure Arc enabled SQL Managed Instance|
|-------------|----------------|
|Columnstore|	Yes|
|Large object binaries in clustered columnstore indexes|	Yes|
|Online nonclustered columnstore index rebuild|	Yes|
|In-Memory OLTP|	Yes|
|Persistent Main Memory|	Yes|
|Table and index partitioning|	Yes
|Data compression|	Yes|
|Resource Governor|	Yes|
|Partitioned Table Parallelism|	Yes|
|NUMA Aware and Large Page Memory and Buffer Array Allocation|	Yes|
|IO Resource Governance|	Yes|
|Delayed Durability|	Yes|
|Automatic Tuning|	Yes|
|Batch Mode Adaptive Joins|	Yes|
|Batch Mode Memory Grant Feedback|	Yes|
|Interleaved Execution for Multi-Statement Table Valued Functions|	Yes|
|Bulk insert improvements	|Yes|

###  <a name="RDBMSS"></a> RDBMS Security  
|Feature|Azure Arc enabled SQL Managed Instance|
|-------------|----------------|
|Row-level security|	Yes|
|Always Encrypted|	Yes|
|Always Encrypted with Secure Enclaves|	No|
|Dynamic data masking|	Yes|
|Basic auditing|	Yes|
|Fine grained auditing|	Yes|
|Transparent database encryption|	Yes|
|User-defined roles|	Yes|
|Contained databases|	Yes|
|Encryption for backups|	Yes|

###  <a name="RDBMSM"></a> RDBMS Manageability  

|Feature|Azure Arc enabled SQL Managed Instance|
|-------------|----------------|
|Dedicated admin connection|	Yes|
|PowerShell scripting support|	Yes|
|Support for data-tier application component operations - extract, deploy, upgrade, delete|	Yes
|Policy automation (check on schedule and change)	|Yes|
|Performance data collector|	Yes|
|Standard performance reports	|Yes|
|Plan guides and plan freezing for plan guides|	Yes|
|Direct query of indexed views (using NOEXPAND hint)|	Yes|
|Automatic indexed views maintenance	|Yes|
|Distributed partitioned views|	Yes|
|Parallel indexed operations	|Yes|
|Automatic use of indexed view by query optimizer|	Yes|
|Parallel consistency check	|Yes|


### <a name="Programmability"></a> Programmability  

|Feature|Azure Arc enabled SQL Managed Instance|
|-------------|----------------|
|JSON|	Yes	|		|
|Query Store	|Yes	|		
|Temporal|	Yes	|		
|Native XML support|	Yes	|		
|XML indexing	|Yes	|		
|MERGE & UPSERT capabilities|	Yes	|		
|Date and Time datatypes	|Yes	|		
|Internationalization support|	Yes	|		
|Full-text and semantic search |	No		|
|Specification of language in query	|Yes		|	
|Service Broker (messaging)|	Yes		|	
|Transact-SQL endpoints|	Yes	|		
|Graph|	Yes	|	
|Machine Learning Services| No	|	
|PolyBase| No	|


### Tools

Azure Arc enabled SQL Managed Instance support various data tools that can help you manage your data.

| **Tool** | Azure Arc enabled SQL Managed Instance|
| --- | --- | --- |
| Azure portal <sup>1</sup> | No |
| Azure CLI | No |
| [Azure Data Studio](/sql/azure-data-studio/what-is) | Yes |
| Azure PowerShell | Yes |
| [BACPAC file (export)](/sql/relational-databases/data-tier-applications/export-a-data-tier-application) | Yes |
| [BACPAC file (import)](/sql/relational-databases/data-tier-applications/import-a-bacpac-file-to-create-a-new-user-database) | Yes |
| [SQL Server Data Tools (SSDT)](/sql/ssdt/download-sql-server-data-tools-ssdt) | Yes |
| [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) | Yes |
| [SQL Server PowerShell](/sql/relational-databases/scripting/sql-server-powershell) | Yes |
| [SQL Server Profiler](/sql/tools/sql-server-profiler/sql-server-profiler) | Yes |

<sup>1</sup> The Azure portal is only used to view Azure Arc enabled SQL Managed Instances in read-only mode during preview.


### <a name="Unsupported"></a> Unsupported Features & Services

The following features and services are not available for Azure Arc enabled SQL Managed Instance. The support of these features will be increasingly enabled over time.

| Area | Unsupported feature or service |
|-----|-----|
| **Database engine** | Merge replication |
| &nbsp; | Stretch DB |
| &nbsp; | Distributed query with 3rd-party connections |
| &nbsp; | Linked Servers to data sources other than SQL Server and Azure SQL products |
| &nbsp; | System extended stored procedures (XP_CMDSHELL, etc.) |
| &nbsp; | FileTable, FILESTREAM |
| &nbsp; | CLR assemblies with the EXTERNAL_ACCESS or UNSAFE permission set |
| &nbsp; | Buffer Pool Extension |
| **SQL Server Agent** |  Subsystems: CmdExec, PowerShell, Queue Reader, SSIS, SSAS, SSRS |
| &nbsp; | Alerts |
| &nbsp; | Managed Backup |
| **High Availability** | Database mirroring  |
| **Security** | Extensible Key Management |
| &nbsp; | AD Authentication for Linked Servers | 
| &nbsp; | AD Authentication for Availability Groups (AGs) | 