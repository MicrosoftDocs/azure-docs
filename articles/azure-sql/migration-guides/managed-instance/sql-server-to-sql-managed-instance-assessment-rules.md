---
title: "Assessment rules for SQL Server to Azure SQL Managed Instance migration"
description: Assessment rules to identify issues with the source SQL Server instance that must be addressed before migrating to Azure SQL Managed Instance. 
ms.service: sql-managed-instance
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: rajeshsetlem
ms.author: rsetlem
ms.reviewer: mathoma, cawrites
ms.date: 12/15/2020
---
# Assessment rules for SQL Server to  Azure SQL Managed Instance migration
[!INCLUDE[appliesto--sqldb](../../includes/appliesto-sqldb.md)]

Migration tools validate your source SQL Server instance by running a number of assessment rules to identify issues that must be addressed before migrating your SQL Server database to Azure SQL Managed Instance. 

This article provides a list of the rules used to assess the feasibility of migrating your SQL Server database to Azure SQL Managed Instance. 

## AnalysisCommand job<a id="AnalysisCommandJob"></a>

**Title: AnalysisCommand job step is not supported in Azure SQL Managed Instance.**   
**Category**: Warning   


**Description**   
It is a job step that runs an Analysis Services command. AnalysisCommand job step is not supported in Azure SQL Managed Instance.

**Recommendation**     
Review impacted objects section in Azure Migrate to see all jobs using Analysis Service Command job step and evaluate if the job step or the impacted object can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)

## AnalysisQuery job<a id="AnalysisQueryJob"></a>

**Title: AnalysisQuery job step is not supported in Azure SQL Managed Instance.**   
**Category**: Warning   

**Description**   
It is a job step that runs an Analysis Services query. AnalysisQuery job step is not supported in Azure SQL Managed Instance.


**Recommendation**   
Review impacted objects section in Azure Migrate to see all jobs using Analysis Service Query job step and evaluate if the job step or the impacted object can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)


## Assembly from file<a id="AssemblyFromFile"></a>

**Title: 'CREATE ASSEMBLY' and 'ALTER ASSEMBLY' with a file parameter are unsupported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Azure SQL Managed Instance does not support 'CREATE ASSEMBLY' or 'ALTER ASSEMBLY' with a file parameter. A binary parameter is supported. See the Impacted Objects section for the specific object where the file parameter is used.

**Recommendation**   
Review objects using 'CREATE ASSEMBLY' or 'ALTER ASSEMBLY with a file parameter. If any such objects that are required, convert the file parameter to a binary parameter. Alternatively, migrate to SQL Server on Azure Virtual Machine. 

