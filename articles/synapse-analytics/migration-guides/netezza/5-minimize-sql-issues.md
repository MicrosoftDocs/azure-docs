---
title: "Minimize SQL issues for Netezza migrations"
description: Learn how to minimize the risk of SQL issues when migrating from Netezza to Azure Synapse Analytics. 
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

# Minimize SQL issues for Netezza migrations

This article is part five of a seven-part series that provides guidance on how to migrate from Netezza to Azure Synapse Analytics. The focus of this article is best practices for minimizing SQL issues.

## Overview

### Characteristics of Netezza environments

> [!TIP]
> Netezza pioneered the "data warehouse appliance" concept in the early 2000s.

In 2003, Netezza initially released their data warehouse appliance product. It reduced the cost of entry and improved the ease-of-use of massively parallel processing (MPP) techniques to enable data processing at scale more efficiently than the existing mainframe or other MPP technologies available at the time. Since then, the product has evolved and has many installations among large financial institutions, telecommunications, and retail companies. The original implementation used proprietary hardware including field programmable gate arrays&mdash;or FPGAs&mdash;and was accessible via ODBC or JDBC network connection over TCP/IP.

Most existing Netezza installations are on-premises, so many users are considering migrating some or all their Netezza data to Azure Synapse Analytics to gain the benefits of a move to a modern cloud environment.

> [!TIP]
> Many existing Netezza installations are data warehouses using a dimensional data model.

Netezza technology is often used to implement a data warehouse, supporting complex analytic queries on large data volumes using SQL. Dimensional data models&mdash;star or snowflake schemas&mdash;are common, as is the implementation of data marts for individual departments.

This combination of SQL and dimensional data models simplifies migration to Azure Synapse, since the basic concepts and SQL skills are transferable. The recommended approach is to migrate the existing data model as-is to reduce risk and time taken. Even if the eventual intention is to make changes to the data model (for example, moving to a data vault model), perform an initial as-is migration and then make changes within the Azure cloud environment, leveraging the performance, elastic scalability, and cost advantages there.

While the SQL language has been standardized, individual vendors have in some cases implemented proprietary extensions. This document highlights potential SQL differences you may encounter while migrating from a legacy Netezza environment, and provides workarounds.

### Use Azure Data Factory to implement a metadata-driven migration

> [!TIP]
> Automate the migration process by using Azure Data Factory capabilities.

Automate and orchestrate the migration process by making use of the capabilities in the Azure environment. This approach also minimizes the migration's impact on the existing Netezza environment, which may already be running close to full capacity.

Azure Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Data Factory, you can create and schedule data-driven workflows&mdash;called pipelines&mdash;that can ingest data from disparate data stores. It can process and transform data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

By creating metadata to list the data tables to be migrated and their location, you can use the Data Factory facilities to manage and automate parts of the migration process. You can also use [Azure Synapse Pipelines](../../get-started-pipelines.md?msclkid=8f3e7e96cfed11eca432022bc07c18de).

## SQL DDL differences between Netezza and Azure Synapse

### SQL Data Definition Language (DDL)

> [!TIP]
> SQL DDL commands `CREATE TABLE` and `CREATE VIEW` have standard core elements but are also used to define implementation-specific options.

The ANSI SQL standard defines the basic syntax for DDL commands such as `CREATE TABLE` and `CREATE VIEW`. These commands are used within both Netezza and Azure Synapse, but they've also been extended to allow definition of implementation-specific features such as indexing, table distribution, and partitioning options.

The following sections discuss Netezza-specific options to consider during a migration to Azure Synapse.

### Table considerations

> [!TIP]
> Use existing indexes to give an indication of candidates for indexing in the migrated warehouse.

When migrating tables between different technologies, only the raw data and its descriptive metadata get physically moved between the two environments. Other database elements from the source system, such as indexes and log files, aren't directly migrated as these may not be needed or may be implemented differently within the new target environment. For example, the `TEMPORARY` option within Netezza's `CREATE TABLE` syntax is equivalent to prefixing the table name with a "#" character in Azure Synapse.

It's important to understand where performance optimizations&mdash;such as indexes&mdash;were used in the source environment. This indicates where performance optimization can be added in the new target environment. For example, if zone maps were created in the source Netezza environment, this might indicate that a non-clustered index should be created in the migrated Azure Synapse database. Other native performance optimization techniques, such as table replication, may be more applicable than a straight "like-for-like" index creation.

