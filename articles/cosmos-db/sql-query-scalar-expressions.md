---
title: Scalar expressions for Azure Cosmos DB
description: Learn about scalar expression SQL syntax for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: mjbrown

---
# <a id="ScalarExpressions"></a>Scalar Expressions

The SELECT clause supports scalar expressions. A scalar expression is a combination of symbols and operators that can be evaluated to obtain a single value. Simple expressions can be constants, property references, array element references, alias references, or function calls. Simple expressions can be combined into complex expressions using operators.

##  <a name="bk_syntax"></a> Syntax
  
```sql  
<scalar_expression> ::=  
       <constant>   
     | input_alias   
     | parameter_name  
     | <scalar_expression>.property_name  
     | <scalar_expression>'['"property_name"|array_index']'  
     | unary_operator <scalar_expression>  
     | <scalar_expression> binary_operator <scalar_expression>    
     | <scalar_expression> ? <scalar_expression> : <scalar_expression>  
     | <scalar_function_expression>  
     | <create_object_expression>   
     | <create_array_expression>  
     | (<scalar_expression>)   
  
<scalar_function_expression> ::=  
        'udf.' Udf_scalar_function([<scalar_expression>][,…n])  
        | builtin_scalar_function([<scalar_expression>][,…n])  
  
<create_object_expression> ::=  
   '{' [{property_name | "property_name"} : <scalar_expression>][,…n] '}'  
  
<create_array_expression> ::=  
   '[' [<scalar_expression>][,…n] ']'  
  
```  
##  <a name="bk_arguments"></a> Arguments
  
- `<constant>`  
  
   Represents a constant value. See [Constants](sql-query-constants) section for details.  
  
- `input_alias`  
  
   Represents a value defined by the `input_alias` introduced in the `FROM` clause.  
  This value is guaranteed to not be **undefined** –**undefined** values in the input are skipped.  
  
- `<scalar_expression>.property_name`  
  
   Represents a value of the property of an object. If the property does not exist or property is referenced on a value which is not an object, then the expression evaluates to **undefined** value.  
  
- `<scalar_expression>'['"property_name"|array_index']'`  
  
   Represents a value of the property with name `property_name` or array element with index `array_index` of an object/array. If the property/array index does not exist or the property/array index is referenced on a value that is not an object/array, then the expression evaluates to undefined value.  
  
- `unary_operator <scalar_expression>`  
  
   Represents an operator that is applied to a single value. See [Operators](sql-query-operators.md) section for details.  
  
- `<scalar_expression> binary_operator <scalar_expression>`  
  
   Represents an operator that is applied to two values. See [Operators](sql-query-operators) section for details.  
  
- `<scalar_function_expression>`  
  
   Represents a value defined by a result of a function call.  
  
- `udf_scalar_function`  
  
   Name of the user-defined scalar function.  
  
- `builtin_scalar_function`  
  
   Name of the built-in scalar function.  
  
- `<create_object_expression>`  
  
   Represents a value obtained by creating a new object with specified properties and their values.  
  
- `<create_array_expression>`  
  
   Represents a value obtained by creating a new array with specified values as elements  
  
- `parameter_name`  
  
   Represents a value of the specified parameter name. Parameter names must have a single \@ as the first character.  
  
##  <a name="bk_remarks></a> Remarks
  
  When calling a built-in or user-defined scalar function all arguments must be defined. If any of the arguments is undefined, the function will not be called and the result will be undefined.  
  
  When creating an object, any property that is assigned undefined value will be skipped and not included in the created object.  
  
  When creating an array, any element value that is assigned **undefined** value will be skipped and not included in the created object. This will cause the next defined element to take its place in such a way that the created array will not have skipped indexes.  

##  <a name="bk_examples"></a> Examples

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