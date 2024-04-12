---
title: TRUNC
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a truncated numeric value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 02/27/2024
ms.custom: query-reference
---

# TRUNC (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a numeric value truncated to the closest integer value.  

## Syntax

```nosql
TRUNC(<numeric_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.

## Examples

This example illustrates various ways to truncate a number to the closest integer.

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/trunc/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/trunc/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Related content

- [System functions](system-functions.yml)
- [`TRIM`](trim.md)
