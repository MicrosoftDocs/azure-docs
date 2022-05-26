---
title: "Design and performance for Teradata migrations"
description: Learn how Teradata and Azure Synapse SQL databases differ in their approach to high query performance on exceptionally large data volumes.
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

# Design and performance for Teradata migrations

This article is part one of a seven part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. This article provides best practices for design and performance.

## Overview

Many existing users of Teradata data warehouse systems want to take advantage of the innovations provided by newer environments such as cloud, IaaS, or PaaS, and to delegate tasks like infrastructure maintenance and platform development to the cloud provider.

> [!TIP]
> More than just a database&mdash;the Azure environment includes a comprehensive set of capabilities and tools.

Although Teradata and Azure Synapse Analytics are both SQL databases designed to use massively parallel processing (MPP) techniques to achieve high query performance on exceptionally large data volumes, there are some basic differences in approach:

- Legacy Teradata systems are often installed on-premises and use proprietary hardware, while Azure Synapse is cloud based and uses Azure storage and compute resources.

- Since storage and compute resources are separate in the Azure environment, these resources can be scaled upwards and downwards independently, leveraging the elastic scaling capability.

- Azure Synapse can be paused or resized as required to reduce resource utilization and cost.

- Upgrading a Teradata configuration is a major task involving additional physical hardware and potentially lengthy database reconfiguration or reload.

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

- Lower overall TCO, better cost control, and streamlined operational expenditure (OPEX).

To maximize these benefits, migrate new or existing data and applications to the Azure Synapse platform. In many organizations, this will include migrating an existing data warehouse from legacy on-premises platforms such as Teradata. At a high level, the basic process includes these steps:

:::image type="content" source="../media/1-design-performance-migration/migration-steps.png" border="true" alt-text="Diagram showing the steps for preparing to migrate, migration, and post-migration.":::

This paper looks at schema migration with a goal of equivalent or better performance of your migrated Teradata data warehouse and data marts on Azure Synapse. This paper applies specifically to migrations from an existing Teradata environment.

## Design considerations

### Migration scope

> [!TIP]
> Create an inventory of objects to be migrated and document the migration process.

#### Preparation for migration

When migrating from a Teradata environment, there are some specific topics to consider in addition to the more general subjects described in this article.

#### Choose the workload for the initial migration

Legacy Teradata environments have typically evolved over time to encompass multiple subject areas and mixed workloads. When deciding where to start on an initial migration project, choose an area that can:

- Prove the viability of migrating to Azure Synapse by quickly delivering the benefits of the new environment.

- Allow the in-house technical staff to gain relevant experience of the processes and tools involved which can be used in migrations to other areas.

- Create a template for further migrations specific to the source Teradata environment and the current tools and processes that are already in place.

A good candidate for an initial migration from the Teradata environment that would enable the items above, is typically one that implements a BI/Analytics workload, rather than an online transaction processing (OLTP) workload, with a data model that can be migrated with minimal modifications&mdash;normally a star or snowflake schema.

The migration data volume for the initial exercise should be large enough to demonstrate the capabilities and benefits of the Azure Synapse environment while quickly demonstrating the value&mdash;typically in the 1-10TB range.

To minimize the risk and reduce implementation time for the initial migration project, confine the scope of the migration to just the data marts, such as the OLAP DB part of a Teradata warehouse. However, this won't address the broader topics such as ETL migration and historical data migration. Address these topics in later phases of the project, once the migrated data mart layer is backfilled with the data and processes required to build them.

#### Lift and shift as-is versus a phased approach incorporating changes

> [!TIP]
> 'Lift and shift' is a good starting point, even if subsequent phases will implement changes to the data model.

Whatever the drive and scope of the intended migration, there are&mdash;broadly speaking&mdash;two types of migration:

##### Lift and shift

In this case, the existing data model&mdash;such as a star schema&mdash;is migrated unchanged to the new Azure Synapse platform. The emphasis is on minimizing risk and the migration time required by reducing the work needed to realize the benefits of moving to the Azure cloud environment.

This is a good fit for existing Teradata environments where a single data mart is being migrated, or where the data is already in a well-designed star or snowflake schema&mdash;or there are other pressures to move to a more modern cloud environment.

##### Phased approach incorporating modifications

In cases where a legacy warehouse has evolved over a long time, you may need to re-engineer to maintain the required performance levels or to support new data like IoT streams. Migrate to Azure Synapse to get the benefits of a scalable cloud environment as part of the re-engineering process. Migration could include a change in the underlying data model, such as a move from an Inmon model to a data vault.

