---
title: Create and use external tables in Synapse SQL pool
description: In this section, you'll learn how to create and use external tables in Synapse SQL pool.
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 02/02/2022
ms.author: vvasic
ms.reviewer: sngun, wiassaf
ms.custom: ignite-fall-2021
---

# Create and use native external tables using SQL pools in Azure Synapse Analytics

In this section, you'll learn how to create and use [native external tables](develop-tables-external-tables.md) in Synapse SQL pools. Native external tables have better performance when compared to external tables with `TYPE=HADOOP` in their external data source definition. This is because native external tables use native code to access external data. 

External tables are useful when you want to control access to external data in Synapse SQL pool. External tables are also useful if you want to use tools, such as Power BI, in conjunction with Synapse SQL pool. External tables can access two types of storage:
- Public storage where users access public storage files.
- Protected storage where users access storage files using SAS credential, Azure AD identity, or Managed Identity of Synapse workspace.

> [!NOTE]
> In dedicated SQL pools you can only use native external tables with a Parquet file type, and this feature is in **public preview**. If you want to use generally available Parquet reader functionality in dedicated SQL pools, or you need to access CSV or ORC files, use Hadoop external tables. Native external tables are generally available in serverless SQL pools.
> Learn more about the differences between native and Hadoop external tables in [Use external tables with Synapse SQL](develop-tables-external-tables.md).

The following table lists the data formats supported:

