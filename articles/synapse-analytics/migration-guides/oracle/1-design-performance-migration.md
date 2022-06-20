---
title: "Design and performance for Oracle migrations"
description: Learn how Oracle and Azure Synapse SQL databases differ in their approach to high query performance on exceptionally large data volumes.
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 06/30/2022
---

# Design and performance for Oracle migrations

This article is part one of a seven-part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. The focus of this article is best practices for design and performance.

## Overview

Due to the cost and complexity of maintaining and upgrading legacy on-premises Oracle environments, many existing Oracle users want to take advantage of the innovations provided by newer cloud environments. The newer cloud environments, such as cloud, IaaS, and PaaS, let you delegate tasks like infrastructure maintenance and platform development to the cloud provider.

>[!TIP]
>More than just a database&mdash;the Azure environment includes a comprehensive set of capabilities and tools.

Although Oracle and Azure Synapse Analytics are both SQL databases designed to use massively parallel processing (MPP) techniques to achieve high query performance on exceptionally large data volumes, there are some basic differences in approach:

- Legacy Oracle systems are often installed on-premises and use relatively expensive hardware, while Azure Synapse is cloud-based and uses Azure storage and compute resources.

- Upgrading an Oracle configuration is a major task involving extra physical hardware and potentially lengthy database reconfiguration, or dump and reload. Since storage and compute resources are separate in the Azure environment and have elastic scaling capability, those resources can be scaled upwards or downwards independently.

- You can pause or resize Azure Synapse as required to reduce resource utilization and cost.

Microsoft Azure is a globally available, highly secure, scalable cloud environment that includes Azure Synapse and an ecosystem of supporting tools and capabilities. The next diagram summarizes the Azure Synapse ecosystem.

:::image type="content" source="../media/1-design-performance-migration/azure-synapse-ecosystem.png" border="true" alt-text="Chart showing the Azure Synapse ecosystem of supporting tools and capabilities.":::

