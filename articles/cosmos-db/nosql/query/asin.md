---
title: ASIN
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric arcsine of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/18/2023
ms.custom: query-reference
---

# ASIN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric arcsine of the specified numeric value. The arcsine is the angle, in radians, whose sine is the specified numeric expression.

## Syntax

```sql
ASIN(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  

## Examples

The following example calculates the arcsine of the specified angle using the function.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/asin/query.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/asin/result.json":::

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`SIN`](sin.md)
