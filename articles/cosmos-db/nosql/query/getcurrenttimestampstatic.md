---
title: GetCurrentTimestampStatic
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a static timestamp value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# GetCurrentTimestampStatic

Returns the number of milliseconds that have elapsed since `00:00:00 Thursday, 1 January 1970`.

## Syntax

```sql
GetCurrentTimestampStatic()
```

## Return types

same as other doc

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



```sql

```

```json

```

> [!NOTE]
> It's possible for items in different logical partitions to exist in the same physical partition. In this scenario, the static date and time value would be identical.

## Remarks

- This static function is called once per partition.
- Static versions of system functions only get their respective values once during binding, rather than execute repeatedly in the runtime as is the case for the nonstatic versions of the same functions.ntime as is this case for the non\-static versions of these functions\.

## See also

- [System functions](system-functions.yml)
