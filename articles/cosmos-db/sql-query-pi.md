---
title: PI in Azure Cosmos DB query language
description: Learn about SQL system function PI in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# PI (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

 Returns the constant value of PI.  
  
## Syntax
  
```sql
PI ()  
```  
   
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the value of `PI`.  
  
```sql
SELECT PI() AS pi 
```  
  
 Here is the result set.  
  
```json
[{"pi": 3.1415926535897931}]  
```  

## Next steps

- [Mathematical functions Azure Cosmos DB](sql-query-mathematical-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
