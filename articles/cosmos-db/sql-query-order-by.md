---
title: ORDER BY clause
description: Learn about SQL ORDER BY clause for Azure Cosmos DB. Use SQL as an Azure Cosmos DB JSON query language.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: mjbrown

---
# <a id="OrderByClause"></a>ORDER BY clause

 Specifies the sorting order for results returned by the query. 

##  <a name="bk_syntax"></a> Syntax
  
```sql  
ORDER BY <sort_specification>  
<sort_specification> ::= <sort_expression> [, <sort_expression>]  
<sort_expression> ::= {<scalar_expression> [ASC | DESC]} [ ,...n ]  
  
```  

##  <a name="bk_arguments"></a> Arguments
  
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
  
##  <a name="bk_remarks"></a> Remarks  
  
   The ORDER BY clause requires that the indexing policy include an index for the fields being sorted. The Azure Cosmos DB query runtime supports sorting against a property name and not against computed properties. Azure Cosmos DB supports multiple ORDER BY properties. In order to run a query with multiple ORDER BY properties, you should define a [composite index](index-policy.md#composite-indexes) on the fields being sorted.

##  <a name="bk_examples"></a> Examples

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

This query retrieves the family `id`  in ascending order of the city name. If multiple items have the same city name, the query will order by the `creationDate` in descending order.

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [Javascript Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 
- Graefe, Goetz. [Query evaluation techniques for large databases](https://dl.acm.org/citation.cfm?id=152611). *ACM Computing Surveys* 25, no. 2 (1993).
- Graefe, G. "The Cascades framework for query optimization." *IEEE Data Eng. Bull.* 18, no. 3 (1995).
- Lu, Ooi, Tan. "Query Processing in Parallel Relational Database Systems." *IEEE Computer Society Press* (1994).
- Olston, Christopher, Benjamin Reed, Utkarsh Srivastava, Ravi Kumar, and Andrew Tomkins. "Pig Latin: A Not-So-Foreign Language for Data Processing." *SIGMOD* (2008).

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]

[1]: ./media/how-to-sql-query/sql-query1.png
[introduction]: introduction.md
[consistency-levels]: consistency-levels.md