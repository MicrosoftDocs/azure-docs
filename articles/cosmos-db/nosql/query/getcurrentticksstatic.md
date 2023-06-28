---
title: GetCurrentTicksStatic
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a static nanosecond ticks value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# GetCurrentTicksStatic (NoSQL query)

Returns the number of 100-nanosecond ticks that have elapsed since `00:00:00 Thursday, 1 January 1970`.

> [!IMPORTANT]
> The *static* variation of this function only retrieves the timestamp once per partition. For more information on the *non-static* variation, see [`GetCurrentTicks`](getcurrentticks.md)

## Syntax

```sql
GetCurrentTicksStatic()
```

## Return types

Returns a signed numeric value that represents the current number of 100-nanosecond ticks that have elapsed since the Unix epoch (`00:00:00 Thursday, 1 January 1970`).

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

This function returns the same static nanosecond ticks for items within the same partition. For comparison, the nonstatic function gets a new nanosecond ticks value for each item matched by the query.

```sql
SELECT
    i.id,
    i.pk AS partitionKey,
    GetCurrentTicks() AS nonStaticTicks,
    GetCurrentTicksStatic() AS staticTicks
FROM
    items i
```

```json
[
  {
    "id": "1",
    "partitionKey": "A",
    "nonStaticTicks": 16879779663422236,
    "staticTicks": 16879779663415572
  },
  {
    "id": "2",
    "partitionKey": "A",
    "nonStaticTicks": 16879779663422320,
    "staticTicks": 16879779663415572
  },
  {
    "id": "3",
    "partitionKey": "B",
    "nonStaticTicks": 16879779663422380,
    "staticTicks": 16879779663421680
  }
]
```

> [!NOTE]
> It's possible for items in different logical partitions to exist in the same physical partition. In this scenario, the static nanosecond ticks value would be identical.

## Remarks

- This static function is called once per partition.
- Static versions of system functions only get their respective values once during binding, rather than execute repeatedly in the runtime as is the case for the nonstatic versions of the same functions.

## See also

- [System functions](system-functions.yml)
- [`GetCurrentTicks` (nonstatic)](getcurrentticks.md)