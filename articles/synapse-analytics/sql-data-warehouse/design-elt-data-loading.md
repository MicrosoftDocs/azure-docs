---
title: Instead of ETL, design ELT
description: Implement flexible data loading strategies for dedicated SQL pools within Azure Synapse Analytics.
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 11/20/2020
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Data loading strategies for dedicated SQL pool in Azure Synapse Analytics

Traditional SMP dedicated SQL pools use an Extract, Transform, and Load (ETL) process for loading data. Synapse SQL, within Azure Synapse Analytics, uses distributed query processing architecture that takes advantage of the scalability and flexibility of compute and storage resources.

Using an Extract, Load, and Transform (ELT) process leverages built-in distributed query processing capabilities and eliminates the resources needed for data transformation prior to loading.

While dedicated SQL pools support many loading methods, including popular SQL Server options such as [bcp](/sql/tools/bcp-utility?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true) and the [SqlBulkCopy API](/dotnet/api/system.data.sqlclient.sqlbulkcopy?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json), the fastest and most scalable way to load data is through PolyBase external tables and the [COPY statement](/sql/t-sql/statements/copy-into-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true).

With PolyBase and the COPY statement, you can access external data stored in Azure Blob storage or Azure Data Lake Store via the T-SQL language. For the most flexibility when loading, we recommend using the COPY statement.


## What is ELT?

Extract, Load, and Transform (ELT) is a process by which data is extracted from a source system, loaded into a dedicated SQL pool, and then transformed.

The basic steps for implementing ELT are:

1. Extract the source data into text files.
2. Land the data into Azure Blob storage or Azure Data Lake Store.
3. Prepare the data for loading.
4. Load the data into staging tables with PolyBase or the COPY command.
5. Transform the data.
6. Insert the data into production tables.

For a loading tutorial, see [loading data from Azure blob storage](./load-data-from-azure-blob-storage-using-copy.md).

## 1. Extract the source data into text files

Getting data out of your source system depends on the storage location. The goal is to move the data into supported delimited text or CSV files.

### Supported file formats

With PolyBase and the COPY statement, you can load data from UTF-8 and UTF-16 encoded delimited text or CSV files. In addition to delimited text or CSV files, it loads from the Hadoop file formats such as ORC and Parquet. PolyBase and the COPY statement can also load data from Gzip and Snappy compressed files.

Extended ASCII, fixed-width format, and nested formats such as WinZip or XML aren't supported. If you're exporting from SQL Server, you can use the [bcp command-line tool](/sql/tools/bcp-utility?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true) to export the data into delimited text files.

## 2. Land the data into Azure Blob storage or Azure Data Lake Store

To land the data in Azure storage, you can move it to [Azure Blob storage](../../storage/blobs/storage-blobs-introduction.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json) or [Azure Data Lake Store Gen2](../../data-lake-store/data-lake-store-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json). In either location, the data should be stored in text files. PolyBase and the COPY statement can load from either location.

Tools and services you can use to move data to Azure Storage:

- [Azure ExpressRoute](../../expressroute/expressroute-introduction.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json) service enhances network throughput, performance, and predictability. ExpressRoute is a service that routes your data through a dedicated private connection to Azure. ExpressRoute connections do not route data through the public internet. The connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the public internet.
- [AzCopy utility](../../storage/common/storage-choose-data-transfer-solution.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json) moves data to Azure Storage over the public internet. This works if your data sizes are less than 10 TB. To perform loads on a regular basis with AzCopy, test the network speed to see if it is acceptable.
- [Azure Data Factory (ADF)](../../data-factory/introduction.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json) has a gateway that you can install on your local server. Then you can create a pipeline to move data from your local server up to Azure Storage. To use Data Factory with dedicated SQL pools, see [Loading data for dedicated SQL pools](../../data-factory/load-azure-sql-data-warehouse.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json).

## 3. Prepare the data for loading

You might need to prepare and clean the data in your storage account before loading. Data preparation can be performed while your data is in the source, as you export the data to text files, or after the data is in Azure Storage.  It is easiest to work with the data as early in the process as possible.  

### Define the tables

You must first define the table(s) you are loading to in your dedicated SQL pool when using the COPY statement.

If you are using PolyBase, you need to define external tables in your dedicated SQL pool before loading. PolyBase uses external tables to define and access the data in Azure Storage. An external table is similar to a database view. The external table contains the table schema and points to data that is stored outside the dedicated SQL pool.

Defining external tables involves specifying the data source, the format of the text files, and the table definitions. T-SQL syntax reference articles that you will need are:

- [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true)

Use the following SQL data type mapping when loading Parquet files:

