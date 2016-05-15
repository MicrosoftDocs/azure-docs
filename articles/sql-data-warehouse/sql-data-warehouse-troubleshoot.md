<properties
   pageTitle="Troubleshooting | Microsoft Azure"
   description="Troubleshooting SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/15/2016"
   ms.author="mausher;sonyama;barbkess"/>

# Troubleshooting
The following topic lists some of the more common issues customers run into with Azure SQL Data Warehouse.

## Connectivity
Connecting to Azure SQL Data Warehouse can fail for a couple of common reasons:

- Firewall rules are not set
- Using unsupported tools/protocols

### Firewall Rules
Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses can access databases. The firewalls are secure by default - meaning you must allow your IP address access before you can connect.

To configure your firewall for access, please follow the steps in the [Configure server firewall access for your client IP][] section of the [Provision][] page.

### Using unsupported tools/protocols
SQL Data Warehouse supports [Visual Studio 2013/2015][] as development environments and [SQL Server Native Client 10/11 (ODBC)][] for client connectivity.

## Query Performance

There are several simple things you can do in your database design to ensure that you get the optimal query performance from you SQL Data Warehouse.  A good place to always start is [learning how to monitor your queries][].  Sometimes the solution is to simply add more compute power to your queries by [scaling your SQL Datawarehouse][]. To find many of these optimizations in one place, take a look at out article [SQL Data Warehouse Best Practices][].  

Below are some of the most common query performance issues we see.

### Statistics

[Statistics][] are objects that contain information about the range and frequency of values in a database column. The query engine uses these statistics to optimize query execution and improve query performance. Unlike SQL Server or SQL DB, SQL Data Warehouse does not auto-create or auto-update statistics.  Statistics must be manually mantained on all tables.  To learn how to manage your statistics and identify tables which need statistics, take a look at the article [Manage statistics in SQL Data Warehouse][].

### Table Design

One of the most important choices you make in your SQL Data Warehouse is [choosing the right a hash distribution key for your table][] and [table design][].  As you move from getting started to getting faster performance out of your SQL Data Warehouse, be sure to understand the concepts in these articles.

### Clustered Columnstore Segment Quality

Clustered Columnstore segment quality is important to optimal query performance on Clustered Columnstore Tables.  Segment quality can be measured by number of rows in a compressed Row Group.  The following query will identify tables with poor Columnstore index segment health and generate the T-SQL to rebuild the columnstore index on these tables.  The first column of this query result will give you the T-SQL to rebuild each index.  The second column will provide a recommendation for the minimum resource class to use to optimize the compression. 
 
**STEP 1:** Run this query on each SQL Data Warehouse database to identify any sub-optimal cluster columnstore indexes.  If no rows are returned, then this regression did not impact you and no further action is needed.

```sql
SELECT 
     'ALTER INDEX ALL ON ' + s.name + '.' + t.NAME + ' REBUILD;' AS [T-SQL to Rebuild Index]
    ,CASE WHEN n.nbr_nodes < 3 THEN 'xlargerc' WHEN n.nbr_nodes BETWEEN 4 AND 6 THEN 'largerc' ELSE 'mediumrc' END AS [Resource Class Recommendation]
    ,s.name AS [Schema Name]
    ,t.name AS [Table Name]
    ,AVG(CASE WHEN rg.State = 3 THEN rg.Total_rows ELSE NULL END) AS [Ave Rows in Compressed Row Groups]
FROM 
    sys.pdw_nodes_column_store_row_groups rg
    JOIN sys.pdw_nodes_tables pt 
        ON rg.object_id = pt.object_id AND rg.pdw_node_id = pt.pdw_node_id AND pt.distribution_id = rg.distribution_id
    JOIN sys.pdw_table_mappings tm 
        ON pt.name = tm.physical_name
    INNER JOIN sys.tables t 
        ON tm.object_id = t.object_id
INNER JOIN sys.schemas s
    ON t.schema_id = s.schema_id
CROSS JOIN (SELECT COUNT(*) nbr_nodes  FROM sys.dm_pdw_nodes WHERE type = 'compute') n
GROUP BY 
    n.nbr_nodes, s.name, t.name
HAVING 
    AVG(CASE WHEN rg.State = 3 THEN rg.Total_rows ELSE NULL END) < 100000 OR
    AVG(CASE WHEN rg.State = 0 THEN rg.Total_rows ELSE NULL END) < 100000

ORDER BY 
    s.name, t.name
```
 
