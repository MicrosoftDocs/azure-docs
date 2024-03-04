---
title: NumberBin
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that rounds an input value to a multiple of the specified size.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# NumberBin (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Rounds the numeric expression's value down to a multiple of specified bin size.

## Syntax

```sql
NumberBin(<numeric_expr> [, <bin_size>])
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression, which is evaluated and then the resulting value is rounded to a multiple of the specified bin size. |
| **`bin_size` *(Optional)*** | A numeric value that specifies the bin size to use when rounding the value. This numeric value defaults to `1` if not specified. |

## Return types

Returns a numeric value.

## Examples

This first example bins a single static number with various bin sizes.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/numberbin/query.novalidate.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/numberbin/result.novalidate.json":::

This next example uses a field from an existing item.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/numberbin-field/seed.novalidate.json" range="1-2,4-8" highlight="4":::

This query rounds the previous field using the function.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/numberbin-field/query.novalidate.sql" highlight="3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/numberbin-field/result.novalidate.json":::

## Remarks

- This function returns `undefined` if the specified bin size is `0`.
- The default bin size is `1`. This bin size effectively returns a numeric value rounded to the next integer.

## See also

- [System functions](system-functions.yml)
- [`ROUND`](round.md)
