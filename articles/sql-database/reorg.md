---
title: "Reorganize and Rebuild Indexes | Microsoft Docs"
ms.custom: ""
ms.date: "11/19/2019"
ms.prod: sql
ms.prod_service: "database-engine, sql-database, sql-data-warehouse, pdw"
ms.reviewer: ""
ms.technology: table-view-index
ms.topic: conceptual
f1_keywords: 
  - "sql13.swb.index.rebuild.f1"
  - "sql13.swb.indexproperties.fragmentation.f1"
  - "sql13.swb.index.reorg.f1"
helpviewer_keywords: 
  - "large object defragmenting"
  - "indexes [SQL Server], reorganizing"
  - "index reorganization [SQL Server]"
  - "reorganizing indexes"
  - "defragmenting large object data types"
  - "index fragmentation [SQL Server]"
  - "index rebuilding [SQL Server]"
  - "rebuilding indexes"
  - "indexes [SQL Server], rebuilding"
  - "defragmenting indexes"
  - "nonclustered indexes [SQL Server], defragmenting"
  - "fragmentation [SQL Server]"
  - "index defragmenting [SQL Server]"
  - "LOB data [SQL Server], defragmenting"
  - "clustered indexes, defragmenting"
ms.assetid: a28c684a-c4e9-4b24-a7ae-e248808b31e9
author: pmasl
ms.author: mikeray
monikerRange: ">=aps-pdw-2016||=azuresqldb-current||=azure-sqldw-latest||>=sql-server-2016||=sqlallproducts-allversions||>=sql-server-linux-2017||=azuresqldb-mi-current"
---
# Reorganize and rebuild indexes

[!INCLUDE[appliesto-ss-asdb-asdw-pdw-md](../../includes/appliesto-ss-asdb-asdw-pdw-md.md)]

This article describes how to reorganize or rebuild a fragmented index in [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)] by using [!INCLUDE[ssManStudioFull](../../includes/ssmanstudiofull-md.md)] or [!INCLUDE[tsql](../../includes/tsql-md.md)]. The [!INCLUDE[ssDEnoversion](../../includes/ssdenoversion-md.md)] automatically modifies indexes whenever insert, update, or delete operations are made to the underlying data. Over time these modifications can cause the information in the index to become scattered in the database (fragmented). Fragmentation exists when indexes have pages in which the logical ordering, based on the key value, does not match the physical ordering inside the data file. Heavily fragmented indexes can degrade query performance and cause your application to respond slowly, especially scan operations.

You can remedy index fragmentation by reorganizing or rebuilding an index. For partitioned indexes built on a partition scheme, you can use either of these methods on a complete index or a single partition of an index:

- **Reorganizing an index** uses minimal system resources and is an online operation. This means long-term blocking table locks are not held and queries or updates to the underlying table can continue during the `ALTER INDEX REORGANIZE` transaction.
  - For **rowstore** indexes, it defragments the leaf level of clustered and nonclustered indexes on tables and views by physically reordering the leaf-level pages to match the logical, left to right, order of the leaf nodes. Reorganizing also compacts the index pages. Compaction is based on the existing fill factor value. To view the fill factor setting, use [sys.indexes](../../relational-databases/system-catalog-views/sys-indexes-transact-sql.md).
  - When using **columnstore** indexes, it is possible that after loading data the delta store has multiple small rowgroups. Reorganizing the columnstore index forces all of the rowgroups into the columnstore, and then combines the rowgroups into fewer rowgroups with more rows. The reorganize operation will also remove rows that have been deleted from the columnstore. Reorganizing will initially require additional CPU resources to compress the data, which could slow overall system performance. However, as soon as the data is compressed, query performance can improve.

- **Rebuilding an index** drops and re-creates the index. Depending on the type of index and [!INCLUDE[ssDE](../../includes/ssde-md.md)] version, this can be done online or offline.
  - For **rowstore** indexes, rebuilding removes fragmentation, reclaims disk space by compacting the pages based on the specified or existing fill factor setting, and reorders the index rows in contiguous pages. When `ALL` is specified, all indexes on the table are dropped and rebuilt in a single transaction. Foreign key constraints do not have to be dropped in advance. When indexes with 128 extents or more are rebuilt, the [!INCLUDE[ssDE](../../includes/ssde-md.md)] defers the actual page deallocations, and their associated locks, until after the transaction commits.
  - For **columnstore** indexes, rebuilding removes fragmentation, moves all rows into the columnstore, and reclaims disk space by physically deleting rows that have been logically deleted from the table. Starting with [!INCLUDE[ssSQL15](../../includes/sssql15-md.md)], rebuilding the columnstore index is usually not needed since `REORGANIZE` performs the essentials of a rebuild in the background as an online operation.

