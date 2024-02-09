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
ms.date: 08/11/2022
---

# Design and performance for Teradata migrations

This article is part one of a seven-part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. The focus of this article is best practices for design and performance.

## Overview

Many existing users of Teradata data warehouse systems want to take advantage of the innovations provided by modern cloud environments. Infrastructure-as-a-service (IaaS) and platform-as-a-service (PaaS) cloud environments let you delegate tasks like infrastructure maintenance and platform development to the cloud provider.

>[!TIP]
>More than just a database&mdash;the Azure environment includes a comprehensive set of capabilities and tools.

Although Teradata and Azure Synapse Analytics are both SQL databases that use massively parallel processing (MPP) techniques to achieve high query performance on exceptionally large data volumes, there are some basic differences in approach:

- Legacy Teradata systems are often installed on-premises and use proprietary hardware, while Azure Synapse is cloud-based and uses Azure Storage and compute resources.

- Because storage and compute resources are separate in the Azure environment and have elastic scaling capability, those resources can be scaled upwards or downwards independently.

- You can pause or resize Azure Synapse as needed to reduce resource utilization and cost.

- Upgrading a Teradata configuration is a major task involving extra physical hardware and potentially lengthy database reconfiguration or reload.

Microsoft Azure is a globally available, highly secure, scalable cloud environment that includes Azure Synapse and an ecosystem of supporting tools and capabilities. The next diagram summarizes the Azure Synapse ecosystem.

:::image type="content" source="../media/1-design-performance-migration/azure-synapse-ecosystem.png" border="true" alt-text="Chart showing the Azure Synapse ecosystem of supporting tools and capabilities.":::

