---
title: "Design and performance for Netezza migrations"
description: Learn how Netezza and Azure Synapse SQL databases differ in their approach to high query performance on exceptionally large data volumes.
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 05/24/2022
---

# Design and performance for Netezza migrations

This article is part one of a seven part series that provides guidance on how to migrate from Netezza to Azure Synapse Analytics. This article provides best practices for design and performance.

## Overview

> [!TIP]
> More than just a database&mdash;the Azure environment includes a comprehensive set of capabilities and tools.

Due to end of support from IBM, many existing users of Netezza data warehouse systems want to take advantage of the innovations provided by newer environments such as cloud, IaaS, and PaaS, and to delegate tasks like infrastructure maintenance and platform development to the cloud provider.

Although Netezza and Azure Synapse are both SQL databases designed to use massively parallel processing (MPP) techniques to achieve high query performance on exceptionally large data volumes, there are some basic differences in approach:

- Legacy Netezza systems are often installed on-premises and use proprietary hardware, while Azure Synapse is cloud based and uses Azure storage and compute resources.

- Upgrading a Netezza configuration is a major task involving additional physical hardware and potentially lengthy database reconfiguration, or dump and reload. Since storage and compute resources are separate in the Azure environment, these resources can be scaled upwards or downwards independently, leveraging the elastic scaling capability.

- Azure Synapse can be paused or resized as required to reduce resource utilization and cost.

Microsoft Azure is a globally available, highly secure, scalable cloud environment, that includes Azure Synapse and an ecosystem of supporting tools and capabilities. The next diagram summarizes the Azure Synapse ecosystem.

:::image type="content" source="../media/1-design-performance-migration/azure-synapse-ecosystem.png" border="true" alt-text="Chart showing the Azure Synapse ecosystem of supporting tools and capabilities.":::

> [!TIP]
> Azure Synapse gives best-of-breed performance and price-performance in independent benchmarks.

