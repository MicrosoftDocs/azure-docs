<properties
    pageTitle="Azure SQL Database elastic database query overview | Microsoft Azure"
    description="Overview of the elastic query feature"    
    services="sql-database"
    documentationCenter=""  
    manager="jhubbard"
    authors="torsteng"/>

<tags
    ms.service="sql-database"
    ms.workload="sql-database"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="04/27/2016"
    ms.author="torsteng" />

# Azure SQL Database elastic database query overview (preview)

The elastic database query feature (in preview) enables you to run a Transact-SQL query that spans multiple databases in Azure SQL Database (SQLDB). It allows you to perform cross-database queries to access remote tables, and to connect Microsoft and third party tools (Excel, PowerBI, Tableau, etc.) to query across data tiers with multiple databases. Using this feature, you can scale out queries to large data tiers in SQL Database and visualize the results in business intelligence (BI) reports.

## Documentation

* [Get started with cross-database queries](sql-database-elastic-query-getting-started-vertical.md)
* [Report across scaled-out cloud databases](sql-database-elastic-query-getting-started.md)
* [Query across sharded cloud databases (horizontally partitioned)](sql-database-elastic-query-horizontal-partitioning.md)
* [Query across cloud databases with different schemas (vertically partitioned)](sql-database-elastic-query-vertical-partitioning.md)
* [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714)


## Why use elastic queries?

**Azure SQL Database**

Query across Azure SQL databases completely in T-SQL. This allows for read-only querying of remote databases. This provides an option for current on-premises SQL Server customers to migrate applications using three- and four-part names or linked server to SQL DB.

**Available on standard tier**
Elastic query is supported on the Standard performance tier in addition to the Premium performance tier. See the section on Preview Limitations below on performance limitations for lower performance tiers.

**Push to remote databases**

Elastic queries can now push SQL parameters to the remote databases for execution.

**Stored procedure execution**

Execute remote stored procedure calls or remote functions using [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714).

**Flexibility**

External tables with elastic query can now refer to remote tables with a different schema or table name.

## Elastic database query scenarios

The goal is to facilitate querying scenarios where multiple databases contribute rows into a single overall result. The query can either be composed by the user or application directly, or indirectly through tools that are connected to the database. This is especially useful when creating reports, using commercial BI or data integration tools—or any application that cannot be changed. With an elastic query, you can query across several databases using the familiar SQL Server connectivity experience in tools such as Excel, PowerBI, Tableau, or Cognos.
An elastic query allows easy access to an entire collection of databases through queries issued by SQL Server Management Studio or Visual Studio, and facilitates cross-database querying from Entity Framework or other ORM environments. Figure 1 shows a scenario where an existing cloud application (which uses the [elastic database client library](sql-database-elastic-database-client-library.md)) builds on a scaled-out data tier, and an elastic query is used for cross-database reporting.

**Figure 1** Elastic database query used on scaled-out data tier

![Elastic database query used on scaled-out data tier][1]

Customer scenarios for elastic query are characterized by the following topologies:

* **Vertical partitioning – Cross-database queries** (Topology 1): The data is partitioned vertically between a number of databases in a data tier. Typically, different sets of tables reside on different databases. That means that the schema is different on different databases. For instance, all tables for inventory are on one database while all accounting-related tables are on a second database. Common use cases with this topology require one to query across or to compile reports across tables in several databases.
* **Horizontal Partitioning – Sharding** (Topology 2): Data is partitioned horizontally to distribute rows across a scaled out data tier. With this approach, the schema is identical on all participating databases. This approach is also called “sharding”. Sharding can be performed and managed using (1) the elastic database tools libraries or (2) self-sharding. An elastic query is used to query or compile reports across many shards.

> [AZURE.NOTE] Elastic database query works best for occasional reporting scenarios where most of the processing can be performed on the data tier. For heavy reporting workloads or data warehousing scenarios with more complex queries, also consider using [Azure SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/).


## Elastic Database query topologies

