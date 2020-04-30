---
title: Primary, foreign, and unique keys  
description: Table constraints support in Synapse SQL pool in Azure Synapse Analytics
services: synapse-analytics
author: XiaoyuMSFT
manager: craigg 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 09/05/2019
ms.author: xiaoyul
ms.reviewer: nibruno; jrasnick
ms.custom: seo-lt-2019, azure-synapse
---

# Primary key, foreign key, and unique key in Synapse SQL pool

Learn about table constraints in Synapse SQL pool, including primary key, foreign key, and unique key.

## Table constraints

Synapse SQL pool supports these table constraints: 
- PRIMARY KEY is only supported when NONCLUSTERED and NOT ENFORCED are both used.    
- UNIQUE constraint is only supported with NOT ENFORCED is used.

For syntax, check [ALTER TABLE](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql) and [CREATE TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-table-azure-sql-data-warehouse). 

FOREIGN KEY constraint is not supported in Synapse SQL pool.  


## Remarks

Having primary key and/or unique key allows Synapse SQL pool engine to generate an optimal execution plan for a query.  All values in a primary key column or a unique constraint column should be unique.

After creating a table with primary key or unique constraint in Synapse SQL pool, users need to make sure all values in those columns are unique.  A violation of that may cause the query to return inaccurate result.  This example shows how a query may return inaccurate result if the primary key or unique constraint column includes duplicate values.  

```sql
 -- Create table t1
CREATE TABLE t1 (a1 INT NOT NULL, b1 INT) WITH (DISTRIBUTION = ROUND_ROBIN)

-- Insert values to table t1 with duplicate values in column a1.
INSERT INTO t1 VALUES (1, 100)
INSERT INTO t1 VALUES (1, 1000)
INSERT INTO t1 VALUES (2, 200)
INSERT INTO t1 VALUES (3, 300)
INSERT INTO t1 VALUES (4, 400)

-- Run this query.  No primary key or unique constraint.  4 rows returned. Correct result.
SELECT a1, COUNT(*) AS total FROM t1 GROUP BY a1

/*
a1          total
----------- -----------
1           2
2           1
3           1
4           1

(4 rows affected)
*/

-- Add unique constraint
ALTER TABLE t1 ADD CONSTRAINT unique_t1_a1 unique (a1) NOT ENFORCED

-- Re-run this query.  5 rows returned.  Incorrect result.
SELECT a1, count(*) AS total FROM t1 GROUP BY a1

/*
a1          total
----------- -----------
2           1
4           1
1           1
3           1
1           1

(5 rows affected)
*/

-- Drop unique constraint.
ALTER TABLE t1 DROP CONSTRAINT unique_t1_a1

-- Add primary key constraint
ALTER TABLE t1 add CONSTRAINT PK_t1_a1 PRIMARY KEY NONCLUSTERED (a1) NOT ENFORCED

-- Re-run this query.  5 rows returned.  Incorrect result.
SELECT a1, COUNT(*) AS total FROM t1 GROUP BY a1

/*
a1          total
----------- -----------
2           1
4           1
1           1
3           1
1           1

(5 rows affected)
*/

-- Manually fix the duplicate values in a1
UPDATE t1 SET a1 = 0 WHERE b1 = 1000

-- Verify no duplicate values in column a1 
SELECT * FROM t1

/*
a1          b1
----------- -----------
2           200
3           300
4           400
0           1000
1           100

(5 rows affected)
*/

-- Add unique constraint
ALTER TABLE t1 add CONSTRAINT unique_t1_a1 UNIQUE (a1) NOT ENFORCED  

-- Re-run this query.  5 rows returned.  Correct result.
SELECT a1, COUNT(*) as total FROM t1 GROUP BY a1

/*
a1          total
----------- -----------
2           1
3           1
4           1
0           1
1           1

(5 rows affected)
*/

-- Drop unique constraint.
ALTER TABLE t1 DROP CONSTRAINT unique_t1_a1

-- Add primary key contraint
ALTER TABLE t1 ADD CONSTRAINT PK_t1_a1 PRIMARY KEY NONCLUSTERED (a1) NOT ENFORCED

-- Re-run this query.  5 rows returned.  Correct result.
SELECT a1, COUNT(*) AS total FROM t1 GROUP BY a1

/*
a1          total
----------- -----------
2           1
3           1
4           1
0           1
1           1

(5 rows affected)
*/

```

## Examples

Create a Synapse SQL pool table with a primary key: 

```sql 
CREATE TABLE mytable (c1 INT PRIMARY KEY NONCLUSTERED NOT ENFORCED, c2 INT);
```
Create a Synapse SQL pool table with a unique constraint:

```sql
CREATE TABLE t6 (c1 INT UNIQUE NOT ENFORCED, c2 INT);
```

## Next steps

After creating the tables for your Synapse SQL pool, the next step is to load data into the table. For a loading tutorial, see [Loading data to Synapse SQL pool](load-data-wideworldimportersdw.md).
