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

## Table 1

|Rule ID  |Description  |Recommendation  |
|---------|---------|---------|
|**SQLDBDatabaseSize** | **Title: Azure SQL Database does not support database size greater than 100 TB.** </br></br> The size of the database is greater than the maximum supported size of 100 TB. More information: [vCore resource limits](../../database/resource-limits-vcore-single-databases.md) | Evaluate if the data can be archived or compressed or sharded into multiple database(s).|
|XpCmdshell|**Title: xp_cmdshell is not supported in Azure SQL Database.** </br></br> needs to be rewritten  | Review impacted objects section to see all objects using xp_cmdshell and evaluate if the reference to xp_cmdshell or the impacted object can be removed.Also consider exploring Azure Automation that delivers cloud based automation and configuration service.  |
|**CDC**|**Title: Change Data Capture (CDC) is not supported in Azure SQL Database** </br></br> needs to be rewritten. More information: [Enable Azure SQL change tracking](https://social.technet.microsoft.com/wiki/contents/articles/2976.azure-sql-how-to-enable-change-tracking.aspx)  |Change Data Capture (CDC) is not supported in Azure SQL Database. Evaluate if Change Tracking can be used instead or consider migrating to Azure SQL Managed Instance.|
|**CrossDataseReferences**|**Title: Cross-database queries are not supported in Azure SQL Database** </br></br> Some selected databases on this server use cross-database queries, which are not supported in Azure SQL Database. More information: [Check Azure SQL Database elastic database query (Preview)](../../database/elastic-query-overview.md)  |Azure SQL Database does not support cross-database queries. The following actions are recommended: Consider migrating to Azure SQL Managed Instance, Consider migrating the dependent database(s) to Azure SQL Database and use 'Elastic Database Query' (preview) functionality to query across Azure SQL databases, Consider moving the dependent datasets from other databases into the database that is being migrated.|
|**FileStream**|**Title: Filestream is not supported in Azure SQL Database** </br></br> The Filestream feature, which allows you to store unstructured data such as text documents, images, and videos in NTFS file system, is not supported in Azure SQL Database. More information: [Streaming blobs to and from Azure SQL blog](https://azure.microsoft.com/en-us/blog/streaming-blobs-to-and-from-sql-azure/)  | Consider migrating to SQL Server on Azure Virtual machines or Upload the unstructured files to Azure Blob storage and store metadata related to these files (name, type, URL location, storage key etc.) in Azure SQL Database. You may have to re-engineer your application to enable streaming blobs to and from Azure SQL Database.    |
|**LinkedServer**|**Title: Linked server functionality is not supported in Azure SQL Database** </br></br> More information: [Check Azure SQL Database elastic query (Preview)](../../database/elastic-query-overview.md)  |Azure SQL Database does not support linked server functionality. The following actions are recommended to eliminate the need for linked servers: 1. Identify the dependent datasets from remote SQL servers and consider moving these into the database being migrated. 2. Migrate the dependent database(s) to Azure and use 'Elastic Database Query' (preview) functionality to query across databases in Azure SQL Database. |
|**ServiceBroker**|**Title: Service Broker feature is not supported in Azure SQL Database** </br></br> SQL Server Service Broker provides native support for messaging and queuing applications in the SQL Server Database Engine.   |Service Broker feature is not supported in Azure SQL Database. Consider migrating to Azure SQL Managed Instance that supports service broker within the same instance.  |
|**OpenRowsetWithNonBlobDataSourceBulk**|**Title: OpenRowSet used in bulk operation with non blob data source is not supported in Azure SQL Database.** </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.)  | Azure SQL Database supports OPENROWSET only to import from Azure blob storage.|
|**OpenRowsetWithSQLAndNonSQLProvider**| **Title: OpenRowSet with SQL or non SQL provider is not supported in Azure SQL Database.** </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.  | Azure SQL Database supports OPENROWSET only to import from Azure blob storage. |
|**ClrAssemblies**|**Title: SQL CLR assemblies are not supported in Azure SQL Database** </br></br> For security reasons, Azure SQL Database does not support SQL CLR assemblies. More information: []()  |Currently, there is no way to achieve this in Azure SQL Database. The recommended alternative solutions will require application code and database changes to use only assemblies supported by Azure SQL Database or consider migrating to Azure SQL Managed Instance or SQL Server on Azure Virtual Machines.|
|**BulkInsert**|**Title: BULK INSERT with non Azure blob data source is not supported in Azure SQL Database.** </br></br> Azure SQL Database cannot access file shares or Windows folders. See the "Impacted Objects" section for the specific uses of BULK INSERT statements that do not reference an Azure blob. Objects with 'BULK INSERT' where the source is not Azure blob storage will not work after migrating to Azure SQL Database. More information: []()  |You will need to convert BULK INSERT statements that use local files or file shares to use files from Azure blob storage instead, when migrating to Azure SQL Database.|
|**CryptographicProvider**|**Title: A use of CREATE CRYPTOGRAPHIC PROVIDER or ALTER CRYPTOGRAPHIC PROVIDER was found, which is not supported in Azure SQL Database** </br></br> Azure SQL Database does not support CRYPTOGRAPHIC PROVIDER statements because it cannot access files. See the Impacted Objects section for the specific uses of CRYPTOGRAPHIC PROVIDER statements. Objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER' will not work correctly after migrating to Azure SQL Database. More information: []()  | Review objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER'. In any such objects that are required, remove the uses of these features.|
|**MSDTCTransactSQL**|**Title: BEGIN DISTRIBUTED TRANSACTION is not supported in Azure SQL Database.** </br></br> Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is not supported in Azure SQL Database. More information: []()  |Review impacted objects section to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview).|
|**ComputeClause**|**Title: COMPUTE clause is discontinued and has been removed.** </br></br> The COMPUTE clause generates totals that appear as additional summary columns at the end of the result set. However, this clause is no longer supported in Azure SQL Database. More information: []()  |The T-SQL module needs to be re-written using the ROLLUP operator instead. The code below demonstrates how COMPUTE can be replaced with ROLLUP : ```sql USE AdventureWorks GO;  SELECT SalesOrderID, UnitPrice, UnitPriceDiscount FROM Sales.SalesOrderDetail ORDER BY SalesOrderID COMPUTE SUM(UnitPrice), SUM(UnitPriceDiscount) BY SalesOrderID GO; SELECT SalesOrderID, UnitPrice, UnitPriceDiscount,SUM(UnitPrice) as UnitPrice , SUM(UnitPriceDiscount) as UnitPriceDiscount FROM Sales.SalesOrderDetail GROUP BY SalesOrderID, UnitPrice, UnitPriceDiscount WITH ROLLUP; ```|
|**DatabasePrincipalAlias**|**Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.** </br></br> SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Database. More information: []()  | Use roles instead of aliases.|
|**DisableDefCNSTCHK**|**Title: SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed.** </br></br> SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed in Azure SQL Database. More information: []()  |         |
|**FastFirstRowHint**|**Title: FASTFIRSTROW query hint is discontinued and has been removed.** </br></br> FASTFIRSTROW query hint is discontinued and has been removed in Azure SQL Database. More information: []()  |Instead of FASTFIRSTROW query hint use OPTION (FAST n).|
|**NextColumn**|**Title: Tables and Columns named NEXT will lead to an error In Azure SQL Database.** </br></br> Tables or columns named NEXT were detected. Sequences, introduced in Microsoft SQL Server, use the ANSI standard NEXT VALUE FOR function. If a table or a column is named NEXT and the column is aliased as VALUE, and if the ANSI standard AS is omitted, the resulting statement can cause an error. More information: []()  |Rewrite statements to include the ANSI standard AS keyword when aliasing a table or column. For example, when a column is named NEXT and that column is aliased as VALUE, the query SELECT NEXT VALUE FROM TABLE will cause an error and should be rewritten as SELECT NEXT AS VALUE FROM TABLE. Similarly, when a table is named NEXT and that table is aliased as VALUE, the query SELECT Col1 FROM NEXT VALUE will cause an error and should be rewritten as SELECT Col1 FROM NEXT AS VALUE.|
|**NonANSILeftOuterJoinSyntax**|**Title: Non ANSI style left outer join is discontinued and has been removed.** </br></br> Non ANSI style left outer join is discontinued and has been removed in Azure SQL Database. More information: []()  |Use ANSI join syntax.|
|**NonANSIRightOuterJoinSyntax**|**Title: Non ANSI style right outer join is discontinued and has been removed.** </br></br> Non ANSI style right outer join is discontinued and has been removed in Azure SQL Database. More information: []()  | Use ANSI join syntax.|
|**RAISERROR**|**Title: Legacy style RAISERROR calls should be replaced with modern equivalents.** </br></br> RAISERROR calls like the below example are termed as legacy-style because they do not include the commas and the parenthesis.RAISERROR 50001 'this is a test'. This method of calling RAISERROR is discontinued and removed in Azure SQL Database. More information: []()  |Rewrite the statement using the current RAISERROR syntax, or evaluate if the modern approach of TRY...CATCH...THROW is feasible.|
|**DatabaseCompatibility**|**Title: Azure SQL Database doesn't support compatibility levels below 100.** </br></br> Azure SQL Database doesn't support compatibility levels below 100. More information: []()  |Consider upgrading the database compatibility or migrating to SQL Server on Azure Virtual Machines.|

