---
title: EndsWith in Azure Cosmos DB query language
description: Learn about the ENDSWITH SQL system function in Azure Cosmos DB to return a Boolean indicating whether the first string expression ends with the second
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: girobins
ms.custom: query-reference
---
# ENDSWITH (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Returns a Boolean indicating whether the first string expression ends with the second.  
  
## Syntax
  
```sql
ENDSWITH(<str_expr1>, <str_expr2> [, <bool_expr>])
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression.  
  
*str_expr2*  
   Is a string expression to be compared to the end of *str_expr1*.

*bool_expr*
    Optional value for ignoring case. When set to true, ENDSWITH will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
The following example checks if the string "abc" ends with "b" and "bC".  
  
```sql
SELECT ENDSWITH("abc", "b", false) AS e1, ENDSWITH("abc", "bC", false) AS e2, ENDSWITH("abc", "bC", true) AS e3
```  
  
 Here is the result set.  
  
```json
[
    {
        "e1": false,
        "e2": false,
        "e3": true
    }
]
```  

## Remarks

This system function will [use indexes](index-overview.md#index-usage) the same way, regardless of the case-insensitive option.

| Index lookup type  | Non-aggregate query | Aggregate query |
| ------------------ | ------------------- | --------------- |
| Index seek         |                     |                 |
| Precise index scan |                     |                 |
| Index scan         |  x                  |                 |
| Full scan          |                     | x               |

If the property size in [EndsWith](sql-query-contains.md) is greater than 1 KB for some items, the query engine will need to load those items. In this case, the query engine won't be able to fully evaluate EndsWith with an index. The RU charge for EndsWith will be high if you have a large number of items with property sizes more than 1 KB.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
