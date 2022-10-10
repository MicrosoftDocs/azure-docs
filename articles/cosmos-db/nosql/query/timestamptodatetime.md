---
title: TimestampToDateTime in Azure Cosmos DB query language
description: Learn about SQL system function TimestampToDateTime in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 08/18/2020
ms.author: sidandrews
ms.reviewer: jucocchi
ms.custom: query-reference, ignite-2022
---
# TimestampToDateTime (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts the specified timestamp value to a DateTime.
  
## Syntax
  
```sql
TimestampToDateTime (<Timestamp>)
```

## Arguments

*Timestamp*  

A signed numeric value, the current number of milliseconds that have elapsed since the Unix epoch. In other words, the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.

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

TimestampToDateTime will return `undefined` if the timestamp value specified is invalid.

## Examples
  
The following example converts the timestamp to a DateTime:

```sql
SELECT TimestampToDateTime(1594227912345) AS DateTime
```

```json
[
    {
        "DateTime": "2020-07-08T17:05:12.3450000Z"
    }
]
```  

## Next steps

- [Date and time functions Azure Cosmos DB](date-time-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
