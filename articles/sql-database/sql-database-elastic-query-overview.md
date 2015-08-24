<properties
    title="Azure SQL Database elastic database query overview"
    pageTitle="Azure SQL Database elastic database query overview"
    description="Overview of the elastic query feature"
    metaKeywords="azure sql database elastic database queries"
    services="sql-database"
    documentationCenter=""  
    manager="jeffreyg"
    authors="sidneyh"/>

<tags
    ms.service="sql-database"
    ms.workload="sql-database"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/09/2015"
    ms.author="sidneyh" />

# Azure SQL Database Elastic Database query (preview) overview

The **Elastic Database query feature**, in preview, enables you to run a Transact-SQL query that spans multiple databases in Azure SQL Database. It allows you to connect Microsoft and third party tools (Excel, PowerBI, Tableau, etc.) to data tiers with multiple databases, especially when those databases share a common schema (also known as horizontal partitioning or sharding). Using this feature, you can scale out queries to large data tiers in SQL Database and visualize the results in business intelligence (BI) reports.

To begin building an elastic database query application, see [Getting started with  Elastic Database query](sql-database-elastic-query-getting-started.md).

## Elastic database query scenarios

The goal of the Elastic Database query is to facilitate reporting scenarios where multiple databases contribute rows into a single overall result. The query can either be composed by the user or application directly, or indirectly through tools that are connected to the query database. This is especially useful when creating reports, using commercial BI or data integration tools—or any software that cannot be changed. With an elastic database query, you can easily query across several databases using the familiar SQL Server connectivity experience in tools such as Excel, PowerBI, Tableau, or Cognos.

An elastic database query also allows easy access to an entire collection of databases through queries issued by SQL Server Management Studio or Visual Studio, and facilitates cross-database querying from Entity Framework or other ORM environments. Figure 1 shows a scenario where an existing cloud application (which uses the Elastic Database tools library) builds on a scaled-out data tier, and an elastic database query is used for cross-database reporting.

**Figure 1**

![Elastic database query used on scaled-out data tier][1]

