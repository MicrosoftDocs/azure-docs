---
title: "Data migration, ETL, and load for Oracle migrations"
description: Learn how to plan your data migration from Oracle to Azure Synapse Analytics to minimize the risk and impact on users. 
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

# Data migration, ETL, and load for Oracle migrations

This article is part two of a four part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. This article provides best practices for ETL and load migration.

## Overview

'More than just a database' -- the Azure environment includes a comprehensive set of capabilites and tools

Given the cost and complexity of maintaining and upgrading legacy on-premise Oracle environments, many existing users of Oracle data warehouse systems are now looking to take advantage of the innovations provided by newer environments (e.g. cloud, IaaS, PaaS) and to delegate tasks such as infrastructure maintenance and platform development to the cloud provider.

While there are similarities between Oracle and Azure Synapse in that both are SQL databases designed to use massively parallel processing (MPP) techniques to achieve high query performance on very large data volumes, there are also some basic differences in approach:

- Legacy Oracle systems will usually be installed on-premise, using relatively expensive hardware, whereas Azure Synapse is cloud based using Azure storage and compute resources.

- Upgrading an Oracle configuration is a major task involving additional physical hardware and a potentially lengthy database reconfiguration or dump and reload. Since storage and compute resources are separate in the Azure environment these can easily be scaled (upwards and downwards) independently leveraging the elastic scalability capability.

- Azure Synapse can be paused or resized as required to reduce resource utilization and therefore cost.

Microsoft Azure is a globally available, highly secure, scalable cloud environment which includes Azure Synapse within an eco-system of supporting tools and capabilities.

![A screenshot of a cell phone Description automatically generated](media/image1.png)

Azure Synapse provides best-of-breed relational database performance by using techniques such as massively parallel processing (MPP) and automatic in-memory caching -- the results of this approach can be seen in independent benchmarks such as the one run recently by GigaOm -- see <https://gigaom.com/report/data-warehouse-cloud-benchmark/> which compares Azure Synapse to other popular cloud data warehouse offerings. Customers who have already migrated to this environment have seen many benefits including:

- Improved performance and price/performance

- Increased agility and shorter time to value

- Faster server deployment and application development

- Elastic scalability -- only pay for actual usage

- Improved security/compliance

- Reduced storage and Disaster Recovery costs

- Lower overall TCO and better cost control (OPEX)

To maximize these benefits, it is necessary to migrate existing (or new) data and applications to the Azure Synapse platform, and in many organizations this will include migration of an existing data warehouse from legacy on-premise platforms such as Oracle. At a high level, the basic process will include the following steps:

![](media/image2.png)

This paper looks at the data migration, ETL and loading aspects of migration from a legacy Oracle data warehouse and data marts onto Azure Synapse. The topics included in this paper apply specifically to migrations from an existing Oracle environment.

## Data migration considerations

### Initial decisions regarding data migration from Oracle

When it comes to migrating an Oracle data warehouse, there are a few basic questions associated with data that need to be asked. For example:

- Should unused table structures be migrated or not?

- What's the best migration approach to minimize risk and impact for users?

- Migrating data marts -- stay physical or go virtual?

The next sections discuss these points within the context of a migration from Oracle.

#### Migrate unused tables?

In legacy systems it is not unusual for tables to become redundant over time -- these don't need to be migrated in most cases

It generally makes sense to only migrate the tables that are actually in use in the existing system. Tables which are not active can be archived rather than migrated so that the data is available if required in future. It's best to use system metadata and logfiles to determine which tables are in use, rather than documentation as documentation may be out of date.

Oracle system catalog tables and logs contain information which can be used to determine when a given table was last accessed -- which in turn can be used to decide whether or not a table is a candidate for migration.

If you have licensed the Oracle Diagnostic Pack, then you will have access to Active Session History which samples data over time to let you know which queries have been running within a specific given time window. You can therefore query the data collected in the Active Session History to determine what tables have been used inside a given time window. An example of such a query is shown below:

> SELECT  du.username, > >         s.sql_text, > >         MAX(ash.sample_time) AS last_access , > >         sp.object_owner , > >         sp.object_name , > >         sp.object_alias as aliased_as , > >         sp.object_type , > >         COUNT(\*) AS access_count > > FROM    v\$active_session_history ash > >         JOIN v\$sql s ON ash.force_matching_signature = > s.force_matching_signature > >         LEFT JOIN v\$sql_plan sp ON s.sql_id = sp.sql_id > >         JOIN DBA_USERS du ON ash.user_id = du.USER_ID > > WHERE   ash.session_type = \'FOREGROUND\' > >         AND ash.SQL_ID IS NOT NULL > >         AND sp.object_name IS NOT NULL > >         AND ash.user_id \<\> 0 > > GROUP BY du.username, > >         s.sql_text, > >         sp.object_owner, > >         sp.object_name, > >         sp.object_alias, > >         sp.object_type > > ORDER BY 3 DESC;

