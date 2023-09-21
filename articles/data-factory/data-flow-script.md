---
title: Mapping data flow script
description: Overview of Data Factory's data flow script code-behind language
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 07/17/2023
---

# Data flow script (DFS)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Data flow script (DFS) is the underlying metadata, similar to a coding language, that is used to execute the transformations that are included in a mapping data flow. Every transformation is represented by a series of properties that provide the necessary information to run the job properly. The script is visible and editable from ADF by clicking on the "script" button on the top ribbon of the browser UI.

:::image type="content" source="media/data-flow/scriptbutton.png" alt-text="Script button":::

For instance, `allowSchemaDrift: true,` in a source transformation tells the service to include all columns from the source dataset in the data flow even if they aren't included in the schema projection.

## Use cases
The DFS is automatically produced by the user interface. You can click the Script button to view and customize the script. You can also generate scripts outside of the ADF UI and then pass that into the PowerShell cmdlet. When debugging complex data flows, you may find it easier to scan the script code-behind instead of scanning the UI graph representation of your flows.

Here are a few example use cases:
- Programatically producing many data flows that are fairly similar, i.e. "stamping-out" data flows.
- Complex expressions that are difficult to manage in the UI or are resulting in validation issues.
- Debugging and better understanding various errors returned during execution.

When you build a data flow script to use with PowerShell or an API, you must collapse the formatted text into a single line. You can keep tabs and newlines as escape characters. But the text must be formatted to fit inside a JSON property. There's a button on the script editor UI at the bottom that will format the script as a single line for you.

:::image type="content" source="media/data-flow/copybutton.png" alt-text="Copy button":::

## How to add transforms
Adding transformations requires three basic steps: adding the core transformation data, rerouting the input stream, and then rerouting the output stream. This can be seen easiest in an example.
Let's say we start with a simple source to sink data flow like the following:

```
source(output(
        movieId as string,
        title as string,
        genres as string
    ),
    allowSchemaDrift: true,
    validateSchema: false) ~> source1
source1 sink(allowSchemaDrift: true,
    validateSchema: false) ~> sink1
```

If we decide to add a derive transformation, first we need to create the core transformation text, which has a simple expression to add a new uppercase column called `upperCaseTitle`:
```
derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
```

Then, we take the existing DFS and add the transformation:
```
source(output(
        movieId as string,
        title as string,
        genres as string
    ),
    allowSchemaDrift: true,
    validateSchema: false) ~> source1
derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
source1 sink(allowSchemaDrift: true,
    validateSchema: false) ~> sink1
```

And now we reroute the incoming stream by identifying which transformation we want the new transformation to come after (in this case, `source1`) and copying the name of the stream to the new transformation:
```
source(output(
        movieId as string,
        title as string,
        genres as string
    ),
    allowSchemaDrift: true,
    validateSchema: false) ~> source1
source1 derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
source1 sink(allowSchemaDrift: true,
    validateSchema: false) ~> sink1
```

Finally we identify the transformation we want to come after this new transformation, and replace its input stream (in this case, `sink1`) with the output stream name of our new transformation:
```
source(output(
        movieId as string,
        title as string,
        genres as string
    ),
    allowSchemaDrift: true,
    validateSchema: false) ~> source1
source1 derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
deriveTransformationName sink(allowSchemaDrift: true,
    validateSchema: false) ~> sink1
```

## DFS fundamentals
The DFS is composed of a series of connected transformations, including sources, sinks, and various others which can add new columns, filter data, join data, and much more. Usually, the script will start with one or more sources followed by many transformations and ending with one or more sinks.

Sources all have the same basic construction:
```
source(
  source properties
) ~> source_name
```

For instance, a simple source with three columns (movieId, title, genres) would be:
```
source(output(
        movieId as string,
        title as string,
        genres as string
    ),
    allowSchemaDrift: true,
    validateSchema: false) ~> source1
```

All transformations other than sources have the same basic construction:
```
name_of_incoming_stream transformation_type(
  properties
) ~> new_stream_name
```

