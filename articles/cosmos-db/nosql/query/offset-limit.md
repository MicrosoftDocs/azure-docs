---
title: OFFSET LIMIT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that skips and takes a specified number of results.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# OFFSET LIMIT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The ``OFFSET LIMIT`` clause is an optional clause to **skip** and then **take** some number of values from the query. The ``OFFSET`` count and the ``LIMIT`` count are required in the OFFSET LIMIT clause.

When ``OFFSET LIMIT`` is used with an ``ORDER BY`` clause, the result set is produced by doing skip and take on the ordered values. If no ``ORDER BY`` clause is used, it results in a deterministic order of values.

## Syntax

```sql  
OFFSET <offset_amount> LIMIT <limit_amount>
```  

## Arguments

| | Description |
| --- | --- |
| **``<offset_amount>``** | Specifies the integer number of items that the query results should skip. |
| **``<limit_amount>``** | Specifies the integer number of items that the query results should include. |

## Examples

For the example in this section, this reference set of items is used. Each item includes a ``name`` property.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/seed.json" range="1-2,4,6-7,9,11-12,14,16-17,19,21-22,24,26-27" highlight="3,6,9,12,15":::

This example includes a query using the ``OFFSET LIMIT`` clause to return a subset of the matching items by skipping **one** item and taking the next **three**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/query.sql" range="1-5,8-10" highlight="8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/result.json":::

## Remarks

- Both the ``OFFSET`` count and the ``LIMIT`` count are required in the ``OFFSET LIMIT`` clause. If an optional ``ORDER BY`` clause is used, the result set is produced by doing the skip over the ordered values. Otherwise, the query returns a fixed order of values.
- The RU charge of a query with ``OFFSET LIMIT`` increases as the number of terms being offset increases. For queries that have [multiple pages of results](pagination.md), we typically recommend using [continuation tokens](pagination.md#continuation-tokens). Continuation tokens are a "bookmark" for the place where the query can later resume. If you use ``OFFSET LIMIT``, there's no "bookmark." If you wanted to return the query's next page, you would have to start from the beginning.
- You should use ``OFFSET LIMIT`` for cases when you would like to skip items entirely and save client resources. For example, you should use ``OFFSET LIMIT`` if you want to skip to the 1000th query result and have no need to view results 1 through 999. On the backend, ``OFFSET LIMIT`` still loads each item, including those items that are skipped. The performance advantage is measured in reducing client resources by avoiding processing items that aren't needed.

## Next steps

- [``GROUP BY`` clause](group-by.md)
- [``ORDER BY`` clause](order-by.md)
