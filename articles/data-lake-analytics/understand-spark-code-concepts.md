---
title: Understand Apache Spark code concepts for Azure Data Lake Analytics U-SQL developers.
description: This article describes Apache Spark concepts to help U-SQL developers understand Spark code concepts.
author: guyhay
ms.author: guyhay
ms.reviewer: jasonh
ms.service: data-lake-analytics
ms.topic: conceptual
ms.custom: Understand-apache-spark-code-concepts
ms.date: 10/15/2019
---

# Understand Apache Spark code for U-SQL developers

This section provides high-level guidance on transforming U-SQL Scripts to Apache Spark.

- It starts with a [comparison of the two language's processing paradigms](#understand-the-u-sql-and-spark-language-and-processing-paradigms)
- Provides tips on how to:
   - [Transform scripts](#transform-u-sql-scripts) including U-SQL's [rowset expressions](#transform-u-sql-rowset-expressions-and-sql-based-scalar-expressions)
   - [.NET code](#transform-net-code)
   - [Data types](#transform-typed-values)
   - [Catalog objects](#transform-u-sql-catalog-objects).

## Understand the U-SQL and Spark language and processing paradigms

Before you start migrating Azure Data Lake Analytics' U-SQL scripts to Spark, it is useful to understand the general language and processing philosophies of the two systems.

U-SQL is a SQL-like declarative query language that uses a data-flow paradigm and allows you to easily embed and scale out user-code written in .NET (for example C#), Python, and R. The user-extensions can implement simple expressions or user-defined functions, but can also provide the user the ability to implement so called user-defined operators that implement custom operators to perform rowset level transformations, extractions and writing output.

Spark is a scale-out framework offering several language bindings in Scala, Java, Python, .NET etc. where you primarily write your code in one of these languages, create data abstractions called resilient distributed datasets (RDD), dataframes, and datasets and then use a LINQ-like domain-specific language (DSL) to transform them. It also provides SparkSQL as a declarative sublanguage on the dataframe and dataset abstractions. The DSL provides two categories of operations, transformations and actions. Applying transformations to the data abstractions will not execute the transformation but instead build-up the execution plan that will be submitted for evaluation with an action (for example, writing the result into a temporary table or file, or printing the result).

Thus when translating a U-SQL script to a Spark program, you will have to decide which language you want to use to at least generate the data frame abstraction (which is currently the most frequently used data abstraction) and whether you want to write the declarative dataflow transformations using the DSL or SparkSQL. In some more complex cases, you may need to split your U-SQL script into a sequence of Spark and other steps implemented with Azure Batch or Azure Functions.

Furthermore, Azure Data Lake Analytics offers U-SQL in a serverless job service environment, while both Azure Databricks and Azure HDInsight offer Spark in form of a cluster service. When transforming your application, you will have to take into account the implications of now creating, sizing, scaling, and decommissioning the clusters.

## Transform U-SQL scripts

U-SQL scripts follow the following processing pattern:

1. Data gets read from either unstructured files, using the `EXTRACT` statement, a location or file set specification, and the built-in or user-defined extractor and desired schema, or from U-SQL tables (managed or external tables). It is represented as a rowset.
2. The rowsets get transformed in multiple U-SQL statements that apply U-SQL expressions to the rowsets and produce new rowsets.
3. Finally, the resulting rowsets are output into either files using the `OUTPUT` statement that specifies the location(s) and a built-in or user-defined outputter, or into a U-SQL table.

The script is evaluated lazily, meaning that each extraction and transformation step is composed into an expression tree and globally evaluated (the dataflow).

Spark programs are similar in that you would use Spark connectors to read the data and create the dataframes, then apply the transformations on the dataframes using either the LINQ-like DSL or SparkSQL, and then write the result into files, temporary Spark tables, some programming language types, or the console.

## Transform .NET code

U-SQL's expression language is C# and it offers a variety of ways to scale out custom .NET code.

Since Spark currently does not natively support executing .NET code, you will have to either rewrite your expressions into an equivalent Spark, Scala, Java, or Python expression or find a way to call into your .NET code. If your script uses .NET libraries, you have the following options:

- Translate your .NET code into Scala or Python.
- Split your U-SQL script into several steps, where you use Azure Batch processes to apply the .NET transformations (if you can get acceptable scale)
- Use a .NET language binding available in Open Source called Moebius. This project is not in a supported state.

In any case, if you have a large amount of .NET logic in your U-SQL scripts, please contact us through your Microsoft Account representative for further guidance.

The following details are for the different cases of .NET and C# usages in U-SQL scripts.

### Transform scalar inline U-SQL C# expressions

U-SQL's expression language is C#. Many of the scalar inline U-SQL expressions are implemented natively for improved performance, while more complex expressions may be executed through calling into the .NET framework.

Spark has its own scalar expression language (either as part of the DSL or in SparkSQL) and allows calling into user-defined functions written in its hosting language.

If you have scalar expressions in U-SQL, you should first find the most appropriate natively understood Spark scalar expression to get the most performance, and then map the other expressions into a user-defined function of the Spark hosting language of your choice.

Be aware that .NET and C# have different type semantics than the Spark hosting languages and Spark's DSL. See [below](#transform-typed-values) for more details on the type system differences.

### Transform user-defined scalar .NET functions and user-defined aggregators

U-SQL provides ways to call arbitrary scalar .NET functions and to call user-defined aggregators written in .NET.

Spark also offers support for user-defined functions and user-defined aggregators written in most of its hosting languages that can be called from Spark's DSL and SparkSQL.

### Transform user-defined operators (UDOs)

U-SQL provides several categories of user-defined operators (UDOs) such as extractors, outputters, reducers, processors, appliers, and combiners that can be written in .NET (and - to some extent - in Python and R).

Spark does not offer the same extensibility model for operators, but has equivalent capabilities for some.

The Spark equivalent to extractors and outputters is Spark connectors. For many U-SQL extractors, you may find an equivalent connector in the Spark community. For others, you will have to write a custom connector. If the U-SQL extractor is complex and makes use of several .NET libraries, it may be preferable to build a connector in Scala that uses interop to call into the .NET library that does the actual processing of the data. In that case, you will have to deploy the .NET Core runtime to the Spark cluster and make sure that the referenced .NET libraries are .NET Standard 2.0 compliant.

The other types of U-SQL UDOs will need to be rewritten using user-defined functions and aggregators and the semantically appropriate Spark DLS or SparkSQL expression. For example, a processor can be mapped to a SELECT of a variety of UDF invocations, packaged as a function that takes a dataframe as an argument and returns a dataframe.

### Transform U-SQL's optional libraries

U-SQL provides a set of optional and demo libraries that offer [Python](data-lake-analytics-u-sql-python-extensions.md), [R](data-lake-analytics-u-sql-r-extensions.md), [JSON, XML, AVRO support](https://github.com/Azure/usql/tree/master/Examples/DataFormats), and some [cognitive services capabilities](data-lake-analytics-u-sql-cognitive.md).

Spark offers its own Python and R integration, pySpark and SparkR respectively, and provides connectors to read and write JSON, XML, and AVRO.

If you need to transform a script referencing the cognitive services libraries, we recommend contacting us via your Microsoft Account representative.

## Transform typed values

Because U-SQL's type system is based on the .NET type system and Spark has its own type system, that is impacted by the host language binding, you will have to make sure that the types you are operating on are close and for certain types, the type ranges, precision and/or scale may be slightly different. Furthermore, U-SQL and Spark treat `null` values differently.

### Data types

The following table gives the equivalent types in Spark, Scala, and PySpark for the given U-SQL types.

| U-SQL | Spark |  Scala | PySpark |
| ------ | ------ | ------ | ------ |
|`byte`       ||||
|`sbyte`      |`ByteType` |`Byte` | `ByteType`|
|`int`        |`IntegerType` |`Int` | `IntegerType`|
|`uint`       ||||
|`long`       |`LongType` |`Long` | `LongType`|
|`ulong`      ||||
|`float`      |`FloatType` |`Float` | `FloatType`|
|`double`     |`DoubleType` |`Double` | `DoubleType`|
|`decimal`    |`DecimalType` |`java.math.BigDecimal` | `DecimalType`|
|`short`      |`ShortType` |`Short` | `ShortType`|
|`ushort`     ||||
|`char`   | |`Char`||
|`string` |`StringType` |`String` |`StringType` |
|`DateTime`   |`DateType`, `TimestampType` |`java.sql.Date`, `java.sql.Timestamp` | `DateType`, `TimestampType`|
|`bool`   |`BooleanType` |`Boolean` | `BooleanType`|
|`Guid`   ||||
|`byte[]` |`BinaryType` |`Array[Byte]` | `BinaryType`|
|`SQL.MAP<K,V>`   |`MapType(keyType, valueType, valueContainsNull)` |`scala.collection.Map` | `MapType(keyType, valueType, valueContainsNull=True)`|
|`SQL.ARRAY<T>`   |`ArrayType(elementType, containsNull)` |`scala.collection.Seq` | `ArrayType(elementType, containsNull=True)`|

For more information, see:

- [org.apache.spark.sql.types](https://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.sql.types.package)
- [Spark SQL and DataFrames Types](https://spark.apache.org/docs/latest/sql-reference.html#data-types)
- [Scala value types](https://www.scala-lang.org/api/current/scala/AnyVal.html)
- [pyspark.sql.types](https://spark.apache.org/docs/latest/api/python/pyspark.sql.html#module-pyspark.sql.types)

### Treatment of NULL

In Spark, types per default allow NULL values while in U-SQL, you explicitly mark scalar, non-object as nullable. While Spark allows you to define a column as not nullable, it will not enforce the constraint and [may lead to wrong result](https://medium.com/@weshoffman/apache-spark-parquet-and-troublesome-nulls-28712b06f836).

In Spark, NULL indicates that the value is unknown. A Spark NULL value is different from any value, including itself. Comparisons between two Spark NULL values, or between a NULL value and any other value, return unknown because the value of each NULL is unknown.  

This behavior is different from U-SQL, which follows C# semantics where `null` is different from any value but equal to itself.  

Thus a SparkSQL `SELECT` statement that uses `WHERE column_name = NULL` returns zero rows even if there are NULL values in `column_name`, while in U-SQL, it would return the rows where `column_name` is set to `null`. Similarly, A Spark `SELECT` statement that uses `WHERE column_name != NULL` returns zero rows even if there are non-null values in `column_name`, while in U-SQL, it would return the rows that have non-null. Thus, if you want the U-SQL null-check semantics, you should use [isnull](https://spark.apache.org/docs/2.3.0/api/sql/index.html#isnull) and [isnotnull](https://spark.apache.org/docs/2.3.0/api/sql/index.html#isnotnull) respectively (or their DSL equivalent).

## Transform U-SQL catalog objects

One major difference is that U-SQL Scripts can make use of its catalog objects, many of which have no direct Spark equivalent.

Spark does provide support for the Hive Meta store concepts, mainly databases, and tables, so you can map U-SQL databases and schemas to Hive databases, and U-SQL tables to Spark tables (see [Moving data stored in U-SQL tables](understand-spark-data-formats.md#move-data-stored-in-u-sql-tables)), but it has no support for views, table-valued functions (TVFs), stored procedures, U-SQL assemblies, external data sources etc.

The U-SQL code objects such as views, TVFs, stored procedures, and assemblies can be modeled through code functions and libraries in Spark and referenced using the host language's function and procedural abstraction mechanisms (for example, through importing Python modules or referencing Scala functions).

If the U-SQL catalog has been used to share data and code objects across projects and teams, then equivalent mechanisms for sharing have to be used (for example, Maven for sharing code objects).

## Transform U-SQL rowset expressions and SQL-based scalar expressions

U-SQL's core language is transforming rowsets and is based on SQL. The following is a non-exhaustive list of the most common rowset expressions offered in U-SQL:

- `SELECT`/`FROM`/`WHERE`/`GROUP BY`+Aggregates+`HAVING`/`ORDER BY`+`FETCH`
- `INNER`/`OUTER`/`CROSS`/`SEMI` `JOIN` expressions
- `CROSS`/`OUTER` `APPLY` expressions
- `PIVOT`/`UNPIVOT` expressions
- `VALUES` rowset constructor

- Set expressions `UNION`/`OUTER UNION`/`INTERSECT`/`EXCEPT`

In addition, U-SQL provides a variety of SQL-based scalar expressions such as

- `OVER` windowing expressions
- a variety of built-in aggregators and ranking functions (`SUM`, `FIRST` etc.)
- Some of the most familiar SQL scalar expressions: `CASE`, `LIKE`, (`NOT`) `IN`, `AND`, `OR` etc.

Spark offers equivalent expressions in both its DSL and SparkSQL form for most of these expressions. Some of the expressions not supported natively in Spark will have to be rewritten using a combination of the native Spark expressions and semantically equivalent patterns. For example, `OUTER UNION` will have to be translated into the equivalent combination of projections and unions.

Due to the different handling of NULL values, a U-SQL join will always match a row if both of the columns being compared contain a NULL value, while a join in Spark will not match such columns unless explicit null checks are added.

## Transform other U-SQL concepts

U-SQL also offers a variety of other features and concepts, such as federated queries against SQL Server databases, parameters, scalar, and lambda expression variables, system variables, `OPTION` hints.

### Federated Queries against SQL Server databases/external tables

U-SQL provides data source and external tables as well as direct queries against Azure SQL Database. While Spark does not offer the same object abstractions, it provides [Spark connector for Azure SQL Database](../azure-sql/database/spark-connector.md) that can be used to query SQL databases.

### U-SQL parameters and variables

Parameters and user variables have equivalent concepts in Spark and their hosting languages.

For example in Scala, you can define a variable with the `var` keyword:

```
var x = 2 * 3;
println(x)
```

U-SQL's system variables (variables starting with `@@`) can be split into two categories:

- Settable system variables that can be set to specific values to impact the scripts behavior
- Informational system variables that inquire system and job level information

Most of the settable system variables have no direct equivalent in Spark. Some of the informational system variables can be modeled by passing the information as arguments during job execution, others may have an equivalent function in Spark's hosting language.

### U-SQL hints

U-SQL offers several syntactic ways to provide hints to the query optimizer and execution engine:  

- Setting a U-SQL system variable
- an `OPTION` clause associated with the rowset expression to provide a data or plan hint
- a join hint in the syntax of the join expression (for example, `BROADCASTLEFT`)

Spark's cost-based query optimizer has its own capabilities to provide hints and tune the query performance. Please refer to the corresponding documentation.

## Next steps

- [Understand Spark data formats for U-SQL developers](understand-spark-data-formats.md)
- [.NET for Apache Spark](https://docs.microsoft.com/dotnet/spark/what-is-apache-spark-dotnet)
- [Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-upgrade.md)
- [Transform data using Spark activity in Azure Data Factory](../data-factory/transform-data-using-spark.md)
- [Transform data using Hadoop Hive activity in Azure Data Factory](../data-factory/transform-data-using-hadoop-hive.md)
- [What is Apache Spark in Azure HDInsight](../hdinsight/spark/apache-spark-overview.md)
