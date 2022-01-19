---
title: GetCurrentDateTime in Azure Cosmos DB query language
description: Learn about SQL system function GetCurrentDateTime in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 02/03/2021
ms.author: tisande
ms.custom: query-reference
---
# GetCurrentDateTime (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

Returns the current UTC (Coordinated Universal Time) date and time as an ISO 8601 string.
  
## Syntax
  
```sql
GetCurrentDateTime ()
```

## Return types
  
Returns the current UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` where:
  
|Format|Description|
|-|-|
|YYYY|four-digit year|
|MM|two-digit month (01 = January, etc.)|
|DD|two-digit day of month (01 through 31)|
|T|signifier for beginning of time elements|
|hh|two-digit hour (00 through 23)|
|mm|two-digit minutes (00 through 59)|
|ss|two-digit seconds (00 through 59)|
|.fffffff|seven-digit fractional seconds|
|Z|UTC (Coordinated Universal Time) designator|
  
  For more information on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601)

## Remarks

GetCurrentDateTime() is a nondeterministic function. The result returned is UTC. Precision is 7 digits, with an accuracy of 100 nanoseconds.

> [!NOTE]
> This system function will not utilize the index. If you need to compare values to the current time, obtain the current time before query execution and use that constant string value in the `WHERE` clause.

## Examples
  
The following example shows how to get the current UTC Date Time using the GetCurrentDateTime() built-in function.
  
```sql
SELECT GetCurrentDateTime() AS currentUtcDateTime
```  
  
 Here is an example result set.
  
```json
[{
  "currentUtcDateTime": "2019-05-03T20:36:17.1234567Z"
}]  
```  

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](../introduction.md)