## Table 2

|Description  |Recommendation  |
|---------|---------|---------|
| **Title: Azure SQL Database does not support database size greater than 100 TB.** </br>Rule ID: SQLDBDatabaseSize  </br></br> The size of the database is greater than the maximum supported size of 100 TB. More information: [vCore resource limits](../../database/resource-limits-vcore-single-databases.md) | Evaluate if the data can be archived or compressed or sharded into multiple database(s).|
|**Title: xp_cmdshell is not supported in Azure SQL Database.** </br>Rule ID: XpCmdshell </br></br> needs to be rewritten  | Review impacted objects section to see all objects using xp_cmdshell and evaluate if the reference to xp_cmdshell or the impacted object can be removed. Also consider exploring Azure Automation that delivers cloud based automation and configuration service.  |
|**Title: Change Data Capture (CDC) is not supported in Azure SQL Database** </br>Rule ID: CDC</br></br> needs to be rewritten. More information: [Enable Azure SQL change tracking](https://social.technet.microsoft.com/wiki/contents/articles/2976.azure-sql-how-to-enable-change-tracking.aspx)  |Change Data Capture (CDC) is not supported in Azure SQL Database. Evaluate if Change Tracking can be used instead or consider migrating to Azure SQL Managed Instance.|
|**Title: Cross-database queries are not supported in Azure SQL Database** </br>Rule ID: CrossDataseReferences</br></br> Some selected databases on this server use cross-database queries, which are not supported in Azure SQL Database. More information: [Check Azure SQL Database elastic database query (Preview)](../../database/elastic-query-overview.md)  |Azure SQL Database does not support cross-database queries. The following actions are recommended: Consider migrating to Azure SQL Managed Instance, Consider migrating the dependent database(s) to Azure SQL Database and use 'Elastic Database Query' (preview) functionality to query across Azure SQL databases, Consider moving the dependent datasets from other databases into the database that is being migrated.|
|**Title: Filestream is not supported in Azure SQL Database** </br>Rule ID: FileStream</br></br> The Filestream feature, which allows you to store unstructured data such as text documents, images, and videos in NTFS file system, is not supported in Azure SQL Database. More information: [Streaming blobs to and from Azure SQL blog](https://azure.microsoft.com/en-us/blog/streaming-blobs-to-and-from-sql-azure/)  | Consider migrating to SQL Server on Azure Virtual machines or Upload the unstructured files to Azure Blob storage and store metadata related to these files (name, type, URL location, storage key etc.) in Azure SQL Database. You may have to re-engineer your application to enable streaming blobs to and from Azure SQL Database.    |
|**Title: Linked server functionality is not supported in Azure SQL Database** </br>Rule ID: LinkedServer</br></br> More information: [Check Azure SQL Database elastic query (Preview)](../../database/elastic-query-overview.md)  |Azure SQL Database does not support linked server functionality. The following actions are recommended to eliminate the need for linked servers: 1. Identify the dependent datasets from remote SQL servers and consider moving these into the database being migrated. 2. Migrate the dependent database(s) to Azure and use 'Elastic Database Query' (preview) functionality to query across databases in Azure SQL Database. |
|**Title: Service Broker feature is not supported in Azure SQL Database** </br>Rule ID: ServiceBroker</br></br> SQL Server Service Broker provides native support for messaging and queuing applications in the SQL Server Database Engine.   |Service Broker feature is not supported in Azure SQL Database. Consider migrating to Azure SQL Managed Instance that supports service broker within the same instance.  |
|**Title: OpenRowSet used in bulk operation with non blob data source is not supported in Azure SQL Database.** </br>Rule ID: OpenRowsetWithNonBlobDataSourceBulk </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.)  | Azure SQL Database supports OPENROWSET only to import from Azure blob storage.|
| **Title: OpenRowSet with SQL or non SQL provider is not supported in Azure SQL Database.** </br>Rule ID: OpenRowsetWithSQLAndNonSQLProvider </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.  | Azure SQL Database supports OPENROWSET only to import from Azure blob storage. |
|**Title: SQL CLR assemblies are not supported in Azure SQL Database** </br>Rule ID: ClrAssemblies </br></br> For security reasons, Azure SQL Database does not support SQL CLR assemblies. More information: []()  |Currently, there is no way to achieve this in Azure SQL Database. The recommended alternative solutions will require application code and database changes to use only assemblies supported by Azure SQL Database or consider migrating to Azure SQL Managed Instance or SQL Server on Azure Virtual Machines.|
|**Title: BULK INSERT with non Azure blob data source is not supported in Azure SQL Database.** </br>Rule ID: BulkInsert </br></br> Azure SQL Database cannot access file shares or Windows folders. See the "Impacted Objects" section for the specific uses of BULK INSERT statements that do not reference an Azure blob. Objects with 'BULK INSERT' where the source is not Azure blob storage will not work after migrating to Azure SQL Database. More information: []()  |You will need to convert BULK INSERT statements that use local files or file shares to use files from Azure blob storage instead, when migrating to Azure SQL Database.|
|**Title: A use of CREATE CRYPTOGRAPHIC PROVIDER or ALTER CRYPTOGRAPHIC PROVIDER was found, which is not supported in Azure SQL Database** </br>Rule ID: CryptographicProvider </br></br> Azure SQL Database does not support CRYPTOGRAPHIC PROVIDER statements because it cannot access files. See the Impacted Objects section for the specific uses of CRYPTOGRAPHIC PROVIDER statements. Objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER' will not work correctly after migrating to Azure SQL Database. More information: []()  | Review objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER'. In any such objects that are required, remove the uses of these features.|
|**Title: BEGIN DISTRIBUTED TRANSACTION is not supported in Azure SQL Database.** </br>Rule ID: MSDTCTransactSQL</br></br> Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is not supported in Azure SQL Database. More information: []()  |Review impacted objects section to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview).|
|**Title: COMPUTE clause is discontinued and has been removed.** </br>Rule ID: ComputeClause</br></br> The COMPUTE clause generates totals that appear as additional summary columns at the end of the result set. However, this clause is no longer supported in Azure SQL Database. More information: []()  |The T-SQL module needs to be re-written using the ROLLUP operator instead. The code below demonstrates how COMPUTE can be replaced with ROLLUP : ```sql USE AdventureWorks GO;  SELECT SalesOrderID, UnitPrice, UnitPriceDiscount FROM Sales.SalesOrderDetail ORDER BY SalesOrderID COMPUTE SUM(UnitPrice), SUM(UnitPriceDiscount) BY SalesOrderID GO; SELECT SalesOrderID, UnitPrice, UnitPriceDiscount,SUM(UnitPrice) as UnitPrice , SUM(UnitPriceDiscount) as UnitPriceDiscount FROM Sales.SalesOrderDetail GROUP BY SalesOrderID, UnitPrice, UnitPriceDiscount WITH ROLLUP; ```|
|**Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.** </br>Rule ID: DatabasePrincipalAlias</br></br> SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Database. More information: []()  | Use roles instead of aliases.|
|**Title: SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed.** </br>Rule ID: DisableDefCNSTCHK </br></br> SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed in Azure SQL Database. More information: []()  |         |
|**Title: FASTFIRSTROW query hint is discontinued and has been removed.** </br>Rule ID: FastFirstRowHint</br></br> FASTFIRSTROW query hint is discontinued and has been removed in Azure SQL Database. More information: []()  |Instead of FASTFIRSTROW query hint use OPTION (FAST n).|
|**Title: Tables and Columns named NEXT will lead to an error In Azure SQL Database.** </br>Rule ID: NextColumn</br></br> Tables or columns named NEXT were detected. Sequences, introduced in Microsoft SQL Server, use the ANSI standard NEXT VALUE FOR function. If a table or a column is named NEXT and the column is aliased as VALUE, and if the ANSI standard AS is omitted, the resulting statement can cause an error. More information: []()  |Rewrite statements to include the ANSI standard AS keyword when aliasing a table or column. For example, when a column is named NEXT and that column is aliased as VALUE, the query SELECT NEXT VALUE FROM TABLE will cause an error and should be rewritten as SELECT NEXT AS VALUE FROM TABLE. Similarly, when a table is named NEXT and that table is aliased as VALUE, the query SELECT Col1 FROM NEXT VALUE will cause an error and should be rewritten as SELECT Col1 FROM NEXT AS VALUE.|
|**Title: Non ANSI style left outer join is discontinued and has been removed.** </br>Rule ID: NonANSILeftOuterJoinSyntax</br></br> Non ANSI style left outer join is discontinued and has been removed in Azure SQL Database. More information: []()  |Use ANSI join syntax.|
|**Title: Non ANSI style right outer join is discontinued and has been removed.** </br>Rule ID: NonANSIRightOuterJoinSyntax</br></br> Non ANSI style right outer join is discontinued and has been removed in Azure SQL Database. More information: []()  | Use ANSI join syntax.|
|**Title: Legacy style RAISERROR calls should be replaced with modern equivalents.** </br>Rule ID: RAISERROR</br></br> RAISERROR calls like the below example are termed as legacy-style because they do not include the commas and the parenthesis.RAISERROR 50001 'this is a test'. This method of calling RAISERROR is discontinued and removed in Azure SQL Database. More information: []()  |Rewrite the statement using the current RAISERROR syntax, or evaluate if the modern approach of TRY...CATCH...THROW is feasible.|
|**Title: Azure SQL Database doesn't support compatibility levels below 100.** </br>Rule ID: DatabaseCompatibility</br></br> Azure SQL Database doesn't support compatibility levels below 100. More information: []()  |Consider upgrading the database compatibility or migrating to SQL Server on Azure Virtual Machines.|


