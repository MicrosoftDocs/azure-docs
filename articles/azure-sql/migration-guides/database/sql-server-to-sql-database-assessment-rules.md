---
title: "Assessment rules for SQL Server to SQL Database migration"
description: Assessment rules to identify issues with the source SQL Server instance that must be addressed before migrating to Azure SQL Database. 
ms.service: sql-database
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: MashaMSFT
ms.author: mathoma
ms.reviewer: MashaMSFT
ms.date: 12/15/2020
---
# Assessment rules for SQL Server to SQL Database migration
[!INCLUDE[appliesto--sqldb](../../includes/appliesto-sqldb.md)]

Migration tools validate your source SQL Server instance by running a number of assessment rules to identify issues that must be addressed before migrating your SQL Server database to Azure SQL Database. 

This article provides a list of the rules used to assess the feasibility of migrating your SQL Server database to Azure SQL Database. 

## Agent jobs

**Title: SQL Server Agent jobs are not available in Azure SQL Database**   
Rule ID:AgentJobs (Warning)  

**Description**   
SQL Server Agent is a Microsoft Windows service that executes scheduled administrative tasks, which are called jobs in SQL Server.

**Recommendation** 
Use elastic jobs (preview), which are the replacement for SQL Server Agent jobs in Azure SQL Database. Elastic Database jobs for Azure SQL Database allows you to reliably execute T-SQL scripts that span multiple databases while automatically retrying and providing eventual completion guarantees.  Alternatively consider migrating to  Azure SQL Managed Instance or SQL Server on Azure Virtual Machines.



## BulkInsert

**Title: BULK INSERT with non Azure blob data source is not supported in Azure SQL Database.**   
Rule ID: BulkInsert (Issue)

**Description**   
Azure SQL Database cannot access file shares or Windows folders. See the "Impacted Objects" section for the specific uses of BULK INSERT statements that do not reference an Azure blob. Objects with 'BULK INSERT' where the source is not Azure blob storage will not work after migrating to Azure SQL Database. 

**Recommendation**   
You will need to convert BULK INSERT statements that use local files or file shares to use files from Azure blob storage instead, when migrating to Azure SQL Database.

## ComputeClause

**Title: COMPUTE clause is discontinued and has been removed.**   
Rule ID: ComputeClause (Issue)

**Description**   
The COMPUTE clause generates totals that appear as additional summary columns at the end of the result set. However, this clause is no longer supported in Azure SQL Database. 

**Recommendation**   

The T-SQL module needs to be re-written using the ROLLUP operator instead. The code below demonstrates how COMPUTE can be replaced with ROLLUP : 

```sql 
USE AdventureWorks 
GO;  

SELECT SalesOrderID, UnitPrice, UnitPriceDiscount 
FROM Sales.SalesOrderDetail 
ORDER BY SalesOrderID COMPUTE SUM(UnitPrice), SUM(UnitPriceDiscount) BY SalesOrderID GO; 

SELECT SalesOrderID, UnitPrice, UnitPriceDiscount,SUM(UnitPrice) as UnitPrice , 
SUM(UnitPriceDiscount) as UnitPriceDiscount 
FROM Sales.SalesOrderDetail 
GROUP BY SalesOrderID, UnitPrice, UnitPriceDiscount WITH ROLLUP; 
```

## CDC

**Title: Change Data Capture (CDC) is not supported in Azure SQL Database**   
Rule ID: CDC (Issue)