For example, a simple derive transformation that takes a column (title) and overwrites it with an uppercase version would be as follows:
```
source1 derive(
  title = upper(title)
) ~> derive1
```

And a sink with no schema would be:
```
derive1 sink(allowSchemaDrift: true,
    validateSchema: false) ~> sink1
```

## Script snippets

Script snippets are shareable code of Data Flow Script that you can use to share across data flows. This video below talks about how to use script snippets and utilizing Data Flow Script to copy and paste portions of the script behind your data flow graphs:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4tA9b]


### Aggregated summary stats
Add an Aggregate transformation to your data flow called "SummaryStats" and then paste in this code below for the aggregate function in your script, replacing the existing SummaryStats. This will provide a generic pattern for data profile summary statistics.

```
aggregate(each(match(true()), $$+'_NotNull' = countIf(!isNull($$)), $$ + '_Null' = countIf(isNull($$))),
		each(match(type=='double'||type=='integer'||type=='short'||type=='decimal'), $$+'_stddev' = round(stddev($$),2), $$ + '_min' = min ($$), $$ + '_max' = max($$), $$ + '_average' = round(avg($$),2), $$ + '_variance' = round(variance($$),2)),
		each(match(type=='string'), $$+'_maxLength' = max(length($$)))) ~> SummaryStats
```
You can also use the below sample to count the number of unique and the number of distinct rows in your data. The example below can be pasted into a data flow with Aggregate transformation called ValueDistAgg. This example uses a column called "title". Be sure to replace "title" with the string column in your data that you wish to use to get value counts.

```
aggregate(groupBy(title),
	countunique = count()) ~> ValueDistAgg
ValueDistAgg aggregate(numofunique = countIf(countunique==1),
		numofdistinct = countDistinct(title)) ~> UniqDist
```

### Include all columns in an aggregate
This is a generic aggregate pattern that demonstrates how you can keep the remaining columns in your output metadata when you're building aggregates. In this case, we use the ```first()``` function to choose the first value in every column whose name isn't "movie". To use this, create an Aggregate transformation called DistinctRows and then paste this in your script over top of the existing DistinctRows aggregate script.

```
aggregate(groupBy(movie),
	each(match(name!='movie'), $$ = first($$))) ~> DistinctRows
```

### Create row hash fingerprint 
Use this code in your data flow script to create a new derived column called ```DWhash``` that produces a ```sha1``` hash of three columns.

```
derive(DWhash = sha1(Name,ProductNumber,Color)) ~> DWHash
```

You can also use this script below to generate a row hash using all columns that are present in your stream, without needing to name each column:

```
derive(DWhash = sha1(columns())) ~> DWHash
```

### String_agg equivalent
This code will act like the T-SQL ```string_agg()``` function and will aggregate string values into an array. You can then cast that array into a string to use with SQL destinations.

```
source1 aggregate(groupBy(year),
	string_agg = collect(title)) ~> Aggregate1
Aggregate1 derive(string_agg = toString(string_agg)) ~> StringAgg
```

### Count number of updates, upserts, inserts, deletes
When using an Alter Row transformation, you may want to count the number of updates, upserts, inserts, deletes that result from your Alter Row policies. Add an Aggregate transformation after your alter row and paste this Data Flow Script into the aggregate definition for those counts.

```
aggregate(updates = countIf(isUpdate(), 1),
		inserts = countIf(isInsert(), 1),
		upserts = countIf(isUpsert(), 1),
		deletes = countIf(isDelete(),1)) ~> RowCount
```

### Distinct row using all columns
This snippet will add a new Aggregate transformation to your data flow, which will take all incoming columns, generate a hash that is used for grouping to eliminate duplicates, then provide the first occurrence of each duplicate as output. You don't need to explicitly name the columns, they'll be automatically generated from your incoming data stream.

```
aggregate(groupBy(mycols = sha2(256,columns())),
    each(match(true()), $$ = first($$))) ~> DistinctRows
```