Azure Synapse provides best-of-breed relational database performance by using techniques such as MPP and multiple levels of automated caching for frequently used data. You can see the results of these techniques in independent benchmarks such as the one run recently by [GigaOm](https://research.gigaom.com/report/data-warehouse-cloud-benchmark/), which compares Azure Synapse to other popular cloud data warehouse offerings. Customers who migrate to the Azure Synapse environment see many benefits, including:

- Improved performance and price/performance.

- Increased agility and shorter time to value.

- Faster server deployment and application development.

- Elastic scalability&mdash;only pay for actual usage.

- Improved security/compliance.

- Reduced storage and disaster recovery costs.

- Lower overall TCO, better cost control, and streamlined operational expenditure (OPEX).

To maximize these benefits, migrate new or existing data and applications to the Azure Synapse platform. In many organizations, migration includes moving an existing data warehouse from a legacy on-premises platform, such as Teradata, to Azure Synapse. At a high level, the migration process includes these steps:

:::row:::
   :::column span="":::
    &#160;&#160;&#160; **Preparation** &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &#129094;

     - Define scope&mdash;what is to be migrated.
     
     - Build inventory of data and processes for migration.
     
     - Define data model changes (if any).
     
     - Define source data extract mechanism.
     
     - Identify the appropriate Azure and third-party tools and features to be used.
     
     - Train staff early on the new platform.
     
     - Set up the Azure target platform.

   :::column-end:::
   :::column span="":::
    &#160;&#160;&#160; **Migration** &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160; &#129094;

     - Start small and simple.
     
     - Automate wherever possible.
     
     - Leverage Azure built-in tools and features to reduce migration effort.
     
     - Migrate metadata for tables and views.
     
     - Migrate historical data to be maintained.
     
     - Migrate or refactor stored procedures and business processes.
     
     - Migrate or refactor ETL/ELT incremental load processes.

   :::column-end:::
   :::column span="":::
    &#160;&#160;&#160; **Post migration**

    - Monitor and document all stages of the process.
     
    - Use the experience gained to build a template for future migrations.
     
    - Re-engineer the data model if required (using new platform performance and scalability).
     
    - Test applications and query tools.
     
    - Benchmark and optimize query performance.

   :::column-end:::
:::row-end:::

This article provides general information and guidelines for performance optimization when migrating a data warehouse from an existing Netezza environment to Azure Synapse. The goal of performance optimization is to achieve the same or better data warehouse performance in Azure Synapse after schema migration.

## Design considerations

### Migration scope

When you're preparing to migrate from a Teradata environment, consider the following migration choices.

#### Choose the workload for the initial migration

Typically, legacy Teradata environments have evolved over time to encompass multiple subject areas and mixed workloads. When you're deciding where to start on a migration project, choose an area where you'll be able to:

- Prove the viability of migrating to Azure Synapse by quickly delivering the benefits of the new environment.

- Allow your in-house technical staff to gain relevant experience with the processes and tools that they'll use when they migrate other areas.

- Create a template for further migrations that's specific to the source Teradata environment and the current tools and processes that are already in place.

A good candidate for an initial migration from a Teradata environment supports the preceding items, and:

- Implements a BI/Analytics workload rather than an online transaction processing (OLTP) workload.

- Has a data model, such as a star or snowflake schema, that can be migrated with minimal modification.

>[!TIP]
>Create an inventory of objects that need to be migrated, and document the migration process.

The volume of migrated data in an initial migration should be large enough to demonstrate the capabilities and benefits of the Azure Synapse environment but not too large to quickly demonstrate value. A size in the 1-10 terabyte range is typical.

For your initial migration project, minimize the risk, effort, and migration time so you can quickly see the benefits of the Azure cloud environment, confine the scope of the migration to just the data marts, such as the OLAP DB part of a Teradata warehouse. Both the lift-and-shift and phased migration approaches limit the scope of the initial migration to just the data marts and don't address broader migration aspects, such as ETL migration and historical data migration. However, you can address those aspects in later phases of the project once the migrated data mart layer is backfilled with data and the required build processes.

<a id="lift-and-shift-as-is-versus-a-phased-approach-incorporating-changes"></a>
#### Lift and shift migration vs. Phased approach

In general, there are two types of migration regardless of the purpose and scope of the planned migration: lift and shift as-is and a phased approach that incorporates changes.

##### Lift and shift

In a lift and shift migration, an existing data model, like a star schema, is migrated unchanged to the new Azure Synapse platform. This approach minimizes risk and migration time by reducing the work needed to realize the benefits of moving to the Azure cloud environment. Lift and shift migration is a good fit for these scenarios:

- You have an existing Teradata environment with a single data mart to migrate, or
- You have an existing Teradata environment with data that's already in a well-designed star or snowflake schema, or
- You're under time and cost pressures to move to a modern cloud environment.

>[!TIP]
>Lift and shift is a good starting point, even if subsequent phases implement changes to the data model.

<a id="phased-approach-incorporating-modifications"></a>
##### Phased approach that incorporates changes

If a legacy data warehouse has evolved over a long period of time, you might need to re-engineer it to maintain the required performance levels. You might also have to re-engineer to support new data like Internet of Things (IoT) streams. As part of the re-engineering process, migrate to Azure Synapse to get the benefits of a scalable cloud environment. Migration can also include a change in the underlying data model, such as a move from an Inmon model to a data vault.

Microsoft recommends moving your existing data model as-is to Azure (optionally using a VM Teradata instance in Azure) and using the performance and flexibility of the Azure environment to apply the re-engineering changes. That way, you can use Azure's capabilities to make the changes without impacting the existing source system.

#### Use an Azure VM Teradata instance as part of a migration

When migrating from an on-premises Teradata environment, you can leverage cloud storage and elastic scalability in Azure to create a Teradata instance within a VM. This approach collocates the Teradata instance with the target Azure Synapse environment. You can use standard Teradata utilities, such as Teradata Parallel Data Transporter, to efficiently move the subset of Teradata tables being migrated onto the VM instance. Then, all further migration tasks can occur within the Azure environment. This approach has several benefits:

- After the initial replication of data, the source system isn't affected by the migration tasks.

- Familiar Teradata interfaces, tools, and utilities are available within the Azure environment.

- The Azure environment sidesteps any potential issues with network bandwidth availability between the on-premises source system and the cloud target system.

- Tools like Azure Data Factory can call utilities like Teradata Parallel Transporter to efficiently and rapidly migrate data.

- You can orchestrate and control the migration process entirely within the Azure environment.

>[!TIP]
>Use Azure VMs to create a temporary Teradata instance to speed up migration and minimize impact on the source system.

#### Use Azure Data Factory to implement a metadata-driven migration

You can automate and orchestrate the migration process by using the capabilities of the Azure environment. This approach minimizes the performance hit on the existing Netezza environment, which may already be running close to capacity.

[Azure Data Factory](../../../data-factory/introduction.md) is a cloud-based data integration service that supports creating data-driven workflows in the cloud that orchestrate and automate data movement and data transformation. You can use Data Factory to create and schedule data-driven workflows (pipelines) that ingest data from disparate data stores. Data Factory can process and transform data by using compute services such as [Azure HDInsight Hadoop](../../../hdinsight/hadoop/apache-hadoop-introduction.md), Spark, Azure Data Lake Analytics, and Azure Machine Learning.

When you're planning to use Data Factory facilities to manage the migration process, create metadata that lists all the data tables to be migrated and their location.

### Design differences between Teradata and Azure Synapse

As mentioned earlier, there are some basic differences in approach between Teradata and Azure Synapse Analytics databases and these differences are discussed next.

<a id="multiple-databases-versus-a-single-database-and-schemas"></a>
#### Multiple databases vs. a single database and schemas

The Teradata environment often contains multiple separate databases. For instance, there could be separate databases for: data ingestion and staging tables, core warehouse tables, and data marts (sometimes referred to as the semantic layer). ETL or ELT pipeline processes might implement cross-database joins and move data between the separate databases.

In contrast, the Azure Synapse environment contains a single database and uses schemas to separate tables into logically separate groups. We recommend that you use a series of schemas within the target Azure Synapse database to mimic the separate databases migrated from the Teradata environment. If the Teradata environment already uses schemas, you may need to use a new naming convention when you move the existing Teradata tables and views to the new environment. For example, you could concatenate the existing Teradata schema and table names into the new Azure Synapse table name, and use schema names in the new environment to maintain the original separate database names. If schema consolidation naming has dots, Azure Synapse Spark might have issues. Although you can use SQL views on top of the underlying tables to maintain the logical structures, there are potential downsides to that approach:

- Views in Azure Synapse are read-only, so any updates to the data must take place on the underlying base tables.

- There may already be one or more layers of views in existence and adding an extra layer of views could affect performance and supportability because nested views are difficult to troubleshoot.

>[!TIP]
>Combine multiple databases into a single database within Azure Synapse and use schema names to logically separate the tables.

#### Table considerations

When you migrate tables between different environments, typically only the raw data and the metadata that describes it physically migrate. Other database elements from the source system, such as indexes, usually aren't migrated because they might be unnecessary or implemented differently in the new environment.
Performance optimizations in the source environment, such as indexes, indicate where you might add performance optimization in the new environment. For example, if a table within the source Teradata environment has a non-unique secondary index (NUSI), that suggests that a non-clustered index should be created within Azure Synapse. Other native performance optimization techniques like table replication may be more applicable than straight like-for-like index creation.

>[!TIP]
>Existing indexes indicate candidates for indexing in the migrated warehouse.

#### High availability for the database

Teradata supports data replication across nodes via the `FALLBACK` option, which replicates table rows that reside physically on a given node to another node within the system. This approach guarantees that data won't be lost if there's a node failure and provides the basis for failover scenarios.

The goal of the high availability architecture in Azure Synapse Analytics is to guarantee that your database is up and running 99.9% of the time, without worrying about the impact of maintenance operations and outages. For more information on the SLA, see [SLA for Azure Synapse Analytics](https://azure.microsoft.com/support/legal/sla/synapse-analytics/v1_1/). Azure automatically handles critical servicing tasks such as patching, backups, and Windows and SQL upgrades. Azure also automatically handles unplanned events such as failures in the underlying hardware, software, or network.

Data storage in Azure Synapse is automatically [backed up](../../sql-data-warehouse/backup-and-restore.md) with snapshots. These snapshots are a built-in feature of the service that creates restore points. You don't have to enable this capability. Users can't currently delete automatic restore points that the service uses to maintain service level agreements (SLAs) for recovery.

Azure Synapse Dedicated SQL pool takes snapshots of the data warehouse throughout the day to create restore points that are available for seven days. This retention period can't be changed. Azure Synapse supports an eight-hour recovery point objective (RPO). You can restore your data warehouse in the primary region from any one of the snapshots taken in the past seven days. If you require more granular backups, you can use another user-defined option.

#### Unsupported Teradata table types

Teradata supports special table types for time-series and temporal data. The syntax and some of the functions for these table types aren't directly supported in Azure Synapse. However, you can migrate the data into a standard table in Azure Synapse by mapping to appropriate data types and indexing or partitioning the date/time column.

>[!TIP]
>Standard tables in Azure Synapse can support migrated Teradata time-series and temporal data.

Teradata implements temporal query functionality by using query rewriting to add additional filters within a temporal query to limit the applicable date range. If you plan to migrate this functionality from the source Teradata environment, then add the additional filtering into the relevant temporal queries.

The Azure environment supports [time series insights](https://azure.microsoft.com/services/time-series-insights) for complex analytics on time-series data at scale. This functionality is aimed at IoT data analysis applications.

#### SQL DML syntax differences

SQL Data Manipulation Language (DML) [syntax differences](5-minimize-sql-issues.md#sql-ddl-differences-between-teradata-and-azure-synapse) exist between Teradata SQL and Azure Synapse T-SQL:

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

- Date arithmetic: Azure Synapse has operators such as `DATEADD` and `DATEDIFF`, which can be used on `DATE` or `DATETIME` fields. Teradata supports direct subtraction on dates such as `SELECT DATE1 - DATE2 FROM...`

- `GROUP BY`: for the `GROUP BY` ordinal, explicitly provide a T-SQL column name.

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

When migrating a data warehouse from a mature environment like Teradata, you probably need to migrate elements other than simple tables and views. Examples include functions, stored procedures, triggers, and sequences. Check whether tools within the Azure environment can replace the functionality of functions, stored procedures, and sequences because it's usually more efficient to use built-in Azure tools than to recode those elements for Azure Synapse.

As part of your preparation phase, create an inventory of objects that need to be migrated, define a method for handling them, and allocate appropriate resources in your migration plan.

[Data integration partners](../../partner/data-integration.md) offer tools and services that can automate the migration of functions, stored procedures, and sequences.

The following sections further discuss the migration of functions, stored procedures, and sequences.

##### Functions

As with most database products, Teradata supports system and user-defined functions within a SQL implementation. When you migrate a legacy database platform to Azure Synapse, common system functions can usually be migrated without change. Some system functions might have a slightly different syntax, but any required changes can be automated.

For Teradata system functions or arbitrary user-defined functions that have no equivalent in Azure Synapse, recode those functions using a target environment language. Azure Synapse uses the Transact-SQL language to implement user-defined functions.

##### Stored procedures

Most modern database products support storing procedures within the database. Teradata provides the SPL language for this purpose. A stored procedure typically contains both SQL statements and procedural logic, and returns data or a status.

Azure Synapse supports stored procedures using T-SQL, so you need to recode any migrated stored procedures in that language.

##### Triggers

Azure Synapse doesn't support trigger creation, but trigger creation can be implemented using Azure Data Factory.

##### Sequences

Azure Synapse handles sequences in a similar way to Teradata, and you can implement sequences using [IDENTITY](/sql/t-sql/statements/create-table-transact-sql-identity-property) columns or SQL code that generates the next sequence number in a series. A sequence provides unique numeric values that you can use as surrogate key values for primary keys.

### Extract metadata and data from a Teradata environment

#### Data Definition Language (DDL) generation

The ANSI SQL standard defines the basic syntax for Data Definition Language (DDL) commands. Some DDL commands, such as `CREATE TABLE` and `CREATE VIEW`, are common to both Teradata and Azure Synapse but also provide implementation-specific features such as indexing, table distribution, and partitioning options.

You can edit existing Teradata `CREATE TABLE` and `CREATE VIEW` scripts to achieve equivalent definitions in Azure Synapse. To do so, you might need to use [modified data types](5-minimize-sql-issues.md#unsupported-teradata-data-types) and remove or modify Teradata-specific clauses such as `FALLBACK`.

However, all the information that specifies the current definitions of tables and views within the existing Teradata environment is maintained within system catalog tables. These tables are the best source of this information, as it's guaranteed to be up to date and complete. User-maintained documentation may not be in sync with the current table definitions.

Within the Teradata environment, system catalog tables specify the current table and view definition. Unlike user-maintained documentation, system catalog information is always complete and in sync with current table definitions. By using views into the catalog such as `DBC.ColumnsV`, you can access system catalog information to generate `CREATE TABLE` DDL statements that create equivalent tables in Azure Synapse.

>[!TIP]
>Use existing Teradata metadata to automate the generation of `CREATE TABLE` and `CREATE VIEW` DDL for Azure Synapse.

You can also use [third-party](../../partner/data-integration.md) migration and ETL tools that process system catalog information to achieve similar results.

#### Data extraction from Teradata

You can extract raw table data from Teradata tables to flat delimited files, such as CSV files, using standard Teradata utilities like Basic Teradata Query (BTEQ), Teradata FastExport, or Teradata Parallel Transporter (TPT). Use TPT to extract table data as efficiently as possible. TPT uses multiple parallel FastExport streams to achieve the highest throughput.

>[!TIP]
>Use Teradata Parallel Transporter for the most efficient data extract.

Call TPT directly from Azure Data Factory. This is the recommended approach for data migration of Teradata on-premises instances and [Teradata instances that run within a VM](#use-an-azure-vm-teradata-instance-as-part-of-a-migration) in the Azure environment.

Extracted data files should contain delimited text in CSV, Optimized Row Columnar (ORC), or Parquet format.

For more information about migrating data and ETL from a Teradata environment, see [Data migration, ETL, and load for Teradata migrations](2-etl-load-migration-considerations.md).

## Performance recommendations for Teradata migrations

The goal of performance optimization is same or better data warehouse performance after migration to Azure Synapse.


>[!TIP]
>Prioritize familiarity with the tuning options in Azure Synapse at the start of a migration.

### Differences in performance tuning approach

This section highlights low-level performance tuning implementation differences between Teradata and Azure Synapse.

#### Data distribution options

For performance, Azure Synapse was designed with multi-node architecture and uses parallel processing. To optimize individual table performance in Azure Synapse, you can define a data distribution option in `CREATE TABLE` statements using the `DISTRIBUTION` statement. For example, you can specify a hash-distributed table, which distributes table rows across compute nodes by using a deterministic hash function. The aim is to reduce the amount of data moved between processing nodes when executing a query.

For large table to large table joins, hash distribute one or, ideally, both tables on one of the join columns&mdash;which has a wide range of values to help ensure an even distribution. Perform join processing locally because the data rows that will be joined are collocated on the same processing node.

Azure Synapse also supports local joins between a small table and a large table through small table replication. For instance, consider a small dimension table and a large fact table within a star schema model. Azure Synapse can replicate the smaller dimension table across all nodes to ensure that the value of any join key for the large table has a matching, locally available dimension row. The overhead of dimension table replication is relatively low for a small dimension table. For large dimension tables, a hash distribution approach is more appropriate. For more information on data distribution options, see [Design guidance for using replicated tables](../../sql-data-warehouse/design-guidance-for-replicated-tables.md) and [Guidance for designing distributed tables](../../sql-data-warehouse/sql-data-warehouse-tables-distribute.md).

#### Data indexing

Azure Synapse supports several user-definable indexing options that are different from the indexing options implemented in Teradata. For more information about the different indexing options in Azure Synapse, see [Indexes on dedicated SQL pool tables](../../sql-data-warehouse/sql-data-warehouse-tables-index.md).

Existing indexes within the source Teradata environment provide a useful indication of data usage and the candidate columns for indexing in the Azure Synapse environment.

#### Data partitioning

In an enterprise data warehouse, fact tables can contain billions of rows. Partitioning optimizes the maintenance and query performance of these tables by splitting them into separate parts to reduce the amount of data processed. In Azure Synapse, the `CREATE TABLE` statement defines the partitioning specification for a table. Only partition very large tables and ensure each partition contains at least 60 million rows.

You can only use one field per table for partitioning. That field is often a date field because many queries are filtered by date or date range. It's possible to change the partitioning of a table after initial load by using the `CREATE TABLE AS` (CTAS) statement to recreate the table with a new distribution. For a detailed discussion of partitioning in Azure Synapse, see [Partitioning tables in dedicated SQL pool](/azure/sql-data-warehouse/sql-data-warehouse-tables-partition).

#### Data table statistics

You should ensure that statistics on data tables are up to date by building in a [statistics](../../sql/develop-tables-statistics.md) step to ETL/ELT jobs.

<a id="polybase-for-data-loading"></a>
#### PolyBase or COPY INTO for data loading

[PolyBase](/sql/relational-databases/polybase) supports efficient loading of large amounts of data to a data warehouse by using parallel loading streams. For more information, see [PolyBase data loading strategy](../../sql/load-data-overview.md).

[COPY INTO](/sql/t-sql/statements/copy-into-transact-sql) also supports high-throughput data ingestion, and:

- Data retrieval from all files within a folder and subfolders.

- Data retrieval from multiple locations in the same storage account. You can specify multiple locations by using comma separated paths.

- [Azure Data Lake Storage](../../../storage/blobs/data-lake-storage-introduction.md) (ADLS) and Azure Blob Storage.

- CSV, PARQUET, and ORC file formats.

#### Workload management

Running mixed workloads can pose resource challenges on busy systems. A successful [workload management](../../sql-data-warehouse/sql-data-warehouse-workload-management.md) scheme effectively manages resources, ensures highly efficient resource utilization, and maximizes return on investment (ROI). [Workload classification](../../sql-data-warehouse/sql-data-warehouse-workload-classification.md), [workload importance](../../sql-data-warehouse/sql-data-warehouse-workload-importance.md), and [workload isolation](../../sql-data-warehouse/sql-data-warehouse-workload-isolation.md) give more control over how workload utilizes system resources.

The [workload management guide](../../sql-data-warehouse/analyze-your-workload.md) describes the techniques to analyze the workload, [manage and monitor workload importance](../../sql-data-warehouse/sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md), and the steps to [convert a resource class to a workload group](../../sql-data-warehouse/sql-data-warehouse-how-to-convert-resource-classes-workload-groups.md). Use the [Azure portal](../../sql-data-warehouse/sql-data-warehouse-monitor-workload-portal.md) and [T-SQL queries on DMVs](../../sql-data-warehouse/sql-data-warehouse-manage-monitor.md) to monitor the workload to ensure that the applicable resources are efficiently utilized.  

## Next steps

To learn about ETL and load for Teradata migration, see the next article in this series: [Data migration, ETL, and load for Teradata migrations](2-etl-load-migration-considerations.md).
