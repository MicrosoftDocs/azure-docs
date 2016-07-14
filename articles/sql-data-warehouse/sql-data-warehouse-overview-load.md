   <properties
   pageTitle="Load data into Azure SQL Data Warehouse | Microsoft Azure"
   description="Learn the common scenarios for data loading into SQL Data Warehouse. These include using PolyBase, Azure blob storage, flat files, and disk shipping. You can also use third-party tools."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/12/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Load data into Azure SQL Data Warehouse

A summary of the scenario options and recommendations for loading data into SQL Data Warehouse.

The hardest part of loading data is usually preparing the data for the load. Azure simplifies loading by using Azure blob storage as a common data store for many of the services, and using Azure Data Factory to orchestrate communication and data movement between the Azure services. These processes are integrated with PolyBase technology which uses massively parallel processing (MPP) to load data in parallel from Azure blob storage into SQL Data Warehouse. 

For tutorials that load sample databases, see [Load sample databases][].

## Load from Azure blob storage
The fastest way to import data into SQL Data Warehouse is to use PolyBase to load data from Azure blob storage. PolyBase uses SQL Data Warehouse's massively parallel processing (MPP) design to load data in parallel from Azure blob storage. To use PolyBase, you can use T-SQL commands or an Azure Data Factory pipeline.

### 1. Use PolyBase and T-SQL

Summary of loading process:

2. Format your data as UTF-8 since PolyBase does not currently support UTF-16.
2. Move your data to Azure blob storage and store it in text files.
3. Configure external objects in SQL Data Warehouse to define the location and format of the data
4. Run a T-SQL command to load the data in parallel into a new database table.

<!-- 5. Schedule and run a loading job. --> 

For a tutorial, see [Load data from Azure blob storage to SQL Data Warehouse (PolyBase)][].

### 2. Use Azure Data Factory

For a simpler way to use PolyBase, you can create an Azure Data Factory pipeline that uses PolyBase to load data from Azure blob storage into SQL Data Warehouse. This is fast to configure since you don't need to define the T-SQL objects. If you need to query the external data without importing it, use T-SQL. 

Summary of loading process:

2. Format your data as UTF-8 since PolyBase does not currently support UTF-16.
2. Move your data to Azure blob storage and store it in text files.
3. Create an Azure Data Factory pipeline to ingest the data. Use the PolyBase option.
4. Schedule and run the pipeline.

For a tutorial, see [Load data from Azure blob storage to SQL Data Warehouse (Azure Data Factory)][].


## Load from SQL Server
To load data from SQL Server to SQL Data Warehouse you can use Integration Services (SSIS), transfer flat files, or ship disks to Microsoft. Read on to see a summary of the different loading processes and links to tutorials.

To plan a full data migration from SQL Server to SQL Data Warehouse, see the [Migration overview][]. 

### Use Integration Services (SSIS)
If you are already using Integration Services (SSIS) packages to load into SQL Server, you can update your packages to use SQL Server as the source and SQL Data Warehouse as the destination. This is quick and easy to do, and is a good choice if you are not trying to migrate your loading process to use data already in the cloud. The tradeoff is the load will be slower than using PolyBase because this SSIS does not perform the load in parallel.

Summary of loading process:

1. Revise your Integration Services package to point to the SQL Server instance for the source and the SQL Data Warehouse database for the destination.
2. Migrate your schema to SQL Data Warehouse, if it is not there already.
3. Change the mapping in your packages use only the data types that are supported by SQL Data Warehouse.
3. Schedule and run the package.

For a tutorial, see [Load data from SQL Server to Azure SQL Data Warehouse (SSIS)][].

### Use AZCopy (recommended for < 10 TB data)
If your data size is < 10 TB, you can export the data from SQL Server to flat files, copy the files to Azure blob storage, and then use PolyBase to load the data into SQL Data Warehouse

Summary of loading process:

1. Use the bcp command-line utility to export data from SQL Server to flat files.
2. Use the AZCopy command-line utility to copy data from flat files to Azure blob storage.
3. Use PolyBase to load into SQL Data Warehouse.

For a tutorial, see [Load data from Azure blob storage to SQL Data Warehouse (PolyBase)][].

### Use bcp
If you have a small amount of data you can use bcp to load directly into Azure SQL Data Warehouse.

Summary of loading process:
1. Use the bcp command-line utility to export data from SQL Server to flat files.
2. Use bcp to load data from flat files directly to SQL Data Warehouse.

For a tutorial, see [Load data from SQL Server to Azure SQL Data Warehouse (bcp)][].


### Use Import/Export (recommended for > 10 TB data)
If your data size is > 10 TB and you want to move it to Azure, we recommend that you use our disk shipping service [Import/Export][]. 

Summary of loading process
2. Use the bcp command-line utility to export data from SQL Server to flat files on transferrable disks.
3. Ship the disks to Microsoft.
4. Microsoft loads the data into SQL Data Warehouse

## Load from HDInsight
SQL Data Warehouse supports loading data from HDInsight via PolyBase. The process is the same as 
loading data from Azure Blob Storage - using PolyBase to connect to HDInsight to load data. 

### 1. Use PolyBase and T-SQL

Summary of loading process:

2. Format your data as UTF-8 since PolyBase does not currently support UTF-16.
2. Move your data to HDInsight and store it in text files, ORC or Parquet format.
3. Configure external objects in SQL Data Warehouse to define the location and format of the data.
4. Run a T-SQL command to load the data in parallel into a new database table.

For a tutorial, see [Load data from Azure blob storage to SQL Data Warehouse (PolyBase)][].

## Recommendations

Many of our partners have loading solutions. To find out more, see a list of our [solution partners][]. 

If your data is coming from a non-relational source and you want to load it into SQL Data Warehouse you will need to transform it into rows and columns before you load it. The transformed data doesn't need to be stored in a database, it can be stored in text files.

Create statistics on newly loaded data. Azure SQL Data Warehouse does not yet support auto create or auto update statistics.  In order to get the best performance from your queries, it's important to create statistics on all columns of all tables after the first load or any substantial changes occur in the data.  For details, see [Statistics][].


## Next steps
For more development tips, see the [development overview][].

<!--Image references-->

<!--Article references-->
[Load data from Azure blob storage to SQL Data Warehouse (PolyBase)]: ./sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md
[Load data from Azure blob storage to SQL Data Warehouse (Azure Data Factory)]: ./sql-data-warehouse-load-from-azure-blob-storage-with-data-factory.md
[Load data from SQL Server to Azure SQL Data Warehouse (SSIS)]: ./sql-data-warehouse-load-from-sql-server-with-integration-services.md
[Load data from SQL Server to Azure SQL Data Warehouse (bcp)]: ./sql-data-warehouse-load-from-sql-server-with-bcp.md
[Load data from SQL Server to Azure SQL Data Warehouse (AZCopy)]: ./sql-data-warehouse-load-from-sql-server-with-azcopy.md

[Load sample databases]: ./sql-data-warehouse-load-sample-databases.md
[Migration overview]: ./sql-data-warehouse-overview-migrate.md
[solution partners]: ./sql-data-warehouse-partner-business-intelligence.md
[development overview]: ./sql-data-warehouse-overview-develop.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md

<!--MSDN references-->

<!--Other Web references-->
[Import/Export]: https://azure.microsoft.com/documentation/articles/storage-import-export-service/
