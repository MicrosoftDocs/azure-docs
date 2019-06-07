---
title: FROM clause
description: Learn about SQL FROM clause for Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: tisande

---
# <a id="FromClause"></a>FROM clause

The FROM (`FROM <from_specification>`) clause is optional, unless the source is filtered or projected later in the query. A query like `SELECT * FROM Families` enumerates over the entire `Families` container. You can also use the special identifier ROOT for the container instead of using the container name.

The FROM clause enforces the following rules per query:

* The container can be aliased, such as `SELECT f.id FROM Families AS f` or simply `SELECT f.id FROM Families f`. Here `f` is the alias for `Families`. AS is an optional keyword to alias the identifier.  

* Once aliased, the original source name cannot be bound. For example, `SELECT Families.id FROM Families f` is syntactically invalid because the identifier `Families` has been aliased and can't be resolved anymore.  

* All referenced properties must be fully qualified, to avoid any ambiguous bindings in the absence of strict schema adherence. For example, `SELECT id FROM Families f` is syntactically invalid because the property `id` isn't bound.

##  <a name="bk_syntax"></a> Syntax
  
```sql  
FROM <from_specification>  
  
<from_specification> ::=   
        <from_source> {[ JOIN <from_source>][,...n]}  
  
<from_source> ::=   
          <container_expression> [[AS] input_alias]  
        | input_alias IN <container_expression>  
  
<container_expression> ::=   
        ROOT   
     | container_name  
     | input_alias  
     | <container_expression> '.' property_name  
     | <container_expression> '[' "property_name" | array_index ']'  
```  
  
##  <a name="bk_arguments"></a> Arguments
  
- `<from_source>`  
  
  Specifies a data source, with or without an alias. If alias is not specified, it will be inferred from the `<container_expression>` using following rules:  
  
  -  If the expression is a container_name, then container_name will be used as an alias.  
  
  -  If the expression is `<container_expression>`, then property_name, then property_name will be used as an alias. If the expression is a container_name, then container_name will be used as an alias.  
  
- AS `input_alias`  
  
  Specifies that the `input_alias` is a set of values returned by the underlying container expression.  
 
- `input_alias` IN  
  
  Specifies that the `input_alias` should represent the set of values obtained by iterating over all array elements of each array returned by the underlying container expression. Any value returned by underlying container expression that is not an array is ignored.  
  
- `<container_expression>`  
  
  Specifies the container expression to be used to retrieve the documents.  
  
- `ROOT`  
  
  Specifies that document should be retrieved from the default, currently connected container.  
  
- `container_name`  
  
  Specifies that document should be retrieved from the provided container. The name of the container must match the name of the container currently connected to.  
  
- `input_alias`  
  
  Specifies that document should be retrieved from the other source defined by the provided alias.  
  
- `<container_expression> '.' property_`  
  
  Specifies that document should be retrieved by accessing the `property_name` property or array_index array element for all documents retrieved by specified container expression.  
  
- `<container_expression> '[' "property_name" | array_index ']'`  
  
  Specifies that document should be retrieved by accessing the `property_name` property or array_index array element for all documents retrieved by specified container expression.  
  
##  <a name="bk_remarks"></a> Remarks
  
All aliases provided or inferred in the `<from_source>(`s) must be unique. The Syntax `<container_expression>.`property_name is the same as `<container_expression>' ['"property_name"']'`. However, the latter syntax can be used if a property name contains a non-identifier character.  
  
### Handling missing properties, missing array elements, and undefined values
  
If a container expression accesses properties or array elements and that value does not exist, that value will be ignored and not processed further.  
  
### Container expression context scoping  
  
A container expression may be container-scoped or document-scoped:  
  
-   An expression is container-scoped, if the underlying source of the container expression is either ROOT or `container_name`. Such an expression represents a set of documents retrieved from the container directly, and is not dependent on the processing of other container expressions.  
  
-   An expression is document-scoped, if the underlying source of the container expression is `input_alias` introduced earlier in the query. Such an expression represents a set of documents obtained by evaluating the container expression in the scope of each document belonging to the set associated with the aliased container.  The resulting set will be a union of sets obtained by evaluating the container expression for each of the documents in the underlying set. 

##  <a name="bk_examples"></a> Examples

### Get subitems by using the FROM clause

The FROM clause can reduce the source to a smaller subset. To enumerate only a subtree in each item, the subroot can become the source, as shown in the following example:

```sql
    SELECT *
    FROM Families.children
```

The results are:

```json
    [
      [
        {
            "firstName": "Henriette Thaulow",
            "gender": "female",
            "grade": 5,
            "pets": [
              {
                  "givenName": "Fluffy"
              }
            ]
        }
      ],
      [
       {
            "familyName": "Merriam",
            "givenName": "Jesse",
            "gender": "female",
            "grade": 1
        },
        {
            "familyName": "Miller",
            "givenName": "Lisa",
            "gender": "female",
            "grade": 8
        }
      ]
    ]
```

The preceding query used an array as the source, but you can also use an object as the source. The query considers any valid, defined JSON value in the source for inclusion in the result. The following example would exclude `Families` that don’t have an `address.state` value.

```sql
    SELECT *
    FROM Families.address.state
```

The results are:

```json
    [
      "WA",
      "NY"
    ]
```

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