---
title: Performance tuning with materialized views | Microsoft Docs
description: Recommendations and considerations you should know as you use materialized views to improve your query performance. 
services: sql-data-warehouse
author: XiaoyuMSFT
manager: craigggit 
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: development
ms.date: 09/05/2019
ms.author: xiaoyul
ms.reviewer: nibruno; jrasnick
---

# Performance tuning with materialized views 
Materialized views in Azure SQL Data Warehouse allow for enhanced query performance for complex analytical workloads. Materialized views also provide a low maintenance method for performance tuning with zero query code changes. This article discusses the general guidance on using materialized views.


## Materialized views vs. standard views
Azure SQL Data Warehouse supports standard views and materialized views.  Both are virtual tables created with SELECT expressions and presented to queries as logical tables.  Views encapsulate the complexity of common data computation and add an abstraction layer to computation changes so there's no need to rewrite queries.  

A standard view computes its data each time when the view is used.  There's no data stored on disk. People typically use standard views as a tool that helps organize the logical objects and queries in a database.  To use a standard view, a query needs to make direct reference to it. 

A materialized view pre-computes, stores, and maintains its data Azure SQL Data Warehouse just like a table.  There's no recomputation needed each time when a materialized view is used.  That's why queries that use all or subset of the data in materialized views can get faster performance.  Even better,  queries can use a materialized view without making direct reference to it, so there is no need for application code change.  

Most of the requirements on a standard view still apply to a materialized view. For details on materialized view syntax and other requirements, refer to [CREATE MATERIALIZED VIEW AS SELECT](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest).



| Comparison                     | View                                         | Materialized View             
|:-------------------------------|:---------------------------------------------|:--------------------------------------------------------------| 
|View definition                 | Stored in Azure data warehouse.              | Stored in Azure data warehouse.    
|View content                    | Generated each time when the view is used.   | Pre-processed and stored in Azure data warehouse during view creation. Updated as data is added to the underlying tables.                                             
|Data refresh                    | Always updated                               | Always updated                          
|Speed to retrieve view data from complex queries     | Slow                                         | Fast  
|Extra storage                   | No                                           | Yes                             
|Syntax                          | CREATE VIEW                                  | CREATE MATERIALIZED VIEW AS SELECT           
     
## Benefits of using materialized views

A properly designed materialized view can provide following benefits:

- Reduce the execution time for complex queries with JOINs and aggregations. The more complex the query, the higher the potential for execution-time saving. The most benefit is gained when the computation cost is high and the resulting data set is small.  

- The data warehouse optimizer can automatically use existing materialized views to improve the execution plan.  This process is transparent to end users providing  better query performance.   No query code changes are required to reference a materialized view.   

- Require low maintenance.  A materialized view stores data in two places, including a clustered columnstore index storing the initial data at view creation and a delta store storing the incremental data changes. All data changes from base tables are automatically added to the delta store in a synchronous manner.  A background process (tuple mover) periodically moves data from the delta store to the columnstore index.   This design allows queries to get the same result set from a materialized view as what they would get from the base tables.
- The data distribution in a materialized view can be different from the base tables.  
- Data materialized views get the same high availability and resiliency benefits as regular tables.  
 
Comparing to other data warehouse providers, materialized views implemented in Azure data warehouse also provide the following additional values: 

