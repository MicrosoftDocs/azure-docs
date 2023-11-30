---
title: PI
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns constant value Pi.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# PI (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the constant value of Pi. For more information, see [Pi](https://wikipedia.org/wiki/pi).
  
## Syntax
  
```sql
PI()  
```  

## Return types

Returns a numeric expression.  

## Examples
  
The following example returns the constant value of Pi.
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/pi/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/pi/result.json":::

## Related content

- [System functions](system-functions.yml)
- [`SQRT`](sqrt.md)
