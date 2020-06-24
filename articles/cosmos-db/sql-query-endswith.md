---
title: EndsWith in Azure Cosmos DB query language
description: Learn about the ENDSWITH SQL system function in Azure Cosmos DB to return a Boolean indicating whether the first string expression ends with the second
author: ginamr
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: girobins
ms.custom: query-reference
---
# ENDSWITH (Azure Cosmos DB)

Returns a Boolean indicating whether the first string expression ends with the second.  
  
## Syntax
  
```sql
ENDSWITH(<str_expr1>, <str_expr2> [, <bool_expr>])
```  
  
## Arguments
  
*str_expr1*  
   Is a string expression.  
  
*str_expr2*  
   Is a string expression to be compared to the end of *str_expr1*.

*bool_expr*
    Optional value for ignoring case. When set to true, ENDSWITH will do a case-insensitive search. When unspecified, this value is false.
  
## Return types
  
  Returns a Boolean expression.  
  
## Examples
  
The following example checks if the string "abc" ends with "b" and "bC".  
  
```sql
SELECT ENDSWITH("abc", "b", false) AS e1, ENDSWITH("abc", "bC", false) AS e2, ENDSWITH("abc", "bC", true) AS e3
```  
  
 Here is the result set.  
  
```json
[
    {
        "e1": false,
        "e2": false,
        "e3": true
    }
]
```  

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy).

The RU consumption of EndsWith will increase as the cardinality of the property in the system function increases. In other words, if you are checking whether a property value ends with a certain string, the query RU charge will depend on the number of possible values for that property.

For example, consider two properties: town and country. The cardinality of town is 5,000 and the cardinality of country is 200. Here are two example queries:

```sql
    SELECT * FROM c WHERE ENDSWITH(c.town, "York", false)
```

```sql
    SELECT * FROM c WHERE ENDSWITH(c.country, "States", false)
```

The first query will likely use more RUs than the second query because the cardinality of town is higher than country.

If the property size in EndsWith is greater than 1 KB for some documents, the query engine will need to load those documents. In this case, the query engine won't be able to fully evaluate EndsWith with an index. The RU charge for EndsWith will be high if you have a large number of documents with property sizes greater than 1 KB.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
