---
title: TimestampToDateTime
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the timestamp as a date and time value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# TimestampToDateTime (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts the specified timestamp to a date and time value.

## Syntax

```sql
TimestampToDateTime(<numeric_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

> [!NOTE]
> For more information on the ISO 8601 format, see [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).

## Return types

Returns a UTC date and time string in the ISO 8601 format `YYYY-MM-DDThh:mm:ss.fffffffZ`.

## Examples

The following example converts the ticks to a date and time value.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/timestamptodatetime/query.sql" highlight="2-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/timestamptodatetime/result.json":::

## Remarks

- This function returns `undefined` if the timestamp value specified is invalid.

## Related content

- [System functions](system-functions.yml)
- [`TicksToDateTime`](tickstodatetime.md)
