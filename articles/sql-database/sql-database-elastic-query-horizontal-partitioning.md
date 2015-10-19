<properties
    pageTitle="Elastic queries for horizontal partitioning | Microsoft Azure"
    description="how to set up elastic queries over hotizontal partitions"    
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
    ms.date="10/15/2015"
    ms.author="sidneyh;torsteng" />

# Elastic queries for horizontal partitioning

This document explains how to setup elastic database queries for horizontal partitioning scenarios and how to perform your queries. For a definition of the horizontal partitioning scenario, see the [elastic database query overview (preview)](sql-database-elastic-query-overview.md).

The functionality is a part of the Azure SQL [Database Elastic Database feature set](sql-database-elastic-scale.md).  
 
## Creating database objects

Elastic database query extends the T-SQL syntax to refer to data tiers that use sharding (or horizontal partitioning) to distribute data across many databases. This section provides an overview of the DDL statements associated with elastic query over sharded tables. These statements create the metadata representation of your sharded data tier in the elastic query database. A prerequisite for running these statements is to create a shard map using the elastic database client library. For more information, see [Shard map management](sql-database-elastic-scale-shard-map-management.md); or use the sample in the following topic to create one: [Get started with elastic database tools](sql-database-elastic-scale-get-started.md).   

Defining the database objects for elastic database query relies on the following T-SQL statements which are explained further for the horizontal partitioning scenario below: 

* [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx) 

* [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx)

* [CREATE/DROP EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx)  

* [CREATE/DROP EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx) 

### 1.1 Database scoped master key and credentials 

A credential represents the user ID and password that elastic query will use to connect to your remote databases in Azure SQL DB. To create the required master key and credential use the following syntax: 

    CREATE MASTER KEY ENCRYPTION BY PASSWORD = ’password’;
    CREATE DATABASE SCOPED CREDENTIAL <credential_name>  WITH IDENTITY = ‘<username>’,  
    SECRET = ‘<password>’
    [;]

Or to drop the credential and key:

    DROP DATABASE SCOPED CREDENTIAL <credential_name>;  
    DROP MASTER KEY;   

 
**Note**    Ensure that the *< username>* does not include any *“@servername”* suffix. 

### 1.2 External data sources

Provide the information about your shard map and your data tier by defining an external data source. The external data source references your shard map. An elastic query then uses the external data source and the underlying shard map to enumerate the databases that participate in the data tier. The syntax to create an external data source is defined as follows: 

	<External_Data_Source> ::=    
	CREATE EXTERNAL DATA SOURCE <data_source_name> WITH                               	           
			(TYPE = SHARD_MAP_MANAGER,
                   	LOCATION = '<fully_qualified_server_name>',
			DATABASE_NAME = ‘<shardmap_database_name>',
			CREDENTIAL = <credential_name>, 
			SHARD_MAP_NAME = ‘<shardmapname>’ 
                   ) [;] 
 
or to drop an external data source: 

	DROP EXTERNAL DATA SOURCE <data_source_name>[;] 

#### Permissions for CREATE/DROP EXTERNAL DATA SOURCE 

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

Note that the same credentials are used to read the shard map and to access the data on the shards during the processing of an elastic query. 

### 1.3 External tables 
 
Elastic query extends the external table DDL to refer to external tables that are horizontally partitioned across several databases. The external table definition covers the following aspects: 

* **Schema**: The external table DDL defines a schema that your queries can use. The schema provided in your external table definition needs to match the schema of the tables on the shards where the actual data is stored. 

* **Data distribution**: The external table DDL defines the data distribution that you used to distribute the data across your data tier. Note that Azure SQL Database does not validate the distribution you define on the external table against the actual distribution on the shards. You are responsible for to ensuring that the actual data distribution on the shards matches your external table definition. 

* **Data tier reference**: The external table DDL refers to an external data source. The external data source specifies a shard map which provides the external table with the information necessary to locate all the databases in your data tier. 

Using an external data source as outlined in the previous section, the syntax to create and drop external tables is as follows: 

	CREATE EXTERNAL TABLE [ database_name . [ schema_name ] . | schema_name. ] table_name  
        ( { <column_definition> } [ ,...n ])     
	    { WITH ( <sharded_external_table_options> ) }
	) [;]  
	
	<sharded_external_table_options> ::= 
      DATA_SOURCE = <External_Data_Source>,       
	  [ SCHEMA_NAME = N'nonescaped_schema_name',] 
      [ OBJECT_NAME = N'nonescaped_object_name',] 
      DISTRIBUTION = SHARDED(<sharding_column_name>) | REPLICATED |ROUND_ROBIN

The DATA\_SOURCE clause defines the external data source (a shard map in the case of horizontal partitioning) that is used for the external table.  

The SCHEMA\_NAME and OBJECT_NAME clauses provide the ability to map the external table definition to a table in a different schema on the shard, or a to a table with a different name, respectively. If omitted, the schema of the remote object is assumed to be “dbo” and its name is assumed to be identical to the external table name being defined.  

The SCHEMA\_NAME and OBJECT\_NAME clauses are particularly useful if the name of your remote table is already taken in the database where you want to create the external table. An example for this problem is when you want to define an external table to get an aggregate view of catalog views or DMVs on your scaled out data tier. Since catalog views and DMVs already exist locally, you cannot use their names for the external table definition. Instead, use a different name and use the catalog view’s or the DMV’s name in the SCHEMA_NAME and/or OBJECT_NAME clauses. (See the example below.) 

