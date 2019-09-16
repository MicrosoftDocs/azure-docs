---
title: IS_ARRAY (Azure Cosmos DB)
description: Learn about SQL system function IS_ARRAY in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# IS_ARRAY (Azure Cosmos DB)
 Returns a Boolean value indicating if the type of the specified expression is an array.  
  
## Syntax
  
```  
IS_ARRAY(<expression>)  
```  
  
## Arguments
  
*expression*  
   Is any valid expression.  
  
## Return Types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_ARRAY function.  
  
```  
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
  
```  
[{"isArray1":false,"isArray2":false,"isArray3":false,"isArray4":false,"isArray5":false,"isArray6":true,"isArray7":false}]
```  
  

## See Also

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
