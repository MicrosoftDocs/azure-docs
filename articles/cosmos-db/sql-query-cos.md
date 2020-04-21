---
title: COS in Azure Cosmos DB query language
description: Learn about how the Cosine (COS) SQL system function in Azure Cosmos DB returns the trigonometric cosine of the specified angle, in radians, in the specified expression
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: girobins
ms.custom: query-reference
---
# COS (Azure Cosmos DB)
 Returns the trigonometric cosine of the specified angle, in radians, in the specified expression.  
  
## Syntax
  
```sql
COS(<numeric_expr>)  
```  
  
## Arguments
  
*numeric_expr*  
   Is a numeric expression.  
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the `COS` of the specified angle.  
  
```sql
SELECT COS(14.78) AS cos  
```  
  
 Here is the result set.  
  
```json
[{"cos": -0.59946542619465426}]  
```  

## Remarks

This system function will not utilize the index.

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
