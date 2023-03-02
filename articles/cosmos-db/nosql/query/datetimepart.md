---
title: DateTimePart in Azure Cosmos DB query language
description: Learn about SQL system function DateTimePart in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 08/14/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# DateTimePart (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the value of the specified DateTimePart between the specified DateTime.
  
## Syntax
  
```sql
DateTimePart (<DateTimePart> , <DateTime>)
```

## Arguments
  
*DateTimePart*  
   The part of the date for which DateTimePart will return the value. This table lists all valid DateTimePart arguments:

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

*DateTime*  
   UTC date and time ISO 8601 string value in the format `YYYY-MM-DDThh:mm:ss.fffffffZ`

## Return types

Returns a positive integer value.

## Remarks

DateTimePart will return `undefined` for the following reasons:

- The DateTimePart value specified is invalid
- The DateTime is not a valid ISO 8601 DateTime

This system function will not utilize the index.

## Examples

Here's an example that returns the integer value of the month:

```sql
SELECT DateTimePart("m", "2020-01-02T03:04:05.6789123Z") AS MonthValue
```

```json
[
    {
        "MonthValue": 1
    }
]
```

Here's an example that returns the number of microseconds:

```sql
SELECT DateTimePart("mcs", "2020-01-02T03:04:05.6789123Z") AS MicrosecondsValue
```

```json
[
    {
        "MicrosecondsValue": 678912
    }
]
```

## Next steps

- [Date and time functions Azure Cosmos DB](date-time-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
