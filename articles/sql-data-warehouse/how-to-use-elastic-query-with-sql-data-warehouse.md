---
title: Elastic query - access data in Azure SQL Data Warehouse from Azure SQL Database | Microsoft Docs
description: Learn best practices for using Elastic Query to access data in Azure SQL Data Warehouse from Azure SQL Database.
services: sql-data-warehouse
author: hirokib
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/11/2018
ms.author: elbutter
ms.reviewer: igorstan
---

# Best practices for using Elastic Query in Azure SQL Database to access data in Azure SQL Data Warehouse
Learn best practices for using Elastic Query to access data in Azure SQL Data Warehouse from Azure SQL Database. 

## What is an elastic query?
An elastic query allows you to use T-SQL and external tables to write a query in an Azure SQL database that is sent remotely to an Azure SQL data warehouse. Using this feature provides cost-savings and more performant architectures, depending on the scenario.

This feature enables two primary scenarios:

1. Domain isolation
2. Remote query execution

### Domain isolation

Domain isolation refers to the classic data mart scenario. In certain scenarios, one may want to provide a logical domain of data to downstream users that are isolated from the rest of the data warehouse, for a variety of reasons including but not limited to:

1. Resource Isolation - SQL database is optimized to serve a large base of concurrent users serving slightly different workloads than the large analytical queries that the data warehouse is reserved for. Isolation ensures the right workloads are served by the right tools.
2. Security isolation - to separate an authorized data subset selectively via certain schemas.
3. Sandboxing - provide a sample set of data as a "playground" to explore production queries etc.

Elastic query can provide the ability to easily select subsets of SQL data warehouse data and move it into a SQL database instance. Furthermore this isolation does not preclude the ability to also enable Remote query execution allowing for more interesting "cache" scenarios.

### Remote query execution

Elastic query allows for remote query execution on a SQL data warehouse instance. One can utilize the best of both SQL database and SQL data warehouse by separating your hot and cold data between the two databases. Users can keep more recent data within a SQL database, which can serve reports and large numbers of average business users. However, when more data or computation is needed, a user can offload part of the query to a SQL data warehouse instance where large-scale aggregates can be processed much faster and more efficiently.

## Elastic query process
An elastic query can be used to make data located within a SQL data warehouse available to SQL database instances. Elastic query allows queries from a SQL database refer to tables in a remote SQL data warehouse instance. 

The first step is to create an external data source definition that refers to the SQL data warehouse instance, which uses existing user credentials within the SQL data warehouse. No changes are necessary on the remote SQL data warehouse instance. 

> [!IMPORTANT] 
> 
> You must possess ALTER ANY EXTERNAL DATA SOURCE permission. This permission is included with the ALTER DATABASE permission. ALTER ANY EXTERNAL DATA SOURCE permissions are needed to refer to remote data sources.

Next, create a remote external table definition in a SQL database instance, which points to a remote table in the SQL data warehouse. When a query uses an external table, the portion of the query referring to the external table is sent to the SQL data warehouse instance to be processed. Once the query has completed, the result set is sent back to the calling SQL database instance. For a brief tutorial of setting up an Elastic Query between SQL database and SQL data warehouse, see the [Configure Elastic Query with SQL Data Warehouse][Configure Elastic Query with SQL Data Warehouse].

For more information on Elastic Query with SQL database, see the [Azure SQL Database elastic query overview][Azure SQL Database elastic query overview].

## Best practices
Use these best practices to use elastic query effectively.

### General

- When using remote query execution, ensure you're only selecting necessary columns and applying the right filters. Not only does this increase the compute necessary, but it also increases the size of the result set and therefore the amount of data that need to be moved between the two instances.
- Maintain data for analytical purposes in both SQL Data Warehouse and SQL Database in clustered columnstore for analytiIcal performance.
- Ensure that source tables are partitioned for query and data movement.
- Ensure SQL database instances used as a cache are partitioned to enable more granular updates and easier management. 
- Ideally use PremiumRS databases because they provide the analytical benefits of clustered columnstore indexing with a focus on IO-intensive workloads at a discount from Premium databases.
- After loads, utilize load or effective date identification columns for upserts in the SQL Database instances to maintain cache-source integrity. 
- Create a separate login and user in your SQL data warehouse instance for your SQL database remote login credentials defined in the external data source. 

### Elastic Querying

