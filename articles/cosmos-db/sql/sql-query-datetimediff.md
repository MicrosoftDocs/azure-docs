---
title: DateTimeDiff in Azure Cosmos DB query language
description: Learn about SQL system function DateTimeDiff in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: tisande
ms.custom: query-reference
---
# DateTimeDiff (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]
Returns the count (as a signed integer value) of the specified DateTimePart boundaries crossed between the specified *StartDate* and *EndDate*.
  
## Syntax
  
```sql
DateTimeDiff (<DateTimePart> , <StartDate> , <EndDate>)
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

*StartDate*  
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

*EndDate*  
   UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ`

## Return types

Returns a signed integer value.

## Remarks

DateTimeDiff will return `undefined` for the following reasons:

- The DateTimePart value specified is invalid
- The StartDate or EndDate is not a valid ISO 8601 DateTime

DateTimeDiff will always return a signed integer value and is a measurement of the number of DateTimePart boundaries crossed, not measurement of the time interval.

## Examples
  
The following example computes the number of day boundaries crossed between `2020-01-01T01:02:03.1234527Z` and `2020-01-03T01:02:03.1234567Z`.

```sql
SELECT DateTimeDiff("day", "2020-01-01T01:02:03.1234527Z", "2020-01-03T01:02:03.1234567Z") AS DifferenceInDays
```

```json
[
    {
        "DifferenceInDays": 2
    }
]
```  

The following example computes the number of year boundaries crossed between `2028-01-01T01:02:03.1234527Z` and `2020-01-03T01:02:03.1234567Z`.

```sql
SELECT DateTimeDiff("yyyy", "2028-01-01T01:02:03.1234527Z", "2020-01-03T01:02:03.1234567Z") AS DifferenceInYears
```

```json
[
    {
        "DifferenceInYears": -8
    }
]
```

The following example computes the number of hour boundaries crossed between `2020-01-01T01:00:00.1234527Z` and `2020-01-01T01:59:59.1234567Z`. Even though these DateTime values are over 0.99 hours apart, `DateTimeDiff` returns 0 because no hour boundaries were crossed.

```sql
SELECT DateTimeDiff("hh", "2020-01-01T01:00:00.1234527Z", "2020-01-01T01:59:59.1234567Z") AS DifferenceInHours
```

```json
[
    {
        "DifferenceInHours": 0
    }
]
```

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](../introduction.md)
