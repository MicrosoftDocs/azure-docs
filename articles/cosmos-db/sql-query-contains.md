---
title: Contains in Azure Cosmos DB query language
description: Learn about how the CONTAINS SQL system function in Azure Cosmos DB returns a Boolean indicating whether the first string expression contains the second
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 04/01/2021
ms.author: girobins
ms.custom: query-reference
---
# CONTAINS (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Returns a Boolean indicating whether the first string expression contains the second.  
  
## Syntax
  
```sql
CONTAINS(<str_expr1>, <str_expr2> [, <bool_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the string expression to find.  

*bool_expr*
    Optional value for ignoring case. When set to true, CONTAINS will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if "abc" contains "ab" and if "abc" contains "A".  
  
```sql
SELECT CONTAINS("abc", "ab", false) AS c1, CONTAINS("abc", "A", false) AS c2, CONTAINS("abc", "A", true) AS c3
```  
  
 Here is the result set.  
  
```json
[
    {
        "c1": true,
        "c2": false,
        "c3": true
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

If the property size in [Contains](sql-query-contains.md) is greater than 1 KB for some items, the query engine will need to load those items. In this case, the query engine won't be able to fully evaluate Contains with an index. The RU charge for Contains will be high if you have a large number of items with property sizes more than 1 KB.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