- In many cases, one might want to manage a type of stretched table, where a portion of your table is within the SQL Database as cached data for performance with the rest of the data stored in SQL Data Warehouse. You need two objects in SQL Database: an external table within SQL Database that references the base table in SQL Data Warehouse, and the "cached" portion of the table within the SQL Database. Consider creating a view over the top of the cached portion of the table and the external table which unions both tables and applies filters that separate data materialized within SQL Database and SQL Data Warehouse data exposed through external tables.

  Imagine you want to keep the most recent year of data in a SQL database instance. The **ext.Orders** table references the data warehouse orders tables. The **dbo.Orders** represents the most recent years worth of data within the SQL database instance. Instead of asking users to decide whether to query one table or the other, create a view over the top of both tables on the partition point of the most recent year.

  ```sql
  CREATE VIEW dbo.Orders_Elastic AS
  SELECT 
  	[col_a]		
  ,	[col_b]			
  ,	...
  ,	[col_n]
  FROM
  	[dbo].[Orders]
  WHERE 
  	YEAR([o_orderdate]) >= '<Most Recent Year>'
  UNION
  SELECT 
  	[col_a]		
  ,	[col_b]			
  ,	...
  ,	[col_n] 		
  FROM
  	[ext].[Orders]
  WHERE
  	YEAR([o_orderdate]) < '<Most Recent Year>'
  ```

  A view produced in such a way let's the query compiler determine whether it needs to use the data warehouse instance to answer your users query. 

  There is overhead of submitting, compiling, running, and moving data associated with each elastic query against the data warehouse instance. Be cognizant that each elastic query counts against your concurrency slots and uses resources.  


- If one plans to drill down further into the result set from the data warehouse instance, consider materializing it in a temp table in the SQL Database for performance and to prevent unnecessary resource usage.

### Moving data 

- If possible, keep data management easier with append-only source tables such that updates are easily maintainable between the data warehouse and database instances.
- Move data on the partition level with flush and fill semantics to minimize the query cost on the data warehouse level and the amount of data moved to keep the database instance up-to-date. 

### When to choose Azure Analysis Services vs SQL Database

Use Azure Analysis Services when:

- You plan on using your cache with a BI tool that submits large numbers of small queries
- You need subsecond query latency
- You are experienced in managing/developing models for Analysis Services 

Use Azure SQL Database when:

- You want to query your cache data with SQL
- You need remote execution for certain queries
- You have larger cache requirements

## FAQ

Q: Can I use databases within an elastic pool with Elastic Query?

A: Yes. SQL Databases within an elastic pool can use Elastic Query. 

Q: Is there a cap for how many databases I can use for Elastic Query?

A: There is no hard cap on how many databases can be used for Elastic Query. However, each Elastic Query (queries that hit SQL Data Warehouse) will count toward normal concurrency limits.

Q: Are there DTU limits involved with Elastic Query?

A: DTU limits are not imposed any differently with Elastic Query. The standard policy is such that logical servers have DTU limits in place to prevent customers from accidental overspending. If you are enabling several databases for elastic query alongside a SQL Data Warehouse instance, you may hit the cap unexpectedly. If this occurs, submit a request to increase DTU limit on your logical server. You can increase your quota by [creating a support ticket](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket) and selecting *Quota* as the request type

Q: Can I use row level security/Dynamic Data Masking with Elastic Query?

A: Customers who wish to use more advanced security features with SQL Database can do so by first moving and storing the data in the SQL Database. You cannot currently apply row level security or DDM on data queried through external tables. 

Q: Can I write from my SQL database instance to data warehouse instance?

A: Currently this feature is not supported. Visit our [Feedback page][Feedback page] to create/vote for this functionality if this is a feature you would like to see in the future. 

Q: Can I use spatial types like geometry/geography?

A: You can store spatial types in SQL Data Warehouse as varbinary(max) values. When you query these columns using elastic query, you can convert them to the appropriate types at runtime.

![spatial types](./media/sql-data-warehouse-elastic-query-with-sql-database/geometry-types.png)

<!--Article references-->

[SQL Data Warehouse development overview]: sql-data-warehouse-overview-develop.md
[Configure Elastic Query with SQL Data Warehouse]: tutorial-elastic-query-with-sql-datababase-and-sql-data-warehouse.md
[Feedback Page]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Azure SQL Database elastic query overview]: ../sql-database/sql-database-elastic-query-overview.md


