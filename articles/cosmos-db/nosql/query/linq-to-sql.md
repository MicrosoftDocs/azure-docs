---
title: LINQ to NoSQL translation
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn the LINQ operators supported and how the LINQ queries are mapped to NoSQL queries in Azure Cosmos DB.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# LINQ to NoSQL translation in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The Azure Cosmos DB query provider performs a best effort mapping from a LINQ query into an Azure Cosmos DB for NoSQL query. If you want to get the NoSQL query that is translated from LINQ, use the `ToString()` method on the generated `IQueryable` object. The following description assumes a basic familiarity with [LINQ](/dotnet/csharp/programming-guide/concepts/linq/introduction-to-linq-queries). In addition to LINQ, Azure Cosmos DB also supports [Entity Framework Core](/ef/core/providers/cosmos/?tabs=dotnet-core-cli), which works with API for NoSQL.

> [!NOTE]
> We recommend using the latest [.NET SDK (`Microsoft.Azure.Cosmos`) version](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/)

The query provider type system supports only the JSON primitive types: `numeric`, `Boolean`, `string`, and `null`.

The query provider supports the following scalar expressions:

- Constant values, including constant values of the primitive data types at query evaluation time.
  
- Property/array index expressions that refer to the property of an object or an array element. For example:
  
    ```csharp
    family.Id;
    family.children[0].familyName;
    family.children[0].grade;
    ```

    ```csharp
    int n = 1;

    family.children[n].grade;
    ```
  
- Arithmetic expressions, including common arithmetic expressions on numerical and Boolean values.
  
    ```csharp
    2 * family.children[0].grade;
    x + y;
    ```
  
- String comparison expressions, which include comparing a string value to some constant string value.  
  
    ```csharp
    mother.familyName.StringEquals("Wakefield");
    ```

    ```csharp
    string s = "Rob";
    string e = "in";
    string c = "obi";
    
    child.givenName.StartsWith(s);
    child.givenName.EndsWith(e);
    child.givenName.Contains(c);
    ```
  
- Object/array creation expressions, which return an object of compound value type or anonymous type, or an array of such objects. You can nest these values.
  
    ```csharp
    new Parent { familyName = "Wakefield", givenName = "Robin" };
    new { first = 1, second = 2 }; //an anonymous type with two fields  
    new int[] { 3, child.grade, 5 };
    ```

## Using LINQ

You can create a LINQ query with `GetItemLinqQueryable`. This example shows LINQ query generation and asynchronous execution with a `FeedIterator`:

```csharp
using FeedIterator<Book> setIterator = container.GetItemLinqQueryable<Book>()
    .Where(b => b.Title == "War and Peace")
    .ToFeedIterator<Book>());

//Asynchronous query execution
while (setIterator.HasMoreResults)
{
    foreach(var item in await setIterator.ReadNextAsync()){
    {
        Console.WriteLine(item.cost);
    }
}
```

## Supported LINQ operators

The LINQ provider included with the NoSQL .NET SDK supports the following operators:

- **Select**: Projections translate to [SELECT](select.md), including object construction.
- **Where**: Filters translate to [WHERE](where.md), and support translation between `&&`, `||`, and `!` to the NoSQL operators
- **SelectMany**: Allows unwinding of arrays to the [JOIN](join.md) clause. Use to chain or nest expressions to filter on array elements.
- **OrderBy** and **OrderByDescending**: Translate to [ORDER BY](order-by.md) with ASC or DESC.
- **Count**, **Sum**, **Min**, **Max**, and **Average** operators for aggregation, and their async equivalents **CountAsync**, **SumAsync**, **MinAsync**, **MaxAsync**, and **AverageAsync**.
- **CompareTo**: Translates to range comparisons. This operator is commonly used for strings, since they're not comparable in .NET.
- **Skip** and **Take**: Translates to [OFFSET and LIMIT](offset-limit.md) for limiting results from a query and doing pagination.
- **Math functions**: Supports translation from .NET `Abs`, `Acos`, `Asin`, `Atan`, `Ceiling`, `Cos`, `Exp`, `Floor`, `Log`, `Log10`, `Pow`, `Round`, `Sign`, `Sin`, `Sqrt`, `Tan`, and `Truncate` to the equivalent [built-in mathematical functions](system-functions.yml).
- **String functions**: Supports translation from .NET `Concat`, `Contains`, `Count`, `EndsWith`,`IndexOf`, `Replace`, `Reverse`, `StartsWith`, `SubString`, `ToLower`, `ToUpper`, `TrimEnd`, and `TrimStart` to the equivalent [built-in string functions](system-functions.yml).
- **Array functions**: Supports translation from .NET `Concat`, `Contains`, and `Count` to the equivalent [built-in array functions](system-functions.yml).
- **Geospatial Extension functions**: Supports translation from stub methods `Distance`, `IsValid`, `IsValidDetailed`, and `Within` to the equivalent [built-in geospatial functions](geospatial-query.md).
- **User-Defined Function Extension function**: Supports translation from the stub method [CosmosLinq.InvokeUserDefinedFunction](/dotnet/api/microsoft.azure.cosmos.linq.cosmoslinq.invokeuserdefinedfunction?view=azure-dotnet&preserve-view=true) to the corresponding user-defined function.
- **Miscellaneous**: Supports translation of `Coalesce` and [conditional operators](logical-operators.md). Can translate `Contains` to String CONTAINS, ARRAY_CONTAINS, or IN, depending on context.

