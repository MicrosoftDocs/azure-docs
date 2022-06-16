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

This article is part one of a four part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. This article provides best practices for design and performance.

## Overview

Due to the cost and complexity of maintaining and upgrading legacy on-premises Oracle environments, many existing users of Oracle data warehouse systems want to take advantage of the innovations provided by newer environments such as cloud, IaaS, and PaaS, and to delegate tasks like infrastructure maintenance and platform development to the cloud provider.

>[!TIP]
>More than just a database&mdash;the Azure environment includes a comprehensive set of capabilities and tools.

Although Oracle and Azure Synapse Analytics are both SQL databases designed to use massively parallel processing (MPP) techniques to achieve high query performance on exceptionally large data volumes, there are some basic differences in approach:

- Legacy Oracle systems are often installed on-premises and use relatively expensive hardware, while Azure Synapse is cloud-based and uses Azure storage and compute resources.

- Upgrading an Oracle configuration is a major task involving additional physical hardware and potentially lengthy database reconfiguration, or dump and reload. Since storage and compute resources are separate in the Azure environment, these resources can be scaled upwards or downwards independently, leveraging the elastic scaling capability.

- Azure Synapse can be paused or resized as required to reduce resource utilization and cost.

Microsoft Azure is a globally available, highly secure, scalable cloud environment that includes Azure Synapse and an ecosystem of supporting tools and capabilities. The next diagram summarizes the Azure Synapse ecosystem.

:::image type="content" source="../media/1-design-performance-migration/azure-synapse-ecosystem-2.png" border="true" alt-text="Chart showing the Azure Synapse ecosystem of supporting tools and capabilities.":::

