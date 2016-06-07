<properties
    pageTitle="Query across cloud databases with different schema | Microsoft Azure"
    description="how to set up cross-database queries over vertical partitions"    
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
    ms.date="05/27/2016"
    ms.author="torsteng" />

# Query across cloud databases with different schemas (preview)

![Query across tables in different databases][1]

Vertically-partitioned databases use different sets of tables on different databases. That means that the schema is different on different databases. For instance, all tables for inventory are on one database while all accounting-related tables are on a second database. 

## Prerequisites

* The user must possess ALTER ANY EXTERNAL DATA SOURCE permission. This permission is included with the ALTER DATABASE permission.
* ALTER ANY EXTERNAL DATA SOURCE permissions are needed to refer to the underlying data source.

## Overview

**NOTE**:  Unlike with horizontal partitioning, these DDL statements do not depend on defining a data tier with a shard map through the elastic database client library.

1. [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx)
2. [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx)
3. [CREATE EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx)
4. [CREATE EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx) 


## Create database scoped master key and credentials 

The credential is used by the elastic query to connect to your remote databases.  

    CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'password';
    CREATE DATABASE SCOPED CREDENTIAL <credential_name>  WITH IDENTITY = '<username>',  
    SECRET = '<password>'
    [;]
 
**Note**    Ensure that the *<username>* does not include any *"@servername"* suffix. 

## Create external data sources

Syntax:

    <External_Data_Source> ::=
    CREATE EXTERNAL DATA SOURCE <data_source_name> WITH 
               (TYPE = RDBMS,
                LOCATION = ’<fully_qualified_server_name>’,
                DATABASE_NAME = ‘<remote_database_name>’,  
                CREDENTIAL = <credential_name> 
                ) [;] 

**Important**   The TYPE parameter must be set to **RDBMS**. 

### Example 

The following example illustrates the use of the CREATE statement for external data sources. 

	CREATE EXTERNAL DATA SOURCE RemoteReferenceData 
	WITH 
	( 
		TYPE=RDBMS, 
		LOCATION='myserver.database.windows.net', 
		DATABASE_NAME='ReferenceData', 
		CREDENTIAL= SqlUser 
	); 
 
To retrieve the list of current external data sources: 

    select * from sys.external_data_sources; 

### External Tables 

Syntax:

	CREATE EXTERNAL TABLE [ database_name . [ schema_name ] . | schema_name . ] table_name  
    ( { <column_definition> } [ ,...n ])     
	{ WITH ( <rdbms_external_table_options> ) } 
	)[;] 
	
	<rdbms_external_table_options> ::= 
      DATA_SOURCE = <External_Data_Source>, 
      [ SCHEMA_NAME = N'nonescaped_schema_name',] 
      [ OBJECT_NAME = N'nonescaped_object_name',] 

### Example  

	CREATE EXTERNAL TABLE [dbo].[customer]( 
		[c_id] int NOT NULL, 
		[c_firstname] nvarchar(256) NULL, 
		[c_lastname] nvarchar(256) NOT NULL, 
		[street] nvarchar(256) NOT NULL, 
		[city] nvarchar(256) NOT NULL, 
		[state] nvarchar(20) NULL, 
		[country] nvarchar(50) NOT NULL, 
	) 
	WITH 
	( 
	       DATA_SOURCE = RemoteReferenceData 
	); 

The following example shows how to retrieve the list of external tables from the current database: 

	select * from sys.external_tables; 

### Remarks

Elastic query extends the existing external table syntax to define external tables that use external data sources of type RDBMS. An external table definition for vertical partitioning covers the following aspects: 

* **Schema**: The external table DDL defines a schema that your queries can use. The schema provided in your external table definition needs to match the schema of the tables in the remote database where the actual data is stored. 

* **Remote database reference**: The external table DDL refers to an external data source. The external data source specifies the logical server name and database name of the remote database where the actual table data is stored. 

