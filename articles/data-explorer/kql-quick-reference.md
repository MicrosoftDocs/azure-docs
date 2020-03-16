---
title: KQL quick reference
description: A list of useful KQL functions and their definitions with syntax examples.
author: orspod
ms.author: orspodek
ms.reviewer: 
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/19/2020
---

# KQL quick reference

This article shows you a list of functions and their descriptions to help get you started using Kusto Query Language.

| Operator/Function                               | Description                           | Syntax                                           |
| :---------------------------------------------- | :------------------------------------ |:-------------------------------------------------|
|**Filter/Search/Condition**                      |**_Find relevant data by filtering or searching_** |                      |
| [where](/azure/kusto/query/whereoperator)                      | Filters on a specific predicate           | `T | where Predicate`                         |
| [where contains/has](/azure/kusto/query/whereoperator)        | `Contains`: Looks for any substring match <br> `Has`: Looks for a specific word (better performance)  | `T | where col1 contains/has "[search term]"`|
| [search](/azure/kusto/query/searchoperator)                    | Searches all columns in the table for the value | `[TabularSource |] search [kind=CaseSensitivity] [in (TableSources)] SearchPredicate` |
| [take](/azure/kusto/query/takeoperator)                        | Returns the specified number of records. Use to test a query<br>**_Note_**: `_take`_ and `_limit`_ are synonyms. | `T | take NumberOfRows` |
| [case](/azure/kusto/query/casefunction)                        | Adds a condition statement, similar to if/then/elseif in other systems. | `case(predicate_1, then_1, predicate_2, then_2, predicate_3, then_3, else)` |
| [distinct](/azure/kusto/query/distinctoperator)                | Produces a table with the distinct combination of the provided columns of the input table | `distinct [ColumnName], [ColumnName]` |
| **Date/Time**                                   |**_Operations that use date and time functions_**               |                          |
|[ago](/azure/kusto/query/agofunction)                           | Returns the time offset relative to the time the query executes. For example, `ago(1h)` is one hour before the current clock's reading. | `ago(a_timespan)` |
| [format_datetime](/azure/kusto/query/format-datetimefunction)  | Returns data in [various date formats](/azure/kusto/query/format-datetimefunction#supported-formats). | `format_datetime(datetime , format)` |
| [bin](/azure/kusto/query/binfunction)                          | Rounds all values in a timeframe and groups them | `bin(value,roundTo)` |
| **Create/Remove Columns**                   |**_Add or remove columns in a table_** |                                                    |
| [print](/azure/kusto/query/printoperator)                      | Outputs a single row with one or more scalar expressions | `print [ColumnName =] ScalarExpression [',' ...]` |
| [project](/azure/kusto/query/projectoperator)                  | Selects the columns to include in the order specified | `T | project ColumnName [= Expression] [, ...]` <br> Or <br> `T | project [ColumnName | (ColumnName[,]) =] Expression [, ...]` |
| [project-away](/azure/kusto/query/projectawayoperator)         | Selects the columns to exclude from the output | `T | project-away ColumnNameOrPattern [, ...]` |
| [extend](/azure/kusto/query/extendoperator)                    | Creates a calculated column and adds it to the result set | `T | extend [ColumnName | (ColumnName[, ...]) =] Expression [, ...]` |
| **Sort and Aggregate Dataset**                 |**_Restructure the data by sorting or grouping them in meaningful ways_**|                  |
| [sort](/azure/kusto/query/sortoperator)                        | Sorts the rows of the input table by one or more columns in ascending or descending order | `T | sort by expression1 [asc|desc], expression2 [asc|desc], …` |
| [top](/azure/kusto/query/topoperator)                          | Returns the first N rows of the dataset when the dataset is sorted using `by` | `T | top numberOfRows by expression [asc|desc] [nulls first|last]` |
| [summarize](/azure/kusto/query/summarizeoperator)              | Groups the rows according to the `by` group columns, and calculates aggregations over each group | `T | summarize [[Column =] Aggregation [, ...]] [by [Column =] GroupExpression [, ...]]` |
| [count](/azure/kusto/query/countoperator)                       | Counts records in the input table (for example, T)<br>This operator is shorthand for `summarize count() `| `T | count` |
| [join](/azure/kusto/query/joinoperator)                        | Merges the rows of two tables to form a new table by matching values of the specified column(s) from each table. Supports a full range of join types: `flouter`, `inner`, `innerunique`, `leftanti`, `leftantisemi`, `leftouter`, `leftsemi`, `rightanti`, `rightantisemi`, `rightouter`, `rightsemi` | `LeftTable | join [JoinParameters] ( RightTable ) on Attributes` |
| [union](/azure/kusto/query/unionoperator)                      | Takes two or more tables and returns all their rows | `[T1] | union [T2], [T3], …` |
| [range](/azure/kusto/query/rangeoperator)                      | Generates a table with an arithmetic series of values | `range columnName from start to stop step step` |
| **Format Data**                                 | **_Restructure the data to output in a useful way_** | |
| [lookup](/azure/kusto/query/lookupoperator)                    | Extends the columns of a fact table with values looked-up in a dimension table | `T1 | lookup [kind = (leftouter|inner)] ( T2 ) on Attributes` |
| [mv-expand](/azure/kusto/query/mvexpandoperator)               | Turns dynamic arrays into rows (multi-value expansion) | `T | mv-expand Column` |
| [parse](/azure/kusto/query/parseoperator)                      | Evaluates a string expression and parses its value into one or more calculated columns. Use for structuring unstructured data. | `T | parse [kind=regex  [flags=regex_flags] |simple|relaxed] Expression with * (StringConstant ColumnName [: ColumnType]) *...` |
| [make-series](/azure/kusto/query/make-seriesoperator)          | Creates series of specified aggregated values along a specified axis | `T | make-series [MakeSeriesParamters] [Column =] Aggregation [default = DefaultValue] [, ...] on AxisColumn from start to end step step [by [Column =] GroupExpression [, ...]]` |
| [let](/azure/kusto/query/letstatement)                         | Binds a name to expressions that can refer to its bound value. Values can be lambda expressions to create ad-hoc functions as part of the query. Use `let` to create expressions over tables whose results look like a new table. | `let Name = ScalarExpression | TabularExpression | FunctionDefinitionExpression` |
| **General**                                     | **_Miscellaneous operations and function_** | |
| [invoke](/azure/kusto/query/invokeoperator)                    | Runs the function on the table that it receives as input. | `T | invoke function([param1, param2])` |
| [evaluate pluginName](/azure/kusto/query/evaluateoperator)     | Evaluates query language extensions (plugins) | `[T |] evaluate [ evaluateParameters ] PluginName ( [PluginArg1 [, PluginArg2]... )` |
| **Visualization**                               | **_Operations that display the data in a graphical format_** | |
| [render](/azure/kusto/query/renderoperator) | Renders results as a graphical output | `T | render Visualization [with (PropertyName = PropertyValue [, ...] )]` |