Azure Synapse provides best-of-breed relational database performance by using techniques such as massively parallel processing (MPP) and automatic in-memory caching. See the results of this approach in independent benchmarks such as the one run recently by [GigaOm](https://research.gigaom.com/report/data-warehouse-cloud-benchmark/), which compares Azure Synapse to other popular cloud data warehouse offerings. Customers who have migrated to this environment have seen many benefits including:

- Improved performance and price/performance.

- Increased agility and shorter time to value.

- Faster server deployment and application development.

- Elastic scalability&mdash;only pay for actual usage.

- Improved security/compliance.

- Reduced storage and disaster recovery costs.

- Lower overall TCO, better cost control, and streamlined operational expenditure (OPEX).

To maximize these benefits,  migrate new or existing data and applications to the Azure Synapse platform. In many organizations, this will include migrating an existing data warehouse from legacy on-premises platforms such as Oracle. At a high level, the basic process includes these steps:

:::image type="content" source="../media/1-design-performance-migration/migration-steps.png" border="true" alt-text="Diagram showing the steps for preparing to migrate, migration, and post-migration.":::

This article looks at schema migration with a goal of equivalent or better performance of your migrated Oracle data warehouse and data marts on Azure Synapse. This article applies specifically to migrations from an existing Oracle environment.

## Design considerations

### Migration scope

#### Preparation for migration

Build an inventory of objects to be migrated and document the process

When migrating from an Oracle environment there are some specific topics which must be taken into account in addition to the more general subjects described in the 'Section 1 -- Design and Performance' document.

#### Choosing the workload for the initial migration

Legacy Oracle environments have typically evolved over time to encompass multiple subject areas and mixed workloads. When deciding where to start on an initial migration project it makes sense to choose an area which will be able to:

- Prove the viability of migrating to Azure Synapse by quickly delivering of the benefits of the new environment

- Allow the in-house technical staff to gain relevant experience of the processes and tools involved which can be used in migrations of other areas

- Create a template for further migration exercises which is specific to the source Oracle environment and the current tools and processes which are already in place

A good candidate for an initial migration from an Oracle environment which would enable the items above is typically one that implements a BI/Analytics workload (i.e. not an on-line transaction processing workload) with a data model that can be migrated with minimal modifications -- typically a star or snowflake schema.

In terms of size, it is important that the data volume to be migrated in the initial exercise is large enough to demonstrate the capabilities and benefits of the Azure Synapse environment while keeping the time to demonstrate value short -- typically in the 1-10TB range.

One possible approach for the initial migration project which will minimize the risk and reduce the implementation time for the initial project is confine the scope of the migration to just the data marts. This approach by definition limits the scope of the migration and can typically be achieved within short timescales and so can be a good starting point -- however this will not address the broader topics such as ETL migration and historical data migration as part of the initial migration project. These would have to be addressed in later phases of the project as the migrated data mart layer is 'back filled' with the data and processes required to build them.

#### 'Lift and shift as-is' vs a phased approach incorporating changes

'Lift and shift' is a good starting point even if subsequent phases will implement changes to the data model

Whatever the drivers and scope of the intended migration, broadly speaking there are 2 types of migration:

##### 'Lift and shift'

In this case the existing data model (e.g. star schema) is migrated unchanged to the new Azure Synapse platform. The emphasis here is on minimizing risk and the time taken to migrate by reducing the work that has to be done to achieve the benefits of moving to the Azure cloud environment.This is a good fit for existing Oracle environments where a single data mart is to be migrated, or the data is already in a well-designed star or snowflake schema or there are time and cost pressures to move to a more modern cloud environment. The SQL Server Migration Assistant for Oracle utility can be used with this approach to automate many aspects of the migration.

##### Phased approach incorporating modifications

For cases where a legacy warehouse has evolved over a long time it maybe necessary to re-engineer them to maintain the require performance levels or support new data (e.g. IoT steams). Migration to AzureSynapse to obtain the well accepted benefits of a scalable cloud environment might be considered as part of the re-engineering process.This could include a change of the underlying data model (e.g. a move from an Inmon model to Data Vault). The recommended approach for this is to initially move the existing data model 'as-is' into the Azure environment then to use the performance and flexibility of the Azure environment to apply there-engineering changes, leveraging the Azure capabilities where appropriate to make the changes without impacting the existing source system.

#### Use Microsoft facilities to implement a metadata-driven migration

It makes sense to automate and orchestrate the migration process by making use of the capabilities in the Azure environment. This approach also minimizes the impact on the existing Oracle environment (which may already be running close to full capacity).

SQL Server Migration Assistant for Oracle can automate many parts of the migration process and supports Azure Synapse as a target environment.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-server-migration-assistant-1.png" border="true" alt-text="Screenshot showing how SQL Server Migration Assistant for Oracle can automate many parts of the migration process.":::

Azure Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores. It can process and transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning. Azure also includes Migration Services to help in planning and executing a migration from environments such as Oracle.

By creating metadata to list the data tables to be migrated and their location it is possible to use these Azure facilities to manage the migration process.

### Design differences between Oracle and Azure Synapse 

#### Multiple databases vs single database and schemas

Combine multiple databases into a single database within Azure Synapse and use schema names to logically separate the tables

In an Oracle environment there are sometimes multiple separate instances for individual parts of the overall environment -- e.g. there may be a separate database for data ingestion and staging tables, a database for the core warehouse tables and another database for data marts (sometimes called a semantic layer). Processing such as ETL/ELT pipelines may implement cross-database joins and will move data between these separate databases.

In the Azure Synapse environment there is a single database, and schemas are used to separate the tables into logically separate groups. Therefore, the recommendation is to use a series of schemas within the target Azure Synapse to mimic any separate databases that will be migrated from the Oracle environment. If schemas are already being used within the Oracle environment then it may be necessary to use a new naming convention to move the existing Oracle tables and views to the new environment (e.g. concatenate the existing Oracle schema and table names into the new Azure Synapse table name and use schema names in the new environment to maintain the original separate database names). Another option is to use SQL views over the underlying tables to maintain the logical structures -- but there are some potential downsides to this approach:

- Views in Azure Synapse are read-only -- therefore any updates to the data must take place on the underlying base tables

There may already be a layer (or layers) of views in existence and adding an extra layer of views might impact performance

#### Table considerations

Use existing indexes to give an indication of candidates for indexing in the migrated warehouse

When migrating tables between different technologies it is generally only the raw data (and the metadata that describes it) that gets physically moved between the 2 environments. Other database elements from the source system (e.g. indexes) are not migrated as these may not be needed, or may be implemented differently within the new target environment.

However, it is important to understand where performance optimizations such as indexes have been used in the source environment as this information can give useful indication of where performance optimization might be added in the new target environment. For example, if bit-mapped indexes are frequently used by queries within the source Oracle environment, it may indicate that a non-clustered index should be created within the migrated Azure Synapse -- but also be aware that other native performance optimization techniques (such as table replication) may be more applicable than a straight 'like for like' creation of indexes.

SQL Migration Assistant for Oracle can give recommendations regarding migration options for table distribution and indexing.

#### Unsupported Oracle database object types

Oracle-specific features can generally be replaced by Azure Synapse features

Oracle implements some database objects that are not directly supported in Azure Synapse, but there are generally methods to achieve the same functionality within the new environment:

- Various indexing options -- In Oracle there are several indexing options which have no direct equivalent in Azure Synapse. For example, bit-mapped indexes, function-based indexes and domain indexes.

  It is possible to find out which columns are indexed and the index type by querying system catalog tables and views such as ALL_INDEXES,DBA_INDEXES and USER_INDEXES and DBA_IND_COL or by using the built-in queries in SQL Developer as shown in the screenshot below:
  
  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-queries-1.png" border="true" alt-text="Screenshot showing how to query system catalog tables and views in Oracle SQL Developer.":::

  Alternatively, to find all indexes of a given type, simply run queries such as: select \* from dba_indexes where index_type like \'FUNCTION-BASED%\' Function-based indexes are a special case where there is no direct equivalent in Azure Synapse -- i.e. the index contains the result of a function on the underlying data columns. The recommendation in this case is to migrate the data and then test queries that were using the function-based index in the Oracle environment -- it may well be thatAzure Synapse performance is acceptable. If not, then consider creating a column which contains the pre-calculated value and index that instead. It is also possible to find which indexes are actually used by querying the dba_index_usage or v\$object_usage views if monitoring has been enabled -- e.g. 

  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-queries-2.png" border="true" alt-text="Screenshot showing how to find out which indexes are used in Oracle SQL Developer.":::

  Of course, it only makes sense to implement indexes in the migratedSynapse environment that are actually being used. Azure Synapse currently supports the following index types:

  :::image type="content" source="../media/1-design-performance-migration/azure-synapse-analytics-index-types.png" border="true" alt-text="Screenshot showing the index types that Azure Synapse Analytics supports.":::

  Note that other features of Azure Synapse (e.g. parallel query processing and in-memory caching of data and results) mean that typically fewer indexes are required in to achieve the required performance for data warehouse applications. The recommendations for index definition in Synapse are as follows: **Clustered column store indexes**. By default, SQL Data Warehouse creates a clustered column store index when no index options are specified on a table. Clustered column store tables offer both the highest level of data compression as well as the best overall query performance. Clustered column store tables will generally outperform clustered index or heap tables and are usually the best choice for large tables. For these reasons, clustered column store is the best place to start when you are unsure of how to index your table. There are a few scenarios where clustered column store may not be a good option:

- column store tables do not support varchar(max), nvarchar(max) and varbinary(max). Consider heap or clustered index instead.

- column store tables may be less efficient for transient data. Consider heap and perhaps even temporary tables.

- Small tables with less than 100 million rows. Consider heap tables.

**Clustered and nonclustered indexes** Clustered indexes may outperform clustered column store tables when a single row needs to be quickly retrieved. For queries where a single or very few row lookups is required to performance with extreme speed,consider a cluster index or nonclustered secondary index. The disadvantage to using a clustered index is that only queries that benefit are the ones that use a highly selective filter on the clustered index column. To improve filter on other columns a nonclustered index can be added to other columns. However, each index which is added to a table adds both space and processing time to loads. **Heap tables** When you are temporarily landing data on SQL Data Warehouse, you may find that using a heap table makes the overall process faster. This is because loads to heaps are faster than to index tables and in some cases the subsequent read can be done from cache. If you are loading data only to stage it before running more transformations, loading the table to heap table is much faster than loading the data to a clustered column store table. In addition, loading data to a [temporary table](../../sql-data-warehouse/sql-data-warehouse-tables-temporary.md) loads faster than loading a table to permanent storage. For small lookup tables, less than 100 million rows, often heap tables make sense. Cluster column store tables begin to achieve optimal compression once there are more than 100 million rows.

- Clustered tables -- In Oracle tables can be organized so that rows of tables that are frequently accessed together (based on a common value) are physically stored together, reducing disk I/O when this data is retrieved. There is also a hash-cluster option for individual tables, where a hash value is applied to the cluster key and rows with the same hash value are stored physically close together. To list clusters within an Oracle database, use the query

SELECT \* FROM DBA_CLUSTERS;

And to find if a table is within a cluster the query

SELECT \* FROM TAB;

Will show the table name and cluster ID for each table;

In Azure Synapse a similar effect can be achieved by use of materialized and/or use of replicated tables to minimize the I/O required at query run time.

- Materialized views -- Oracle supports materialized views and recommends that 1 (or more) of these is created over large tables that have many columns where only a few of those columns are regularly used in queries. Materialized views are automatically maintained by the system when data in the base table is updated.

As of May 2019, Microsoft has announced that Azure Synapse will support materialized views which have the same functionality as Oracle-- this feature is now available in preview.

- In-database triggers -- A trigger in Oracle is executed automatically when a triggering event takes place. The event can be any of the following:

- A data manipulation language (DML) statement executed against a table e.g., INSERT, UPDATE, or DELETE. For example, if you define a trigger that fires before an INSERT statement on the customers table, the trigger will fire once before a new row is inserted into the customers table.

- A data definition language (DDL) statement executes e.g., CREATE or ALTER statement. These triggers are often used for auditing purposes to record changes of the schema.

- A system event such as startup or shutdown of the Oracle Database.

- A user event such as login or logout.

A list of triggers defined in an Oracle database can be found by querying the ALL_TRIGGERS, DBA_TRIGGERS or USER_TRIGGERS views as shown in the example below:

  :::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-triggers.png" border="true" alt-text="Screenshot showing how to query for a list of triggers in Oracle SQL Developer.":::

  Azure Synapse does not currently support this functionality within the database -- however equivalent functionality can be incorporated usingAzure Data Factory though this will require refactoring of processes that use triggers.

- Synonyms -- Oracle allows the definition of synonyms which are alternative names for a table, view, sequence, procedure, stored function, package, materialized view, Java class schema object, user-defined object type, or another synonym.

Azure Synapse does not currently support this feature -- if the synonym refers to a table or view, then a view can be defined to provide an alternative name. If the synonym refers to a function or stored procedure then another function or procedure which calls the target can replace the synonym.

- User-defined types -- Oracle allows the definition of user-defined objects which can contain a series of individual fields, each with their own definition and default values. These user-defined objects can then be referenced within a table definition in the same way as built-in data types (e.g. NUMBER or VARCHAR).

To view a list of user-defined types within an Oracle database, query the views ALL_TYPES, DBA_TYPES or USER_TYPES. Azure Synapse does not currently support this feature -- if the data to be migrated includes user-defined data types, they must be either'flattened' into a conventional table definition, or normalized to a separate table in the case of arrays of data.

#### Oracle data type mapping

Assess the impact of unsupported data types as part of the preparation phase

Most Oracle data types have a direct equivalent in the Azure Synapse -- below is a table which shows these data types together with the recommended approach for mapping these.

&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- Oracle Data Type Azure Synapse Data Type &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;- &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; BFILE Not supported in Azure Synapse Analytics but can map to VARBINARY (MAX)

BINARY_FLOAT Not supported in Azure Synapse Analytics but can map to FLOAT

BINARY_DOUBLE Not supported in Azure Synapse Analytics but can map to DOUBLE

BLOB BLOB data type isn\'t directly supported but can be replaced with VARBINARY(MAX)

CHAR CHAR

CLOB CBLOB data type isn\'t directly supported but can be replaced with VARCHAR(MAX)

DATE DATE in Oracle an contain time information as well. Therefore depending on usage it can map to DATE or TIMESTAMP

DECIMAL DECIMAL

DOUBLE PRECISION DOUBLE

FLOAT FLOAT

INTEGER INT

INTERVAL YEAR TO MONTH INTERVAL data types aren\'t supported in Azure Synapse Analytics. but date calculations can be done with the date comparison functions (e.g. DATEDIFF and DATEADD)

INTERVAL DAY TO SECOND INTERVAL data types aren\'t supported in Azure Synapse Analytics. but date calculations can be done with the date comparison functions (e.g. DATEDIFF and DATEADD)

LONG  Not supported in Azure Synapse Analytics but can map to VARCHAR(MAX)

LONG RAW Not supported in Azure Synapse Analytics but can map to VARBINARY(MAX)

NCHAR NCHAR

NVARCHAR2 NVARCHAR

NUMBER  NUMBER

NCLOB NCLOB data type isn\'t directly supported but can be replaced with NVARCHAR(MAX)

NUMERIC NUMERIC

ORD media data types Not supported in Azure Synapse Analytics

RAW Not supported in Azure Synapse Analytics but could map to VARBINARY

REAL REAL

ROWID Not supported in Azure Synapse Analytics but may map to GUID as this is similar

SDO Geospatial data types Not supported in Azure Synapse Analytics

SMALLINT SMALLINT

TIMESTAMP DATETIME2 and CURRENT_TIMESTAMP function

TIMESTAMP WITH LOCAL TIME TIME WITH LOCAL TIME ZONE is not supported ZONE in Azure Synapse Analytics but can map to DATETIMEOFFSET

TIMESTAMP WITH TIME ZONE TIME WITH TIME ZONE isn\'t supported because TIME is stored using \"wall clock\" time only without a time zone offset

URIType URIType is not supported but a URI can be stored in a VARCHAR

UROWID Not supported in Azure Synapse Analytics but may map to GUID as this is similar

VARCHAR VARCHAR

VARCHAR2  VARCHAR

XMLType XMLType is not supported in Azure Synapse Analytics but XML data could be accommodated in a VARCHAR &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--

There are third party vendors who offer tools and services to automate migration including the mapping of data types as described above. Also, if a third party ETL tool such as Informatica or Talend is already in use in the Oracle environment, these can implement any required data transformations.

#### SQL DML syntax differences

There are important differences in SQL Data Manipulation Language (DML) syntax between Oracle SQL and Azure Synapse to be aware of when migrating. These are covered in detail in the associated document 'Section 5.3 - Minimizing SQL Issues for Oracle Migrations'. In some cases, the migration of DML can be automated using tools from Microsoft (i.e. SQL Server Migration Assistant for Oracle or Azure Database Migration Services) or by using third party migration products and services.

#### Functions, stored procedures and sequences

Assess the number and type of non-data objects to be migrated as part of the preparation phase

When migrating from a mature legacy data warehouse environment such as Oracle there are often elements other than simple tables and views which need to be migrated to the new target environment. Examples of this in Oracle are Functions, Stored Procedures and Sequences.

As part of the preparation phase, an inventory of these objects which are to be migrated should be created and the method of handling them defined, with an appropriate allocation of resources assigned in the project plan.

It may be that there are facilities in the Azure environment that replace the functionality implemented as functions or stored procedures in the Oracle environment -- in which case it is generally more efficient to use the built-in Azure facilities rather than re-coding the Oracle functions.

third party vendors offer tools and services that can automate the migration of these -- see for example see Attunity or WhereScape migration products.

See below for more information on each of these elements:

##### Functions

In common with most database products, Oracle supports system functions and also user-defined functions within the SQLimplementation. When migrating to another database platform such asAzure Synapse common system functions are generally available and can be migrated without change. Some system functions may have slightly different syntax but the required changes can be automated in this case. A list of functions within an Oracle database can be found by querying the ALL_OBJECTS view with the appropriate WHERE clause -- e.g.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-functions.png" border="true" alt-text="Screenshot showing how to query for a list of functions in Oracle SQL Developer.":::

For system functions where there is no equivalent, of for arbitrary user-defined functions these may need to be re-coded using the language(s) available in the target environment. Oracle user-defined functions are coded in PL/SQL, Java or C whereas Azure Synapse uses the popular Transact-SQL language for implementation of user-defined functions.

##### Stored procedures

Most modern database products allow for procedures to be stored within the database -- in the Oracle case the PL/SQL language is provided forth is purpose. A stored procedure typically contains SQL statements and some procedural logic and may return data or a status. A list of functions within an Oracle database can be found by querying the ALL_OBJECTS view with the appropriate WHERE clause -- e.g.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-developer-procedures.png" border="true" alt-text="Screenshot showing how to query for a list of stored procedures in Oracle SQL Developer.":::

SQL Azure Data Warehouse also supports stored procedures using T-SQL-- so if there are stored procedures to be migrated they must be recoded accordingly.

##### Sequences

In Oracle a sequence is a named database object created via CREATESEQUENCE that can provide the unique value via the CURRVAL and NEXTVAL methods. These can be used to generate unique numbers that can be used as surrogate key values for primary key values. Within Azure Synapse there is no CREATE SEQUENCE so sequences are handled via use of IDENTITY columns or using SQL code to create the next sequence number in a series.

### Extracting metadata and data from an Oracle environment

#### Data Definition Language (DDL) generation

It is possible to edit existing Oracle CREATE TABLE and CREATE VIEW scripts to create the equivalent definitions (with modified data types if necessary as described above) -- typically this involves removing or modifying any extra Oracle-specific clauses (e.g. TABLESPACE).

However, all the information that specifies the current definitions of tables and views within the existing Oracle environment is maintained within system catalog tables -- this is the best source of this information as it is bound to be up to date and complete. (Be aware that user-maintained documentation may not be in sync with the current table definitions).

This information can be accessed via utilities such as SQL Developer and can be used to generate the CREATE TABLE DDL statements which can then be edited for the equivalent tables in Azure Synapse.

SQL Server Migration Assistant for Oracle can be used to migrate tables from and existing Oracle environment to Azure Synapse, applying appropriate data type mappings and recommending table and distribution types.

:::image type="content" source="../media/1-design-performance-migration/oracle-sql-server-migration-assistant-2.png" border="true" alt-text="Screenshot showing how to migrate tables from and existing Oracle environment to Azure Synapse using SQL Server Migration Assistant for Oracle.":::

third party migration and ETL tools also use the catalog information to achieve the same result.

#### Data extraction from Oracle

Use parallelism for the most efficient data extract

The raw data to be migrated from existing Oracle tables can be extracted to flat delimited files (e.g. comma-separated variables or CSV format) using standard Oracle utilities such as SQLPlus, SCLcl and SQL Developer. These files can be compressed using gzip and uploaded to Azure Blob Storage via AzCopy or by using Azure data transport facilities such as Azure Data Box.

Generally during a migration exercise, it is important to extract the data as efficiently as possible (especially for very large fact tables) and the recommended approach for this with Oracle is to use parallelism where possible to maximize the throughput for the extraction process. This may be achieved by running multiple individual extract process which extract discrete segments of data, or by using tools which are capable of automating parallel extraction based on partitioning.

If sufficient network bandwidth exists data can be extracted directly from an on-premises Oracle system into Azure Synapse tables or Azure Blob Data Storage by using Azure Data Factory processes or Azure Data Migration Services. This capability is also available from third party data migration or ETL products such as Informatica and Talend.

Recommended data formats for the extracted data are delimited text files (also called Comma Separated Values or CSV or similar) or Optimized Row Columnar (ORC) or Parquet files.

For more detailed information on the process of migrating data and ETL from an Oracle environment see the associated document 'Section 2.3. Data Migration ETL and Load from Oracle.

## Performance recommendations for Oracle migrations

The associated document 'Section 1 -- Design and Performance' gives general information and guidelines about use of performance optimization techniques for Azure Synapse. This section adds specific recommendations for use when migrating from an Oracle environment

#### Similarities in performance tuning approach concepts

Many Oracle tuning concepts hold true for Azure Synapse

When moving from an Oracle environment many of the performance tuning concepts for Azure Data Warehouse will be very familiar. For example:

- Using data distribution to co-locate data to be joined onto the same processing node

- Using the smallest data type for a given column will save storage space and accelerate query processing

- Ensuring data types of columns to be joined are identical will optimize join processing by reducing the need to transform data for matching

- Ensuring statistics are up to date will help the optimizer produce the best execution plan

- Monitoring performance using the built-in capabilities of the database to ensure that resources are being efficiently used.

#### Differences in performance tuning approach

Familiarity with Azure Synapse tuning options is an early priority in a migration exercise

This section highlights lower level implementation differences between Oracle and Azure Synapse for performance tuning.

##### Data distribution options

Azure Synapse is designed to exploit a multi-node architecture and parallel processing for performance, and to optimize this CREATE TABLEstatements in Azure Synapse allow for specification of a data distribution definition -- via 'DISTRIBUTION =' in Azure Synapse. ManyOracle implementations (especially older on-premises systems) do not include this consideration. Compared to Oracle, Azure Synapse provides an additional way to achieve 'local joins' for small table-large table joins (typically dimension table to fact table in a start schema model) is to replicate the smaller dimension table across all nodes, therefore ensuring any value of the join key of the larger table will have a matching dimension row locally available. The overhead of replicating the dimension tables is relatively low provided the tables are not very large -- in which case the hash distribution approach as described above is more appropriate.

##### Data indexing

Azure Synapse provides a number of user definable indexing options, but these are different in operation and usage to the system managed zone maps in Oracle. Understand the different indexing options as described in [Indexes on dedicated SQL pool tables in Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-tables-index.md).

Existing index definitions within the source Oracle environment can however provide a useful indication of how the data is currently used and provide an indication of candidate columns for indexing within theAzure Synapse environment. It is not usually necessary to migrate every index that exists in a legacy Oracle environment -- Oracle relies heavily on indexes to achieve acceptable performance whereas Azure Synapse has other features designed to provide excellent performance such as:

- Parallel query processing

- In-memory data and result set caching

- Data distribution to reduce I/O (e.g. replication of small dimension tables)

##### Data partitioning

In an enterprise data warehouse fact tables can contain many billions of rows and partitioning is a way to optimize the maintenance and querying of these tables by splitting them into separate parts to reduce the amount of data processed. The partitioning specification for a table is defined in the CREATE TABLE statement. Only 1 field per table can be used for partitioning, and this is frequently a date field as many queries will be filtered by date or a date range. Note that it is possible to change the partitioning of a table after initial load if necessary by recreating the table with the new distribution using the CREATE TABLE AS (or CTAS) statement. See 
[Partitioning tables in dedicated SQL pool](../../sql-data-warehouse/sql-data-warehouse-tables-partition.md) for a detailed discussion of partitioning in Azure Synapse.

##### PolyBase or COPY INTO for data loading

PolyBase is a very efficient method for loading large amounts of data into the Warehouse as it is able to leverage parallel loading streams. COPY INTO is a new facility which is also very efficient and has the following capabilities: Retrieves data from all files from the folder and all its subfolders. Supports multiple locations from the same storage account, separated by comma Supports Azure Data Lake Storage (ADLS) Gen 2 and Azure Blob Storage. Supports CSV, PARQUET, ORC file formats

##### Use resource classes for workload management

Azure Synapse uses resource classes to manage workloads -- in general large resource classes provide better individual query performance while smaller resource classes enable higher levels of concurrency.Utilization can be monitored via Dynamic Management Views (DMVs) to ensure that the appropriate resources are being utilized efficiently.

## Next steps

To learn about ETL and load for Oracle migration, see the next article in this series: [Data migration, ETL, and load for Oracle migrations](2-etl-load-migration-considerations.md).