|                         Parquet type                         |   Parquet logical type (annotation)   |  SQL data type   |
| :----------------------------------------------------------: | :-----------------------------------: | :--------------: |
|                           BOOLEAN                            |                                       |       bit        |
|                     BINARY / BYTE_ARRAY                      |                                       |    varbinary     |
|                            DOUBLE                            |                                       |      float       |
|                            FLOAT                             |                                       |       real       |
|                            INT32                             |                                       |       int        |
|                            INT64                             |                                       |      bigint      |
|                            INT96                             |                                       |    datetime2     |
|                     FIXED_LEN_BYTE_ARRAY                     |                                       |      binary      |
|                            BINARY                            |                 UTF8                  |     nvarchar     |
|                            BINARY                            |                STRING                 |     nvarchar     |
|                            BINARY                            |                 ENUM                  |     nvarchar     |
|                            BINARY                            |                 UUID                  | uniqueidentifier |
|                            BINARY                            |                DECIMAL                |     decimal      |
|                            BINARY                            |                 JSON                  |  nvarchar(MAX)   |
|                            BINARY                            |                 BSON                  |  varbinary(max)  |
|                     FIXED_LEN_BYTE_ARRAY                     |                DECIMAL                |     decimal      |
|                          BYTE_ARRAY                          |               INTERVAL                |  varchar(max),   |
|                            INT32                             |             INT(8, true)              |     smallint     |
|                            INT32                             |            INT(16,   true)            |     smallint     |
|                            INT32                             |             INT(32, true)             |       int        |
|                            INT32                             |            INT(8,   false)            |     tinyint      |
|                            INT32                             |            INT(16, false)             |       int        |
|                            INT32                             |           INT(32,   false)            |      bigint      |
|                            INT32                             |                 DATE                  |       date       |
|                            INT32                             |                DECIMAL                |     decimal      |
|                            INT32                             |            TIME (MILLIS )             |       time       |
|                            INT64                             |            INT(64,   true)            |      bigint      |
|                            INT64                             |           INT(64, false  )            |  decimal(20,0)   |
|                            INT64                             |                DECIMAL                |     decimal      |
|                            INT64                             |         TIME (MILLIS)                 |       time       |
|                            INT64                             | TIMESTAMP   (MILLIS)                  |    datetime2     |
| [Complex   type](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md) |                 LIST                  |   varchar(max)   |
| [Complex   type](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md) |                  MAP                  |   varchar(max)   |

>[!IMPORTANT] 
>- SQL dedicated pools do not currently support Parquet data types with MICROS and NANOS precision. 
>- You may experience the following error if types are mismatched between Parquet and SQL or if you have unsupported Parquet data types: `HdfsBridge::recordReaderFillBuffer - Unexpected error encountered filling record reader buffer: ClassCastException:...`
>- Loading a value outside the range of 0-127 into a tinyint column for Parquet and ORC file format is not supported.

For an example of creating external objects, see [Create external tables](../sql/develop-tables-external-tables.md?tabs=sql-pool).

### Format text files

If you are using PolyBase, the external objects defined need to align the rows of the text files with the external table and file format definition. The data in each row of the text file must align with the table definition.
To format the text files:

- If your data is coming from a non-relational source, you need to transform it into rows and columns. Whether the data is from a relational or non-relational source, the data must be transformed to align with the column definitions for the table into which you plan to load the data.
- Format data in the text file to align with the columns and data types in the destination table. Misalignment between data types in the external text files and the dedicated SQL pool table causes rows to be rejected during the load.
- Separate fields in the text file with a terminator.  Be sure to use a character or a character sequence that isn't found in your source data. Use the terminator you specified with [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true).

## 4. Load the data using PolyBase or the COPY statement

It is best practice to load data into a staging table. Staging tables allow you to handle errors without interfering with the production tables. A staging table also gives you the opportunity to use the dedicated SQL pool parallel processing architecture for data transformations before inserting the data into production tables.

### Options for loading

To load data, you can use any of these loading options:

- The [COPY statement](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) is the recommended loading utility as it enables you to seamlessly and flexibly load data. The statement has many additional loading capabilities that PolyBase does not provide. See the [NY taxi cab COPY tutorial](./load-data-from-azure-blob-storage-using-copy.md) to run through a sample tutorial.  
- [PolyBase with T-SQL](./sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md) requires you to define external data objects.
- [PolyBase and COPY statement with Azure Data Factory (ADF)](../../data-factory/load-azure-sql-data-warehouse.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json) is another orchestration tool.  It defines a pipeline and schedules jobs.
- [PolyBase with SSIS](/sql/integration-services/load-data-to-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true) works well when your source data is in SQL Server. SSIS defines the source to destination table mappings, and also orchestrates the load. If you already have SSIS packages, you can modify the packages to work with the new data warehouse destination.
- [PolyBase with Azure Databricks](/azure/databricks/scenarios/databricks-extract-load-sql-data-warehouse?bc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2fsql-data-warehouse%2ftoc.json) transfers data from a table to a Databricks dataframe and/or writes data from a Databricks dataframe to a table using PolyBase.

### Other loading options

In addition to PolyBase and the COPY statement, you can use [bcp](/sql/tools/bcp-utility?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&view=azure-sqldw-latest&preserve-view=true) or the [SqlBulkCopy API](/dotnet/api/system.data.sqlclient.sqlbulkcopy?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json). bcp loads directly to the database without going through Azure Blob storage, and is intended only for small loads.

> [!NOTE]
> The load performance of these options is slower than PolyBase and the COPY statement.

## 5. Transform the data

While data is in the staging table, perform transformations that your workload requires. Then move the data into a production table.

## 6. Insert the data into production tables

The INSERT INTO ... SELECT statement moves the data from the staging table to the permanent table.

As you design an ETL process, try running the process on a small test sample. Try extracting 1000 rows from the table to a file, move it to Azure, and then try loading it into a staging table.

## Partner loading solutions

Many of our partners have loading solutions. To find out more, see a list of our [solution partners](sql-data-warehouse-partner-business-intelligence.md).

## Next steps

For loading guidance, see [Data loading best practices](../sql/data-loading-best-practices.md).
