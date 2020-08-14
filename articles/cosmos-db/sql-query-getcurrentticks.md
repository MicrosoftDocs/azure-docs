---
title: GetCurrentTicks in Azure Cosmos DB query language
description: Learn about SQL system function GetCurrentTicks in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/14/2020
ms.author: tisande
ms.custom: query-reference
---
# GetCurrentTicks (Azure Cosmos DB)

Returns the current date and time, measured in ticks.
  
## Syntax
  
```sql
GetCurrentTicks ()
```

## Return types

Returns a positive integer value.

## Remarks

This system function will not utilize the index.

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

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
