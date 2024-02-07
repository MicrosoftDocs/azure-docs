---
title: DateTimeDiff
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the difference of a specific part between two date and times.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# DateTimeDiff (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the difference, as a signed integer, of the specified date and time part between two date and time values.
  
## Syntax
  
```sql
DateTimeDiff(<date_time_part>, <start_date_time>, <end_date_time>)
```

## Arguments

| | Description |
| --- | --- |
| **`date_time_part`** | A string representing a part of an ISO 8601 date format specification. This part is used to indicate which aspect of the date to compare. |
| **`start_date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |
| **`end_date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Return types

Returns a numeric value that is a signed integer.

## Examples

The following examples compare **February 4, 2019 16:00 UTC** and **March 5, 2018 05:00 UTC** using various date and time parts.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimediff/query.sql" highlight="2-11":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimediff/result.json":::

## Remarks

- This function returns `undefined` for these reasons:
  - The specified date and time part is invalid.
  - The date and time in either start or end argument isn't a valid ISO 8601 date and time string.
- The ISO 8601 date format specifies valid date and time parts to use with this function:
    | | Format |
    | --- | --- |
    | **Day** | `day`, `dd`, `d` |
    | **Hour** | `hour`, `hh` |
    | **Minute** | `minute`, `mi`, `n` |
    | **Second** | `second`, `ss`, `s` |
    | **Millisecond** | `millisecond`, `ms` |
    | **Microsecond** | `microsecond`, `mcs` |
    | **Nanosecond** | `nanosecond`, `ns` |
- The function always returns a signed integer value. The function returns a measurement of the number of boundaries crossed for the specified date and time part, not a measurement of the time interval.

## Related content

- [System functions](system-functions.yml)
- [`DateTimeBin`](datetimebin.md)