### Unsupported Netezza database object types

> [!TIP]
> Netezza-specific features can be replaced by Azure Synapse features.

Netezza implements some database objects that aren't directly supported in Azure Synapse, but there are methods to achieve the same functionality within the new environment:

- Zone maps: in Netezza, zone maps are automatically created and maintained for some column types and are used at query time to restrict the amount of data to be scanned. Zone maps are created on the following column types:
  - `INTEGER` columns of length 8 bytes or less.
  - Temporal columns. For instance, `DATE`, `TIME`, and `TIMESTAMP`.
  - `CHAR` columns, if these are part of a materialized view and mentioned in the `ORDER BY` clause.

  You can find out which columns have zone maps by using the `nz_zonemap` utility, which is part of the NZ Toolkit. Azure Synapse doesn't include zone maps, but you can achieve similar results by using other user-defined index types and/or partitioning.

- Clustered base tables (CBT): in Netezza, CBTs are commonly used for fact tables, which can have billions of records. Scanning such a huge table requires a lot of processing time, since a full table scan might be needed to get relevant records. Organizing records on restrictive CBT allows Netezza to group records in same or nearby extents. This process also creates zone maps that improve the performance by reducing the amount of data to be scanned.

  In Azure Synapse, you can achieve a similar effect by use of partitioning and/or use of other indexes.

- Materialized views: Netezza supports materialized views and recommends creating one or more of these over large tables having many columns where only a few of those columns are regularly used in queries. The system automatically maintains materialized views when data in the base table is updated.

  Azure Synapse supports materialized views, with the same functionality as Netezza.

### Netezza data type mapping

> [!TIP]
> Assess the impact of unsupported data types as part of the preparation phase.

Most Netezza data types have a direct equivalent in Azure Synapse. The following table shows these data types along with the recommended approach for mapping them.

| Netezza Data Type              | Azure Synapse Data Type                      |
|--------------------------------|-------------------------------------|
| BIGINT                         | BIGINT                              |
| BINARY VARYING(n)              | VARBINARY(n)                        |
| BOOLEAN                        | BIT                                 |
| BYTEINT                        | TINYINT                             |
| CHARACTER VARYING(n)           | VARCHAR(n)                          |
| CHARACTER(n)                   | CHAR(n)                             |
| DATE                           | DATE(date)                          |
| DECIMAL(p,s)                   | DECIMAL(p,s)                        |
| DOUBLE PRECISION               | FLOAT                               |
| FLOAT(n)                       | FLOAT(n)                            |
| INTEGER                        | INT                                 |
| INTERVAL                       | INTERVAL data types aren't currently directly supported in Azure Synapse but can be calculated using temporal functions such as DATEDIFF. |
| MONEY                          | MONEY                               |
| NATIONAL CHARACTER VARYING(n)  | NVARCHAR(n)                         |
| NATIONAL CHARACTER(n)          | NCHAR(n)                            |
| NUMERIC(p,s)                   | NUMERIC(p,s)                        |
| REAL                           | REAL                                |
| SMALLINT                       | SMALLINT                            |
| ST_GEOMETRY(n)                 | Spatial data types such as ST_GEOMETRY aren't currently supported in Azure Synapse, but the data could be stored as VARCHAR or VARBINARY. |
| TIME                           | TIME                                |
| TIME WITH TIME ZONE            | DATETIMEOFFSET                      |
| TIMESTAMP                      | DATETIME                            |

### Data Definition Language (DDL) generation

> [!TIP]
> Use existing Netezza metadata to automate the generation of `CREATE TABLE` and `CREATE VIEW` DDL for Azure Synapse.

Edit existing Netezza `CREATE TABLE` and `CREATE VIEW` scripts to create the equivalent definitions with modified data types as described previously if necessary. Typically, this involves removing or modifying any extra Netezza-specific clauses such as `ORGANIZE ON`.

However, all the information that specifies the current definitions of tables and views within the existing Netezza environment is maintained within system catalog tables. This is the best source of this information as it's guaranteed to be up to date and complete. Be aware that user-maintained documentation may not be in sync with the current table definitions.

Access this information by using utilities such as `nz_ddl_table` and generate the `CREATE TABLE` DDL statements. Edit these statements for the equivalent tables in Azure Synapse.