More information: [CLR differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#clr)

## Bulk insert<a id="BulkInsert"></a>

**Title: BULK INSERT with non-Azure blob data source is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Azure SQL Managed Instance cannot access file shares or Windows folders. See the "Impacted Objects" section for the specific uses of BULK INSERT statements that do not reference an Azure blob. Objects with 'BULK INSERT' where the source is not Azure blob storage will not work after migrating to Azure SQL Managed Instance.


**Recommendation**   
You will need to convert BULK INSERT statements that use local files or file shares to use files from Azure blob storage instead, when migrating to Azure SQL Managed Instance.

More information: [Bulk Insert and OPENROWSET differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#bulk-insert--openrowset)


## CLR Security<a id="ClrStrictSecurity"></a>

**Title: CLR assemblies marked as SAFE or EXTERNAL_ACCESS are considered UNSAFE**   
**Category**: Warning   

**Description**   
CLR Strict Security mode is enforced in Azure SQL Managed Instance. This mode is enabled by default and introduces breaking changes for databases containing user-defined CLR assemblies marked either SAFE or EXTERNAL_ACCESS.


**Recommendation**   
CLR uses Code Access Security (CAS) in the .NET Framework, which is no longer supported as a security boundary. Beginning with SQL Server 2017 (14.x) database engine, an `sp_configure` option called clr strict security is introduced to enhance the security of CLR assemblies. Clr strict security is enabled by default, and treats SAFE and EXTERNAL_ACCESS CLR assemblies as if they were marked UNSAFE. When clr strict security is disabled, a CLR assembly created with PERMISSION_SET = SAFE may be able to access external system resources, call unmanaged code, and acquire sysadmin privileges. After enabling strict security, any assemblies that are not signed will fail to load. Also, if a database has SAFE or EXTERNAL_ACCESS assemblies, RESTORE or ATTACH DATABASE statements can complete, but the assemblies may fail to load. To load the assemblies, you must either alter or drop and recreate each assembly so that it is signed with a certificate or asymmetric key that has a corresponding login with the UNSAFE ASSEMBLY permission on the server.

More information: [CLR strict security](/sql/database-engine/configure-windows/clr-strict-security)

## Compute clause<a id="ComputeClause"></a>

**Title: COMPUTE clause is discontinued and has been removed.**   
**Category**: Warning   

**Description**   
The COMPUTE clause generates totals that appear as additional summary columns at the end of the result set. However, this clause is no longer supported in Azure SQL Managed Instance.



**Recommendation**   
The T-SQL module needs to be rewritten using the ROLLUP operator instead. The code below demonstrates how COMPUTE can be replaced with ROLLUP: 

```sql
USE AdventureWorks GO;  

SELECT SalesOrderID, UnitPrice, UnitPriceDiscount 
FROM Sales.SalesOrderDetail 
ORDER BY SalesOrderID COMPUTE SUM(UnitPrice), SUM(UnitPriceDiscount) 
BY SalesOrderID GO; 

SELECT SalesOrderID, UnitPrice, UnitPriceDiscount,SUM(UnitPrice) as UnitPrice , 
SUM(UnitPriceDiscount) as UnitPriceDiscount 
FROM Sales.SalesOrderDetail 
GROUP BY SalesOrderID, UnitPrice, UnitPriceDiscount WITH ROLLUP;
```

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## Cryptographic provider<a id="CryptographicProvider"></a>

**Title: A use of CREATE CRYPTOGRAPHIC PROVIDER or ALTER CRYPTOGRAPHIC PROVIDER was found, which is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Azure SQL Managed Instance does not support CRYPTOGRAPHIC PROVIDER statements because it cannot access files. See the Impacted Objects section for the specific uses of CRYPTOGRAPHIC PROVIDER statements. Objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER' will not work correctly after migrating to Azure SQL Managed Instance.


**Recommendation**   
Review objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER'. In any such objects that are required, remove the uses of these features. Alternatively, migrate to SQL Server on Azure Virtual Machine. 

More information: [Cryptographic provider differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#cryptographic-providers)

## Database compatibility<a id="DbCompatLevelLowerThan100"></a>

**Title: Database compatibility level below 100 is not supported**   
**Category**: Warning   

**Description**   
Database Compatibility Level is a valuable tool to assist in database modernization, by allowing the SQL Server Database Engine to be upgraded, while keeping connecting applications functional status by maintaining the same pre-upgrade Database Compatibility Level. Azure SQL Managed Instance doesn't support compatibility levels below 100. When the database with compatibility level below 100 is restored on Azure SQL Managed Instance, the compatibility level is upgraded to 100. 


**Recommendation**...
Evaluate if the application functionality is intact when the database compatibility level is upgraded to 100 on Azure SQL Managed Instance. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Supported compatibility levels in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#compatibility-levels)

## Database principal alias<a id="DatabasePrincipalAlias"></a>

**Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.**   
**Category**: Issue   

**Description**   
SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Managed Instance.


**Recommendation**   
Use roles instead of aliases.

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## DISABLE_DEF_CNST_CHK option<a id="DisableDefCNSTCHK"></a>

**Title: SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed.**   
**Category**: Issue   

**Description**   
SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed in Azure SQL Managed Instance.


More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## FASTFIRSTROW hint<a id="FastFirstRowHint"></a>

**Title: FASTFIRSTROW query hint is discontinued and has been removed.**   
**Category**: Warning   

**Description**   
FASTFIRSTROW query hint is discontinued and has been removed in Azure SQL Managed Instance.


**Recommendation**   
Instead of FASTFIRSTROW query hint use OPTION (FAST n).

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## FileStream<a id="FileStream"></a>

**Title: Filestream and Filetable are not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
The Filestream feature, which allows you to store unstructured data such as text documents, images, and videos in NTFS file system, is not supported in Azure SQL Managed Instance. **This database can't be migrated as the backup containing Filestream filegroups can't be restored on Azure SQL Managed Instance.**


**Recommendation**   
Upload the unstructured files to Azure Blob storage and store metadata related to these files (name, type, URL location, storage key etc.) in Azure SQL Managed Instance. You may have to re-engineer your application to enable streaming blobs to and from Azure SQL Managed Instance. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Streaming Blobs To and From SQL Azure blog](https://azure.microsoft.com/en-in/blog/streaming-blobs-to-and-from-sql-azure/)

## Heterogeneous MS DTC<a id="MIHeterogeneousMSDTCTransactSQL"></a>

**Title: BEGIN DISTRIBUTED TRANSACTION with non-SQL Server remote server is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is not supported in Azure SQL Managed Instance if the remote server is not SQL Server. 


**Recommendation**   
Review impacted objects section in Azure Migrate to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview). Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Transactions across multiple servers for Azure SQL Managed Instance ](../../database/elastic-transactions-overview.md#transactions-across-multiple-servers-for-azure-sql-managed-instance)

## Homogenous MS DTC<a id="MIHomogeneousMSDTCTransactSQL"></a>

**Title: BEGIN DISTRIBUTED TRANSACTION is supported across multiple servers for Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is supported across multiple servers for Azure SQL Managed Instance.


**Recommendation**   
Review impacted objects section in Azure Migrate to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview). Alternatively, migrate to SQL Server on Azure Virtual Machine. 

More information: [Transactions across multiple servers for Azure SQL Managed Instance](../../database/elastic-transactions-overview.md#transactions-across-multiple-servers-for-azure-sql-managed-instance)


## Linked server (non-SQL provider)<a id="LinkedServerWithNonSQLProvider"></a>

**Title: Linked server with non-SQL Server Provider is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Linked servers enable the SQL Server Database Engine to execute commands against OLE DB data sources outside of the instance of SQL Server. Linked server with non-SQL Server Provider is not supported in Azure SQL Managed Instance. 


**Recommendation**   
Azure SQL Managed Instance does not support linked server functionality if the remote server provider is non-SQL Server like Oracle, Sybase etc. 

The following actions are recommended to eliminate the need for linked servers: 
- Identify the dependent database(s) from remote non-SQL servers and consider moving these into the database being migrated. 
- Migrate the dependent database(s) to supported targets like SQL Managed Instance, SQL Database, Azure Synapse SQL and SQL Server instances. 
- Consider creating linked server between Azure SQL Managed Instance and SQL Server on Azure Virtual Machine (SQL VM).  Then from SQL VM create linked server to Oracle, Sybase etc. This approach does involve two hops but can be used as temporary workaround.  
- Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Linked Server differences in Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md#linked-servers)

## Merge job<a id="MergeJob"></a>

**Title: Merge job step is not supported in Azure SQL Managed Instance.**   
**Category**: Warning   

**Description**   
It is a job step that activates the replication Merge Agent. The Replication Merge Agent is a utility executable that applies the initial snapshot held in the database tables to the Subscribers. It also merges incremental data changes that occurred at the Publisher after the initial snapshot was created, and reconciles conflicts either according to the rules you configure or using a custom resolver you create. Merge job step is not supported in Azure SQL Managed Instance.


**Recommendation**   
Review impacted objects section in Azure Migrate to see all jobs using Merge job step and evaluate if the job step or the impacted object can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)


## MI database size<a id="MIDatabaseSize<"></a>

**Title: Azure SQL Managed Instance does not support database size greater than 8 TB.**   
**Category**: Issue   

**Description**   
The size of the database is greater than maximum instance reserved storage. **This database can't be selected for migration as the size exceeded the allowed limit.**


**Recommendation**   
Evaluate if the data can be archived compressed or sharded into multiple databases. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Hardware generation characteristics of Azure SQL Managed Instance ](../../managed-instance/resource-limits.md#hardware-generation-characteristics)



## MI instance size<a id="MIInstanceSize<"></a>

**Title: Maximum instance storage size in Azure SQL Managed Instance cannot be greater than 8 TB.**   
**Category**: Warning   

**Description**   
The size of all databases is greater than maximum instance reserved storage.  


**Recommendation**   
Consider migrating the databases to different Azure SQL Managed Instances or to SQL Server on Azure Virtual Machine if all the databases must exist on the same instance. 

More information: [Hardware generation characteristics of Azure SQL Managed Instance ](../../managed-instance/resource-limits.md#hardware-generation-characteristics)


## Multiple log files<a id="MultipleLogFiles<"></a>

**Title: Azure SQL Managed Instance does not support multiple log files.**   
**Category**: Issue   

**Description**   
SQL Server allows a database to log to multiple files. This database has multiple log files which is not supported in Azure SQL Managed Instance. **This database can't be migrated as the backup can't be restored on Azure SQL Managed Instance. 
**

**Recommendation**   
Azure SQL Managed Instance supports only a single log per database. You need to delete all but one of the log files before migrating this database to Azure: 

```sql
ALTER DATABASE [database_name] REMOVE FILE [log_file_name]
```

More information: [Unsupported database options in Azure SQL Managed Instance  ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#database-options)



## Next column<a id="NextColumn"></a>

**Title: Tables and Columns named NEXT will lead to an error In Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
Tables or columns named NEXT were detected. Sequences, introduced in Microsoft SQL Server, use the ANSI standard NEXT VALUE FOR function. If a table or a column is named NEXT and the column is aliased as VALUE, and if the ANSI standard AS is omitted, the resulting statement can cause an error.


**Recommendation**   
Rewrite statements to include the ANSI standard AS keyword when aliasing a table or column. For example, when a column is named NEXT and that column is aliased as VALUE, the query SELECT NEXT VALUE FROM TABLE will cause an error and should be rewritten as SELECT NEXT AS VALUE FROM TABLE. Similarly, when a table is named NEXT and that table is aliased as VALUE, the query SELECT Col1 FROM NEXT VALUE will cause an error and should be rewritten as SELECT Col1 FROM NEXT AS VALUE.



## Non-ANSI style left outer join<a id="NonANSILeftOuterJoinSyntax"></a>

**Title: Non-ANSI style left outer join is discontinued and has been removed.**   
**Category**: Warning   

**Description**   
Non-ANSI style left outer join is discontinued and has been removed in Azure SQL Managed Instance. 


**Recommendation**   
Use ANSI join syntax.

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## Non-ANSI style right outer join<a id="NonANSIRightOuterJoinSyntax"></a>

**Title: Non-ANSI style right outer join is discontinued and has been removed.**   
**Category**: Warning   

**Description**   
Non-ANSI style right outer join is discontinued and has been removed in Azure SQL Managed Instance. 



More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

**Recommendation**   
Use ANSI join syntax.

## Databases exceed 100 <a id="NumDbExceeds100"></a>

**Title: Azure SQL Managed Instance supports a maximum of 100 databases per instance.**   
**Category**: Warning   

**Description**   
Maximum number of databases supported in Azure SQL Managed Instance is 100, unless the instance storage size limit has been reached.



**Recommendation**   
Consider migrating the databases to different Azure SQL Managed Instances or to SQL Server on Azure Virtual Machine if all the databases must exist on the same instance. 

More information: [Azure SQL Managed Instance Resource Limits ](../../managed-instance/resource-limits.md#service-tier-characteristics)

## OPENROWSET (non-blob data source)<a id="OpenRowsetWithNonBlobDataSourceBulk"></a>

**Title: OpenRowSet used in bulk operation with non-Azure blob storage data source is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
OPENROWSET supports bulk operations through a built-in BULK provider that enables data from a file to be read and returned as a rowset. OPENROWSET with non-Azure blob storage data source is not supported in Azure SQL Managed Instance. 

**Recommendation**   
Azure SQL Managed Instance cannot access file shares and Windows folders, so the files must be imported from Azure blob storage. Therefore, only blob type DATASOURCE is supported in OPENROWSET function. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Bulk Insert and OPENROWSET differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#bulk-insert--openrowset)

## OPENROWSET (non-SQL provider)<a id="OpenRowsetWithNonSQLProvider"></a>

**Title: OpenRowSet with non-SQL provider is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   

**Description**   
This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB. OpenRowSet with non-SQL provider is not supported in Azure SQL Managed Instance. 



**Recommendation**   
OPENROWSET function can be used to execute queries only on SQL Server instances (either managed, on-premises, or in Virtual Machines). Only SQLNCLI, SQLNCLI11, and SQLOLEDB values are supported as provider. Therefore, the recommendation action is that identify the dependent database(s) from remote non-SQL Servers and consider moving these into the database being migrated.

More information: [Bulk Insert and OPENROWSET differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#bulk-insert--openrowset)


## PowerShell job<a id="PowerShellJob"></a>

**Title: PowerShell job step is not supported in Azure SQL Managed Instance.**   
**Category**: Warning   

**Description**   
It is a job step that runs a PowerShell script. PowerShell job step is not supported in Azure SQL Managed Instance. 



**Recommendation**   
Review impacted objects section in Azure Migrate to see all jobs using PowerShell job step and evaluate if the job step or the impacted object can be removed.  Evaluate if Azure Automation can be used. Alternatively, migrate to SQL Server on Azure Virtual Machine

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)

## Queue Reader job<a id="QueueReaderJob"></a>

**Title: Queue Reader job step is not supported in Azure SQL Managed Instance.**   
**Category**: Warning   

**Description**   
It is a job step that activates the replication Queue Reader Agent. The Replication Queue Reader Agent is an executable that reads messages stored in a Microsoft SQL Server queue or a Microsoft Message Queue and then applies those messages to the Publisher. Queue Reader Agent is used with snapshot and transactional publications that allow queued updating. Queue Reader job step is not supported in Azure SQL Managed Instance.


**Recommendation**   
Review impacted objects section in Azure Migrate to see all jobs using Queue Reader job step and evaluate if the job step or the impacted object can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)


## RAISERROR<a id="RAISERROR"></a>

**Title: Legacy style RAISERROR calls should be replaced with modern equivalents.**   
**Category**: Warning   

**Description**   
RAISERROR calls like the below example are termed as legacy-style because they do not include the commas and the parenthesis. RAISERROR 50001 'this is a test'. This method of calling RAISERROR is discontinued and removed in Azure SQL Managed Instance.



**Recommendation**   
Rewrite the statement using the current RAISERROR syntax, or evaluate if the modern approach of `BEGIN TRY { }  END TRY BEGIN CATCH {  THROW; } END CATCH` is feasible.

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)


## SQL Mail<a id="SqlMail"></a>

**Title: SQL Mail has been discontinued.**   
**Category**: Warning   


**Description**   
SQL Mail has been discontinued and removed in Azure SQL Managed Instance.



**Recommendation**   
Use Database Mail.

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)


## SystemProcedures110<a id="SystemProcedures110"></a>


**Title: Detected statements that reference removed system stored procedures that are not available in Azure SQL Managed Instance.**   
**Category**: Warning   

**Description**   
Following unsupported system and extended stored procedures cannot be used in Azure SQL Managed Instance - `sp_dboption`, `sp_addserver`, `sp_dropalias`,`sp_activedirectory_obj`, `sp_activedirectory_scp`, and `sp_activedirectory_start`. 




**Recommendation**   
Remove references to unsupported system procedures that have been removed in Azure SQL Managed Instance.

More information: [Discontinued Database Engine Functionality in SQL Server](/previous-versions/sql/2014/database-engine/discontinued-database-engine-functionality-in-sql-server-2016#Denali)

## Transact-SQL job<a id="TransactSqlJob"></a>

**Title: TSQL job step includes unsupported commands in Azure SQL Managed Instance**   
**Category**: Warning   


**Description**   
It is a job step that runs TSQL scripts at scheduled time. TSQL job step includes unsupported commands which are not supported in Azure SQL Managed Instance.



**Recommendation**   
Review impacted objects section in Azure Migrate to see all jobs that include unsupported commands in Azure SQL Managed Instance and evaluate if the job step or the impacted object can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [SQL Server Agent differences in Azure SQL Managed Instance ](../../managed-instance/transact-sql-tsql-differences-sql-server.md#sql-server-agent)


## Trace flags<a id="TraceFlags"></a>

**Title: Trace flags not supported in Azure SQL Managed Instance were found**   
**Category**: Warning   


**Description**   
Azure SQL Managed Instance supports only limited number of global trace flags. Session trace flags aren't supported.



**Recommendation**   
Review impacted objects section in Azure Migrate to see all trace flags that are not supported in Azure SQL Managed Instance and evaluate if they can be removed. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Trace flags](/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql#trace-flags)


## Windows authentication<a id="WindowsAuthentication"></a>

**Title: Database users mapped with Windows authentication (integrated security) are not supported in Azure SQL Managed Instance**   
**Category**: Warning   


**Description**   
Azure SQL Managed Instance supports two types of authentication: 
- SQL Authentication, which uses a username and password
- Azure Active Directory Authentication, which uses identities managed by Azure Active Directory and is supported for managed and integrated domains. 

Database users mapped with Windows authentication (integrated security) are not supported in Azure SQL Managed Instance. 


**Recommendation**   
Federate the local Active Directory with Azure Active Directory. The Windows identity can then be replaced with the equivalent Azure Active Directory identities. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [SQL Managed Instance security capabilities](../../database/security-overview.md#authentication)


## XP_cmdshell<a id="XpCmdshell"></a>

**Title: xp_cmdshell is not supported in Azure SQL Managed Instance.**   
**Category**: Issue   


**Description**   
Xp_cmdshell which spawns a Windows command shell and passes in a string for execution is not supported in Azure SQL Managed Instance. 



**Recommendation**   
Review impacted objects section in Azure Migrate to see all objects using xp_cmdshell and evaluate if the reference to xp_cmdshell or the impacted object can be removed. Consider exploring Azure Automation that delivers cloud-based automation and configuration service. Alternatively, migrate to SQL Server on Azure Virtual Machine.

More information: [Stored Procedure differences in Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md#stored-procedures-functions-and-triggers)

## Next steps

To start migrating your SQL Server to Azure SQL Managed Instance, see the [SQL Server to SQL Managed Instance migration guide](sql-server-to-managed-instance-guide.md).

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Managed Instance see:
   - [Service Tiers in Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md#service-tiers)
   - [Differences between SQL Server and Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
