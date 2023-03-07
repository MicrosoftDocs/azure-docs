---
title: TimestampToDateTime in Azure Cosmos DB query language
description: Learn about SQL system function TimestampToDateTime in Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 10/27/2022
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

### Timestamp

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
  
The following example converts the value `1,594,227,912,345` from milliseconds to a date and time of **July 8, 2020, 5:05 PM UTC**.

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

This next example uses the timestamp from an existing item in a container. The item's timestamp is expressed in seconds.

```json
{
  "id": "8cc56bd4-5b8d-450b-a576-449836171398",
  "type": "reading",
  "data": "temperature",
  "value": 35.726545156,
  "_ts": 1605862991
}
```

To use the `_ts` value, you must multiply the value by 1,000 since the timestamp is expressed in seconds.

```sql
SELECT 
  TimestampToDateTime(r._ts * 1000) AS timestamp, 
  r.id 
FROM 
  readings r
```

```json
[
  {
    "timestamp": "2020-11-20T09:03:11.0000000Z",
    "id": "8cc56bd4-5b8d-450b-a576-449836171398"
  }
]
```

## Next steps

- [Date and time functions Azure Cosmos DB](date-time-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
