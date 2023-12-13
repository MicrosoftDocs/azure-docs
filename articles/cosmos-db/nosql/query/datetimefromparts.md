---
title: DateTimeFromParts
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a date and time constructed from various numeric inputs.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# DateTimeFromParts (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a date and time string value constructed from input numeric values for various date and time parts.
  
## Syntax
  
```sql
DateTimeFromParts(<numeric_year>, <numeric_month>, <numeric_day> [, <numeric_hour>]  [, <numeric_minute>]  [, <numeric_second>] [, <numeric_second_fraction>])
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_year`** | A positive numeric integer value for the **year**. This argument is in the ISO 8601 format `yyyy`. |
| **`numeric_month`** | A positive numeric integer value for the **month**. This argument is in the ISO 8601 format `mm`. |
| **`numeric_day`** | A positive numeric integer value for the **day**. This argument is in the ISO 8601 format `dd`. |
| **`numeric_hour` *(Optional)*** | An optional positive numeric integer value for the **hour**. This argument is in the ISO 8601 format `hh`. If not specified, the default value is `0`. |
| **`numeric_minute` *(Optional)*** | An optional positive numeric integer value for the **minute**. This argument is in the ISO 8601 format `mm`. If not specified, the default value is `0`. |
| **`numeric_second` *(Optional)*** | An optional positive numeric integer value for the **second**. This argument is in the ISO 8601 format `ss`. If not specified, the default value is `0`. |
| **`numeric_second_fraction` *(Optional)*** | An optional positive numeric integer value for the **fractional of a second**. This argument is in the ISO 8601 format `fffffffZ`. If not specified, the default value is `0`. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).

## Return types

Returns a UTC date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`.

## Examples

The following example uses various combinations of the arguments to create date and time strings. This example uses the date and time **April 20, 2017 13:15 UTC**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/datetimefromparts/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/datetimefromparts/result.json":::

## Remarks

- If the specified integers would create an invalid date and time, the function returns `undefined`.

## Related content

- [System functions](system-functions.yml)
- [`DateTimePart`](datetimepart.md)
