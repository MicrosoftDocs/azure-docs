---
title: TicksToDateTime in Azure Cosmos DB query language
description: Learn about SQL system function TicksToDateTime in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 08/18/2020
ms.author: tisande
ms.custom: query-reference
---
# TicksToDateTime (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Converts the specified ticks value to a DateTime.
  
## Syntax
  
```sql
TicksToDateTime (<Ticks>)
```

## Arguments

*Ticks*  

A signed numeric value, the current number of 100 nanosecond ticks that have elapsed since the Unix epoch. In other words, it is the number of 100 nanosecond ticks that have elapsed since 00:00:00 Thursday, 1 January 1970.

## Return types

Returns the UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` where:
  
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

TicksToDateTime will return `undefined` if the ticks value specified is invalid.

## Examples
  
The following example converts the ticks to a DateTime:

```sql
SELECT TicksToDateTime(15943368134575530) AS DateTime
```

```json
[
    {
        "DateTime": "2020-07-09T23:20:13.4575530Z"
    }
]
```  

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
