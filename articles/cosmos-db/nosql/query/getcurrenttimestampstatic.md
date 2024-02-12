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
ms.date: 09/21/2023
ms.custom: query-reference
---

# GetCurrentTimestampStatic (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of milliseconds that have elapsed since `00:00:00 Thursday, 1 January 1970`.

> [!IMPORTANT]
> The *static* variation of this function only retrieves the timestamp once per partition. For more information on the *non-static* variation, see [`GetCurrentTimestamp`](getcurrenttimestamp.md)

## Syntax

```sql
GetCurrentTimestampStatic()
```

## Return types

Returns a signed numeric value that represents the current number of milliseconds that have elapsed since the Unix epoch (`00:00:00 Thursday, 1 January 1970`).

## Examples

This example uses a container with a partition key path of `/pk`. There are three items in the container with two items within the same logical partition, and one item in a different logical partition.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/getcurrenttimestampstatic/seed.novalidate.json" highlight="4,8,12":::

This function returns the same static timestamp for items within the same partition. For comparison, the nonstatic function gets a new timestamp value for each item matched by the query.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/getcurrenttimestampstatic/query.novalidate.sql" highlight="4-5":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/getcurrenttimestampstatic/result.novalidate.json":::

> [!NOTE]
> It's possible for items in different logical partitions to exist in the same physical partition. In this scenario, the static date and time value would be identical.

## Remarks

- This static function is called once per partition.
- Static versions of system functions only get their respective values once during binding, rather than execute repeatedly in the runtime as is the case for the nonstatic versions of the same functions.

## See also

- [System functions](system-functions.yml)
- [`GetCurrentTimestamp`](getcurrenttimestamp.md)
