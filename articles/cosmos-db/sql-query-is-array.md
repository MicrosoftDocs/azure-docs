---
title: IS_ARRAY in Azure Cosmos DB query language
description: Learn about SQL system function IS_ARRAY in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# IS_ARRAY (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is an array.  
  
## Syntax
  
```sql
IS_ARRAY(<expr>)  
```  
  
## Arguments
  
*expr*  
   Is any expression.  
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the `IS_ARRAY` function.  
  
```sql
SELECT   
 IS_ARRAY(true) AS isArray1,   
 IS_ARRAY(1) AS isArray2,  
 IS_ARRAY("value") AS isArray3,  
 IS_ARRAY(null) AS isArray4,  
 IS_ARRAY({prop: "value"}) AS isArray5,   
 IS_ARRAY([1, 2, 3]) AS isArray6,  
 IS_ARRAY({prop: "value"}.prop2) AS isArray7  
```  
  
 Here is the result set.  
  
```json
[{"isArray1":false,"isArray2":false,"isArray3":false,"isArray4":false,"isArray5":false,"isArray6":true,"isArray7":false}]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
