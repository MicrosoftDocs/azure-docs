---
title: LINQ to SQL translation in Azure Cosmos DB
description: Mapping LINQ queries to Azure Cosmos DB SQL queries.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: tisande

---
# LINQ to SQL translation

The Azure Cosmos DB query provider performs a best effort mapping from a LINQ query into a Cosmos DB SQL query. The following description assumes a basic familiarity with LINQ.

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

## <a id="SupportedLinqOperators"></a>Supported LINQ operators

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

## Examples

The following examples illustrate how some of the standard LINQ query operators translate to Cosmos DB queries.

### Select operator

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

### SelectMany operator

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

### Where operator

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

## Composite SQL queries

You can compose the preceding operators to form more powerful queries. Since Cosmos DB supports nested containers, you can concatenate or nest the composition.

### Concatenation

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

### Nesting

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


## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Model document data](modeling-data.md)
