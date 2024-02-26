---
title: IS_OBJECT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns true if the type of the specified expression is a JSON object.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# IS_OBJECT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating if the type of the specified expression is a JSON object.  

## Syntax

```sql
IS_OBJECT(<expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`expr`** | Any expression. |
  
## Return types
  
Returns a boolean expression.  
  
## Examples

The following example various values to see if they're an object.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/is-object/query.sql" highlight="2-10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/is-object/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Related content

- [System functions](system-functions.yml)
- [`IS_PRIMITIVE`](is-primitive.md)
