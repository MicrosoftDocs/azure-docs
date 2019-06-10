---
title: WHERE clause
description: Learn about SQL WHERE clause for Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# <a id="WhereClause"></a>WHERE clause

The optional WHERE clause (`WHERE <filter_condition>`) specifies condition(s) that the source JSON items must satisfy for the query to include them in results. A JSON item must evaluate the specified conditions to `true` to be considered for the result. The index layer uses the WHERE clause to determine the smallest subset of source items that can be part of the result. 
  
##  <a name="bk_syntax"></a> Syntax
  
```sql  
WHERE <filter_condition>  
<filter_condition> ::= <scalar_expression>  
  
```  
  
##  <a name="bk_arguments"></a> Arguments

- `<filter_condition>`  
  
   Specifies the condition to be met for the documents to be returned.  
  
- `<scalar_expression>`  
  
   Expression representing the value to be computed. See [Scalar expressions](sql-query-scalar-expressions.md) for details.  
  

##  <a name="bk_remarks"></a> Remarks
  
  In order for the document to be returned an expression specified as filter condition must evaluate to true. Only Boolean value true will satisfy the condition, any other value: undefined, null, false, Number, Array, or Object will not satisfy the condition.  
##  <a name="bk_examples"></a> Examples

The following query requests items that contain an `id` property whose value is `AndersenFamily`. It excludes any item that does not have an `id` property or whose value doesn't match `AndersenFamily`.

```sql
    SELECT f.address
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "address": {
        "state": "WA",
        "county": "King",
        "city": "Seattle"
      }
    }]
```

### Scalar expressions in the WHERE clause

The previous example showed a simple equality query. The SQL API also supports various [scalar expressions](sql-query-scalar-expressions.md). The most commonly used are binary and unary expressions. Property references from the source JSON object are also valid expressions.

You can use the following supported binary operators:  

|**Operator type**  | **Values** |
|---------|---------|
|Arithmetic | +,-,*,/,% |
|Bitwise    | \|, &, ^, <<, >>, >>> (zero-fill right shift) |
|Logical    | AND, OR, NOT      |
|Comparison | =, !=, &lt;, &gt;, &lt;=, &gt;=, <> |
|String     |  \|\| (concatenate) |

The following queries use binary operators:

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE c.grade % 2 = 1     -- matching grades == 5, 1

    SELECT *
    FROM Families.children[0] c
    WHERE c.grade ^ 4 = 1    -- matching grades == 5

    SELECT *
    FROM Families.children[0] c
    WHERE c.grade >= 5    -- matching grades == 5
```

You can also use the unary operators +,-, ~, and NOT in queries, as shown in the following examples:

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE NOT(c.grade = 5)  -- matching grades == 1

    SELECT *
    FROM Families.children[0] c
    WHERE (-c.grade = -5)  -- matching grades == 5
```

You can also use property references in queries. For example, `SELECT * FROM Families f WHERE f.isRegistered` returns the JSON item containing the property `isRegistered` with value equal to `true`. Any other value, such as `false`, `null`, `Undefined`, `<number>`, `<string>`, `<object>`, or `<array>`, excludes the item from the result. 

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