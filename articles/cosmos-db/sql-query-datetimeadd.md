---
title: DateTimeAdd in Azure Cosmos DB query language
description: Learn about SQL system function DateTimeAdd in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: tisande
ms.custom: query-reference
---
# DateTimeAdd (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Returns DateTime string value resulting from adding a specified number value (as a signed integer) to a specified DateTime string  
  
## Syntax
  
```sql
DateTimeAdd (<DateTimePart> , <numeric_expr> ,<DateTime>)
```

## Arguments
  
*DateTimePart*  
   The part of date to which DateTimeAdd adds an integer number. This table lists all valid DateTimePart arguments:

| DateTimePart | abbreviations        |
| ------------ | -------------------- |
| Year         | "year", "yyyy", "yy" |
| Month        | "month", "mm", "m"   |
| Day          | "day", "dd", "d"     |
| Hour         | "hour", "hh"         |
| Minute       | "minute", "mi", "n"  |
| Second       | "second", "ss", "s"  |
| Millisecond  | "millisecond", "ms"  |
| Microsecond  | "microsecond", "mcs" |
| Nanosecond   | "nanosecond", "ns"   |

*numeric_expr*  
   Is a signed integer value that will be added to the DateTimePart of the specified DateTime

*DateTime*  
   UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` where:
  
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

## Return types

Returns a UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ` where:
  
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

## Remarks

DateTimeAdd will return `undefined` for the following reasons:

- The DateTimePart value specified is invalid
- The numeric_expr specified is not a valid integer
- The DateTime in the argument or result is not a valid ISO 8601 DateTime.

## Examples
  
The following example adds 1 month to the DateTime: `2020-07-09T23:20:13.4575530Z`

```sql
SELECT DateTimeAdd("mm", 1, "2020-07-09T23:20:13.4575530Z") AS OneMonthLater
```

```json
[
    {
        "OneMonthLater": "2020-08-09T23:20:13.4575530Z"
    }
]
```  

The following example subtracts 2 hours from the DateTime: `2020-07-09T23:20:13.4575530Z`

```sql
SELECT DateTimeAdd("hh", -2, "2020-07-09T23:20:13.4575530Z") AS TwoHoursEarlier
```

```json
[
    {
        "TwoHoursEarlier": "2020-07-09T21:20:13.4575530Z"
    }
]
```  

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