- Automatic and synchronous data refresh with data changes in base tables. No user action is needed.
- Broad aggregate function support. See [CREATE MATERIALIZED VIEW AS SELECT (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest).
- Materialized view recommendation support for a query.  See [EXPLAIN (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/queries/explain-transact-sql?view=azure-sqldw-latest).

## Common scenarios  

Materialized views are typically used in following scenarios: 

**Complex analytical queries against large data in size**

Executing analytical queries with aggregates and table joins usually involves expensive operations such as shuffles and joins.  That's why those queries take longer time to complete.  If all or subset of the query results is frequently used in your workload, consider creating materialized views to store the data so there's no recomputation when other queries need this data.  
**Need faster performance with no or minimum query changes**

Schema and query changes in data warehouses are typically kept to a minimum to support regular ETL operations and reporting.  Consider using materialized views for faster response from certain queries, if the performance gain can offset the incurred cost in storage and view maintenance.  In comparison to other tuning options such as scaling and statistics management, creating and using materialized views is a less impactful change in production with much higher potential gain in performance: 

- Creating or maintaining a materialized view does not impact queries executing against its base tables.
- Query optimizer can automatically use deployed materialized views without the view being referenced in the query itself.   This capability reduces the need for query change in performance tuning. 

**Need different data distribution strategy for faster query performance**

Azure data warehouse is a distributed massively parallel processing (MPP) system.   Data in a data warehouse table is distributed across 60 nodes using one of three [distribution strategies](https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-tables-distribute) (hash, round_robin, or replicated).  The distribution strategy can only be specified at the table creation time and stays unchanged until the table is dropped. Materialized view being a virtual table on disk supports hash and round_robin distributions.  You can choose a distribution strategy that is different from base tables but optimal to queries leveraging the views the most.

**Need to reduce compute cost without impacting query performance**

Complex analytical queries typically use more computational resources due to expensive query execution operations such as joins and shuffles.  The compute cost increases fast as queries are executed frequently.  Creating materialized views in this case allows applicable queries to retrieve data directly from the view instead of having to reprocess the query each time against base tables, hence  reducing queries’ compute usage and execution time. 
 
## Design guidance 

Here is general guidance on using materialized views to improve query performance:

**Design for your workload**

- Before you begin to create materialized views, it is important to have a deep understanding of your workload in terms of query patterns, importance, frequency, and size of resulting data.  

- Users can run EXPLAIN WITH_RECOMMENDATIONS <SQL_statement> for the materialized views recommended by query optimizer.  Since these recommendations are query-specific, a view that benefits a single query may not be optimal for other queries in the same workload.  Evaluate these recommendations with your workload needs in mind.  The ideal materialized views are those that benefit the performance of the workload.

**Be aware of the tradeoff between faster queries and cost incurred from materialized views** 

- For each materialized view, there is a cost for storage and view maintenance by tuple mover. Users should check if the cost incurred from all materialized views can be offset by the query performance gain.  Run this query for the list of materialized view in a database: 

```sql
SELECT V.name as materialized_view, V.object_id 
FROM sys.views V 
JOIN sys.indexes I ON V.object_id= I.object_id AND I.index_id < 2;
```

Options to reduce the number of materialized views: 

- Identify common data sets frequently used by the complex queries in your workload.  Create materialized views to store the data sets as building blocks for optimizer to create execution plans. 

- Drop the materialized views that have low usage or are no longer needed.  A disabled materialized view is not maintained but it still incurs storage cost.  

- Combine materialized views created on the same or similar base tables even if their data doesn't overlap.  Combing materialized views could result in a larger view in size than the sum of the separate views, however the view maintenance cost should reduce.  For example:

```sql

-- Query 1 would benefit from having a materialized view created with this SELECT statement

SELECT A, SUM(B)
FROM T
GROUP BY A

-- Query 2 would benefit from having a materialized view created with this SELECT statement

SELECT C, SUM(D)
FROM T
GROUP BY C

-- You could create a single mateiralized view of this form

SELECT A, C, SUM(B), SUM(D)
FROM T
GROUP BY A, C

```

**Not all performance tuning requires query change**

The data warehouse optimizer can automatically use deployed materialized views to improve query performance.  Since this support is transparent to users and also applies to queries that don't reference the views or use  aggregates unsupported by materialized views, there is no need for query changes.  You can check a query's estimated execution plan to confirm if a materialized view is used.  

**Monitor materialized views** 

A materialized view is stored in data warehouse just like a table with clustered columnstore index (CCI).  Reading data from a materialized view includes scanning the index and apply changes from delta store.  When the number of rows in delta store is too high, resolving a query from a materialized view could take longer than querying directly against the base tables.  To avoid performance degradation,  it’s a good practice to run [DBCC PDW_SHOWMATERIALIZEDVIEWOVERHEAD](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-pdw-showmaterializedviewoverhead-transact-sql?view=azure-sqldw-latest) to monitor the view’s overhead_ratio (total_rows / base_view_row).  If the overhead_ratio is too high, consider to rebuild the materialized view so all rows in the delta store are moved to columnstore index.  

**Materialized view and result set caching**

These two features are introduced in Azure data warehouse around the same time for query performance tuning.  Result set caching is mainly used for getting high query concurrency and fast response from repetitive queries against static data.  To use the cached result, the cache requesting query's form must match with the query that produced the cache and the cached result must apply to the entire query.  Materialized views allow data changes in base tables.  Data in materialized views can be applied to a piece of a query.  This support allows the same materialized views to be used by different queries sharing some computation  for faster performance.

## Example

This example uses a TPCDS-like query that finds customers who spend more money via catalog than in stores.  Identify preferred customers and their country of origin.   The query involves selecting TOP 100 records from the UNION of three sub-SELECT statements involving SUM() and GROUP BY. 

```sql
WITH year_total AS (
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(ss_ext_list_price-ss_ext_wholesale_cost-ss_ext_discount_amt+ss_ext_sales_price, 0)/2) year_total
       ,'s' sale_type
FROM customer
     ,store_sales_partitioned
     ,date_dim
WHERE c_customer_sk = ss_customer_sk
   AND ss_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year
UNION ALL
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(cs_ext_list_price-cs_ext_wholesale_cost-cs_ext_discount_amt+cs_ext_sales_price, 0)/2) year_total
       ,'c' sale_type
FROM customer
     ,catalog_sales_partitioned
     ,date_dim
WHERE c_customer_sk = cs_bill_customer_sk
   AND cs_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year
UNION ALL
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(ws_ext_list_price-ws_ext_wholesale_cost-ws_ext_discount_amt+ws_ext_sales_price, 0)/2) year_total
       ,'w' sale_type
FROM customer
     ,web_sales_partitioned
     ,date_dim
WHERE c_customer_sk = ws_bill_customer_sk
   AND ws_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year
         )
  SELECT TOP 100 
                  t_s_secyear.customer_id
                 ,t_s_secyear.customer_first_name
                 ,t_s_secyear.customer_last_name
                 ,t_s_secyear.customer_birth_country
FROM year_total t_s_firstyear
     ,year_total t_s_secyear
     ,year_total t_c_firstyear
     ,year_total t_c_secyear
     ,year_total t_w_firstyear
     ,year_total t_w_secyear
WHERE t_s_secyear.customer_id = t_s_firstyear.customer_id
   AND t_s_firstyear.customer_id = t_c_secyear.customer_id
   AND t_s_firstyear.customer_id = t_c_firstyear.customer_id
   AND t_s_firstyear.customer_id = t_w_firstyear.customer_id
   AND t_s_firstyear.customer_id = t_w_secyear.customer_id
   AND t_s_firstyear.sale_type = 's'
   AND t_c_firstyear.sale_type = 'c'
   AND t_w_firstyear.sale_type = 'w'
   AND t_s_secyear.sale_type = 's'
   AND t_c_secyear.sale_type = 'c'
   AND t_w_secyear.sale_type = 'w'
   AND t_s_firstyear.dyear+0 =  1999
   AND t_s_secyear.dyear+0 = 1999+1
   AND t_c_firstyear.dyear+0 =  1999
   AND t_c_secyear.dyear+0 =  1999+1
   AND t_w_firstyear.dyear+0 = 1999
   AND t_w_secyear.dyear+0 = 1999+1
   AND t_s_firstyear.year_total > 0
   AND t_c_firstyear.year_total > 0
   AND t_w_firstyear.year_total > 0
   AND CASE WHEN t_c_firstyear.year_total > 0 THEN t_c_secyear.year_total / t_c_firstyear.year_total ELSE NULL END
           > CASE WHEN t_s_firstyear.year_total > 0 THEN t_s_secyear.year_total / t_s_firstyear.year_total ELSE NULL END
   AND CASE WHEN t_c_firstyear.year_total > 0 THEN t_c_secyear.year_total / t_c_firstyear.year_total ELSE NULL END
           > CASE WHEN t_w_firstyear.year_total > 0 THEN t_w_secyear.year_total / t_w_firstyear.year_total ELSE NULL END
ORDER BY t_s_secyear.customer_id
         ,t_s_secyear.customer_first_name
         ,t_s_secyear.customer_last_name
         ,t_s_secyear.customer_birth_country
OPTION ( LABEL = 'Query04-af359846-253-3');
```

Check the estimated execution plan for this query.  There are 18 shuffles and 17 joins operations that take more time to execution.  Now create one materialized view for each sub-SELECT statement.   

```sql
CREATE materialized view nbViewSS WITH (DISTRIBUTION=HASH(customer_id)) AS
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(ss_ext_list_price-ss_ext_wholesale_cost-ss_ext_discount_amt+ss_ext_sales_price, 0)/2) year_total
          , count_big(*) AS cb
FROM dbo.customer
     ,dbo.store_sales
     ,dbo.date_dim
WHERE c_customer_sk = ss_customer_sk
   AND ss_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year

CREATE materialized view nbViewCS WITH (DISTRIBUTION=HASH(customer_id)) AS
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(cs_ext_list_price-cs_ext_wholesale_cost-cs_ext_discount_amt+cs_ext_sales_price, 0)/2) year_total
          , count_big(*) as cb
FROM dbo.customer
     ,dbo.catalog_sales
     ,dbo.date_dim
WHERE c_customer_sk = cs_bill_customer_sk
   AND cs_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year


CREATE materialized view nbViewWS WITH (DISTRIBUTION=HASH(customer_id)) AS
SELECT c_customer_id customer_id
       ,c_first_name customer_first_name
       ,c_last_name customer_last_name
       ,c_preferred_cust_flag customer_preferred_cust_flag
       ,c_birth_country customer_birth_country
       ,c_login customer_login
       ,c_email_address customer_email_address
       ,d_year dyear
       ,sum(isnull(ws_ext_list_price-ws_ext_wholesale_cost-ws_ext_discount_amt+ws_ext_sales_price, 0)/2) year_total
          , count_big(*) AS cb
FROM dbo.customer
     ,dbo.web_sales
     ,dbo.date_dim
WHERE c_customer_sk = ws_bill_customer_sk
   AND ws_sold_date_sk = d_date_sk
GROUP BY c_customer_id
         ,c_first_name
         ,c_last_name
         ,c_preferred_cust_flag
         ,c_birth_country
         ,c_login
         ,c_email_address
         ,d_year

```
Check the original query's estimated execution plan again.  The number of shuffles changes from 18 to # and the number of joins changes from 17 to #. Hover over the join operator icons in the plan, the Output List shows the new materialized views are used for producing the data, not the base tables.
 