In earlier versions of [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)], you could sometimes rebuild a rowstore nonclustered index to correct inconsistencies caused by hardware failures.
Starting with [!INCLUDE[ssKatmai](../../includes/sskatmai-md.md)], you may still be able to repair such inconsistencies between the index and the clustered index by rebuilding a nonclustered index offline. However, you cannot repair nonclustered index inconsistencies by rebuilding the index online, because the online rebuild mechanism will use the existing nonclustered index as the basis for the rebuild and thus persist the inconsistency. Rebuilding the index offline can sometimes force a scan of the clustered index (or heap) and so remove the inconsistency. To assure a rebuild from the clustered index, drop and recreate the nonclustered index. As with earlier versions, we recommend recovering from inconsistencies by restoring the affected data from a backup; however, you may be able to repair the index inconsistencies by rebuilding the nonclustered index offline. For more information, see [DBCC CHECKDB &#40;Transact-SQL&#41;](../../t-sql/database-console-commands/dbcc-checkdb-transact-sql.md).

## <a name="Fragmentation"></a> Detecting fragmentation

The first step in deciding which defragmentation method to use is to analyze the index to determine the degree of fragmentation.

### Detecting fragmentation on rowstore indexes

By using the system function [sys.dm_db_index_physical_stats](../../relational-databases/system-dynamic-management-views/sys-dm-db-index-physical-stats-transact-sql.md), you can detect fragmentation in a specific index, all indexes on a table or indexed view, all indexes in a database, or all indexes in all databases. For partitioned indexes, **sys.dm_db_index_physical_stats** also provides fragmentation information for each partition.

The result set returned by the **sys.dm_db_index_physical_stats** function includes the following columns:

|Column|Description|
|------------|-----------------|
|**avg_fragmentation_in_percent**|The percent of logical fragmentation (out-of-order pages in the index).|
|**fragment_count**|The number of fragments (physically consecutive leaf pages) in the index.|
|**avg_fragment_size_in_pages**|Average number of pages in one fragment in an index.|

After the degree of fragmentation is known, use the following table to determine the best method to correct the fragmentation.

|**avg_fragmentation_in_percent** value|Corrective statement|
|-----------------------------------------------|--------------------------|
|> 5% and < = 30%|ALTER INDEX REORGANIZE|
|> 30%|ALTER INDEX REBUILD WITH (ONLINE = ON) <sup>1</sup>|

<sup>1</sup> Rebuilding an index can be executed online or offline. Reorganizing an index is always executed online. To achieve availability similar to the reorganize option, you should rebuild indexes online. For more information, see [Perform Index Operations Online](../../relational-databases/indexes/perform-index-operations-online.md).

> [!TIP]
> These values provide a rough guideline for determining the point at which you should switch between `ALTER INDEX REORGANIZE` and `ALTER INDEX REBUILD`. However, the actual values may vary from case to case. It is important that you experiment to determine the best threshold for your environment. For example, if a given index is used mainly for scan operations, removing fragmentation can improve performance of these operations. The performance benefit is less noticeable for indexes that are used primarily for seek operations. Similarly, removing fragmentation in a heap (a table with no clustered index) is especially useful for nonclustered index scan operations, but has little effect in lookup operations.

Very low levels of fragmentation (less than 5 percent) should typically not be addressed by either of these commands, because the benefit from removing such a small amount of fragmentation is almost always vastly outweighed by the cost of reorganizing or rebuilding the index. For more information about `ALTER INDEX REORGANIZE` and `ALTER INDEX REBUILD`, refer to [ALTER INDEX &#40;Transact-SQL&#41;](../../t-sql/statements/alter-index-transact-sql.md).

> [!NOTE]
> Rebuilding or reorganizing small rowstore indexes often does not reduce fragmentation. The pages of small indexes are sometimes stored on mixed extents. Mixed extents are shared by up to eight objects, so the fragmentation in a small index might not be reduced after reorganizing or rebuilding it.

### Detecting fragmentation on columnstore indexes

By using the DMV [sys.dm_db_column_store_row_group_physical_stats](../../relational-databases/system-dynamic-management-views/sys-dm-db-column-store-row-group-physical-stats-transact-sql.md) you can determine the percentage of deleted rows, which is a good measure for the fragmentation in a rowgroup. Use this information to compute the fragmentation in a specific index, all indexes on a table, all indexes in a database, or all indexes in all databases.

The result set returned by the **sys.dm_db_column_store_row_group_physical_stats** DMV includes the following columns:

|Column|Description|
|------------|-----------------|
|**total_rows**|Number of rows physical stored in the row group. For compressed row groups, this includes the rows that are marked deleted.|
|**deleted_rows**|Number of rows physically stored in a compressed row group that are marked for deletion. 0 for row groups that are in the delta store.|

This can be used to compute the fragmentation using the formula `100*(ISNULL(deleted_rows,0))/NULLIF(total_rows,0)`. After the degree of fragmentation is known, use the following table to determine the best method to correct the fragmentation.

|**computed fragmentation in percent** value|Applies to version|Corrective statement|
|-----------------------------------------------|--------------------------|--------------------------|
|> = 20%|[!INCLUDE[ssSQL11](../../includes/sssql11-md.md)] and [!INCLUDE[ssSQL14](../../includes/sssql14-md.md)]|ALTER INDEX REBUILD|
|> = 20%|Starting with [!INCLUDE[ssSQL15](../../includes/sssql15-md.md)]|ALTER INDEX REORGANIZE|

## Index defragmentation considerations

Under certain conditions, rebuilding a clustered index will automatically rebuild any nonclustered index that reference the clustering key, if the physical or logical identifiers contained in the nonclustered index records need to change.

Scenarios that force all rowstore nonclustered indexes to be automatically rebuilt on a table:

- Creating a clustered index on a table
- Removing a clustered index, causing the table to be stored as a heap
- Changing the clustering key to include or exclude columns

Scenarios that do not require all rowstore nonclustered indexes to be automatically rebuilt on a table:

- Rebuilding a unique clustered index
- Rebuilding a non-unique clustered index
- Changing the index schema, such as applying a partitioning scheme to a clustered index or moving the clustered index to a different filegroup

> [!IMPORTANT]
> An index cannot be reorganized or rebuilt if the filegroup in which it is located is offline or set to read-only. When the keyword ALL is specified and one or more indexes are in an offline or read-only filegroup, the statement fails.
>
> While an index rebuild occurs, the physical media must have enough space to store two copies of the index. When the rebuild is finished, [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)] deletes the original index.

When `ALL` is specified with the `ALTER INDEX` statement, relational indexes, both clustered and nonclustered, and XML indexes on the table are reorganized.

### Considerations specific to rebuilding a columnstore index

When rebuilding a columnstore index, the [!INCLUDE[ssde_md](../../includes/ssde_md.md)] reads all data from the original columnstore index, including the delta store. It combines the data into new rowgroups, and compresses the rowgroups into the columnstore. The [!INCLUDE[ssde_md](../../includes/ssde_md.md)] defragments the columnstore by physically deleting rows that have been logically deleted from the table; the deleted bytes are reclaimed on the disk.

Rebuild a partition instead of the entire table:

- Rebuilding the entire table takes a long time if the index is large, and it requires enough disk space to store an additional copy of the index during the rebuild. Usually it is only necessary to rebuild the most recently used partition.
- For partitioned tables, you do not need to rebuild the entire columnstore index because fragmentation is likely to occur in only the partitions that have been modified recently. Fact tables and large dimension tables are usually partitioned in order to perform backup and management operations on chunks of the table.

Rebuild a partition after heavy DML operations:

- Rebuilding a partition will defragment the partition and reduce disk storage. Rebuilding will delete all rows from the columnstore that are marked for deletion, and it will move all rowgroups from the delta store into the columnstore. Note, there can be multiple rowgroups in the delta store that have less than one million rows.

Rebuild a partition after loading data:

- This ensures all data is stored in the columnstore. When concurrent processes each load less than 100,000 rows into the same partition at the same time, the partition can end up with multiple delta stores. Rebuilding will move all delta store rows into the columnstore.

### Considerations specific to reorganizing a columnstore index

When reorganizing a columnstore index, the [!INCLUDE[ssde_md](../../includes/ssde_md.md)] compresses each CLOSED delta rowgroup into the columnstore as a compressed rowgroup. Starting with [!INCLUDE[ssSQL15](../../includes/sssql15-md.md)] and in [!INCLUDE[ssSDSfull](../../includes/sssdsfull-md.md)], the `REORGANIZE` command performs the following additional defragmentation optimizations online:

- Physically removes rows from a rowgroup when 10% or more of the rows have been logically deleted. The deleted bytes are reclaimed on the physical media. For example, if a compressed row group of 1 million rows has 100K rows deleted, SQL Server will remove the deleted rows and recompress the rowgroup with 900k rows. It saves on the storage by removing deleted rows.

- Combines one or more compressed rowgroups to increase rows per rowgroup up to the maximum of 1,024,576 rows. For example, if you bulk import 5 batches of 102,400 rows you will get 5 compressed rowgroups. If you run REORGANIZE, these rowgroups will get merged into 1 compressed rowgroup of size 512,000 rows. This assumes there were no dictionary size or memory limitations.
- For rowgroups in which 10% or more of the rows have been logically deleted, the [!INCLUDE[ssde_md](../../includes/ssde_md.md)] will try to combine this rowgroup with one or more rowgroups. For example, rowgroup 1 is compressed with 500,000 rows and rowgroup 21 is compressed with the maximum of 1,048,576 rows. Rowgroup 21 has 60% of the rows deleted which leaves 409,830 rows. The [!INCLUDE[ssde_md](../../includes/ssde_md.md)] favors combining these two rowgroups to compress a new rowgroup that has 909,830 rows.

After performing data loads, you can have multiple small rowgroups in the delta store. You can use `ALTER INDEX REORGANIZE` to force all of the rowgroups into the columnstore, and then to combine the rowgroups into fewer rowgroups with more rows. The reorganize operation will also remove rows that have been deleted from the columnstore.

## <a name="Restrictions"></a> Limitations and restrictions

Rowstore indexes with more than 128 extents are rebuilt in two separate phases: logical and physical. In the logical phase, the existing allocation units used by the index are marked for deallocation, the data rows are copied and sorted, then moved to new allocation units created to store the rebuilt index. In the physical phase, the allocation units previously marked for deallocation are physically dropped in short transactions that happen in the background, and do not require many locks. For more information about extents, refer to the [Pages and Extents Architecture Guide](../../relational-databases/pages-and-extents-architecture-guide.md).

The `ALTER INDEX REORGANIZE` statement requires the data file containing the index to have space available, because the operation can only allocate temporary work pages on the same file, not another file within the filegroup. So although the filegroup might have free pages available, the user can still encounter error 1105: `Could not allocate space for object '###' in database '###' because the '###' filegroup is full. Create disk space by deleting unneeded files, dropping objects in the filegroup, adding additional files to the filegroup, or setting autogrowth on for existing files in the filegroup.`

> [!WARNING]
> Creating and rebuilding nonaligned indexes on a table with more than 1,000 partitions is possible, but is not supported. Doing so may cause degraded performance or excessive memory consumption during these operations. Microsoft recommends using only aligned indexes when the number of partitions exceed 1,000.

An index cannot be reorganized or rebuilt if the filegroup in which it is located is **offline** or set to **read-only**. When the keyword `ALL` is specified and one or more indexes are in an offline or read-only filegroup, the statement fails.

When an index is **created** or **rebuilt** in [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)], statistics are created or updated by scanning all the rows in the table. However, starting with [!INCLUDE[ssSQL11](../../includes/sssql11-md.md)], statistics are not created or updated by scanning all the rows in the table when a partitioned index is created or rebuilt. Instead, the Query Optimizer uses the default sampling algorithm to generate these statistics. To obtain statistics on partitioned indexes by scanning all the rows in the table, use `CREATE STATISTICS` or `UPDATE STATISTICS` with the `FULLSCAN` clause.

