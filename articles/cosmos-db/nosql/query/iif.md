---
title: IIF
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns one of two expressions based on a boolean expression input.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# IIF (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Evaluates a boolean expression and returns the result of one of two expressions depending on the result of the boolean expression. If the boolean expression evaluates to `true`, return the first expression option. Otherwise, return the second expression option.

## Syntax

```sql
IIF(<bool_expr>, <true_expr>, <not_true_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`bool_expr`** | A boolean expression, which is evaluated and used to determine which of the two supplemental expressions to use. |
| **`true_expr`** | The expression to return if the boolean expression evaluated to `true`. |
| **`not_true_expr`** | The expression to return if the boolean expression evaluated to **NOT** `true`. |

## Return types

Returns an expression, which could be of any type.

## Examples

This first example evaluates a static boolean expression and returns one of two potential expressions.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/iif/query.sql" highlight="2-7":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/iif/result.json":::

This example evaluates one of two potential expressions on multiple items in a container based on an expression that evaluates a boolean property.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/iif-fields/seed.json" range="1-2,4-12,14-22" highlight="4-9,13-18":::

The query uses fields in the original items.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/iif-fields/query.sql" highlight="3":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/iif-fields/result.json":::

## Remarks

- This function is similar to the ternary conditional operator in various programming languages. For more information, see [ternary conditional operator](https://wikipedia.org/wiki/ternary_conditional_operator).
- This function doesn't utilize the index.

## See also

- [System functions](system-functions.yml)
- [`ToString`](tostring.md)
