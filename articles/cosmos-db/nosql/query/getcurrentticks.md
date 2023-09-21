---
title: GetCurrentTicks
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a nanosecond ticks value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# GetCurrentTicks (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of 100-nanosecond ticks that have elapsed since `00:00:00 Thursday, 1 January 1970`.
  
## Syntax
  
```sql
GetCurrentTicks()
```

## Return types

Returns a signed numeric value that represents the current number of 100-nanosecond ticks that have elapsed since the Unix epoch (`00:00:00 Thursday, 1 January 1970`).

## Examples

The following example returns the current time measured in ticks:

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/getcurrentticks/query.novalidate.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/getcurrentticks/result.novalidate.json":::

## Remarks

- This function is nondeterministic.
- The result returned is UTC (Coordinated Universal Time).
- This function doesn't use the index.
- If you need to compare values to the current time, obtain the current time before query execution and use that constant string value in the `WHERE` clause.

## Related content

- [System functions](system-functions.yml)
- [`GetCurrentTicksStatic`](getcurrentticksstatic.md)
