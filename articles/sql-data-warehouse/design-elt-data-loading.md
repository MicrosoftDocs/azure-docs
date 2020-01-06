---
title: Instead of ETL, design ELT 
description: Instead of ETL, design an Extract, Load, and Transform (ELT) process for loading data or Azure SQL Data Warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: load-data
ms.date: 11/07/2019
ms.author: kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Data loading strategies for Azure SQL Data Warehouse

Traditional SMP data warehouses use an Extract, Transform, and Load (ETL) process for loading data. Azure SQL Data Warehouse is a massively parallel processing (MPP) architecture that takes advantage of the scalability and flexibility of compute and storage resources. Utilizing an Extract, Load, and Transform (ELT) process can take advantage of MPP and eliminate resources needed to transform the data prior to loading. While SQL Data Warehouse supports many loading methods including popular SQL Server options such as BCP and the SQL BulkCopy API, the fastest and most scalable way to load data is through PolyBase external tables and the [COPY statement](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) (preview).  With PolyBase and the COPY statement, you can access external data stored in Azure Blob storage or Azure Data Lake Store via the T-SQL language. For the most flexibility when loading into SQL Data Warehouse, we recommend using the COPY statement. 

> [!NOTE]  
> The COPY statement is currently in public preview. To provide feedback, send email to the following distribution list: sqldwcopypreview@service.microsoft.com.
>
        
 
> [!VIDEO https://www.youtube.com/embed/l9-wP7OdhDk]


## What is ELT?

Extract, Load, and Transform (ELT) is a process by which data is extracted from a source system, loaded into a data warehouse, and then transformed. 

The basic steps for implementing ELT for SQL Data Warehouse are:

1. Extract the source data into text files.
2. Land the data into Azure Blob storage or Azure Data Lake Store.
3. Prepare the data for loading.
4. Load the data into SQL Data Warehouse staging tables with PolyBase or the COPY command. 
5. Transform the data.
6. Insert the data into production tables.


For a PolyBase loading tutorial, see [Use PolyBase to load data from Azure blob storage to Azure SQL Data Warehouse](load-data-from-azure-blob-storage-using-polybase.md).

For more information, see [Loading patterns blog](https://blogs.msdn.microsoft.com/sqlcat/20../../azure-sql-data-warehouse-loading-patterns-and-strategies/). 


## 1. Extract the source data into text files

Getting data out of your source system depends on the storage location.  The goal is to move the data into PolyBase and the COPY supported delimited text or CSV files. 

### PolyBase and COPY external file formats

With PolyBase and the COPY statement, you can load data from UTF-8 and UTF-16 encoded delimited text or CSV files. In addition to delimited text or CSV files, it loads from the Hadoop file formats such as ORC and Parquet. PolyBase and the COPY statement can also load data from Gzip and Snappy compressed files. Extended ASCII, fixed-width format, and nested formats such as WinZip or XML are not supported. If you are exporting from SQL Server, you can use the [bcp command-line tool](/sql/tools/bcp-utility?view=azure-sqldw-latest) to export the data into delimited text files. 

## 2. Land the data into Azure Blob storage or Azure Data Lake Store

To land the data in Azure storage, you can move it to [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md) or [Azure Data Lake Store Gen2](../data-lake-store/data-lake-store-overview.md). In either location, the data should be stored in text files. PolyBase and the COPY statement can load from either location.

Tools and services you can use to move data to Azure Storage:

- [Azure ExpressRoute](../expressroute/expressroute-introduction.md) service enhances network throughput, performance, and predictability. ExpressRoute is a service that routes your data through a dedicated private connection to Azure. ExpressRoute connections do not route data through the public internet. The connections offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the public internet.
- [AZCopy utility](../storage/common/storage-moving-data.md) moves data to Azure Storage over the public internet. This works if your data sizes are less than 10 TB. To perform loads on a regular basis with AZCopy, test the network speed to see if it is acceptable. 
- [Azure Data Factory (ADF)](../data-factory/introduction.md) has a gateway that you can install on your local server. Then you can create a pipeline to move data from your local server up to Azure Storage. To use Data Factory with SQL Data Warehouse, see [Load data into SQL Data Warehouse](/azure/data-factory/load-azure-sql-data-warehouse).


## 3. Prepare the data for loading

You might need to prepare and clean the data in your storage account before loading it into SQL Data Warehouse. Data preparation can be performed while your data is in the source, as you export the data to text files, or after the data is in Azure Storage.  It is easiest to work with the data as early in the process as possible.  

### Define external tables

If you are using PolyBase, you need to define external tables in your data warehouse before loading. External tables are not required by the COPY statement. PolyBase uses external tables to define and access the data in Azure Storage. An external table is similar to a database view. The external table contains the table schema and points to data that is stored outside the data warehouse. 

Defining external tables involves specifying the data source, the format of the text files, and the table definitions. T-SQL syntax topics that you will need are:
- [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest)
- [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest)
- [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest)

When loading Parquet, the data type mapping with SQL DW is:

| **Parquet Data Type** |                      **SQL Data Type**                       |
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

For an example of creating external objects, see the [Create external tables](load-data-from-azure-blob-storage-using-polybase.md#create-external-tables-for-the-sample-data) step in the loading tutorial.

### Format text files

If you are using PolyBase, the external objects defined need to align the rows of the text files with the external table and file format definition. The data in each row of the text file must align with the table definition.
To format the text files:

- If your data is coming from a non-relational source, you need to transform it into rows and columns. Whether the data is from a relational or non-relational source, the data must be transformed to align with the column definitions for the table into which you plan to load the data. 
- Format data in the text file to align with the columns and data types in the SQL Data Warehouse destination table. Misalignment between data types in the external text files and the data warehouse table causes rows to be rejected during the load.
- Separate fields in the text file with a terminator.  Be sure to use a character or a character sequence that is not found in your source data. Use the terminator you specified with [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql).


## 4. Load the data into SQL Data Warehouse staging tables using PolyBase or the COPY statement

It is best practice to load data into a staging table. Staging tables allow you to handle errors without interfering with the production tables. A staging table also gives you the opportunity to use SQL Data Warehouse MPP for data transformations before inserting the data into production tables. The table will need to be pre-created when loading into a staging table with COPY.

### Options for loading with PolyBase and COPY statement

To load data with PolyBase, you can use any of these loading options:

- [PolyBase with T-SQL](load-data-from-azure-blob-storage-using-polybase.md) works well when your data is in Azure Blob storage or Azure Data Lake Store. It gives you the most control over the loading process, but also requires you to define external data objects. The other methods define these objects behind the scenes as you map source tables to destination tables.  To orchestrate T-SQL loads, you can use Azure Data Factory, SSIS, or Azure functions. 
- [PolyBase with SSIS](/sql/integration-services/load-data-to-sql-data-warehouse) works well when your source data is in SQL Server, either SQL Server on-premises or in the cloud. SSIS defines the source to destination table mappings, and also orchestrates the load. If you already have SSIS packages, you can modify the packages to work with the new data warehouse destination. 
- [PolyBase and COPY statement with Azure Data Factory (ADF)](sql-data-warehouse-load-with-data-factory.md) is another orchestration tool.  It defines a pipeline and schedules jobs. 
- [PolyBase with Azure Databricks](../azure-databricks/databricks-extract-load-sql-data-warehouse.md) transfers data from a SQL Data Warehouse table to a Databricks dataframe and/or writes data from a Databricks dataframe to a SQL Data Warehouse table using PolyBase.

### Other loading options

In addition to PolyBase and the COPY statement, you can use [bcp](/sql/tools/bcp-utility?view=azure-sqldw-latest) or the [SQLBulkCopy API](https://msdn.microsoft.com/library/system.data.sqlclient.sqlbulkcopy.aspx). bcp loads directly to SQL Data Warehouse without going through Azure Blob storage, and is intended only for small loads. Note, the load performance of these options is slower than PolyBase and the COPY statement. 


## 5. Transform the data

While data is in the staging table, perform transformations that your workload requires. Then move the data into a production table.


## 6. Insert the data into production tables

The INSERT INTO ... SELECT statement moves the data from the staging table to the permanent table. 

As you design an ETL process, try running the process on a small test sample. Try extracting 1000 rows from the table to a file, move it to Azure, and then try loading it into a staging table. 


## Partner loading solutions

Many of our partners have loading solutions. To find out more, see a list of our [solution partners](sql-data-warehouse-partner-business-intelligence.md). 


## Next steps

For loading guidance, see [Guidance for load data](guidance-for-loading-data.md).