Azure Synapse provides best-of-breed relational database performance by using techniques such as massively parallel processing (MPP) and multiple levels of automated caching for frequently used data. See the results of this approach in independent benchmarks such as the one run recently by [GigaOm](https://research.gigaom.com/report/data-warehouse-cloud-benchmark/), which compares Azure Synapse to other popular cloud data warehouse offerings. Customers who have migrated to this environment have seen many benefits including:

- Improved performance and price/performance.

- Increased agility and shorter time to value.

- Faster server deployment and application development.

- Elastic scalability&mdash;only pay for actual usage.

- Improved security/compliance.

- Reduced storage and disaster recovery costs.

- Lower overall TCO and better cost control (OPEX).

To maximize these benefits, migrate new or existing data and applications to the Azure Synapse platform. In many organizations, this will include migrating an existing data warehouse from legacy on-premises platforms such as Netezza. At a high level, the basic process includes these steps:

:::image type="content" source="../media/1-design-performance-migration/migration-steps.png" border="true" alt-text="Diagram showing the steps for preparing to migrate, migration, and post-migration.":::

This paper looks at schema migration with a goal of equivalent or better performance of your migrated Netezza data warehouse and data marts on Azure Synapse. This paper applies specifically to migrations from an existing Netezza environment.

## Design considerations

### Migration scope

> [!TIP]
> Create an inventory of objects to be migrated and document the migration process.

#### Preparation for migration

When migrating from a Netezza environment, there are some specific topics to consider in addition to the more general subjects described in this article.

#### Choosing the workload for the initial migration

Legacy Netezza environments have typically evolved over time to encompass multiple subject areas and mixed workloads. When deciding where to start on an initial migration project, choose an area that can:

- Prove the viability of migrating to Azure Synapse by quickly delivering the benefits of the new environment.

- Allow the in-house technical staff to gain relevant experience of the processes and tools involved, which can be used in migrations to other areas.

- Create a template for further migrations specific to the source Netezza environment and the current tools and processes that are already in place.

A good candidate for an initial migration from the Netezza environment that would enable the items above, is typically one that implements a BI/Analytics workload (rather than an OLTP workload) with a data model that can be migrated with minimal modifications&mdash;normally a start or snowflake schema.

The migration data volume for the initial exercise should be large enough to demonstrate the capabilities and benefits of the Azure Synapse environment while quickly demonstrating the value&mdash;typically in the 1-10TB range.

To minimize the risk and reduce implementation time for the initial migration project, confine the scope of the migration to just the data marts. However, this won't address the broader topics such as ETL migration and historical data migration as part of the initial migration project. Address these topics in later phases of the project, once the migrated data mart layer is backfilled with the data and processes required to build them.

#### Lift and shift as-is versus a phased approach incorporating changes

> [!TIP]
> 'Lift and shift' is a good starting point, even if subsequent phases will implement changes to the data model.

Whatever the drive and scope of the intended migration, there are&mdash;broadly speaking&mdash;two types of migration:

##### Lift and shift

In this case, the existing data model&mdash;such as a star schema&mdash;is migrated unchanged to the new Azure Synapse platform. The emphasis is on minimizing risk and the migration time required by reducing the work needed to realize the benefits of moving to the Azure cloud environment.

This is a good fit for existing Netezza environments where a single data mart is being migrated, or where the data is already in a well-designed star or snowflake schema&mdash;or there are other pressures to move to a more modern cloud environment.

##### Phased approach incorporating modifications

In cases where a legacy warehouse has evolved over a long time, you might need to re-engineer to maintain the required performance levels or to support new data, such as Internet of Things (IoT) streams. Migrate to Azure Synapse to get the benefits of a scalable cloud environment as part of the re-engineering process. Migration could include a change in the underlying data model, such as a move from an Inmon model to a data vault.

Microsoft recommends moving the existing data model as-is to Azure and using the performance and flexibility of the Azure environment to apply the re-engineering changes, leveraging Azure's capabilities to make the changes without impacting the existing source system.

#### Use Azure Data Factory to implement a metadata-driven migration

Automate and orchestrate the migration process by using the capabilities of the Azure environment. This approach minimizes the impact on the existing Netezza environment, which may already be running close to full capacity.

Azure Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Data Factory, you can create and schedule data-driven workflows&mdash;called pipelines&mdash;to ingest data from disparate data stores. Data Factory can process and transform data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

By creating metadata to list the data tables to be migrated and their location, you can use the Data Factory facilities to manage the migration process.

### Design differences between Netezza and Azure Synapse

#### Multiple databases versus a single database and schemas

> [!TIP]
> Combine multiple databases into a single database in Azure Synapse and use schemas to logically separate the tables.

In a Netezza environment, there are often multiple separate databases for individual parts of the overall environment. For example, there may be a separate database for data ingestion and staging tables, a database for the core warehouse tables, and another database for data marts, sometimes called a semantic layer. Processing these as ETL/ELT pipelines may implement cross-database joins and will move data between these separate databases.

> [!TIP]
> Replace Netezza-specific features with Azure Synapse features.

Querying within the Azure Synapse environment is limited to a single database. Schemas are used to separate the tables into logically separate groups. Therefore, we recommend using a series of schemas within the target Azure Synapse to mimic any separate databases migrated from the Netezza environment. If the Netezza environment already uses schemas, you may need to use a new naming convention to move the existing Netezza tables and views to the new environment&mdash;for example, concatenate the existing Netezza schema and table names into the new Azure Synapse table name and use schema names in the new environment to maintain the original separate database names. Schema consolidation naming can have dots&mdash;however, Azure Synapse Spark may have issues. You can use SQL views over the underlying tables to maintain the logical structures, but there are some potential downsides to this approach:

- Views in Azure Synapse are read-only, so any updates to the data must take place on the underlying base tables.

- There may already be one or more layers of views in existence, and adding an extra layer of views might impact performance and supportability as nested views are difficult to troubleshoot.

#### Table considerations

> [!TIP]
> Use existing indexes to indicate candidates for indexing in the migrated warehouse.

When migrating tables between different technologies, only the raw data and the metadata that describes it gets physically moved between the two environments. Other database elements from the source system&mdash;such as indexes&mdash;aren't migrated as these may not be needed or may be implemented differently within the new target environment.

However, it's important to understand where performance optimizations such as indexes have been used in the source environment, as this can indicate where to add performance optimization in the new target environment. For example, if queries in the source Netezza environment frequently use zone maps, it may indicate that a non-clustered index should be created within the migrated Azure Synapse. Other native performance optimization techniques (such as table replication) may be more applicable that a straight 'like for like' index creation.

#### Unsupported Netezza database object types

> [!TIP]
> Assess the impact of unsupported data types as part of the preparation phase

Netezza implements some database objects that aren't directly supported in Azure Synapse, but there are methods to achieve the same functionality within the new environment:

- Zone Maps&mdash;In Netezza, zone maps are automatically created and maintained for some column types and are used at query time to restrict the amount of data to be scanned. Zone Maps are created on the following column types:
  - `INTEGER` columns of length 8 bytes or less.
  - Temporal columns. For instance, `DATE`, `TIME`, and `TIMESTAMP`.
  - `CHAR` columns, if these are part of a materialized view and mentioned in the `ORDER BY` clause.

  You can find out which columns have zone maps by using the `nz_zonemap` utility, which is part of the NZ Toolkit. Azure Synapse doesn't include zone maps, but you can achieve similar results by using other user-defined index types and/or partitioning.

- Clustered Base tables (CBT)&mdash;In Netezza, CBTs are commonly used for fact tables, which can have billions of records. Scanning such a huge table requires a lot of processing time, since a full table scan might be needed to get relevant records. Organizing records on restrictive CBT via allows Netezza to group records in same or nearby extents. This process also creates zone maps that improve the performance by reducing the amount of data to be scanned.

  In Azure Synapse, you can achieve a similar effect by use of partitioning and/or use of other indexes.

- Materialized views&mdash;Netezza supports materialized views and recommends creating one or more of these over large tables having many columns where only a few of those columns are regularly used in queries. The system automatically maintains materialized views when data in the base table is updated. 

  Azure Synapse supports materialized views, with the same functionality as Netezza.

#### Netezza data type mapping

Most Netezza data types have a direct equivalent in Azure Synapse. This table shows these data types together with the recommended approach for handling them.

| Netezza Data Type              | Azure Synapse Data Type                      |
|--------------------------------|-------------------------------------|
| BIGINT                         | BIGINT                              |
| BINARY VARYING(n)              | VARBINARY(n)                        |
| BOOLEAN                        | BIT                                 |
| BYTEINT                        | TINYINT                             |
| CHARACTER VARYING(n)           | VARCHAR(n)                          |
| CHARACTER(n)                   | CHAR(n)                             |
| DATE                           | DATE(DATE                           |
| DECIMAL(p,s)                   | DECIMAL(p,s)                        |
| DOUBLE PRECISION               | FLOAT                               |
| FLOAT(n)                       | FLOAT(n)                            |
| INTEGER                        | INT                                 |
| INTERVAL                       | INTERVAL data types aren't currently directly supported in Azure Synapse but can be calculated using temporal functions such as DATEDIFF |
| MONEY                          | MONEY                               |
| NATIONAL CHARACTER VARYING(n)  | NVARCHAR(n)                         |
| NATIONAL CHARACTER(n)          | NCHAR(n)                            |
| NUMERIC(p,s)                   | NUMERIC(p,s)                        |
| REAL                           | REAL                                |
| SMALLINT                       | SMALLINT                            |
| ST_GEOMETRY(n)                 | Spatial data types such as ST_GEOMETRY aren't currently supported in Azure Synapse, but the data could be stored as VARCHAR or VARBINARY |
| TIME                           | TIME                                |
| TIME WITH TIME ZONE            | DATETIMEOFFSET                      |
| TIMESTAMP                      | DATETIME                            |

> [!TIP]
> Assess the number and type of non-data objects to be migrated as part of the preparation phase.

There are third-party vendors who offer tools and services to automate migration, including the mapping of data types. If a third-party ETL tool such as Informatica or Talend is already in use in the Netezza environment, those tools can implement any required data transformations.

#### SQL DML syntax differences

There are a few differences in SQL Data Manipulation Language (DML) syntax between Netezza SQL and Azure Synapse (T-SQL) that you should be aware during migration:

- `STRPOS`: In Netezza, the `STRPOS` function returns the position of a substring within a string. The equivalent function in Azure Synapse is `CHARINDEX`, with the order of the arguments reversed. For example, `SELECT STRPOS('abcdef','def')...` in Netezza is equivalent to `SELECT CHARINDEX('def','abcdef')...` in Azure Synapse.

- `AGE`: Netezza supports the `AGE` operator to give the interval between two temporal values, such as timestamps or dates. For example, `SELECT AGE('23-03-1956','01-01-2019') FROM...`. In Azure Synapse, `DATEDIFF` gives the interval. For example, `SELECT DATEDIFF(day, '1956-03-26','2019-01-01') FROM...`. Note the date representation sequence.

- `NOW()`: Netezza uses `NOW()` to represent `CURRENT_TIMESTAMP` in Azure Synapse.

#### Functions, stored procedures, and sequences

> [!TIP]
> Assess the number and type of non-data objects to be migrated as part of the preparation phase.

When migrating from a mature legacy data warehouse environment such as Netezza, you must often migrate elements other than simple tables and views to the new target environment. Examples include functions, stored procedures, and sequences.

As part of the preparation phase, create an inventory of these objects to be migrated, and define the method of handling them. Assign an appropriate allocation of resources in the project plan.

There may be facilities in the Azure environment that replace the functionality implemented as functions or stored procedures in the Netezza environment. In this case, it's more efficient to use the built-in Azure facilities rather than recoding the Netezza functions.

[Data integration partners](/azure/synapse-analytics/partner/data-integration) offer tools and services that can automate the migration.

##### Functions

As with most database products, Netezza supports system functions and user-defined functions within an SQL implementation. When migrating to another database platform such as Azure Synapse, common system functions are available and can be migrated without change. Some system functions may have slightly different syntax, but the required changes can be automated if so.

For system functions where there's no equivalent, or for arbitrary user-defined functions, recode these using the language(s) available in the target environment. Netezza user-defined functions are coded in nzlua or C++ languages while Azure Synapse uses the popular Transact-SQL language to implement user-defined functions.

##### Stored procedures

Most modern database products allow for procedures to be stored within the database. Netezza provides the NZPLSQL language for this purpose. NZPLSQL is based on Postgres PL/pgSQL.

A stored procedure typically contains SQL statements and some procedural logic, and may return data or a status.

Azure Synapse Analytics also supports stored procedures using T-SQL. If you must migrate stored procedures, recode these procedures for their new environment.

##### Sequences

In Netezza, a sequence is a named database object created via `CREATE SEQUENCE` that can provide the unique value via the `NEXT VALUE FOR` method. Use these to generate unique numbers for use as surrogate key values for primary key values.

Within Azure Synapse, there's no `CREATE SEQUENCE`. Sequences are handled via use of [IDENTITY](/sql/t-sql/statements/create-table-transact-sql-identity-property?msclkid=8ab663accfd311ec87a587f5923eaa7b) columns or using SQL code to create the next sequence number in a series.

### Extracting metadata and data from a Netezza environment

#### Data Definition Language (DDL) generation

> [!TIP]
> Use Netezza external tables for most efficient data extract.

You can edit existing Netezza CREATE TABLE and CREATE VIEW scripts to create the equivalent definitions with modified data types, if necessary, as described in the previous section. Typically, this involves removing or modifying any extra Netezza-specific clauses such as `ORGANIZE ON`.

However, all the information that specifies the current definitions of tables and views within the existing Netezza environment is maintained within system catalog tables. These tables are the best source of this information, as it's guaranteed to be up to date and complete. User-maintained documentation may not be in sync with the current table definitions.

Access the information in these tables via utilities such as `nz_ddl_table` and generate the `CREATE TABLE DDL` statements for the equivalent tables in Azure Synapse.

Third-party migration and ETL tools also use the catalog information to achieve the same result.

#### Data extraction from Netezza

Migrate the raw data from existing Netezza tables into flat delimited files using standard Netezza utilities, such as nzsql, nzunload, and via external tables. Compress these files using gzip and upload them to Azure Blob Storage via AzCopy or by using Azure data transport facilities such as Azure Data Box.

During a migration exercise, extract the data as efficiently as possible. Use the external tables approach as this is the fastest method. Perform multiple extracts in parallel to maximize the throughput for data extraction.

This is a simple example of an external table extract:

```sql
CREATE EXTERNAL TABLE '/tmp/export_tab1.csv' USING (DELIM ',') AS SELECT * from <TABLENAME>;
```

If sufficient network bandwidth is available, extract data directly from an on-premises Netezza system into Azure Synapse tables or Azure Blob Data Storage by using Azure Data Factory processes or third-party data migration or ETL products.

Recommended data formats for the extracted data include delimited text files (also called Comma Separated Values or CSV), Optimized Row Columnar (ORC), or Parquet files.

For more information about the process of migrating data and ETL from a Netezza environment, see [Data migration, ETL, and load for Netezza migration](1-design-performance-migration.md).

## Performance recommendations for Netezza migrations

This article provides general information and guidelines about use of performance optimization techniques for Azure Synapse and adds specific recommendations for use when migrating from a Netezza environment.

### Similarities in performance tuning approach concepts

> [!TIP]
> Many Netezza tuning concepts hold true for Azure Synapse.

When moving from a Netezza environment, many of the performance tuning concepts for Azure Data Warehouse will be remarkably familiar. For example:

- Using data distribution to co-locate data to be joined onto the same processing node

- Using the smallest data type for a given column will save storage space and accelerate query processing

- Ensuring data types of columns to be joined are identical will optimize join processing by reducing the need to transform data for matching

- Ensuring statistics are up to date will help the optimizer produce the best execution plan

### Differences in performance tuning approach

> [!TIP]
> Prioritize early familiarity with Azure Synapse tuning options in a migration exercise.

This section highlights lower-level implementation differences between Netezza and Azure Synapse for performance tuning.

#### Data distribution options

`CREATE TABLE` statements in both Netezza and Azure Synapse allow for specification of a distribution definition&mdash;via `DISTRIBUTE ON` in Netezza, and `DISTRIBUTION =` in Azure Synapse.

Compared to Netezza, Azure Synapse provides an additional way to achieve local joins for small table-large table joins (typically dimension table to fact table in a start schema model) is to replicate the smaller dimension table across all nodes. This ensures that any value of the join key of the larger table will have a matching dimension row locally available. The overhead of replicating the dimension tables is relatively low, provided the tables aren't very large (see [Design guidance for replicated tables](/azure/synapse-analytics/sql-data-warehouse/design-guidance-for-replicated-tables))&mdash;in which case, the hash distribution approach as described previously is more appropriate. For more information, see [Distributed tables design](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-distribute).

#### Data indexing

Azure Synapse provides several user-definable indexing options, but these are different from the system managed zone maps in Netezza. To understand the different indexing options, see [table indexes](/azure/sql-data-warehouse/sql-data-warehouse-tables-index).

The existing system managed zone maps within the source Netezza environment can indicate how the data is currently used. They can identify candidate columns for indexing within the Azure Synapse environment.

#### Data partitioning

In an enterprise data warehouse, fact tables can contain many billions of rows. Partitioning optimizes the maintenance and querying of these tables by splitting them into separate parts to reduce the amount of data processed. The `CREATE TABLE` statement defines the partitioning specification for a table.

Only one field per table can be used for partitioning. This is frequently a date field since many queries are filtered by date or a date range. It's possible to change the partitioning of a table after initial load by recreating the table with the new distribution using the `CREATE TABLE AS` (or CTAS) statement. See [table partitions](/azure/sql-data-warehouse/sql-data-warehouse-tables-partition) for a detailed discussion of partitioning in Azure Synapse.

#### Data table statistics

Ensure that statistics on data tables are up to date by building in a [statistics](/azure/synapse-analytics/sql/develop-tables-statistics) step to ETL/ELT jobs.

#### PolyBase for data loading

PolyBase is the most efficient method for loading large amounts of data into the warehouse since it can leverage parallel loading streams. For more information, see [PolyBase data loading strategy](/azure/synapse-analytics/sql/load-data-overview).

#### Use Workload management

Use [Workload management](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-workload-management?context=/azure/synapse-analytics/context/context) instead of resource classes. ETL would be in its own workgroup and should be configured to have more resources per query (less concurrency by more resources). For more information, see [What is dedicated SQL pool in Azure Synapse Analytics](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is).

## Next steps

To learn more about ETL and load for Netezza migration, see the next article in this series: [Data migration, ETL, and load for Netezza migration](2-etl-load-migration-considerations.md).