> [!TIP]
> Third-party tools and services can automate data mapping tasks.

There are [Microsoft partners](../../partner/data-integration.md) who offer tools and services to automate migration, including data-type mapping. Also, if a third-party ETL tool such as Informatica or Talend is already in use in the Netezza environment, that tool can implement any required data transformations.

## SQL DML differences between Netezza and Azure Synapse

### SQL Data Manipulation Language (DML)

> [!TIP]
> SQL DML commands `SELECT`, `INSERT`, and `UPDATE` have standard core elements but may also implement different syntax options.

The ANSI SQL standard defines the basic syntax for DML commands such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Both Netezza and Azure Synapse use these commands, but in some cases there are implementation differences.

The following sections discuss the Netezza-specific DML commands that you should consider during a migration to Azure Synapse.

### SQL DML syntax differences

Be aware of these differences in SQL Data Manipulation Language (DML) syntax between Netezza SQL and Azure Synapse when migrating:

- `STRPOS`: in Netezza, the `STRPOS` function returns the position of a substring within a string. The equivalent function in Azure Synapse is `CHARINDEX`, with the order of the arguments reversed. For example, `SELECT STRPOS('abcdef','def')...` in Netezza is equivalent to `SELECT CHARINDEX('def','abcdef')...` in Azure Synapse.

- `AGE`: Netezza supports the `AGE` operator to give the interval between two temporal values, such as timestamps or dates. For example, `SELECT AGE('23-03-1956','01-01-2019') FROM...`. In Azure Synapse, `DATEDIFF` gives the interval. For example, `SELECT DATEDIFF(day, '1956-03-26','2019-01-01') FROM...`. Note the date representation sequence.

- `NOW()`: Netezza uses `NOW()` to represent `CURRENT_TIMESTAMP` in Azure Synapse.

### Functions, stored procedures, and sequences

> [!TIP]
> As part of the preparation phase, assess the number and type of non-data objects being migrated.

When migrating from a mature legacy data warehouse environment such as Netezza, there are often elements other than simple tables and views that need to be migrated to the new target environment. Examples of this include functions, stored procedures, and sequences.

As part of the preparation phase, create an inventory of the objects that need to be migrated and define the methods for handling them. Then assign an appropriate allocation of resources in the project plan.

There may be facilities in the Azure environment that replace the functionality implemented as either functions or stored procedures in the Netezza environment. In this case, it's often more efficient to use the built-in Azure facilities rather than recoding the Netezza functions.

> [!TIP]
> Third-party products and services can automate migration of non-data elements.

[Microsoft partners](../../partner/data-integration.md) offer tools and services that can automate the migration, including the mapping of data types. Also, third-party ETL tools, such as Informatica or Talend, that are already in use in the IBM Netezza environment can implement any required data transformations.

See the following sections for more information on each of these elements.

#### Functions

As with most database products, Netezza supports system functions and user-defined functions within the SQL implementation. When migrating to another database platform such as Azure Synapse, common system functions are available and can be migrated without change. Some system functions may have slightly different syntax, but the required changes can be automated. System functions where there's no equivalent, such as arbitrary user-defined functions, may need to be recoded using the languages available in the target environment. Azure Synapse uses the popular Transact-SQL language to implement user-defined functions. Netezza user-defined functions are coded in nzlua or C++ languages.

#### Stored procedures

Most modern database products allow for procedures to be stored within the database. Netezza provides the NZPLSQL language, which is based on Postgres PL/pgSQL. A stored procedure typically contains SQL statements and some procedural logic, and may return data or a status.

Azure Synapse Analytics also supports stored procedures using T-SQL, so if you must migrate stored procedures, recode them accordingly.

#### Sequences

In Netezza, a sequence is a named database object created via `CREATE SEQUENCE` that can provide the unique value via the `NEXT VALUE FOR` method. Use these to generate unique numbers for use as surrogate key values for primary key values.

In Azure Synapse, there's no `CREATE SEQUENCE`. Sequences are handled using [IDENTITY to create surrogate keys](../../sql-data-warehouse/sql-data-warehouse-tables-identity.md) or [managed identity](../../../data-factory/data-factory-service-identity.md?tabs=data-factory) using SQL code to create the next sequence number in a series.

### Use [EXPLAIN](/sql/t-sql/queries/explain-transact-sql?msclkid=91233fc1cff011ec9dff597671b7ae97) to validate legacy SQL

