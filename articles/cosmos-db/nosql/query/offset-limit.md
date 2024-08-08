---
title: OFFSET LIMIT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL query clause with two keywords that skips and/or takes a specified number of results.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: azure-cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 07/08/2024
ms.custom: query-reference
---

# OFFSET LIMIT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The `OFFSET LIMIT` clause is an optional clause to **skip** and then **take** some number of values from the query. The `OFFSET` count and the `LIMIT` count are required in the OFFSET LIMIT clause.

When `OFFSET LIMIT` is used with an `ORDER BY` clause, the result set is produced by doing skip and take on the ordered values. If no `ORDER BY` clause is used, it results in a deterministic order of values.

## Syntax

```nosql  
OFFSET <offset_amount> LIMIT <limit_amount>
```

## Arguments

| | Description |
| --- | --- |
| **`<offset_amount>`** | Specifies the integer number of items that the query results should skip. |
| **`<limit_amount>`** | Specifies the integer number of items that the query results should include. |

## Examples

For the example in this section, this reference set of items is used. Each item includes a `name` property.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/seed.json" range="1-2,4-7,9-12,14-17,19-22,24-27" highlight="3,7,11,15,19":::

> [!NOTE]
> In the original JSON data, the items are not sorted.

The first example includes a query that returns only the `name` property from all items sorted in alphabetical order.

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit-none/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit-none/result.json":::

This next example includes a query using the `OFFSET LIMIT` clause to skip the first item. The limit is set to the number of items in the container to return all possible remaining values. In this example, the query skips **one** item, and returns the remaining **four** (out of a limit of five).

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit-partial/query.sql" highlight="10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit-partial/result.json":::

This final example includes a query using the `OFFSET LIMIT` clause to return a subset of the matching items by skipping **one** item and taking the next **three**.

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/query.sql" highlight="10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/offset-limit/result.json":::

## Remarks

- Both the `OFFSET` count and the `LIMIT` count are required in the `OFFSET LIMIT` clause. If an optional `ORDER BY` clause is used, the result set is produced by doing the skip over the ordered values. Otherwise, the query returns a fixed order of values.
- The RU charge of a query with `OFFSET LIMIT` increases as the number of terms being offset increases. For queries that have [multiple pages of results](pagination.md), we typically recommend using [continuation tokens](pagination.md#continuation-tokens). Continuation tokens are a "bookmark" for the place where the query can later resume. If you use `OFFSET LIMIT`, there's no "bookmark." If you wanted to return the query's next page, you would have to start from the beginning.
- You should use `OFFSET LIMIT` for cases when you would like to skip items entirely and save client resources. For example, you should use `OFFSET LIMIT` if you want to skip to the 1000th query result and have no need to view results 1 through 999. On the backend, `OFFSET LIMIT` still loads each item, including those items that are skipped. The performance advantage is measured in reducing client resources by avoiding processing items that aren't needed.

## Related content

- [`GROUP BY` clause](group-by.md)
- [`ORDER BY` clause](order-by.md)
