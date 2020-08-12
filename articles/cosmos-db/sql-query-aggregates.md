---
title: Aggregate functions in Azure Cosmos DB
description: Learn about SQL aggregate function syntax, types of aggregate functions supported by Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: tisande

---
# Aggregate functions in Azure Cosmos DB

Aggregate functions perform a calculation on a set of values in the `SELECT` clause and return a single value. For example, the following query returns the count of items within the `Families` container:

## Examples

```sql
    SELECT COUNT(1)
    FROM Families f
```

The results are:

```json
    [{
        "$1": 2
    }]
```

You can also return only the scalar value of the aggregate by using the VALUE keyword. For example, the following query returns the count of values as a single number:

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
```

The results are:

```json
    [ 2 ]
```

You can also combine aggregations with filters. For example, the following query returns the count of items with the address state of `WA`.

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
    WHERE f.address.state = "WA"
```

The results are:

```json
    [ 1 ]
```

## Types of aggregate functions

The SQL API supports the following aggregate functions. `SUM` and `AVG` operate on numeric values, and `COUNT`, `MIN`, and `MAX` work on numbers, strings, Booleans, and nulls.

| Function | Description |
|-------|-------------|
| COUNT | Returns the number of items in the expression. |
| SUM   | Returns the sum of all the values in the expression. |
| MIN   | Returns the minimum value in the expression. |
| MAX   | Returns the maximum value in the expression. |
| AVG   | Returns the average of the values in the expression. |

You can also aggregate over the results of an array iteration.

> [!NOTE]
> In the Azure portal's Data Explorer, aggregation queries may aggregate partial results over only one query page. The SDK produces a single cumulative value across all pages. To perform aggregation queries using code, you need .NET SDK 1.12.0, .NET Core SDK 1.1.0, or Java SDK 1.9.5 or above.

## Remarks

These aggregate system functions will benefit from a [range index](index-policy.md#includeexclude-strategy). If you expect to do a `COUNT`, `SUM`, `MIN`, `MAX`, or `AVG` on a property, you should [include the relevant path in the indexing policy](index-policy.md#includeexclude-strategy).

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [System functions](sql-query-system-functions.md)
- [User defined functions](sql-query-udfs.md)