> [!TIP]
> Find potential migration issues by using real queries from the existing system query logs.

Capture some representative SQL statements from the legacy query history logs to evaluate legacy Netezza SQL for compatibility with Azure Synapse. Then prefix those queries with `EXPLAIN` and&mdash;assuming a "like-for-like" migrated data model in Azure Synapse with the same table and column names&mdash;run those `EXPLAIN` statements in Azure Synapse. Any incompatible SQL will return an error. Use this information to determine the scale of the recoding task. This approach doesn't require data to be loaded into the Azure environment, only that the relevant tables and views have been created.

#### IBM Netezza to T-SQL mapping

The IBM Netezza to T-SQL compliant with Azure Synapse SQL data type mapping is in this table:

| IBM Netezza Data Type                                | Azure Synapse SQL Data Type |
|------------------------------------------------------|-----------------------------|
| array                                                | *Not supported* |
| bigint                                               | bigint |
| binary large object \[(n\[K\|M\|G\])\]               | nvarchar \[(n\|max)\] |
| blob \[(n\[K\|M\|G\])\]                              | nvarchar \[(n\|max)\] |
| byte \[(n)\]                                         | binary \[(n)\]\|varbinary(max) |
| byteint                                              | smallint |
| char varying \[(n)\]                                 | varchar \[(n\|max)\] |
| character varying \[(n)\]                            | varchar \[(n\|max)\] |
| char \[(n)\]                                         | char \[(n)\]\|varchar(max) |
| character \[(n)\]                                    | char \[(n)\]\|varchar(max) |
| character large object \[(n\[K\|M\|G\])\]            | varchar \[(n\|max) |
| clob \[(n\[K\|M\|G\])\]                              | varchar \[(n\|max) |
| dataset                                              | *Not supported* |
| date                                                 | date |
| dec \[(p\[,s\])\]                                    | decimal \[(p\[,s\])\] |
| decimal \[(p\[,s\])\]                                | decimal \[(p\[,s\])\] |
| double precision                                     | float(53) |
| float \[(n)\]                                        | float \[(n)\] |
| graphic \[(n)\]                                      | nchar \[(n)\]\| varchar(max) |
| interval                                             | *Not supported* |
| json \[(n)\]                                         | nvarchar \[(n\|max)\] |
| long varchar                                         | nvarchar(max) |
| long vargraphic                                      | nvarchar(max) |
| mbb                                                  | *Not supported* |
| mbr                                                  | *Not supported* |
| number \[((p\|\*)\[,s\])\]                           | numeric \[(p\[,s\])\]  |
| numeric \[(p \[,s\])\]                               | numeric \[(p\[,s\])\]  |
| period                                               | *Not supported* |
| real                                                 | real |
| smallint                                             | smallint |
| st_geometry                                          | *Not supported* |
| time                                                 | time |
| time with time zone                                  | datetimeoffset |
| timestamp                                            | datetime2  |
| timestamp with time zone                             | datetimeoffset |
| varbyte                                              | varbinary \[(n\|max)\] |
| varchar \[(n)\]                                      | varchar \[(n)\] |
| vargraphic \[(n)\]                                   | nvarchar \[(n\|max)\] |
| varray                                               | *Not supported* |
| xml                                                  | *Not supported* |
| xmltype                                              | *Not supported* |

## Summary

Typical existing legacy Netezza installations are implemented in a way that makes migration to Azure Synapse easy. They use SQL for analytical queries on large data volumes, and are in some form of dimensional data model. These factors make them good candidates for migration to Azure Synapse.

To minimize the task of migrating the actual SQL code, follow these recommendations:

- Initial migration of the data warehouse should be as-is to minimize risk and time taken, even if the eventual final environment will incorporate a different data model such as data vault.

- Understand the differences between Netezza SQL implementation and Azure Synapse.

- Use metadata and query logs from the existing Netezza implementation to assess the impact of the differences and plan an approach to mitigate.

- Automate the process wherever possible to minimize errors, risk, and time for the migration.

- Consider using specialist [Microsoft partners](../../partner/data-integration.md) and services to streamline the migration.

## Next steps

To learn more about Microsoft and third-party tools, see the next article in this series: [Tools for Netezza data warehouse migration to Azure Synapse Analytics](6-microsoft-third-party-migration-tools.md).