---
title: INDEX_OF in Azure Cosmos DB query language
description: Learn about SQL system function INDEX_OF in Azure Cosmos DB.
author: ginamr
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 09/13/2019
ms.author: girobins
ms.custom: query-reference
---
# INDEX_OF (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

 Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.  
  
## Syntax
  
```sql
INDEX_OF(<str_expr1>, <str_expr2> [, <numeric_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the string expression to search for.  

*numeric_expr*
   Optional numeric expression that sets the position the search will start. The first position in *str_expr1* is 0. 
  
## Return types
  
  Returns a numeric expression.  
  
## Examples
  
  The following example returns the index of various substrings inside "abc".  
  
```sql
SELECT INDEX_OF("abc", "ab") AS i1, INDEX_OF("abc", "b") AS i2, INDEX_OF("abc", "c") AS i3 
```  
  
 Here is the result set.  
  
```json
[{"i1": 0, "i2": 1, "i3": -1}]  
```  

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
