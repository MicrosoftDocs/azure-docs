---
title: SQL queries for Azure Cosmos DB
description: Learn about SQL syntax, database concepts, and SQL queries for Azure Cosmos DB. Use SQL as an Azure Cosmos DB JSON query language.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/28/2019
ms.author: mjbrown

---
# SQL query examples for Azure Cosmos DB

Azure Cosmos DB SQL API accounts support querying items using Structured Query Language (SQL) as a JSON query language. The design goals of the Azure Cosmos DB query language are to:

* Support SQL, one of the most familiar and popular query languages, instead of inventing a new query language. SQL provides a formal programming model for rich queries over JSON items.  

* Use JavaScript's programming model as the foundation for the query language. JavaScript's type system, expression evaluation, and function invocation are the roots of the SQL API. These roots provide a natural programming model for features like relational projections, hierarchical navigation across JSON items, self-joins, spatial queries, and invocation of user-defined functions (UDFs) written entirely in JavaScript.

This article walks you through some example SQL queries on simple JSON items. To learn more about Azure Cosmos DB SQL language syntax, see [SQL syntax reference](sql-api-query-reference.md).

## <a id="GettingStarted"></a>Get started with SQL queries

In your SQL API Cosmos DB account, create a container called `Families`. Create two simple JSON items in the container, and run a few simple queries against them.

### Create JSON items

The following code creates two simple JSON items about families. The simple JSON items for the Andersen and Wakefield families include parents, children and their pets, address, and registration information. The first item has strings, numbers, Booleans, arrays, and nested properties.


```json
{
  "id": "AndersenFamily",
  "lastName": "Andersen",
  "parents": [
     { "firstName": "Thomas" },
     { "firstName": "Mary Kay"}
  ],
  "children": [
     {
         "firstName": "Henriette Thaulow",
         "gender": "female",
         "grade": 5,
         "pets": [{ "givenName": "Fluffy" }]
     }
  ],
  "address": { "state": "WA", "county": "King", "city": "Seattle" },
  "creationDate": 1431620472,
  "isRegistered": true
}
```

The second item uses `givenName` and `familyName` instead of `firstName` and `lastName`.

```json
{
  "id": "WakefieldFamily",
  "parents": [
      { "familyName": "Wakefield", "givenName": "Robin" },
      { "familyName": "Miller", "givenName": "Ben" }
  ],
  "children": [
      {
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female", 
        "grade": 1,
        "pets": [
            { "givenName": "Goofy" },
            { "givenName": "Shadow" }
        ]
      },
      { 
        "familyName": "Miller",
         "givenName": "Lisa",
         "gender": "female",
         "grade": 8 }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

### Query the JSON items

Try a few queries against the JSON data to understand some of the key aspects of Azure Cosmos DB's SQL query language.

The following query returns the items where the `id` field matches `AndersenFamily`. Since it's a `SELECT *` query, the output of the query is the complete JSON item. For more information about SELECT syntax, see [SELECT statement](sql-api-query-reference.md#select-query). 

```sql
    SELECT *
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The query results are: 

```json
    [{
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
           { "firstName": "Thomas" },
           { "firstName": "Mary Kay"}
        ],
        "children": [
           {
               "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
               "pets": [{ "givenName": "Fluffy" }]
           }
        ],
        "address": { "state": "WA", "county": "King", "city": "Seattle" },
        "creationDate": 1431620472,
        "isRegistered": true
    }]
```

The following query reformats the JSON output into a different shape. The query projects a new JSON `Family` object with two selected fields, `Name` and `City`, when the address city is the same as the state. "NY, NY" matches this case.

```sql
    SELECT {"Name":f.id, "City":f.address.city} AS Family
    FROM Families f
    WHERE f.address.city = f.address.state
```

The query results are:

```json
    [{
        "Family": {
            "Name": "WakefieldFamily",
            "City": "NY"
        }
    }]
```

The following query returns all the given names of children in the family whose `id` matches `WakefieldFamily`, ordered by city.

```sql
    SELECT c.givenName
    FROM Families f
    JOIN c IN f.children
    WHERE f.id = 'WakefieldFamily'
    ORDER BY f.address.city ASC
```

The results are:

```json
    [
      { "givenName": "Jesse" },
      { "givenName": "Lisa"}
    ]
```

The preceding examples show several aspects of the Cosmos DB query language:  

* Since SQL API works on JSON values, it deals with tree-shaped entities instead of rows and columns. You can refer to the tree nodes at any arbitrary depth, like `Node1.Node2.Node3…..Nodem`, similar to the two-part reference of `<table>.<column>` in ANSI SQL.

* Because the query language works with schemaless data, the type system must be bound dynamically. The same expression could yield different types on different items. The result of a query is a valid JSON value, but isn't guaranteed to be of a fixed schema.  

* Azure Cosmos DB supports strict JSON items only. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).  

* A Cosmos DB container is a schema-free collection of JSON items. The relations within and across container items are implicitly captured by containment, not by primary key and foreign key relations. This feature is important for the intra-item joins discussed later in this article.

## <a id="SelectClause"></a>SELECT clause

