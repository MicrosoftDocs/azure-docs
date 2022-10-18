---
title: Contains in Azure Cosmos DB query language
description: Learn about how the CONTAINS SQL system function in Azure Cosmos DB returns a Boolean indicating whether the first string expression contains the second
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 04/01/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# CONTAINS (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

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

Learn about [how this string system function uses the index](string-functions.md).

## Next steps

- [String functions Azure Cosmos DB](string-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