Using an external data source as outlined in the previous section, the syntax to create external tables is as follows: 

The DATA_SOURCE clause defines the external data source (i.e. the remote database in case of vertical partitioning) that is used for the external table.  

The SCHEMA_NAME and OBJECT_NAME clauses provide the ability to map the external table definition to a table in a different schema on the remote database, or to a table with a different name, respectively. This is useful if you want to define an external table to a catalog view or DMV on your remote database – or any other situation where the remote table name is already taken locally.  

The following DDL statement drops an existing external table definition from the local catalog. It does not impact the remote database. 

	DROP EXTERNAL TABLE [ [ schema_name ] . | schema_name. ] table_name[;]  

**Permissions for CREATE/DROP EXTERNAL TABLE**: ALTER ANY EXTERNAL DATA SOURCE permissions are needed for external table DDL which is also needed to refer to the underlying data source.  

## Security considerations
Users with access to the external table automatically gain access to the underlying remote tables under the credential given in the external data source definition. You should carefully manage access to the external table in order to avoid undesired elevation of privileges through the credential of the external data source. Regular SQL permissions can be used to GRANT or REVOKE access to an external table just as though it were a regular table.  


## Example: querying vertically partitioned databases 

The following query performs a three-way join between the two local tables for orders and order lines and the remote table for customers. This is an example of the reference data use case for elastic query: 

	SELECT  	
	 c_id as customer,
	 c_lastname as customer_name,
	 count(*) as cnt_orderline, 
	 max(ol_quantity) as max_quantity,
	 avg(ol_amount) as avg_amount,
	 min(ol_delivery_d) as min_deliv_date
	FROM customer 
	JOIN orders 
	ON c_id = o_c_id
	JOIN  order_line 
	ON o_id = ol_o_id and o_c_id = ol_c_id
	WHERE c_id = 100


## Stored procedure for remote T-SQL execution: sp\_execute_remote

Elastic query also introduces a stored procedure that provides direct access to the shards. The stored procedure is called [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714) and can be used to execute remote stored procedures or T-SQL code on the remote databases. It takes the following parameters: 

* Data source name (nvarchar): The name of the external data source of type RDBMS. 
* Query (nvarchar): The T-SQL query to be executed on each shard. 
* Parameter declaration (nvarchar) - optional: String with data type definitions for the parameters used in the Query parameter (like sp_executesql). 
* Parameter value list - optional: Comma-separated list of parameter values (like sp_executesql).

The sp\_execute\_remote uses the external data source provided in the invocation parameters to execute the given T-SQL statement on the remote databases. It uses the credential of the external data source to connect to the shardmap manager database and the remote databases.  

Example: 

	EXEC sp_execute_remote
		N'MyExtSrc',
		N'select count(w_id) as foo from warehouse' 


  
## Connectivity for tools

You can use regular SQL Server connection strings to connect your BI and data integration tools to databases on the SQL DB server that has elastic query enabled and external tables defined. Make sure that SQL Server is supported as a data source for your tool. Then refer to the elastic query database and its external tables just like any other SQL Server database that you would connect to with your tool. 

## Best practices 
 
* Ensure that the elastic query endpoint database has been given access to the remote database by enabling access for Azure Services in its SQL DB firewall configuration. Also ensure that the credential provided in the external data source definition can successfully log into the remote database and has the permissions to access the remote table.  

* Elastic query works best for queries where most of the computation can be done on the remote databases. You typically get the best query performance with selective filter predicates that can be evaluated on the remote databases or joins that can be performed completely on the remote database. Other query patterns may need to load large amounts of data from the remote database and may perform poorly. 


## Next steps

To query horizontally partitioned databases (also known as sharded databases), see [Queries across sharded cloud databases (horizontally partitioned)](sql-database-elastic-query-horizontal-partitioning.md).

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]


<!--Image references-->
[1]: ./media/sql-database-elastic-query-vertical-partitioning/verticalpartitioning.png


<!--anchors-->