Every query consists of a SELECT clause and optional FROM and WHERE clauses, per ANSI SQL standards. Typically, the source in the FROM clause is enumerated, and the WHERE clause applies a filter on the source to retrieve a subset of JSON items. The SELECT clause then projects the requested JSON values in the select list. For more information about the syntax, see [SELECT statement](sql-api-query-reference.md#select-query).

The following SELECT query example returns `address` from `Families` whose `id` matches `AndersenFamily`:

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

## <a id="EscapingReservedKeywords"></a>Quoted property accessor
You can access properties using the quoted property operator []. For example, `SELECT c.grade` and `SELECT c["grade"]` are equivalent. This syntax is useful to escape a property that contains spaces, special characters, or has the same name as a SQL keyword or reserved word.

```sql
    SELECT f["lastName"]
    FROM Families f
    WHERE f["id"] = "AndersenFamily"
```

## Nested properties

The following example projects two nested properties, `f.address.state` and `f.address.city`.

```sql
    SELECT f.address.state, f.address.city
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "state": "WA",
      "city": "Seattle"
    }]
```

## JSON expressions

Projection also supports JSON expressions, as shown in the following example:

```sql
    SELECT { "state": f.address.state, "city": f.address.city, "name": f.id }
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "$1": {
        "state": "WA",
        "city": "Seattle",
        "name": "AndersenFamily"
      }
    }]
```

In the preceding example, the SELECT clause needs to create a JSON object, and since the sample provides no key, the clause uses the implicit argument variable name `$1`. The following query returns two implicit argument variables: `$1` and `$2`.

```sql
    SELECT { "state": f.address.state, "city": f.address.city },
           { "name": f.id }
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "$1": {
        "state": "WA",
        "city": "Seattle"
      }, 
      "$2": {
        "name": "AndersenFamily"
      }
    }]
```

## <a id="ValueKeyword"></a>VALUE keyword

The VALUE keyword provides a way to return the JSON value alone. For example, the query shown below returns the scalar expression `"Hello World"` instead of `{$1: "Hello World"}`:

```sql
    SELECT VALUE "Hello World"
```

The following query returns the JSON values without the `address` label:

```sql
    SELECT VALUE f.address
    FROM Families f
```

The results are:

```json
    [
      {
        "state": "WA",
        "county": "King",
        "city": "Seattle"
      }, 
      {
        "state": "NY", 
        "county": "Manhattan",
        "city": "NY"
      }
    ]
```

The following example shows how to return JSON primitive values (the leaf level of the JSON tree):


```sql
    SELECT VALUE f.address.state
    FROM Families f
```

The results are:

```json
    [
      "WA",
      "NY"
    ]
```

## <a id="DistinctKeyword"></a>DISTINCT Keyword

The DISTINCT keyword eliminates duplicates in the query's projection.

```sql
SELECT DISTINCT VALUE f.lastName
FROM Families f
```

In this example, the query projects values for each last name.

The results are:

```json
[
    "Andersen"
]
```

You can also project unique objects. In this case, the lastName field does not exist in one of the two documents, so the query returns an empty object.

```sql
SELECT DISTINCT f.lastName
FROM Families f
```

The results are:

```json
[
    {
        "lastName": "Andersen"
    },
    {}
]
```

DISTINCT can also be used in the projection within a subquery:

```sql
SELECT f.id, ARRAY(SELECT DISTINCT VALUE c.givenName FROM c IN f.children) as ChildNames
FROM f
```

This query projects an array which contains each child's givenName with duplicates removed. This array is aliased as ChildNames and projected in the outer query.

The results are:

```json
[
    {
        "id": "AndersenFamily",
        "ChildNames": []
    },
    {
        "id": "WakefieldFamily",
        "ChildNames": [
            "Jesse",
            "Lisa"
        ]
    }
]
```

## Aliasing

You can explicitly alias values in queries. If a query has two properties with the same name, use aliasing to rename one or both of the properties so they're disambiguated in the projected result.

The AS keyword used for aliasing is optional, as shown in the following example when projecting the second value as `NameInfo`:

```sql
    SELECT 
           { "state": f.address.state, "city": f.address.city } AS AddressInfo,
           { "name": f.id } NameInfo
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "AddressInfo": {
        "state": "WA",
        "city": "Seattle"
      },
      "NameInfo": {
        "name": "AndersenFamily"
      }
    }]
```

## <a id="FromClause"></a>FROM clause

The FROM (`FROM <from_specification>`) clause is optional, unless the source is filtered or projected later in the query. For more information about the syntax, see [FROM syntax](sql-api-query-reference.md#bk_from_clause). A query like `SELECT * FROM Families` enumerates over the entire `Families` container. You can also use the special identifier ROOT for the container instead of using the container name.

The FROM clause enforces the following rules per query:

* The container can be aliased, such as `SELECT f.id FROM Families AS f` or simply `SELECT f.id FROM Families f`. Here `f` is the alias for `Families`. AS is an optional keyword to alias the identifier.  

* Once aliased, the original source name cannot be bound. For example, `SELECT Families.id FROM Families f` is syntactically invalid because the identifier `Families` has been aliased and can't be resolved anymore.  

* All referenced properties must be fully qualified, to avoid any ambiguous bindings in the absence of strict schema adherence. For example, `SELECT id FROM Families f` is syntactically invalid because the property `id` isn't bound.

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

## <a id="WhereClause"></a>WHERE clause

The optional WHERE clause (`WHERE <filter_condition>`) specifies condition(s) that the source JSON items must satisfy for the query to include them in results. A JSON item must evaluate the specified conditions to `true` to be considered for the result. The index layer uses the WHERE clause to determine the smallest subset of source items that can be part of the result. For more information about the syntax, see [WHERE syntax](sql-api-query-reference.md#bk_where_clause).

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

The previous example showed a simple equality query. The SQL API also supports various [scalar expressions](#scalar-expressions). The most commonly used are binary and unary expressions. Property references from the source JSON object are also valid expressions.

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

### Equality and comparison operators

The following table shows the result of equality comparisons in the SQL API between any two JSON types.

| **Op** | **Undefined** | **Null** | **Boolean** | **Number** | **String** | **Object** | **Array** |
|---|---|---|---|---|---|---|---|
| **Undefined** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Null** | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Boolean** | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined |
| **Number** | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined |
| **String** | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined |
| **Object** | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined |
| **Array** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** |

For comparison operators such as `>`, `>=`, `!=`, `<`, and `<=`, comparison across types or between two objects or arrays produces `Undefined`.  

If the result of the scalar expression is `Undefined`, the item isn't included in the result, because `Undefined` doesn't equal `true`.

### Logical (AND, OR and NOT) operators

Logical operators operate on Boolean values. The following tables show the logical truth tables for these operators:

**OR operator**

| OR | True | False | Undefined |
| --- | --- | --- | --- |
| True |True |True |True |
| False |True |False |Undefined |
| Undefined |True |Undefined |Undefined |

**AND operator**

| AND | True | False | Undefined |
| --- | --- | --- | --- |
| True |True |False |Undefined |
| False |False |False |False |
| Undefined |Undefined |False |Undefined |

**NOT operator**

| NOT |  |
| --- | --- |
| True |False |
| False |True |
| Undefined |Undefined |

## BETWEEN keyword

As in ANSI SQL, you can use the BETWEEN keyword to express queries against ranges of string or numerical values. For example, the following query returns all items in which the first child's grade is 1-5, inclusive.

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE c.grade BETWEEN 1 AND 5
```

Unlike in ANSI SQL, you can also use the BETWEEN clause in the FROM clause, as in the following example.

```sql
    SELECT (c.grade BETWEEN 0 AND 10)
    FROM Families.children[0] c
```

In SQL API, unlike ANSI SQL, you can express range queries against properties of mixed types. For example, `grade` might be a number like `5` in some items and a string  like `grade4` in others. In these cases, as in JavaScript, the comparison between the two different types results in `Undefined`, so the item is skipped.

> [!TIP]
> For faster query execution times, create an indexing policy that uses a range index type against any numeric properties or paths that the BETWEEN clause filters.

## IN keyword

Use the IN keyword to check whether a specified value matches any value in a list. For example, the following query returns all family items where the `id` is `WakefieldFamily` or `AndersenFamily`.

```sql
    SELECT *
    FROM Families
    WHERE Families.id IN ('AndersenFamily', 'WakefieldFamily')
```

The following example returns all items where the state is any of the specified values:

```sql
    SELECT *
    FROM Families
    WHERE Families.address.state IN ("NY", "WA", "CA", "PA", "OH", "OR", "MI", "WI", "MN", "FL")
```

## * operator

The special operator * projects the entire item as is. When used, it must be the only projected field. A query like `SELECT * FROM Families f` is valid, but `SELECT VALUE * FROM Families f` and  `SELECT *, f.id FROM Families f` are not valid. The [first query in this article](#query-the-json-items) used the * operator. 

## ? and ?? operators

You can use the Ternary (?) and Coalesce (??) operators to build conditional expressions, as in programming languages like C# and JavaScript. 

You can use the ? operator to construct new JSON properties on the fly. For example, the following query classifies grade levels into `elementary` or `other`:

```sql
     SELECT (c.grade < 5)? "elementary": "other" AS gradeLevel
     FROM Families.children[0] c
```

You can also nest calls to the ? operator, as in the following query: 

```sql
    SELECT (c.grade < 5)? "elementary": ((c.grade < 9)? "junior": "high") AS gradeLevel
    FROM Families.children[0] c
```

As with other query operators, the ? operator excludes items if the referenced properties are missing or the types being compared are different.

Use the ?? operator to efficiently check for a property in an item when querying against semi-structured or mixed-type data. For example, the following query returns `lastName` if present, or `surname` if `lastName` isn't present.

```sql
    SELECT f.lastName ?? f.surname AS familyName
    FROM Families f
```

## <a id="TopKeyword"></a>TOP operator

The TOP keyword returns the first `N` number of query results in an undefined order. As a best practice, use TOP with the ORDER BY clause to limit results to the first `N` number of ordered values. Combining these two clauses is the only way to predictably indicate which rows TOP affects.

You can use TOP with a constant value, as in the following example, or with a variable value using parameterized queries. For more information, see the [Parameterized queries](#parameterized-queries) section.

```sql
    SELECT TOP 1 *
    FROM Families f
```

The results are:

```json
    [{
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
           { "firstName": "Thomas" },
           { "firstName": "Mary Kay"}
        ],
        "children": [
           {
               "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
               "pets": [{ "givenName": "Fluffy" }]
           }
        ],
        "address": { "state": "WA", "county": "King", "city": "Seattle" },
        "creationDate": 1431620472,
        "isRegistered": true
    }]
```

## <a id="OrderByClause"></a>ORDER BY clause

As in ANSI SQL, you can include an optional ORDER BY clause in queries. The optional ASC or DESC argument specifies whether to retrieve results in ascending or descending order. ASC is the default.

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

## <a id="OffsetLimitClause"></a>OFFSET LIMIT clause

OFFSET LIMIT is an optional clause to skip then take some number of values from the query. The OFFSET count and the LIMIT count are required in the OFFSET LIMIT clause. Currently this clause is supported for queries within a single partition only, cross-partition queries don't yet support it. 

When OFFSET LIMIT is used in conjunction with an ORDER BY clause, the result set is produced by doing skip and take on the ordered values. If no ORDER BY clause is used, it will result in a deterministic order of values.

For example, here's a query that skips the first value and returns the second value (in order of the resident city's name):

```sql
    SELECT f.id, f.address.city
    FROM Families f
    ORDER BY f.address.city
    OFFSET 1 LIMIT 1
```

The results are:

```json
    [
      {
        "id": "AndersenFamily",
        "city": "Seattle"
      }
    ]
```

Here's a query that skips the first value and returns the second value (without ordering):

```sql
   SELECT f.id, f.address.city
    FROM Families f
    OFFSET 1 LIMIT 1
```

The results are:

```json
    [
      {
        "id": "WakefieldFamily",
        "city": "Seattle"
      }
    ]
```




## Scalar expressions

The SELECT clause supports scalar expressions like constants, arithmetic expressions, and logical expressions. The following query uses a scalar expression:


```sql
    SELECT ((2 + 11 % 7)-2)/3
```

The results are:

```json
    [{
      "$1": 1.33333
    }]
```

In the following query, the result of the scalar expression is a Boolean:


```sql
    SELECT f.address.city = f.address.state AS AreFromSameCityState
    FROM Families f
```

The results are:

```json
    [
      {
        "AreFromSameCityState": false
      },
      {
        "AreFromSameCityState": true
      }
    ]
```

## Object and array creation

A key feature of the SQL API is array and object creation. The previous example created a new JSON object, `AreFromSameCityState`. You can also construct arrays, as shown in the following example:


```sql
    SELECT [f.address.city, f.address.state] AS CityState
    FROM Families f
```

The results are:

```json
    [
      {
        "CityState": [
          "Seattle",
          "WA"
        ]
      },
      {
        "CityState": [
          "NY", 
          "NY"
        ]
      }
    ]
```

The following SQL query is another example of using array within in subqueries. This query gets all the distinct  given names of children in an array.

```sql
SELECT f.id, ARRAY(SELECT DISTINCT VALUE c.givenName FROM c IN f.children) as ChildNames
FROM f
```


## <a id="Iteration"></a>Iteration

The SQL API provides support for iterating over JSON arrays, with a new construct added via the IN keyword in the FROM source. In the following example:

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
          "pets": [{ "givenName": "Fluffy"}]
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

The next query performs iteration over `children` in the `Families` container. The output array is different from the preceding query. This example splits `children`, and flattens the results into a single array:  

```sql
    SELECT *
    FROM c IN Families.children
```

The results are:

```json
    [
      {
          "firstName": "Henriette Thaulow",
          "gender": "female",
          "grade": 5,
          "pets": [{ "givenName": "Fluffy" }]
      },
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
```

You can filter further on each individual entry of the array, as shown in the following example:

```sql
    SELECT c.givenName
    FROM c IN Families.children
    WHERE c.grade = 8
```

The results are:

```json
    [{
      "givenName": "Lisa"
    }]
```

You can also aggregate over the result of an array iteration. For example, the following query counts the number of children among all families:

```sql
    SELECT COUNT(child)
    FROM child IN Families.children
```

The results are:

```json
    [
      {
        "$1": 3
      }
    ]
```

## <a id="Joins"></a>Joins

In a relational database, joins across tables are the logical corollary to designing normalized schemas. In contrast, the SQL API uses the denormalized data model of schema-free items, which is the logical equivalent of a *self-join*.

The language supports the syntax `<from_source1> JOIN <from_source2> JOIN ... JOIN <from_sourceN>`. This query returns a set of tuples with `N` values. Each tuple has values produced by iterating all container aliases over their respective sets. In other words, this query does a full cross product of the sets participating in the join.

The following examples show how the JOIN clause works. In the following example, the result is empty, since the cross product of each item from source and an empty set is empty:

```sql
    SELECT f.id
    FROM Families f
    JOIN f.NonExistent
```

The result is:

```json
    [{
    }]
```

In the following example, the join is a cross product between two JSON objects, the item root `id` and the `children` subroot. The fact that `children` is an array isn't effective in the join, because it deals with a single root that is the `children` array. The result contains only two results, because the cross product of each item with the array yields exactly only one item.

```sql
    SELECT f.id
    FROM Families f
    JOIN f.children
```

The results are:

```json
    [
      {
        "id": "AndersenFamily"
      },
      {
        "id": "WakefieldFamily"
      }
    ]
```

The following example shows a more conventional join:

```sql
    SELECT f.id
    FROM Families f
    JOIN c IN f.children
```

The results are:

```json
    [
      {
        "id": "AndersenFamily"
      },
      {
        "id": "WakefieldFamily"
      },
      {
        "id": "WakefieldFamily"
      }
    ]
```

The FROM source of the JOIN clause is an iterator. So, the flow in the preceding example is:  

1. Expand each child element `c` in the array.
2. Apply a cross product with the root of the item `f` with each child element `c` that the first step flattened.
3. Finally, project the root object `f` `id` property alone.

The first item, `AndersenFamily`, contains only one `children` element, so the result set contains only a single object. The second item, `WakefieldFamily`, contains two `children`, so the cross product produces two objects, one for each `children` element. The root fields in both these items are the same, just as you would expect in a cross product.

The real utility of the JOIN clause is to form tuples from the cross product in a shape that's otherwise difficult to project. The example below filters on the combination of a tuple that lets the user choose a condition satisfied by the tuples overall.

```sql
    SELECT 
        f.id AS familyName,
        c.givenName AS childGivenName,
        c.firstName AS childFirstName,
        p.givenName AS petName
    FROM Families f
    JOIN c IN f.children
    JOIN p IN c.pets
```

The results are:

```json
    [
      {
        "familyName": "AndersenFamily",
        "childFirstName": "Henriette Thaulow",
        "petName": "Fluffy"
      },
      {
        "familyName": "WakefieldFamily",
        "childGivenName": "Jesse",
        "petName": "Goofy"
      }, 
      {
       "familyName": "WakefieldFamily",
       "childGivenName": "Jesse",
       "petName": "Shadow"
      }
    ]
```

The following extension of the preceding example performs a double join. You could view the cross product as the following pseudo-code:

```
    for-each(Family f in Families)
    {
        for-each(Child c in f.children)
        {
            for-each(Pet p in c.pets)
            {
                return (Tuple(f.id AS familyName,
                  c.givenName AS childGivenName,
                  c.firstName AS childFirstName,
                  p.givenName AS petName));
            }
        }
    }
```

`AndersenFamily` has one child who has one pet, so the cross product yields one row (1\*1\*1) from this family. `WakefieldFamily` has two children, only one of whom has pets, but that child has two pets. The cross product for this family yields 1\*1\*2 = 2 rows.

In the next example, there is an additional filter on `pet`, which excludes all the tuples where the pet name is not `Shadow`. You can build tuples from arrays, filter on any of the elements of the tuple, and project any combination of the elements.

```sql
    SELECT 
        f.id AS familyName,
        c.givenName AS childGivenName,
        c.firstName AS childFirstName,
        p.givenName AS petName
    FROM Families f
    JOIN c IN f.children
    JOIN p IN c.pets
    WHERE p.givenName = "Shadow"
```

The results are:

```json
    [
      {
       "familyName": "WakefieldFamily",
       "childGivenName": "Jesse",
       "petName": "Shadow"
      }
    ]
```

## <a id="UserDefinedFunctions"></a>User-defined functions (UDFs)

The SQL API provides support for user-defined functions (UDFs). With scalar UDFs, you can pass in zero or many arguments and return a single argument result. The API checks each argument for being legal JSON values.  

The API extends the SQL syntax to support custom application logic using UDFs. You can register UDFs with the SQL API, and reference them in SQL queries. In fact, the UDFs are exquisitely designed to call from queries. As a corollary, UDFs do not have access to the context object like other JavaScript types, such as stored procedures and triggers. Queries are read-only, and can run either on primary or secondary replicas. UDFs, unlike other JavaScript types, are designed to run on secondary replicas.

The following example registers a UDF under an item container in the Cosmos DB database. The example creates a UDF whose name is `REGEX_MATCH`. It accepts two JSON string values, `input` and `pattern`, and checks if the first matches the pattern specified in the second using JavaScript's `string.match()` function.

```javascript
       UserDefinedFunction regexMatchUdf = new UserDefinedFunction
       {
           Id = "REGEX_MATCH",
           Body = @"function (input, pattern) {
                      return input.match(pattern) !== null;
                   };",
       };

       UserDefinedFunction createdUdf = client.CreateUserDefinedFunctionAsync(
           UriFactory.CreateDocumentCollectionUri("myDatabase", "families"),
           regexMatchUdf).Result;  
```

Now, use this UDF in a query projection. You must qualify UDFs with the case-sensitive prefix `udf.` when calling them from within queries.

```sql
    SELECT udf.REGEX_MATCH(Families.address.city, ".*eattle")
    FROM Families
```

The results are:

```json
    [
      {
        "$1": true
      },
      {
        "$1": false
      }
    ]
```

You can use the UDF qualified with the `udf.` prefix inside a filter, as in the following example:

```sql
    SELECT Families.id, Families.address.city
    FROM Families
    WHERE udf.REGEX_MATCH(Families.address.city, ".*eattle")
```

The results are:

```json
    [{
        "id": "AndersenFamily",
        "city": "Seattle"
    }]
```

In essence, UDFs are valid scalar expressions that you can use in both projections and filters.

To expand on the power of UDFs, look at another example with conditional logic:

```javascript
       UserDefinedFunction seaLevelUdf = new UserDefinedFunction()
       {
           Id = "SEALEVEL",
           Body = @"function(city) {
                   switch (city) {
                       case 'Seattle':
                           return 520;
                       case 'NY':
                           return 410;
                       case 'Chicago':
                           return 673;
                       default:
                           return -1;
                    }"
            };

            UserDefinedFunction createdUdf = await client.CreateUserDefinedFunctionAsync(
                UriFactory.CreateDocumentCollectionUri("myDatabase", "families"),
                seaLevelUdf);
```

The following example exercises the UDF:

```sql
    SELECT f.address.city, udf.SEALEVEL(f.address.city) AS seaLevel
    FROM Families f
```

The results are:

```json
     [
      {
        "city": "Seattle",
        "seaLevel": 520
      },
      {
        "city": "NY",
        "seaLevel": 410
      }
    ]
```

If the properties referred to by the UDF parameters aren't available in the JSON value, the parameter is considered as undefined and the UDF invocation is skipped. Similarly, if the result of the UDF is undefined, it's not included in the result.

As the preceding examples show, UDFs integrate the power of JavaScript language with the SQL API. UDFs provide a rich programmable interface to do complex procedural, conditional logic with the help of built-in JavaScript runtime capabilities. The SQL API provides the arguments to the UDFs for each source item at the current WHERE or SELECT clause stage of processing. The result is seamlessly incorporated in the overall execution pipeline. In summary, UDFs are great tools to do complex business logic as part of queries.

## <a id="Aggregates"></a>Aggregate functions

Aggregate functions perform a calculation on a set of values in the SELECT clause and return a single value. For example, the following query returns the count of items within the `Families` container:

```sql
    SELECT COUNT(1)
    FROM Families f
```

The results are:

```json
    [{
        "$1": 2
    }]
```

You can also return only the scalar value of the aggregate by using the VALUE keyword. For example, the following query returns the count of values as a single number:

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
```

The results are:

```json
    [ 2 ]
```

You can also combine aggregations with filters. For example, the following query returns the count of items with the address state of `WA`.

```sql
    SELECT VALUE COUNT(1)
    FROM Families f
    WHERE f.address.state = "WA"
```

The results are:

```json
    [ 1 ]
```

The SQL API supports the following aggregate functions. SUM and AVG operate on numeric values, and COUNT, MIN, and MAX work on numbers, strings, Booleans, and nulls.

| Function | Description |
|-------|-------------|
| COUNT | Returns the number of items in the expression. |
| SUM   | Returns the sum of all the values in the expression. |
| MIN   | Returns the minimum value in the expression. |
| MAX   | Returns the maximum value in the expression. |
| AVG   | Returns the average of the values in the expression. |

You can also aggregate over the results of an array iteration. For more information, see the [Iteration](#Iteration) section.

> [!NOTE]
> In the Azure portal's Data Explorer, aggregation queries may aggregate partial results over only one query page. The SDK produces a single cumulative value across all pages. To perform aggregation queries using code, you need .NET SDK 1.12.0, .NET Core SDK 1.1.0, or Java SDK 1.9.5 or above.
>

## <a id="BuiltinFunctions"></a>Built-in functions

Cosmos DB also supports a number of built-in functions for common operations, which you can use inside queries like user-defined functions (UDFs).

| Function group | Operations |
|---------|----------|
| Mathematical functions | ABS, CEILING, EXP, FLOOR, LOG, LOG10, POWER, ROUND, SIGN, SQRT, SQUARE, TRUNC, ACOS, ASIN, ATAN, ATN2, COS, COT, DEGREES, PI, RADIANS, SIN, TAN |
| Type-checking functions | IS_ARRAY, IS_BOOL, IS_NULL, IS_NUMBER, IS_OBJECT, IS_STRING, IS_DEFINED, IS_PRIMITIVE |
| String functions | CONCAT, CONTAINS, ENDSWITH, INDEX_OF, LEFT, LENGTH, LOWER, LTRIM, REPLACE, REPLICATE, REVERSE, RIGHT, RTRIM, STARTSWITH, SUBSTRING, UPPER |
| Array functions | ARRAY_CONCAT, ARRAY_CONTAINS, ARRAY_LENGTH, and ARRAY_SLICE |
| Spatial functions | ST_DISTANCE, ST_WITHIN, ST_INTERSECTS, ST_ISVALID, ST_ISVALIDDETAILED |

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

The main difference between Cosmos DB functions and ANSI SQL functions is that Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `unknown`, the item is skipped instead of returning an error.

### Mathematical functions

The mathematical functions each perform a calculation, based on input values that are provided as arguments, and return a numeric value. Here’s a table of supported built-in mathematical functions.

| Usage | Description |
|----------|--------|
| ABS (num_expr) | Returns the absolute (positive) value of the specified numeric expression. |
| CEILING (num_expr) | Returns the smallest integer value greater than, or equal to, the specified numeric expression. |
| FLOOR (num_expr) | Returns the largest integer less than or equal to the specified numeric expression. |
| EXP (num_expr) | Returns the exponent of the specified numeric expression. |
| LOG (num_expr, base) | Returns the natural logarithm of the specified numeric expression, or the logarithm using the specified base. |
| LOG10 (num_expr) | Returns the base-10 logarithmic value of the specified numeric expression. |
| ROUND (num_expr) | Returns a numeric value, rounded to the closest integer value. |
| TRUNC (num_expr) | Returns a numeric value, truncated to the closest integer value. |
| SQRT (num_expr) | Returns the square root of the specified numeric expression. |
| SQUARE (num_expr) | Returns the square of the specified numeric expression. |
| POWER (num_expr, num_expr) | Returns the power of the specified numeric expression to the value specified. |
| SIGN (num_expr) | Returns the sign value (-1, 0, 1) of the specified numeric expression. |
| ACOS (num_expr) | Returns the angle, in radians, whose cosine is the specified numeric expression; also called arccosine. |
| ASIN (num_expr) | Returns the angle, in radians, whose sine is the specified numeric expression. This function is also called arcsine. |
| ATAN (num_expr) | Returns the angle, in radians, whose tangent is the specified numeric expression. This function is also called arctangent. |
| ATN2 (num_expr) | Returns the angle, in radians, between the positive x-axis and the ray from the origin to the point (y, x), where x and y are the values of the two specified float expressions. |
| COS (num_expr) | Returns the trigonometric cosine of the specified angle, in radians, in the specified expression. |
| COT (num_expr) | Returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression. |
| DEGREES (num_expr) | Returns the corresponding angle in degrees for an angle specified in radians. |
| PI () | Returns the constant value of PI. |
| RADIANS (num_expr) | Returns radians when a numeric expression, in degrees, is entered. |
| SIN (num_expr) | Returns the trigonometric sine of the specified angle, in radians, in the specified expression. |
| TAN (num_expr) | Returns the tangent of the input expression, in the specified expression. |

You can run queries like the following example:

```sql
    SELECT VALUE ABS(-4)
```

The result is:

```json
    [4]
```

### Type-checking functions

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. Here’s a table of supported built-in type-checking functions:

| **Usage** | **Description** |
|-----------|------------|
| [IS_ARRAY (expr)](sql-api-query-reference.md#bk_is_array) | Returns a Boolean indicating if the type of the value is an array. |
| [IS_BOOL (expr)](sql-api-query-reference.md#bk_is_bool) | Returns a Boolean indicating if the type of the value is a Boolean. |
| [IS_NULL (expr)](sql-api-query-reference.md#bk_is_null) | Returns a Boolean indicating if the type of the value is null. |
| [IS_NUMBER (expr)](sql-api-query-reference.md#bk_is_number) | Returns a Boolean indicating if the type of the value is a number. |
| [IS_OBJECT (expr)](sql-api-query-reference.md#bk_is_object) | Returns a Boolean indicating if the type of the value is a JSON object. |
| [IS_STRING (expr)](sql-api-query-reference.md#bk_is_string) | Returns a Boolean indicating if the type of the value is a string. |
| [IS_DEFINED (expr)](sql-api-query-reference.md#bk_is_defined) | Returns a Boolean indicating if the property has been assigned a value. |
| [IS_PRIMITIVE (expr)](sql-api-query-reference.md#bk_is_primitive) | Returns a Boolean indicating if the type of the value is a string, number, Boolean, or null. |

Using these functions, you can run queries like the following example:

```sql
    SELECT VALUE IS_NUMBER(-4)
```

The result is:

```json
    [true]
```

### String functions

The following scalar functions perform an operation on a string input value and return a string, numeric, or Boolean value. Here's a table of built-in string functions:

| Usage | Description |
| --- | --- |
| [LENGTH (str_expr)](sql-api-query-reference.md#bk_length) | Returns the number of characters of the specified string expression. |
| [CONCAT (str_expr, str_expr [, str_expr])](sql-api-query-reference.md#bk_concat) | Returns a string that is the result of concatenating two or more string values. |
| [SUBSTRING (str_expr, num_expr, num_expr)](sql-api-query-reference.md#bk_substring) | Returns part of a string expression. |
| [STARTSWITH (str_expr, str_expr)](sql-api-query-reference.md#bk_startswith) | Returns a Boolean indicating whether the first string expression starts with the second. |
| [ENDSWITH (str_expr, str_expr)](sql-api-query-reference.md#bk_endswith) | Returns a Boolean indicating whether the first string expression ends with the second. |
| [CONTAINS (str_expr, str_expr)](sql-api-query-reference.md#bk_contains) | Returns a Boolean indicating whether the first string expression contains the second. |
| [INDEX_OF (str_expr, str_expr)](sql-api-query-reference.md#bk_index_of) | Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string isn't found. |
| [LEFT (str_expr, num_expr)](sql-api-query-reference.md#bk_left) | Returns the left part of a string with the specified number of characters. |
| [RIGHT (str_expr, num_expr)](sql-api-query-reference.md#bk_right) | Returns the right part of a string with the specified number of characters. |
| [LTRIM (str_expr)](sql-api-query-reference.md#bk_ltrim) | Returns a string expression after it removes leading blanks. |
| [RTRIM (str_expr)](sql-api-query-reference.md#bk_rtrim) | Returns a string expression after truncating all trailing blanks. |
| [LOWER (str_expr)](sql-api-query-reference.md#bk_lower) | Returns a string expression after converting uppercase character data to lowercase. |
| [UPPER (str_expr)](sql-api-query-reference.md#bk_upper) | Returns a string expression after converting lowercase character data to uppercase. |
| [REPLACE (str_expr, str_expr, str_expr)](sql-api-query-reference.md#bk_replace) | Replaces all occurrences of a specified string value with another string value. |
| [REPLICATE (str_expr, num_expr)](sql-api-query-reference.md#bk_replicate) | Repeats a string value a specified number of times. |
| [REVERSE (str_expr)](sql-api-query-reference.md#bk_reverse) | Returns the reverse order of a string value. |

Using these functions, you can run queries like the following, which returns the family `id` in uppercase:

```sql
    SELECT VALUE UPPER(Families.id)
    FROM Families
```

The results are:

```json
    [
        "WAKEFIELDFAMILY",
        "ANDERSENFAMILY"
    ]
```

Or concatenate strings, like in this example:

```sql
    SELECT Families.id, CONCAT(Families.address.city, ",", Families.address.state) AS location
    FROM Families
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "location": "NY,NY"
    },
    {
      "id": "AndersenFamily",
      "location": "Seattle,WA"
    }]
```

You can also use string functions in the WHERE clause to filter results, like in the following example:

```sql
    SELECT Families.id, Families.address.city
    FROM Families
    WHERE STARTSWITH(Families.id, "Wakefield")
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "city": "NY"
    }]
```

### Array functions

The following scalar functions perform an operation on an array input value and return a numeric, Boolean, or array value. Here's a table of built-in array functions:

| Usage | Description |
| --- | --- |
| [ARRAY_LENGTH (arr_expr)](sql-api-query-reference.md#bk_array_length) |Returns the number of elements of the specified array expression. |
| [ARRAY_CONCAT (arr_expr, arr_expr [, arr_expr])](sql-api-query-reference.md#bk_array_concat) |Returns an array that is the result of concatenating two or more array values. |
| [ARRAY_CONTAINS (arr_expr, expr [, bool_expr])](sql-api-query-reference.md#bk_array_contains) |Returns a Boolean indicating whether the array contains the specified value. Can specify if the match is full or partial. |
| [ARRAY_SLICE (arr_expr, num_expr [, num_expr])](sql-api-query-reference.md#bk_array_slice) |Returns part of an array expression. |

Use array functions to manipulate arrays within JSON. For example, here's a query that returns all item `id`s where one of the `parents` is `Robin Wakefield`: 

```sql
    SELECT Families.id 
    FROM Families 
    WHERE ARRAY_CONTAINS(Families.parents, { givenName: "Robin", familyName: "Wakefield" })
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

You can specify a partial fragment for matching elements within the array. The following query finds all item `id`s that have `parents` with the `givenName` of `Robin`:

```sql
    SELECT Families.id 
    FROM Families 
    WHERE ARRAY_CONTAINS(Families.parents, { givenName: "Robin" }, true)
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

Here's another example that uses ARRAY_LENGTH to get the number of `children` per family:

```sql
    SELECT Families.id, ARRAY_LENGTH(Families.children) AS numberOfChildren
    FROM Families 
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "numberOfChildren": 2
    },
    {
      "id": "AndersenFamily",
      "numberOfChildren": 1
    }]
```

### Spatial functions

Cosmos DB supports the following Open Geospatial Consortium (OGC) built-in functions for geospatial querying: 

| Usage | Description |
| --- | --- |
| ST_DISTANCE (point_expr, point_expr) | Returns the distance between the two GeoJSON `Point`, `Polygon`, or `LineString` expressions. |
| T_WITHIN (point_expr, polygon_expr) | Returns a Boolean expression indicating whether the first GeoJSON object (`Point`, `Polygon`, or `LineString`) is within the second GeoJSON object (`Point`, `Polygon`, or `LineString`). |
| ST_INTERSECTS (spatial_expr, spatial_expr) | Returns a Boolean expression indicating whether the two specified GeoJSON objects (`Point`, `Polygon`, or `LineString`) intersect. |
| ST_ISVALID | Returns a Boolean value indicating whether the specified GeoJSON `Point`, `Polygon`, or `LineString` expression is valid. |
| ST_ISVALIDDETAILED | Returns a JSON value containing a Boolean value if the specified GeoJSON `Point`, `Polygon`, or `LineString` expression is valid, and if invalid, the reason as a string value. |

You can use spatial functions to perform proximity queries against spatial data. For example, here's a query that returns all family items that are within 30 km of a specified location using the ST_DISTANCE built-in function:

```sql
    SELECT f.id
    FROM Families f
    WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

For more information on geospatial support in Cosmos DB, see [Working with geospatial data in Azure Cosmos DB](geospatial.md). 

## Parameterized queries

Cosmos DB supports queries with parameters expressed by the familiar @ notation. Parameterized SQL provides robust handling and escaping of user input, and prevents accidental exposure of data through SQL injection.

For example, you can write a query that takes `lastName` and `address.state` as parameters, and execute it for various values of `lastName` and `address.state` based on user input.

```sql
    SELECT *
    FROM Families f
    WHERE f.lastName = @lastName AND f.address.state = @addressState
```

You can then send this request to Cosmos DB as a parameterized JSON query like the following:

```sql
    {
        "query": "SELECT * FROM Families f WHERE f.lastName = @lastName AND f.address.state = @addressState",
        "parameters": [
            {"name": "@lastName", "value": "Wakefield"},
            {"name": "@addressState", "value": "NY"},
        ]
    }
```

The following example sets the TOP argument with a parameterized query: 

```sql
    {
        "query": "SELECT TOP @n * FROM Families",
        "parameters": [
            {"name": "@n", "value": 10},
        ]
    }
```

Parameter values can be any valid JSON: strings, numbers, Booleans, null, even arrays or nested JSON. Since Cosmos DB is schemaless, parameters aren't validated against any type.

## <a id="JavaScriptIntegration"></a>JavaScript integration

Azure Cosmos DB provides a programming model for executing JavaScript-based application logic directly on containers, using stored procedures and triggers. This model supports:

* High-performance transactional CRUD operations and queries against items in a container, by virtue of the deep integration of the JavaScript runtime within the database engine.
* A natural modeling of control flow, variable scoping, and assignment and integration of exception-handling primitives with database transactions. 

For more information about Azure Cosmos DB JavaScript integration, see the [JavaScript server-side API](#JavaScriptServerSideApi) section.

### Operator evaluation

Cosmos DB, by virtue of being a JSON database, draws parallels with JavaScript operators and evaluation semantics. Cosmos DB tries to preserve JavaScript semantics in terms of JSON support, but the operation evaluation deviates in some instances.

In the SQL API, unlike in traditional SQL, the types of values are often not known until the API retrieves the values from the database. In order to efficiently execute queries, most of the operators have strict type requirements.

Unlike JavaScript, the SQL API doesn't perform implicit conversions. For instance, a query like `SELECT * FROM Person p WHERE p.Age = 21` matches items that contain an `Age` property whose value is `21`. It doesn't match any other item whose `Age` property matches possibly infinite variations like `twenty-one`, `021`, or `21.0`. This contrasts with JavaScript, where string values are implicitly cast to numbers based on operator, for example: `==`. This SQL API behavior is crucial for efficient index matching.

## <a id="ExecutingSqlQueries"></a>SQL query execution

Any language capable of making HTTP/HTTPS requests can call the Cosmos DB REST API. Cosmos DB also offers programming libraries for .NET, Node.js, JavaScript, and Python programming languages. The REST API and libraries all support querying through SQL, and the .NET SDK also supports [LINQ querying](#Linq).

The following examples show how to create a query and submit it against a Cosmos DB database account.

### <a id="RestAPI"></a>REST API

Cosmos DB offers an open RESTful programming model over HTTP. The resource model consists of a set of resources under a database account, which an Azure subscription provisions. The database account consists of a set of *databases*, each of which can contain multiple *containers*, which in turn contain *items*, UDFs, and other resource types. Each Cosmos DB resource is addressable using a logical and stable URI. A set of resources is called a *feed*. 

The basic interaction model with these resources is through the HTTP verbs `GET`, `PUT`, `POST`, and `DELETE`, with their standard interpretations. Use `POST` to create a new resource, execute a stored procedure, or issue a Cosmos DB query. Queries are always read-only operations with no side-effects.

The following examples show a `POST` for a SQL API query against the sample items. The query has a simple filter on the JSON `name` property. The `x-ms-documentdb-isquery` and Content-Type: `application/query+json` headers  denote that the operation is a query. Replace `mysqlapicosmosdb.documents.azure.com:443` with the URI for your Cosmos DB account.

```json
    POST https://mysqlapicosmosdb.documents.azure.com:443/docs HTTP/1.1
    ...
    x-ms-documentdb-isquery: True
    Content-Type: application/query+json

    {
        "query": "SELECT * FROM Families f WHERE f.id = @familyId",
        "parameters": [
            {"name": "@familyId", "value": "AndersenFamily"}
        ]
    }
```

The results are:

```json
    HTTP/1.1 200 Ok
    x-ms-activity-id: 8b4678fa-a947-47d3-8dd3-549a40da6eed
    x-ms-item-count: 1
    x-ms-request-charge: 0.32

    {  
       "_rid":"u1NXANcKogE=",
       "Documents":[  
          {  
             "id":"AndersenFamily",
             "lastName":"Andersen",
             "parents":[  
                {  
                   "firstName":"Thomas"
                },
                {  
                   "firstName":"Mary Kay"
                }
             ],
             "children":[  
                {  
                   "firstName":"Henriette Thaulow",
                   "gender":"female",
                   "grade":5,
                   "pets":[  
                      {  
                         "givenName":"Fluffy"
                      }
                   ]
                }
             ],
             "address":{  
                "state":"WA",
                "county":"King",
                "city":"Seattle"
             },
             "_rid":"u1NXANcKogEcAAAAAAAAAA==",
             "_ts":1407691744,
             "_self":"dbs\/u1NXAA==\/colls\/u1NXANcKogE=\/docs\/u1NXANcKogEcAAAAAAAAAA==\/",
             "_etag":"00002b00-0000-0000-0000-53e7abe00000",
             "_attachments":"_attachments\/"
          }
       ],
       "count":1
    }
```

The next, more complex query returns multiple results from a join:

```json
    POST https://https://mysqlapicosmosdb.documents.azure.com:443/docs HTTP/1.1
    ...
    x-ms-documentdb-isquery: True
    Content-Type: application/query+json

    {
        "query": "SELECT
                     f.id AS familyName,
                     c.givenName AS childGivenName,
                     c.firstName AS childFirstName,
                     p.givenName AS petName
                  FROM Families f
                  JOIN c IN f.children
                  JOIN p in c.pets",
        "parameters": [] 
    }
```

The results are: 

```json
    HTTP/1.1 200 Ok
    x-ms-activity-id: 568f34e3-5695-44d3-9b7d-62f8b83e509d
    x-ms-item-count: 1
    x-ms-request-charge: 7.84

    {  
       "_rid":"u1NXANcKogE=",
       "Documents":[  
          {  
             "familyName":"AndersenFamily",
             "childFirstName":"Henriette Thaulow",
             "petName":"Fluffy"
          },
          {  
             "familyName":"WakefieldFamily",
             "childGivenName":"Jesse",
             "petName":"Goofy"
          },
          {  
             "familyName":"WakefieldFamily",
             "childGivenName":"Jesse",
             "petName":"Shadow"
          }
       ],
       "count":3
    }
```

If a query's results can't fit in a single page, the REST API returns a continuation token through the `x-ms-continuation-token` response header. Clients can paginate results by including the header in the subsequent results. You can also control the number of results per page through the `x-ms-max-item-count` number header. 

If a query has an aggregation function like COUNT, the query page may return a partially aggregated value over only one page of results. Clients must perform a second-level aggregation over these results to produce the final results. For example, sum over the counts returned in the individual pages to return the total count.

To manage the data consistency policy for queries, use the `x-ms-consistency-level` header as in all REST API requests. Session consistency also requires echoing the latest `x-ms-session-token` cookie header in the query request. The queried container's indexing policy can also influence the consistency of query results. With the default indexing policy settings for containers, the index is always current with the item contents, and query results match the consistency chosen for data. For more information, see [Azure Cosmos DB consistency levels][consistency-levels].

If the configured indexing policy on the container can't support the specified query, the Azure Cosmos DB server returns 400 "Bad Request". This error message returns for queries with paths explicitly excluded from indexing. You can specify the `x-ms-documentdb-query-enable-scan` header to allow the query to perform a scan when an index isn't available.

You can get detailed metrics on query execution by setting the `x-ms-documentdb-populatequerymetrics` header to `true`. For more information, see [SQL query metrics for Azure Cosmos DB](sql-api-query-metrics.md).

### <a id="DotNetSdk"></a>C# (.NET SDK)

The .NET SDK supports both LINQ and SQL querying. The following example shows how to perform the preceding filter query with .NET:

```csharp
    foreach (var family in client.CreateDocumentQuery(containerLink,
        "SELECT * FROM Families f WHERE f.id = \"AndersenFamily\""))
    {
        Console.WriteLine("\tRead {0} from SQL", family);
    }

    SqlQuerySpec query = new SqlQuerySpec("SELECT * FROM Families f WHERE f.id = @familyId");
    query.Parameters = new SqlParameterCollection();
    query.Parameters.Add(new SqlParameter("@familyId", "AndersenFamily"));

    foreach (var family in client.CreateDocumentQuery(containerLink, query))
    {
        Console.WriteLine("\tRead {0} from parameterized SQL", family);
    }

    foreach (var family in (
        from f in client.CreateDocumentQuery(containerLink)
        where f.Id == "AndersenFamily"
        select f))
    {
        Console.WriteLine("\tRead {0} from LINQ query", family);
    }

    foreach (var family in client.CreateDocumentQuery(containerLink)
        .Where(f => f.Id == "AndersenFamily")
        .Select(f => f))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", family);
    }
```

The following example compares two properties for equality within each item, and uses anonymous projections.

```csharp
    foreach (var family in client.CreateDocumentQuery(containerLink,
        @"SELECT {""Name"": f.id, ""City"":f.address.city} AS Family
        FROM Families f
        WHERE f.address.city = f.address.state"))
    {
        Console.WriteLine("\tRead {0} from SQL", family);
    }

    foreach (var family in (
        from f in client.CreateDocumentQuery<Family>(containerLink)
        where f.address.city == f.address.state
        select new { Name = f.Id, City = f.address.city }))
    {
        Console.WriteLine("\tRead {0} from LINQ query", family);
    }

    foreach (var family in
        client.CreateDocumentQuery<Family>(containerLink)
        .Where(f => f.address.city == f.address.state)
        .Select(f => new { Name = f.Id, City = f.address.city }))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", family);
    }
```

The next example shows joins, expressed through LINQ `SelectMany`.

```csharp
    foreach (var pet in client.CreateDocumentQuery(containerLink,
          @"SELECT p
            FROM Families f
                 JOIN c IN f.children
                 JOIN p in c.pets
            WHERE p.givenName = ""Shadow"""))
    {
        Console.WriteLine("\tRead {0} from SQL", pet);
    }

    // Equivalent in Lambda expressions:
    foreach (var pet in
        client.CreateDocumentQuery<Family>(containerLink)
        .SelectMany(f => f.children)
        .SelectMany(c => c.pets)
        .Where(p => p.givenName == "Shadow"))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", pet);
    }
```

The .NET client automatically iterates through all the pages of query results in the `foreach` blocks, as shown in the preceding example. The query options introduced in the [REST API](#RestAPI) section are also available in the .NET SDK, using the `FeedOptions` and `FeedResponse` classes in the `CreateDocumentQuery` method. You can control the number of pages by using the `MaxItemCount` setting.

You can also explicitly control paging by creating `IDocumentQueryable` using the `IQueryable` object, then by reading the `ResponseContinuationToken` values and passing them back as `RequestContinuationToken` in `FeedOptions`. You can set `EnableScanInQuery` to enable scans when the query isn't supported by the configured indexing policy. For partitioned containers, you can use `PartitionKey` to run the query against a single partition, although Azure Cosmos DB can automatically extract this from the query text. You can use `EnableCrossPartitionQuery` to run queries against multiple partitions.

For more .NET samples with queries, see the [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet) in GitHub.

### <a id="JavaScriptServerSideApi"></a>JavaScript server-side API

Cosmos DB provides a programming model for executing JavaScript based application logic directly on containers, using stored procedures and triggers. The JavaScript logic registered at the container level can then issue database operations on the items of the given container, wrapped in ambient ACID transactions.

The following example shows how to use `queryDocuments` in the JavaScript server API to make queries from inside stored procedures and triggers:

```javascript
    function findName(givenName, familyName) {
        var context = getContext();
        var containerManager = context.getCollection();
        var containerLink = containerManager.getSelfLink()

        // create a new item.
        containerManager.createDocument(containerLink,
            { givenName: givenName, familyName: familyName },
            function (err, documentCreated) {
                if (err) throw new Error(err.message);

                // filter items by familyName
                var filterQuery = "SELECT * from root r WHERE r.familyName = 'Wakefield'";
                containerManager.queryDocuments(containerLink,
                    filterQuery,
                    function (err, matchingDocuments) {
                        if (err) throw new Error(err.message);
    context.getResponse().setBody(matchingDocuments.length);

                        // Replace the familyName for all items that satisfied the query.
                        for (var i = 0; i < matchingDocuments.length; i++) {
                            matchingDocuments[i].familyName = "Robin Wakefield";
                            // we don't need to execute a callback because they are in parallel
                            containerManager.replaceDocument(matchingDocuments[i]._self,
                                matchingDocuments[i]);
                        }
                    })
            });
    }
```

## <a id="Linq"></a>LINQ to SQL API

LINQ is a .NET programming model that expresses computation as queries on object streams. Cosmos DB provides a client-side library to interface with LINQ by facilitating a conversion between JSON and .NET objects and a mapping from a subset of LINQ queries to Cosmos DB queries.

The following diagram shows the architecture of supporting LINQ queries using Cosmos DB. Using the Cosmos DB client, you can create an `IQueryable` object that directly queries the Cosmos DB query provider, and translates the LINQ query into a Cosmos DB query. You then pass the query to the Cosmos DB server, which retrieves a set of results in JSON format. The JSON deserializer converts the results into a stream of .NET objects on the client side.

![Architecture of supporting LINQ queries using the SQL API - SQL syntax, JSON query language, database concepts, and SQL queries][1]

### .NET and JSON mapping

The mapping between .NET objects and JSON items is natural. Each data member field maps to a JSON object, where the field name maps to the *key* part of the object, and the value recursively maps to the *value* part of the object. The following code maps the `Family` class to a JSON item, and then creates a `Family` object:

```csharp
    public class Family
    {
        [JsonProperty(PropertyName="id")]
        public string Id;
        public Parent[] parents;
        public Child[] children;
        public bool isRegistered;
    };

    public struct Parent
    {
        public string familyName;
        public string givenName;
    };

    public class Child
    {
        public string familyName;
        public string givenName;
        public string gender;
        public int grade;
        public List<Pet> pets;
    };

    public class Pet
    {
        public string givenName;
    };

    public class Address
    {
        public string state;
        public string county;
        public string city;
    };

    // Create a Family object.
    Parent mother = new Parent { familyName= "Wakefield", givenName="Robin" };
    Parent father = new Parent { familyName = "Miller", givenName = "Ben" };
    Child child = new Child { familyName="Merriam", givenName="Jesse", gender="female", grade=1 };
    Pet pet = new Pet { givenName = "Fluffy" };
    Address address = new Address { state = "NY", county = "Manhattan", city = "NY" };
    Family family = new Family { Id = "WakefieldFamily", parents = new Parent [] { mother, father}, children = new Child[] { child }, isRegistered = false };
```

The preceding example creates the following JSON item:

```json
    {
        "id": "WakefieldFamily",
        "parents": [
            { "familyName": "Wakefield", "givenName": "Robin" },
            { "familyName": "Miller", "givenName": "Ben" }
        ],
        "children": [
            {
                "familyName": "Merriam",
                "givenName": "Jesse",
                "gender": "female",
                "grade": 1,
                "pets": [
                    { "givenName": "Goofy" },
                    { "givenName": "Shadow" }
                ]
            },
            { 
              "familyName": "Miller",
              "givenName": "Lisa",
              "gender": "female",
              "grade": 8
            }
        ],
        "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
        "isRegistered": false
    };
```

### LINQ to SQL translation

The Cosmos DB query provider performs a best effort mapping from a LINQ query into a Cosmos DB SQL query. The following description assumes a basic familiarity with LINQ.

The query provider type system supports only the JSON primitive types: numeric, Boolean, string, and null. 

The query provider supports the following scalar expressions:

- Constant values, including constant values of the primitive data types at query evaluation time.
  
- Property/array index expressions that refer to the property of an object or an array element. For example:
  
  ```
    family.Id;
    family.children[0].familyName;
    family.children[0].grade;
    family.children[n].grade; //n is an int variable
  ```
  
- Arithmetic expressions, including common arithmetic expressions on numerical and Boolean values. For the complete list, see the [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612).
  
  ```
    2 * family.children[0].grade;
    x + y;
  ```
  
- String comparison expressions, which include comparing a string value to some constant string value.  
  
  ```
    mother.familyName == "Wakefield";
    child.givenName == s; //s is a string variable
  ```
  
- Object/array creation expressions, which return an object of compound value type or anonymous type, or an array of such objects. You can nest these values.
  
  ```
    new Parent { familyName = "Wakefield", givenName = "Robin" };
    new { first = 1, second = 2 }; //an anonymous type with two fields  
    new int[] { 3, child.grade, 5 };
  ```

### <a id="SupportedLinqOperators"></a>Supported LINQ operators

The LINQ provider included with the SQL .NET SDK supports the following operators:

- **Select**: Projections translate to SQL SELECT, including object construction.
- **Where**: Filters translate to SQL WHERE, and support translation between `&&`, `||`, and `!` to the SQL operators
- **SelectMany**: Allows unwinding of arrays to the SQL JOIN clause. Use to chain or nest expressions to filter on array elements.
- **OrderBy** and **OrderByDescending**: Translate to ORDER BY with ASC or DESC.
- **Count**, **Sum**, **Min**, **Max**, and **Average** operators for aggregation, and their async equivalents **CountAsync**, **SumAsync**, **MinAsync**, **MaxAsync**, and **AverageAsync**.
- **CompareTo**: Translates to range comparisons. Commonly used for strings, since they’re not comparable in .NET.
- **Take**: Translates to SQL TOP for limiting results from a query.
- **Math functions**: Supports translation from .NET `Abs`, `Acos`, `Asin`, `Atan`, `Ceiling`, `Cos`, `Exp`, `Floor`, `Log`, `Log10`, `Pow`, `Round`, `Sign`, `Sin`, `Sqrt`, `Tan`, and `Truncate` to the equivalent SQL built-in functions.
- **String functions**: Supports translation from .NET `Concat`, `Contains`, `Count`, `EndsWith`,`IndexOf`, `Replace`, `Reverse`, `StartsWith`, `SubString`, `ToLower`, `ToUpper`, `TrimEnd`, and `TrimStart` to the equivalent SQL built-in functions.
- **Array functions**: Supports translation from .NET `Concat`, `Contains`, and `Count` to the equivalent SQL built-in functions.
- **Geospatial Extension functions**: Supports translation from stub methods `Distance`, `IsValid`, `IsValidDetailed`, and `Within` to the equivalent SQL built-in functions.
- **User-Defined Function Extension function**: Supports translation from the stub method `UserDefinedFunctionProvider.Invoke` to the corresponding user-defined function.
- **Miscellaneous**: Supports translation of `Coalesce` and conditional operators. Can translate `Contains` to String CONTAINS, ARRAY_CONTAINS, or SQL IN, depending on context.

### SQL query operators

The following examples illustrate how some of the standard LINQ query operators translate to Cosmos DB queries.

#### Select operator

The syntax is `input.Select(x => f(x))`, where `f` is a scalar expression.

**Select operator, example 1:**

- **LINQ lambda expression**
  
  ```csharp
      input.Select(family => family.parents[0].familyName);
  ```
  
- **SQL** 
  
  ```sql
      SELECT VALUE f.parents[0].familyName
      FROM Families f
    ```
  
**Select operator, example 2:** 

- **LINQ lambda expression**
  
  ```csharp
      input.Select(family => family.children[0].grade + c); // c is an int variable
  ```
  
- **SQL**
  
  ```sql
      SELECT VALUE f.children[0].grade + c
      FROM Families f
  ```
  
**Select operator, example 3:**

- **LINQ lambda expression**
  
  ```csharp
    input.Select(family => new
    {
        name = family.children[0].familyName,
        grade = family.children[0].grade + 3
    });
  ```
  
- **SQL** 
  
  ```sql
      SELECT VALUE {"name":f.children[0].familyName,
                    "grade": f.children[0].grade + 3 }
      FROM Families f
  ```

#### SelectMany operator

The syntax is `input.SelectMany(x => f(x))`, where `f` is a scalar expression that returns a container type.

- **LINQ lambda expression**
  
  ```csharp
      input.SelectMany(family => family.children);
  ```
  
- **SQL**

  ```sql
      SELECT VALUE child
      FROM child IN Families.children
  ```

#### Where operator

The syntax is `input.Where(x => f(x))`, where `f` is a scalar expression, which returns a Boolean value.

**Where operator, example 1:**

- **LINQ lambda expression**
  
  ```csharp
      input.Where(family=> family.parents[0].familyName == "Wakefield");
  ```
  
- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      WHERE f.parents[0].familyName = "Wakefield"
  ```
  
**Where operator, example 2:**

- **LINQ lambda expression**
  
  ```csharp
      input.Where(
          family => family.parents[0].familyName == "Wakefield" &&
          family.children[0].grade < 3);
  ```
  
- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      WHERE f.parents[0].familyName = "Wakefield"
      AND f.children[0].grade < 3
  ```

### Composite SQL queries

You can compose the preceding operators to form more powerful queries. Since Cosmos DB supports nested containers, you can concatenate or nest the composition.

#### Concatenation

The syntax is `input(.|.SelectMany())(.Select()|.Where())*`. A concatenated query can start with an optional `SelectMany` query, followed by multiple `Select` or `Where` operators.

**Concatenation, example 1:**

- **LINQ lambda expression**
  
  ```csharp
      input.Select(family=>family.parents[0])
          .Where(familyName == "Wakefield");
  ```

- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      WHERE f.parents[0].familyName = "Wakefield"
  ```

**Concatenation, example 2:**

- **LINQ lambda expression**
  
  ```csharp
      input.Where(family => family.children[0].grade > 3)
          .Select(family => family.parents[0].familyName);
  ```

- **SQL**
  
  ```sql
      SELECT VALUE f.parents[0].familyName
      FROM Families f
      WHERE f.children[0].grade > 3
  ```

**Concatenation, example 3:**

- **LINQ lambda expression**
  
  ```csharp
      input.Select(family => new { grade=family.children[0].grade}).
          Where(anon=> anon.grade < 3);
  ```
  
- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      WHERE ({grade: f.children[0].grade}.grade > 3)
  ```

**Concatenation, example 4:**

- **LINQ lambda expression**
  
  ```csharp
      input.SelectMany(family => family.parents)
          .Where(parent => parents.familyName == "Wakefield");
  ```
  
- **SQL**
  
  ```sql
      SELECT *
      FROM p IN Families.parents
      WHERE p.familyName = "Wakefield"
  ```

#### Nesting

The syntax is `input.SelectMany(x=>x.Q())` where `Q` is a `Select`, `SelectMany`, or `Where` operator.

A nested query applies the inner query to each element of the outer container. One important feature is that the inner query can refer to the fields of the elements in the outer container, like a self-join.

**Nesting, example 1:**

- **LINQ lambda expression**
  
  ```csharp
      input.SelectMany(family=>
          family.parents.Select(p => p.familyName));
  ```

- **SQL**
  
  ```sql
      SELECT VALUE p.familyName
      FROM Families f
      JOIN p IN f.parents
  ```

**Nesting, example 2:**

- **LINQ lambda expression**
  
  ```csharp
      input.SelectMany(family =>
          family.children.Where(child => child.familyName == "Jeff"));
  ```

- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      JOIN c IN f.children
      WHERE c.familyName = "Jeff"
  ```

**Nesting, example 3:**

- **LINQ lambda expression**
  
  ```csharp
      input.SelectMany(family => family.children.Where(
          child => child.familyName == family.parents[0].familyName));
  ```

- **SQL**
  
  ```sql
      SELECT *
      FROM Families f
      JOIN c IN f.children
      WHERE c.familyName = f.parents[0].familyName
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