Azure Synapse provides best-of-breed relational database performance by using techniques such as massively parallel processing (MPP) and automatic in-memory caching. You can see the results of these techniques in independent benchmarks such as the one run recently by [GigaOm](https://research.gigaom.com/report/data-warehouse-cloud-benchmark/), which compares Azure Synapse to other popular cloud data warehouse offerings. Customers who have migrated to this environment have seen many benefits including:

- Improved performance and price/performance.

- Increased agility and shorter time to value.

- Faster server deployment and application development.

- Elastic scalability&mdash;only pay for actual usage.

- Improved security/compliance.

- Reduced storage and disaster recovery costs.

- Lower overall TCO, better cost control, and streamlined operational expenditure (OPEX).

To maximize these benefits, migrate new or existing data and applications to the Azure Synapse platform. In many organizations, migration will include moving an existing data warehouse from legacy on-premises platforms such as Oracle to Azure Synapse. At a high level, the migration process includes these steps:

:::image type="content" source="../media/1-design-performance-migration/migration-steps.png" border="true" alt-text="Diagram showing the steps for preparing to migrate, migration, and post-migration.":::

This article provides general information and guidelines for performance optimization when migrating a data warehouse from an existing Oracle environment to Azure Synapse. The goal of performance optimization is to achieve the same or better data warehouse performance in Azure Synapse.

## Design considerations

### Migration scope

#### Preparation for migration

When migrating from an Oracle environment, consider the following migration decisions.

#### Choose the workload for the initial migration

Legacy Oracle environments have typically evolved over time to encompass multiple subject areas and mixed workloads. When deciding where to start on an initial migration project, choose an area in which you'll be able to:

- Prove the viability of migration to Azure Synapse by quickly delivering the benefits of the new environment.

- Allow the in-house technical staff to gain relevant experience with the processes and tools that they'll use when migrating other areas.

- Create a template for further migrations specific to the source Oracle environment and the current tools and processes that are already in place.

A good candidate for an initial migration from an Oracle environment supports the preceding items. Typically, good candidates implement a BI/Analytics workload rather than an on-line transaction processing workload. Good candidates also have a data model, such as a star or snowflake schema, which can be migrated with minimal modification.

>[!TIP]
> Create an inventory of objects that need to be migrated and document the migration process.

The volume of migrated data in an initial migration should be large enough to demonstrate the capabilities and benefits of the Azure Synapse environment while quickly demonstrating value&mdash;typically in the 1-10 TB range.

To minimize the risk and reduce the implementation time for your initial project, confine the scope of the initial migration to just the data marts. Since this approach won't address the broader aspects like ETL migration and historical data migration, address those aspects in later phases of the project once the migrated data mart layer is backfilled with data and required build processes.

#### Lift and shift as-is vs a phased approach that incorporates changes

Whatever the drivers and scope of the intended migration, broadly speaking there are two types of migration:

##### Lift and shift

For a lift and shift migration, an existing data model like a star schema is migrated unchanged to the new Azure Synapse platform. Try to minimize the risk, effort, and migration time needed to see the benefits of moving to the Azure cloud environment. Lift and shift migration is a good fit for these scenarios:

- An existing Oracle environment with a single data mart to migrate, or
- An existing Oracle environment with data that's already in a well-designed star or snowflake schema, or
- When you're under time and cost pressures to move to a modern cloud environment. To automate aspects of the migration, use Microsoft [SQL Server Migration Assistant](/download/details.aspx?id=54258) (SSMA) for Oracle.

>[!TIP]
>Lift and shift is a good starting point even if subsequent phases implement changes to the data model.

##### Phased approach incorporating modifications

If a legacy warehouse has evolved over a long time, you might need to re-engineer to maintain the required performance levels or to support new data, such as Internet of Things (IoT) streams. Migrate to Azure Synapse to get the benefits of a scalable cloud environment as part of the re-engineering process. Migration could include a change in the underlying data model, such as a move from an Inmon model to a data vault.

Microsoft recommends moving the existing data model as-is to Azure and using the performance and flexibility of the Azure environment to apply the re-engineering changes. That way, you can use Azure's capabilities to make the changes without impacting the existing source system.

#### Use Microsoft facilities to implement a metadata-driven migration

Automate and orchestrate the migration process by using the capabilities of the Azure environment. This approach minimizes the performance hit on the existing Oracle environment, which may already be running close to capacity.

SSMA can automate many parts of the migration process and supports Azure Synapse as a target environment.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-server-migration-assistant-1.png" border="true" alt-text="Screenshot showing how SQL Server Migration Assistant for Oracle can automate many parts of the migration process.":::

Azure Data Factory is a cloud-based data integration service that lets you create data-driven workflows in the cloud to orchestrate and automate data movement and data transformation. You can use Data Factory to create and schedule data-driven workflows (pipelines) that ingest data from disparate data stores. Data Factory can process and transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning. Azure also includes Migration Services to help you plan and perform a migration from environments like Oracle.

To use these Azure facilities to manage the migration process, create metadata that lists the data tables for migration and their location.

### Design differences between Oracle and Azure Synapse 

#### Multiple databases vs single database and schemas

Combine multiple databases into a single database within Azure Synapse and use schema names to logically separate the tables

The Oracle environment often contains multiple separate databases. For example, there may be a separate database for data ingestion and staging tables, a database for the core warehouse tables, and another database for data marts (sometimes called a semantic layer). By using ETL/ELT pipelines, you can implement cross-database joins and move data between these separate databases.

The Azure Synapse environment contains a single database and uses schemas to separate the tables into logically separate groups. Therefore, we recommendation that you use a series of schemas within the target Azure Synapse database to mimic any separate databases that are migrated from the Oracle environment. If the Oracle environment already uses schemas, you may need to use a new naming convention to move the existing Oracle tables and views to the new environment. For example, you can concatenate the existing Oracle schema and table names into the new Azure Synapse table name and use schema names in the new environment to maintain the original separate database names. Although you can use SQL views on top of the underlying tables to maintain the logical structures, there are some potential downsides to this approach:

- Views in Azure Synapse are read-only, so any updates to the data must take place on the underlying base tables.

- There may already be one or more layers of views in existence, and adding an extra layer of views might affect performance.

#### Table considerations

When you migrate tables between different environments, typically only the raw data and the metadata that describes it gets physically moved. Other database elements from the source system, like indexes, usually aren't migrated because they might be unneeded or implemented differently in the new environment.

>[!TIP]
>Use existing indexes to indicate candidates for indexing in the migrated warehouse.

It's important to understand where performance optimizations, such as indexes, have been used in the source environment since they indicate where to add performance optimization in the new target environment. For example, if bit-mapped indexes are frequently used by queries within the source Oracle environment, it may indicate that a non-clustered index should be created within Azure Synapse. Other native performance optimization techniques, such as table replication, may be more applicable than a straight like-for-like index creation. You can use SSMA for Oracle to get migration recommendations for table distribution and indexing.

#### Unsupported Oracle database object types

Oracle-specific features can generally be replaced by Azure Synapse features. The following Oracle database objects aren't directly supported in Azure Synapse. The list of unsupported database objects describes how you can achieve the same functionality in Azure Synapse.

- Indexing options: in Oracle, several indexing options, such as bit-mapped indexes, function-based indexes, and domain indexes, have no direct equivalent in Azure Synapse.

  You can find out which columns are indexed and the index type by querying system catalog tables and views, such as `ALL_INDEXES`, `DBA_INDEXES`, `USER_INDEXES`, and `DBA_IND_COL`, or by using the built-in queries in [Oracle SQL Developer](https://www.oracle.com/database/technologies/appdev/sqldeveloper-landing.html).
  
  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-queries-1.png" border="true" alt-text="Screenshot showing how to query system catalog tables and views in Oracle SQL Developer.":::

  Another way that you can find all indexes of a given type is by running a query like:

  ```sql
  SELECT \* FROM dba_indexes WHERE index_type LIKE 'FUNCTION-BASED%';
  ```
  
  Function-based indexes (the index contains the result of a function on the underlying data columns) have no direct equivalent in Azure Synapse. We recommendation that you migrate the data and then test the Oracle environment queries that use function-based indexes in Azure Synapse. You might find that Azure Synapse performance is acceptable. If that's not the case, consider creating a column that contains the pre-calculated value and index that instead. You can also find out which indexes are used by querying the `dba_index_usage` or `v$object_usage` views if monitoring has been enabled:

  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-queries-2.png" border="true" alt-text="Screenshot showing how to find out which indexes are used in Oracle SQL Developer.":::

  When setting up the Synapse environment, it only makes sense to implement the indexes that are used. Azure Synapse currently supports the following index types:

  :::image type="content" source="../media/1-design-performance-migration/azure-synapse-analytics-index-types.png" border="true" alt-text="Screenshot showing the index types that Azure Synapse Analytics supports.":::

  Azure Synapse features like parallel query processing and in-memory caching of data and results make it likely that fewer indexes are required for data warehouse applications to achieve performance goals. We recommend that you use these index definitions in Synapse:

  - **Clustered columnstore indexes**: Azure Synapse by default creates a clustered columnstore index when no index options are specified for a table. Clustered columnstore tables offer the highest level of data compression and the best overall query performance. Clustered columnstore tables generally outperform clustered index or heap tables, and are usually the best choice for large tables. For these reasons, choose clustered columnstore when you're unsure how to index your table. However, there are some scenarios where clustered columnstore tables aren't the best option:

    - Tables with varchar(max), nvarchar(max), or varbinary(max) data types because those types aren't supported with a clustered columnstore index. Instead, consider using a heap or clustered index.
    - Tables with transient data because columnstore tables could be less efficient than heap or temporary tables.
    - Small tables with less than 100 million rows. Instead, consider using heap tables.

  - **Clustered and nonclustered indexes**: clustered indexes can outperform clustered columnstore tables when a single row needs to be quickly retrieved. For queries where a single or few row lookups must perform at extreme speed, consider a cluster index or nonclustered secondary index. The disadvantage of using a clustered index is that only queries that use a highly selective filter on the clustered index column will benefit from that index type. To improve filtering on other columns, add a nonclustered index to other columns. However, each index that's added to a table adds both space and processing time to loads.
  
  - **Heap tables**: when you're temporarily landing data on Azure Synapse, you might find that using a heap table makes the overall process faster. The faster speed would be because loading data to heap tables is faster than loading data to index tables, and in some cases the subsequent read can be done from cache. If you're loading data only to stage it before running more transformations, loading to a heap table is much faster than loading to a clustered columnstore table. Also, loading data to a [temporary table](../../sql-data-warehouse/sql-data-warehouse-tables-temporary.md) is faster than loading a table to permanent storage. For small lookup tables of less than 100 million rows, heap tables are usually the right choice. Cluster columnstore tables begin to achieve optimal compression when they exceed 100 million rows.

- Clustered tables: Oracle tables can be organized so that rows of tables that are frequently accessed together (based on a common value) are physically stored together. This strategy reduces disk I/O when data is retrieved. Oracle also has a hash-cluster option for individual tables, which applies a hash value to the cluster key and physically stores rows with the same hash value together. To list clusters within an Oracle database, use the `SELECT \* FROM DBA_CLUSTERS;` query. To determine whether a table is within a cluster use the query `SELECT \* FROM TAB;`, which will show the table name and cluster ID for each table. 

  In Azure Synapse, you can achieve a similar effect by using materialized and/or replicated tables to minimize the I/O required at query run time.

- Materialized views: Oracle supports materialized views and recommends one or more of them for large tables with many columns where only a few columns are regularly used in queries. Materialized views are automatically refreshed by the system when data in the base table is updated.

  In 2019, Microsoft announced that Azure Synapse will support materialized views with the same functionality as in Oracle. Materialized views are now a preview feature in Azure Synapse.

- In-database triggers: a trigger in Oracle automatically runs when a triggering event occurs. The event can be:

  - A data manipulation language (DML) statement, such as `INSERT`, `UPDATE`, or `DELETE`, runs on a table. As an example, if you define a trigger that fires before an `INSERT` statement on a customer table, the trigger will fire once before a new row is inserted into the customer table.

  - A data definition language (DDL) statement, such as `CREATE` or `ALTER`, runs. These triggers are often used for auditing purposes to record changes to the schema.

  - A system event such as startup or shutdown of the Oracle Database.

  - A user event such as login or logout.

  You can get a list of the triggers that are defined in an Oracle database by querying the `ALL_TRIGGERS`, `DBA_TRIGGERS`, or `USER_TRIGGERS` views. The next screenshot shows a `DBA_TRIGGERS` query in Oracle SQL Developer.

  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-triggers.png" border="true" alt-text="Screenshot showing how to query for a list of triggers in Oracle SQL Developer.":::

  Azure Synapse doesn't support Oracle's database trigger features, but you can add equivalent functionality by using Data Factory&mdash;although doing so will require refactoring the processes that use triggers.

- Synonyms: Oracle supports defining synonyms as alternative names for several database object types. Such types include a table, view, sequence, procedure, stored function, package, materialized view, Java class schema object, or a user-defined object type.

  Azure Synapse doesn't currently support this feature, although if a synonym in Oracle refers to a table or view, then you can define a view in Azure Synapse to provide that alternative name. If a synonym in Oracle refers to a function or stored procedure, then you can replace the synonym in Azure Synapse by creating another function or procedure that calls the target.

- User-defined types: Oracle supports defining user-defined objects that can contain a series of individual fields, each with their own definition and default values. These user-defined objects can then be referenced within a table definition in the same way as built-in data types like `NUMBER` or `VARCHAR`. You can get a list of user-defined types within an Oracle database by querying the `ALL_TYPES`, `DBA_TYPES`, or `USER_TYPES` views.

  Azure Synapse doesn't currently support this feature. So, if the data you need to migrate includes user-defined data types, either "flatten" them into a conventional table definition, or for arrays of data, normalize them in a separate table.

#### Oracle data type mapping

Most Oracle data types have a direct equivalent in the Azure Synapse. The following table shows the recommended approach for mapping Oracle data types to Azure Synapse.

| Oracle Data Type | Azure Synapse Data Type |
|-|-|
| BFILE | Not supported. Map to VARBINARY (MAX). |
| BINARY_FLOAT | Not supported. Map to FLOAT. |
| BINARY_DOUBLE | Not supported. Map to DOUBLE. |
| BLOB | Not directly supported. Replace with VARBINARY(MAX). |
| CHAR | CHAR |
| CLOB | Not directly supported. Replace with VARCHAR(MAX). |
| DATE | DATE in Oracle can also contain time information. Depending on usage map to DATE or TIMESTAMP. |
| DECIMAL | DECIMAL |
| DOUBLE | PRECISION DOUBLE |
| FLOAT | FLOAT |
| INTEGER | INT |
| INTERVAL YEAR TO MONTH | INTERVAL data types aren't supported. Use date comparison functions, such as DATEDIFF or DATEADD, for date calculations. |
| INTERVAL DAY TO SECOND | INTERVAL data types aren't supported. Use date comparison functions, such as DATEDIFF or DATEADD, for date calculations. |
| LONG | Not supported. Map to VARCHAR(MAX). |
| LONG RAW | Not supported. Map to VARBINARY(MAX). |
| NCHAR | NCHAR |
| NVARCHAR2 | NVARCHAR |
| NUMBER | NUMBER |
| NCLOB | Not directly supported. Replace with NVARCHAR(MAX). |
| NUMERIC | NUMERIC |
| ORD media data types | Not supported |
| RAW | Not supported. Map to VARBINARY. |
| REAL | REAL |
| ROWID | Not supported. Map to GUID, which is similar. |
| SDO Geospatial data types | Not supported |
| SMALLINT | SMALLINT |
| TIMESTAMP | DATETIME2 or the CURRENT_TIMESTAMP() function |
| TIMESTAMP WITH LOCAL TIME ZONE | Not supported. Map to DATETIMEOFFSET. |
| TIMESTAMP WITH TIME ZONE | Not supported because TIME is stored using wall-clock time without a time zone offset. |
| URIType | Not supported. Store in a VARCHAR. |
| UROWID | Not supported. Map to GUID, which is similar. |
| VARCHAR | VARCHAR |
| VARCHAR2 | VARCHAR |
| XMLType | Not supported. Store XML data in a VARCHAR. |

>[!TIP]
>Assess the number and type of unsupported data types during your preparation phase.

Third-party vendors offer tools and services to automate migration, including the mapping of data types. If a third-party ETL tool such as Informatica or Talend is already in use in the Oracle environment, use those tools to implement any required data transformations.

#### SQL DML syntax differences

There are a few differences in SQL Data Manipulation Language (DML) syntax between Oracle SQL and Azure Synapse (T-SQL). These differences are discussed in detail in [Minimize SQL issues for Oracle migrations](5-minimize-sql-issues.md#sql-ddl-differences-between-oracle-and-azure-synapse). In some cases, you can automate DML migration using Microsoft tools like SSMA for Oracle or [Azure Database Migration Services](/services/database-migration/), or by using [third-party](../../partner/data-integration.md) migration products and services.

#### Functions, stored procedures, and sequences

If you migrate from a mature legacy data warehouse environment such as Oracle, you'll probably need to migrate elements other than simple tables and views. Functions, stored procedures, and sequences are examples of such elements in Oracle.

Check whether the Azure environment contains facilities that replace the functionality of functions or stored procedures in the Oracle environment. If that's the case, then usually it's more efficient to use the built-in Azure facilities rather than recode the Oracle functions. [Data integration partners](../../partner/data-integration.md) like Attunity and WhereScape offer tools and services that can automate the migration of functions, stored procedures, and sequences.

As part of your preparation phase, create an inventory of objects to be migrated, define a method for handling them, and allocate appropriate resources in your project plan.

The following sections discuss the migration of functions, stored procedures, and sequences in more detail.

##### Functions

As with most database products, Oracle supports system functions and user-defined functions within a SQL implementation. When you migrate a legacy database platform to Azure Synapse, common system functions are available and can be migrated without change. Some system functions may have slightly different syntax, but the required changes can be automated in this case. You can get a list of functions within an Oracle database by querying the `ALL_OBJECTS` view with the appropriate WHERE clause.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-functions.png" border="true" alt-text="Screenshot showing how to query for a list of functions in Oracle SQL Developer.":::

For system functions where there's no equivalent, or for arbitrary user-defined functions, recode those functions using the language(s) available in the target environment. Oracle user-defined functions are coded in PL/SQL, Java, or C. Azure Synapse uses the popular Transact-SQL language to implement user-defined functions.

As with most database products, Teradata supports system functions and user-defined functions within a SQL implementation. When migrating to Azure Synapse, you can migrate common system functions without change. Some system functions in Azure Synapse may have slightly different syntax, in which case you can automate the syntax conversion.

##### Stored procedures

Most modern database products support storing procedures within the database. Oracle provides the PL/SQL language for this purpose. A stored procedure typically contains both SQL statements and procedural logic and returns data or a status. You can get a list of stored procedures within an Oracle database by querying the `ALL_OBJECTS` view with the appropriate WHERE clause.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-procedures.png" border="true" alt-text="Screenshot showing how to query for a list of stored procedures in Oracle SQL Developer.":::

Azure Synapse supports stored procedures using T-SQL, so you can recode any stored procedures that need to be migrated.

##### Sequences

In Oracle, a sequence is a named database object created using `CREATESEQUENCE` that can provide unique numeric values via the `CURRVAL` and `NEXTVAL` methods. You can use the unique numbers as surrogate key values for primary keys. Azure Synapse doesn't implement `CREATE SEQUENCE` and instead you can handle sequences using `IDENTITY` columns or SQL code that generates the next sequence number in a series.

### Extracting metadata and data from an Oracle environment

#### Data Definition Language (DDL) generation

Typically, you can edit existing Oracle `CREATE TABLE` and `CREATE VIEW` scripts to create equivalent definitions in Azure Synapse. You might need to use some modified data types as mentioned in [Oracle data type mapping](#oracle-data-type-mapping) by removing or modifying Oracle-specific clauses, such as `TABLESPACE`.

Within the Oracle environment, the system catalog tables specify the current table and view definition. Unlike user-maintained documentation, system catalog information is always complete and in sync with the current table definitions. You can access system catalog information by using utilities such as Oracle SQL Developer, which can generate `CREATE TABLE` DDL statements. You can edit those DDL statements so they apply to the equivalent tables in Azure Synapse.

Alternatively, you can use SSMA for Oracle to migrate tables from an existing Oracle environment to Azure Synapse. SSMA for Oracle will apply the appropriate data type mappings and recommended table and distribution types.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-server-migration-assistant-2.png" border="true" alt-text="Screenshot showing how to migrate tables from and existing Oracle environment to Azure Synapse using SQL Server Migration Assistant for Oracle.":::

Third-party migration and ETL tools also use the system catalog information to achieve the same result.

#### Data extraction from Oracle

For the Oracle tables that you want to migrate to Azure Synapse, you can extract raw table data to flat delimited files, such as CSV files, using standard Oracle utilities. Oracle SQL Developer, [SQLPlus](https://www.oracle.com/database/technologies/instant-client/downloads.html), and [SCLcl](https://www.oracle.com/database/technologies/appdev/sqlcl.html) can perform the extraction. Compress the flat delimited files using gzip, and upload them to Azure Blob Storage using AzCopy or Azure data transport tools like Azure Data Box.

During a migration, extract table data as efficiently as possible&mdash;especially when extracting data from large fact tables. For Oracle tables, use parallelism to maximize extraction throughput. You can achieve parallelism by running multiple processes that individually extract discrete segments of data, or by using tools capable of automating parallel extraction through partitioning.

>[!TIP]
>Use parallelism for the most efficient data extraction.

If sufficient network bandwidth exists, you can extract data from an on-premises Oracle system directly into Azure Synapse tables or Azure Blob Data Storage. To do so, use Data Factory processes, [Azure Database Migration Service](/services/database-migration), or third-party data migration or ETL products such as Informatica and Talend.

The recommended data format for extracted data files is delimited text such as CSV, Optimized Row Columnar (ORC), or Parquet.

For more information on migrating data and ETL from an Oracle environment, see [Data migration, ETL, and load for Oracle migrations](2-etl-load-migration-considerations.md).

## Performance recommendations for Oracle migrations

The goal of performance optimization is to achieve the same or better data warehouse performance after migration to Azure Synapse.

### Similarities in performance tuning approach concepts

Many performance tuning concepts for databases in Oracle hold true for Azure Synapse. For example:

- To collocate data to be joined onto the same processing node, use data distribution.

- To save storage space and accelerate query processing, use the smallest data type for a given column.

- To optimize join processing and reduce the need for data transforms, ensure that columns to be joined have the same data type.

- To help the optimizer produce the best execution plan, ensure statistics are up to date.

- To ensure that resources are being efficiently used, monitor performance using the built-in database capabilities.

### Differences in performance tuning approach

> [!TIP]
> Prioritize familiarity with Azure Synapse tuning options at the start of migration.

This section highlights low-level performance tuning implementation differences between Oracle and Azure Synapse.

#### Data distribution options

For performance, Azure Synapse has a multi-node architecture and uses parallel processing. To optimize performance in Azure Synapse, you can specify a data distribution definition in `CREATE TABLE` statements using the `DISTRIBUTION` statement. For example, you can specify a hash-distributed table, which distributes table rows across compute nodes using a deterministic hash function. Many Oracle implementations, especially older on-premises systems, don't support this feature. 

Unlike Oracle, Azure Synapse supports "local joins" between a small table and a large table through small table replication. For instance, consider a dimension table and a fact table within a start schema model. Azure Synapse can replicate the smaller dimension table across all nodes to ensure that the value of any join key for the large table has a matching dimension row locally available. The overhead of dimension table replication is relatively low, provided the dimension table is small. For larger dimension tables, the hash distribution approach is more appropriate. For more information, see [Design guidance for using replicated tables](../../sql-data-warehouse/design-guidance-for-replicated-tables.md) and [Guidance for designing distributed tables](../../sql-data-warehouse/sql-data-warehouse-tables-distribute.md).

#### Data indexing

Azure Synapse provides several user-definable indexing options, which have a different operation and usage than system managed zone maps in Oracle. For more information about the different indexing options in Azure Synapse, see [Indexes on dedicated SQL pool tables](../../sql-data-warehouse/sql-data-warehouse-tables-index.md).

The existing index definitions within the source Oracle environment provide you a useful indication of the data usage and which columns to index in the new Azure Synapse environment. Typically, it isn't necessary to migrate every index from a legacy Oracle environment because Azure Synapse, unlike Oracle, doesn't over-rely on indexes to achieve acceptable performance. Azure Synapse implements these features to achieve outstanding performance:

- Parallel query processing.

- In-memory data and result set caching.

- Data distribution to reduce I/O, such as replication of small dimension tables.

#### Data partitioning

In an enterprise data warehouse, fact tables can contain billions of rows. Partitioning optimizes the maintenance and querying of these tables by splitting them into separate parts to reduce the amount of data processed. The `CREATE TABLE` statement defines the partitioning specification for a table.

Only one field per table can be used for partitioning. That field is frequently a date field since many queries are filtered by date or a date range. It's possible to change the partitioning of a table after initial load by recreating the table with the new distribution using the `CREATE TABLE AS` (CTAS) statement. See [Partitioning tables in dedicated SQL pool](/azure/sql-data-warehouse/sql-data-warehouse-tables-partition) for a detailed discussion of partitioning in Azure Synapse.

#### PolyBase or COPY INTO for data loading

PolyBase supports efficient loading of large amounts of data into a warehouse through parallel loading streams. For more information, see [PolyBase data loading strategy](../../sql/load-data-overview.md).

`COPY INTO` also supports high-throughput data ingestion, and has these capabilities:

- Data retrieval from all files within a folder and subfolders. 
- Data retrieval from multiple locations in the same storage account, specified by comma separated paths.
- Supports Azure Data Lake Storage (ADLS) Gen 2 and Azure Blob Storage. 
- Supports CSV, PARQUET, and ORC file formats.

#### Use resource classes for workload management

Azure Synapse uses resource classes to manage workloads. In general, large resource classes provide better individual query performance, while smaller resource classes provide higher levels of concurrency. You can monitor utilization using Dynamic Management Views (DMVs) to ensure that the applicable resources are efficiently utilized.

## Next steps

To learn about ETL and load for Oracle migration, see the next article in this series: [Data migration, ETL, and load for Oracle migrations](2-etl-load-migration-considerations.md).