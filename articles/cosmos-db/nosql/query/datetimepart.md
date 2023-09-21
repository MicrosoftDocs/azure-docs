---
title: DateTimePart
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the numeric value of a specific part of a date and time.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# DateTimePart (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the value of the specified date and time part for the provided date and time.
  
## Syntax
  
```sql
DateTimePart(<date_time> , <date_time_part>)
```

## Arguments

| | Description |
| --- | --- |
| **`date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |
| **`date_time_part`** | A string representing a part of an ISO 8601 date format specification. This part is used to indicate which aspect of the date to extract and return. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Return types

Returns a numeric value that is a positive integer.

## Examples

The following example returns various parts of the date and time **May 29, 2016 08:30 UTC**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimepart/query.sql" highlight="2-10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimepart/result.json":::

## Remarks

- This function returns `undefined` for these reasons:
  - The specified date and time part is invalid.
  - The date and time isn't a valid ISO 8601 date and time string.
- The ISO 8601 date format specifies valid date and time parts to use with this function:
    | | Format |
    | --- | --- |
    | **Year** | `year`, `yyyy`, `yy` |
    | **Month** | `month`, `mm`, `m` |
    | **Day** | `day`, `dd`, `d` |
    | **Hour** | `hour`, `hh` |
    | **Minute** | `minute`, `mi`, `n` |
    | **Second** | `second`, `ss`, `s` |
    | **Millisecond** | `millisecond`, `ms` |
    | **Microsecond** | `microsecond`, `mcs` |
    | **Nanosecond** | `nanosecond`, `ns` |
- This function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`DateTimeFromParts`](datetimefromparts.md)
