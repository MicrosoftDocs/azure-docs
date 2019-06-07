---
title: User-defined functions (UDF's)
description: Learn about User-defined functions in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---

##  <a id="bk_user_defined_functions"></a> User-defined functions (UDFs)

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