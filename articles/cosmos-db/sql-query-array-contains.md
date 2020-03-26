---
title: ARRAY_CONTAINS in Azure Cosmos DB query language
description: Learn about how the Array Contains SQL system function in Azure Cosmos DB returns a Boolean indicating whether the array contains the specified value
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# ARRAY_CONTAINS (Azure Cosmos DB)
Returns a Boolean indicating whether the array contains the specified value. You can check for a partial or full match of an object by using a boolean expression within the command. 

## Syntax
  
```sql
ARRAY_CONTAINS (<arr_expr>, <expr> [, bool_expr])  
```  
  
## Arguments
  
*arr_expr*  
   Is the array expression to be searched.  
  
*expr*  
   Is the expression to be found.  

*bool_expr*  
   Is a boolean expression. If it evaluates to 'true' and if the specified search value is an object, the command checks for a partial match (the search object is a subset of one of the objects). If it evaluates to 'false', the command checks for a full match of all objects within the array. The default value if not specified is false. 
  
## Return types
  
  Returns a Boolean value.  
  
## Examples
  
  The following example how to check for membership in an array using `ARRAY_CONTAINS`.  
  
```sql
SELECT   
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "apples") AS b1,  
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "mangoes") AS b2  
```  
  
 Here is the result set.  
  
```json
[{"b1": true, "b2": false}]  
```  

The following example how to check for a partial match of a JSON in an array using ARRAY_CONTAINS.  
  
```sql
SELECT  
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}, true) AS b1, 
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}) AS b2,
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "mangoes"}, true) AS b3 
```  
  
 Here is the result set.  
  
```json
[{
  "b1": true,
  "b2": false,
  "b3": false
}]
```

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [Array functions Azure Cosmos DB](sql-query-array-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
