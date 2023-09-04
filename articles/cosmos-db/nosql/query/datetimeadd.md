---
title: DateTimeAdd
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a datetime that's the resulting of adding a number to a part of the specified datetime.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/19/2023
ms.custom: query-reference
---

# DateTimeAdd (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a date and time string value that is the result of adding a specified number value to the provided date and time string.
  
## Syntax
  
```sql
DateTimeAdd(<date_time_part>, <numeric_expr> ,<date_time>)
```

## Arguments

| | Description |
| --- | --- |
| **`date_time_part`** | A string representing a part of an ISO 8601 date format specification. This part is used to indicate which aspect of the date to modify by the related numeric expression. |
| **`numeric_expr`** | A numeric expression resulting in a signed integer. |
| **`date_time`** | A Coordinated Universal Time (UTC) date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).

## Return types

Returns a UTC date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`.

## Examples

The following example adds various values (one year, one month, one day, one hour) to the date **July 3, 2020** at **midnight (00:00 UTC)**. The example also subtracts various values (two years, two months, two days, two hours) from the same date. Finally, this example uses an expression to modify the seconds of the same date.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimeadd/query.sql" highlight="2-10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimeadd/result.json":::

## Remarks

- This function returns `undefined` for these reasons:
  - The specified date and time part is invalid.
  - The numeric expression isn't a valid integer.
  - The date and time in the argument isn't a valid ISO 8601 date and time string.
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

## Next steps

- [System functions](system-functions.yml)
- [`DateTimeBin`](datetimebin.md)
