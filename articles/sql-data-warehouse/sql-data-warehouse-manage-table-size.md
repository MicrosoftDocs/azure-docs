<properties
   pageTitle="Manage table size in Azure SQL Data Warehouse  | Microsoft Azure"
   description="Find out the size of your tables and partitions." 
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/13/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Manage table size in Azure SQL Data Warehouse

This article identifies the size of your table partitions and helps you understand the size of your database.


## Step 1: Create a view that summarises the table size

Create this view to identify which tables have data skew.

```sql
CREATE VIEW dbo.vPartitionSizing
AS

WITH base
AS
(
SELECT 
	SUBSTRING(@@version,34,4)																AS build_number
,	DB_NAME()																				AS database_name
,	s.name																					AS schema_name
,	t.name																					AS table_name
,	QUOTENAME(s.name)+'.'+QUOTENAME(t.name)													AS two_part_name
,	nt.name																					AS node_table_name
,   i.[type]                                                                                AS table_type
,   i.[type_desc]                                                                           AS table_type_desc
,	tp.distribution_policy_desc	                        									AS distribution_policy_name
,	pn.pdw_node_id                                                                          AS pdw_node_id
,	pn.[type]																				AS pdw_node_type
,	pn.name																					AS pdw_node_name
,   di.distribution_id                                                                      AS dist_id
,   di.name                                                                                 AS dist_name
,   di.position                                                                             AS dist_position
,	nps.partition_number																	AS partition_nmbr
,	nps.reserved_page_count																	AS reserved_space_page_count
,	nps.reserved_page_count - nps.used_page_count											AS unused_space_page_count
,	nps.in_row_data_page_count + nps.row_overflow_used_page_count + nps.lob_used_page_count	AS  data_space_page_count
,	nps.reserved_page_count 
	- (nps.reserved_page_count - nps.used_page_count) 
	- (in_row_data_page_count+row_overflow_used_page_count+lob_used_page_count)				AS index_space_page_count
,	nps.[row_count]                                                                         AS row_count
from sys.schemas s
join sys.tables t								ON	s.schema_id			= t.schema_id
JOIN sys.indexes i                              ON  t.object_id         = i.object_id
                                                AND i.index_id          <= 1
join sys.pdw_table_distribution_properties	tp	ON	t.object_id			= tp.object_id
join sys.pdw_table_mappings tm					ON	t.object_id			= tm.object_id
join sys.pdw_nodes_tables nt					ON	tm.physical_name	= nt.name
join sys.dm_pdw_nodes pn 						ON  nt.pdw_node_id		= pn.pdw_node_id
join sys.pdw_distributions di                   ON  nt.distribution_id  = di.distribution_id
join sys.dm_pdw_nodes_db_partition_stats nps	ON	nt.object_id		= nps.object_id
												AND nt.pdw_node_id		= nps.pdw_node_id
                                                AND nt.distribution_id  = nps.distribution_id
)
, size
AS
(
SELECT	build_number
,		database_name
,		schema_name
,		table_name
,		two_part_name
,		node_table_name
,       table_type
,       table_type_desc
,		distribution_policy_name
,       dist_id
,       dist_name
,       dist_position
,		pdw_node_id
,		pdw_node_type
,		pdw_node_name
,		partition_nmbr
,		reserved_space_page_count
,		unused_space_page_count
,		data_space_page_count
,		index_space_page_count
,		row_count
,		(reserved_space_page_count * 8.0)				AS reserved_space_KB
,		(reserved_space_page_count * 8.0)/1000			AS reserved_space_MB
,		(reserved_space_page_count * 8.0)/1000000		AS reserved_space_GB
,		(reserved_space_page_count * 8.0)/1000000000	AS reserved_space_TB
,		(unused_space_page_count * 8.0)					AS unused_space_KB
,		(unused_space_page_count * 8.0)/1000			AS unused_space_MB
,		(unused_space_page_count * 8.0)/1000000			AS unused_space_GB
,		(unused_space_page_count * 8.0)/1000000000		AS unused_space_TB
,		(data_space_page_count * 8.0)					AS data_space_KB
,		(data_space_page_count * 8.0)/1000				AS data_space_MB
,		(data_space_page_count * 8.0)/1000000			AS data_space_GB
,		(data_space_page_count * 8.0)/1000000000		AS data_space_TB
,		(index_space_page_count * 8.0)	    			AS index_space_KB
,		(index_space_page_count * 8.0)/1000				AS index_space_MB
,		(index_space_page_count * 8.0)/1000000			AS index_space_GB
,		(index_space_page_count * 8.0)/1000000000		AS index_space_TB
FROM	base
)
SELECT	* 
FROM	size
;
```

## Step 2: Query the view

Now that you have created the view, run these example queries to learn more about the size of your tables:

### Summary of table space used in the database

```sql
SELECT
	database_name
,	SUM(row_count)				as total_row_count
,	SUM(reserved_space_MB)		as total_reserved_space_MB
,	SUM(data_space_MB)			as total_data_space_MB
,	SUM(index_space_MB)			as total_index_space_MB
,	SUM(unused_space_MB)		as total_unused_space_MB
FROM dbo.vPartitionSizing
GROUP BY database_name
;
```

### Table space used by table

```sql
SELECT 
	two_part_name
,	SUM(row_count)				as table_row_count
,	SUM(reserved_space_GB)		as table_reserved_space_GB
,	SUM(data_space_GB)			as table_data_space_GB
,	SUM(index_space_GB)			as table_index_space_GB
,	SUM(unused_space_GB)		as table_unused_space_GB
FROM dbo.vPartitionSizing
GROUP BY two_part_name
;
```

### Table space by table geometry type

```sql
SELECT 
   table_type_desc
,	SUM(row_count)				as table_type_row_count
,	SUM(reserved_space_GB)		as table_type_reserved_space_GB
,	SUM(data_space_GB)			as table_type_data_space_GB
,	SUM(index_space_GB)			as table_type_index_space_GB
,	SUM(unused_space_GB)		as table_type_unused_space_GB
FROM dbo.vPartitionSizing
GROUP BY table_type_desc
;
```

### Table space by distribution

```sql
SELECT 
	pdw_node_id
,	distribution_policy_name
,	dist_name
,	SUM(row_count)				as total_node_distribution_row_count
,	SUM(reserved_space_MB)		as total_node_distribution_reserved_space_MB
,	SUM(data_space_MB)			as total_node_distribution_data_space_MB
,	SUM(index_space_MB)			as total_node_distribution_index_space_MB
,	SUM(unused_space_MB)		as total_node_distribution_unused_space_MB
FROM dbo.vPartitionSizing
GROUP BY 	distribution_policy_name
,			dist_name
,			pdw_node_id
ORDER BY    pdw_node_id
,           distribution_policy_name
,		    dist_name
;
```

## Step 3: Manage the tables

Did you find some tables that you didn't need any more? Consider dropping them or exporting them to blob storage using [CREATE EXTERNAL TABLE AS SELECT (CETAS)][]

Were some tables larger than you thought? You may want to consider partitioning them. Refer to the article on [table partitions][] for more information.

Are you approaching the configured maximum size of your database? Use [ALTER DATABASE][] to change it.

## Next Steps
For more details on table distribution refer to the following articles:

* [Table design][]
* [Hash distribution][]

<!--Image references-->

<!--Article references-->
[Table design]: sql-data-warehouse-develop-table-design.md
[Hash distribution]: sql-data-warehouse-develop-hash-distribution-key.md

<!--MSDN references-->

<!--Other Web references-->