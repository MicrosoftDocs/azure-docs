---
title: "Minimize SQL issues for Teradata migrations"
description: Learn how to minimize the risk of SQL issues when migrating from Teradata to Azure Synapse Analytics. 
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 06/01/2022
---

# Minimize SQL issues for Teradata migrations

This article is part five of a seven-part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. The focus of this article is best practices for minimizing SQL issues.

## Overview

### Characteristics of Teradata environments

> [!TIP]
> Teradata pioneered large scale SQL databases using MPP in the 1980s.

In 1984, Teradata initially released their database product. It introduced massively parallel processing (MPP) techniques to enable data processing at a scale more efficiently than the existing mainframe technologies available at the time. Since then, the product has evolved and has many installations among large financial institutions, telecommunications, and retail companies. The original implementation used proprietary hardware and was channel attached to mainframes&mdash;typically IBM or IBM-compatible processors.

While more recent announcements have included network connectivity and the availability of the Teradata technology stack in the cloud (including Azure), most existing installations are on premises, so many users are considering migrating some or all their Teradata data to Azure Synapse Analytics to gain the benefits of a move to a modern cloud environment.

> [!TIP]
> Many existing Teradata installations are data warehouses using a dimensional data model.

Teradata technology is often used to implement a data warehouse, supporting complex analytic queries on large data volumes using SQL. Dimensional data models&mdash;star or snowflake schemas&mdash;are common, as is the implementation of data marts for individual departments.

This combination of SQL and dimensional data models simplifies migration to Azure Synapse, since the basic concepts and SQL skills are transferable. The recommended approach is to migrate the existing data model as-is to reduce risk and time taken. Even if the eventual intention is to make changes to the data model (for example, moving to a data vault model), perform an initial as-is migration and then make changes within the Azure cloud environment, leveraging the performance, elastic scalability, and cost advantages there.

While the SQL language has been standardized, individual vendors have in some cases implemented proprietary extensions. This document highlights potential SQL differences you may encounter while migrating from a legacy Teradata environment, and provides workarounds.

### Use an Azure VM Teradata instance as part of a migration

> [!TIP]
> Use an Azure VM to create a temporary Teradata instance to speed up migration and minimize impact on the source system.

Leverage the Azure environment when running a migration from an on-premises Teradata environment. Azure provides affordable cloud storage and elastic scalability to create a Teradata instance within a VM in Azure, collocated with the target Azure Synapse environment.

With this approach, standard Teradata utilities such as Teradata Parallel Data Transporter (or third-party data replication tools such as Attunity Replicate) can be used to efficiently move the subset of Teradata tables that are to be migrated onto the VM instance, and then all migration tasks can take place within the Azure environment. This approach has several benefits:

- After the initial replication of data, the source system isn't impacted by the migration tasks.

- The familiar Teradata interfaces, tools, and utilities are available within the Azure environment.

- Once in the Azure environment there are no potential issues with network bandwidth availability between the on-premises source system and the cloud target system.

- Tools such as Azure Data Factory can efficiently call utilities such as Teradata Parallel Transporter to migrate data quickly and easily.

- The migration process is orchestrated and controlled entirely within the Azure environment.

### Use Azure Data Factory to implement a metadata-driven migration

> [!TIP]
> Automate the migration process by using Azure Data Factory capabilities.

Automate and orchestrate the migration process by making use of the capabilities in the Azure environment. This approach also minimizes the migration's impact on the existing Teradata environment, which may already be running close to full capacity.

Azure Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Data Factory, you can create and schedule data-driven workflows&mdash;called pipelines&mdash;that can ingest data from disparate data stores. It can process and transform data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

By creating metadata to list the data tables to be migrated and their location, you can use the Data Factory facilities to manage and automate parts of the migration process. You can also use [Azure Synapse Pipelines](../../get-started-pipelines.md?msclkid=8f3e7e96cfed11eca432022bc07c18de).

## SQL DDL differences between Teradata and Azure Synapse

### SQL Data Definition Language (DDL)

> [!TIP]
> SQL DDL commands `CREATE TABLE` and `CREATE VIEW` have standard core elements but are also used to define implementation-specific options.

The ANSI SQL standard defines the basic syntax for DDL commands such as `CREATE TABLE` and `CREATE VIEW`. These commands are used within both Teradata and Azure Synapse, but they've also been extended to allow definition of implementation-specific features such as indexing, table distribution, and partitioning options.

The following sections discuss Teradata-specific options to consider during a migration to Azure Synapse.

