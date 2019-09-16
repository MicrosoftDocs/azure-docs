---
title: DEGREES (Azure Cosmos DB)
description: Learn about SQL system function DEGREES in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
---
# DEGREES (Azure Cosmos DB)
 Returns the corresponding angle in degrees for an angle specified in radians.  
  
## Syntax
  
```sql
DEGREES (<numeric_expression>)  
```  
  
## Arguments
  
*numeric_expression*  
   Is a numeric expression.  
  
## Return Types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the number of degrees in an angle of PI/2 radians.  
  
```sql
SELECT DEGREES(PI()/2) AS degrees  
```  
  
 Here is the result set.  
  
```json
[{"degrees": 90}]  
```  

## See Also

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
