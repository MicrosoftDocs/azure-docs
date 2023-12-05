---
title: "Tutorial load data from Azure Data Lake Storage"
description: Use the COPY statement to load data from Azure Data Lake Storage for dedicated SQL pools.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: joanpo 
ms.date: 09/02/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Load data from Azure Data Lake Storage into dedicated SQL pools in Azure Synapse Analytics

This guide outlines how to use the [COPY statement](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) to load data from Azure Data Lake Storage. For quick examples on using the COPY statement across all authentication methods, visit the following documentation: [Securely load data using dedicated SQL pools](./quickstart-bulk-load-copy-tsql-examples.md).

> [!NOTE]  
> To provide feedback or report issues on the COPY statement, send an email to the following distribution list: sqldwcopypreview@service.microsoft.com.
>
> [!div class="checklist"]
>
> * Create the target table to load data from Azure Data Lake Storage.
> * Create the COPY statement to load data into the data warehouse.

If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/) before you begin.

## Before you begin

Before you begin this tutorial, download and install the newest version of [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) (SSMS).

To run this tutorial, you need:

* A dedicated SQL pool. See [Create a dedicated SQL pool and query data](create-data-warehouse-portal.md).
* A Data Lake Storage account. See [Get started with Azure Data Lake Storage](../../data-lake-store/data-lake-store-get-started-portal.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). For this storage account, you will need to configure or specify one of the following credentials to load: A storage account key, shared access signature (SAS) key, an Azure Directory Application user, or a Microsoft Entra user that has the appropriate Azure role to the storage account.
* Currently, ingesting data using the COPY command into an Azure Storage account that is using the new [Azure Storage DNS partition feature](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-create-additional-5000-azure-storage-accounts/ba-p/3465466) results in an error. Provision a storage account in a subscription that does not use DNS partitioning for this tutorial.

## Create the target table

Connect to your dedicated SQL pool and create the target table you will load to. In this example, we are creating a product dimension table.

```sql
-- A: Create the target table
-- DimProduct
CREATE TABLE [dbo].[DimProduct]
(
    [ProductKey] [int] NOT NULL,
    [ProductLabel] [nvarchar](255) NULL,
    [ProductName] [nvarchar](500) NULL
)
WITH
(
    DISTRIBUTION = HASH([ProductKey]),
    CLUSTERED COLUMNSTORE INDEX
    --HEAP
);
```

## Create the COPY statement

Connect to your SQL dedicated pool and run the COPY statement. For a complete list of examples, visit the following documentation: [Securely load data using dedicated SQL pools](./quickstart-bulk-load-copy-tsql-examples.md).

```sql
-- B: Create and execute the COPY statement

COPY INTO [dbo].[DimProduct]  
--The column list allows you map, omit, or reorder input file columns to target table columns.  
--You can also specify the default value when there is a NULL value in the file.
--When the column list is not specified, columns will be mapped based on source and target ordinality
(
    ProductKey default -1 1,
    ProductLabel default 'myStringDefaultWhenNull' 2,
    ProductName default 'myStringDefaultWhenNull' 3
)
--The storage account location where you data is staged
FROM 'https://storageaccount.blob.core.windows.net/container/directory/'
WITH  
(
   --CREDENTIAL: Specifies the authentication method and credential access your storage account
   CREDENTIAL = (IDENTITY = '', SECRET = ''),
   --FILE_TYPE: Specifies the file type in your storage account location
   FILE_TYPE = 'CSV',
   --FIELD_TERMINATOR: Marks the end of each field (column) in a delimited text (CSV) file
   FIELDTERMINATOR = '|',
   --ROWTERMINATOR: Marks the end of a record in the file
   ROWTERMINATOR = '0x0A',
   --FIELDQUOTE: Specifies the delimiter for data of type string in a delimited text (CSV) file
   FIELDQUOTE = '',
   ENCODING = 'UTF8',
   DATEFORMAT = 'ymd',
   --MAXERRORS: Maximum number of reject rows allowed in the load before the COPY operation is canceled
   MAXERRORS = 10,
   --ERRORFILE: Specifies the directory where the rejected rows and the corresponding error reason should be written
   ERRORFILE = '/errorsfolder',
) OPTION (LABEL = 'COPY: ADLS tutorial');
```

## Optimize columnstore compression

By default, tables are defined as a clustered columnstore index. After a load completes, some of the data rows might not be compressed into the columnstore.  There's a variety of reasons why this can happen. To learn more, see [manage columnstore indexes](sql-data-warehouse-tables-index.md).

To optimize query performance and columnstore compression after a load, rebuild the table to force the columnstore index to compress all the rows.

```sql

ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD;

```

## Optimize statistics

It is best to create single-column statistics immediately after a load. There are some choices for statistics. For example, if you create single-column statistics on every column it might take a long time to rebuild all the statistics. If you know certain columns are not going to be in query predicates, you can skip creating statistics on those columns.

If you decide to create single-column statistics on every column of every table, you can use the stored procedure code sample `prc_sqldw_create_stats` in the [statistics](sql-data-warehouse-tables-statistics.md) article.

The following example is a good starting point for creating statistics. It creates single-column statistics on each column in the dimension table, and on each joining column in the fact tables. You can always add single or multi-column statistics to other fact table columns later on.

## Achievement unlocked!

You have successfully loaded data into your data warehouse. Great job!

## Next steps

Loading data is the first step to developing a data warehouse solution using Azure Synapse Analytics. Check out our development resources.

> [!div class="nextstepaction"]
> [Learn how to develop tables for data warehousing](sql-data-warehouse-tables-overview.md)

For more loading examples and references, view the following documentation:
- [COPY statement reference documentation](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true#syntax)
- [COPY examples for each authentication method](./quickstart-bulk-load-copy-tsql-examples.md)
- [COPY quickstart for a single table](./quickstart-bulk-load-copy-tsql.md)
