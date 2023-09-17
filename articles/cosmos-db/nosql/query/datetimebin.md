--- 
title: DateTimeBin
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a date and time that's the resulting of binning (rounding) a part of the specified datetime.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# DateTimeBin (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a date and time string value that is the result of binning (or rounding) a part of the provided date and time string.

## Syntax

```sql
DateTimeBin(<date_time> , <date_time_part> [, <bin_size>] [, <bin_start_date_time>]) 
```

## Arguments

| | Description |
| --- | --- |
| **`date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |
| **`date_time_part`** | A string representing a part of an ISO 8601 date format specification. This part is used to indicate which aspect of the date to bin. Specifically, this part argument represents the level of granularity for binning (or rounding). The minimum granularity for the part is **days** and the maximum granularity is **nanoseconds**. |
| **`bin_size` *(Optional)*** | An optional numeric value specifying the size of the bin. If not specified, the default value is `1`. |
| **`bin_start_date_time` *(Optional)*** | An optional Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. This date and time argument specifies the start date to bin from. If not specified, the default value is the Unix epoch `1970-01-01T00:00:00.000000Z`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601). For more information on the Unix epoch, see [Unix time](https://wikipedia.org/wiki/unix_time).

## Return types

Returns a UTC date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`.

## Examples

The following example bins the date **January 8, 2021** at **18:35 UTC** by various values. The example also changes the bin size, and the bin start date and time.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimebin/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimebin/result.json":::

## Remarks

- This function returns `undefined` for these reasons:
  - The specified date and time part is invalid.
  - The bin size value isn't a valid integer, is zero, or is negative.
  - The date and time in either argument isn't a valid ISO 8601 date and time string.
  - The date and time for the bin start precedes the year `1601`, the Windows epoch.
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

## Next steps

- [System functions](system-functions.yml)
- [`DateTimeAdd`](datetimeadd.md)