Microsoft recommends moving the existing data model as-is to Azure (optionally using a VM Teradata instance in Azure) and using the performance and flexibility of the Azure environment to apply the re-engineering changes, leveraging Azure's capabilities to make the changes without impacting the existing source system.

#### Use an Azure VM Teradata instance as part of a migration

> [!TIP]
> Use Azure VMs to create a temporary Teradata instance to speed up migration and minimize impact on the source system.

When migrating from an on-premises Teradata environment, you can leverage the Azure environment. Azure provides cheap cloud storage and elastic scalability to create a Teradata instance within a VM in Azure, collocating with the target Azure Synapse environment.

With this approach, standard Teradata utilities such as Teradata Parallel Data Transporter can efficiently move the subset of Teradata tables being migrated onto the VM instance. Then, all migration tasks can take place within the Azure environment. This approach has several benefits:

- After the initial replication of data, the source system isn't impacted by the migration tasks.

- The familiar Teradata interfaces, tools, and utilities are available within the Azure environment.

- Once in the Azure environment, there are no potential issues with network bandwidth availability between the on-premises source system and the cloud target system.

- Tools like Azure Data Factory can efficiently call utilities like Teradata Parallel Transporter to migrate data quickly and easily.

- The migration process is orchestrated and controlled entirely within the Azure environment, keeping everything in a single place.

#### Use Azure Data Factory to implement a metadata-driven migration

Automate and orchestrate the migration process by making use of the capabilities in the Azure environment. This approach minimizes the impact on the existing Teradata environment, which may already be running close to full capacity.

Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Data Factory, you can create and schedule data-driven workflows&mdash;called pipelines&mdash;to ingest data from disparate data stores. It can process and transform data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

By creating metadata to list the data tables to be migrated and their location, you can use the Data Factory facilities to manage the migration process.

### Design differences between Teradata and Azure Synapse

#### Multiple databases versus a single database and schemas

> [!TIP]
> Combine multiple databases into a single database in Azure Synapse and use schemas to logically separate the tables.

In a Teradata environment, there are often multiple separate databases for individual parts of the overall environment. For example, there may be a separate database for data ingestion and staging tables, a database for the core warehouse tables, and another database for data marts, sometimes called a semantic layer. Processing these as ETL/ELT pipelines may implement cross-database joins and will move data between these separate databases.

Querying within the Azure Synapse environment is limited to a single database. Schemas are used to separate the tables into logically separate groups. Therefore, we recommend using a series of schemas within the target Azure Synapse to mimic any separate databases migrated from the Teradata environment. If the Teradata environment already uses schemas, you may need to use a new naming convention to move the existing Teradata tables and views to the new environment&mdash;for example, concatenate the existing Teradata schema and table names into the new Azure Synapse table name and use schema names in the new environment to maintain the original separate database names. Schema consolidation naming can have dots&mdash;however, Azure Synapse Spark may have issues. You can use SQL views over the underlying tables to maintain the logical structures, but there are some potential downsides to this approach:

- Views in Azure Synapse are read-only, so any updates to the data must take place on the underlying base tables.

- There may already be one or more layers of views in existence, and adding an extra layer of views might impact performance and supportability as nested views are difficult to troubleshoot.

#### Table considerations

> [!TIP]
> Use existing indexes to indicate candidates for indexing in the migrated warehouse.

When migrating tables between different technologies, only the raw data and the metadata that describes it gets physically moved between the two environments. Other database elements from the source system&mdash;such as indexes&mdash;aren't migrated, as these may not be needed or may be implemented differently within the new target environment.

However, it's important to understand where performance optimizations such as indexes have been used in the source environment, as this can indicate where to add performance optimization in the new target environment. For example, if a non-unique secondary index (NUSI) has been created within the source Teradata environment, it may indicate that a non-clustered index should be created within the migrated Azure Synapse. Other native performance optimization techniques, such as table replication, may be more applicable than a straight 'like for like' index creation.

#### High availability for the database

Teradata supports data replication across nodes via the FALLBACK option, where table rows that reside physically on a given node are replicated to another node within the system. This approach guarantees that data won't be lost if there's a node failure and provides the basis for failover scenarios.

