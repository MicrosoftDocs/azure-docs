---
title: SQL language syntax in Azure Cosmos DB 
description: This article explains the SQL query language syntax used in Azure Cosmos DB, different operators, and keywords available in this language. 
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: mjbrown
ms.custom: seodec18

---

# SQL language reference for Azure Cosmos DB 

Azure Cosmos DB supports querying documents using a familiar SQL (Structured Query Language) like grammar over hierarchical JSON documents without requiring explicit schema or creation of secondary indexes. This article provides documentation for the SQL query language syntax used in SQL API accounts. For a walkthrough of example SQL queries, see [SQL query examples in Cosmos DB](how-to-sql-query.md).  
  
Visit the [Query Playground](https://www.documentdb.com/sql/demo), where you can try Cosmos DB and run SQL queries against a sample dataset.  
  
## SELECT query  
Every query consists of a SELECT clause and optional FROM and WHERE clauses per ANSI-SQL standards. Typically, for each query, the source in the FROM clause is enumerated, then the filter in the WHERE clause is applied on the source to retrieve a subset of JSON documents. Finally, the SELECT clause is used to project the requested JSON values in the select list. For examples, see [SELECT query examples](how-to-sql-query.md#SelectClause)
  
**Syntax**  
  
```sql
<select_query> ::=  
SELECT <select_specification>   
    [ FROM <from_specification>]   
    [ WHERE <filter_condition> ]  
    [ ORDER BY <sort_specification> ] 
    [ OFFSET <offset_amount> LIMIT <limit_amount>]
```  
  
 **Remarks**  
  
 See following sections for details on each clause:  
  
-   [SELECT clause](#bk_select_query)    
-   [FROM clause](#bk_from_clause)    
-   [WHERE clause](#bk_where_clause)    
-   [ORDER BY clause](#bk_orderby_clause)  
-   [OFFSET LIMIT clause](#bk_offsetlimit_clause)

  
The clauses in the SELECT statement must be ordered as shown above. Any one of the optional clauses can be omitted. But when optional clauses are used, they must appear in the right order.  
  
### Logical Processing Order of the SELECT statement  
  
The order in which clauses are processed is:  

1.  [FROM clause](#bk_from_clause)  
2.  [WHERE clause](#bk_where_clause)  
3.  [ORDER BY clause](#bk_orderby_clause)  
4.  [SELECT clause](#bk_select_query)
5.  [OFFSET LIMIT clause](#bk_offsetlimit_clause)

Note that this is different from the order in which they appear in the syntax. The ordering is such that all new symbols introduced by a processed clause are visible and can be used in clauses processed later. For instance, aliases declared in a FROM clause are accessible in WHERE and SELECT clauses.  

### Whitespace characters and comments  

All whitespace characters that are not part of a quoted string or quoted identifier are not part of the language grammar and are ignored during parsing.  

The query language supports T-SQL style comments like  

-   SQL Statement `-- comment text [newline]`  

While whitespace characters and comments do not have any significance in the grammar, they must be used to separate tokens. For instance: `-1e5` is a single number token, while`: – 1 e5` is a minus token followed by number 1 and identifier e5.  

##  <a name="bk_select_query"></a> SELECT clause  
The clauses in the SELECT statement must be ordered as shown above. Any one of the optional clauses can be omitted. But when optional clauses are used, they must appear in the right order. For examples, see [SELECT query examples](how-to-sql-query.md#SelectClause).

**Syntax**  

```sql
SELECT <select_specification>  

<select_specification> ::=   
      '*'   
      | [DISTINCT] <object_property_list>   
      | [DISTINCT] VALUE <scalar_expression> [[ AS ] value_alias]  
  
<object_property_list> ::=   
{ <scalar_expression> [ [ AS ] property_alias ] } [ ,...n ]  
  
```  
  
 **Arguments**  
  
- `<select_specification>`  

  Properties or value to be selected for the result set.  
  
- `'*'`  

  Specifies that the value should be retrieved without making any changes. Specifically if the processed value is an object, all properties will be retrieved.  
  
- `<object_property_list>`  
  
  Specifies the list of properties to be retrieved. Each returned value will be an object with the properties specified.  
  
- `VALUE`  

  Specifies that the JSON value should be retrieved instead of the complete JSON object. This, unlike `<property_list>` does not wrap the projected value in an object.  
 
- `DISTINCT`
  
  Specifies that duplicates of projected properties should be removed.  

- `<scalar_expression>`  

  Expression representing the value to be computed. See [Scalar expressions](#bk_scalar_expressions) section for details.  
  
**Remarks**  
  
The `SELECT *` syntax is only valid if FROM clause has declared exactly one alias. `SELECT *` provides an identity projection, which can be useful if no projection is needed. SELECT * is only valid if FROM clause is specified and introduced only a single input source.  
  
Both `SELECT <select_list>` and `SELECT *` are "syntactic sugar" and can be alternatively expressed by using simple SELECT statements as shown below.  
  
1. `SELECT * FROM ... AS from_alias ...`  
  
   is equivalent to:  
  
   `SELECT from_alias FROM ... AS from_alias ...`  
  
2. `SELECT <expr1> AS p1, <expr2> AS p2,..., <exprN> AS pN [other clauses...]`  
  
   is equivalent to:  
  
   `SELECT VALUE { p1: <expr1>, p2: <expr2>, ..., pN: <exprN> }[other clauses...]`  
  
**See Also**  
  
[Scalar expressions](#bk_scalar_expressions)  
[SELECT clause](#bk_select_query)  
  
##  <a name="bk_from_clause"></a> FROM clause  
Specifies the source or joined sources. The FROM clause is optional unless the source is filtered or projected later in the query. The purpose of this clause is to specify the data source upon which the query must operate. Commonly the whole container is the source, but one can specify a subset of the container instead. If this clause is not specified, other clauses will still be executed as if FROM clause provided a single document. For examples, see [FROM clause examples](how-to-sql-query.md#FromClause)
  
**Syntax**  
  
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
  
**Arguments**  
  
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
  
**Remarks**  
  
All aliases provided or inferred in the `<from_source>(`s) must be unique. The Syntax `<container_expression>.`property_name is the same as `<container_expression>' ['"property_name"']'`. However, the latter syntax can be used if a property name contains a non-identifier character.  
  
### Handling missing properties, missing array elements, and undefined values
  
If a container expression accesses properties or array elements and that value does not exist, that value will be ignored and not processed further.  
  
### Container expression context scoping  
  
A container expression may be container-scoped or document-scoped:  
  
-   An expression is container-scoped, if the underlying source of the container expression is either ROOT or `container_name`. Such an expression represents a set of documents retrieved from the container directly, and is not dependent on the processing of other container expressions.  
  
-   An expression is document-scoped, if the underlying source of the container expression is `input_alias` introduced earlier in the query. Such an expression represents a set of documents obtained by evaluating the container expression in the scope of each document belonging to the set associated with the aliased container.  The resulting set will be a union of sets obtained by evaluating the container expression for each of the documents in the underlying set.  
  
### Joins 
  
In the current release, Cosmos DB supports inner joins. Additional join capabilities are forthcoming. 

Inner joins result in a complete cross product of the sets participating in the join. The result of an N-way join is a set of N-element tuples, where each value in the tuple is associated with the aliased set participating in the join and can be accessed by referencing that alias in other clauses. For examples, see [JOIN keyword examples](how-to-sql-query.md#Joins)
  
The evaluation of the join depends on the context scope of the participating sets:  
  
- A join between container-set A and container-scoped set B, results in a cross product of all elements in sets A and B.
  
- A join between set A and document-scoped set B, results in a union of all sets obtained by evaluating document-scoped set B for each document from set A.  
  
  In the current release, a maximum of one container-scoped expression is supported by the query processor.  
  
### Examples of joins  
  
Let's look at the following FROM clause: `<from_source1> JOIN <from_source2> JOIN ... JOIN <from_sourceN>`  
  
 Let each source define `input_alias1, input_alias2, …, input_aliasN`. This FROM clause returns a set of N-tuples (tuple with N values). Each tuple has values produced by iterating all container aliases over their respective sets.  
  
**Example 1** - 2 sources  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source2>` be document-scoped referencing input_alias1 and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- The FROM clause `<from_source1> JOIN <from_source2>` will result in the following tuples:  
  
    (`input_alias1, input_alias2`):  
  
    `(A, 1), (A, 2), (B, 3), (C, 4), (C, 5)`  
  
**Example 2** - 3 sources  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source2>` be document-scoped referencing `input_alias1` and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- Let `<from_source3>` be document-scoped referencing `input_alias2` and represent sets:  
  
    {100, 200} for `input_alias2 = 1,`  
  
    {300} for `input_alias2 = 3,`  
  
- The FROM clause `<from_source1> JOIN <from_source2> JOIN <from_source3>` will result in the following tuples:  
  
    (input_alias1, input_alias2, input_alias3):  
  
    (A, 1, 100), (A, 1, 200), (B, 3, 300)  
  
  > [!NOTE]
  > Lack of tuples for other values of `input_alias1`, `input_alias2`, for which the `<from_source3>` did not return any values.  
  
**Example 3** - 3 sources  
  
- Let <from_source1> be container-scoped and represent set {A, B, C}.  
  
- Let `<from_source1>` be container-scoped and represent set {A, B, C}.  
  
- Let <from_source2> be document-scoped referencing input_alias1 and represent sets:  
  
    {1, 2} for `input_alias1 = A,`  
  
    {3} for `input_alias1 = B,`  
  
    {4, 5} for `input_alias1 = C,`  
  
- Let `<from_source3>` be scoped to `input_alias1` and represent sets:  
  
    {100, 200} for `input_alias2 = A,`  
  
    {300} for `input_alias2 = C,`  
  
- The FROM clause `<from_source1> JOIN <from_source2> JOIN <from_source3>` will result in the following tuples:  
  
    (`input_alias1, input_alias2, input_alias3`):  
  
    (A, 1, 100), (A, 1, 200), (A, 2, 100), (A, 2, 200),  (C, 4, 300) ,  (C, 5, 300)  
  
  > [!NOTE]
  > This resulted in cross product between `<from_source2>` and `<from_source3>` because both are scoped to the same `<from_source1>`.  This resulted in 4 (2x2) tuples having value A, 0 tuples having value B (1x0) and 2 (2x1) tuples having value C.  
  
**See also**  
  
 [SELECT clause](#bk_select_query)  
  
##  <a name="bk_where_clause"></a> WHERE clause  
 Specifies the search condition for the documents returned by the query. For examples, see [WHERE clause examples](how-to-sql-query.md#WhereClause)
  
 **Syntax**  
  
```sql  
WHERE <filter_condition>  
<filter_condition> ::= <scalar_expression>  
  
```  
  
 **Arguments**  
  
- `<filter_condition>`  
  
   Specifies the condition to be met for the documents to be returned.  
  
- `<scalar_expression>`  
  
   Expression representing the value to be computed. See the [Scalar expressions](#bk_scalar_expressions) section for details.  
  
  **Remarks**  
  
  In order for the document to be returned an expression specified as filter condition must evaluate to true. Only Boolean value true will satisfy the condition, any other value: undefined, null, false, Number, Array, or Object will not satisfy the condition.  
  
##  <a name="bk_orderby_clause"></a> ORDER BY clause  
 Specifies the sorting order for results returned by the query. For examples, see [ORDER BY clause examples](how-to-sql-query.md#OrderByClause)
  
 **Syntax**  
  
```sql  
ORDER BY <sort_specification>  
<sort_specification> ::= <sort_expression> [, <sort_expression>]  
<sort_expression> ::= {<scalar_expression> [ASC | DESC]} [ ,...n ]  
  
```  

 **Arguments**  
  
- `<sort_specification>`  
  
   Specifies a property or expression on which to sort the query result set. A sort column can be specified as a name or property alias.  
  
   Multiple properties can be specified. Property names must be unique. The sequence of the sort properties in the ORDER BY clause defines the organization of the sorted result set. That is, the result set is sorted by the first property and then that ordered list is sorted by the second property, and so on.  
  
   The property names referenced in the ORDER BY clause must correspond to either a property in the select list or to a property defined in the collection specified in the FROM clause without any ambiguities.  
  
- `<sort_expression>`  
  
   Specifies one or more properties or expressions on which to sort the query result set.  
  
- `<scalar_expression>`  
  
   See the [Scalar expressions](#bk_scalar_expressions) section for details.  
  
- `ASC | DESC`  
  
   Specifies that the values in the specified column should be sorted in ascending or descending order. ASC sorts from the lowest value to highest value. DESC sorts from highest value to lowest value. ASC is the default sort order. Null values are treated as the lowest possible values.  
  
  **Remarks**  
  
   The ORDER BY clause requires that the indexing policy include an index for the fields being sorted. The Azure Cosmos DB query runtime supports sorting against a property name and not against computed properties. Azure Cosmos DB supports multiple ORDER BY properties. In order to run a query with multiple ORDER BY properties, you should define a [composite index](index-policy.md#composite-indexes) on the fields being sorted.


##  <a name=bk_offsetlimit_clause></a> OFFSET LIMIT clause

Specifies the number of items skipped and number of items returned. For examples, see [OFFSET LIMIT clause examples](how-to-sql-query.md#OffsetLimitClause)
  
 **Syntax**  
  
```sql  
OFFSET <offset_amount> LIMIT <limit_amount>
```  
  
 **Arguments**  
 
- `<offset_amount>`

   Specifies the integer number of items that the query results should skip.


- `<limit_amount>`
  
   Specifies the integer number of items that the query results should include

  **Remarks**  
  
  Both the OFFSET count and the LIMIT count are required in the OFFSET LIMIT clause. If an optional `ORDER BY` clause is used, the result set is produced by doing the skip over the ordered values. Otherwise, the query will return a fixed order of values.

##  <a name="bk_scalar_expressions"></a> Scalar expressions  
 A scalar expression is a combination of symbols and operators that can be evaluated to obtain a single value. Simple expressions can be constants, property references, array element references, alias references, or function calls. Simple expressions can be combined into complex expressions using operators. For examples, see [scalar expressions examples](how-to-sql-query.md#scalar-expressions)
  
 For details on values that scalar expression may have, see [Constants](#bk_constants) section.  
  
 **Syntax**  
  
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
  
 **Arguments**  
  
- `<constant>`  
  
   Represents a constant value. See [Constants](#bk_constants) section for details.  
  
- `input_alias`  
  
   Represents a value defined by the `input_alias` introduced in the `FROM` clause.  
  This value is guaranteed to not be **undefined** –**undefined** values in the input are skipped.  
  
- `<scalar_expression>.property_name`  
  
   Represents a value of the property of an object. If the property does not exist or property is referenced on a value which is not an object, then the expression evaluates to **undefined** value.  
  
- `<scalar_expression>'['"property_name"|array_index']'`  
  
   Represents a value of the property with name `property_name` or array element with index `array_index` of an object/array. If the property/array index does not exist or the property/array index is referenced on a value that is not an object/array, then the expression evaluates to undefined value.  
  
- `unary_operator <scalar_expression>`  
  
   Represents an operator that is applied to a single value. See [Operators](#bk_operators) section for details.  
  
- `<scalar_expression> binary_operator <scalar_expression>`  
  
   Represents an operator that is applied to two values. See [Operators](#bk_operators) section for details.  
  
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
  
  **Remarks**  
  
  When calling a built-in or user-defined scalar function all arguments must be defined. If any of the arguments is undefined, the function will not be called and the result will be undefined.  
  
  When creating an object, any property that is assigned undefined value will be skipped and not included in the created object.  
  
  When creating an array, any element value that is assigned **undefined** value will be skipped and not included in the created object. This will cause the next defined element to take its place in such a way that the created array will not have skipped indexes.  
  
##  <a name="bk_operators"></a> Operators  
 This section describes the supported operators. Each operator can be assigned to exactly one category.  
  
 See **Operator categories** table below, for details regarding handling of **undefined** values, type requirements for input values and handling of values with not matching types.  
  
 **Operator categories:**  
  
|**Category**|**Details**|  
|-|-|  
|**arithmetic**|Operator expects input(s) to be Number(s). Output is also a Number. If any of the inputs is **undefined** or type other than Number then the result is **undefined**.|  
|**bitwise**|Operator expects input(s) to be 32-bit signed integer Number(s). Output is also 32-bit signed integer Number.<br /><br /> Any non-integer value will be rounded. Positive value will be rounded down, negative values rounded up.<br /><br /> Any value that is outside of the 32-bit integer range will be converted, by taking last 32-bits of its two's complement notation.<br /><br /> If any of the inputs is **undefined** or type other than Number, then the result is **undefined**.<br /><br /> **Note:** The above behavior is compatible with JavaScript bitwise operator behavior.|  
|**logical**|Operator expects input(s) to be Boolean(s). Output is also a Boolean.<br />If any of the inputs is **undefined** or type other than Boolean, then the result will be **undefined**.|  
|**comparison**|Operator expects input(s) to have the same type and not be undefined. Output is a Boolean.<br /><br /> If any of the inputs is **undefined** or the inputs have different types, then the result is **undefined**.<br /><br /> See **Ordering of values for comparison** table for value ordering details.|  
|**string**|Operator expects input(s) to be String(s). Output is also a String.<br />If any of the inputs is **undefined** or type other than String then the result is **undefined**.|  
  
 **Unary operators:**  
  
|**Name**|**Operator**|**Details**|  
|-|-|-|  
|**arithmetic**|+<br /><br /> -|Returns the number value.<br /><br /> Bitwise negation. Returns negated number value.|  
|**bitwise**|~|Ones' complement. Returns a complement of a number value.|  
|**Logical**|**NOT**|Negation. Returns negated Boolean value.|  
  
 **Binary operators:**  
  
|**Name**|**Operator**|**Details**|  
|-|-|-|  
|**arithmetic**|+<br /><br /> -<br /><br /> *<br /><br /> /<br /><br /> %|Addition.<br /><br /> Subtraction.<br /><br /> Multiplication.<br /><br /> Division.<br /><br /> Modulation.|  
|**bitwise**|&#124;<br /><br /> &<br /><br /> ^<br /><br /> <<<br /><br /> >><br /><br /> >>>|Bitwise OR.<br /><br /> Bitwise AND.<br /><br /> Bitwise XOR.<br /><br /> Left Shift.<br /><br /> Right Shift.<br /><br /> Zero-fill Right Shift.|  
|**logical**|**AND**<br /><br /> **OR**|Logical conjunction. Returns **true** if both arguments are **true**, returns **false** otherwise.<br /><br /> Logical disjunction. Returns **true** if any arguments are **true**, returns **false** otherwise.|  
|**comparison**|**=**<br /><br /> **!=, <>**<br /><br /> **>**<br /><br /> **>=**<br /><br /> **<**<br /><br /> **<=**<br /><br /> **??**|Equals. Returns **true** if arguments are equal, returns **false** otherwise.<br /><br /> Not equal to. Returns **true** if arguments are not equal, returns **false** otherwise.<br /><br /> Greater Than. Returns **true** if first argument is greater than the second one, return **false** otherwise.<br /><br /> Greater Than or Equal To. Returns **true** if first argument is greater than or equal to the second one, return **false** otherwise.<br /><br /> Less Than. Returns **true** if first argument is less than the second one, return **false** otherwise.<br /><br /> Less Than or Equal To. Returns **true** if first argument is less than or equal to the second one, return **false** otherwise.<br /><br /> Coalesce. Returns the second argument if the first argument is an **undefined** value.|  
|**String**|**&#124;&#124;**|Concatenation. Returns a concatenation of both arguments.|  
  
 **Ternary operators:**  

|**Name**|**Operator**|**Details**| 
|-|-|-|  
|Ternary operator|?|Returns the second argument if the first argument evaluates to **true**; return the third argument otherwise.|  

  
 **Ordering of values for comparison**  
  
|**Type**|**Values order**|  
|-|-|  
|**Undefined**|Not comparable.|  
|**Null**|Single value: **null**|  
|**Number**|Natural real number.<br /><br /> Negative Infinity value is smaller than any other Number value.<br /><br /> Positive Infinity value is larger than any other Number value.**NaN** value is not comparable. Comparing with **NaN** will result in **undefined** value.|  
|**String**|Lexicographical order.|  
|**Array**|No ordering, but equitable.|  
|**Object**|No ordering, but equitable.|  
  
 **Remarks**  
  
 In Cosmos DB, the types of values are often not known until they are retrieved from the database. In order to support efficient execution of queries, most of the operators have strict type requirements. Also operators by themselves do not perform implicit conversions.  
  
 This means that a query like: SELECT * FROM ROOT r WHERE r.Age = 21 will only return documents with property Age equal to the number 21. Documents with property Age equal to the string "21" or the string "0021" will not match, as the expression "21" = 21 evaluates to undefined. This allows for a better use of indexes, because the lookup of a specific value (such as the number 21) is faster than search for indefinite number of potential matches (the number 21 or strings "21", "021", "21.0" …). This is different from how JavaScript evaluates operators on values of different types.  
  
 **Arrays and objects equality and comparison**  
  
 Comparing of Array or Object values using range operators (>, >=, <, <=) will result in undefined as there is not order defined on Object or Array values. However using equality/inequality operators (=, !=, <>) is supported and values will be compared structurally.  
  
 Arrays are equal if both arrays have same number of elements and elements at matching positions are also equal. If comparing any pair of elements results in undefined, the result of array comparison is undefined.  
  
 Objects are equal if both objects have same properties defined, and if values of matching properties are also equal. If comparing any pair of property values results in undefined, the result of object comparison is undefined.  
  
##  <a name="bk_constants"></a> Constants  
 A constant, also known as a literal or a scalar value, is a symbol that represents a specific data value. The format of a constant depends on the data type of the value it represents.  
  
 **Supported scalar data types:**  
  
|**Type**|**Values order**|  
|-|-|  
|**Undefined**|Single value: **undefined**|  
|**Null**|Single value: **null**|  
|**Boolean**|Values: **false**, **true**.|  
|**Number**|A double-precision floating-point number, IEEE 754 standard.|  
|**String**|A sequence of zero or more Unicode characters. Strings must be enclosed in single or double quotes.|  
|**Array**|A sequence of zero or more elements. Each element can be a value of any scalar data type, except Undefined.|  
|**Object**|An unordered set of zero or more name/value pairs. Name is a Unicode string, value can be of any scalar data type, except **Undefined**.|  
  
 **Syntax**  
  
```sql  
<constant> ::=  
   <undefined_constant>  
     | <null_constant>   
     | <boolean_constant>   
     | <number_constant>   
     | <string_constant>   
     | <array_constant>   
     | <object_constant>   
  
<undefined_constant> ::= undefined  
  
<null_constant> ::= null  
  
<boolean_constant> ::= false | true  
  
<number_constant> ::= decimal_literal | hexadecimal_literal  
  
<string_constant> ::= string_literal  
  
<array_constant> ::=  
    '[' [<constant>][,...n] ']'  
  
<object_constant> ::=   
   '{' [{property_name | "property_name"} : <constant>][,...n] '}'  
  
```  
  
 **Arguments**  
  
* `<undefined_constant>; undefined`  
  
  Represents undefined value of type Undefined.  
  
* `<null_constant>; null`  
  
  Represents **null** value of type **Null**.  
  
* `<boolean_constant>`  
  
  Represents constant of type Boolean.  
  
* `false`  
  
  Represents **false** value of type Boolean.  
  
* `true`  
  
  Represents **true** value of type Boolean.  
  
* `<number_constant>`  
  
  Represents a constant.  
  
* `decimal_literal`  
  
  Decimal literals are numbers represented using either decimal notation, or scientific notation.  
  
* `hexadecimal_literal`  
  
  Hexadecimal literals are numbers represented using prefix '0x' followed by one or more hexadecimal digits.  
  
* `<string_constant>`  
  
  Represents a constant of type String.  
  
* `string _literal`  
  
  String literals are Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes (apostrophe: ' ) or double quotes (quotation mark: ").  
  
  Following escape sequences are allowed:  
  
|**Escape sequence**|**Description**|**Unicode character**|  
|-|-|-|  
|\\'|apostrophe (')|U+0027|  
|\\"|quotation mark (")|U+0022|  
|\\\ |reverse solidus (\\)|U+005C|  
|\\/|solidus (/)|U+002F|  
|\b|backspace|U+0008|  
|\f|form feed|U+000C|  
|\n|line feed|U+000A|  
|\r|carriage return|U+000D|  
|\t|tab|U+0009|  
|\uXXXX|A Unicode character defined by 4 hexadecimal digits.|U+XXXX|  
  
##  <a name="bk_query_perf_guidelines"></a> Query performance guidelines  
 In order for a query to be executed efficiently for a large container, it should use filters that can be served through one or more indexes.  
  
 The following filters will be considered for index lookup:  
  
- Use equality operator ( = ) with a document path expression and a constant.  
  
- Use range operators (<, \<=, >, >=) with a document path expression and number constants.  
  
- Document path expression stands for any expression that identifies a constant path in the documents from the referenced database container.  
  
  **Document path expression**  
  
  Document path expressions are expressions that a path of property or array indexer assessors over a document coming from database container documents. This path can be used to identify the location of values referenced in a filter directly within the documents in the database container.  
  
  For an expression to be considered a document path expression, it should:  
  
1.  Reference the container root directly.  
  
2.  Reference property or constant array indexer of some document path expression  
  
3.  Reference an alias, which represents some document path expression.  
  
     **Syntax conventions**  
  
     The following table describes the conventions used to describe syntax in the following SQL reference.  
  
    |**Convention**|**Used for**|  
    |-|-|    
    |UPPERCASE|Case-insensitive keywords.|  
    |lowercase|Case-sensitive keywords.|  
    |\<nonterminal>|Nonterminal, defined separately.|  
    |\<nonterminal> ::=|Syntax definition of the nonterminal.|  
    |other_terminal|Terminal (token), described in detail in words.|  
    |identifier|Identifier. Allows following characters only: a-z A-Z 0-9 _First character cannot be a digit.|  
    |"string"|Quoted string. Allows any valid string. See description of a string_literal.|  
    |'symbol'|Literal symbol that is part of the syntax.|  
    |&#124; (vertical bar)|Alternatives for syntax items. You can use only one of the items specified.|  
    |[ ] /(brackets)|Brackets enclose one or more optional items.|  
    |[ ,...n ]|Indicates the preceding item can be repeated n number of times. The occurrences are separated by commas.|  
    |[ ...n ]|Indicates the preceding item can be repeated n number of times. The occurrences are separated by blanks.|  
  
##  <a name="bk_built_in_functions"></a> Built-in functions  
 Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function|Description|  
|--------------|-----------------|  
|[Mathematical functions](#bk_mathematical_functions)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.|  
|[Type checking functions](#bk_type_checking_functions)|The type checking functions allow you to check the type of an expression within SQL queries.|  
|[String functions](#bk_string_functions)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value.|  
|[Array functions](#bk_array_functions)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value.|
|[Date and Time functions](#bk_date_and_time_functions)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format.|
|[Spatial functions](#bk_spatial_functions)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value.|  
  
###  <a name="bk_mathematical_functions"></a> Mathematical functions  
 The following functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.  
  
||||  
|-|-|-|  
|[ABS](#bk_abs)|[ACOS](#bk_acos)|[ASIN](#bk_asin)|  
|[ATAN](#bk_atan)|[ATN2](#bk_atn2)|[CEILING](#bk_ceiling)|  
|[COS](#bk_cos)|[COT](#bk_cot)|[DEGREES](#bk_degrees)|  
|[EXP](#bk_exp)|[FLOOR](#bk_floor)|[LOG](#bk_log)|  
|[LOG10](#bk_log10)|[PI](#bk_pi)|[POWER](#bk_power)|  
|[RADIANS](#bk_radians)|[ROUND](#bk_round)|[SIN](#bk_sin)|  
|[SQRT](#bk_sqrt)|[SQUARE](#bk_square)|[SIGN](#bk_sign)|  
|[TAN](#bk_tan)|[TRUNC](#bk_trunc)||  
  
####  <a name="bk_abs"></a> ABS  
 Returns the absolute (positive) value of the specified numeric expression.  
  
 **Syntax**  
  
```  
ABS (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows the results of using the ABS function on three different numbers.  
  
```  
SELECT ABS(-1) AS abs1, ABS(0) AS abs2, ABS(1) AS abs3 
```  
  
 Here is the result set.  
  
```  
[{abs1: 1, abs2: 0, abs3: 1}]  
```  
  
####  <a name="bk_acos"></a> ACOS  
 Returns the angle, in radians, whose cosine is the specified numeric expression; also called arccosine.  
  
 **Syntax**  
  
```  
ACOS(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ACOS of -1.  
  
```  
SELECT ACOS(-1) AS acos 
```  
  
 Here is the result set.  
  
```  
[{"acos": 3.1415926535897931}]  
```  
  
####  <a name="bk_asin"></a> ASIN  
 Returns the angle, in radians, whose sine is the specified numeric expression. This is also called arcsine.  
  
 **Syntax**  
  
```  
ASIN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ASIN of -1.  
  
```  
SELECT ASIN(-1) AS asin  
```  
  
 Here is the result set.  
  
```  
[{"asin": -1.5707963267948966}]  
```  
  
####  <a name="bk_atan"></a> ATAN  
 Returns the angle, in radians, whose tangent is the specified numeric expression. This is also called arctangent.  
  
 **Syntax**  
  
```  
ATAN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ATAN of the specified value.  
  
```  
SELECT ATAN(-45.01) AS atan  
```  
  
 Here is the result set.  
  
```  
[{"atan": -1.5485826962062663}]  
```  
  
####  <a name="bk_atn2"></a> ATN2  
 Returns the principal value of the arc tangent of y/x, expressed in radians.  
  
 **Syntax**  
  
```  
ATN2(<numeric_expression>, <numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the ATN2 for the specified x and y components.  
  
```  
SELECT ATN2(35.175643, 129.44) AS atn2  
```  
  
 Here is the result set.  
  
```  
[{"atn2": 1.3054517947300646}]  
```  
  
####  <a name="bk_ceiling"></a> CEILING  
 Returns the smallest integer value greater than, or equal to, the specified numeric expression.  
  
 **Syntax**  
  
```  
CEILING (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows positive numeric, negative, and zero values with the CEILING function.  
  
```  
SELECT CEILING(123.45) AS c1, CEILING(-123.45) AS c2, CEILING(0.0) AS c3  
```  
  
 Here is the result set.  
  
```  
[{c1: 124, c2: -123, c3: 0}]  
```  
  
####  <a name="bk_cos"></a> COS  
 Returns the trigonometric cosine of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
COS(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the COS of the specified angle.  
  
```  
SELECT COS(14.78) AS cos  
```  
  
 Here is the result set.  
  
```  
[{"cos": -0.59946542619465426}]  
```  
  
####  <a name="bk_cot"></a> COT  
 Returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression.  
  
 **Syntax**  
  
```  
COT(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the COT of the specified angle.  
  
```  
SELECT COT(124.1332) AS cot  
```  
  
 Here is the result set.  
  
```  
[{"cot": -0.040311998371148884}]  
```  
  
####  <a name="bk_degrees"></a> DEGREES  
 Returns the corresponding angle in degrees for an angle specified in radians.  
  
 **Syntax**  
  
```  
DEGREES (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the number of degrees in an angle of PI/2 radians.  
  
```  
SELECT DEGREES(PI()/2) AS degrees  
```  
  
 Here is the result set.  
  
```  
[{"degrees": 90}]  
```  
  
####  <a name="bk_floor"></a> FLOOR  
 Returns the largest integer less than or equal to the specified numeric expression.  
  
 **Syntax**  
  
```  
FLOOR (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows positive numeric, negative, and zero values with the FLOOR function.  
  
```  
SELECT FLOOR(123.45) AS fl1, FLOOR(-123.45) AS fl2, FLOOR(0.0) AS fl3  
```  
  
 Here is the result set.  
  
```  
[{fl1: 123, fl2: -124, fl3: 0}]  
```  
  
####  <a name="bk_exp"></a> EXP  
 Returns the exponential value of the specified numeric expression.  
  
 **Syntax**  
  
```  
EXP (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  The constant **e** (2.718281…), is the base of natural logarithms.  
  
  The exponent of a number is the constant **e** raised to the power of the number. For example, EXP(1.0) = e^1.0 = 2.71828182845905 and EXP(10) = e^10 = 22026.4657948067.  
  
  The exponential of the natural logarithm of a number is the number itself: EXP (LOG (n)) = n. And the natural logarithm of the exponential of a number is the number itself: LOG (EXP (n)) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the exponential value of the specified variable (10).  
  
```  
SELECT EXP(10) AS exp  
```  
  
 Here is the result set.  
  
```  
[{exp: 22026.465794806718}]  
```  
  
 The following example returns the exponential value of the natural logarithm of 20 and the natural logarithm of the exponential of 20. Because these functions are inverse functions of one another, the return value with rounding for floating point math in both cases is 20.  
  
```  
SELECT EXP(LOG(20)) AS exp1, LOG(EXP(20)) AS exp2  
```  
  
 Here is the result set.  
  
```  
[{exp1: 19.999999999999996, exp2: 20}]  
```  
  
####  <a name="bk_log"></a> LOG  
 Returns the natural logarithm of the specified numeric expression.  
  
 **Syntax**  
  
```  
LOG (<numeric_expression> [, <base>])  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
- `base`  
  
   Optional numeric argument that sets the base for the logarithm.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  By default, LOG() returns the natural logarithm. You can change the base of the logarithm to another value by using the optional base parameter.  
  
  The natural logarithm is the logarithm to the base **e**, where **e** is an irrational constant approximately equal to 2.718281828.  
  
  The natural logarithm of the exponential of a number is the number itself: LOG( EXP( n ) ) = n. And the exponential of the natural logarithm of a number is the number itself: EXP( LOG( n ) ) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the logarithm value of the specified variable (10).  
  
```  
SELECT LOG(10) AS log  
```  
  
 Here is the result set.  
  
```  
[{log: 2.3025850929940459}]  
```  
  
 The following example calculates the LOG for the exponent of a number.  
  
```  
SELECT EXP(LOG(10)) AS expLog  
```  
  
 Here is the result set.  
  
```  
[{expLog: 10.000000000000002}]  
```  
  
####  <a name="bk_log10"></a> LOG10  
 Returns the base-10 logarithm of the specified numeric expression.  
  
 **Syntax**  
  
```  
LOG10 (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  The LOG10 and POWER functions are inversely related to one another. For example, 10 ^ LOG10(n) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the LOG10 value of the specified variable (100).  
  
```  
SELECT LOG10(100) AS log10 
```  
  
 Here is the result set.  
  
```  
[{log10: 2}]  
```  
  
####  <a name="bk_pi"></a> PI  
 Returns the constant value of PI.  
  
 **Syntax**  
  
```  
PI ()  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the value of PI.  
  
```  
SELECT PI() AS pi 
```  
  
 Here is the result set.  
  
```  
[{"pi": 3.1415926535897931}]  
```  
  
####  <a name="bk_power"></a> POWER  
 Returns the value of the specified expression to the specified power.  
  
 **Syntax**  
  
```  
POWER (<numeric_expression>, <y>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
- `y`  
  
   Is the power to which to raise `numeric_expression`.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example demonstrates raising a number to the power of 3 (the cube of the number).  
  
```  
SELECT POWER(2, 3) AS pow1, POWER(2.5, 3) AS pow2  
```  
  
 Here is the result set.  
  
```  
[{pow1: 8, pow2: 15.625}]  
```  
  
####  <a name="bk_radians"></a> RADIANS  
 Returns radians when a numeric expression, in degrees, is entered.  
  
 **Syntax**  
  
```  
RADIANS (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example takes a few angles as input and returns their corresponding radian values.  
  
```  
SELECT RADIANS(-45.01) AS r1, RADIANS(-181.01) AS r2, RADIANS(0) AS r3, RADIANS(0.1472738) AS r4, RADIANS(197.1099392) AS r5  
```  
  
  Here is the result set.  
  
```  
[{  
       "r1": -0.7855726963226477,  
       "r2": -3.1592204790349356,  
       "r3": 0,  
       "r4": 0.0025704127119236249,  
       "r5": 3.4402174274458375  
   }]  
```  
  
####  <a name="bk_round"></a> ROUND  
 Returns a numeric value, rounded to the closest integer value.  
  
 **Syntax**  
  
```  
ROUND(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**
  
  The rounding operation performed follows midpoint rounding away from zero. If the input is a numeric expression which falls exactly between two integers then the result will be the closest integer value away from zero.  
  
  |<numeric_expression>|Rounded|
  |-|-|
  |-6.5000|-7|
  |-0.5|-1|
  |0.5|1|
  |6.5000|7||
  
  **Examples**  
  
  The following example rounds the following positive and negative numbers to the nearest integer.  
  
```  
SELECT ROUND(2.4) AS r1, ROUND(2.6) AS r2, ROUND(2.5) AS r3, ROUND(-2.4) AS r4, ROUND(-2.6) AS r5  
```  
  
  Here is the result set.  
  
```  
[{r1: 2, r2: 3, r3: 3, r4: -2, r5: -3}]  
```  
  
####  <a name="bk_sign"></a> SIGN  
 Returns the positive (+1), zero (0), or negative (-1) sign of the specified numeric expression.  
  
 **Syntax**  
  
```  
SIGN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the SIGN values of numbers from -2 to 2.  
  
```  
SELECT SIGN(-2) AS s1, SIGN(-1) AS s2, SIGN(0) AS s3, SIGN(1) AS s4, SIGN(2) AS s5  
```  
  
 Here is the result set.  
  
```  
[{s1: -1, s2: -1, s3: 0, s4: 1, s5: 1}]  
```  
  
####  <a name="bk_sin"></a> SIN  
 Returns the trigonometric sine of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
SIN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the SIN of the specified angle.  
  
```  
SELECT SIN(45.175643) AS sin  
```  
  
 Here is the result set.  
  
```  
[{"sin": 0.929607286611012}]  
```  
  
####  <a name="bk_sqrt"></a> SQRT  
 Returns the square root of the specified numeric value.  
  
 **Syntax**  
  
```  
SQRT(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the square roots of numbers 1-3.  
  
```  
SELECT SQRT(1) AS s1, SQRT(2.0) AS s2, SQRT(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 1.4142135623730952, s3: 1.7320508075688772}]  
```  
  
####  <a name="bk_square"></a> SQUARE  
 Returns the square of the specified numeric value.  
  
 **Syntax**  
  
```  
SQUARE(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the squares of numbers 1-3.  
  
```  
SELECT SQUARE(1) AS s1, SQUARE(2.0) AS s2, SQUARE(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 4, s3: 9}]  
```  
  
####  <a name="bk_tan"></a> TAN  
 Returns the tangent of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
TAN (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the tangent of PI()/2.  
  
```  
SELECT TAN(PI()/2) AS tan 
```  
  
 Here is the result set.  
  
```  
[{"tan": 16331239353195370 }]  
```  
  
####  <a name="bk_trunc"></a> TRUNC  
 Returns a numeric value, truncated to the closest integer value.  
  
 **Syntax**  
  
```  
TRUNC(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example truncates the following positive and negative numbers to the nearest integer value.  
  
```  
SELECT TRUNC(2.4) AS t1, TRUNC(2.6) AS t2, TRUNC(2.5) AS t3, TRUNC(-2.4) AS t4, TRUNC(-2.6) AS t5  
```  
  
 Here is the result set.  
  
```  
[{t1: 2, t2: 2, t3: 2, t4: -2, t5: -2}]  
```  
  
###  <a name="bk_type_checking_functions"></a> Type checking functions  
 The following functions support type checking against input values, and each return a Boolean value.  
  
||||  
|-|-|-|  
|[IS_ARRAY](#bk_is_array)|[IS_BOOL](#bk_is_bool)|[IS_DEFINED](#bk_is_defined)|  
|[IS_NULL](#bk_is_null)|[IS_NUMBER](#bk_is_number)|[IS_OBJECT](#bk_is_object)|  
|[IS_PRIMITIVE](#bk_is_primitive)|[IS_STRING](#bk_is_string)||  
  
####  <a name="bk_is_array"></a> IS_ARRAY  
 Returns a Boolean value indicating if the type of the specified expression is an array.  
  
 **Syntax**  
  
```  
IS_ARRAY(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_ARRAY function.  
  
```  
SELECT   
 IS_ARRAY(true) AS isArray1,   
 IS_ARRAY(1) AS isArray2,  
 IS_ARRAY("value") AS isArray3,  
 IS_ARRAY(null) AS isArray4,  
 IS_ARRAY({prop: "value"}) AS isArray5,   
 IS_ARRAY([1, 2, 3]) AS isArray6,  
 IS_ARRAY({prop: "value"}.prop2) AS isArray7  
```  
  
 Here is the result set.  
  
```  
[{"isArray1":false,"isArray2":false,"isArray3":false,"isArray4":false,"isArray5":false,"isArray6":true,"isArray7":false}]
```  
  
####  <a name="bk_is_bool"></a> IS_BOOL  
 Returns a Boolean value indicating if the type of the specified expression is a Boolean.  
  
 **Syntax**  
  
```  
IS_BOOL(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_BOOL function.  
  
```  
SELECT   
    IS_BOOL(true) AS isBool1,   
    IS_BOOL(1) AS isBool2,  
    IS_BOOL("value") AS isBool3,   
    IS_BOOL(null) AS isBool4,  
    IS_BOOL({prop: "value"}) AS isBool5,   
    IS_BOOL([1, 2, 3]) AS isBool6,  
    IS_BOOL({prop: "value"}.prop2) AS isBool7  
```  
  
 Here is the result set.  
  
```  
[{"isBool1":true,"isBool2":false,"isBool3":false,"isBool4":false,"isBool5":false,"isBool6":false,"isBool7":false}]
```  
  
####  <a name="bk_is_defined"></a> IS_DEFINED  
 Returns a Boolean indicating if the property has been assigned a value.  
  
 **Syntax**  
  
```  
IS_DEFINED(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks for the presence of a property within the specified JSON document. The first returns true since "a" is present, but the second returns false since "b" is absent.  
  
```  
SELECT IS_DEFINED({ "a" : 5 }.a) AS isDefined1, IS_DEFINED({ "a" : 5 }.b) AS isDefined2 
```  
  
 Here is the result set.  
  
```  
[{"isDefined1":true,"isDefined2":false}]  
```  
  
####  <a name="bk_is_null"></a> IS_NULL  
 Returns a Boolean value indicating if the type of the specified expression is null.  
  
 **Syntax**  
  
```  
IS_NULL(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_NULL function.  
  
```  
SELECT   
    IS_NULL(true) AS isNull1,   
    IS_NULL(1) AS isNull2,  
    IS_NULL("value") AS isNull3,   
    IS_NULL(null) AS isNull4,  
    IS_NULL({prop: "value"}) AS isNull5,   
    IS_NULL([1, 2, 3]) AS isNull6,  
    IS_NULL({prop: "value"}.prop2) AS isNull7  
```  
  
 Here is the result set.  
  
```  
[{"isNull1":false,"isNull2":false,"isNull3":false,"isNull4":true,"isNull5":false,"isNull6":false,"isNull7":false}]
```  
  
####  <a name="bk_is_number"></a> IS_NUMBER  
 Returns a Boolean value indicating if the type of the specified expression is a number.  
  
 **Syntax**  
  
```  
IS_NUMBER(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_NULL function.  
  
```  
SELECT   
    IS_NUMBER(true) AS isNum1,   
    IS_NUMBER(1) AS isNum2,  
    IS_NUMBER("value") AS isNum3,   
    IS_NUMBER(null) AS isNum4,  
    IS_NUMBER({prop: "value"}) AS isNum5,   
    IS_NUMBER([1, 2, 3]) AS isNum6,  
    IS_NUMBER({prop: "value"}.prop2) AS isNum7  
```  
  
 Here is the result set.  
  
```  
[{"isNum1":false,"isNum2":true,"isNum3":false,"isNum4":false,"isNum5":false,"isNum6":false,"isNum7":false}]  
```  
  
####  <a name="bk_is_object"></a> IS_OBJECT  
 Returns a Boolean value indicating if the type of the specified expression is a JSON object.  
  
 **Syntax**  
  
```  
IS_OBJECT(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_OBJECT function.  
  
```  
SELECT   
    IS_OBJECT(true) AS isObj1,   
    IS_OBJECT(1) AS isObj2,  
    IS_OBJECT("value") AS isObj3,   
    IS_OBJECT(null) AS isObj4,  
    IS_OBJECT({prop: "value"}) AS isObj5,   
    IS_OBJECT([1, 2, 3]) AS isObj6,  
    IS_OBJECT({prop: "value"}.prop2) AS isObj7  
```  
  
 Here is the result set.  
  
```  
[{"isObj1":false,"isObj2":false,"isObj3":false,"isObj4":false,"isObj5":true,"isObj6":false,"isObj7":false}]
```  
  
####  <a name="bk_is_primitive"></a> IS_PRIMITIVE  
 Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or null).  
  
 **Syntax**  
  
```  
IS_PRIMITIVE(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array and undefined types using the IS_PRIMITIVE function.  
  
```  
SELECT   
           IS_PRIMITIVE(true) AS isPrim1,   
           IS_PRIMITIVE(1) AS isPrim2,  
           IS_PRIMITIVE("value") AS isPrim3,   
           IS_PRIMITIVE(null) AS isPrim4,  
           IS_PRIMITIVE({prop: "value"}) AS isPrim5,   
           IS_PRIMITIVE([1, 2, 3]) AS isPrim6,  
           IS_PRIMITIVE({prop: "value"}.prop2) AS isPrim7  
```  
  
 Here is the result set.  
  
```  
[{"isPrim1": true, "isPrim2": true, "isPrim3": true, "isPrim4": true, "isPrim5": false, "isPrim6": false, "isPrim7": false}]  
```  
  
####  <a name="bk_is_string"></a> IS_STRING  
 Returns a Boolean value indicating if the type of the specified expression is a string.  
  
 **Syntax**  
  
```  
IS_STRING(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_STRING function.  
  
```  
SELECT   
       IS_STRING(true) AS isStr1,   
       IS_STRING(1) AS isStr2,  
       IS_STRING("value") AS isStr3,   
       IS_STRING(null) AS isStr4,  
       IS_STRING({prop: "value"}) AS isStr5,   
       IS_STRING([1, 2, 3]) AS isStr6,  
       IS_STRING({prop: "value"}.prop2) AS isStr7  
```  
  
 Here is the result set.  
  
```  
[{"isStr1":false,"isStr2":false,"isStr3":true,"isStr4":false,"isStr5":false,"isStr6":false,"isStr7":false}] 
```  
  
###  <a name="bk_string_functions"></a> String functions  
 The following scalar functions perform an operation on a string input value and return a string, numeric or Boolean value.  
  
||||  
|-|-|-|  
|[CONCAT](#bk_concat)|[CONTAINS](#bk_contains)|[ENDSWITH](#bk_endswith)|  
|[INDEX_OF](#bk_index_of)|[LEFT](#bk_left)|[LENGTH](#bk_length)|  
|[LOWER](#bk_lower)|[LTRIM](#bk_ltrim)|[REPLACE](#bk_replace)|  
|[REPLICATE](#bk_replicate)|[REVERSE](#bk_reverse)|[RIGHT](#bk_right)|  
|[RTRIM](#bk_rtrim)|[STARTSWITH](#bk_startswith)|[StringToArray](#bk_stringtoarray)|
|[StringToBoolean](#bk_stringtoboolean)|[StringToNull](#bk_stringtonull)|[StringToNumber](#bk_stringtonumber)|
|[StringToObject](#bk_stringtoobject)|[SUBSTRING](#bk_substring)|[ToString](#bk_tostring)|
|[TRIM](#bk_trim)|[UPPER](#bk_upper)||
  
####  <a name="bk_concat"></a> CONCAT  
 Returns a string that is the result of concatenating two or more string values.  
  
 **Syntax**  
  
```  
CONCAT(<str_expr>, <str_expr> [, <str_expr>])  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the concatenated string of the specified values.  
  
```  
SELECT CONCAT("abc", "def") AS concat  
```  
  
 Here is the result set.  
  
```  
[{"concat": "abcdef"}  
```  
  
####  <a name="bk_contains"></a> CONTAINS  
 Returns a Boolean indicating whether the first string expression contains the second.  
  
 **Syntax**  
  
```  
CONTAINS(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks if "abc" contains "ab" and contains "d".  
  
```  
SELECT CONTAINS("abc", "ab") AS c1, CONTAINS("abc", "d") AS c2 
```  
  
 Here is the result set.  
  
```  
[{"c1": true, "c2": false}]  
```  
  
####  <a name="bk_endswith"></a> ENDSWITH  
 Returns a Boolean indicating whether the first string expression ends with the second.  
  
 **Syntax**  
  
```  
ENDSWITH(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example returns the "abc" ends with "b" and "bc".  
  
```  
SELECT ENDSWITH("abc", "b") AS e1, ENDSWITH("abc", "bc") AS e2 
```  
  
 Here is the result set.  
  
```  
[{"e1": false, "e2": true}]  
```  
  
####  <a name="bk_index_of"></a> INDEX_OF  
 Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.  
  
 **Syntax**  
  
```  
INDEX_OF(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the index of various substrings inside "abc".  
  
```  
SELECT INDEX_OF("abc", "ab") AS i1, INDEX_OF("abc", "b") AS i2, INDEX_OF("abc", "c") AS i3 
```  
  
 Here is the result set.  
  
```  
[{"i1": 0, "i2": 1, "i3": -1}]  
```  
  
####  <a name="bk_left"></a> LEFT  
 Returns the left part of a string with the specified number of characters.  
  
 **Syntax**  
  
```  
LEFT(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the left part of "abc" for various length values.  
  
```  
SELECT LEFT("abc", 1) AS l1, LEFT("abc", 2) AS l2 
```  
  
 Here is the result set.  
  
```  
[{"l1": "a", "l2": "ab"}]  
```  
  
####  <a name="bk_length"></a> LENGTH  
 Returns the number of characters of the specified string expression.  
  
 **Syntax**  
  
```  
LENGTH(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the length of a string.  
  
```  
SELECT LENGTH("abc") AS len 
```  
  
 Here is the result set.  
  
```  
[{"len": 3}]  
```  
  
####  <a name="bk_lower"></a> LOWER  
 Returns a string expression after converting uppercase character data to lowercase.  
  
 **Syntax**  
  
```  
LOWER(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use LOWER in a query.  
  
```  
SELECT LOWER("Abc") AS lower
```  
  
 Here is the result set.  
  
```  
[{"lower": "abc"}]  
  
```  
  
####  <a name="bk_ltrim"></a> LTRIM  
 Returns a string expression after it removes leading blanks.  
  
 **Syntax**  
  
```  
LTRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use LTRIM inside a query.  
  
```  
SELECT LTRIM("  abc") AS l1, LTRIM("abc") AS l2, LTRIM("abc   ") AS l3 
```  
  
 Here is the result set.  
  
```  
[{"l1": "abc", "l2": "abc", "l3": "abc   "}]  
```  
  
####  <a name="bk_replace"></a> REPLACE  
 Replaces all occurrences of a specified string value with another string value.  
  
 **Syntax**  
  
```  
REPLACE(<str_expr>, <str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REPLACE in a query.  
  
```  
SELECT REPLACE("This is a Test", "Test", "desk") AS replace 
```  
  
 Here is the result set.  
  
```  
[{"replace": "This is a desk"}]  
```  
  
####  <a name="bk_replicate"></a> REPLICATE  
 Repeats a string value a specified number of times.  
  
 **Syntax**  
  
```  
REPLICATE(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression. If num_expr is negative or non-finite, the result is undefined.

  > [!NOTE]
  > The maximum length of the result is 10,000 characters i.e. (length(str_expr)  *  num_expr) <= 10,000.
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REPLICATE in a query.  
  
```  
SELECT REPLICATE("a", 3) AS replicate  
```  
  
 Here is the result set.  
  
```  
[{"replicate": "aaa"}]  
```  
  
####  <a name="bk_reverse"></a> REVERSE  
 Returns the reverse order of a string value.  
  
 **Syntax**  
  
```  
REVERSE(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REVERSE in a query.  
  
```  
SELECT REVERSE("Abc") AS reverse  
```  
  
 Here is the result set.  
  
```  
[{"reverse": "cbA"}]  
```  
  
####  <a name="bk_right"></a> RIGHT  
 Returns the right part of a string with the specified number of characters.  
  
 **Syntax**  
  
```  
RIGHT(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the right part of "abc" for various length values.  
  
```  
SELECT RIGHT("abc", 1) AS r1, RIGHT("abc", 2) AS r2 
```  
  
 Here is the result set.  
  
```  
[{"r1": "c", "r2": "bc"}]  
```  
  
####  <a name="bk_rtrim"></a> RTRIM  
 Returns a string expression after it removes trailing blanks.  
  
 **Syntax**  
  
```  
RTRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use RTRIM inside a query.  
  
```  
SELECT RTRIM("  abc") AS r1, RTRIM("abc") AS r2, RTRIM("abc   ") AS r3  
```  
  
 Here is the result set.  
  
```  
[{"r1": "   abc", "r2": "abc", "r3": "abc"}]  
```  
  
####  <a name="bk_startswith"></a> STARTSWITH  
 Returns a Boolean indicating whether the first string expression starts with the second.  
  
 **Syntax**  
  
```  
STARTSWITH(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks if the string "abc" begins with "b" and "a".  
  
```  
SELECT STARTSWITH("abc", "b") AS s1, STARTSWITH("abc", "a") AS s2  
```  
  
 Here is the result set.  
  
```  
[{"s1": false, "s2": true}]  
```  

  ####  <a name="bk_stringtoarray"></a> StringToArray  
 Returns expression translated to an Array. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToArray(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON Array expression. Note that nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)
  
  **Return Types**  
  
  Returns an Array expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToArray behaves across different types. 
  
 The following are examples with valid input.

```
SELECT 
    StringToArray('[]') AS a1, 
    StringToArray("[1,2,3]") AS a2,
    StringToArray("[\"str\",2,3]") AS a3,
    StringToArray('[["5","6","7"],["8"],["9"]]') AS a4,
    StringToArray('[1,2,3, "[4,5,6]",[7,8]]') AS a5
```

Here is the result set.

```
[{"a1": [], "a2": [1,2,3], "a3": ["str",2,3], "a4": [["5","6","7"],["8"],["9"]], "a5": [1,2,3,"[4,5,6]",[7,8]]}]
```

The following is an example of invalid input. 
   
 Single quotes within the array are not valid JSON.
Even though they are valid within a query, they will not parse to valid arrays. 
 Strings within the array string must either be escaped "[\\"\\"]" or the surrounding quote must be single '[""]'.

```
SELECT
    StringToArray("['5','6','7']")
```

Here is the result set.

```
[{}]
```

The following are examples of invalid input.
   
 The expression passed will be parsed as a JSON array; the following do not evaluate to type array and thus return undefined.
   
```
SELECT
    StringToArray("["),
    StringToArray("1"),
    StringToArray(NaN),
    StringToArray(false),
    StringToArray(undefined)
```

Here is the result set.

```
[{}]
```

####  <a name="bk_stringtoboolean"></a> StringToBoolean  
 Returns expression translated to a Boolean. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToBoolean(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a Boolean expression.  
  
  **Return Types**  
  
  Returns a Boolean expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToBoolean behaves across different types. 
 
 The following are examples with valid input.

Whitespace is allowed only before or after "true"/"false".

```  
SELECT 
    StringToBoolean("true") AS b1, 
    StringToBoolean("    false") AS b2,
    StringToBoolean("false    ") AS b3
```  
  
 Here is the result set.  
  
```  
[{"b1": true, "b2": false, "b3": false}]
```  

The following are examples with invalid input.

 Booleans are case sensitive and must be written with all lowercase characters i.e. "true" and "false".

```  
SELECT 
    StringToBoolean("TRUE"),
    StringToBoolean("False")
```  

Here is the result set.  
  
```  
[{}]
``` 

The expression passed will be parsed as a Boolean expression; these inputs do not evaluate to type Boolean and thus return undefined.

```  
SELECT 
    StringToBoolean("null"),
    StringToBoolean(undefined),
    StringToBoolean(NaN), 
    StringToBoolean(false), 
    StringToBoolean(true)
```  

Here is the result set.  
  
```  
[{}]
```  

####  <a name="bk_stringtonull"></a> StringToNull  
 Returns expression translated to null. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToNull(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a null expression.
  
  **Return Types**  
  
  Returns a null expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToNull behaves across different types. 

The following are examples with valid input.

 Whitespace is allowed only before or after "null".

```  
SELECT 
    StringToNull("null") AS n1, 
    StringToNull("  null ") AS n2,
    IS_NULL(StringToNull("null   ")) AS n3
```  
  
 Here is the result set.  
  
```  
[{"n1": null, "n2": null, "n3": true}]
```  

The following are examples with invalid input.

Null is case sensitive and must be written with all lowercase characters i.e. "null".

```  
SELECT    
    StringToNull("NULL"),
    StringToNull("Null")
```  
  
 Here is the result set.  
  
```  
[{}]
```  

The expression passed will be parsed as a null expression; these inputs do not evaluate to type null and thus return undefined.

```  
SELECT    
    StringToNull("true"), 
    StringToNull(false), 
    StringToNull(undefined),
    StringToNull(NaN) 
```  
  
 Here is the result set.  
  
```  
[{}]
```  

####  <a name="bk_stringtonumber"></a> StringToNumber  
 Returns expression translated to a Number. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToNumber(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON Number expression. Numbers in JSON must be an integer or a floating point. For details on the JSON format, see [json.org](https://json.org/)  
  
  **Return Types**  
  
  Returns a Number expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToNumber behaves across different types. 

Whitespace is allowed only before or after the Number.

```  
SELECT 
    StringToNumber("1.000000") AS num1, 
    StringToNumber("3.14") AS num2,
    StringToNumber("   60   ") AS num3, 
    StringToNumber("-1.79769e+308") AS num4
```  
  
 Here is the result set.  
  
```  
{{"num1": 1, "num2": 3.14, "num3": 60, "num4": -1.79769e+308}}
```  

In JSON a valid Number must be either be an integer or a floating point number.

```  
SELECT   
    StringToNumber("0xF")
```  
  
 Here is the result set.  
  
```  
{{}}
```  

The expression passed will be parsed as a Number expression; these inputs do not evaluate to type Number and thus return undefined. 

```  
SELECT 
    StringToNumber("99     54"),   
    StringToNumber(undefined),
    StringToNumber("false"),
    StringToNumber(false),
    StringToNumber(" "),
    StringToNumber(NaN)
```  
  
 Here is the result set.  
  
```  
{{}}
```  

####  <a name="bk_stringtoobject"></a> StringToObject  
 Returns expression translated to an Object. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToObject(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON object expression. Note that nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)  
  
  **Return Types**  
  
  Returns an object expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToObject behaves across different types. 
  
 The following are examples with valid input.

``` 
SELECT 
    StringToObject("{}") AS obj1, 
    StringToObject('{"A":[1,2,3]}') AS obj2,
    StringToObject('{"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]}') AS obj3, 
    StringToObject("{\"C\":[{\"c1\":[5,6,7]},{\"c2\":8},{\"c3\":9}]}") AS obj4
``` 

Here is the result set.

```
[{"obj1": {}, 
  "obj2": {"A": [1,2,3]}, 
  "obj3": {"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]},
  "obj4": {"C":[{"c1":[5,6,7]},{"c2":8},{"c3":9}]}}]
```

 The following are examples with invalid input.
Even though they are valid within a query, they will not parse to valid objects. 
 Strings within the string of object must either be escaped "{\\"a\\":\\"str\\"}" or the surrounding quote must be single 
 '{"a": "str"}'.

Single quotes surrounding property names are not valid JSON.

``` 
SELECT 
    StringToObject("{'a':[1,2,3]}")
```

Here is the result set.

```  
[{}]
```  

Property names without surrounding quotes are not valid JSON.

``` 
SELECT 
    StringToObject("{a:[1,2,3]}")
```

Here is the result set.

```  
[{}]
``` 

The following are examples with invalid input.

 The expression passed will be parsed as a JSON object; these inputs do not evaluate to type object and thus return undefined.

``` 
SELECT 
    StringToObject("}"),
    StringToObject("{"),
    StringToObject("1"),
    StringToObject(NaN), 
    StringToObject(false), 
    StringToObject(undefined)
``` 
 
 Here is the result set.

```
[{}]
```

####  <a name="bk_substring"></a> SUBSTRING  
 Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string.  
  
 **Syntax**  
  
```  
SUBSTRING(<str_expr>, <num_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression to denote the start and end character.    
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the substring of "abc" starting at 1 and for a length of 1 character.  
  
```  
SELECT SUBSTRING("abc", 1, 1) AS substring  
```  
  
 Here is the result set.  
  
```  
[{"substring": "b"}]  
```  
####  <a name="bk_tostring"></a> ToString  
 Returns a string representation of scalar expression. 
  
 **Syntax**  
  
```  
ToString(<expr>)
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how ToString behaves across different types.   
  
```  
SELECT 
    ToString(1.0000) AS str1, 
    ToString("Hello World") AS str2, 
    ToString(NaN) AS str3, 
    ToString(Infinity) AS str4,
    ToString(IS_STRING(ToString(undefined))) AS str5, 
    ToString(0.1234) AS str6, 
    ToString(false) AS str7, 
    ToString(undefined) AS str8
```  
  
 Here is the result set.  
  
```  
[{"str1": "1", "str2": "Hello World", "str3": "NaN", "str4": "Infinity", "str5": "false", "str6": "0.1234", "str7": "false"}]  
```  
 Given the following input:
```  
{"Products":[{"ProductID":1,"Weight":4,"WeightUnits":"lb"},{"ProductID":2,"Weight":32,"WeightUnits":"kg"},{"ProductID":3,"Weight":400,"WeightUnits":"g"},{"ProductID":4,"Weight":8999,"WeightUnits":"mg"}]}
```    
 The following example shows how ToString can be used with other string functions like CONCAT.   
 
```  
SELECT 
CONCAT(ToString(p.Weight), p.WeightUnits) 
FROM p in c.Products 
```  

Here is the result set.  
  
```  
[{"$1":"4lb" },
{"$1":"32kg"},
{"$1":"400g" },
{"$1":"8999mg" }]

```  
Given the following input.
```
{"id":"08259","description":"Cereals ready-to-eat, KELLOGG, KELLOGG'S CRISPIX","nutrients":[{"id":"305","description":"Caffeine","units":"mg"},{"id":"306","description":"Cholesterol, HDL","nutritionValue":30,"units":"mg"},{"id":"307","description":"Sodium, NA","nutritionValue":612,"units":"mg"},{"id":"308","description":"Protein, ABP","nutritionValue":60,"units":"mg"},{"id":"309","description":"Zinc, ZN","nutritionValue":null,"units":"mg"}]}
```
The following example shows how ToString can be used with other string functions like REPLACE.   
```
SELECT 
    n.id AS nutrientID,
    REPLACE(ToString(n.nutritionValue), "6", "9") AS nutritionVal
FROM food 
JOIN n IN food.nutrients
```
Here is the result set.  
 ```
[{"nutrientID":"305"},
{"nutrientID":"306","nutritionVal":"30"},
{"nutrientID":"307","nutritionVal":"912"},
{"nutrientID":"308","nutritionVal":"90"},
{"nutrientID":"309","nutritionVal":"null"}]
``` 
 
####  <a name="bk_trim"></a> TRIM  
 Returns a string expression after it removes leading and trailing blanks.  
  
 **Syntax**  
  
```  
TRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use TRIM inside a query.  
  
```  
SELECT TRIM("   abc") AS t1, TRIM("   abc   ") AS t2, TRIM("abc   ") AS t3, TRIM("abc") AS t4
```  
  
 Here is the result set.  
  
```  
[{"t1": "abc", "t2": "abc", "t3": "abc", "t4": "abc"}]  
``` 
####  <a name="bk_upper"></a> UPPER  
 Returns a string expression after converting lowercase character data to uppercase.  
  
 **Syntax**  
  
```  
UPPER(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use UPPER in a query  
  
```  
SELECT UPPER("Abc") AS upper  
```  
  
 Here is the result set.  
  
```  
[{"upper": "ABC"}]  
```  
  
###  <a name="bk_array_functions"></a> Array functions  
 The following scalar functions perform an operation on an array input value and return numeric, Boolean or array value  
  
||||  
|-|-|-|  
|[ARRAY_CONCAT](#bk_array_concat)|[ARRAY_CONTAINS](#bk_array_contains)|[ARRAY_LENGTH](#bk_array_length)|  
|[ARRAY_SLICE](#bk_array_slice)|||  
  
####  <a name="bk_array_concat"></a> ARRAY_CONCAT  
 Returns an array that is the result of concatenating two or more array values.  
  
 **Syntax**  
  
```  
ARRAY_CONCAT (<arr_expr>, <arr_expr> [, <arr_expr>])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
  **Return Types**  
  
  Returns an array expression.  
  
  **Examples**  
  
  The following example how to concatenate two arrays.  
  
```  
SELECT ARRAY_CONCAT(["apples", "strawberries"], ["bananas"]) AS arrayConcat 
```  
  
 Here is the result set.  
  
```  
[{"arrayConcat": ["apples", "strawberries", "bananas"]}]  
```  
  
####  <a name="bk_array_contains"></a> ARRAY_CONTAINS  
Returns a Boolean indicating whether the array contains the specified value. You can check for a partial or full match of an object by using a boolean expression within the command. 

**Syntax**  
  
```  
ARRAY_CONTAINS (<arr_expr>, <expr> [, bool_expr])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
- `expr`  
  
   Is any valid expression.  

- `bool_expr`  
  
   Is any boolean expression. If it's set to 'true'and if the specified search value is an object, the command checks for a partial match (the search object is a subset of one of the objects). If it's set to 'false', the command checks for a full match of all objects within the array. The default value if not specified is false. 
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example how to check for membership in an array using ARRAY_CONTAINS.  
  
```  
SELECT   
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "apples") AS b1,  
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "mangoes") AS b2  
```  
  
 Here is the result set.  
  
```  
[{"b1": true, "b2": false}]  
```  

The following example how to check for a partial match of a JSON in an array using ARRAY_CONTAINS.  
  
```  
SELECT  
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}, true) AS b1, 
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}) AS b2,
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "mangoes"}, true) AS b3 
```  
  
 Here is the result set.  
  
```  
[{
  "b1": true,
  "b2": false,
  "b3": false
}] 
```  
  
####  <a name="bk_array_length"></a> ARRAY_LENGTH  
 Returns the number of elements of the specified array expression.  
  
 **Syntax**  
  
```  
ARRAY_LENGTH(<arr_expr>)  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example how to get the length of an array using ARRAY_LENGTH.  
  
```  
SELECT ARRAY_LENGTH(["apples", "strawberries", "bananas"]) AS len  
```  
  
 Here is the result set.  
  
```  
[{"len": 3}]  
```  
  
####  <a name="bk_array_slice"></a> ARRAY_SLICE  
 Returns part of an array expression.
  
 **Syntax**  
  
```  
ARRAY_SLICE (<arr_expr>, <num_expr> [, <num_expr>])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
- `num_expr`  
  
   Zero-based numeric index at which to begin the array. Negative values may be used to specify the starting index relative to the last element of the array i.e. -1 references the last element in the array.  

- `num_expr`  

   Maximum number of elements in the resulting array.    

  **Return Types**  
  
  Returns an array expression.  
  
  **Examples**  
  
  The following example shows how to get different slices of an array using ARRAY_SLICE.  
  
```  
SELECT   
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1) AS s1,  
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1) AS s2,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 1) AS s3,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 2) AS s4,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 0) AS s5,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1000) AS s6,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, -100) AS s7      
  
```  
  
 Here is the result set.  
  
```  
[{  
           "s1": ["strawberries", "bananas"],   
           "s2": ["strawberries"],
           "s3": ["strawberries"],  
           "s4": ["strawberries", "bananas"], 
           "s5": [],
           "s6": ["strawberries", "bananas"],
           "s7": [] 
}]  
```  

###  <a name="bk_date_and_time_functions"></a> Date and Time functions
 The following scalar functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format. 

|||
|-|-|
|[GetCurrentDateTime](#bk_get_current_date_time)|[GetCurrentTimestamp](#bk_get_current_timestamp)||

####  <a name="bk_get_current_date_time"></a> GetCurrentDateTime
 Returns the current UTC date and time as an ISO 8601 string.
  
 **Syntax**
  
```
GetCurrentDateTime ()
```
  
  **Return Types**
  
  Returns the current UTC date and time ISO 8601 string value. 

  This is expressed in the format YYYY-MM-DDThh:mm:ss.sssZ where:
  
  |||
  |-|-|
  |YYYY|four-digit year|
  |MM|two-digit month (01 = January, etc.)|
  |DD|two-digit day of month (01 through 31)|
  |T|signifier for beginning of time elements|
  |hh|two digit hour (00 through 23)|
  |mm|two digit minutes (00 through 59)|
  |ss|two digit seconds (00 through 59)|
  |.sss|three digits of decimal fractions of a second|
  |Z|UTC (Coordinated Universal Time) designator||
  
  For more details on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601)

  **Remarks**

  GetCurrentDateTime is a nondeterministic function. 
  
  The result returned is UTC (Coordinated Universal Time).

  **Examples**  
  
  The following example shows how to get the current UTC Date Time using the GetCurrentDateTime built-in function.
  
```  
SELECT GetCurrentDateTime() AS currentUtcDateTime
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcDateTime": "2019-05-03T20:36:17.784Z"
}]  
```  

####  <a name="bk_get_current_timestamp"></a> GetCurrentTimestamp
 Returns the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970. 
  
 **Syntax**  
  
```  
GetCurrentTimestamp ()  
```  
  
  **Return Types**  
  
  Returns a numeric value, the current number of milliseconds that have elapsed since the Unix epoch i.e. the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.

  **Remarks**

  GetCurrentTimestamp is a nondeterministic function. 
  
  The result returned is UTC (Coordinated Universal Time).

  **Examples**  
  
  The following example shows how to get the current timestamp using the GetCurrentTimestamp built-in function.
  
```  
SELECT GetCurrentTimestamp() AS currentUtcTimestamp
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcTimestamp": 1556916469065
}]  
```  

###  <a name="bk_spatial_functions"></a> Spatial functions  
 The following scalar functions perform an operation on a spatial object input value and return a numeric or Boolean value.  
  
|||||
|-|-|-|-|
|[ST_DISTANCE](#bk_st_distance)|[ST_WITHIN](#bk_st_within)|[ST_INTERSECTS](#bk_st_intersects)|[ST_ISVALID](#bk_st_isvalid)|
|[ST_ISVALIDDETAILED](#bk_st_isvaliddetailed)||||
  
####  <a name="bk_st_distance"></a> ST_DISTANCE  
 Returns the distance between the two GeoJSON Point, Polygon, or LineString expressions.  
  
 **Syntax**  
  
```  
ST_DISTANCE (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a numeric expression containing the distance. This is expressed in meters for the default reference system.  
  
  **Examples**  
  
  The following example shows how to return all family documents that are within 30 km of the specified location using the ST_DISTANCE built-in function. .  
  
```  
SELECT f.id   
FROM Families f   
WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000  
```  
  
 Here is the result set.  
  
```  
[{  
  "id": "WakefieldFamily"  
}]  
```  
  
####  <a name="bk_st_within"></a> ST_WITHIN  
 Returns a Boolean expression indicating whether the GeoJSON object (Point, Polygon, or LineString) specified in the first argument is within the GeoJSON (Point, Polygon, or LineString) in the second argument.  
  
 **Syntax**  
  
```  
ST_WITHIN (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
 
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example shows how to find all family documents within a polygon using ST_WITHIN.  
  
```  
SELECT f.id   
FROM Families f   
WHERE ST_WITHIN(f.location, {  
    'type':'Polygon',   
    'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]  
})  
```  
  
 Here is the result set.  
  
```  
[{ "id": "WakefieldFamily" }]  
```  

####  <a name="bk_st_intersects"></a> ST_INTERSECTS  
 Returns a Boolean expression indicating whether the GeoJSON object (Point, Polygon, or LineString) specified in the first argument intersects the GeoJSON (Point, Polygon, or LineString) in the second argument.  
  
 **Syntax**  
  
```  
ST_INTERSECTS (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
 
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example shows how to find all areas that intersect with the given polygon.  
  
```  
SELECT a.id   
FROM Areas a   
WHERE ST_INTERSECTS(a.location, {  
    'type':'Polygon',   
    'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]  
})  
```  
  
 Here is the result set.  
  
```  
[{ "id": "IntersectingPolygon" }]  
```  
  
####  <a name="bk_st_isvalid"></a> ST_ISVALID  
 Returns a Boolean value indicating whether the specified GeoJSON Point, Polygon, or LineString expression is valid.  
  
 **Syntax**  
  
```  
ST_ISVALID(<spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example shows how to check if a point is valid using ST_VALID.  
  
  For example, this point has a latitude value that's not in the valid range of values [-90, 90], so the query returns false.  
  
  For polygons, the GeoJSON specification requires that the last coordinate pair provided should be the same as the first, to create a closed shape. Points within a polygon must be specified in counter-clockwise order. A polygon specified in clockwise order represents the inverse of the region within it.  
  
```  
SELECT ST_ISVALID({ "type": "Point", "coordinates": [31.9, -132.8] }) AS b 
```  
  
 Here is the result set.  
  
```  
[{ "b": false }]  
```  
  
####  <a name="bk_st_isvaliddetailed"></a> ST_ISVALIDDETAILED  
 Returns a JSON value containing a Boolean value if the specified GeoJSON Point, Polygon, or LineString expression is valid, and if invalid, additionally the reason as a string value.  
  
 **Syntax**  
  
```  
ST_ISVALIDDETAILED(<spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON point or polygon expression.  
  
  **Return Types**  
  
  Returns a JSON value containing a Boolean value if the specified GeoJSON point or polygon expression is valid, and if invalid, additionally the reason as a string value.  
  
  **Examples**  
  
  The following example how to check validity (with details) using ST_ISVALIDDETAILED.  
  
```  
SELECT ST_ISVALIDDETAILED({   
  "type": "Polygon",   
  "coordinates": [[ [ 31.8, -5 ], [ 31.8, -4.7 ], [ 32, -4.7 ], [ 32, -5 ] ]]  
}) AS b  
```  
  
 Here is the result set.  
  
```  
[{  
  "b": {   
    "valid": false,   
    "reason": "The Polygon input is not valid because the start and end points of the ring number 1 are not the same. Each ring of a polygon must have the same start and end points."   
  }  
}]  
```  
 
## Next steps  

- [SQL syntax and SQL query for Cosmos DB](how-to-sql-query.md)

- [Cosmos DB documentation](https://docs.microsoft.com/azure/cosmos-db/)  
