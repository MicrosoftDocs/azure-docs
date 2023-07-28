---
title: DateTimeToTimestamp
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a numeric timestamp that represents the milliseconds since the Unix epoch.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# DateTimeToTimestamp (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts the specified date and time to a numeric timestamp. The timestamp is a signed numeric integer that measures the milliseconds since the Unix epoch.

## Syntax

```sql
DateTimeToTimestamp(<date_time>)
```

## Arguments

| | Description |
| --- | --- |
| **`date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Return types

Returns a signed numeric value, the current number of milliseconds that have elapsed since the Unix epoch (January 1, 1970).

> [!NOTE]
> For more information on the Unix epoch, see [Unix time](https://wikipedia.org/wiki/unix_time).

## Examples

The following example converts the date and time **May 19, 2015 12:00 UTC** to a timestamp.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimetotimestamp/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimetotimestamp/result.json":::

## Remarks

- This function returns `undefined` if the date and time isn't a valid ISO 8601 date and time string.

## Next steps

- [System functions](system-functions.yml)
- [`DateTimeToTicks`](datetimetoticks.md)
