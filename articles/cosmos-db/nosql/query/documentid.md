---
title: DocumentId
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the partition-specific integer identifier for an item.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# DocumentId (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Extracts the integer identifier corresponding to a specific item within a physical partition.

## Syntax

```sql
DOCUMENTID(<root_specifier>)
```

## Arguments

| | Description |
| --- | --- |
| **`root_specifier`** | Alias that identifies the root. |

## Return types

Integer identifying an item within a physical partition.

## Examples

This example illustrates using this function to extract and return the integer identifier relative to a physical partition.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid/seed.novalidate.json" highlight="3":::

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/documentid/query.novalidate.sql" highlight="4":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid/result.novalidate.json":::

This function can also be used as a filter.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid-filter/seed.novalidate.json" highlight="3":::

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/documentid-filter/query.novalidate.sql" highlight="3,7-8":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/documentid-filter/result.novalidate.json":::

## Remarks

- This function returns an integer value that is only unique within a single physical partition.

## See also

- [System functions](system-functions.yml)
- [`IS_OBJECT`](is-object.md)