**STEP 2:** Increase the Resource Class of a user which has permissions to rebuild the index on this table to the recommended resource class from the 2nd column of the above query.

```sql
EXEC sp_addrolemember 'xlargerc', 'LoadUser'
```

> [AZURE.NOTE]  LoadUser above should be a valid user you create to run the ALTER INDEX statement. The resource class of the db_owner user cannot be changed.  More information about resource classes and how to create a new user can be found in the link below.

 
**STEP 3:** Logon as the user from step 2 (for example “LoadUser”), which is now using a higher resource class, and execute the ALTER INDEX statements generated by the query in STEP 1.  Be sure that this user has ALTER permission to the tables identified in the query from STEP 1.
 
**STEP 4:** Rerun the query from step 1.  If the indexes were built efficiently, no rows should be returned by this query.  If no rows are returned, you are done.  If you have multiple SQL DW databases, then you will want to repeat this process on each of your databases.  If rows are returned, continue on to step 5.
 
**STEP 5:** If rows are returned when you rerun the query from step 1, you might have tables with extra wide rows which need high amounts of memory to optimally build the clustered column store indexes.  If this is the case, retry this process for these table using the xlargerc class.  To change the resource class repeat step 2 using xlargerc.  Then repeat step 3 for the tables which still have suboptimal indexes.  If you are using a DW100 - DW300 and already used the xlargerc then you may choose to either leave the indexes as is or temporarily increase DWU to provide more memory to this operation.
 
**FINAL STEPS:**  The resource class designated above is the recommended minimum resource class to build the highest quality columnstore indexes.   We recommend that you keep this setting for the user which loads your data.  However, if you wish to undo the change from step 2, you can do this with the following command.  

```sql
EXEC sp_droprolemember 'smallrc', 'LoadUser'
```

The guidance for minimum resource class for loads to a CCI table is to use xlargerc for DW100-DW300, largerc for DW400-DW600, and mediumrc for anything at or above DW1000.  This guidance is a good practice for most workloads.  The goal is to give each index build operation 400 MB or more of memory.  However, one size does not fit all.  The memory needed to optimize a columnstore index is dependent on the data being loaded, which is primarily influenced by row size.  Tables with narrower row widths need less memory, wider row widths need more.  If you would like to experiment, you can use the query from Step 1, to see if you get optimal columnstore indexes at smaller memory allocations.  Minimally you want on average more than 100K rows per row group.  Above 500K is even better.  The maximum you will see is 1 million rows per row group. For details on how to manage resources classes and concurrency see the link below.


## Next steps
Please refer to the [SQL Data Warehouse Best Practices][] article for more information on how to optimize your SQL Data Warehouse solution.

<!--Image references-->

<!--Article references-->
[scaling your SQL Datawarehouse]: ./sql-data-warehouse-overview-scalability.md
[table design]: ./sql-data-warehouse-develop-table-design.md
[choosing the right a hash distribution key for your table]: ./sql-data-warehouse-develop-hash-distribution-key
[development overview]: ./sql-data-warehouse-overview-develop.md
[learning how to monitor your queries]: ./sql-data-warehouse-manage-monitor.md
[Manage statistics in SQL Data Warehouse]: ./sql-data-warehouse-develop-statistics.md
[Provision]: ./sql-data-warehouse-get-started-provision.md
[Configure server firewall access for your client IP]: ./sql-data-warehouse-get-started-provision.md/#create-a-new-azure-sql-server-level-firewall
[Visual Studio 2013/2015]: ./sql-data-warehouse-get-started-connect.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md
[Statistics]: ./sql-data-warehouse-develop-statistics.md

<!--MSDN references-->
[SQL Server Native Client 10/11 (ODBC)]: https://msdn.microsoft.com/library/ms131415.aspx

<!--Other web references-->
