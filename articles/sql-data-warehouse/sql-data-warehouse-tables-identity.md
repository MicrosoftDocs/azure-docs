---
title: Managing statistics on tables in SQL Data Warehouse | Microsoft Docs
description: Getting started with statistics on tables in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.assetid: faa1034d-314c-4f9d-af81-f5a9aedf33e4
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 03/11/2017
ms.author: jrj;barbkess

---
# Creating surrogate keys in SQL Data Warehouse
> [!div class="op_single_selector"]
> * [Overview][Overview]
> * [Data Types][Data Types]
> * [Distribute][Distribute]
> * [Index][Index]
> * [Partition][Partition]
> * [Statistics][Statistics]
> * [Temporary][Temporary]
> * [Identity][Identity]
> 
> 

Many data modelers like to create surrogate keys on their tables when designing data warehouse models. You can use the IDENTITY property to achieve this goal simply and effectively without impacting load performance. 

## Getting started with Identity
You can define a table as having the IDENTITY property when you first create the table using syntax that is similar to the statement below:

```sql
CREATE TABLE dbo.T1
(	C1 INT IDENTITY(1,1)
,	C2 INT
)
WITH
(   DISTRIBUTION = HASH(C2)
,   CLUSTERED COLUMNSTORE INDEX
)
;
```

From here you can use `INSERT..SELECT` to populate the table.

## Behavior

### Allocation of values

### SELECT..INTO
When an existing identity column is selected into a new table, the new column inherits the IDENTITY property, unless one of the following conditions is true:
- The SELECT statement contains a join
- Multiple SELECT statements are joined by using UNION
- The identity column is listed more than one time in the select list
- The identity column is part of an expression
	
If any one of these conditions is true, the column is created NOT NULL instead of inheriting the IDENTITY property

### CREATE TABLE AS SELECT (CTAS)
CTAS follows the same SQL Server behavior that has been documented for SELECT..INTO. However, you cannot specify an IDENTITY property in column definition of the `CREATE TABLE` part of the statement itself. You also cannot use the IDENTITY function in the `SELECT` part of the CTAS either. To populate a table you would need to use `CREATE TABLE` to define the table followed by `INSERT..SELECT` to populate it.

## IDENTITY_INSERT


## Catalog Views
SQL Data Warehouse supports the `sys.identity_columns` catalog view which can be used to identify a column as having the IDENTITY property.

An example of how to integrate `sys.identity_columns` with other system catalog views to help you better understand the database schema.

```sql
SELECT  sm.name
,       tb.name
,       co.name
,       CASE WHEN ic.column_id IS NOT NULL
             THEN 1
        ELSE 0
        END AS is_identity 
FROM        sys.schemas AS sm
JOIN        sys.tables  AS tb           ON  sm.schema_id = tb.schema_id
JOIN        sys.columns AS co           ON  tb.object_id = co.object_id
LEFT JOIN   sys.identity_columns AS ic  ON  co.object_id = ic.object_id
                                        AND co.column_id = ic.column_id
WHERE   sm.name = 'dbo'
AND     tb.name = 'T1'
;
```

## Skewed data


## Limitations
IDENTITY property cannot be used in the following scenarios:
- where the column data type is not INT or BIGINT
- where the column is also the distribution key
- where the table is an external table 

The following related functions are not supported in SQL Data Warehouse:
- IDENTITY()
- @@IDENTITY
- SCOPE_IDENTITY
- IDENT_CURRENT
- IDENT_INCR
- IDENT_SEED
- DBCC CHECK_IDENT()

## Tasks


## Next steps

To learn more about developing tables, see the articles on [Table Overview][Overview], [Table Data Types][Data Types], [Distributing a Table][Distribute], [Indexing a Table][Index],  [Partitioning a Table][Partition] and [Temporary Tables][Temporary].  For more about best practices, see [SQL Data Warehouse Best Practices][SQL Data Warehouse Best Practices].  

<!--Image references-->

<!--Article references-->
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[Identity]: ./sql-data-warehouse-tables-identity.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md

<!--MSDN references-->
[Identity property]: https://msdn.microsoft.com/en-us/library/ms186775.aspx
[sys.identity_columns]: https://msdn.microsoft.com/en-us/library/ms187334.aspx
[Identity function]: https://msdn.microsoft.com/en-us/library/ms189838.aspx
[@@IDENTITY]: https://msdn.microsoft.com/en-us/library/ms187342.aspx
[SCOPE_IDENTITY]: https://msdn.microsoft.com/en-us/library/ms190315.aspx
[IDENT_CURRENT]: https://msdn.microsoft.com/en-us/library/ms175098.aspx
[IDENT_INCR]: https://msdn.microsoft.com/en-us/library/ms189795.aspx
[IDENT_SEED]: https://msdn.microsoft.com/en-us/library/ms189834.aspx
[DBCC CHECK_IDENT()]: https://msdn.microsoft.com/en-us/library/ms176057.aspx
  

<!--Other Web references-->  