## Examples

The following examples illustrate how some of the standard LINQ query operators translate to queries in Azure Cosmos DB.

### Select operator

The syntax is `input.Select(x => f(x))`, where `f` is a scalar expression. The `input`, in this case, would be an `IQueryable` object.

**Select operator, example 1:**

- **LINQ lambda expression**
  
    ```csharp
    input.Select(family => family.parents[0].familyName);
    ```
  
- **NoSQL**
  
    ```sql
    SELECT VALUE f.parents[0].familyName
    FROM Families f
    ```
  
**Select operator, example 2:**

- **LINQ lambda expression**
  
    ```csharp
    input.Select(family => family.children[0].grade + c); // c is an int variable
    ```
  
- **NoSQL**
  
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
  
- **NoSQL**
  
    ```sql
    SELECT VALUE {
        "name":f.children[0].familyName,
        "grade": f.children[0].grade + 3 
    }
    FROM Families f
    ```

### SelectMany operator

The syntax is `input.SelectMany(x => f(x))`, where `f` is a scalar expression that returns a container type.

- **LINQ lambda expression**
  
    ```csharp
    input.SelectMany(family => family.children);
    ```
  
- **NoSQL**

    ```sql
    SELECT VALUE child
    FROM child IN Families.children
    ```

### Where operator

The syntax is `input.Where(x => f(x))`, where `f` is a scalar expression, which returns a Boolean value.

**Where operator, example 1:**

- **LINQ lambda expression**
  
    ```csharp
    input.Where(family=> family.parents[0].familyName == "Wakefield");
    ```
  
- **NoSQL**
  
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
  
- **NoSQL**
  
    ```sql
    SELECT *
    FROM Families f
    WHERE f.parents[0].familyName = "Wakefield"
    AND f.children[0].grade < 3
    ```

## Composite NoSQL queries

You can compose the preceding operators to form more powerful queries. Since Azure Cosmos DB supports nested containers, you can concatenate or nest the composition.

### Concatenation

The syntax is `input(.|.SelectMany())(.Select()|.Where())*`. A concatenated query can start with an optional `SelectMany` query, followed by multiple `Select` or `Where` operators.

**Concatenation, example 1:**

- **LINQ lambda expression**
  
    ```csharp
    input.Select(family => family.parents[0])
        .Where(parent => parent.familyName == "Wakefield");
    ```

- **NoSQL**
  
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

- **NoSQL**
  
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
  
- **NoSQL**
  
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
  
- **NoSQL**
  
    ```sql
    SELECT *
    FROM p IN Families.parents
    WHERE p.familyName = "Wakefield"
    ```

### Nesting

The syntax is `input.SelectMany(x=>x.Q())` where `Q` is a `Select`, `SelectMany`, or `Where` operator.

A nested query applies the inner query to each element of the outer container. One important feature is that the inner query can refer to the fields of the elements in the outer container, like a self-join.

**Nesting, example 1:**

- **LINQ lambda expression**
  
    ```csharp
    input.SelectMany(family=>
        family.parents.Select(p => p.familyName));
    ```

- **NoSQL**
  
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

- **NoSQL**
  
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

- **NoSQL**
  
    ```sql
    SELECT *
    FROM Families f
    JOIN c IN f.children
    WHERE c.familyName = f.parents[0].familyName
    ```

## Related content

- [Azure Cosmos DB for NoSQL .NET SDK developer guide](../how-to-dotnet-get-started.md)
- [Model document data](../../modeling-data.md)