### Topology 1: Vertical partitioning – cross-database queries

To begin coding, see [Getting started with cross-database query (vertical partitioning)](sql-database-elastic-query-getting-started-vertical.md).

An elastic query can be used to make data located in a SQLDB database available to other SQLDB databases. This allows queries from one database to refer to tables in any other remote SQLDB database. The first step is to define an external data source for each remote database. The external data source is defined in the local database from which you want to gain access to tables located on the remote database. No changes are necessary on the remote database. For typical vertical partitioning scenarios where different databases have different schemas, elastic queries can be used to implement common use cases such as access to reference data and cross-database querying.

**Reference data**: Topology 1 is used for reference data management. In the figure below, two tables (T1 and T2) with reference data are kept on a dedicated database. Using an elastic query, you can now access tables T1 and T2 remotely from other databases, as shown in the figure. Use topology 1 if reference tables are small or remote queries into reference table have selective predicates.

**Figure 2** Vertical partitioning - Using elastic query to query reference data

![Vertical partitioning - Using elastic query to query reference data][3]

**Cross-database querying**: Elastic queries enable use cases that require querying across several SQLDB databases. Figure 3 shows four different databases: CRM, Inventory, HR and Products. Queries performed in one of the databases also need access to one or all the other databases. Using an elastic query, you can configure your database for this case by running a few simple DDL statements on each of the four databases. After this one-time configuration, access to a remote table is as simple as referring to a local table from your T-SQL queries or from your BI tools. This approach is recommended if the remote queries do not return large results.

**Figure 3** Vertical partitioning - Using elastic query to query across various databases

![Vertical partitioning - Using elastic query to query across various databases][4]

### Topology 2: Horizontal partitioning – sharding

Using elastic query to perform reporting tasks over a sharded, i.e., horizontally partitioned, data tier requires an [elastic database shard map](sql-database-elastic-scale-shard-map-management.md) to represent the databases of the data tier . Typically, only a single shard map is used in this scenario and a dedicated database with elastic query capabilities serves as the entry point for reporting queries. Only this dedicated database needs access to the shard map. Figure 4 illustrates this topology and its configuration with the elastic query database and shard map. The databases in the data tier can be of any Azure SQL Database version or edition. For more information about the elastic database client library and creating shard maps, see [Shard map management](sql-database-elastic-scale-shard-map-management.md).

**Figure 4** Horizontal partitioning - Using elastic query for reporting over sharded data tiers

![Horizontal partitioning - Using elastic query for reporting over sharded data tiers][5]

> [AZURE.NOTE] The dedicated elastic database query database must be a SQL DB v12 database. There are no restrictions on the shards themselves.

To begin coding, see [Getting started with elastic database query for horizontal partitioning (sharding)](sql-database-elastic-query-getting-started.md).

## Implementing elastic database queries

The steps to implement elastic query for the vertical and horizontal partitioning scenarios are discussed in the following sections. They also refer to more detailed documentation for the different partitioning scenarios.

### Vertical partitioning - cross-database queries

The following steps configure elastic database queries for vertical partitioning scenarios that require access to a table located on remote SQLDB databases with the same schema:

*    [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx) mymasterkey
*    [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx) mycredential
*    [CREATE/DROP EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx) mydatasource of type **RDBMS**
*    [CREATE/DROP EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx) mytable

After running the DDL statements, you can access the remote table “mytable” as though it were a local table. Azure SQL Database automatically opens a connection to the remote database, processes your request on the remote database, and returns the results.
More information on the steps required for the vertical partitioning scenario can be found in [elastic query for vertical partitioning](sql-database-elastic-query-vertical-partitioning.md).  

### Horizontal partitioning - sharding

The following steps configure elastic database queries for horizontal partitioning scenarios that require access to a set of table that are located on (typically) several remote SQLDB databases:

*    [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx) mymasterkey
*    [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx) mycredential
*    Create a [shard map](sql-database-elastic-scale-shard-map-management.md) representing your data tier using the elastic database client library.   
*    [CREATE/DROP EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx) mydatasource of type **SHARD_MAP_MANAGER**
*    [CREATE/DROP EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx) mytable

