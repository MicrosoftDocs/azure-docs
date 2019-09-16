---
title: ARRAY_SLICE (Azure Cosmos DB)
description: Learn about SQL system function ARRAY_SLICE in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# ARRAY_SLICE (Azure Cosmos DB)
 Returns part of an array expression.
  
## Syntax
  
```  
ARRAY_SLICE (<arr_expr>, <num_expr> [, <num_expr>])  
```  
  
## Arguments
  
*arr_expr*  
   Is any valid array expression.  
  
*num_expr*  
   Zero-based numeric index at which to begin the array. Negative values may be used to specify the starting index relative to the last element of the array i.e. -1 references the last element in the array.  

*num_expr*
   Maximum number of elements in the resulting array.    

## Return Types
  
  Returns an array expression.  
  
## Examples
  
  The following example shows how to get different slices of an array using ARRAY_SLICE.  
  
```  
SELECT
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1) AS s1,  
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1) AS s2,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 1) AS s3,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 2) AS s4,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 0) AS s5,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1000) AS s6,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, -100) AS s7      
  
```  
  
 Here is the result set.  
  
```  
[{  
           "s1": ["strawberries", "bananas"],   
           "s2": ["strawberries"],
           "s3": ["strawberries"],  
           "s4": ["strawberries", "bananas"], 
           "s5": [],
           "s6": ["strawberries", "bananas"],
           "s7": [] 
}]  
```  

## See Also

- [Array functions Azure Cosmos DB](sql-query-array-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
