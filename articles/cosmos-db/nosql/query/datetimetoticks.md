---
title: DateTimeToTicks
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the number of ticks, or 100 nanoseconds, since the Unix epoch.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# DateTimeToTicks (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts the specified DateTime to ticks. A single tick represents `100` nanoseconds or `0.000000001`of a second.

## Syntax

```sql
DateTimeToTicks(<date_time>)
```

## Arguments

| | Description |
| --- | --- |
| **`date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Return types

Returns a signed numeric value, the current number of `100`-nanosecond ticks that have elapsed since the Unix epoch (January 1, 1970).

> [!NOTE]
> For more information on the Unix epoch, see [Unix time](https://wikipedia.org/wiki/unix_time).

## Examples

The following example measures the ticks since the date and time **May 19, 2015 12:00 UTC**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimetoticks/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimetoticks/result.json":::

## Remarks

- This function returns `undefined` if the date and time isn't a valid ISO 8601 date and time string.
- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`DateTimeToTimestamp`](datetimetotimestamp.md)