Once you have performed these steps, you can access the horizontally partitioned table “mytable” as though it were a local table. Azure SQL Database automatically opens multiple parallel connections to the remote databases where the tables are physically stored, processes the requests on the remote databases, and returns the results.
More information on the steps required for the horizontal partitioning scenario can be found in [elastic query for horizontal partitioning](sql-database-elastic-query-horizontal-partitioning.md).

## T-SQL querying
Once you have defined your external data sources and your external tables, you can use regular SQL Server connection strings to connect to the databases where you defined your external tables. You can then run T-SQL statements over your external tables on that connection with the limitations outlined below. You can find more information and examples of T-SQL queries in the documentation topics for [horizontal partitioning](sql-database-elastic-query-horizontal-partitioning.md) and [vertical partitioning](sql-database-elastic-query-vertical-partitioning.md).

## Connectivity for tools
You can use regular SQL Server connection strings to connect your applications and BI or data integration tools to databases that have external tables. Make sure that SQL Server is supported as a data source for your tool. Once connected, refer to the elastic query database and the external tables in that database just like you would do with any other SQL Server database that you connect to with your tool.

> [AZURE.IMPORTANT] Authentication using Azure Active Directory with elastic queries is not currently supported.

## Cost

Elastic query is included into the cost of Azure SQL Database databases. Note that topologies where your remote databases are in a different data center than the elastic query endpoint are supported, but data egress from remote databases are charged regular [Azure rates](https://azure.microsoft.com/pricing/details/data-transfers/).

## Preview limitations
* Running your first elastic query can take up to a few minutes on the Standard performance tier. This time is necessary to load the elastic query functionality; loading performance improves with higher performance tiers.
* Scripting of external data sources or external tables from SSMS or SSDT is not yet supported.
* Import/Export for SQL DB does not yet support external data sources and external tables. If you need to use Import/Export, drop these objects before exporting and then re-create them after importing.
* Elastic database query currently only supports read-only access to external tables. You can, however, use full T-SQL functionality on the database where the external table is defined. This can be useful to, e.g., persist temporary results using, e.g., SELECT <column_list> INTO <local_table>, or to define stored procedures on the elastic query database which refer to external tables.
* Except for nvarchar(max), LOB types are not supported in external table definitions. As a workaround, you can create a view on the remote database that casts the LOB type into nvarchar(max), define your external table over the view instead of the base table and then cast it back into the original LOB type in your queries.
* Column statistics over external tables are currently not supported. Tables statistics are supported, but need to be created manually.

## Feedback
Please share feedback on your experience with elastic queries with us on Disqus below, the MSDN forums, or on Stackoverflow. We are interested in all kinds of feedback about the service (defects, rough edges, feature gaps).

## More information

You can find more information on the cross-database querying and vertical partitioning scenarios in the following documents:

* [Cross-database querying and vertical partitioning overview](sql-database-elastic-query-vertical-partitioning.md)
* Try our step-by-step tutorial to have a full working example running in minutes: [Getting started with cross-database query (vertical partitioning)](sql-database-elastic-query-getting-started-vertical.md).


More information on horizontal partitioning and sharding scenarios is available here:

* [Horizontal partitioning and sharding overview](sql-database-elastic-query-horizontal-partitioning.md)
* Try our step-by-step tutorial to have a full working example running in minutes: [Getting started with elastic database query for horizontal partitioning (sharding)](sql-database-elastic-query-getting-started.md).


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-query-overview/overview.png
[2]: ./media/sql-database-elastic-query-overview/topology1.png
[3]: ./media/sql-database-elastic-query-overview/vertpartrrefdata.png
[4]: ./media/sql-database-elastic-query-overview/verticalpartitioning.png
[5]: ./media/sql-database-elastic-query-overview/horizontalpartitioning.png

<!--anchors-->