The data tier is scaled out across many databases using a common schema. This approach is also known as horizontal partitioning or sharding. The partitioning can be performed and managed using (1) the [Elastic Database client library](http://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/) or (2) using an application-specific model for distributing data across multiple databases. With this topology, reports often have to span multiple databases. With an elastic database query, you can now connect to a single SQL database, and query results from the remote databases appear as if generated from a single virtual database.

> [AZURE.NOTE] Elastic database query works best for occasional reporting scenarios where most of the processing can be performed on the data tier. For heavy reporting workloads or data warehousing scenarios with more complex queries, also consider using [Azure SQL Data Warehouse](http://azure.microsoft.com/services/sql-data-warehouse/).


## Elastic Database query topology

Using an elastic database query to perform reporting tasks over a horizontally partitioned data tier requires an elastic scale shard map to represent the databases of the data tier. Typically, only a single shard map is used in this scenario and a dedicated database with elastic database query capabilities serves as the entry point for reporting queries. Only this dedicated database needs to be configured with elastic database query objects, as described below. Figure 2 illustrates this topology and its configuration with the elastic database query database and shard map.

> [AZURE.NOTE] The dedicated elastic database query database must be a SQL DB v12 database and initially only the Premium tier is supported. There are no restrictions on the shards themselves.

**Figure 2**

![Use Elastic Database query for Reporting over Sharded Tiers][2]

(A **shardlet** is all of the data associated with a single value of a sharding key on a shard. A **sharding key** is a column value that determines how data is distributed across shards. For example, data distributed by regions may have region IDs as the sharding key. For more details, see the [elastic scale glossary](sql-database-elastic-scale-glossary.md).)


Over time, additional topologies will be supported by the Elastic Database query feature. This article will be updated to reflect new features as they become available.

## Enabling elastic queries by configuring a shard map

Creating an elastic database query solution requires the Elastic Database tools [**shard map**](sql-database-elastic-scale-shard-map-management.md) to represent the remote databases to an elastic database query. If you are already using the Elastic Database client library, you can use your existing shard map. Otherwise, you need to create a shard map using Elastic Database tools.

The following example C# code shows how to create a shard map with a single remote database added as a shard.

    ShardMapManagerFactory.CreateSqlShardMapManager(
      "yourconnectionstring",
      ShardMapManagerCreateMode.ReplaceExisting, RetryBehavior.DefaultRetryBehavior);
    smm = ShardMapManagerFactory.GetSqlShardMapManager(
      "yourconnectionstring",
      ShardMapManagerLoadPolicy.Lazy,
      RetryBehavior.DefaultRetryBehavior);
    map = smm.CreateRangeShardMap<int>("yourshardmapname");
    shard = map.CreateShard(new ShardLocation("yoursqldbserver", "yoursqldbdatabasename"));

For more details on shard maps, please refer to [Shardmap management](sql-database-elastic-scale-shard-map-management.md).

To use the Elastic Database query feature, you must first create the shard map and register your remote databases as shards. This is a one-time operation. You only need to change your shard map when you add or remove remote databases—which are incremental operations on an existing shard map.


## Creating elastic database query database objects

To describe the remote tables that can be accessed from an elastic database query endpoint, we introduce the ability to define external tables that will appear to your application and to 3rd party tools as if they were local tables. Queries can be submitted against these database objects implicitly through the tools, or explicitly from SQL Server Management Studio, Visual Studio Data Tools, or from an application. The elastic database query executes like any other Transact-SQL statement—with the notable difference that query will distribute the processing against the potentially many remote databases underlying the external objects.

The Elastic Database query feature relies on the these four DDL statements. Typically, these DDL statements are used once or rarely when the schema of your application changes.

*    [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx)
*    [CREATE CREDENTIAL](https://msdn.microsoft.com/library/ms189522.aspx)
*    [CREATE/DROP EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx)
*    [CREATE/DROP EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx)

### Database-scoped master key and credentials

A credential represents the user ID and password that the elastic database query will use to connect to your elastic scale shard map and your remote databases in Azure SQL DB. You can create the required master key and credential using the following syntax:

    CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'password';  
    CREATE DATABASE SCOPED CREDENTIAL <credential_name>
    WITH IDENTITY = '<shard_map_username>',
    SECRET = '<shard_map_password>'
     [;]
Ensure that the &lt;shard\_map_username> does not include any “@servername” suffix.

Information about credentials is visible in the sys.database_scoped.credentials catalog view.

You can use the following syntax to drop the master key and credentials:

    DROP CREDENTIAL <credential_name> ON DATABASE;
    DROP MASTER KEY;  

### External data sources

As the next step, you need to register your shard map as an external data source. The syntax for creating and dropping external data sources is defined as follows:

      CREATE EXTERNAL DATA SOURCE <data_source_name> WITH
                     (TYPE = SHARD_MAP_MANAGER,
                     LOCATION = '<fully_qualified_server_name>',
                     DATABASE_NAME = '<shardmap_database_name>',
                     CREDENTIAL = <credential_name>,
                     SHARD_MAP_NAME = '<shardmapname>'
    ) [;]

You can use the following statement to drop an external data source:

    DROP EXTERNAL DATA SOURCE <data_source_name>[;]

The user must possess ALTER ANY EXTERNAL DATA SOURCE permission. This permission is included into the ALTER DATABASE permission.

**Example**

The following example illustrates the use of the CREATE statement for external data sources.

    CREATE EXTERNAL DATA SOURCE MyExtSrc
    WITH
    (
    TYPE=SHARD_MAP_MANAGER,
    LOCATION='myserver.database.windows.net',
    DATABASE_NAME='ShardMapDatabase',
    CREDENTIAL= SMMUser,
    SHARD_MAP_NAME='ShardMap'
    );

You can retrieve the list of current external data sources from the following catalog view:

    select * from sys.external_data_sources;

Note that the same credentials are used to read the shard map and to access the data on the remote databases during the processing of the query.


### External tables

With the Elastic Database query, we extend the existing external table syntax to refer to tables that are partitioned across (several) remote database(s) in Azure SQL DB. Using the external data source concept from above, the syntax to create and drop external tables is defined as follows:

    CREATE EXTERNAL TABLE [ database_name . [ dbo ] . | dbo. ] table_name
        ( { <column_definition> } [ ,...n ])
        { WITH ( <sharded_external_table_options> ) }
    )[;]

    <sharded_external_table_options> ::=
          DATA_SOURCE = <External_Data_Source>,
          DISTRIBUTION = SHARDED(<sharding_column_name>) | REPLICATED | ROUND_ROBIN

The sharding policy controls whether a table is treated as a sharded table or as a replicated table. With a sharded table, the data from different shards does not overlap. Replicated tables in turn have the same data on every shard. The query processor relies on this information for correct and more efficient query processing. The round robin distribution indicates that an application specific method for distributing the data of that table is used.

    DROP EXTERNAL TABLE [ database_name . [ dbo ] . | dbo. ] table_name[;]

Permissions for **CREATE/DROP EXTERNAL TABLE**: ALTER ANY EXTERNAL DATA SOURCE permissions are needed which is also needed to refer to the underlying data source.

**Example**: The following example illustrates how to create an external table:

    CREATE EXTERNAL TABLE [dbo].[order_line](
        [ol_o_id] [int] NOT NULL,
        [ol_d_id] [tinyint] NOT NULL,
        [ol_w_id] [int] NOT NULL,
        [ol_number] [tinyint] NOT NULL,
        [ol_i_id] [int] NOT NULL,
        [ol_delivery_d] [datetime] NOT NULL,
        [ol_amount] [smallmoney] NOT NULL,
        [ol_supply_w_id] [int] NOT NULL,
        [ol_quantity] [smallint] NOT NULL,
        [ol_dist_info] [char](24) NOT NULL
    )
    WITH
    (
        DATA_SOURCE = MyExtSrc,
        DISTRIBUTION=SHARDED(ol_w_id)
    );

The following example shows how to retrieve the list of external tables from the current database:

    select * from sys.external_tables;


## Reporting and querying

### Queries
Once you have defined your external data source and your external tables, you can use familiar SQL Database connection strings to connect to the database that has the Elastic Database query feature enabled. You can now use execute full read-only queries over your external tables—with some limitations explained in the [limitations section](#preview-limitations) below.

**Example**: The following query performs a three-way join between warehouses, orders and order lines and uses several aggregates and a selective filter. Assuming warehouses, orders and order lines are partitioned by the warehouse id column, an elastic database query can collocate the joins on the remote databases and can scale-out the processing of the expensive part of the query.

    select
        w_id as warehouse,
        o_c_id as customer,
        count(*) as cnt_orderline,
        max(ol_quantity) as max_quantity,
        avg(ol_amount) as avg_amount,
        min(ol_delivery_d) as min_deliv_date
    from warehouse
    join orders
    on w_id = o_w_id
    join order_line
    on o_id = ol_o_id and o_w_id = ol_w_id
    where w_id > 100 and w_id < 200
    group by w_id, o_c_id

### Stored procedure SP_ EXECUTE_FANOUT

SP\_EXECUTE\_FANOUT is a stored procedure that provides access to the databases represented by a shard map. The stored procedure takes the following parameters:

-    **Server name** (nvarchar): Fully qualified name of the logical server hosting the shard map.
-    **Shard map database name** (nvarchar): The name of the shard map database.
-    **User name** (nvarchar): The user name to log into the shard map database and the remote databases.
-    **Password** (nvarchar): Password for the user.
-    **Shard map name** (nvarchar): The name of the shard map to be used for the query.
-    **Query**: The query to be executed on each shard.

It uses the shard map information provided in the invocation parameters to execute the given statement on all shards registered with the shard map. Any results are merged using UNION ALL semantics similar to Multi-Shard Queries. The result also includes the additional ‘virtual’ column with the remote database name.

Note that the same credentials are used to connect to the shard map database and to the shards.

**Example**:

    sp_execute_fanout 'myserver.database.windows.net', N'ShardMapDb', N'myuser', N'MyPwd', N'ShardMap', N'select count(w_id) as foo from warehouse'

## Connectivity for tools
You can use familiar SQL DB connection strings to your Elastic Database query database to connect your BI and data integration tools. Make sure that SQL Server is supported as a data source for your tool. Then use external objects in the Elastic Database query database just like with any other SQL Server database that you would connect to with your tool.

## Best practices
*    Make sure that the shard map manager database and the databases defined in the shard map allow access from Microsoft Azure in their firewall rules. This is necessary so that the Elastic Database query database can connect to them. For more information, see [Azure SQL DB Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).
*    An elastic database query does not validate or enforce the data distribution defined by the external table. If your actual data distribution is different from the distribution specified in your table definition, your queries may yield unexpected results.
*    An elastic database query works best for queries where most of the computation can be done on the shards. You typically get the best query performance with selective filter predicates that can be evaluated on the shards or joins over the partitioning keys that can be performed in a partition-aligned way on all shards. Other query patterns may need to load large amounts of data from the shards to the head node and may experience poor performance.

## Cost

The Elastic Database query is included with the cost of Azure SQL Database databases. Note that topologies are supported where remote databases are in a different data center than the elastic database query endpoint, but data egress from remote databases is charged at regular Azure egress rates.

## Preview limitations

There are a few things to keep in mind with the preview:

*    The Elastic Database query feature will initially only be available in the SQL DB v12 Premium performance tier, although remote databases accessed by an elastic database query may be of any tier.
* External tables referenced by your external data source only support read operations over the remote databases. You can, however, point full Transact-SQL functionality at the elastic database query database where the external table definition itself resides. This can be useful to, for example, to persist temporary results using SELECT column_list INTO local_table, or to define stored procedures on the elastic database query database which refer to external tables.
*    Parameters in queries currently cannot be pushed to remote databases. Parameterized queries will need to bring all data to the head node and may suffer from bad performance depending on the data size. A temporary workaround is to avoid parameters in your queries or to use the RECOMPILE option to have parameters automatically replaced with their current values.
* Column-level statistics over external tables are currently not supported.
* The Elastic Database query currently does not perform shard elimination when predicates over the sharding key would allow to safely exclude certain remote databases from processing. As a result, queries will always touch all remote databases represented by the external data sources of the query.
* Any queries that involve joins between tables on different databases may bring large numbers of rows back to the elastic database query database for processing, with a resulting performance cost. It is best to develop queries that can be processed locally on each remote database, or to use WHERE clauses to restrict rows involved from each database before performing the join.
*    The syntax used for Elastic Database query metadata definition will change during the preview.
*    Transact-SQL scripting functionality in SSMS or SSDT currently does not work with elastic database query objects.

## Feedback
Please share feedback on your experience with us on Disqus or Stackoverflow. We are interested in all kinds of feedback about the service (defects, rough edges, feature gaps).

## Next steps
To get started exploring Elastic Database query, try our step-by-step tutorial to have a full working example running in minutes: [Getting started with Elastic Database query](sql-database-elastic-query-getting-started.md).


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-query-overview/overview.png
[2]: ./media/sql-database-elastic-query-overview/topology1.png

<!--anchors-->
