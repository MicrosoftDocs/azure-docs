---
title: TRIM in Azure Cosmos DB query language
description: Learn about SQL system function TRIM in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 09/14/2021
ms.author: girobins
ms.custom: query-reference
---
# TRIM (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

Returns a string expression after it removes leading and trailing whitespace or specified characters.  
  
## Syntax
  
```sql
TRIM(<str_expr1>[, <str_expr2>])  
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression

*str_expr2*  
   Is an optional string expression to be trimmed from str_expr1. If not set, the default is whitespace.

## Return types
  
  Returns a string expression.  
  
## Examples
  
  The following example shows how to use `TRIM` inside a query.  
  
```sql
SELECT TRIM("   abc") AS t1, 
TRIM("   abc   ") AS t2, 
TRIM("abc   ") AS t3, 
TRIM("abc") AS t4,
TRIM("abc", "ab") AS t5,
TRIM("abc", "abc") AS t6
```  
  
 Here is the result set.  
  
```json
[
    {
        "t1": "abc",
        "t2": "abc",
        "t3": "abc",
        "t4": "abc",
        "t5": "c",
        "t6": ""
    }
]
``` 

## Remarks

This system function will not utilize the index.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](../introduction.md)
