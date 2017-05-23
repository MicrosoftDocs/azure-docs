---
title: Load - Azure Data Lake Store to SQL Data Warehouse | Microsoft Docs
description: Learn how to use PolyBase external tables to load data from Azure Data Lake Store into Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: ckarst
manager: barbkess
editor: ''

ms.assetid:
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: loading
ms.date: 01/25/2017
ms.author: cakarst;barbkess


---
# Load data from Azure Data Lake Store into SQL Data Warehouse
This document gives you all steps you  need to load your own data from Azure Data Lake Store (ADLS) into SQL Data Warehouse using PolyBase.
While you are able to run adhoc queries over the data stored in ADLS using the External Tables, as a best practice we suggest importing the data into the SQL Data Warehouse.
,
Time Estimate: 10 minutes assuming you have the prerequisites need to complete.
>
In this tutorial you will learn how to:

1. Create External Database objects to load from Azure Data Lake Store.
2. Connect to an Azure Data Lake Store Directory.
3. Load data into Azure SQL Data Warehouse.

## Before you begin
To run this tutorial, you need:

* Azure Active Directory Application to use for Service-to-Service authentication. To create, follow [Active directory authentication](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-authenticate-using-active-directory)

>[!NOTE] 
> You need the client ID, Key, and OAuth2.0 Token Endpoint Value of your Active Directory Application to connect to your Azure Data Lake from SQL Data Warehouse. Details for how to get these values are in the link above.

* SQL Server Management Studio or SQL Server Data Tools, to download SSMS and connect see [Query SSMS](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-query-ssms)

* An Azure SQL Data Warehouse, to create one follow: https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-get-started-provision

* An Azure Data Lake Store that does not have encryption enabled. To create one follow: https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal




## Configure the data source
PolyBase uses T-SQL external objects to define the location and attributes of the external data. The external objects are stored in SQL Data Warehouse and reference the data th is stored externally.


###  Create a credential
To access your Azure Data Lake Store, you will need to create a Database Master Key to encrypt your credential secret used in the next step.
You then create a Database scoped credential, which stores the service principal credentials set up in AAD. For those of you who have used PolyBase to connect to Windows Azure Storage Blobs, note that the credential syntax is different.
To connect to Azure Data Lake Store, you must **first** create an Azure Active Directory Application, create an access key, and grant the application access to the Azure Data Lake resource. Instrucitons to perform these steps are located [here](https://docs.microsoft.com/en-us/azure/data-lake-store/data-lake-store-authenticate-using-active-directory).

```sql
-- A: Create a Database Master Key.
-- Only necessary if one does not already exist.
-- Required to encrypt the credential secret in the next step.
-- For more information on Master Key: https://msdn.microsoft.com/en-us/library/ms174382.aspx?f=255&MSPPError=-2147217396

CREATE MASTER KEY;


-- B: Create a database scoped credential
-- IDENTITY: Pass the client id and OAuth 2.0 Token Endpoint taken from your Azure Active Directory Application
-- SECRET: Provide your AAD Application Service Principal key.
-- For more information on Create Database Scoped Credential: https://msdn.microsoft.com/en-us/library/mt270260.aspx

CREATE DATABASE SCOPED CREDENTIAL ADLCredential
WITH
    IDENTITY = '<client_id>@<OAuth_2.0_Token_EndPoint>',
    SECRET = '<key>'
;

```


### Create the external data source
Use this [CREATE EXTERNAL DATA SOURCE][CREATE EXTERNAL DATA SOURCE] command to store the location of the data, and the type of data.
You can find the ADL URI in the Azure portal and www.portal.azure.com.

```sql
-- C: Create an external data source
-- TYPE: HADOOP - PolyBase uses Hadoop APIs to access data in Azure Data Lake Store.
-- LOCATION: Provide Azure Data Lake accountname and URI
-- CREDENTIAL: Provide the credential created in the previous step.

CREATE EXTERNAL DATA SOURCE AzureDataLakeStore
WITH (
    TYPE = HADOOP,
    LOCATION = 'adl://<AzureDataLake account_name>.azuredatalakestore.net',
    CREDENTIAL = ADLCredential
);
```



## Configure data format
To import the data from ADLS, you need to specify the external file format. This command has format-specific options to describe your data.
Below is an example of a commonly used file format that is a pipe-delimited text file.
Look at our T-SQL documentation for a complete list of [CREATE EXTERNAL FILE FORMAT][CREATE EXTERNAL FILE FORMAT]

```sql
-- D: Create an external file format
-- FIELD_TERMINATOR: Marks the end of each field (column) in a delimited text file
-- STRING_DELIMITER: Specifies the field terminator for data of type string in the text-delimited file.
-- DATE_FORMAT: Specifies a custom format for all date and time data that might appear in a delimited text file.
-- Use_Type_Default: Store all Missing values as NULL

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

## Create the external tables
Now that you have specified the data source and file format, you are ready to create the external tables. External tables are how you interact with external data. PolyBase uses recursive directory traversal to read all files in all subdirectories of the directory specified in the location parameter. Also, the following example shows how to create the object. You need to customize the statement to work with the data you have in ADLS.

```sql
-- D: Create an External Table
-- LOCATION: Folder under the ADLS root folder.
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
,   DATA_SOURCE = AzureDataLakeStore
,   FILE_FORMAT = TextFileFormat
,   REJECT_TYPE = VALUE
,   REJECT_VALUE = 0
)
;

