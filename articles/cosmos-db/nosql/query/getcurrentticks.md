---
title: GetCurrentTicks in Azure Cosmos DB query language
description: Learn about SQL system function GetCurrentTicks in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# GetCurrentTicks (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of 100-nanosecond ticks that have elapsed since 00:00:00 Thursday, 1 January 1970.
  
## Syntax
  
```sql
GetCurrentTicks ()
```

## Return types

Returns a signed numeric value, the current number of 100-nanosecond ticks that have elapsed since the Unix epoch. In other words, GetCurrentTicks returns the number of 100 nanosecond ticks that have elapsed since 00:00:00 Thursday, 1 January 1970.

## Remarks

GetCurrentTicks() is a nondeterministic function. The result returned is UTC (Coordinated Universal Time).

> [!NOTE]
> This system function will not utilize the index. If you need to compare values to the current time, obtain the current time before query execution and use that constant string value in the `WHERE` clause.

## Examples

Here's an example that returns the current time, measured in ticks:

```sql
SELECT GetCurrentTicks() AS CurrentTimeInTicks
```

```json
[
    {
        "CurrentTimeInTicks": 15973607943002652
    }
]
```

## Next steps

- [Date and time functions Azure Cosmos DB](date-time-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