The goal of the high availability architecture in Azure SQL Database is to guarantee that your database is up and running 99.9% of time, without worrying about the impact of maintenance operations and outages. Azure automatically handles critical servicing tasks such as patching, backups, and Windows and SQL upgrades, as well as unplanned events such as underlying hardware, software, or network failures.

Data storage in Azure Synapse is automatically [backed up](../../sql-data-warehouse/backup-and-restore.md) with snapshots. These snapshots are a built-in feature of the service that creates restore points. You don't have to enable this capability. Users can't currently delete automatic restore points where the service uses these restore points to maintain SLAs for recovery.

Azure Synapse Dedicated SQL pool takes snapshots of the data warehouse throughout the day creating restore points that are available for seven days. This retention period can't be changed. SQL Data Warehouse supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. If you require more granular backups, other user-defined options are available.

#### Unsupported Teradata table types

> [!TIP]
> Standard tables in Azure Synapse can support migrated Teradata time series and temporal data.

Teradata supports special table types for time series and temporal data. The syntax and some of the functions for these table types aren't directly supported in Azure Synapse, but the data can be migrated into a standard table with appropriate data types and indexing or partitioning on the date/time column.

Teradata implements the temporal query functionality via query rewriting to add additional filters within a temporal query to limit the applicable date range. If this functionality is currently used in the source Teradata environment and is to be migrated, add this additional filtering into the relevant temporal queries.

