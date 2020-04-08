---
title: OFFSET LIMIT clause in Azure Cosmos DB
description: Learn how to use the OFFSET LIMIT clause to skip and take some certain values when querying in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: mjbrown

---
# OFFSET LIMIT clause in Azure Cosmos DB

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
  
  Both the `OFFSET` count and the `LIMIT` count are required in the `OFFSET LIMIT` clause. If an optional `ORDER BY` clause is used, the result set is produced by doing the skip over the ordered values. Otherwise, the query will return a fixed order of values.

  The RU charge of a query with `OFFSET LIMIT` will increase as the number of terms being offset increases. For queries that have multiple pages of results, we typically recommend using continuation tokens. Continuation tokens are a "bookmark" for the place where the query can later resume. If you use `OFFSET LIMIT`, there is no "bookmark". If you wanted to return the query's next page, you would have to start from the beginning.
  
  You should use `OFFSET LIMIT` for cases when you would like to skip documents entirely and save client resources. For example, you should use `OFFSET LIMIT` if you want to skip to the 1000th query result and have no need to view results 1 through 999. On the backend, `OFFSET LIMIT` still loads each document, including those that are skipped. The performance advantage is a savings in client resources by avoiding processing documents that are not needed.

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