**Description**   
needs to be rewritten. More information: [Enable Azure SQL change tracking](https://social.technet.microsoft.com/wiki/contents/articles/2976.azure-sql-how-to-enable-change-tracking.aspx)

**Recommendation**   
Change Data Capture (CDC) is not supported in Azure SQL Database. Evaluate if Change Tracking can be used instead or consider migrating to Azure SQL Managed Instance.


## ClrAssemblies

**Title: SQL CLR assemblies are not supported in Azure SQL Database**   
Rule ID: ClrAssemblies (Issue)

**Description**   
For security reasons, Azure SQL Database does not support SQL CLR assemblies. More information: []()  

**Recommendation**   
Currently, there is no way to achieve this in Azure SQL Database. The recommended alternative solutions will require application code and database changes to use only assemblies supported by Azure SQL Database or consider migrating to Azure SQL Managed Instance or SQL Server on Azure Virtual Machines.

## CryptographicProvider

**Title: A use of CREATE CRYPTOGRAPHIC PROVIDER or ALTER CRYPTOGRAPHIC PROVIDER was found, which is not supported in Azure SQL Database**   
Rule ID: CryptographicProvider (Issue)

**Description**   
 Azure SQL Database does not support CRYPTOGRAPHIC PROVIDER statements because it cannot access files. See the Impacted Objects section for the specific uses of CRYPTOGRAPHIC PROVIDER statements. Objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER' will not work correctly after migrating to Azure SQL Database. More information: []() 

**Recommendation**   
Review objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER'. In any such objects that are required, remove the uses of these features.

## CrossDataseReferences

**Title: Cross-database queries are not supported in Azure SQL Database**   
Rule ID: CrossDataseReferences (Issue)

**Description**   
Some selected databases on this server use cross-database queries, which are not supported in Azure SQL Database. More information: [Check Azure SQL Database elastic database query (Preview)](../../database/elastic-query-overview.md)

**Recommendation**   
Azure SQL Database does not support cross-database queries. The following actions are recommended: Consider migrating to Azure SQL Managed Instance, Consider migrating the dependent database(s) to Azure SQL Database and use 'Elastic Database Query' (preview) functionality to query across Azure SQL databases, Consider moving the dependent datasets from other databases into the database that is being migrated.

## DatabaseCompatibility

**Title: Azure SQL Database doesn't support compatibility levels below 100.**   
Rule ID: DatabaseCompatibility (Issue)

**Description**   
Azure SQL Database doesn't support compatibility levels below 100. More information: []() 

**Recommendation**   
Consider upgrading the database compatibility or migrating to SQL Server on Azure Virtual Machines.

## DatabaseMail

**Title: Database Mail is not supported in Azure SQL Database.**   
Rule ID: DatabaseMail (Warning)  

**Description**   
This server uses the Database Mail feature, which is not supported in Azure SQL Database.

**Recommendation**   
Consider migrating to Azure SQL Managed Instance that supports Database Mail  Alternatively, consider using Azure functions and Sendgrid to accomplish mail functionality on Azure SQL Database.


## DatabasePrincipalAlias

**Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.**   
Rule ID: DatabasePrincipalAlias (Issue)

**Description**   
SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Database. More information: []() 

**Recommendation**   
Use roles instead of aliases.


## DisableDefCNSTCHK

**Title: SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed.**   
Rule ID: DisableDefCNSTCHK  (Issue)

**Description**   
SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed in Azure SQL Database. More information: []() 

## FASTFIRSTROW

**Title: FASTFIRSTROW query hint is discontinued and has been removed.**   
Rule ID: FastFirstRowHint (Issue)

**Description**   
FASTFIRSTROW query hint is discontinued and has been removed in Azure SQL Database. More information: []() 

**Recommendation**   
Instead of FASTFIRSTROW query hint use OPTION (FAST n).


## FileStream

**Title: Filestream is not supported in Azure SQL Database**   
Rule ID: FileStream (Issue)

**Description**   
The Filestream feature, which allows you to store unstructured data such as text documents, images, and videos in NTFS file system, is not supported in Azure SQL Database. More information: [Streaming blobs to and from Azure SQL blog](https://azure.microsoft.com/en-us/blog/streaming-blobs-to-and-from-sql-azure/)

**Recommendation**   
Consider migrating to SQL Server on Azure Virtual machines or Upload the unstructured files to Azure Blob storage and store metadata related to these files (name, type, URL location, storage key etc.) in Azure SQL Database. You may have to re-engineer your application to enable streaming blobs to and from Azure SQL Database. 


## LinkedServer

**Title: Linked server functionality is not supported in Azure SQL Database**   
Rule ID: LinkedServer (Issue)

**Description**   
Linked servers enable the SQL Server Database Engine to execute commands against OLE DB data sources outside of the instance of SQL Server. 

**Recommendation**   
Azure SQL Database does not support linked server functionality. The following actions are recommended to eliminate the need for linked servers: 1. Identify the dependent datasets from remote SQL servers and consider moving these into the database being migrated. 2. Migrate the dependent database(s) to Azure and use 'Elastic Database Query' (preview) functionality to query across databases in Azure SQL Database. More information: [Check Azure SQL Database elastic query (Preview)](../../database/elastic-query-overview.md) 

## MSDTCTransactSQL

**Title: BEGIN DISTRIBUTED TRANSACTION is not supported in Azure SQL Database.**   
Rule ID: MSDTCTransactSQL (Issue)

**Description**   
 Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is not supported in Azure SQL Database. More information: []() 

**Recommendation**   
Review impacted objects section to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview).


## OpenRowsetWithNonBlobDataSourceBulk

**Title: OpenRowSet used in bulk operation with non blob data source is not supported in Azure SQL Database.**   
Rule ID: OpenRowsetWithNonBlobDataSourceBulk  (Issue)

**Description**   
This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.) 