### Table considerations

> [!TIP]
> Use existing indexes to give an indication of candidates for indexing in the migrated warehouse.

When migrating tables between different technologies, only the raw data and its descriptive metadata get physically moved between the two environments. Other database elements from the source system, such as indexes and log files, aren't directly migrated as these may not be needed or may be implemented differently within the new target environment. For example, there's no equivalent of the `MULTISET` option within Teradata's `CREATE TABLE` syntax.

It's important to understand where performance optimizations&mdash;such as indexes&mdash;were used in the source environment. This indicates where performance optimization can be added in the new target environment. For example, if a non-unique secondary index (NUSI) has been created in the source Teradata environment, this might indicate that a non-clustered index should be created in the migrated Azure Synapse database. Other native performance optimization techniques, such as table replication, may be more applicable than a straight "like-for-like" index creation.

### Unsupported Teradata table types

> [!TIP]
> Standard tables within Azure Synapse can support migrated Teradata time-series and temporal tables.

Teradata includes support for special table types for time-series and temporal data. The syntax and some of the functions for these table types aren't directly supported within Azure Synapse, but the data can be migrated into a standard table with appropriate data types and indexing or partitioning on the date/time column.

Teradata implements the temporal query functionality via query rewriting to add additional filters within a temporal query to limit the applicable date range. If this functionality is currently in use within the source Teradata environment and is to be migrated, then this additional filtering will need to be added into the relevant temporal queries.

