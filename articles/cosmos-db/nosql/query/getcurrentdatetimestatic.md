---
title: GetCurrentDateTimeStatic
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a static ISO 8601 date and time value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# GetCurrentDateTimeStatic (NoSQL query)

Returns the current UTC (Coordinated Universal Time) date and time as an ISO 8601 string.

> [!IMPORTANT]
> The *static* variation of this function only retrieves the date and time once per partition. For more information on the *non-static* variation, see [`GetCurrentDateTime`](getcurrentdatetime.md)

## Syntax

```sql
GetCurrentDateTimeStatic()
```

## Return types

Returns the current UTC date and time string value in the **round-trip** (ISO 8601) format. For more information on the round-trip format, see [.NET round-trip format](/dotnet/standard/base-types/standard-date-and-time-format-strings#the-round-trip-o-o-format-specifier). For more information on the ISO 8601 format, see [ISO 8601](https://wikipedia.org/wiki/ISO_8601).

## Examples

This example uses a container with a partition key path of `/pk`. There are three items in the container with two items within the same logical partition, and one item in a different logical partition.

```json
[
  {
    "id": "1",
    "pk": "A"
  },
  {
    "id": "2",
    "pk": "A"
  },
  {
    "id": "3",
    "pk": "B"
  }
]
```

This function returns the same static date and time for items within the same partition. For comparison, the nonstatic function gets a new date and time value for each item matched by the query.

```sql
SELECT
    i.id,
    i.pk AS partitionKey,
    GetCurrentDateTime() AS nonStaticDateTime,
    GetCurrentDateTimeStatic() AS staticDateTime
FROM
    items i
```

```json
[
  {
    "id": "1",
    "partitionKey": "A",
    "nonStaticDateTime": "2023-06-28T18:32:12.4500994Z",
    "staticDateTime": "2023-06-28T18:32:12.4499507Z"
  },
  {
    "id": "2",
    "partitionKey": "A",
    "nonStaticDateTime": "2023-06-28T18:32:12.4501101Z",
    "staticDateTime": "2023-06-28T18:32:12.4499507Z"
  },
  {
    "id": "3",
    "partitionKey": "B",
    "nonStaticDateTime": "2023-06-28T18:32:12.4501181Z",
    "staticDateTime": "2023-06-28T18:32:12.4401181Z"
  }
]
```

> [!NOTE]
> It's possible for items in different logical partitions to exist in the same physical partition. In this scenario, the static date and time value would be identical.

## Remarks

- This static function is called once per partition.
- Static versions of system functions only get their respective values once during binding, rather than execute repeatedly in the runtime as is the case for the nonstatic versions of the same functions.

## See also

- [System functions](system-functions.yml)
- [`GetCurrentDateTime` (nonstatic)](getcurrentdatetime.md)