This may take a while to run if you have been running a lot of queries

#### What's the best migration approach to minimize risk and impact on users?

Migrate the existing model 'as-is' initially even if a change to the data model is planned for the future

This question comes up a lot as companies may want to lower the impact of changes to the data warehouse data model to improve agility and would like to seize the opportunity to do so during a migration to modernize their data model. This carries higher risk as it would almost certainly impact ETL jobs populating the data warehouse and also taking from a data warehouse to feed dependent data marts. Therefore, it may be better to do a re-design of this kind of scale after data warehouse migration.

Even if a data model change is to be part of the overall migration, it is good practice the migrate the existing model 'as-is' to Azure Synapse, then do any re-engineering on the new platform. This approach has the advantage of minimizing the impact on existing production systems while also leveraging the performance and elastic scalability of the Azure platform for one-off re-engineering tasks. 

#### Migrating data marts -- stay physical or go virtual??

Virtualizing data marts can save on storage and processing resources

In legacy Oracle data warehouse environments it is common practice to create a number of data marts which are structured to provide good performance for ad hoc self-service queries and reports for a given department or business function within an organization.

As such, a data mart typically consists of a subset of the data warehouse containing aggregated versions of the data in a form that enables users to easily query that data with fast response times via user-friendly query tools such as Oracle BI EE, Microsoft Power BI, Tableau or Microstrategy. This form is generally a dimensional data model, and one use of data marts is to expose the data in a usable form even if the underlying warehouse data model is something different (e.g. data vault).

Separate data marts for individual business units within an organization can also be used to implement robust data security regimes, by only allowing user access to specific data marts relevant to them, and eliminating, obfuscating or anonymizing sensitive data.

If these data marts are implemented as physical tables, they required additional storage resources to store them and also additional processing to build and refresh them on a regular basis. It also implies that the data in the mart is only as up to date as the last refresh operation -- so it may not be suitable for highly volatile data dashboards.

The performance and scalability of Azure Synapse enables virtualization without sacrificing performance

With the advent of relatively low cost scalable MPP architectures such as Azure Synapse and their inherent performance characteristics, it may be that data mart functionality can be provided without having to instantiate the mart as a set of physical tables. This is achieved by effectively virtualizing the data marts via SQL views on to the main data warehouse or via a virtualization layer using features such as views in Azure or 3^rd^ party virtualization products such as **Denodo**. This approach simplifies or eliminates the need for additional storage and aggregation processing and reduces the overall number of database objects to be migrated.

There is also another potential benefit of this approach -- by implementing the aggregation and join logic within a virtualization layer and presenting external reporting tools via a virtualized view, the processing required to create these views is 'pushed down' into the data warehouse, which is generally the best place to run joins and aggregations etc. on large data volumes.

The primary drivers for choosing to implement physical or virtual data mart implementation are:

- More agility as a virtual data mart is easier to change than physical tables and the associated ETL processes

- Lower total cost of ownership because of fewer data stores and copies of data in a virtualized implementation

- Elimination of ETL jobs to migrate and simplified DW architecture in a virtualized environment

- Performance -- historically physical data marts have been more performant, though virtualization products are now implementing intelligent caching techniques to mitigate this

### Data migration from Oracle

#### Understand your data

Part of the migration planning should be to understand in detail the volume of data to be migrated as this can impact decisions on the migration approach to take. Use system metadata to determine the physical space taken up by the 'raw data' within the tables to be migrated. In this context 'raw data' means the amount of space used by the data rows within a table excluding overheads such as indexes and any compression. This is especially true for the largest fact tables as these will typically comprise \> 95% of the data.

A query that will give you the total database size in Oracle is

SELECT

( SELECT SUM(bytes)/1024/1024/1024 data_size

FROM sys.dba_data_files ) +

( SELECT NVL(sum(bytes),0)/1024/1024/1024 temp_size

FROM sys.dba_temp_files ) +

( SELECT SUM(bytes)/1024/1024/1024 redo_size FROM sys.v\_\$log ) +

( SELECT SUM(BLOCK_SIZE\*FILE_SIZE_BLKS)/1024/1024/1024 controlfile_size

FROM v\$controlfile) \"Size in GB\"