**Recommendation**   
Azure SQL Database supports OPENROWSET only to import from Azure blob storage.

## OpenRowsetWithSQLAndNonSQLProvider

**Title: OpenRowSet with SQL or non SQL provider is not supported in Azure SQL Database.**   
Rule ID: OpenRowsetWithSQLAndNonSQLProvider  (Issue)

**Description**   
This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB. 

**Recommendation**   
Azure SQL Database supports OPENROWSET only to import from Azure blob storage.


## NonANSILeftOuterJoinSyntax

**Title: Non ANSI style left outer join is discontinued and has been removed.**   
Rule ID: NonANSILeftOuterJoinSyntax (Issue)

**Description**   
Non ANSI style left outer join is discontinued and has been removed in Azure SQL Database. More information: []()

**Recommendation**   
Use ANSI join syntax.


## NonANSIRightOuterJoinSyntax

**Title: Non ANSI style right outer join is discontinued and has been removed.**   
Rule ID: NonANSIRightOuterJoinSyntax (Issue)

**Description**   
Non ANSI style right outer join is discontinued and has been removed in Azure SQL Database. More information: []()

**Recommendation**   
Use ANSI join syntax.

## NextColumn 

**Title: Tables and Columns named NEXT will lead to an error In Azure SQL Database.**   
Rule ID: NextColumn (Issue)

**Description**   
Tables or columns named NEXT were detected. Sequences, introduced in Microsoft SQL Server, use the ANSI standard NEXT VALUE FOR function. If a table or a column is named NEXT and the column is aliased as VALUE, and if the ANSI standard AS is omitted, the resulting statement can cause an error. More information: []() 

**Recommendation**   
Rewrite statements to include the ANSI standard AS keyword when aliasing a table or column. For example, when a column is named NEXT and that column is aliased as VALUE, the query SELECT NEXT VALUE FROM TABLE will cause an error and should be rewritten as SELECT NEXT AS VALUE FROM TABLE. Similarly, when a table is named NEXT and that table is aliased as VALUE, the query SELECT Col1 FROM NEXT VALUE will cause an error and should be rewritten as SELECT Col1 FROM NEXT AS VALUE.

## RAISERROR

**Title: Legacy style RAISERROR calls should be replaced with modern equivalents.**   
Rule ID: RAISERROR (Issue)

**Description**   
RAISERROR calls like the below example are termed as legacy-style because they do not include the commas and the parenthesis.RAISERROR 50001 'this is a test'. This method of calling RAISERROR is discontinued and removed in Azure SQL Database. More information: []()

**Recommendation**   
Rewrite the statement using the current RAISERROR syntax, or evaluate if the modern approach of TRY...CATCH...THROW is feasible.

## ServerAudits 

**Title: Use Azure SQL Database audit features to replace Server Audits**   
Rule ID: ServerAudits (Warning)  

**Description**   
Auditing an instance of the SQL Server Database Engine or an individual database involves tracking and logging events that occur on the Database Engine. SQL Server audit lets you create server audits, which can contain server audit specifications for server level events, and database audit specifications for database level events.

