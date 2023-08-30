---
title: ROUND
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the number rounded to the closest integer.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# ROUND (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a numeric value, rounded to the closest integer value.  

## Syntax

```sql
ROUND(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.

## Examples

The following example rounds positive and negative numbers to the nearest integer.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/round/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/round/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).
- The rounding operation performed follows midpoint rounding away from zero. If the input is a numeric expression, which falls exactly between two integers then the result is the closest integer value away from `0`. Examples are provided here:
    | | Rounded |
    | --- | --- |
    | **`-6.5000`** | `-7` |
    | **`-0.5`** | `-1` |
    | **`0.5`** | `1` |
    | **`6.5000`** | `7` |

## Next steps

- [System functions](system-functions.yml)
- [`POWER`](power.md)
