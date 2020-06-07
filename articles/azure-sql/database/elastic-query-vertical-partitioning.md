---
title: Query across cloud databases with different schema
description: how to set up cross-database queries over vertical partitions
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: sstein
ms.date: 01/25/2019
---
# Query across cloud databases with different schemas (preview)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

![Query across tables in different databases][1]

Vertically-partitioned databases use different sets of tables on different databases. That means that the schema is different on different databases. For instance, all tables for inventory are on one database while all accounting-related tables are on a second database.

## Prerequisites

* The user must possess ALTER ANY EXTERNAL DATA SOURCE permission. This permission is included with the ALTER DATABASE permission.
* ALTER ANY EXTERNAL DATA SOURCE permissions are needed to refer to the underlying data source.

## Overview

> [!NOTE]
> Unlike with horizontal partitioning, these DDL statements do not depend on defining a data tier with a shard map through the elastic database client library.
>

1. [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx)
2. [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx)
3. [CREATE EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx)
4. [CREATE EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx)

## Create database scoped master key and credentials

The credential is used by the elastic query to connect to your remote databases.  

```sql
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'master_key_password';
CREATE DATABASE SCOPED CREDENTIAL <credential_name>  WITH IDENTITY = '<username>',  
SECRET = '<password>'
[;]
```

> [!NOTE]
> Ensure that the `<username>` does not include any **"\@servername"** suffix.

## Create external data sources

Syntax:

<External_Data_Source> ::=
CREATE EXTERNAL DATA SOURCE <data_source_name> WITH
    (TYPE = RDBMS,
    LOCATION = ’<fully_qualified_server_name>’,
    DATABASE_NAME = ‘<remote_database_name>’,  
    CREDENTIAL = <credential_name>
    ) [;]

> [!IMPORTANT]
> The TYPE parameter must be set to **RDBMS**.

### Example

The following example illustrates the use of the CREATE statement for external data sources.

```sql
CREATE EXTERNAL DATA SOURCE RemoteReferenceData
   WITH
      (
         TYPE=RDBMS,
         LOCATION='myserver.database.windows.net',
         DATABASE_NAME='ReferenceData',
         CREDENTIAL= SqlUser
      );
```

To retrieve the list of current external data sources:

```sql
select * from sys.external_data_sources;
```

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

```sql
CREATE EXTERNAL TABLE [dbo].[customer]
   (
      [c_id] int NOT NULL,
      [c_firstname] nvarchar(256) NULL,
      [c_lastname] nvarchar(256) NOT NULL,
      [street] nvarchar(256) NOT NULL,
      [city] nvarchar(256) NOT NULL,
      [state] nvarchar(20) NULL,
      DATA_SOURCE = RemoteReferenceData
   );
```

The following example shows how to retrieve the list of external tables from the current database:

```sql
select * from sys.external_tables;
```

### Remarks

Elastic query extends the existing external table syntax to define external tables that use external data sources of type RDBMS. An external table definition for vertical partitioning covers the following aspects:

* **Schema**: The external table DDL defines a schema that your queries can use. The schema provided in your external table definition needs to match the schema of the tables in the remote database where the actual data is stored.
* **Remote database reference**: The external table DDL refers to an external data source. The external data source specifies the server name and database name of the remote database where the actual table data is stored.

Using an external data source as outlined in the previous section, the syntax to create external tables is as follows:

The DATA_SOURCE clause defines the external data source (i.e. the remote database in case of vertical partitioning) that is used for the external table.  

The SCHEMA_NAME and OBJECT_NAME clauses provide the ability to map the external table definition to a table in a different schema on the remote database, or to a table with a different name, respectively. This is useful if you want to define an external table to a catalog view or DMV on your remote database - or any other situation where the remote table name is already taken locally.  

The following DDL statement drops an existing external table definition from the local catalog. It does not impact the remote database.

```sql
DROP EXTERNAL TABLE [ [ schema_name ] . | schema_name. ] table_name[;]  
```

**Permissions for CREATE/DROP EXTERNAL TABLE**: ALTER ANY EXTERNAL DATA SOURCE permissions are needed for external table DDL which is also needed to refer to the underlying data source.  

## Security considerations

Users with access to the external table automatically gain access to the underlying remote tables under the credential given in the external data source definition. You should carefully manage access to the external table in order to avoid undesired elevation of privileges through the credential of the external data source. Regular SQL permissions can be used to GRANT or REVOKE access to an external table just as though it were a regular table.  

## Example: querying vertically partitioned databases

The following query performs a three-way join between the two local tables for orders and order lines and the remote table for customers. This is an example of the reference data use case for elastic query:

```sql
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
```

## Stored procedure for remote T-SQL execution: sp\_execute_remote

Elastic query also introduces a stored procedure that provides direct access to the remote database. The stored procedure is called [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714) and can be used to execute remote stored procedures or T-SQL code on the remote database. It takes the following parameters:

* Data source name (nvarchar): The name of the external data source of type RDBMS.
* Query (nvarchar): The T-SQL query to be executed on the remote database.
* Parameter declaration (nvarchar) - optional: String with data type definitions for the parameters used in the Query parameter (like sp_executesql).
* Parameter value list - optional: Comma-separated list of parameter values (like sp_executesql).

The sp\_execute\_remote uses the external data source provided in the invocation parameters to execute the given T-SQL statement on the remote database. It uses the credential of the external data source to connect to the remote database.  

Example:

```sql
    EXEC sp_execute_remote
        N'MyExtSrc',
        N'select count(w_id) as foo from warehouse'
```

## Connectivity for tools

You can use regular SQL Server connection strings to connect your BI and data integration tools to databases on the server that has elastic query enabled and external tables defined. Make sure that SQL Server is supported as a data source for your tool. Then refer to the elastic query database and its external tables just like any other SQL Server database that you would connect to with your tool.

## Best practices

* Ensure that the elastic query endpoint database has been given access to the remote database by enabling access for Azure Services in its Azure SQL Database firewall configuration. Also ensure that the credential provided in the external data source definition can successfully log into the remote database and has the permissions to access the remote table.  
* Elastic query works best for queries where most of the computation can be done on the remote databases. You typically get the best query performance with selective filter predicates that can be evaluated on the remote databases or joins that can be performed completely on the remote database. Other query patterns may need to load large amounts of data from the remote database and may perform poorly.

## Next steps

* For an overview of elastic query, see [Elastic query overview](elastic-query-overview.md).
* For a vertical partitioning tutorial, see [Getting started with cross-database query (vertical partitioning)](elastic-query-getting-started-vertical.md).
* For a horizontal partitioning (sharding) tutorial, see [Getting started with elastic query for horizontal partitioning (sharding)](elastic-query-getting-started.md).
* For syntax and sample queries for horizontally partitioned data, see [Querying horizontally partitioned data)](elastic-query-horizontal-partitioning.md)
* See [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714) for a stored procedure that executes a Transact-SQL statement on a single remote Azure SQL Database or set of databases serving as shards in a horizontal partitioning scheme.

<!--Image references-->
[1]: ./media/elastic-query-vertical-partitioning/verticalpartitioning.png

<!--anchors-->
