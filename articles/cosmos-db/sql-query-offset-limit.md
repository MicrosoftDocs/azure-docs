---
title: OFFSET LIMIT clause in Azure Cosmos DB
description: Learn about the OFFSET LIMIT clause for Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: mjbrown

---
# OFFSET LIMIT clause

The OFFSET LIMIT clause is an optional clause to skip then take some number of values from the query. The OFFSET count and the LIMIT count are required in the OFFSET LIMIT clause.

When OFFSET LIMIT is used in conjunction with an ORDER BY clause, the result set is produced by doing skip and take on the ordered values. If no ORDER BY clause is used, it will result in a deterministic order of values.

## Syntax
  
```sql  
OFFSET <offset_amount> LIMIT <limit_amount>
```  
  
## Arguments

- `<offset_amount>`

   Specifies the integer number of items that the query results should skip.

- `<limit_amount>`
  
   Specifies the integer number of items that the query results should include

## Remarks
  
  Both the OFFSET count and the LIMIT count are required in the OFFSET LIMIT clause. If an optional `ORDER BY` clause is used, the result set is produced by doing the skip over the ordered values. Otherwise, the query will return a fixed order of values. Currently this clause is supported for queries within a single partition only, cross-partition queries don't yet support it.

## Examples

For example, here's a query that skips the first value and returns the second value (in order of the resident city's name):

```sql
    SELECT f.id, f.address.city
    FROM Families f
    ORDER BY f.address.city
    OFFSET 1 LIMIT 1
```

The results are:

```json
    [
      {
        "id": "AndersenFamily",
        "city": "Seattle"
      }
    ]
```

Here's a query that skips the first value and returns the second value (without ordering):

```sql
   SELECT f.id, f.address.city
    FROM Families f
    OFFSET 1 LIMIT 1
```

The results are:

```json
    [
      {
        "id": "WakefieldFamily",
        "city": "Seattle"
      }
    ]
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [ORDER BY clause](sql-query-order-by.md)