```

## External Table Considerations
Creating an external table is easy, but there are some nuances that need to be discussed.

Loading data with PolyBase is strongly typed. This means that each row of the data being ingested must satisfy the table schema definition.
If a given row does not match the schema definition, the row is rejected from the load.

The REJECT_TYPE and REJECT_VALUE options allow you to define how many rows or what percentage of the data must be present in the final table.
During load, if the reject value is reached, the load fails. The most common cause of rejected rows is a schema definition mismatch.
For example, if a column is incorrectly given the schema of int when the data in the file is a string, every row will fail to load.

The Location specifies the topmost directory that you want to read data from.
In this case, if there were subdirectories under /DimProduct/ PolyBase would import all the data within the subdirectories.

## Load the data
To load data from Azure Data Lake Store use the [CREATE TABLE AS SELECT (Transact-SQL)][CREATE TABLE AS SELECT (Transact-SQL)] statement. Loading with CTAS uses the strongly typed external table you have created.

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
By default, SQL Data Warehouse stores the table as a clustered columnstore index. After a load completes, some of the data rows might not be compressed into the columnstore.  There's a variety of reasons why this can happen. To learn more, see [manage columnstore indexes][manage columnstore indexes].

To optimize query performance and columnstore compression after a load, rebuild the table to force the columnstore index to compress all the rows.

```sql

ALTER INDEX ALL ON [dbo].[DimProduct] REBUILD;

```

For more information on maintaining columnstore indexes, see the [manage columnstore indexes][manage columnstore indexes] article.

## Optimize statistics
It is best to create single-column statistics immediately after a load. There are some choices for statistics. For example, if you create single-column statistics on every column it might take a long time to rebuild all the statistics. If you know certain columns are not going to be in query predicates, you can skip creating statistics on those columns.

If you decide to create single-column statistics on every column of every table, you can use the stored procedure code sample `prc_sqldw_create_stats` in the [statistics][statistics] article.

The following example is a good starting point for creating statistics. It creates single-column statistics on each column in the dimension table, and on each joining column in the fact tables. You can always add single or multi-column statistics to other fact table columns later on.


## Achievement unlocked!
You have successfully loaded data into Azure SQL Data Warehouse. Great job!

##Next Steps
Loading data is the first step to developing a data warehouse solution using SQL Data Warehouse. Check out our development resources on [Tables](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-overview) and [T-SQL](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-develop-loops.md).


<!--Image references-->

<!--Article references-->
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
[Load data into SQL Data Warehouse]: sql-data-warehouse-overview-load.md
[SQL Data Warehouse development overview]: sql-data-warehouse-overview-develop.md
[manage columnstore indexes]: sql-data-warehouse-tables-index.md
[Statistics]: sql-data-warehouse-tables-statistics.md
[CTAS]: sql-data-warehouse-develop-ctas.md
[label]: sql-data-warehouse-develop-label.md

<!--MSDN references-->
[CREATE EXTERNAL DATA SOURCE]: https://msdn.microsoft.com/library/dn935022.aspx
[CREATE EXTERNAL FILE FORMAT]: https://msdn.microsoft.com/library/dn935026.aspx
[CREATE TABLE AS SELECT (Transact-SQL)]: https://msdn.microsoft.com/library/mt204041.aspx
[sys.dm_pdw_exec_requests]: https://msdn.microsoft.com/library/mt203887.aspx
[REBUILD]: https://msdn.microsoft.com/library/ms188388.aspx

<!--Other Web references-->
[Microsoft Download Center]: http://www.microsoft.com/download/details.aspx?id=36433
[Load the full Contoso Retail Data Warehouse]: https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/contoso-data-warehouse/readme.md
