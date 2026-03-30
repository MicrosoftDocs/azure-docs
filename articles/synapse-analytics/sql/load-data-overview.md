---
title: Design a PolyBase data loading strategy for dedicated SQL pool
description: Learn how to implement a PolyBase data loading strategy for dedicated SQL pool using Extract, Load, and Transform (ELT).
author: joannapea
ms.author: joanpo

ms.date: 02/05/2025
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Design a PolyBase data loading strategy for dedicated SQL pool

Traditional symmetric multiprocessing system (SMP) data warehouses use an Extract, Transform, and Load (ETL) process for loading data. Azure SQL pool is a massively parallel processing (MPP) architecture that takes advantage of the scalability and flexibility of compute and storage resources.

In contrast, an Extract, Load, and Transform (ELT) process can take advantage of built-in distributed query processing capabilities and eliminate resources needed to transform the data before loading.

While SQL pool supports many loading methods, including non-Polybase options such as bulk copy program (bcp) and SQL BulkCopy API, the fastest and most scalable way to load data is through PolyBase. PolyBase is a technology that accesses external data stored in Azure Blob storage or Azure Data Lake Storage via the Transact-SQL (T-SQL) language.

> [!VIDEO https://www.youtube.com/embed/l9-wP7OdhDk]

## Implement Polybase ELT

Extract, Load, and Transform (ELT) is a process by which data is extracted from a source system, loaded into a data warehouse, and then transformed.

The basic steps for implementing a PolyBase ELT for dedicated SQL pool are:

1. [Extract the source data into text files](#extract-the-source-data-into-text-files).
1. [Land the data into Azure Blob storage or Azure Data Lake Storage](#land-the-data-into-azure-blob-storage-or-azure-data-lake-store).
1. [Prepare the data for loading](#prepare-the-data-for-loading).
1. [Load the data into dedicated SQL pool staging tables using PolyBase](#load-the-data-into-dedicated-sql-pool-staging-tables-using-polybase).
1. [Transform the data](#transform-the-data).
1. [Insert the data into production tables](#insert-the-data-into-production-tables).

For a loading tutorial, see [Load the New York Taxicab dataset](../sql-data-warehouse/load-data-from-azure-blob-storage-using-copy.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json).

For more information, see [Loading patterns and strategies](/archive/blogs/sqlcat/azure-sql-data-warehouse-loading-patterns-and-strategies).

## Extract the source data into text files

Getting data out of your source system depends on the storage location. The goal is to move the data into PolyBase-supported delimited text files.

### PolyBase external file formats

PolyBase loads data from UTF-8 and UTF-16 encoded delimited text files. PolyBase also loads from the Hadoop file formats RC File, ORC, and Parquet. PolyBase can also load data from Gzip and Snappy compressed files. PolyBase currently doesn't support extended ASCII, fixed-width format, or nested formats such as WinZip, JSON, and XML.

If you're exporting from SQL Server, you can use [bcp command-line tool](/sql/tools/bcp-utility?view=azure-sqldw-latest&preserve-view=true) to export the data into delimited text files. The following table lists Parquet data types mapped to Azure Synapse Analytics.

| **Parquet data type** |                      **SQL data type**                       |
| :-------------------: | :----------------------------------------------------------: |
|        tinyint        |                           tinyint                            |
|       smallint        |                           smallint                           |
|          int          |                             int                              |
|        bigint         |                            bigint                            |
|        boolean        |                             bit                              |
|        double         |                            float                             |
|         float         |                             real                             |
|        double         |                            money                             |
|        double         |                          smallmoney                          |
|        string         |                            nchar                             |
|        string         |                           nvarchar                           |
|        string         |                             char                             |
|        string         |                           varchar                            |
|        binary         |                            binary                            |
|        binary         |                          varbinary                           |
|       timestamp       |                             date                             |
|       timestamp       |                        smalldatetime                         |
|       timestamp       |                          datetime2                           |
|       timestamp       |                           datetime                           |
|       timestamp       |                             time                             |
|       date            |                             date                             |
|        decimal        |                            decimal                           |

## Land the data into Azure Blob storage or Azure Data Lake Store

To land the data in Azure storage, you can move it to [Azure Blob storage](../../storage/blobs/storage-blobs-introduction.md) or [Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md). In either location, the data should be stored in text files. PolyBase can load from either location.

You can use the following tools and services to move data to Azure Storage:

- [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) service enhances network throughput, performance, and predictability. ExpressRoute is a service that routes your data through a dedicated private connection to Azure. ExpressRoute connections don't route data through the public internet. The connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the public internet.
- [AzCopy utility](../../storage/common/storage-use-azcopy-v10.md) moves data to Azure Storage over the public internet. This works if your data sizes are less than 10 TB. To perform loads regularly with AzCopy, test the network speed to see if it's acceptable.
- [Azure Data Factory](../../data-factory/introduction.md) has a gateway that you can install on your local server. Then you can create a pipeline to move data from your local server up to Azure Storage. To use Data Factory with dedicated SQL pool, see [Load data into Azure Synapse Analytics](../../data-factory/load-azure-sql-data-warehouse.md).

## Prepare the data for loading

You might need to prepare and clean the data in your storage account before loading it into dedicated SQL pool. Data preparation can be performed while your data is in the source, as you export the data to text files, or after the data is in Azure storage. It's easiest to work with the data as early in the process as possible.  

### Define external tables

Before you can load data, you need to define external tables in your data warehouse. PolyBase uses external tables to define and access the data in Azure Storage. An external table is similar to a database view. The external table contains the table schema and points to data that is stored outside the data warehouse.

Defining external tables involves specifying the data source, the format of the text files, and the table definitions. What follows are the T-SQL syntax topics that you need:

- [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true)
- [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest&preserve-view=true)

### Format text files

Once the external objects are defined, you need to align the rows of the text files with the external table and file format definition. The data in each row of the text file must align with the table definition.
To format the text files:

- If your data comes from a non-relational source, you need to transform it into rows and columns. Whether the data is from a relational or non-relational source, the data must be transformed to align with the column definitions for the table into which you plan to load the data.
- Format data in the text file to align with the columns and data types in the SQL pool destination table. Misalignment between data types in the external text files and the data warehouse table causes rows to be rejected during the load.
- Separate fields in the text file with a terminator. Be sure to use a character or character sequence that isn't found in your source data. Use the terminator you specified with [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true).

## Load the data into dedicated SQL pool staging tables using PolyBase

It's a best practice to load data into a staging table. Staging tables allow you to handle errors without interfering with the production tables. A staging table also gives you the opportunity to use SQL pool built-in distributed query processing capabilities for data transformations before inserting the data into production tables.

### Options for loading with PolyBase

To load data with PolyBase, you can use any of these loading options:

- [Load external data using Microsoft Entra ID](../sql/tutorial-load-data-using-entra-id.md).
- [Load external data using a managed identity](../sql/tutorial-external-tables-using-managed-identity.md).
- [PolyBase with T-SQL](../sql-data-warehouse/sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json) works well when your data is in Azure Blob storage or Azure Data Lake Storage. It gives you the most control over the loading process, but also requires you to define external data objects. The other methods define these objects behind the scenes as you map source tables to destination tables. To orchestrate T-SQL loads, you can use Azure Data Factory, SSIS, or Azure Functions.
- [PolyBase with SQL Server Integration Services (SSIS)](/sql/integration-services/load-data-to-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) works well when your source data is in SQL Server. SSIS defines the source-to-destination table mappings, and also orchestrates the load. If you already have SSIS packages, you can modify the packages to work with the new data warehouse destination.
- [PolyBase with Azure Data Factory](../../data-factory/load-azure-sql-data-warehouse.md) is another orchestration tool. It defines a pipeline and schedules jobs.
- [PolyBase with Azure Databricks](/azure/databricks/connect/external-systems/synapse-analytics?bc=%2Fazure%2Fsynapse-analytics%2Fbreadcrumb%2Ftoc.json&toc=%2Fazure%2Fsynapse-analytics%2Ftoc.json) transfers data from an Azure Synapse Analytics table to a Databricks dataframe and/or writes data from a Databricks dataframe to an Azure Synapse Analytics table using PolyBase.

### Non-PolyBase loading options

If your data isn't compatible with PolyBase, you can use [bcp](/sql/tools/bcp-utility?view=azure-sqldw-latest&preserve-view=true) or the [SQLBulkCopy API](/dotnet/api/system.data.sqlclient.sqlbulkcopy). BCP loads directly to dedicated SQL pool without going through Azure Blob storage, and is intended only for small loads. Note, the load performance of these options is slower than PolyBase.

## Transform the data

While data is in the staging table, perform transformations that your workload requires. Then move the data into a production table.

## Insert the data into production tables

The `INSERT INTO ... SELECT` statement moves the data from the staging table to the permanent table.

As you design an ETL process, try running the process on a small test sample. Try extracting 1,000 rows from the table to a file, move it to Azure, and then try loading it into a staging table.

## Partner loading solutions

Many of our partners have loading solutions. To find out more, see a list of our [solution partners](../sql-data-warehouse/sql-data-warehouse-partner-business-intelligence.md?context=/azure/synapse-analytics/context/context).

## Related content

- [Best practices for loading data into a dedicated SQL pool](data-loading-best-practices.md)