The Azure environment also includes specific features for complex analytics on time-series data at scale called [time series insights](https://azure.microsoft.com/services/time-series-insights/)&mdash;this is aimed at IoT data analysis applications and may be more appropriate for this use-case.

<a id="teradata-data-type-mapping"></a>
### Unsupported Teradata data types

> [!TIP]
> Assess the impact of unsupported data types as part of the preparation phase.

Most Teradata data types have a direct equivalent in Azure Synapse. The following table shows the Teradata data types that are unsupported in Azure Synapse together with the recommended mapping. In the table, Teradata column type is the type that's stored within the system catalog&mdash;for example, in `DBC.ColumnsV`.

| Teradata column type | Teradata data type | Azure Synapse data type |
|----------------------|--------------------|----------------|
| ++ | TD_ANYTYPE | Not supported in Azure Synapse |
| A1 | ARRAY | Not supported in Azure Synapse |
| AN | ARRAY | Not supported in Azure Synapse |
| AT | TIME | TIME |
| BF | BYTE | BINARY |
| BO | BLOB | BLOB data type isn't directly supported but can be replaced with BINARY. |
| BV | VARBYTE | BINARY |
| CF | VARCHAR | CHAR |
| CO | CLOB | CLOB data type isn't directly supported but can be replaced with VARCHAR. |
| CV | VARCHAR | VARCHAR |
| D  | DECIMAL | DECIMAL |
| DA | DATE | DATE |
| DH | INTERVAL DAY TO HOUR | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| DM | INTERVAL DAY TO MINUTE | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| DS | INTERVAL DAY TO SECOND | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| DT | DATASET | DATASET data type is supported in Azure Synapse. |
| DY | INTERVAL DAY | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| F  | FLOAT | FLOAT |
| HM | INTERVAL HOUR TO MINUTE | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| HR | INTERVAL HOUR | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| HS | INTERVAL HOUR TO SECOND | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| I1 | BYTEINT | TINYINT |
| I2 | SMALLINT | SMALLINT |
| I8 | BIGINT | BIGINT |
| I  | INTEGER | INT |
| JN | JSON | JSON data type isn't currently directly supported within Azure Synapse, but JSON data can be stored in a VARCHAR field. |
| MI | INTERVAL MINUTE | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| MO | INTERVAL MONTH | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| MS | INTERVAL MINUTE TO SECOND | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| N  | NUMBER | NUMERIC |
| PD | PERIOD(DATE) | Can be converted to VARCHAR or split into two separate dates |
| PM | PERIOD (TIMESTAMP WITH TIME ZONE) | Can be converted to VARCHAR or split into two separate timestamps (DATETIMEOFFSET) |
| PS | PERIOD(TIMESTAMP) | Can be converted to VARCHAR or split into two separate timestamps (DATETIMEOFFSET) |
| PT | PERIOD(TIME) | Can be converted to VARCHAR or split into two separate times |
| PZ | PERIOD (TIME WITH TIME ZONE) | Can be converted to VARCHAR or split into two separate times but WITH TIME ZONE isn't supported for TIME |
| SC | INTERVAL SECOND | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison  functions (for example, DATEDIFF and DATEADD). |
| SZ | TIMESTAMP WITH  TIME ZONE | DATETIMEOFFSET |
| TS | TIMESTAMP | DATETIME or DATETIME2 |
| TZ | TIME WITH TIME ZONE | TIME WITH TIME ZONE isn't supported because TIME is stored using \"wall clock\" time only without a time zone offset. |
| XM | XML | XML data type isn't currently directly supported within Azure Synapse, but XML data can be stored in a VARCHAR field. |
| YM | INTERVAL YEAR TO MONTH | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |
| YR | INTERVAL YEAR | INTERVAL data types aren't supported in Azure Synapse, but date calculations can be done with the date comparison functions (for example, DATEDIFF and DATEADD). |

Use the metadata from the Teradata catalog tables to determine whether any of these data types are to be migrated and allow for this in the migration plan. For example, use a SQL query like this one to find any occurrences of unsupported data types that need attention.

```sql
SELECT
ColumnType, CASE
WHEN ColumnType = '++' THEN 'TD_ANYTYPE' 
WHEN ColumnType = 'A1' THEN 'ARRAY' WHEN 
ColumnType = 'AN' THEN 'ARRAY' WHEN 
ColumnType = 'BO' THEN 'BLOB'
WHEN ColumnType = 'CO' THEN 'CLOB'
WHEN ColumnType = 'DH' THEN 'INTERVAL DAY TO HOUR' WHEN 
ColumnType = 'DM' THEN 'INTERVAL DAY TO MINUTE' WHEN 
ColumnType = 'DS' THEN 'INTERVAL DAY TO SECOND' WHEN
ColumnType = 'DT' THEN 'DATASET'
WHEN ColumnType = 'DY' THEN 'INTERVAL DAY'
WHEN ColumnType = 'HM' THEN 'INTERVAL HOUR TO MINUTE' WHEN
ColumnType = 'HR' THEN 'INTERVAL HOUR'
WHEN ColumnType = 'HS' THEN 'INTERVAL HOUR TO SECOND' WHEN
ColumnType = 'JN' THEN 'JSON'
WHEN ColumnType = 'MI' THEN 'INTERVAL MINUTE' WHEN 
ColumnType = 'MO' THEN 'INTERVAL MONTH'
WHEN ColumnType = 'MS' THEN 'INTERVAL MINUTE TO SECOND' WHEN
ColumnType = 'PD' THEN 'PERIOD(DATE)'
WHEN ColumnType = 'PM' THEN 'PERIOD (TIMESTAMP WITH TIME ZONE)'
WHEN ColumnType = 'PS' THEN 'PERIOD(TIMESTAMP)' WHEN 
ColumnType = 'PT' THEN 'PERIOD(TIME)'
WHEN ColumnType = 'PZ' THEN 'PERIOD (TIME WITH TIME ZONE)' WHEN
ColumnType = 'SC' THEN 'INTERVAL SECOND'
WHEN ColumnType = 'SZ' THEN 'TIMESTAMP WITH TIME ZONE' WHEN
ColumnType = 'XM' THEN 'XML'
WHEN ColumnType = 'YM' THEN 'INTERVAL YEAR TO MONTH' WHEN
ColumnType = 'YR' THEN 'INTERVAL YEAR'
END AS Data_Type,
COUNT (*) AS Data_Type_Count FROM
DBC.ColumnsV
WHERE DatabaseName IN ('UserDB1', 'UserDB2', 'UserDB3') -- select databases to be migrated
GROUP BY 1,2
ORDER BY 1;
```

> [!TIP]
> Third-party tools and services can automate data mapping tasks.

There are third-party vendors who offer tools and services to automate migration, including the mapping of data types. If a third-party ETL tool such as Informatica or Talend is already in use in the Teradata environment, those tools can implement any required data transformations.

### Data Definition Language (DDL) generation

> [!TIP]
> Use existing Teradata metadata to automate the generation of `CREATE TABLE` and `CREATE VIEW DDL` for Azure Synapse.

Edit existing Teradata `CREATE TABLE` and `CREATE VIEW` scripts to create the equivalent definitions with modified data types as described previously if necessary. Typically, this involves removing extra Teradata-specific clauses such as `FALLBACK` or `MULTISET`.

However, all the information that specifies the current definitions of tables and views within the existing Teradata environment is maintained within system catalog tables. This is the best source of this information as it's guaranteed to be up to date and complete. Be aware that user-maintained documentation may not be in sync with the current table definitions.

Access this information via views onto the catalog such as `DBC.ColumnsV` and generate the equivalent `CREATE TABLE` DDL statements for the equivalent tables in Azure Synapse.

> [!TIP]
> Third-party tools and services can automate data mapping tasks.

There are [Microsoft partners](../../partner/data-integration.md) who offer tools and services to automate migration, including data-type mapping. Also, if a third-party ETL tool such as Informatica or Talend is already in use in the Teradata environment, that tool can implement any required data transformations.

## SQL DML differences between Teradata and Azure Synapse

### SQL Data Manipulation Language (DML)

> [!TIP]
> SQL DML commands `SELECT`, `INSERT`, and `UPDATE` have standard core elements but may also implement different syntax options.

The ANSI SQL standard defines the basic syntax for DML commands such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Both Teradata and Azure Synapse use these commands, but in some cases there are implementation differences.

The following sections discuss the Teradata-specific DML commands that you should consider during a migration to Azure Synapse.

### SQL DML syntax differences

Be aware of these differences in SQL Data Manipulation Language (DML) syntax between Teradata SQL and Azure Synapse (T-SQL) when migrating:

- `QUALIFY`: Teradata supports the `QUALIFY` operator. For example:

  ```sql
  SELECT col1
  FROM tab1
  WHERE col1='XYZ'
  QUALIFY ROW_NUMBER () OVER (PARTITION by
  col1 ORDER BY col1) = 1;
  ```

  The equivalent Azure Synapse syntax is:

  ```sql
  SELECT * FROM (
  SELECT col1, ROW_NUMBER () OVER (PARTITION by col1 ORDER BY col1) rn
  FROM tab1 WHERE col1='XYZ'
  ) WHERE rn = 1;
  ```

- Date arithmetic: Azure Synapse has operators such as `DATEADD` and `DATEDIFF` which can be used on `DATE` or `DATETIME` fields. Teradata supports direct subtraction on dates such as `SELECT DATE1 - DATE2 FROM...`

- In `GROUP BY` ordinal, explicitly provide the T-SQL column name.

- `LIKE ANY`: Teradata supports `LIKE ANY` syntax such as:

  ```sql
  SELECT * FROM CUSTOMER
  WHERE POSTCODE LIKE ANY
  ('CV1%', 'CV2%', 'CV3%');
  ```

  The equivalent in Azure Synapse syntax is:

  ```sql
  SELECT * FROM CUSTOMER
  WHERE
  (POSTCODE LIKE 'CV1%') OR (POSTCODE LIKE 'CV2%') OR (POSTCODE LIKE 'CV3%');
  ```

- Depending on system settings, character comparisons in Teradata may be case insensitive by default. In Azure Synapse, character comparisons are always case sensitive.

### Use EXPLAIN to validate legacy SQL

> [!TIP]
> Use real queries from the existing system query logs to find potential migration issues.

One way of testing legacy Teradata SQL for compatibility with Azure Synapse is to capture some representative SQL statements from the legacy system query logs, prefix those queries with [EXPLAIN](/sql/t-sql/queries/explain-transact-sql?msclkid=91233fc1cff011ec9dff597671b7ae97), and (assuming a "like-for-like" migrated data model in Azure Synapse with the same table and column names) run those `EXPLAIN` statements in Azure Synapse. Any incompatible SQL will throw an error&mdash;use this information to determine the scale of the recoding task. This approach doesn't require that data is loaded into the Azure environment, only that the relevant tables and views have been created.

### Functions, stored procedures, triggers, and sequences

> [!TIP]
> As part of the preparation phase, assess the number and type of non-data objects being migrated.

When migrating from a mature legacy data warehouse environment such as Teradata, there are often elements other than simple tables and views that need to be migrated to the new target environment. Examples of this include functions, stored procedures, triggers, and sequences.

As part of the preparation phase, create an inventory of the objects that need to be migrated and define the methods for handling them. Then assign an appropriate allocation of resources in the project plan.

There may be facilities in the Azure environment that replace the functionality implemented as either functions or stored procedures in the Teradata environment. In this case, it's often more efficient to use the built-in Azure facilities rather than recoding the Teradata functions.

> [!TIP]
> Third-party products and services can automate migration of non-data elements.

[Microsoft partners](../../partner/data-integration.md) offer tools and services that can automate the migration.

See the following sections for more information on each of these elements.

#### Functions

As with most database products, Teradata supports system functions and user-defined functions within the SQL implementation. When migrating to another database platform such as Azure Synapse, common system functions are available and can be migrated without change. Some system functions may have slightly different syntax, but the required changes can be automated. System functions where there's no equivalent, such as arbitrary user-defined functions, may need to be recoded using the languages available in the target environment. Azure Synapse uses the popular Transact-SQL language to implement user-defined functions.

#### Stored procedures

Most modern database products allow for procedures to be stored within the database. Teradata provides the SPL language for this purpose. A stored procedure typically contains SQL statements and some procedural logic, and may return data or a status.

The dedicated SQL pools of Azure Synapse Analytics also support stored procedures using T-SQL, so if you must migrate stored procedures, recode them accordingly.

#### Triggers

Azure Synapse doesn't support the creation of triggers, but you can implement them within Azure Data Factory.

#### Sequences

Azure Synapse sequences are handled in a similar way to Teradata, using [IDENTITY to create surrogate keys](../../sql-data-warehouse/sql-data-warehouse-tables-identity.md) or [managed identity](../../../data-factory/data-factory-service-identity.md?tabs=data-factory).

#### Teradata to T-SQL mapping

This table shows the Teradata to T-SQL compliant with Azure Synapse SQL data type mapping:

| Teradata Data Type                     | Azure Synapse SQL Data Type |
|----------------------------------------|-----------------------------|
| bigint                                 | bigint |
| bool                                   | bit |
| boolean                                | bit |
| byteint                                | tinyint |
| char \[(*p*)\]                         | char \[(*p*)\] |
| char varying \[(*p*)\]                 | varchar \[(*p*)\] |
| character \[(*p*)\]                    | char \[(*p*)\] |
| character varying \[(*p*)\]            | varchar \[(*p*)\] |
| date                                   | date |
| datetime                               | datetime |
| dec \[(*p*\[,*s*\])\]                  | decimal \[(*p*\[,*s*\])\]  |
| decimal \[(*p*\[,*s*\])\]              | decimal \[(*p*\[,*s*\])\] |
| double                                 | float(53) |
| double precision                       | float(53) |
| float \[(*p*)\]                        | float \[(*p*)\] |
| float4                                 | float(53) |
| float8                                 | float(53) |
| int                                    | int |
| int1                                   | tinyint  |
| int2                                   | smallint |
| int4                                   | int  |
| int8                                   | bigint  |
| integer                                | integer |
| interval                               | *Not supported* |
| national char varying \[(*p*)\]        | nvarchar \[(*p*)\]  |
| national character \[(*p*)\]           | nchar \[(*p*)\] |
| national character varying \[(*p*)\]   | nvarchar \[(*p*)\] |
| nchar \[(*p*)\]                        | nchar \[(*p*)\] |
| numeric \[(*p*\[,*s*\])\]              | numeric \[(*p*\[,*s*\]) |
| nvarchar \[(*p*)\]                     | nvarchar \[(*p*)\] |
| real                                   | real |
| smallint                               | smallint |
| time                                   | time |
| time with time zone                    | datetimeoffset |
| time without time zone                 | time |
| timespan                               | *Not supported* |
| timestamp                              | datetime2 |
| timetz                                 | datetimeoffset |
| varchar \[(*p*)\]                      | varchar \[(*p*)\] |

## Summary

Typical existing legacy Teradata installations are implemented in a way that makes migration to Azure Synapse easy. They use SQL for analytical queries on large data volumes, and are in some form of dimensional data model. These factors make them good candidates for migration to Azure Synapse.

To minimize the task of migrating the actual SQL code, follow these recommendations:

- Initial migration of the data warehouse should be as-is to minimize risk and time taken, even if the eventual final environment will incorporate a different data model such as data vault.

- Consider using a Teradata instance in an Azure VM as a stepping stone as part of the migration process.

- Understand the differences between Teradata SQL implementation and Azure Synapse.

- Use metadata and query logs from the existing Teradata implementation to assess the impact of the differences and plan an approach to mitigate.

- Automate the process wherever possible to minimize errors, risk, and time for the migration.

- Consider using specialist [Microsoft partners](../../partner/data-integration.md) and services to streamline the migration.

## Next steps

To learn more about Microsoft and third-party tools, see the next article in this series: [Tools for Teradata data warehouse migration to Azure Synapse Analytics](6-microsoft-third-party-migration-tools.md).