When an index is **reorganized** in [!INCLUDE[ssNoVersion](../../includes/ssnoversion-md.md)], statistics are not updated.

An index cannot be reorganized when `ALLOW_PAGE_LOCKS` is set to OFF.

Up to [!INCLUDE[ssSQL17](../../includes/sssql17-md.md)], rebuilding a clustered columnstore index is an offline operation. The [!INCLUDE[ssde_md](../../includes/ssde_md.md)] has to acquire an exclusive lock on the table or partition while the rebuild occurs. The data is offline and unavailable during the rebuild even when using `NOLOCK`, Read-committed Snapshot Isolation (RCSI), or Snapshot Isolation.
Starting with [!INCLUDE[sql-server-2019](../../includes/sssqlv15-md.md)], a clustered columnstore index can be rebuilt using the `ONLINE=ON` option.

For an Azure SQL Data Warehouse table with an ordered clustered columnstore index, `ALTER INDEX REBUILD` will re-sort the data using TempDB. Monitor TempDB during rebuild operations. If you need more TempDB space, scale up the data warehouse. Scale back down once the index rebuild is complete.

For an Azure SQL Data Warehouse table with an ordered clustered columnstore index, `ALTER INDEX REORGANIZE` does not re-sort the data. To resort the data use `ALTER INDEX REBUILD`.

