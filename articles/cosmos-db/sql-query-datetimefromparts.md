---
title: DateTimeFromParts in Azure Cosmos DB query language
description: Learn about SQL system function DateTimeFromParts in Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: tisande
ms.custom: query-reference
---
# DateTimeFromParts (Azure Cosmos DB)

Returns a string DateTime value constructed from input values.
  
## Syntax
  
```sql
DateTimeFromParts(<numberYear>, <numberMonth>, <numberDay> [, numberHour]  [, numberMinute]  [, numberSecond] [, numberOfFractionsOfSecond])
```

## Arguments
  
*numberYear*
   Integer value for the year in the format `YYYY`

*numberMonth*  
   Integer value for the month in the format `MM`

*numberDay*  
   Integer value for the day in the format `DD`

*numberHour* (optional)
   Integer value for the hour in the format `hh`

*numberMinute* (optional)
   Integer value for the minute in the format `mm`

*numberSecond* (optional)
   Integer value for the second in the format `ss`

*numberOfFractionsOfSecond* (optional)
   Integer value for the fractional of a second in the format `.fffffff`

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
  |Z|UTC (Coordinated Universal Time) designator||
  
 For more information on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601)

## Remarks

If the specified integers would create an invalid DateTime, DateTimeFromParts will return `undefined`.

If an optional argument isn't specified, its value will be 0.

## Examples

Here's an example that only includes required arguments to construct a DateTime:

```sql
SELECT DateTimeFromParts(2020, 9, 4) AS DateTime
```

```json
[
    {
        "DateTime": "2020-09-04T00:00:00.0000000Z"
    }
]
```

Here's another example that also uses some optional arguments to construct a DateTime:

```sql
SELECT DateTimeFromParts(2020, 9, 4, 10, 52) AS DateTime
```

```json
[
    {
        "DateTime": "2020-09-04T10:52:00.0000000Z"
    }
]
```

Here's another example that also uses all optional arguments to construct a DateTime:

```sql
SELECT DateTimeFromParts(2020, 9, 4, 10, 52, 12, 3456789) AS DateTime
```

```json
[
    {
        "DateTime": "2020-09-04T10:52:12.3456789Z"
    }
]
```

## Next steps

- [Date and time functions Azure Cosmos DB](sql-query-date-time-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
