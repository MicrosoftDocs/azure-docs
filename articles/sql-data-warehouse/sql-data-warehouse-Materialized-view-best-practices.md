---
title: Best practices | Microsoft Docs
description: Recommendations and best practices you should know as you use materialized views to improve your query performance. 
services: sql-data-warehouse
author: XiaoyuMSFT
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 09/05/2019
ms.author: xiaoyul
ms.reviewer: nibruno; jrasnick
---

# Best practices for performance tuning with materialized views 
Materialized views in Azure SQL Data Warehouse allow for enhanced query performance for complex analytical workloads. Materialized views also provide a low maintenance method for performance tuning with zero query code changes. This article discusses the general guidance on using materialized views, including key concepts, benefits, common scenarios, best practice and considerations in design.  


## Materialized views vs. standard views
Both standard views and materialized views are virtual tables with their content defined by SELECT queries.  A standard view processes its content each time  the view is used during query execution. Since the view content is not stored on disk, a standard view does not incur additional storage cost and does not require maintenance.  A materialized view pre-processes its content and stores the resulting data in Azure data warehouse just like a table.  Retrieving data from a materialized view is much faster than a standard view as data is already stored in the database and no re-computation is needed each time the materialized view is used.   Most of the constraints on a standard view still apply to a materialized view.   For details on materialized view syntax and other requirements, refer to [CREATE MATERIALIZED VIEW AS SELECT](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest).   

| Comparison                     | View                                         | Materialized View             
|:-------------------------------|:---------------------------------------------|:--------------------------------------------------------------| 
|View definition                 | Stored in Azure data warehouse.              | Stored in Azure data warehouse.    
|View content                    | Generated each time when the view is used.   | Pre-processed and stored in Azure data warehouse during view creation. Updated as data is added to the underlying tables.                                             
|Data refresh                    | Always updated                               | Always updated                          
|Speed to retrieve view data     | Slow                                         | Fast  
|Extra storage                   | No                                           | Yes                             
|Syntax                          | CREATE VIEW                                  | CREATE MATERIALIZED VIEW AS SELECT           
     
## Benefits of using materialized views
A properly designed materialized view can provide following benefits:
- Reduce the execution time of queries with JOINs and aggregations.   The more complex the query, the higher the potential for execution time saving. 
- The data warehouse optimizer can automatically leverage existing materialized views to improve the execution plan.  This process is completely transparent to end users providing  better query performance.   No query code changes are required to reference a materialized view.   
- Require low maintenance.  A materialized view uses clustered columnstore index for storing the initial data returned from the view definition query and a delta store for storing incremental changes.  When data changes in the base tables, these changes are automatically added to the delta store in a synchronous manner.  A background process (tuple mover) periodically moves data from the delta store to the columnstore index.   This allows queries to get the same result set from a materialized view as what they would get from the base tables.
- Support different data distribution strategies from the base tables.
- Data stored in materialized views get the same high availability and resiliency benefits as regular tables.  
 
Comparing to other data warehouse providers, materialized views implemented in Azure data warehouse also provide the following additional values: 
- The view is automatically and synchronously refreshed with data changes in the base tables.  No user action is needed.
- Support more aggregate functions.  See [CREATE MATERIALIZED VIEW AS SELECT (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest).
- Support materialized view recommendation for a query.  See [EXPLAIN (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/queries/explain-transact-sql?view=azure-sqldw-latest).

## Common scenarios  
Materialized views are typically used in following scenarios: 

**Complex analytical queries against large data in size**

An analytical SELECT query with aggregation functions and table joins usually involves expensive operations in execution such as shuffles and joins therefore takes longer to execute.  If all or subset of the data resulting from this query is frequently used in your workload, consider creating a materialized view for this SELECT query to avoid re-computation each time the data is needed by other queries.

**Need faster performance with no or minimum query changes**

In data warehouses, schema changes are typically kept to a minimum to support regular ETL operations and built-on reports in production.   When query change is not feasible, using materialized views could be alternative to certain queries if the incurred storage cost can be offset by the saving in query execution time.   In comparison to other tuning options such as scaling and statistics management, creating and using materialized views is a less impactful production change with much higher potential performance gain: 
- Creating or maintaining a materialized view does not impact queries executing against its base tables.
- Query optimizer can automatically leverage deployed materialized views without the view being referenced in the query itself.   This alleviates the any query code change in performance tuning. 

**Need different data distribution strategy for faster query performance**

Azure data warehouse is a distributed massively parallel processing (MPP) system.   Data in a data warehouse table is distributed across 60 nodes using one of three [distribution strategy](https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-tables-distribute) (hash, round_robin, or replicated) at table creation time and cannot be changed afterwards.   Materialized view being a virtual table on disk supports hash and round_robin distributions.  You can choose a distribution strategy that is different from base tables but optimal to queries leveraging the views the most.

**Need to reduce compute cost without impacting query performance**

Complex analytical queries typically use more computational resources due to expensive query execution operations such as joins and shuffles.  The compute cost increases fast as queries are executed frequently.  Creating materialized views in this case allows applicable queries to retrieve data directly from the view instead of having to re-process the query each time against base tables, hence  reducing queries’ compute usage and execution time. 
 
## Best practices in design
**Design for the workload:**

Before you begin to create materialized views, it is important to have a deep understanding of your workload in terms of query patterns, importance, frequency, and size of resulting data.  

**The more is not necessarily the better:**

You can run EXPLAIN WITH_RECOMMENDATIONS <SQL_statement> for the materialized views recommended by query optimizer, but keep in mind that:
- These recommendations are query-specific, therefor may not be optimal for other queries in the same workload.   Choose the recommendation(s) that can benefit the workload the most, not just one or a few queries’ performance.  
- Having multiple materialized views with overlapping dataset increases storage cost and tuple mover’s workload and there is no guaranteed proportional gain in query performance.  Run  this query for all materialized view in a user database: 

```sql
SELECT V.name as materialized_view, V.object_id 
FROM sys.views V 
JOIN sys.indexes I ON V.object_id= I.object_id AND I.index_id < 2;
```
- A DISABLED materialized view still consumes storage.  Consider dropping the view if it’s not needed.

**Create building block materialized views:**

Identify common data sets frequently used by the complex queries in your workload.  Create materialized views to store these data as building blocks which can be leveraged by query optimizer when building execution plans.  

**Not all performance tuning requires query change:**

For queries not meeting the requirements in creating materialized views and queries not referencing materialized views, the data warehouse optimizer can still leverage deployed materialized views to optimize their execution.  Since this is process is automatic and transparent, no query code change is required.  Check the execution plans  before changing your queries.

## Monitor materialized views 

Materialized view is stored in data warehouse just like a table in column store, therefor retrieving data from a materialized view includes scanning its clustered columnstore index (CCI) and apply changes from delta store.  When the number of rows in delta store is too high, resolving a query from a materialized view could take longer than querying directly against the base tables.  To avoid performance degradation,  it’s a good practice to run [DBCC PDW_SHOWMATERIALIZEDVIEWOVERHEAD](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-pdw-showmaterializedviewoverhead-transact-sql?view=azure-sqldw-latest) to monitor the view’s  overhead_ratio (total_rows / base_view_row).  If it’s too high, consider rebuild the materialized view so all rows in the delta store are moved to columnstore index.  

## Materialized view and result set caching

These two performance tuning features were introduced in Azure data warehouse around the same time for different scenarios and goals.  Use result set caching for faster response from repetitive queries against static data and the queries need to be deterministic top-level SELECT queries.  Materialized view does not require its leveraging queries to be deterministic or identical and allows data changes in the base tables.  

