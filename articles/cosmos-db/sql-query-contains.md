---
title: Contains in Azure Cosmos DB query language
description: Learn about how the CONTAINS SQL system function in Azure Cosmos DB returns a Boolean indicating whether the first string expression contains the second
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: girobins
ms.custom: query-reference
---
# CONTAINS (Azure Cosmos DB)

Returns a Boolean indicating whether the first string expression contains the second.  
  
## Syntax
  
```sql
CONTAINS(<str_expr1>, <str_expr2> [, <bool_expr>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the string expression to find.  

*bool_expr*
    Optional value for ignoring case. When set to true, CONTAINS will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
  The following example checks if "abc" contains "ab" and if "abc" contains "A".  
  
```sql
SELECT CONTAINS("abc", "ab", false) AS c1, CONTAINS("abc", "A", false) AS c2, CONTAINS("abc", "A", true) AS c3
```  
  
 Here is the result set.  
  
```json
[
    {
        "c1": true,
        "c2": false,
        "c3": true
    }
]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

The RU consumption of Contains will increase as the cardinality of the property in the system function increases. In other words, if you are checking whether a property value contains a certain string, the query RU charge will depend on the number of possible values for that property.

For example, consider two properties: town and country. The cardinality of town is 5,000 and the cardinality of country is 200. Here are two example queries:

```sql
    SELECT * FROM c WHERE CONTAINS(c.town, "Red", false)
```

```sql
    SELECT * FROM c WHERE CONTAINS(c.country, "States", false)
```

The first query will likely use more RUs than the second query because the cardinality of town is higher than country.

If the property size in Contains is greater than 1 KB for some documents, the query engine will need to load those documents. In this case, the query engine won't be able to fully evaluate Contains with an index. The RU charge for Contains will be high if you have a large number of documents with property sizes more than 1 KB.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