## Table 3

:::row:::
   :::column span="":::
     Description
   :::column-end:::
   :::column span="":::
      Recommendation
   :::column-end:::
:::row-end:::

:::row:::
   :::column span="":::
      **Title: Azure SQL Database does not support database size greater than 100 TB.** </br>Rule ID: SQLDBDatabaseSize  </br></br> The size of the database is greater than the maximum supported size of 100 TB. More information: [vCore resource limits](../../database/resource-limits-vcore-single-databases.md)
   :::column-end:::
   :::column span="":::
      Evaluate if the data can be archived or compressed or sharded into multiple database(s).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: xp_cmdshell is not supported in Azure SQL Database.** </br>Rule ID: XpCmdshell </br></br> needs to be rewritten 
   :::column-end:::
   :::column span="":::
      Review impacted objects section to see all objects using xp_cmdshell and evaluate if the reference to xp_cmdshell or the impacted object can be removed. Also consider exploring Azure Automation that delivers cloud based automation and configuration service.  
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Change Data Capture (CDC) is not supported in Azure SQL Database** </br>Rule ID: CDC</br></br> needs to be rewritten. More information: [Enable Azure SQL change tracking](https://social.technet.microsoft.com/wiki/contents/articles/2976.azure-sql-how-to-enable-change-tracking.aspx) 
   :::column-end:::
   :::column span="":::
      Change Data Capture (CDC) is not supported in Azure SQL Database. Evaluate if Change Tracking can be used instead or consider migrating to Azure SQL Managed Instance.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Cross-database queries are not supported in Azure SQL Database** </br>Rule ID: CrossDataseReferences</br></br> Some selected databases on this server use cross-database queries, which are not supported in Azure SQL Database. More information: [Check Azure SQL Database elastic database query (Preview)](../../database/elastic-query-overview.md)  
   :::column-end:::
   :::column span="":::
      Azure SQL Database does not support cross-database queries. The following actions are recommended: Consider migrating to Azure SQL Managed Instance, Consider migrating the dependent database(s) to Azure SQL Database and use 'Elastic Database Query' (preview) functionality to query across Azure SQL databases, Consider moving the dependent datasets from other databases into the database that is being migrated.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Filestream is not supported in Azure SQL Database** </br>Rule ID: FileStream</br></br> The Filestream feature, which allows you to store unstructured data such as text documents, images, and videos in NTFS file system, is not supported in Azure SQL Database. More information: [Streaming blobs to and from Azure SQL blog](https://azure.microsoft.com/en-us/blog/streaming-blobs-to-and-from-sql-azure/) 
   :::column-end:::
   :::column span="":::
       Consider migrating to SQL Server on Azure Virtual machines or Upload the unstructured files to Azure Blob storage and store metadata related to these files (name, type, URL location, storage key etc.) in Azure SQL Database. You may have to re-engineer your application to enable streaming blobs to and from Azure SQL Database.   
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: Linked server functionality is not supported in Azure SQL Database** </br>Rule ID: LinkedServer</br></br> More information: [Check Azure SQL Database elastic query (Preview)](../../database/elastic-query-overview.md)  
   :::column-end:::
   :::column span="":::
      Azure SQL Database does not support linked server functionality. The following actions are recommended to eliminate the need for linked servers: 1. Identify the dependent datasets from remote SQL servers and consider moving these into the database being migrated. 2. Migrate the dependent database(s) to Azure and use 'Elastic Database Query' (preview) functionality to query across databases in Azure SQL Database.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Service Broker feature is not supported in Azure SQL Database** </br>Rule ID: ServiceBroker</br></br> SQL Server Service Broker provides native support for messaging and queuing applications in the SQL Server Database Engine.  
   :::column-end:::
   :::column span="":::
     Service Broker feature is not supported in Azure SQL Database. Consider migrating to Azure SQL Managed Instance that supports service broker within the same instance.  
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: OpenRowSet used in bulk operation with non blob data source is not supported in Azure SQL Database.** </br>Rule ID: OpenRowsetWithNonBlobDataSourceBulk </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.)  
   :::column-end:::
   :::column span="":::
     Azure SQL Database supports OPENROWSET only to import from Azure blob storage.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: OpenRowSet with SQL or non SQL provider is not supported in Azure SQL Database.** </br>Rule ID: OpenRowsetWithSQLAndNonSQLProvider </br></br> This method is an alternative to accessing tables in a linked server and is a one-time, ad hoc method of connecting and accessing remote data by using OLE DB.  
   :::column-end:::
   :::column span="":::
     Azure SQL Database supports OPENROWSET only to import from Azure blob storage.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
   *Title: SQL CLR assemblies are not supported in Azure SQL Database** </br>Rule ID: ClrAssemblies </br></br> For security reasons, Azure SQL Database does not support SQL CLR assemblies. More information: []() 
   :::column-end:::
   :::column span="":::
     Currently, there is no way to achieve this in Azure SQL Database. The recommended alternative solutions will require application code and database changes to use only assemblies supported by Azure SQL Database or consider migrating to Azure SQL Managed Instance or SQL Server on Azure Virtual Machines.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: BULK INSERT with non Azure blob data source is not supported in Azure SQL Database.** </br>Rule ID: BulkInsert </br></br> Azure SQL Database cannot access file shares or Windows folders. See the "Impacted Objects" section for the specific uses of BULK INSERT statements that do not reference an Azure blob. Objects with 'BULK INSERT' where the source is not Azure blob storage will not work after migrating to Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
      You will need to convert BULK INSERT statements that use local files or file shares to use files from Azure blob storage instead, when migrating to Azure SQL Database.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: A use of CREATE CRYPTOGRAPHIC PROVIDER or ALTER CRYPTOGRAPHIC PROVIDER was found, which is not supported in Azure SQL Database** </br>Rule ID: CryptographicProvider </br></br> Azure SQL Database does not support CRYPTOGRAPHIC PROVIDER statements because it cannot access files. See the Impacted Objects section for the specific uses of CRYPTOGRAPHIC PROVIDER statements. Objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER' will not work correctly after migrating to Azure SQL Database. More information: []()  |
   :::column-end:::
   :::column span="":::
     Review objects with 'CREATE CRYPTOGRAPHIC PROVIDER' or 'ALTER CRYPTOGRAPHIC PROVIDER'. In any such objects that are required, remove the uses of these features.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: BEGIN DISTRIBUTED TRANSACTION is not supported in Azure SQL Database.** </br>Rule ID: MSDTCTransactSQL</br></br> Distributed transaction started by Transact SQL BEGIN DISTRIBUTED TRANSACTION and managed by Microsoft Distributed Transaction Coordinator (MS DTC) is not supported in Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
      Review impacted objects section to see all objects using BEGIN DISTRUBUTED TRANSACTION. Consider migrating the participant databases to Azure SQL Managed Instance where distributed transactions across multiple instances are supported (Currently in preview).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: COMPUTE clause is discontinued and has been removed.** </br>Rule ID: ComputeClause</br></br> The COMPUTE clause generates totals that appear as additional summary columns at the end of the result set. However, this clause is no longer supported in Azure SQL Database. More information: []() 
   :::column span="":::
      The T-SQL module needs to be re-written using the ROLLUP operator instead. The code below demonstrates how COMPUTE can be replaced with ROLLUP : ```sql USE AdventureWorks GO;  SELECT SalesOrderID, UnitPrice, UnitPriceDiscount FROM Sales.SalesOrderDetail ORDER BY SalesOrderID COMPUTE SUM(UnitPrice), SUM(UnitPriceDiscount) BY SalesOrderID GO; SELECT SalesOrderID, UnitPrice, UnitPriceDiscount,SUM(UnitPrice) as UnitPrice , SUM(UnitPriceDiscount) as UnitPriceDiscount FROM Sales.SalesOrderDetail GROUP BY SalesOrderID, UnitPrice, UnitPriceDiscount WITH ROLLUP; ```
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.** </br>Rule ID: DatabasePrincipalAlias</br></br> SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Database. More information: []()  
   :::column-end:::
   :::column span="":::
      Use roles instead of aliases.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed.** </br>Rule ID: DatabasePrincipalAlias</br></br> SYS.DATABASE_PRINCIPAL_ALIASES is discontinued and has been removed in Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed.** </br>Rule ID: DisableDefCNSTCHK </br></br> SET option DISABLE_DEF_CNST_CHK is  discontinued and has been removed in Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
    
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: FASTFIRSTROW query hint is discontinued and has been removed.** </br>Rule ID: FastFirstRowHint</br></br> FASTFIRSTROW query hint is discontinued and has been removed in Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
      Instead of FASTFIRSTROW query hint use OPTION (FAST n).
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
   **Title: Tables and Columns named NEXT will lead to an error In Azure SQL Database.** </br>Rule ID: NextColumn</br></br> Tables or columns named NEXT were detected. Sequences, introduced in Microsoft SQL Server, use the ANSI standard NEXT VALUE FOR function. If a table or a column is named NEXT and the column is aliased as VALUE, and if the ANSI standard AS is omitted, the resulting statement can cause an error. More information: []() 
   :::column-end:::
   :::column span="":::
      Rewrite statements to include the ANSI standard AS keyword when aliasing a table or column. For example, when a column is named NEXT and that column is aliased as VALUE, the query SELECT NEXT VALUE FROM TABLE will cause an error and should be rewritten as SELECT NEXT AS VALUE FROM TABLE. Similarly, when a table is named NEXT and that table is aliased as VALUE, the query SELECT Col1 FROM NEXT VALUE will cause an error and should be rewritten as SELECT Col1 FROM NEXT AS VALUE.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Non ANSI style left outer join is discontinued and has been removed.** </br>Rule ID: NonANSILeftOuterJoinSyntax</br></br> Non ANSI style left outer join is discontinued and has been removed in Azure SQL Database. More information: []() )
   :::column-end:::
   :::column span="":::
      Use ANSI join syntax.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Non ANSI style right outer join is discontinued and has been removed.** </br>Rule ID: NonANSIRightOuterJoinSyntax</br></br> Non ANSI style right outer join is discontinued and has been removed in Azure SQL Database. More information: []()  
   :::column-end:::
   :::column span="":::
    Use ANSI join syntax.|
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     **Title: Legacy style RAISERROR calls should be replaced with modern equivalents.** </br>Rule ID: RAISERROR</br></br> RAISERROR calls like the below example are termed as legacy-style because they do not include the commas and the parenthesis.RAISERROR 50001 'this is a test'. This method of calling RAISERROR is discontinued and removed in Azure SQL Database. More information: []() 
   :::column-end:::
   :::column span="":::
      Rewrite the statement using the current RAISERROR syntax, or evaluate if the modern approach of TRY...CATCH...THROW is feasible.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    **Title: Azure SQL Database doesn't support compatibility levels below 100.** </br>Rule ID: DatabaseCompatibility</br></br> Azure SQL Database doesn't support compatibility levels below 100. More information: []()  
   :::column-end:::
   :::column span="":::
      Consider upgrading the database compatibility or migrating to SQL Server on Azure Virtual Machines.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     Description
   :::column-end:::
   :::column span="":::
      Recommendation
   :::column-end:::
:::row-end:::








|Rule ID  |Description  |Recommendation  |
|---------|---------|---------|
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |
|**Row2**|**Title: ** </br></br> More information: []()  |         |





## Warnings

## Next steps

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