The Azure environment also includes specific features for complex analytics on time-series data at a scale called [time series insights](https://azure.microsoft.com/services/time-series-insights/). This is aimed at IoT data analysis applications and may be more appropriate for this use case.

#### SQL DML syntax differences

There are a few differences in SQL Data Manipulation Language (DML) syntax between Teradata SQL and Azure Synapse (T-SQL) that you should be aware of during migration:

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

#### Functions, stored procedures, triggers, and sequences

> [!TIP]
> Assess the number and type of non-data objects to be migrated as part of the preparation phase.

When migrating from a mature legacy data warehouse environment such as Teradata, you must often migrate elements other than simple tables and views to the new target environment. Examples include functions, stored procedures, triggers, and sequences.

As part of the preparation phase, create an inventory of these objects to be migrated, and define the method of handling them. Assign an appropriate allocation of resources in the project plan.

There may be facilities in the Azure environment that replace the functionality implemented as functions or stored procedures in the Teradata environment. In this case, it's more efficient to use the built-in Azure facilities rather than recoding the Teradata functions.

[Data integration partners](../../partner/data-integration.md) offer tools and services that can automate the migration.

##### Functions

As with most database products, Teradata supports system functions and user-defined functions within an SQL implementation. When migrating to another database platform such as Azure Synapse, common system functions are available and can be migrated without change. Some system functions may have slightly different syntax, but the required changes can be automated if so.

For system functions where there's no equivalent, or for arbitrary user-defined functions, recode these using the language(s) available in the target environment. Azure Synapse uses the popular Transact-SQL language to implement user-defined functions.

##### Stored procedures

Most modern database products allow for procedures to be stored within the database. Teradata provides the SPL language for this purpose.

A stored procedure typically contains SQL statements and some procedural logic, and may return data or a status.

Azure Synapse Analytics from Azure SQL Data Warehouse also supports stored procedures using T-SQL. If you must migrate stored procedures, recode these procedures for their new environment.

##### Triggers

Azure Synapse doesn't support trigger creation, but trigger creation can be implemented with Azure Data Factory.

##### Sequences

With Azure Synapse, sequences are handled in a similar way to Teradata. Use [IDENTITY](/sql/t-sql/statements/create-table-transact-sql-identity-property?msclkid=8ab663accfd311ec87a587f5923eaa7b) columns or `USING` SQL code to create the next sequence number in a series.

### Extract metadata and data from a Teradata environment

#### Data Definition Language (DDL) generation

> [!TIP]
> Use existing Teradata metadata to automate the generation of CREATE TABLE and CREATE VIEW DDL for Azure Synapse Analytics.

You can edit existing Teradata CREATE TABLE and CREATE VIEW scripts to create the equivalent definitions with modified data types, if necessary, as described in the previous section. Typically, this involves removing extra Teradata-specific clauses such as FALLBACK.

However, all the information that specifies the current definitions of tables and views within the existing Teradata environment is maintained within system catalog tables. These tables are the best source of this information, as it's guaranteed to be up to date and complete. User-maintained documentation may not be in sync with the current table definitions.

Access the information in these tables via views into the catalog such as `DBC.ColumnsV`, and generate the equivalent CREATE TABLE DDL statements for the equivalent tables in Azure Synapse.

Third-party migration and ETL tools also use the catalog information to achieve the same result.

#### Data extraction from Teradata

> [!TIP]
> Use Teradata Parallel Transporter for most efficient data extract.

Migrate the raw data from existing Teradata tables using standard Teradata utilities, such as BTEQ and FASTEXPORT. During a migration exercise, extract the data as efficiently as possible. Use Teradata Parallel Transporter, which uses multiple parallel FASTEXPORT streams to achieve the best throughput.

Call Teradata Parallel Transporter directly from Azure Data Factory. This is the recommended approach for managing the data migration process whether the Teradata instance in on-premises or copied to a VM in the Azure environment, as described in the previous section.

Recommended data formats for the extracted data include delimited text files (also called Comma Separated Values or CSV), Optimized Row Columnar (ORC), or Parquet files.

For more detailed information on the process of migrating data and ETL from a Teradata environment, see [Data migration, ETL, and load for Teradata migration](2-etl-load-migration-considerations.md).

## Performance recommendations for Teradata migrations

This article provides general information and guidelines about use of performance optimization techniques for Azure Synapse and adds specific recommendations for use when migrating from a Teradata environment.

### Differences in performance tuning approach

> [!TIP]
> Prioritize early familiarity with Azure Synapse tuning options in a migration exercise.

This section highlights lower-level implementation differences between Teradata and Azure Synapse for performance tuning.

#### Data distribution options

Azure enables the specification of data distribution methods for individual tables. The aim is to reduce the amount of data that must be moved between processing nodes when executing a query.

For large table-large table joins, hash distribute one or ideally both tables on one of the join columns&mdash;which has a wide range of values to help ensure an even distribution. Perform join processing locally, as the data rows to be joined will already be collocated on the same processing node.

Another way to achieve local joins for small table-large table joins&mdash;typically dimension table to fact table in a star schema model&mdash;is to replicate the smaller dimension table across all nodes. This ensures that any value of the join key of the larger table will have a matching dimension row locally available. The overhead of replicating the dimension tables is relatively low, provided the tables aren't very large (see [Design guidance for replicated tables](../../sql-data-warehouse/design-guidance-for-replicated-tables.md))&mdash;in which case, the hash distribution approach as described above is more appropriate. For more information, see [Distributed tables design](../../sql-data-warehouse/sql-data-warehouse-tables-distribute.md).

#### Data indexing

Azure Synapse provides several indexing options, but these are different from the indexing options implemented in Teradata. More details of the different indexing options are described in [table indexes](/azure/sql-data-warehouse/sql-data-warehouse-tables-index).

Existing indexes within the source Teradata environment can however provide a useful indication of how the data is currently used. They can identify candidates for indexing within the Azure Synapse environment.

#### Data partitioning

In an enterprise data warehouse, fact tables can contain many billions of rows. Partitioning optimizes the maintenance and querying of these tables by splitting them into separate parts to reduce the amount of data processed. The `CREATE TABLE` statement defines the partitioning specification for a table. Partitioning should only be done on very large tables where each partition will contain at least 60 million rows.

Only one field per table can be used for partitioning. That field is frequently a date field since many queries are filtered by date or a date range. It's possible to change the partitioning of a table after initial load by recreating the table with the new distribution using the `CREATE TABLE AS` (or CTAS) statement. See [table partitions](/azure/sql-data-warehouse/sql-data-warehouse-tables-partition) for a detailed discussion of partitioning in Azure Synapse.

#### Data table statistics

Ensure that statistics on data tables are up to date by building in a [statistics](../../sql/develop-tables-statistics.md) step to ETL/ELT jobs.

#### PolyBase for data loading

PolyBase is the most efficient method for loading large amounts of data into the warehouse since it can leverage parallel loading streams. For more information, see [PolyBase data loading strategy](../../sql/load-data-overview.md).

#### Use workload management

Use [workload management](../../sql-data-warehouse/sql-data-warehouse-workload-management.md?context=%2fazure%2fsynapse-analytics%2fcontext%2fcontext) instead of resource classes. ETL would be in its own workgroup and should be configured to have more resources per query (less concurrency by more resources). For more information, see [What is dedicated SQL pool in Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

## Next steps

To learn more about ETL and load for Teradata migration, see the next article in this series: [Data migration, ETL, and load for Teradata migration](2-etl-load-migration-considerations.md).