**Recommendation**   
Consider Azure SQL Database audit features to replace Server Audits.  Azure SQL supports audit and the features are richer than SQL Server. Azure SQL can audit various database actions and events, including: Access to data, Schema changes (DDL), Data changes (DML), Accounts, roles, and permissions (DCL, Security exceptions. SQL Database Auditing increases an organization's ability to gain deep insight into events and changes that occur within their SQL database, including updates and queries against the data.    

## ServerCredentials

**Title: Server scoped credential is not supported in Azure SQL Database**   
Rule ID: ServerCredentials (Warning)  

**Description**   
A credential is a record that contains the authentication information (credentials) required to connect to a resource outside SQL Server. Azure SQL Database supports database credentials, but not the ones created at the SQL Server scope.   

**Recommendation**   
Azure SQL Database supports database scoped credentials. Convert server scoped credentials to database scoped credentials.

## ServiceBroker

**Title: Service Broker feature is not supported in Azure SQL Database**   
Rule ID: ServiceBroker (Issue)

**Description**   
SQL Server Service Broker provides native support for messaging and queuing applications in the SQL Server Database Engine. 

**Recommendation**   
Service Broker feature is not supported in Azure SQL Database. Consider migrating to Azure SQL Managed Instance that supports service broker within the same instance.  

## ServerScopedTriggers

**Title: Server-scoped trigger is not supported in Azure SQL Database**   
Rule ID: ServerScopedTriggers (Warning)  

**Description**   
A trigger is a special kind of stored procedure that executes in response to certain action on a table like insertion, deletion or updating of data. Server-scoped triggers are not supported in Azure SQL Database. Azure does not support the following options for triggers:FOR LOGON, ENCRYPTION, WITH APPEND, NOT FOR REPLICATION, EXTERNAL NAME option (there is no external method support), ALL SERVER Option (DDL Trigger), Trigger on a LOGON event (Logon Trigger), Azure does not support CLR-triggers.

**Recommendation**   
Consider Azure SQL Managed Instance that supports server scoped triggers. Alternatively, if you already have a VM running in Azure, you can implement the trigger logic to be run using the machine's task scheduler.

## SQLDBDatabaseSize

**Title: Azure SQL Database does not support database size greater than 100 TB.**   
Rule ID: SQLDBDatabaseSize (Issue)

**Description**   
The size of the database is greater than the maximum supported size of 100 TB. More information: [vCore resource limits](../../database/resource-limits-vcore-single-databases.md) 

**Recommendation**   
Evaluate if the data can be archived or compressed or sharded into multiple database(s).

## SqlMail

**Title: SQL Mail has been discontinued.**   
Rule ID: SqlMail (Warning)  

**Description**   
SQL Mail has been discontinued and removed in Azure SQL Database.

**Recommendation**   
Consider migrating to Azure SQL Managed Instance or SQL Server on Azure Virtual Machines and use Database Mail.

## SystemProcedures110

**Title: Detected statements that reference removed system stored procedures that are not available in Azure SQL Database.**   
Rule ID: (Warning) 

**Description**   
Following unsupported system and extended stored procedures cannot be used in Azure SQL database - sp_dboption, sp_addserver, sp_dropalias,sp_activedirectory_obj, sp_activedirectory_scp,sp_activedirectory_start.

**Recommendation**    
Remove references to unsupported system procedures that have been removed in Azure SQL Database.

## TraceFlags

**Title: Azure SQL Database does not support trace flags**   
Rule ID: TraceFlags (Warning)  

**Description**   
Trace flags are used to temporarily set specific server characteristics or to switch off a particular behavior.  Trace flags are frequently used to diagnose performance issues or to debug stored procedures or complex computer systems

**Recommendation**   
Choose the right SQL Database service tiers and performance level for single databases and elastic pool databases that match your workloads

## WindowsAuthentication

**Title: Database users mapped with Windows authentication (integrated security) is not supported in Azure SQL Database.**   
Rule ID: WindowsAuthentication (Warning)  

**Description**   
Azure SQL Database  supports two types of authentication: 
- SQL Authentication, which uses a username and password 
- Azure Active Directory Authentication, which uses identities managed by Azure Active Directory and is supported for managed and integrated domains.

**Recommendation**   
Federate the local Active Directory with Azure Active Directory. The Windows identity can then be replaced with the equivalent Azure Active Directory identities.

## XpCmdshell

**Title: xp_cmdshell is not supported in Azure SQL Database.**   
Rule ID: XpCmdshell (Issue)

**Description**   
needs to be rewritten 

**Recommendation**   
Review impacted objects section to see all objects using xp_cmdshell and evaluate if the reference to xp_cmdshell or the impacted object can be removed. Also consider exploring Azure Automation that delivers cloud based automation and configuration service. 

## Next steps

To start migrating your SQL Server to Azure SQL Database, see the [SQL Server to SQL Database migration guide](sql-server-to-sql-database-guide.md).

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about SQL Database see:
   - [Overview of Azure SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 

- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).