|Data format (Native external tables)  |Serverless SQL pool |Dedicated SQL pool |
|---------|---------|---------|
|Parquet |  Yes (GA)  | Yes (public preview)  |
|CSV  |  Yes  |  No (Alternatively, use [Hadoop external tables](develop-tables-external-tables.md?tabs=hadoop)) |
|delta  |  Yes  |  No  |
|Spark  |  Yes  | No |
|Dataverse |  Yes | No  |
|Azure Cosmos DB data formats (JSON, BSON etc.)  |  No (Alternatively, [create views](query-cosmos-db-analytical-store.md?tabs=openrowset-credential#create-view)) | No  |

## Prerequisites

Your first step is to create a database where the tables will be created. Before creating a database scoped credential, the database must have a master key to protect the credential. For more information on this, see [CREATE MASTER KEY &#40;Transact-SQL&#41;](/sql/t-sql/statements/create-master-key-transact-sql). Then create the following objects that are used in this sample:
- DATABASE SCOPED CREDENTIAL `sqlondemand` that enables access to SAS-protected `https://sqlondemandstorage.blob.core.windows.net` Azure storage account.

    ```sql
    CREATE DATABASE SCOPED CREDENTIAL [sqlondemand]
    WITH IDENTITY='SHARED ACCESS SIGNATURE',  
    SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
    ```

- EXTERNAL DATA SOURCE `sqlondemanddemo` that references demo storage account protected with SAS key, and EXTERNAL DATA SOURCE `nyctlc` that references publicly available Azure storage account on location `https://azureopendatastorage.blob.core.windows.net/nyctlc/`.

    ```sql
    CREATE EXTERNAL DATA SOURCE SqlOnDemandDemo WITH (
        LOCATION = 'https://sqlondemandstorage.blob.core.windows.net',
        CREDENTIAL = sqlondemand
    );
    GO
    CREATE EXTERNAL DATA SOURCE nyctlc
    WITH ( LOCATION = 'https://azureopendatastorage.blob.core.windows.net/nyctlc/')
    GO
    CREATE EXTERNAL DATA SOURCE DeltaLakeStorage
    WITH ( location = 'https://sqlondemandstorage.blob.core.windows.net/delta-lake/' );
    ```

- File formats `QuotedCSVWithHeaderFormat` and `ParquetFormat` that describe CSV and parquet file types.

    ```sql
    CREATE EXTERNAL FILE FORMAT QuotedCsvWithHeaderFormat
    WITH (  
        FORMAT_TYPE = DELIMITEDTEXT,
        FORMAT_OPTIONS ( FIELD_TERMINATOR = ',', STRING_DELIMITER = '"', FIRST_ROW = 2   )
    );
    GO
    CREATE EXTERNAL FILE FORMAT ParquetFormat WITH (  FORMAT_TYPE = PARQUET );
    GO
    CREATE EXTERNAL FILE FORMAT DeltaLakeFormat WITH (  FORMAT_TYPE = DELTA );
    GO
    ```

The queries in this article will be executed on your sample database and use these objects. 

## External table on a file

You can create external tables that access data on an Azure storage account that allows access to users with some Azure AD identity or SAS key. You can create external tables the same way you create regular SQL Server external tables. 

The following query creates an external table that reads *population.csv* file from SynapseSQL demo Azure storage account that is referenced using `sqlondemanddemo` data source and protected with database scoped credential called `sqlondemand`. 

Data source and database scoped credential are created in [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql).

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created. 

```sql
USE [mydbname];
GO
CREATE EXTERNAL TABLE populationExternalTable
(
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
    [year] smallint,
    [population] bigint
)
WITH (
    LOCATION = 'csv/population/population.csv',
    DATA_SOURCE = sqlondemanddemo,
    FILE_FORMAT = QuotedCSVWithHeaderFormat
);
```

Native CSV tables are currently available only in the serverless SQL pools.

## External table on a set of files

You can create external tables that read data from a set of files placed on Azure storage:

```sql
CREATE EXTERNAL TABLE Taxi (
     vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2, 
     pickup_datetime DATETIME2, 
     dropoff_datetime DATETIME2,
     passenger_count INT,
     trip_distance FLOAT,
     fare_amount FLOAT,
     tip_amount FLOAT,
     tolls_amount FLOAT,
     total_amount FLOAT
) WITH (
         LOCATION = 'yellow/puYear=*/puMonth=*/*.parquet',
         DATA_SOURCE = nyctlc,
         FILE_FORMAT = ParquetFormat
);
```

You can specify the pattern that the files must satisfy in order to be referenced by the external table. The pattern is required only for Parquet and CSV tables. If you are using Delta Lake format, you need to specify just a root folder, and the external table will automatically find the pattern.

> [!NOTE]
> The table is created on partitioned folder structure, but you cannot leverage some partition elimination. If you want to get better performance by skipping the files that do not satisfy some criterion (like specific year or month in this case), use [views on external data](create-use-views.md#partitioned-views).

## External table on appendable files

The files that are referenced by an external table should not be changed while the query is running. In the long-running query, SQL pool may retry reads, read parts of the files, or even read the file multiple times. Changes of the file content would cause wrong results. Therefore, the SQL pool fails the query if detects that the modification time of any file is changed during the query execution.
In some scenarios you might want to create a table on the files that are constantly appended. To avoid the query failures due to constantly appended files, you can specify that the external table should ignore potentially inconsistent reads using the `TABLE_OPTIONS` setting.


```sql
CREATE EXTERNAL TABLE populationExternalTable
(
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
    [year] smallint,
    [population] bigint
)
WITH (
    LOCATION = 'csv/population/population.csv',
    DATA_SOURCE = sqlondemanddemo,
    FILE_FORMAT = QuotedCSVWithHeaderFormat,
    TABLE_OPTIONS = N'{"READ_OPTIONS":["ALLOW_INCONSISTENT_READS"]}'
);
```

The `ALLOW_INCONSISTENT_READS` read option will disable file modification time check during the query lifecycle and read whatever is available in the files that are referenced by the external table. In appendable files, the existing content is not updated, and only new rows are added. Therefore, the probability of wrong results is minimized compared to the updateable files. This option might enable you to read the frequently appended files without handling the errors.

This option is available only in the external tables created on CSV file format.

> [!NOTE]
> As the option name implies, the creator of the table accepts a risk that the results might not be consistent. In the appendable files, you might get incorrect results if you force multiple read of the underlying files by self-joining the table. In most of the "classic" queries, the external table will just ignore some rows that are appended while the query was running.

## Delta Lake external table

External tables can be created on top of a Delta Lake folder. The only difference between the external tables created on a [single file](#external-table-on-a-file) or a [file set](#external-table-on-a-set-of-files) and the external tables created on a Delta Lake format is that in Delta Lake external table you need to reference a folder containing the Delta Lake structure.

> [!div class="mx-imgBorder"]
>![ECDC COVID-19 Delta Lake folder](./media/shared/covid-delta-lake-studio.png)

An example of a table definition created on a Delta Lake folder is:

```sql
CREATE EXTERNAL TABLE Covid (
     date_rep date,
     cases int,
     geo_id varchar(6)
) WITH (
        LOCATION = 'covid', --> the root folder containing the Delta Lake files
        data_source = DeltaLakeStorage,
        FILE_FORMAT = DeltaLakeFormat
);
```

External tables cannot be created on a partitioned folder. Review the other known issues on [Synapse serverless SQL pool self-help page](resources-self-help-sql-on-demand.md#delta-lake).

### Delta tables on partitioned folders

External tables in serverless SQL pools do not support partitioning on Delta Lake format. Use [Delta partitioned views](create-use-views.md#delta-lake-partitioned-views) instead of tables if you have partitioned Delta Lake data sets. 
 
> [!IMPORTANT]
> Do not create external tables on partitioned Delta Lake folders even if you see that they might work in some cases. Using unsupported features like external tables on partitioned delta folders might cause issues or instability of the serverless pool. Azure support will not be able to resolve any issue if it is using tables on partitioned folders. You would be asked to transition to [Delta partitioned views](create-use-views.md#delta-lake-partitioned-views) and rewrite your code to use only the supported feature before proceeding with issue resolution.

## Use an external table

You can use [external tables](develop-tables-external-tables.md) in your queries the same way you use them in SQL Server queries.

The following query demonstrates this using the *population* external table we created in previous section. It returns country/region names with their population in 2019 in descending order.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

SELECT
    country_name, population
FROM populationExternalTable
WHERE
    [year] = 2019
ORDER BY
    [population] DESC;
```

Performance of this query might vary depending on region. Your workspace might not be placed in the same region as the Azure storage accounts used in these samples. For production workloads, place your Synapse workspace and Azure storage in the same region.

## Next steps

For information on how to store results of a query to storage, refer to [Store query results to the storage](../sql/create-external-table-as-select.md) article.
