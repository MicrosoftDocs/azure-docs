---
title: ORDER BY clause in Azure Cosmos DB
description: Learn about SQL ORDER BY clause for Azure Cosmos DB. Use SQL as an Azure Cosmos DB JSON query language.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: mjbrown

---
# ORDER BY clause in Azure Cosmos DB

The optional ORDER BY clause specifies the sorting order for results returned by the query.

## Syntax
  
```sql  
ORDER BY <sort_specification>  
<sort_specification> ::= <sort_expression> [, <sort_expression>]  
<sort_expression> ::= {<scalar_expression> [ASC | DESC]} [ ,...n ]  
```  

## Arguments
  
- `<sort_specification>`  
  
   Specifies a property or expression on which to sort the query result set. A sort column can be specified as a name or property alias.  
  
   Multiple properties can be specified. Property names must be unique. The sequence of the sort properties in the ORDER BY clause defines the organization of the sorted result set. That is, the result set is sorted by the first property and then that ordered list is sorted by the second property, and so on.  
  
   The property names referenced in the ORDER BY clause must correspond to either a property in the select list or to a property defined in the collection specified in the FROM clause without any ambiguities.  
  
- `<sort_expression>`  
  
   Specifies one or more properties or expressions on which to sort the query result set.  
  
- `<scalar_expression>`  
  
   See the [Scalar expressions](sql-query-scalar-expressions.md) section for details.  
  
- `ASC | DESC`  
  
   Specifies that the values in the specified column should be sorted in ascending or descending order. ASC sorts from the lowest value to highest value. DESC sorts from highest value to lowest value. ASC is the default sort order. Null values are treated as the lowest possible values.  
  
## Remarks  
  
   The ORDER BY clause requires that the indexing policy include an index for the fields being sorted. The Azure Cosmos DB query runtime supports sorting against a property name and not against computed properties. Azure Cosmos DB supports multiple ORDER BY properties. In order to run a query with multiple ORDER BY properties, you should define a [composite index](index-policy.md#composite-indexes) on the fields being sorted.
   
> [!Note] 
> If the properties being sorted against might be undefined for some documents and you want to retrieve them in an ORDER BY query, you must explicitly create an index on those properties. The default indexing policy won't allow for the retrieval of the documents where the sort property is undefined.

## Examples

For example, here's a query that retrieves families in ascending order of the resident city's name:

```sql
    SELECT f.id, f.address.city
    FROM Families f
    ORDER BY f.address.city
```

The results are:

```json
    [
      {
        "id": "WakefieldFamily",
        "city": "NY"
      },
      {
        "id": "AndersenFamily",
        "city": "Seattle"
      }
    ]
```

The following query retrieves family `id`s in order of their item creation date. Item `creationDate` is a number representing the *epoch time*, or elapsed time since Jan. 1, 1970 in seconds.

```sql
    SELECT f.id, f.creationDate
    FROM Families f
    ORDER BY f.creationDate DESC
```

The results are:

```json
    [
      {
        "id": "WakefieldFamily",
        "creationDate": 1431620462
      },
      {
        "id": "AndersenFamily",
        "creationDate": 1431620472
      }
    ]
```

Additionally, you can order by multiple properties. A query that orders by multiple properties requires a [composite index](index-policy.md#composite-indexes). Consider the following query:

```sql
    SELECT f.id, f.creationDate
    FROM Families f
    ORDER BY f.address.city ASC, f.creationDate DESC
```

This query retrieves the family `id` in ascending order of the city name. If multiple items have the same city name, the query will order by the `creationDate` in descending order.

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [OFFSET LIMIT clause](sql-query-offset-limit.md)
