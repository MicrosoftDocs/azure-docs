---
title: Data loading best practices for Synapse SQL pool
description: Recommendations and performance optimizations for loading data using Synapse SQL pool.
services: synapse-analytics
author: kevinvngo 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 06/07/2020
ms.author: kevin
ms.reviewer: igorstan
ms.custom: azure-synapse
---

# Best practices for loading data using Synapse SQL pool

In this article, you'll learn recommendations and performance optimizations for loading data using SQL pool.

## Preparing data in Azure Storage

To minimize latency, colocate your storage layer and your SQL pool.

When exporting data into an ORC File Format, you might get Java out-of-memory errors when there are large text columns. To work around this limitation, export only a subset of the columns.

All file formats have different performance characteristics. For the fastest load, use compressed delimited text files. The difference between UTF-8 and UTF-16 performance is minimal.

Split large compressed files into smaller compressed files.

## Running loads with enough compute

For fastest loading speed, run only one load job at a time. If that isn't feasible, run a minimal number of loads concurrently. If you expect a large loading job, consider scaling up your SQL pool before the load.

To run loads with appropriate compute resources, create loading users designated for running loads. Classify each loading user to a specific workload group. To run a load, sign in as one of the loading users, and then run the load. The load runs with the user's workload group.  

### Example of creating a loading user

This example creates a loading user classified to a specific workload group. The first step is to **connect to master** and create a login.

```sql
   -- Connect to master
   CREATE LOGIN loader WITH PASSWORD = 'a123STRONGpassword!';
```

Connect to the SQL pool and create a user. The following code assumes you're connected to the database called mySampleDataWarehouse. It shows how to create a user called loader and gives the user permissions to create tables and load using the [COPY statement](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest). Then it classifies the user to the DataLoads workload group with maximum resources. 

```sql
   -- Connect to the SQL pool
   CREATE USER loader FOR LOGIN loader;
   GRANT ADMINISTER DATABASE BULK OPERATIONS TO loader;
   GRANT INSERT ON <yourtablename> TO loader;
   GRANT SELECT ON <yourtablename> TO loader;
   GRANT CREATE TABLE TO loader;
   GRANT ALTER ON SCHEMA::dbo TO loader;
   
   CREATE WORKLOAD GROUP DataLoads
   WITH ( 
   	  MIN_PERCENTAGE_RESOURCE = 100
       ,CAP_PERCENTAGE_RESOURCE = 100
       ,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 100
	);

   CREATE WORKLOAD CLASSIFIER [wgcELTLogin]
   WITH (
	     WORKLOAD_GROUP = 'DataLoads'
       ,MEMBERNAME = 'loader'
   );
```

To run a load with resources for the loading workload group, sign in as loader and run the load.

## Allowing multiple users to load (PolyBase)

There's often a need to have multiple users load data into a SQL pool. Loading with the [CREATE TABLE AS SELECT (Transact-SQL)](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) (PolyBase) requires CONTROL permissions of the database.  The CONTROL permission gives control access to all schemas.

You might not want all loading users to have control access on all schemas. To limit permissions, use the DENY CONTROL statement.

For example, consider database schemas, schema_A for dept A, and schema_B for dept B. Let database users user_A and user_B be users for PolyBase loading in dept A and B, respectively. They both have been granted CONTROL database permissions. The creators of schema A and B now lock down their schemas using DENY:

```sql
   DENY CONTROL ON SCHEMA :: schema_A TO user_B;
   DENY CONTROL ON SCHEMA :: schema_B TO user_A;
```

User_A and user_B are now locked out from the other dept's schema.

## Loading to a staging table

To achieve the fastest loading speed for moving data into a SQL pool table, load data into a staging table.  Define the staging table as a heap and use round-robin for the distribution option.

Consider that loading is usually a two-step process in which you first load to a staging table and then insert the data into a production SQL pool table. If the production table uses a hash distribution, the total time to load and insert might be faster if you define the staging table with the hash distribution.

Loading to the staging table takes longer, but the second step of inserting the rows to the production table does not incur data movement across the distributions.

## Loading to a columnstore index

Columnstore indexes require large amounts of memory to compress data into high-quality rowgroups. For best compression and index efficiency, the columnstore index needs to compress the maximum of 1,048,576 rows into each rowgroup.

