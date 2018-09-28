---
title: 'Tutorial: Load from Azure Data Lake Storage Gen1 to Azure SQL Data Warehouse | Microsoft Docs'
description: Use PolyBase external tables to load data from Azure Data Lake Storage Gen1 into Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ckarst
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: cakarst
ms.reviewer: igorstan
---

# Load data from Azure Data Lake Storage Gen1 to SQL Data Warehouse
Use PolyBase external tables to load data from Azure Data Lake Storage Gen1 into Azure SQL Data Warehouse. Although you can run adhoc queries on data stored in Data Lake Storage Gen1, we recommend importing the data into the SQL Data Warehouse for best performance.

> [!div class="checklist"]
> * Create database objects required to load from Data Lake Storage Gen1.
> * Connect to a Data Lake Storage Gen1 directory.
> * Load data into Azure SQL Data Warehouse.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Before you begin
Before you begin this tutorial, download and install the newest version of [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS).

To run this tutorial, you need:

* Azure Active Directory Application to use for Service-to-Service authentication. To create, follow [Active directory authentication](../data-lake-store/data-lake-store-authenticate-using-active-directory.md)

>[!NOTE] 
> You need the client ID, Key, and OAuth2.0 Token Endpoint Value of your Active Directory Application to connect to your Data Lake Storage Gen1 account from SQL Data Warehouse. Details for how to get these values are in the link above. For Azure Active Directory App Registration use the Application ID as the Client ID.
> 

* An Azure SQL Data Warehouse. See [Create and query and Azure SQL Data Warehouse](create-data-warehouse-portal.md).

* A Data Lake Storage Gen1 account. See [Get started with Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-get-started-portal.md). 

##  Create a credential
To access your Data Lake Storage Gen1 account, you will need to create a Database Master Key to encrypt your credential secret used in the next step. You then create a Database Scoped Credential, which stores the service principal credentials set up in AAD. For those of you who have used PolyBase to connect to Windows Azure Storage Blobs, note that the credential syntax is different.

To connect to Data Lake Storage Gen1, you must **first** create an Azure Active Directory Application, create an access key, and grant the application access to the Data Lake Storage Gen1 resource. For instructions, see [Authenticate to Azure Data Lake Storage Gen1 Using Active Directory](../data-lake-store/data-lake-store-authenticate-using-active-directory.md).

```sql
-- A: Create a Database Master Key.
-- Only necessary if one does not already exist.
-- Required to encrypt the credential secret in the next step.
-- For more information on Master Key: https://msdn.microsoft.com/library/ms174382.aspx?f=255&MSPPError=-2147217396

CREATE MASTER KEY;


-- B: Create a database scoped credential
-- IDENTITY: Pass the client id and OAuth 2.0 Token Endpoint taken from your Azure Active Directory Application
-- SECRET: Provide your AAD Application Service Principal key.
-- For more information on Create Database Scoped Credential: https://msdn.microsoft.com/library/mt270260.aspx

CREATE DATABASE SCOPED CREDENTIAL ADLSG1Credential
WITH
    IDENTITY = '<client_id>@<OAuth_2.0_Token_EndPoint>',
    SECRET = '<key>'
;

-- It should look something like this:
CREATE DATABASE SCOPED CREDENTIAL ADLSG1Credential
WITH
    IDENTITY = '536540b4-4239-45fe-b9a3-629f97591c0c@https://login.microsoftonline.com/42f988bf-85f1-41af-91ab-2d2cd011da47/oauth2/token',
    SECRET = 'BjdIlmtKp4Fpyh9hIvr8HJlUida/seM5kQ3EpLAmeDI='
;
```

## Create the external data source
Use this [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql) command to store the location of the data. 

```sql
-- C: Create an external data source
-- TYPE: HADOOP - PolyBase uses Hadoop APIs to access data in Azure Data Lake Storage Gen1.
-- LOCATION: Provide Data Lake Storage Gen1 account name and URI
-- CREDENTIAL: Provide the credential created in the previous step.

CREATE EXTERNAL DATA SOURCE AzureDataLakeStorageGen1
WITH (
    TYPE = HADOOP,
    LOCATION = 'adl://<datalakestoregen1accountname>.azuredatalakestore.net',
    CREDENTIAL = ADLSG1Credential
);
```

## Configure data format
To import the data from Data Lake Storage Gen1, you need to specify the External File Format. This object defines how the files are written in Data Lake Storage Gen1.
For the complete list, look at our T-SQL documentation [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql)

```sql
-- D: Create an external file format
-- FIELD_TERMINATOR: Marks the end of each field (column) in a delimited text file
-- STRING_DELIMITER: Specifies the field terminator for data of type string in the text-delimited file.
-- DATE_FORMAT: Specifies a custom format for all date and time data that might appear in a delimited text file.
-- Use_Type_Default: Store missing values as default for datatype.

CREATE EXTERNAL FILE FORMAT TextFileFormat
WITH
(   FORMAT_TYPE = DELIMITEDTEXT
,    FORMAT_OPTIONS    (   FIELD_TERMINATOR = '|'
                    ,    STRING_DELIMITER = ''
                    ,    DATE_FORMAT         = 'yyyy-MM-dd HH:mm:ss.fff'
                    ,    USE_TYPE_DEFAULT = FALSE
                    )
);
```