FROM dual

where the DB size equals the size of (data files + temp files + online/offline redo log files + control files)- Overall DB size includes used space and free space. An example of a query that will a breakdown of disk spaced used by table data and indexes is as follows:

SELECT

   owner, \"Type\", table_name \"Name\", TRUNC(sum(bytes)/1024/1024) Meg

FROM

(  SELECT segment_name table_name, owner, bytes, \'Table\' as \"Type\"

   FROM dba_segments

   WHERE segment_type in  (\'TABLE\',\'TABLE PARTITION\',\'TABLE SUBPARTITION\')

UNION ALL

   SELECT i.table_name, i.owner, s.bytes, \'Index\' as \"Type\"

   FROM dba_indexes i, dba_segments s

   WHERE s.segment_name = i.index_name

   AND   s.owner = i.owner

   AND   s.segment_type in (\'INDEX\',\'INDEX PARTITION\',\'INDEX SUBPARTITION\')

UNION ALL

   SELECT l.table_name, l.owner, s.bytes, \'LOB\' as \"Type\"

   FROM dba_lobs l, dba_segments s

   WHERE s.segment_name = l.segment_name

   AND   s.owner = l.owner

   AND   s.segment_type IN (\'LOBSEGMENT\',\'LOB PARTITION\',\'LOB SUBPARTITION\')

UNION ALL

   SELECT l.table_name, l.owner, s.bytes, \'LOB Index\' as \"Type\"

   FROM dba_lobs l, dba_segments s

   WHERE s.segment_name = l.index_name

   AND   s.owner = l.owner

   AND   s.segment_type = \'LOBINDEX\')

   WHERE owner in UPPER(\'&owner\')

GROUP BY table_name, owner, \"Type\"

HAVING SUM(bytes)/1024/1024 \> 10  /\* Ignore really small tables \*/

ORDER BY SUM(bytes) desc;

In addition, the Microsoft database migration team provides a number of resources including an asset called [Oracle Inventory Script Artefacts](https://datamigration.microsoft.com/scenario/oracle-to-sqldw?step=1) that can be found on [GitHub](https://github.com/Microsoft/DataMigrationTeam/tree/master/Oracle%20Inventory%20Script%20Artifacts). This includes a PL/SQL query that accesses Oracle system tables and provides a count of objects by schema type, object type, and status. It also provides a rough estimate of 'Raw Data' in each schema and the sizing of tables in each schema, with results stored in a CSV format. A calculator spreadsheet is also included which takes the CSV as input and provides sizing data.

You could also get an accurate number for this for a given table by extracting a representative sample of the data (e.g. 1 million rows) to an uncompressed delimited flat ASCII data file and use the size of that to give an average raw data size per row of that table. Multiply this average size by the total number of rows in the full table to give a raw data size for that table and use this figure in planning.

#### Oracle data type mapping

Assess the impact of unsupported data types as part of the preparation phase

Some Oracle datatypes are not directly supported in Azure Synapse -- below is a table which shows these data types together with the recommended approach for handling these.

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

User-defined types -- Oracle allows the definition of user-defined objects which can contain a series of individual fields, each with their own definition and default values. These user-defined objects can then be referenced within a table definition in the same way as built-in data types (e.g. NUMBER or VARCHAR).

> Azure Synapse does not currently support this feature -- if the data > to be migrated includes user-defined data types, they must be either > 'flattened' into a conventional table definition, or normalised to a > separate table in the case of arrays of data.

By querying the Oracle static data dictionary view DBA_TAB_COLUMNS, you can determine what data types are in use in a schema and whether or not any of these data types need to be changed. The SQL queries below can be used to find the columns with data types that do not map directly to data types in Azure Synapse Analytics and also to count the number of occurences of each data type in any Oracle schema that do not map directly. Using the results from these queries in combination with the data type comparison table above, you can determine which data types need to be changed in a Synapse environment:

To find the columns with data types that do not have a mapping to data types in Azure Synapse Analytics you can use the following query replacing \<owner_name\> with the relevant owner of your schema:

 

SELECT owner, table_name, column_name, data_type

FROM dba_tab_columns

WHERE owner in ('\<owner_name\>')

AND data_type NOT IN 

(\'BINARY_DOUBLE\',\'BINARY_FLOAT\',\'CHAR\',\'DATE\',\'DECIMAL\',\'FLOAT\',\'LONG\',\'LONG RAW\',\'NCHAR\', \'NUMERIC\', \'NUMBER\',\'NVARCHAR2\', \'SMALLINT\',\'RAW\', \'REAL\',\'VARCHAR2\', \'XML_TYPE\') 

ORDER BY 1,2,3;

 

To count the number of 'non-mappable' data types you can use the following query:

 

SELECT data_type, count(\*) 

FROM dba_tab_columns 

WHERE data_type NOT IN 

(\'BINARY_DOUBLE\',\'BINARY_FLOAT\',\'CHAR\',\'DATE\',\'DECIMAL\',\'FLOAT\',\'LONG\',\'LONG RAW\',\'NCHAR\', \'NUMERIC\', \'NUMBER\',\'NVARCHAR2\', \'SMALLINT\',\'RAW\', \'REAL\',\'VARCHAR2\', \'XML_TYPE\') 

GROUP BY data_type 

ORDER BY data_type;

Microsoft also offers SQL Server Migration Assistant (SSMA) to automate migration of data warehouses from legacy Oracle environments including the mapping of data types as described above as well as Azure Migration Services to help with the migration process. In addition, there are 3^rd^ party vendors who offer tools and services to automate migration. Also, if Oracle Data Integrator or a 3^rd^ party ETL tool such as Informatica or Talend is already in use in the Oracle environment, these can implement any required data transformations. The next section explores migration of existing ETL processes.

## ETL migration considerations

### Initial decisions regarding Oracle ETL migration

Plan the approach for ETL migration ahead of time and leverage Azure facilities where appropriate

For ETL/ELT processing, legacy Oracle data warehouses may use custom-built scripts, Oracle Data Integrator (ODI) or a 3rd party ETL tool such as Informatica or Talend. Sometimes there is a combination of approaches that has evolved over time. When planning a migration to Azure Synapse, the question is how best to implement the required ETL/ELT processing in the new environment, while minimizing the cost and risk involved.

The sections below discuss the options available and make some recommendations for the various use cases. One way to decide on the approach to take can be summarized by the following flowchart:

![](media/image3.png)

The initial step should always be to build an inventory of ETL/ELT processes to be migrated -- again, as with other steps, it may be that standard 'built-in' Azure features mean that some existing processes need not be migrated. For planning purposes, it is important to understand the scale of the migration to be performed.

In the flowchart above, decision 1 relates to the high-level question of whether there has already been a decision to move to a totally Azure-native environment. If so, then the recommendation is to re-engineer the ETL processing using Azure Data Factory (ADF) and associated utilities.

If that is not the case, then decision 2 is whether an existing 3rd party ETL tool is already in use. In the Oracle environment, some (or all) of the ETL processing may be performed by custom scripts using Oracle-specific utilities such as SQL\*Developer, SQL\*Loader or Data Pump. The approach in this case is again to re-engineer using ADF.

If Oracle Data Integrator (ODI) or a 3rd party ETL tool such as Informatica or Talend is already in use, (and especially if there is a large investment in skills and a large number of existing workflows and schedules in place using that tool) then decision 3 is based on whether the tool can efficiently support Azure Synapse as a target environment. Ideally the tool will include 'native' connectors which can leverage facilities such as Azure Synapse Analytics COPY INTO for the most efficient parallel data loading or PolyBase, but even if these are not in place there is generally a way of calling an external process (e.g. Polybase) and passing the appropriate parameters. In this case the existing skills and workflows can be leveraged, with the new Azure Synapse becoming the target environment. If you are using ODI for ELT processing, then ODI Knowledge Modules would be needed for Azure Synapse Analytics. If these are not available to you in your organization, but you have ODI, then you can use ODI to generate flat files that can then be moved to Azure and ingested into Azure Data Lake Storage Gen2 for loading into Azure Synapse Analytics.

Consider running ETL tools in Azure to leverage performance, scalability and cost benefits

If retaining an existing 3rd party ETL tool, there may be benefits to running that tool within the Azure environment (rather than an existing on-premise ETL server) and also that the overall orchestration of the existing workflows could be handled by Azure Data Factory. So decision 4 is whether to leave the existing tool running 'as-is' or to move it into the Azure environment to gain cost, performance and scalability benefits.

### Re-engineering existing Oracle-specific scripts

The inventory of ETL tasks to be migrated should include scripts and stored procedures

If some or all of the existing Oracle warehouse ETL/ELT processing is handled by custom scripts which utilize Oracle-specific utilities such as SQL\*Plus, SQL\*Developer, SQL\*Loader or Data Pump then these need to be re-coded for the new Azure Synapse environment. Similarly, if ETL processes have been implemented using stored procedures in Oracle, these will also have to be recoded.

Some elements of the ETL process are relatively easy to migrate (e.g. simple bulk data loads into a staging table from an external file) and it may even be possible to automate these parts of the process, for example using Azure Synapse COPY INTO or PolyBase instead of SQL\*Loader. Other parts of the process which contain arbitrary complex SQL and/or stored procedures will take more time to re-engineer.

Use EXPLAIN to find SQL incompatibilities

One way of testing Oracle SQL for compatibility with Azure Synapse is to capture some representative SQL statements from a join of Oracle v\$active\_ session_history and v\$SQL to get the sql_text, then prefix those queries with 'EXPLAIN ' and then (assuming a like for like migrated data model in Azure Synapse) run those EXPLAIN statements in Azure Synapse. Any incompatible SQL will give an error -- and this information can be used to determine the scale of the re-coding task.

Partners offer products and skills to assist in re-engineering Oracle-specific code

In the worst case this will mean manual re-coding, but there are also products and services available from Microsoft partners to assist with this process. For example **Inspirer** offer tools and services to migrate Oracle SQL and stored procedures etc. to Azure Synapse -- see [https://www.ispirer.com/products/Oracle-to-azure-sql-data-warehouse-migration](https://www.ispirer.com/products/teradata-to-azure-sql-data-warehouse-migration)

### Using existing 3^rd^ party ETL tools

Leverage investment in existing 3rd party tools to reduce cost and risk

As described in the section above, in many cases the existing legacy data warehouse system will already be populated and maintained by a 3rd party ETL product such as Informatica or Talend. See <https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-partner-data-integration> for a list of current Microsoft data integration partners for Azure Synapse.

There are several popular ETL products which are frequently used in the Oracle community (some of which are already Microsoft partners listed at the link above). The following paragraphs discuss the most popular ETL tools currently in use with Oracle warehouses. All of these products can be run within a VM in Azure, and can read and write Azure databases and files.

#### Ab Initio

Ab Initio is a Business Intelligence platform comprised of six data processing products: Co\>Operating System, The Component Library, Graphical Development Environment, Enterprise Meta\>Environment, Data Profiler, and Conduct\>It. It is a powerful GUI-based parallel processing tool for ETL data management and analysis.

Ab Initio can run in a VM within Azure and can read and write Azure Storage for files and SQL Server databases via the 'Input Table', 'Output Table' and 'Run SQL' Ab Initio components.

#### Qlik

Qlik CloudBeam for Azure Synapse enables automated and optimized data loading from many enterprise databases into the Microsoft Azure Synapse - quickly, easily and affordably. It is available in the Microsoft Azure Marketplace -- see <https://www.attunity.com/products/cloudbeam/attunity-cloudbeam-azure/> for more details.

Qlik Replicate for Microsoft Migrations is for Microsoft customers who want to migrate data from popular commercial and open-source databases to the Microsoft Data Platform, including Oracle to Azure Synapse. It can be obtained from <https://www.qlik.com/us/products/technology/microsoft>

Qlik benefits for Azure Synapse include:

- Continuous database to Azure Synapse loading

- Quick transfer speeds with guaranteed delivery

- Intuitive administration and scheduling

- Data integrity assurance by way of check mechanisms

- Monitoring for peace-of-mind, control, and auditing

- Industry-standard SSL encryption for security

#### Informatica

Informatica (see <https://www.informatica.com/gb/> ) has 3 offerings, two of which are available in Azure Marketplace:

> **[Informatica Fast > Clone](https://docs.informatica.com/data-replication/fast-clone/10-0/installation-guide/installation-overview/fast-clone-installation-overview.html)** > is a high-performance data cloning tool for unloading Oracle data and > moving it quickly to other databases and warehouse appliances in a > heterogeneous environment. Fast Clone supports the following unload > methods: 

- Direct path unload. Reads data directly from Oracle data files, > without using the Oracle Call Interface (OCI). This method is much > faster than the conventional path unload method. However, you > cannot use the direct path unload method to run unload jobs from a > system that is remote from the Oracle source, perform SQL JOIN > operations on two or more tables, or unload data from views or > cluster tables. 

- Conventional path unload. Uses the OCI to retrieve metadata and data > from the Oracle source. This method is slower than the direct path > unload method, but it does not have the limitations of the direct > path unload method. 

> If you use the direct path unload method, you must install Fast Clone > on the Oracle source system and grant some system and object > permissions to the Fast Clone user. > > **Informatica Intelligent Cloud Services for Azure** offers a > best-in-class solution for self-service data migration, integration, > and management capabilities. Customers can quickly and reliably > import, and export petabytes of data to Azure from a variety of > sources. Informatica Intelligent Cloud Services for Azure provides > native, high volume, high-performance connectivity to Azure Synapse, > SQL Database, Blob Storage, Data Lake Store, and Azure Cosmos DB. > > **Informatica PowerCenter** is a metadata-driven data integration > platform that jumpstarts and accelerates data integration projects in > order to deliver data to the business more quickly than manual hand > coding. It serves as the foundation for your data integration > investments.

#### Hitachi Vantara Pentaho

Hitachi Vantara Pentaho provides data integration, OLAP services, reporting, information dashboards, data mining and extract, transform, load (ETL) capabilities.

Pentaho Data Integration (PDI) provides the Extract, Transform, and Load (ETL) capabilities that facilitates the process of capturing, cleansing, and storing data using a uniform and consistent format that is accessible and relevant to end users and IoT technologies.

Common uses of Pentaho Data Integration include:

- Data migration between different databases and applications

- Loading huge data sets into databases taking full advantage of cloud, clustered and massively parallel processing environments

- Data Cleansing with steps ranging from very simple to very complex transformations

- Data Integration including the ability to leverage real-time ETL as a data source for Pentaho Reporting

- Data warehouse population with built-in support for slowly changing dimensions and surrogate key creation

It is available in Azure Marketplace and has connectors available for Azure services such as HDInsight. See <https://www.ashnik.com/pentaho-cloud-deployment-with-microsoft-azure/> for more details.

#### Talend

Talend Cloud is a unified, comprehensive, and highly scalable integration platform as-a-service (iPaaS) that makes it easy to collect, govern, transform, and share data. Within a single interface, you can use Big Data integration, Data Preparation, API Services and Data Stewardship applications to provide trusted, governed data across your organization. It offers over 900 connectors and components, built-in data quality, and native support for the latest big data and cloud technologies, and software development lifecycle (SDLC) support for enterprises, at a predictable price.

With just a few clicks, you can deploy the remote engine to run integration tasks natively with your Azure account from cloud to cloud, on-premises to cloud or cloud to on-premises, completely within the customer's environment for enhanced performance and security. See <https://www.talend.com/solutions/information-technology/azure-cloud-integration/> for more information.

Talend can leverage Azure tools such as PolyBase to guarantee the most efficient data loading into Azure Synapse.

![](media/image4.png)

See <https://www.talend.com/blog/2017/02/08/leverage-load-data-microsoft-azure-sql-data-warehouse-using-polybase-talend-etl/> for details.

#### Wherescape

Wherescape® RED automation software is an integrated development environment that provides teams the automation to streamline workflows, eliminate hand-coding and cut the time to develop, deploy and operate data infrastructure, such as data warehouses, data vaults, data marts and data lakes by as much as 80%.

WhereScape automation is tailored for use with Microsoft SQL Server, Microsoft Azure SQL Database, Microsoft Azure Synapse and Microsoft Analytics Platforms System (PDW). See [https://www.wherescape.com](https://www.wherescape.com/) for full details.

## Data loading from Oracle 

### Choices available when loading data from Oracle

When it comes to migrating the data from an Oracle data warehouse, there are a few basic questions associated with data loading that need to be resolved. These involve deciding how the data will be physically moved from the existing on-premise Oracle environment into the new Azure Synapse Analytics in the cloud, and which tools will be used to perform the transfer and load.

- Will the data be extracted to files or moved directly via network?

- Will the process be orchestrated from the source system or from the Azure target environment?

- Which tools can be used to automate and manage the process?

#### Transfer data via files or network connection?

Understand data volumes to be migrated and available network bandwidth as these impact the approach decision

Once the database tables to be migrated have been created in Azure Synapse, the data to populate these tables will be moved out of the legacy Oracle system and loaded into the new environment. There are 2 basic approaches:

- **File Extract** -- In this case the data from the Oracle tables is extracted to flat delimited files (normally in 'Comma Separated Variable' (CSV) format). You can do this in several ways:

- Using standard Oracle SQLPlus, SQL Developer or SQLcl

- Using Oracle Data Integrator (ODI) to generate flat files

- Using Azure Data Factory Oracle Connector parallel copy to unload Oracle tables in parallel to enable loading of data by partitions

- Using 3^rd^ party tooling such as [Informatica Fast Clone](https://docs.informatica.com/data-replication/fast-clone/10-0/installation-guide/installation-overview/fast-clone-installation-overview.html) direct path (fastest method) or conventional path unload

- Using a 3^rd^ party ETL tool such as Informatica or Talend

> Further information on some of these approaches is covered in the > Appendices

This approach requires space to 'land' the data files that are extracted -- this space could be 'local' to the Oracle source database (if sufficient storage is available) or remotely in Azure Blob Storage. The best performance is generally achieved when the file is written locally, avoiding any network overhead.

To minimize the storage and network transfer requirements, it is good practice to compress the extracted data files using a utility such as gzip.

Once extracted, local compressed flat files can be moved into Azure Blob Storage. Microsoft provides various options to move large volumes of data including AzCopy (for moving files across the network into Azure Storage), Azure ExpressRoute for moving bulk data over a private network connection, or Azure Data Box where the files are moved to a physical storage device which is then shipped to an Azure data center for loading. The method of physically moving the data from local on-premise storage to the Azure cloud environment depends on the amount of data to be moved and the network bandwidth available. See <https://docs.microsoft.com/en-us/azure/architecture/data-guide/scenarios/data-transfer> for more details.

- **Direct extract and load across network** -- In this case, the target Azure environment sends a data extract request (normally via a SQL command) to the legacy Oracle system to extract the data and the results are sent across the network and loaded directly into Azure Synapse, with no need to 'land' the data into intermediate files. The limiting factor in this scenario is normally the bandwidth of the network connection between the Oracle database and the Azure environment. For very large data volumes this approach may not be practical.

A hybrid approach involving both methods is sometimes used -- e.g. use the direct network extract approach for smaller dimension tables and samples of the larger fact tables to quickly provide a test environment in Azure Synapse while using the file extract and transfer via Azure Data Box for the large volume historical fact tables.

#### Orchestrate from Oracle or Azure?

The recommended approach when moving to Azure Synapse is to orchestrate the data extract and loading from the Azure environment using SQL Server Migration Assistant (SSMA) or Azure Data Factory and associated utilities (e.g. COPY INTO for most efficient data loading or PolyBase). This approach leverages the Azure capabilities and provides an easy method to build reusable data loading pipelines. Also Azure Migration Services offers additional tooling.

Other benefits of this approach include reduced impact on the Oracle system during the data load process (as the management and loading process is running in Azure) and the ability to automate the process by using metadata-driven data load pipelines.

#### Which tools can be used?

The task of data transformation and movement is the basic function of all ETL products such as ODI or Informatica and also more modern data warehouse automation products such as Wherescape. If one of these products is already in use in the existing Oracle environment, then the migration task of moving the data from Oracle to Azure Synapse may be simplified by using the existing ETL tool. This assumes that the ETL tool supports Azure Synapse as a target environment (most modern tools do) or at least can generate flat files that can be moved to Azure.

Even if there isn't an existing ETL tool in place, it is worth considering using a tool to simplify the migration task. Tools such as Attunity Replicate (see <https://www.attunity.com/products/replicate/> ) are designed to simplify the task of data migration.

Finally, if using an ETL tool, consider running that tool within the Azure environment as this will benefit from Azure cloud performance, scalability and cost while also freeing up resources in the Oracle data center.

## Summary

To summarize the recommendations when migrating data and associated ETL processes from Oracle to Azure Synapse:

- Planning is essential to ensure a successful migration exercise

- Build a detailed inventory of data and processes to be migrated as soon as possible

- Use system metadata and logfiles to get an accurate understanding of data and process usage (documentation may be out of date)

- Understand the data volumes to be migrated, and also the network bandwidth between the on-premise data center and Azure cloud environments

- Consider using an Oracle instance in an Azure VM as a 'stepping stone' to offload migration from the legacy Oracle environment

- Leverage standard 'built-in' Azure features where appropriate to minimize the migration workload

- Understand the most efficient tools for data extract and load etc. in both Oracle and Azure environments and use the appropriate tools at each phase of the process

- Use Azure facilities such as Azure Data Factory to orchestrate and automate the migration process while minimizing impact on the Oracle system

## Appendices -- Example Techniques For Extracting Oracle Data

As mentioned earlier, there are a number of techniques that can be used to extract Oracle data when migrating from Oracle to Azure Synapse Analytics. More details on Oracle SQL Developer and Azure Data Factory Oracle Connector are included below:

### Oracle SQL Developer Data Extract 

SQL Developer GUI has an export option which allows export to many formats including CSV using a very simple GUI based method as shown below.

![A screenshot of a social media post Description automatically generated](media/image5.jpeg)

 

Other export options include JSON and XML. There's also a 'Cart' option in the GUI which allows you to build a 'Cart' consisting of a set of table names, and then apply the Export to all of those as shown below.

 

![A screenshot of a social media post Description automatically generated](media/image6.jpeg)

 

Note that this Oracle data export capability if also available via Oracle SQL Developer command line option enabling this to be automated as part of a shell script.

 

For (relatively) small tables this could be a useful option especially if there are any problems getting a direct connection extract working.

### Using Azure Data Factory Oracle Connector parallel copy 

You can also unload large Oracle tables in parallel to enable loading of data by partitions using the Oracle Connector in Microsoft Azure Data Factory.

The Azure Data Factory Oracle connector provides built-in data partitioning to copy data from Oracle in parallel. You can find data partitioning options on the Source tab of the copy activity.

![Screenshot of partition options](media/image7.png)

When you enable partitioned copy, Data Factory runs parallel queries against your Oracle source to load data by partitions. The parallel degree is controlled by the [parallelCopies](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-performance#parallel-copy) setting on the copy activity. For example, if you set parallelCopies to eight, Data Factory concurrently generates and runs eight queries based on your specified partition option and settings, and each query retrieves a portion of data from your Oracle database.

If using ADF, it is recommended that you enable parallel copy with data partitioning especially when you are planning to migrate large amount of data from your Oracle database. The following are suggested configurations for different scenarios. When copying data into file-based data store, it\'s recommended to write to a folder as multiple files (only specify folder name), which is faster than writing to a single file.

+&mdash;&mdash;&mdash;-+&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--+ | **Sc | **Suggested settings** | | enario** | | +==========+===========================================================+ | Full | **Partition option:** Physical partitions of table\ | | load | \ | | from | During execution, Data Factory automatically detects the | | large | physical partitions, and copies data by partitions | | table, | | | with | | | physical | | | pa | | | rtitions | | +&mdash;&mdash;&mdash;-+&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--+ | Full | **Partition options:** Dynamic range partition\ | | load | **Partition column:** Specify the column used to | | from | partition data. If not specified, the primary key column | | large | is used | | table, | | | without | | | physical | | | par | | | titions, | | | while | | | with an | | | integer | | | column | | | for data | | | part | | | itioning | | +&mdash;&mdash;&mdash;-+&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--+ | Load a | **Partition option:** Physical partitions of table\ | | large | **Query: **SELECT \* FROM \<TABLENAME\> | | amount | PARTITION(\"?AdfTabularPartitionName\") WHERE | | of data | \<your_additional_where_clause\> | | by using | | | a custom | **Partition name:** Specify the partition name(s) to copy | | query, | data from. If not specified, Data Factory automatically | | with | detects the physical partitions on the table you | | physical | specified in the Oracle dataset\ | | pa | \ | | rtitions | During execution, Data Factory | | | replaces ?AdfTabularPartitionName with the actual | | | partition name, and sends to Oracle | +&mdash;&mdash;&mdash;-+&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--+ | Load a | **Partition options**: Dynamic range partition.\ | | large | **Query:** SELECT \* FROM \<TABLENAME\> WHERE | | amount | ?AdfRangePartitionColumnName \<= | | of data | ?AdfRangePartitionUpbound AND | | by using | ?AdfRangePartitionColumnName \>= | | a custom | ?AdfRangePartitionLowbound AND | | query, | \<your_additional_where_clause\> | | without | | | physical | **Partition column:** Specify the column used to | | par | partition data. You can partition against the column with | | titions, | integer data type\ | | while | **Partition upper bound **and **partition lower bound:** | | with an | Specify if you want to filter against partition column to | | integer | retrieve data only between the lower and upper range\ | | column | \ | | for data | During execution, Data Factory | | part | replaces | | itioning |  ?AdfRangePartitionColumnName, ?AdfRangePartitionUpbound, | | | and ?AdfRangePartitionLowbound with the actual column | | | name and value ranges for each partition, and sends to | | | Oracle. \ | | | For example, if your partition column \"ID\" is set with | | | the lower bound as 1 and the upper bound as 80, with | | | parallel copy set as 4, Data Factory retrieves data by 4 | | | partitions. Their IDs are between \[1,20\], \[21, 40\], | | | \[41, 60\], and \[61, 80\], respectively | +&mdash;&mdash;&mdash;-+&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--+

More information on the ADF copy activity performance and scalability can be found here <https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-performance> 