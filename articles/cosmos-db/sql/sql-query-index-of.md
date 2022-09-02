---
title: INDEX_OF in Azure Cosmos DB query language
description: Learn about SQL system function INDEX_OF in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 08/30/2022
ms.author: girobins
ms.custom: query-reference
---

# INDEX_OF (Azure Cosmos DB)

[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or `-1` if the string isn't found.

## Syntax

```sql
INDEX_OF(<str_expr1>, <str_expr2> [, <numeric_expr>])
```

## Arguments

*str_expr1*
   Is the string expression to be searched.

*str_expr2*
   Is the string expression to search for.

*numeric_expr*
   Optional numeric expression that sets the position the search will start. The first position in *str_expr1* is 0.

## Return types

Returns a numeric expression.

## Examples

The following example returns the index of various substrings inside "abc".

```sql
SELECT
    INDEX_OF("abc", "ab") AS index_of_prefix,
    INDEX_OF("abc", "b") AS index_of_middle,
    INDEX_OF("abc", "c") AS index_of_last,
    INDEX_OF("abc", "d") AS index_of_missing
```

Here's the result set.

```json
[
  {
    "index_of_prefix": 0,
    "index_of_middle": 1,
    "index_of_last": 2,
    "index_of_missing": -1
  }
]
```

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](../introduction.md)
