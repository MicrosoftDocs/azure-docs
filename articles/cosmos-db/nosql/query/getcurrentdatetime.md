---
title: GetCurrentDateTime
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns an ISO 8601 date and time value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# GetCurrentDateTime (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the current UTC (Coordinated Universal Time) date and time as an ISO 8601 string.

## Syntax

```sql
GetCurrentDateTime()
```

## Return types

Returns the current UTC date and time string value in the **round-trip** (ISO 8601) format.

> [!NOTE]
> For more information on the round-trip format, see [.NET round-trip format](/dotnet/standard/base-types/standard-date-and-time-format-strings#the-round-trip-o-o-format-specifier). For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Examples

The following example shows how to get the current UTC date and time string.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/getcurrentdatetime/query.novalidate.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/getcurrentdatetime/result.novalidate.json":::

## Remarks

- This function is nondeterministic.
- The result returned is UTC (Coordinated Universal Time) with precision of seven digits and an accuracy of 100 nanoseconds.
- This function doesn't use the index.
- If you need to compare values to the current time, obtain the current time before query execution and use that constant string value in the `WHERE` clause.

## Related content

- [System functions](system-functions.yml)
- [`GetCurrentDateTimeStatic`](getcurrentdatetimestatic.md)
