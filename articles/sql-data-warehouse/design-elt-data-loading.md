---
title: Instead of ETL, design ELT for Azure SQL Data Warehouse | Microsoft Docs
description: Instead of ETL, design an Extract, Load, and Transform (ELT) process for loading data or Azure SQL Data Warehouse.  
services: sql-data-warehouse
author: ckarst
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: design
ms.date: 04/17/2018
ms.author: cakarst
ms.reviewer: igorstan
---

# Designing Extract, Load, and Transform (ELT) for Azure SQL Data Warehouse

Instead of Extract, Transform, and Load (ETL), design an Extract, Load, and Transform (ELT) process for loading data into Azure SQL Data Warehouse. This article introduces ways to design an ELT process that moves data into an Azure data warehouse.

> [!VIDEO https://www.youtube.com/embed/l9-wP7OdhDk]

## What is ELT?

Extract, Load, and Transform (ELT) is a process by which data moves from a source system to a destination data warehouse. This process is performed on a regular basis, for example hourly or daily, to get newly generated data into the data warehouse. The ideal way to get data from source to data warehouse is to develop an ELT process that uses PolyBase to load data into SQL Data Warehouse.

ELT loads first and then transforms the data, whereas Extract, Transform, and Load (ETL) transforms the data before loading it. Performing ELT instead of ETL saves the cost of providing your own resources to transform the data before it is loaded. When using SQL Data Warehouse, ELT leverages the MPP system to perform the transformations.

Although there are many variations for implementing ELT for SQL Data Warehouse, these are the basic steps:  

1. Extract the source data into text files.
2. Land the data into Azure Blob storage or Azure Data Lake Store.
3. Prepare the data for loading.
2. Load the data into SQL Data Warehouse staging tables by using PolyBase.
3. Transform the data.
4. Insert the data into production tables.


For a loading tutorial, see [Use PolyBase to load data from Azure blob storage to Azure SQL Data Warehouse](load-data-from-azure-blob-storage-using-polybase.md).

For more information, see [Loading patterns blog](http://blogs.msdn.microsoft.com/sqlcat/2017/05/17/azure-sql-data-warehouse-loading-patterns-and-strategies/). 

## Options for loading with PolyBase

PolyBase is a technology that accesses data outside of the database via the T-SQL language. It is the best way to load data into SQL Data Warehouse. With PolyBase, the data loads in parallel from the data source directly to the compute nodes. 

To load data with PolyBase, you can use any of these loading options.

- [PolyBase with T-SQL](load-data-from-azure-blob-storage-using-polybase.md) works well when your data is in Azure Blob storage or Azure Data Lake Store. It gives you the most control over the loading process, but also requires you to define external data objects. The other methods define these objects behind the scenes as you map source tables to destination tables.  To orchestrate T-SQL loads, you can use Azure Data Factory, SSIS, or Azure functions. 
- [PolyBase with SSIS](/sql/integration-services/load-data-to-sql-data-warehouse) works well when your source data is in SQL Server, either SQL Server on-premises or in the cloud. SSIS defines the source to destination table mappings, and also orchestrates the load. If you already have SSIS packages, you can modify the packages to work with the new data warehouse destination. 
- [PolyBase with Azure Data Factory (ADF)](sql-data-warehouse-load-with-data-factory.md) is another orchestration tool.  It defines a pipeline and schedules jobs. 
- [PolyBase with Azure DataBricks](../azure-databricks/databricks-extract-load-sql-data-warehouse.md) transfers data from a SQL Data Warehouse table to a Databricks dataframe and/or writes data from a Databricks dataframe to a SQL Data Warehouse table.

### PolyBase external file formats

PolyBase loads data from UTF-8 and UTF-16 encoded delimited text files. In addition to the delimited text files, it loads from  the Hadoop file formats RC File, ORC, and Parquet. PolyBase can load data from Gzip and Snappy compressed files. PolyBase currently does not support extended ASCII, fixed-width format, and nested formats such as WinZip, JSON, and XML.

### Non-PolyBase loading options
If your data is not compatible with PolyBase, you can use [bcp](/sql/tools/bcp-utility) or the [SQLBulkCopy API](https://msdn.microsoft.com/library/system.data.sqlclient.sqlbulkcopy.aspx). bcp loads directly to SQL Data Warehouse without going through Azure Blob storage, and is intended only for small loads. Note, the load performance of these options is significantly slower than PolyBase. 


## Extract source data

Getting data out of your source system depends on the source.  The goal is to move the data into delimited text files. If you are using SQL Server, you can use [bcp command-line tool](/sql/tools/bcp-utility) to export the data.  

## Land data to Azure storage

To land the data in Azure storage, you can move it to [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md) or [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md). In either location, the data should be stored into text files. Polybase can load from either location.

These are tools and services you can use to move data to Azure Storage.

- [Azure ExpressRoute](../expressroute/expressroute-introduction.md) service enhances network throughput, performance, and predictability. ExpressRoute is a service that routes your data through a dedicated private connection to Azure. ExpressRoute connections do not route data through the public internet. The connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the public internet.
- [AZCopy utility](../storage/common/storage-moving-data.md) moves data to Azure Storage over the public internet. This works if your data sizes are less than 10 TB. To perform loads on a regular basis with AZCopy, test the network speed to see if it is acceptable. 
- [Azure Data Factory (ADF)](../data-factory/introduction.md) has a gateway that you can install on your local server. Then you can create a pipeline to move data from your local server up to Azure Storage. To use Data Factory with SQL Data Warehouse, see [Load data into SQL Data Warehouse](/azure/data-factory/load-azure-sql-data-warehouse).

## Prepare data

You might need to prepare and clean the data in your storage account before loading it into SQL Data Warehouse. Data preparation can be performed while your data is in the source, as you export the data to text files, or after the data is in Azure Storage.  It is easiest to work with the data as early in the process as possible.  

### Define external tables
Before you can load data, you need to define external tables in your data warehouse. PolyBase uses external tables to define and access the data in Azure Storage. The external table is similar to a regular table. The main difference is the external table points to data that is stored outside the data warehouse. 

Defining external tables involves specifying the data source, the format of the text files, and the table definitions. These are the T-SQL syntax topics that you will need:
- [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql)
- [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql)

For an example of creating external objects, see the [Create external tables](load-data-from-azure-blob-storage-using-polybase.md#create-external-tables-for-the-sample-data) step in the loading tutorial.

### Format text files

Once the external objects are defined, you need to align the rows of the text files with the external table and file format definition. The data in each row of the text file must align with the table definition.

To format the text files:

- If your data is coming from a non-relational source, you need to transform it into rows and columns. Whether the data is from a relational or non-relational source, the data must be transformed to align with the column definitions for the table into which you plan to load the data. 
- Format data in the text file to align with the columns and data types in the SQL Data Warehouse destination table. Misalignment between data types in the external text files and the data warehouse table causes rows to be rejected during the load.
- Separate fields in the text file with a terminator.  Be sure to use a character or a character sequence that is not found in your source data. Use the terminator you specified with [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql).

## Load to a staging table
To get data into the data warehouse, it works well to first load the data into a staging table. By using a staging table, you can handle errors without interfering with the production tables, and you avoid running rollback operations on the production table. A staging table also gives you the opportunity to use SQL Data Warehouse to run transformations before inserting the data into production tables.

To load with T-SQL, run the [CREATE TABLE AS SELECT (CTAS)](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) T-SQL statement. This command inserts the results of a select statement into a new table. When the statement selects from an external table, it imports the external data. 

In the following example, ext.Date is an external table. All rows are imported into a new table called dbo.Date.

```sql
CREATE TABLE [dbo].[Date]
WITH
( 
    CLUSTERED COLUMNSTORE INDEX
)
AS SELECT * FROM [ext].[Date]
;
```

## Transform the data
While data is in the staging table, perform transformations that your workload requires. Then move the data into a production table.

## Insert data into production table

The INSERT INTO ... SELECT statement moves the data from the staging table to the permanent table. 

As you design an ETL process, try running the process on a small test sample. Try extracting 1000 rows from the table to a file, move it to Azure, and then try loading it into a staging table. 

## Partner loading solutions
Many of our partners have loading solutions. To find out more, see a list of our [solution partners](sql-data-warehouse-partner-business-intelligence.md). 

## Next steps
For loading guidance, see [Guidance for load data](guidance-for-loading-data.md).