When there is memory pressure, the columnstore index might not be able to achieve maximum compression rates. This scenario, in turn, effects query performance. For a deep dive, see [Columnstore memory optimizations](sql-data-warehouse-memory-optimizations-for-columnstore-compression.md).

- To ensure the loading user has enough memory to achieve maximum compression rates, use loading users that are a member of a medium or large resource class.
- Load enough rows to completely fill new rowgroups. During a bulk load, every 1,048,576 rows get compressed directly into the columnstore as a full rowgroup. Loads with fewer than 102,400 rows send the rows to the deltastore where rows are held in a b-tree index.

> [!NOTE]
> If you load too few rows, they might all route to the deltastore and not get compressed immediately into columnstore format.

## Increase batch size when using SqLBulkCopy API or bcp

Loading with the COPY statement will provide the highest throughput with SQL pool. If you cannot use the COPY to load and must use the [SqLBulkCopy API](/dotnet/api/system.data.sqlclient.sqlbulkcopy?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) or [bcp](/sql/tools/bcp-utility?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), you should consider increasing batch size for better throughput.

> [!TIP]
> A batch size between 100 K to 1M rows is the recommended baseline for determining optimal batch size capacity.

## Handling loading failures

A load using an external table can fail with the error *"Query aborted-- the maximum reject threshold was reached while reading from an external source"*. This message indicates that your external data contains dirty records.

A data record is considered to be dirty if it meets one of the following conditions:

- The data types and number of columns do not match the column definitions of the external table.
- The data doesn't conform to the specified external file format.

To fix the dirty records, ensure that your external table and external file format definitions are correct and your external data conforms to these definitions.

If a subset of external data records are dirty, you can choose to reject these records for your queries by using the reject options in [CREATE EXTERNAL TABLE (Transact-SQL)](/sql/t-sql/statements/create-external-table-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Inserting data into a production table

A one-time load to a small table with an [INSERT statement](/sql/t-sql/statements/insert-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest), or even a periodic reload of a look-up might perform good enough with a statement like `INSERT INTO MyLookup VALUES (1, 'Type 1')`.  However, singleton inserts are not as efficient as performing a bulk load.

If you have thousands or more single inserts throughout the day, batch the inserts so you can bulk load them.  Develop your processes to append the single inserts to a file, and then create another process that periodically loads the file.

## Creating statistics after the load

To improve query performance, it's important to create statistics on all columns of all tables after the first load, or substantial changes occur in the data. Creating statistics can be done manually or you can enable [AUTO_CREATE_STATISTICS](sql-data-warehouse-tables-statistics.md#automatic-creation-of-statistic).

For a detailed explanation of statistics, see [Statistics](sql-data-warehouse-tables-statistics.md). The following example shows how to manually create statistics on five columns of the Customer_Speed table.

```sql
create statistics [SensorKey] on [Customer_Speed] ([SensorKey]);
create statistics [CustomerKey] on [Customer_Speed] ([CustomerKey]);
create statistics [GeographyKey] on [Customer_Speed] ([GeographyKey]);
create statistics [Speed] on [Customer_Speed] ([Speed]);
create statistics [YearMeasured] on [Customer_Speed] ([YearMeasured]);
```

## Rotate storage keys (PolyBase)

It is good security practice to change the access key to your blob storage on a regular basis. You have two storage keys for your blob storage account, which enables you to transition the keys.

To rotate Azure Storage account keys:

For each storage account whose key has changed, issue [ALTER DATABASE SCOPED CREDENTIAL](/sql/t-sql/statements/alter-database-scoped-credential-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

Example:

Original key is created

```sql
CREATE DATABASE SCOPED CREDENTIAL my_credential WITH IDENTITY = 'my_identity', SECRET = 'key1'
```

Rotate key from key 1 to key 2

```sql
ALTER DATABASE SCOPED CREDENTIAL my_credential WITH IDENTITY = 'my_identity', SECRET = 'key2'
```

No other changes to underlying external data sources are needed.

## Next steps

- To learn more about the COPY statement or PolyBase when designing an Extract, Load, and Transform (ELT) process, see [Design ELT for SQL Data Warehouse](design-elt-data-loading.md).
- For a loading tutorial, [Use the COPY statement to load data from Azure blob storage to Synapse SQL](load-data-from-azure-blob-storage-using-polybase.md).
- To monitor data loads, see [Monitor your workload using DMVs](sql-data-warehouse-manage-monitor.md).
