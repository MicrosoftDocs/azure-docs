---
title: RTRIM in Azure Cosmos DB query language
description: Learn about SQL system function RTRIM in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 09/14/2021
ms.author: girobins
ms.custom: query-reference, ignite-2022
---
# RTRIM (Azure Cosmos DB)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns a string expression after it removes trailing whitespace or specified characters.  
  
## Syntax
  
```sql
RTRIM(<str_expr1>[, <str_expr2>])  
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression

*str_expr2*  
   Is an optional string expression to be trimmed from str_expr1. If not set, the default is whitespace.  
  
## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `RTRIM` inside a query.  
  
```sql
SELECT RTRIM("   abc") AS t1, 
RTRIM("   abc   ") AS t2, 
RTRIM("abc   ") AS t3, 
RTRIM("abc") AS t4,
RTRIM("abc", "bc") AS t5,
RTRIM("abc", "abc") AS t6
```  
  
 Here is the result set.  
  
```json
[
    {
        "t1": "   abc",
        "t2": "   abc",
        "t3": "abc",
        "t4": "abc",
        "t5": "a",
        "t6": ""
    }
]
``` 

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](string-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