## Create the External Tables
Now that you have specified the data source and file format, you are ready to create the external tables. External tables are how you interact with external data. The location parameter can specify a file or a directory. If it specifies a directory, all files within the directory will be loaded.

```sql
-- D: Create an External Table
-- LOCATION: Folder under the Data Lake Storage Gen1 root folder.
-- DATA_SOURCE: Specifies which Data Source Object to use.
-- FILE_FORMAT: Specifies which File Format Object to use
-- REJECT_TYPE: Specifies how you want to deal with rejected rows. Either Value or percentage of the total
-- REJECT_VALUE: Sets the Reject value based on the reject type.

-- DimProduct
CREATE EXTERNAL TABLE [dbo].[DimProduct_external] (
    [ProductKey] [int] NOT NULL,
    [ProductLabel] [nvarchar](255) NULL,
    [ProductName] [nvarchar](500) NULL
)
WITH
(
    LOCATION='/DimProduct/'
,   DATA_SOURCE = AzureDataLakeStorageGen1
,   FILE_FORMAT = TextFileFormat
,   REJECT_TYPE = VALUE
,   REJECT_VALUE = 0
)
;

```

## External Table Considerations
Creating an external table is easy, but there are some nuances that need to be discussed.

External Tables are strongly typed. This means that each row of the data being ingested must satisfy the table schema definition.
If a row does not match the schema definition, the row is rejected from the load.

The REJECT_TYPE and REJECT_VALUE options allow you to define how many rows or what percentage of the data must be present in the final table. During load, if the reject value is reached, the load fails. The most common cause of rejected rows is a schema definition mismatch. For example, if a column is incorrectly given the schema of int when the data in the file is a string, every row will fail to load.

Data Lake Storage Gen1 uses Role Based Access Control (RBAC) to control access to the data. This means that the Service Principal must have read permissions to the directories defined in the location parameter and to the children of the final directory and files. This enables PolyBase to authenticate and load that data. 

## Load the data
To load data from Data Lake Storage Gen1 use the [CREATE TABLE AS SELECT (Transact-SQL)](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse) statement. 

CTAS creates a new table and populates it with the results of a select statement. CTAS defines the new table to have the same columns and data types as the results of the select statement. If you select all the columns from an external table, the new table is a replica of the columns and data types in the external table.

In this example, we are creating a hash distributed table called DimProduct from our External Table DimProduct_external.

```sql

CREATE TABLE [dbo].[DimProduct]
WITH (DISTRIBUTION = HASH([ProductKey]  ) )
AS
SELECT * FROM [dbo].[DimProduct_external]
OPTION (LABEL = 'CTAS : Load [dbo].[DimProduct]');
```


## Optimize columnstore compression
By default, SQL Data Warehouse stores the table as a clustered columnstore index. After a load completes, some of the data rows might not be compressed into the columnstore.  There's a variety of reasons why this can happen. To learn more, see [manage columnstore indexes](sql-data-warehouse-tables-index.md).

To optimize query performance and columnstore compression after a load, rebuild the table to force the columnstore index to compress all the rows.

```sql

ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD;

```

## Optimize statistics
It is best to create single-column statistics immediately after a load. There are some choices for statistics. For example, if you create single-column statistics on every column it might take a long time to rebuild all the statistics. If you know certain columns are not going to be in query predicates, you can skip creating statistics on those columns.

If you decide to create single-column statistics on every column of every table, you can use the stored procedure code sample `prc_sqldw_create_stats` in the [statistics](sql-data-warehouse-tables-statistics.md) article.

The following example is a good starting point for creating statistics. It creates single-column statistics on each column in the dimension table, and on each joining column in the fact tables. You can always add single or multi-column statistics to other fact table columns later on.

## Achievement unlocked!
You have successfully loaded data into Azure SQL Data Warehouse. Great job!

## Next steps 
In this tutorial, you created external tables to define the structure for data stored in Data Lake Storage Gen1, and then used the PolyBase CREATE TABLE AS SELECT statement to load data into your data warehouse. 

You did these things:
> [!div class="checklist"]
> * Created database objects required to load from Data Lake Storage Gen1.
> * Connected to a Data Lake Storage Gen1 directory.
> * Loaded data into Azure SQL Data Warehouse.
> 

Loading data is the first step to developing a data warehouse solution using SQL Data Warehouse. Check out our development resources.

> [!div class="nextstepaction"]
>[Learn how to develop tables in SQL Data Warehouse](sql-data-warehouse-tables-overview.md)




