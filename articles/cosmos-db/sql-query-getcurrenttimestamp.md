---
title: GetCurrentTimestamp in Azure Cosmos DB query language
description: Learn about SQL system function GetCurrentTimestamp in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: girobins
ms.custom: query-reference
---
# GetCurrentTimestamp (Azure Cosmos DB)

 Returns the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.
  
## Syntax
  
```sql
GetCurrentTimestamp ()  
```  
  
## Return types
  
Returns a signed numeric value, the current number of milliseconds that have elapsed since the Unix epoch i.e. the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.

## Remarks

GetCurrentTimestamp() is a nondeterministic function. The result returned is UTC (Coordinated Universal Time).

This system function will not utilize the index.

## Examples
  
  The following example shows how to get the current timestamp using the GetCurrentTimestamp() built-in function.
  
```sql
SELECT GetCurrentTimestamp() AS currentUtcTimestamp
```  
  
 Here is an example result set.
  
```json
[{
  "currentUtcTimestamp": 1556916469065
}]  
```

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
