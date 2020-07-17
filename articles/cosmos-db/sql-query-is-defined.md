---
title: IS_DEFINED in Azure Cosmos DB query language
description: Learn about SQL system function IS_DEFINED in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# IS_DEFINED (Azure Cosmos DB)
 Returns a Boolean indicating if the property has been assigned a value.  
  
## Syntax
  
```sql
IS_DEFINED(<expr>)  
```  
  
## Arguments
  
*expr*  
   Is any expression.  
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks for the presence of a property within the specified JSON document. The first returns true since "a" is present, but the second returns false since "b" is absent.  
  
```sql
SELECT IS_DEFINED({ "a" : 5 }.a) AS isDefined1, IS_DEFINED({ "a" : 5 }.b) AS isDefined2 
```  
  
 Here is the result set.  
  
```json
[{"isDefined1":true,"isDefined2":false}]  
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

## Next steps

- [Type checking functions Azure Cosmos DB](sql-query-type-checking-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