### Check for NULLs in all columns
This is a snippet that you can paste into your data flow to generically check all of your columns for NULL values. This technique leverages schema drift to look through all columns in all rows and uses a Conditional Split to separate the rows with NULLs from the rows with no NULLs. 

```
split(contains(array(toString(columns())),isNull(#item)),
	disjoint: false) ~> LookForNULLs@(hasNULLs, noNULLs)
```

### AutoMap schema drift with a select
When you need to load an existing database schema from an unknown or dynamic set of incoming columns, you must map the right-side columns in the Sink transformation. This is only needed when you're loading an existing table. Add this snippet before your Sink to create a Select that auto-maps your columns. Leave your Sink mapping to auto-map.

```
select(mapColumn(
		each(match(true()))
	),
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> automap
```

### Persist column data types
Add this script inside a Derived Column definition to store the column names and data types from your data flow to a persistent store using a sink.

```
derive(each(match(type=='string'), $$ = 'string'),
	each(match(type=='integer'), $$ = 'integer'),
	each(match(type=='short'), $$ = 'short'),
	each(match(type=='complex'), $$ = 'complex'),
	each(match(type=='array'), $$ = 'array'),
	each(match(type=='float'), $$ = 'float'),
	each(match(type=='date'), $$ = 'date'),
	each(match(type=='timestamp'), $$ = 'timestamp'),
	each(match(type=='boolean'), $$ = 'boolean'),
	each(match(type=='long'), $$ = 'long'),
	each(match(type=='double'), $$ = 'double')) ~> DerivedColumn1
```

### Fill down
Here's how to implement the common "Fill Down" problem with data sets when you want to replace NULL values with the value from the previous non-NULL value in the sequence. Note that this operation can have negative performance implications because you must create a synthetic window across your entire data set with a "dummy" category value. Additionally, you must sort by a value to create the proper data sequence to find the previous non-NULL value. This snippet below creates the synthetic category as "dummy" and sorts by a surrogate key. You can remove the surrogate key and use your own data-specific sort key. This code snippet assumes you've already added a Source transformation called ```source1```

```
source1 derive(dummy = 1) ~> DerivedColumn
DerivedColumn keyGenerate(output(sk as long),
	startAt: 1L) ~> SurrogateKey
SurrogateKey window(over(dummy),
	asc(sk, true),
	Rating2 = coalesce(Rating, last(Rating, true()))) ~> Window1
```

### Moving Average
Moving average can be implemented very easily in data flows by using a Windows transformation. This example below creates a 15-day moving average of stock prices for Microsoft.

```
window(over(stocksymbol),
	asc(Date, true),
	startRowOffset: -7L,
	endRowOffset: 7L,
	FifteenDayMovingAvg = round(avg(Close),2)) ~> Window1
```

### Distinct count of all column values
You can use this script to identify key columns and view the cardinality of all columns in your stream with a single script snippet. Add this script as an aggregate transformation to your data flow and it will automatically provide distinct counts of all columns.

```
aggregate(each(match(true()), $$ = countDistinct($$))) ~> KeyPattern
```

### Compare previous or next row values
This sample snippet demonstrates how the Window transformation can be used to compare column values from the current row context with column values from rows before and after the current row. In this example, a Derived Column is used to generate a dummy value to enable a window partition across the entire data set. A Surrogate Key transformation is used to assign a unique key value for each row. When you apply this pattern to your data transformations, you can remove the surrogate key if you're a column that you wish to order by and you can remove the derived column if you have columns to use to partition your data by.

```
source1 keyGenerate(output(sk as long),
	startAt: 1L) ~> SurrogateKey1
SurrogateKey1 derive(dummy = 1) ~> DerivedColumn1
DerivedColumn1 window(over(dummy),
	asc(sk, true),
	prevAndCurr = lag(title,1)+'-'+last(title),
		nextAndCurr = lead(title,1)+'-'+last(title)) ~> leadAndLag
```

### How many columns are in my data?

```size(array(columns()))```

## Next steps

Explore Data Flows by starting with the [data flows overview article](concepts-data-flow-overview.md)