## <a name="Security"></a> Security

### <a name="Permissions"></a> Permissions

Requires `ALTER` permission on the table or view. User must be a member of at least one of the following roles:

- **db_ddladmin** database role <sup>1</sup>
- **db_owner** database role
- **sysadmin** server role

<sup>1</sup>**db_ddladmin** database role is the [least privileged](/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models).

## <a name="SSMSProcedureFrag"></a> Check index fragmentation using [!INCLUDE[ssManStudioFull](../../includes/ssmanstudiofull-md.md)]

> [!NOTE]
> [!INCLUDE[ssManStudio](../../includes/ssManStudio-md.md)] cannot be used to compute fragmentation of columnstore indexes in SQL Server and cannot be used to compute fragmentation of any indexes in Azure SQL Database. Use the [!INCLUDE[tsql](../../includes/tsql-md.md)] example [below](#TsqlProcedureFrag).

1. In Object Explorer, Expand the database that contains the table on which you want to check an index's fragmentation.
2. Expand the **Tables** folder.
3. Expand the table on which you want to check an index's fragmentation.
4. Expand the **Indexes** folder.
5. Right-click the index of which you want to check the fragmentation and select **Properties**.
6. Under **Select a page**, select **Fragmentation**.

The following information is available on the **Fragmentation** page:

|Value|Description|
|---|---|
|**Page fullness**|Indicates average fullness of the index pages, as a percentage. 100% means the index pages are completely full. 50% means that, on average, each index page is half full.|
|**Total fragmentation**|The logical fragmentation percentage. This indicates the number of pages in an index that are not stored in order.|
|**Average row size**|The average size of a leaf-level row.|
|**Depth**|The number of levels in the index, including the leaf-level.|
|**Forwarded records**|The number of records in a heap that have forward pointers to another data location. (This state occurs during an update, when there is not enough room to store the new row in the original location.)|
|**Ghost rows**|The number of rows that are marked as deleted but not yet removed. These rows will be removed by a clean-up thread, when the server is not busy. This value does not include rows that are being retained due to an outstanding snapshot isolation transaction.|
|**Index type**|The type of index. Possible values are **Clustered index**, **Nonclustered index**, and **Primary XML**. Tables can also be stored as a heap (without indexes), but then this Index Properties page cannot be opened.|
|**Leaf-level rows**|The number of leaf-level rows.|
|**Maximum row size**|The maximum leaf-level row size.|
|**Minimum row size**|The minimum leaf-level row size.|
|**Pages**|The total number of data pages.|
|**Partition ID**|The partition ID of the b-tree containing the index.|
|**Version ghost rows**|The number of ghost records that are being retained due to an outstanding snapshot isolation transaction.|

## <a name="TsqlProcedureFrag"></a> Check index fragmentation using [!INCLUDE[tsql](../../includes/tsql-md.md)]

### To check the fragmentation of a rowstore index

The following example finds the average fragmentation percentage of all indexes in the `HumanResources.Employee` table in the `AdventureWorks2016` database.

```sql
SELECT a.object_id, object_name(a.object_id) AS TableName,
    a.index_id, name AS IndedxName, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats
    (DB_ID (N'AdventureWorks2016_EXT')
        , OBJECT_ID(N'HumanResources.Employee')
        , NULL
        , NULL
        , NULL) AS a
INNER JOIN sys.indexes AS b
    ON a.object_id = b.object_id
    AND a.index_id = b.index_id;
GO
```

The previous statement returns a result set similar to the following.

```
object_id   TableName    index_id    IndexName                                             avg_fragmentation_in_percent
----------- ------------ ----------- ----------------------------------------------------- ------------------------------
1557580587  Employee     1           PK_Employee_BusinessEntityID                          0
1557580587  Employee     2           IX_Employee_OrganizationalNode                        0
1557580587  Employee     3           IX_Employee_OrganizationalLevel_OrganizationalNode    0
1557580587  Employee     5           AK_Employee_LoginID                                   66.6666666666667
1557580587  Employee     6           AK_Employee_NationalIDNumber                          50
1557580587  Employee     7           AK_Employee_rowguid                                   0

(6 row(s) affected)
```

For more information, see [sys.dm_db_index_physical_stats](../../relational-databases/system-dynamic-management-views/sys-dm-db-index-physical-stats-transact-sql.md).

### To check the fragmentation of a columnstore index

The following example finds the average fragmentation percentage of all indexes in the `dbo.FactResellerSalesXL_CCI` table in the `AdventureWorksDW2016` database.

```sql
SELECT i.object_id,
    object_name(i.object_id) AS TableName,
    i.index_id,
    i.name AS IndexName,
    100*(ISNULL(SUM(CSRowGroups.deleted_rows),0))/NULLIF(SUM(CSRowGroups.total_rows),0) AS 'Fragmentation'
FROM sys.indexes AS i  
INNER JOIN sys.dm_db_column_store_row_group_physical_stats AS CSRowGroups
    ON i.object_id = CSRowGroups.object_id
    AND i.index_id = CSRowGroups.index_id
WHERE object_name(i.object_id) = 'FactResellerSalesXL_CCI'
GROUP BY i.object_id, i.index_id, i.name
ORDER BY object_name(i.object_id), i.name;
```

The previous statement returns a result set similar to the following.

```
object_id   TableName                   index_id    IndexName                       Fragmentation
----------- --------------------------- ----------- ------------------------------- ---------------
114099447   FactResellerSalesXL_CCI     1           IndFactResellerSalesXL_CCI      0

(1 row(s) affected)
```

## <a name="SSMSProcedureReorg"></a> Remove fragmentation using [!INCLUDE[ssManStudioFull](../../includes/ssmanstudiofull-md.md)]

### To reorganize or rebuild an index

1. In Object Explorer, Expand the database that contains the table on which you want to reorganize an index.
2. Expand the **Tables** folder.
3. Expand the table on which you want to reorganize an index.
4. Expand the **Indexes** folder.
5. Right-click the index you want to reorganize and select **Reorganize**.
6. In the **Reorganize Indexes** dialog box, verify that the correct index is in the **Indexes to be reorganized** grid and click **OK**.
7. Select the **Compact large object column data** check box to specify that all pages that contain large object (LOB) data are also compacted.
8. Click **OK.**

> [!NOTE]
> Reorganizing a columnstore index using [!INCLUDE[ssManStudio](../../includes/ssManStudio-md.md)] will combine `COMPRESSED` rowgroups together, but does not force all rowgroups to be compressed into the columnstore. CLOSED rowgroups will be compressed but OPEN rowgroups will not be compressed into the columnstore. To compress all rowgroups, use the [!INCLUDE[tsql](../../includes/tsql-md.md)] example [below](#TsqlProcedureReorg).

### To reorganize all indexes in a table

1. In Object Explorer, Expand the database that contains the table on which you want to reorganize the indexes.
2. Expand the **Tables** folder.
3. Expand the table on which you want to reorganize the indexes.
4. Right-click the **Indexes** folder and select **Reorganize All**.
5. In the **Reorganize Indexes** dialog box, verify that the correct indexes are in the **Indexes to be reorganized**. To remove an index from the **Indexes to be reorganized** grid, select the index and then press the Delete key.
6. Select the **Compact large object column data** check box to specify that all pages that contain large object (LOB) data are also compacted.
7. Click **OK.**

### To rebuild an index

1. In Object Explorer, Expand the database that contains the table on which you want to reorganize an index.
2. Expand the **Tables** folder.
3. Expand the table on which you want to reorganize an index.
4. Expand the **Indexes** folder.
5. Right-click the index you want to reorganize and select **Rebuild**.
6. In the **Rebuild Indexes** dialog box, verify that the correct index is in the **Indexes to be rebuilt** grid and click **OK**.
7. Select the **Compact large object column data** check box to specify that all pages that contain large object (LOB) data are also compacted.
8. Click **OK.**

## <a name="TsqlProcedureReorg"></a> Remove fragmentation using [!INCLUDE[tsql](../../includes/tsql-md.md)]

> [!NOTE]
> For more examples about using [!INCLUDE[tsql](../../includes/tsql-md.md)] to rebuild or reorganize indexes, see [ALTER INDEX Examples: Columnstore Indexes](../../t-sql/statements/alter-index-transact-sql.md#examples-columnstore-indexes) and [ALTER INDEX Examples: Rowstore Indexes](../../t-sql/statements/alter-index-transact-sql.md#examples-rowstore-indexes).

### To reorganize a fragmented index

The following example reorganizes the `IX_Employee_OrganizationalLevel_OrganizationalNode` index on the `HumanResources.Employee` table in the `AdventureWorks2016` database.

```sql
ALTER INDEX IX_Employee_OrganizationalLevel_OrganizationalNode
    ON HumanResources.Employee
    REORGANIZE;
```

The following example reorganizes the `IndFactResellerSalesXL_CCI` columnstore index on the `dbo.FactResellerSalesXL_CCI` table in the `AdventureWorksDW2016` database.

```sql
-- This command will force all CLOSED and OPEN rowgroups into the columnstore.
ALTER INDEX IndFactResellerSalesXL_CCI
    ON FactResellerSalesXL_CCI
    REORGANIZE WITH (COMPRESS_ALL_ROW_GROUPS = ON);
```

### To reorganize all indexes in a table

The following example reorganizes all indexes on the `HumanResources.Employee` table in the `AdventureWorks2016` database.

```sql
ALTER INDEX ALL ON HumanResources.Employee
   REORGANIZE;
```

### To rebuild a fragmented index

The following example rebuilds a single index on the `Employee` table in the `AdventureWorks2016` database.

[!code-sql[IndexDDL#AlterIndex1](../../relational-databases/indexes/codesnippet/tsql/reorganize-and-rebuild-i_1.sql)]

### To rebuild all indexes in a table

The following example rebuilds all indexes associated with the table in the `AdventureWorks2016` database using the `ALL` keyword. Three options are specified.

[!code-sql[IndexDDL#AlterIndex2](../../relational-databases/indexes/codesnippet/tsql/reorganize-and-rebuild-i_2.sql)]

For more information, see [ALTER INDEX &#40;Transact-SQL&#41;](../../t-sql/statements/alter-index-transact-sql.md).

### Automatic index and statistics management

Leverage solutions such as [Adaptive Index Defrag](https://github.com/Microsoft/tigertoolbox/tree/master/AdaptiveIndexDefrag) to automatically manage index defragmentation and statistics updates for one or more databases. This procedure automatically chooses whether to rebuild or reorganize an index according to its fragmentation level, amongst other parameters, and update statistics with a linear threshold.

## See also

- [SQL Server Index Architecture and Design Guide](../../relational-databases/sql-server-index-design-guide.md)
- [Perform Index Operations Online](../../relational-databases/indexes/perform-index-operations-online.md)
- [ALTER INDEX &#40;Transact-SQL&#41;](../../t-sql/statements/alter-index-transact-sql.md)
- [Adaptive Index Defrag](https://github.com/Microsoft/tigertoolbox/tree/master/AdaptiveIndexDefrag)
- [CREATE STATISTICS &#40;Transact-SQL&#41;](../../t-sql/statements/create-statistics-transact-sql.md)
- [UPDATE STATISTICS &#40;Transact-SQL&#41;](../../t-sql/statements/update-statistics-transact-sql.md)
- [Columnstore Indexes Query Performance](../../relational-databases/indexes/columnstore-indexes-query-performance.md)
- [Get started with Columnstore for real-time operational analytics](../../relational-databases/indexes/get-started-with-columnstore-for-real-time-operational-analytics.md)
- [Columnstore Indexes for Data Warehousing](../../relational-databases/indexes/columnstore-indexes-data-warehouse.md)
