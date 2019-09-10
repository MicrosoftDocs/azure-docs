---
title: Performance tuning with ordered clustered columnstore index | Microsoft Docs
description: Recommendations and considerations you should know as you use ordered clustered columnstore index to improve your query performance. 
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

# Performance tuning with ordered clustered columnstore index  

When executing a query against columnstore tables in Azure SQL Data Warehouse, the optimizer checks the metadata on each column segment’s range (minimum and maximum values stored) so segments out of bounds of query predicate are not read from disk to memory.  A query can have faster performance if the number of segments to read and their total size are small.   

## Ordered vs. non-ordered clustered columnstore index 
For Azure Data Warehouse table created with no index option specified, an internal process called Index Builder creates a non-ordered clustered columnstore index (CCI) on it by default.  Each column is compressed into a separate rowgroup segment.  There is metadata on each segment’s value range so only the segments that meet the query predicate are read from disk during query execution.  CCI offers the highest level of data compression and improves query performance by reducing the size of column segments to be read from the disk during query execution.   However, it’s important to know that index builder does not sort data before compressing into column segments, therefore overlapping segments can happen, causing longer query execution as more segments need to be read from disk. 

Ordered CCI can help reduce segment overlapping.  When creating a table with ordered CCI, data is first sorted in memory by Azure Data Warehouse by the order key(s) before index builder compresses them into index segments.  With sorted data, segments can be reduced allowing more efficient segment elimination and faster query performance as fewer number of segments need to be read.   If all data can be sorted in memory at once, then segment overlapping can be avoided.  This scenario could be rare given the large size of data in data warehouse tables.  

To check the segment ranges for a column, run this command with your table name and column name:

```sql
SELECT o.name, pnp.index_id, pnp.rows, pnp.data_compression_desc, pnp.pdw_node_id, 
pnp.distribution_id, cls.segment_id, cls.column_id, cls.min_data_id, cls.max_data_id, cls.max_data_id-cls.min_data_id as difference
FROM sys.pdw_nodes_partitions AS pnp
   JOIN sys.pdw_nodes_tables AS Ntables ON pnp.object_id = NTables.object_id AND pnp.pdw_node_id = NTables.pdw_node_id
   JOIN sys.pdw_table_mappings AS Tmap  ON NTables.name = TMap.physical_name AND substring(TMap.physical_name,40, 10) = pnp.distribution_id
   JOIN sys.objects AS o ON TMap.object_id = o.object_id
   JOIN sys.pdw_nodes_column_store_segments AS cls ON pnp.partition_id = cls.partition_id AND pnp.distribution_id  = cls.distribution_id
   JOIN sys.columns as cols ON o.object_id = cols.object_id AND cls.column_id = cols.column_id
WHERE o.name = '<table_name>' and c.name = '<column_name>'
ORDER BY o.name, pnp.distribution_id, cls.min_data_id
```

## Data loading performance
- The performance of data loading into an ordered CCI table is similar to data loading into a partitioned table.  
- Loading data into an ordered CCI table can take more time than data loading into a non-ordered CCI table due to the data sorting.  

Figure 1 shows an example performance comparison of loading data into tables with different schemas.  
![Performance_comparison_data_loading](media/sql-data-warehouse-develop-ordered-cci/CCI_Data_Loading_Performance.png)
 
## Reduce segment overlapping
To further reduce segment overlapping, consider these options when creating an ordered CCI table with CTAS command or when creating an ordered CCI on a table with data:
- Use a larger resource class.  This allows more data to be sorted at once in memory before index builder compresses them into segments.  Once in an index segment, data cannot be sorted again. 
- Use a lower degree of parallelism (DOP = 1 for example).  Each thread used for ordered CCI creation works on a subset of data and sort it locally.  There is no global so sorting across data sets.  Using parallel threads can reduce time to create ordered CCI but will generate more overlapping segments than using a single thread. 
- Pre-sort the data by the sort key(s) before loading them into data warehouse tables.

## Create ordered CCI on large tables
Creating an ordered CCI is an offline operation.  For non-partitioned tables, data will not be accessible to users until the ordered CCI creation process completes.   For partitioned tables, since the engine creates the ordered CCI partition by partition, users can still access the data in partitions where ordered CCI creation is not in process.   You can use this option to minimize the downtime during ordered CCI creation on large tables: 

1.	Create partitions on the target large table (called Table A)
2.	Create an empty ordered CCI table (called Table B) with the same table and partition schema as Table A.
3.	Switch one partition from Table A to Table B.
4.	Run ALTER INDEX <Ordered_CCI_Index> REBUILD on Table B to rebuild the switch’ed-in partition.  
5.	Repeat step 3 and 4 for each partition in Table A.
6.	Once all partitions are switched from Table A to Table B and have been rebuilt, drop Table A, rename Table B to Table A. 

## Examples

**A. To check for ordered columns and order ordinal:**
```sql
SELECT object_name(c.object_id) table_name, c.name column_name, i.column_store_order_ordinal 
FROM sys.index_columns i 
JOIN sys.columns c ON i.object_id = c.object_id AND c.column_id = i.column_id
WHERE column_store_order_ordinal <>0
```

**B.To change column ordinal, add or remove columns from the order list, or to change from CCI to ordered CCI:**
```sql
CREATE CLUSTERED COLUMNSTORE INDEX InternetSales ON  InternetSales
ORDER (ProductKey, SalesAmount)
WITH (DROP_EXISTING = ON)
```