The DISTRIBUTION clause specifies the data distribution used for this table:  

* SHARDED means that the data for this table is horizontally partitioned across the databases in your shard map. The partitioning key for the data distribution is captured in the <sharding_column_name> parameter.  

* REPLICATED means that identical copies of the table are present on each database in your shard map. Azure SQL DB does not maintain the copies of the table. It is your responsibility to ensure that the replica are identical across the databases. 

* ROUND\_ROBIN means that the table is distributed using horizontal partitioning. However, an application dependent distribution has been used.  

The query processor utilizes the information provided in the DISTRIBUTION clause to build the most efficient query plans.

Use the following statement to drop external tables:

	DROP EXTERNAL TABLE [ database_name . [ schema_name ] . | schema_name. ] table_name[;]  

**Permissions for CREATE/DROP EXTERNAL TABLE:** ALTER ANY EXTERNAL DATA SOURCE permissions are needed which is also needed to refer to the underlying data source.  

**Security considerations:** Users with access to the external table automatically gain access to the underlying remote tables under the credential given in the external data source definition. You should carefully manage access to the external table in order to avoid undesired elevation of privileges through the credential of the external data source. Regular SQL permissions can be used to GRANT or REVOKE access to an external table just as though it were a regular table.  

**Example**: The following example illustrates how to create an external table:  

	CREATE EXTERNAL TABLE [dbo].[order_line]( 
		 [ol_o_id] int NOT NULL, 
		 [ol_d_id] tinyint NOT NULL,
		 [ol_w_id] int NOT NULL, 
		 [ol_number] tinyint NOT NULL, 
		 [ol_i_id] int NOT NULL, 
		 [ol_delivery_d] datetime NOT NULL, 
		 [ol_amount] smallmoney NOT NULL, 
		 [ol_supply_w_id] int NOT NULL, 
		 [ol_quantity] smallint NOT NULL, 
		 [ol_dist_info] char(24) NOT NULL 
	) 
	
	WITH 
	( 
		DATA_SOURCE = MyExtSrc, 
	 	SCHEMA_NAME = 'orders', 
	 	OBJECT_NAME = 'order_details', 
		DISTRIBUTION=SHARDED(ol_w_id)
	); 

The following example shows how to retrieve the list of external tables from the current database: 

	select * from sys.external_tables; 

## Querying 

### 2.1 Full fidelity T-SQL queries 

Once you have defined your external data source and your external tables, you can now use full T-SQL over your external tables.

**Example for horizontal partitioning:** The following query performs a three-way join between warehouses, orders and order lines and uses several aggregates and a selective filter. It assumes (1) horizontal partitioning (sharding) and (2) that warehouses, orders and order lines are sharded by the warehouse id column, and that the elastic query can collocate the joins on the shards and process the expensive part of the query on the shards in parallel. 

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
 
### 2.2 Stored procedure SP_EXECUTE_FANOUT 

Elastic query also introduces a stored procedure that provides direct access to the shards. The stored procedure is called sp_execute_fanout and takes the following parameters:   

* Server name (nvarchar): Fully qualified name of the logical server hosting the shard map. 
* Shard map database name (nvarchar): The name of the shard map database. 
* User name (nvarchar): The user name to log into the shard map database. 
* Password (nvarchar): Password for the user. 
* Shard map name (nvarchar): The name of the shard map to be used for the query. 
*  Query: The T-SQL query to be executed on each shard. 
*  Parameter declaration (nvarchar) - optional: String with data type definitions for the parameters used in the Query parameter (like sp_executesql). 
*  Parameter value list - optional: Comma-separated list of parameter values (like sp_executesql)  

sp\_execute\_fanout uses the shard map information provided in the invocation parameters to execute the given T-SQL statement on all shards registered with the shard map. Any results are merged using UNION ALL semantics. The result also includes the additional ‘virtual’ column with the shard name. 

Note that the same credentials are used to connect to the shard map database and to the shards. 

Example: 

	sp_execute_fanout 
		’myserver.database.windows.net', 
		N'ShardMapDb', 
		N'myuser', 
		N'MyPwd', 
		N'ShardMap', 
		N'select count(w_id) as foo from warehouse' 

## Connectivity for tools  

Use regular SQL Server connection strings to connect your application, your BI and data integration tools to the database with your external table definitions. Make sure that SQL Server is supported as a data source for your tool. Then reference the elastic query database like any other SQL Server database connected to the tool, and use external tables from your tool or application as if they were local tables. 

## Best practices 

* Make sure that the elastic query endpoint database has been given access to the shardmap database and all shards through the SQL DB firewalls.  

* Elastic query does not validate or enforce the data distribution defined by the external table. If your actual data distribution is different from the distribution specified in your table definition, your queries may yield unexpected results. 

* Elastic query currently does not perform shard elimination when predicates over the sharding key would allow to safely exclude certain shards from processing.

* Elastic query works best for queries where most of the computation can be done on the shards. You typically get the best query performance with selective filter predicates that can be evaluated on the shards or joins over the partitioning keys that can be performed in a partition-aligned way on all shards. Other query patterns may need to load large amounts of data from the shards to the head node and may perform poorly


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]


<!--Image references-->
<!--anchors-->
