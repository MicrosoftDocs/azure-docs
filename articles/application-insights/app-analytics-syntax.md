<properties 
	pageTitle="Statements in Analytics Application Insights" 
	description="Queries, expressions, and let statements in Analytics, 
	             the powerful search tool of Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/21/2016" 
	ms.author="awills"/>

 
# Analytcis statements in Application Insights

[Analytics](app-analytics.md) lets you run powerful queries over the telemetry from your app collected by 
[Application Insights](app-insights-overview.md). These pages describe its query lanquage.

[AZURE.INCLUDE [app-analytics-top-index](../../includes/app-analytics-top-index.md)]

## Data model

In AIQL:

* A *database* contains zero or more named *tables.*
* A *table* contains:
 * One or more named *columns.* Each column has a *type.*
 * One or more *rows.*
* Each row has one or more *cells,* one for each column of its table.
* A cell can contain a value of the type of its column, or `null`.


## Entity names

Every column, table or database has a name unique within its container. 

Refer to an entity either by its name (if the context is unambiguous) or qualified by its container. For example, `MyColumn` can also be referenced as `MyTable.MyColumn` or `MyDatabase.MyTable.MyColumn`.

Names can be up to 1024 characters long. They are case-sensitive and may contain letters, digits and underscores (`_`). 

In addition, names may be quoted so that they can contain other characters. For example:

|||
|---|---|
|`['path\\file\n\'x\'']` | Use `\` to escape characters|
|`["d-e.=/f#\n"]` | |
|`[@'path\file']`| No escapes - `\` is literal|
|`[@"\now & then\"]` | |
|`[where]` | Using a language keyword as a name|

Names can also be qualified with the name of the database (see [Cross-databse queries](#cross-database-queries)) 

```
database("MyDb").Table
```


## Statements

There are four kinds of statements in CSL:

### Data Queries
  
Read-only requests about the data stored in Analytics. For example:

* `event` - Return all records in the table named "event."
* `event | count` - Return a the number of records in "event."

    
## let statements

#### Overview
It is possible to prefix a data query statement by one or more let statements. 
These allow one to bind a name (a valid entity name) to an expression. Names defined by a let statement can then be used one or more times in the following data query statement.

A let statement may bind a name to expressions of the following kind:
1. Scalar
2. Tabular data 

When binding to Tabular data - one can promote let statement to a "view" - that will
allow the statement to participate in "union *" operations.

#### Syntax

`let <name> = <expression>`

<expression> may be a lambda declaration with zero, one, or more arguments:

`() {...}`

`(<arg0>:<type0>, ...) {...}`

Examples:
The following example binds the name 'x' to the scalar literal '1':

```
let x=1;
range y from x to x step x
```

The following example binds a single hour's worth of logs to the name Window, 
and then performs a self-join on Window:


```
let Window=Logs | where Timestamp > ago(1h);
Window | where  ... | join (Window | where …) on ActivityId| ...
```

The following two examples show the use of a let statement with a lambda expression:


```
let Test = () { range x from 1 to 10 step 1 };
Test | count

let step=1;
let Test = (start:long, end:long) { range x from start to end step 1 };
Test(1, 10) | count
```

Using 'view' keyword to promote let statements to a View that participates in 
union * operations.


```
let Test1 = view () { range x from start to end step 1 };
let Test2 = view () { range x from start to end step 1 };
union * | count
// Result: 20
```


## restrict statement

#### Overview
It is possible to restrict access queries access in scope of statement list using next 
statement:


```
restrict access to (<entity1, entity2, ...>);
```
 
The statement will allow access only to those entities (let 
statements or Tabular entities) 
that are permitted by the restrict statement.
 
Examples:

```
// Restricting access to Test statement only
let Test = () { range x from 1 to 10 step 1 };
restrict access to (Test);
Test
 
// Assume that there is a table called Table1, Table2 in the database
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
 
// When those statements appear before the command - the next works
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
View1 |  count
 
// When those statements appear before the command - the next access is not allowed
let View1 = view () { Table1 | project Column1 };
let View2 = view () { Table2 | project Column1, Column2 };
restrict access to (View1, View2);
Table1 |  count
```


## Query composition

A *query* follows the pattern:

- *source* | *filter* | *filter* ...

For example:


```
Logs | where Timestamp > ago(1d) | count
```

* *Source* is the name of a database table, or a previously-defined result table.
* Each *filter* invokes a query operator such as `where` or `count`, with appropriate parameters. Parameters may be *scalar expressions*, nested *data queries*, or column names.

For example:  


```
Logs 
| where Timestamp > ago(1d) 
| join 
(
    Events 
    | where continent == 'Europe'
) on RequestId 
``` 

## Let statements

A let statement can be used to define functions -- named expressions
taking zero or more arguments and returning values. Further statements
are then able to "invoke" those functions. 

### Named values

Define names to represent scalar values:


```
let n = 10;  // number
let place = "Dallas";  // string
let cutoff = ago(62d); // datetime
Events 
| where timestamp > cutoff 
    and city == place 
| take n
```

Define names to represent query results:


```
let Cities = Events | summarize dcount(city) by country;
Cities | take 10
```

This is especially useful for a self-join:


```
let Recent = Events | where timestamp > ago(7d);
Recent | where name contains "session_started" 
| project start = timestamp, session_id
| join (Recent 
        | where name contains "session_ended" 
        | project stop = timestamp, session_id)
    on session_id
| extend duration = stop - start 
```

## Named functions

Define functions that return scalar results:


```
let square = (n:long){n*n};
// yield 9 rows
Events | take square(3)    
```

Define functions that return query results:


```
let TopEvents= (n:long, when:datetime){Events 
                | where timestamp > when | take n};
TopEvents(5, ago(7d)) 
```

Parameters to named functions must be scalars. 





[AZURE.INCLUDE [app-analytics-footer](../../includes/app-analytics-footer.md)]
