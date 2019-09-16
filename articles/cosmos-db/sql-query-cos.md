---
title: COS (Azure Cosmos DB)
description: Learn about SQL system function COS in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# COS (Azure Cosmos DB)
 Returns the trigonometric cosine of the specified angle, in radians, in the specified expression.  
  
## Syntax
  
```sql
COS(<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example calculates the COS of the specified angle.  
  
```sql
SELECT COS(14.78) AS cos  
```  
  
 Here is the result set.  
  
```json
[{"cos": -0.59946542619465426}]  
```  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
