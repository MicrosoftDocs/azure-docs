---
title: IS_OBJECT in Azure Cosmos DB query language
description: Learn about SQL system function IS_OBJECT in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# IS_OBJECT (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is a JSON object.  
  
## Syntax
  
```sql
IS_OBJECT(<expr>)  
```  
  
## Arguments
  
*expr*  
   Is any expression.  
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the `IS_OBJECT` function.  
  
```sql
SELECT   
    IS_OBJECT(true) AS isObj1,   
    IS_OBJECT(1) AS isObj2,  
    IS_OBJECT("value") AS isObj3,   
    IS_OBJECT(null) AS isObj4,  
    IS_OBJECT({prop: "value"}) AS isObj5,   
    IS_OBJECT([1, 2, 3]) AS isObj6,  
    IS_OBJECT({prop: "value"}.prop2) AS isObj7  
```  
  
 Here is the result set.  
  
```json
[{"isObj1":false,"isObj2":false,"isObj3":false,"isObj4":false,"isObj5":true,"isObj6":false,"isObj7":false}]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
