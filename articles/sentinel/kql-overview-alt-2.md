---
title: Kusto Query Language (KQL) in Azure Sentinel
description: This article describes how Kusto Query Language (KQL) is used in Azure Sentinel, and provides some basic familiarity with the language.
author: yelevin
ms.author: yelevin
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 10/19/2021
---

# Kusto Query Language (KQL) in Microsoft Sentinel

Read this article to learn some basic uses for Kusto Query Language (KQL) in Microsoft Sentinel.

The Kusto Query Language, or KQL, is the language you will use to work with and manipulate data in Microsoft Sentinel. The logs you feed into your workspace aren’t worth much if you can’t analyze them and get the important information hidden in all that data. Kusto Query Language has not only the power and flexibility to get that information, but the simplicity to help you get started quickly. If you have a background in scripting or working with databases, a lot of the content of this article will feel very familiar. If not, don’t worry, you will soon be ready to start writing your own queries and driving value for your organization.

This article introduces the basics of KQL, covering some of the most used functions and operators, which should address 75 to 80 percent of the queries you will write day to day. When you'll need more depth, or to run more advanced queries, you can take advantage of the official KQL documentation as well as a variety of online courses.

## The KQL query structure

A good place to start learning KQL is to develop an understanding of the overall query structure. The first thing you'll notice when looking at a Kusto query is the use of the pipe symbol (` | `). The structure of a Kusto query is one where you pass your data across a "pipeline," and each step provides some level of processing. At the end of the pipeline, you will get your final result. In effect, this is our pipeline:

`Get Data | Filter | Summarize | Sort | Select`

This concept of passing data down the pipeline makes for a very intuitive structure, as it is easy to create a mental picture of your data at each step.

To illustrate this, let's take a look at the following KQL query, which looks at Azure Active Directory (Azure AD) sign-in logs. As you read through each line, you can see the keywords that indicate what's happening to the data (I've included the relevant stage in the pipeline as a comment in each line).

> [!NOTE]
> You can add comments to any line in a query by preceding them with a double slash (` // `).

```kusto
SigninLogs                              // Get data
| evaluate bag_unpack(LocationDetails)  // Ignore this line for now; we'll come back to it at the end.
| where RiskLevelDuringSignIn == 'none' // Filter
   and TimeGenerated >= ago(7d)         // Filter
| summarize Count = count() by city     // Summarize
| order by Count desc                   // Sort
| take 5                                // Select
```

One of the best parts of KQL is that within reason, you can make the steps happen in any order you choose, but be aware that the order can affect the query's performance, and sometimes even the results.

A good rule of thumb is to filter your data early, so you are only passing relevant data down the pipeline. This will greatly increase performance and ensure that you aren’t accidentally including irrelevant data in summarization steps.

Hopefully, you now have an appreciation for the overall structure of a KQL query. Now let’s look at the actual KQL operators themselves, which are used to create a KQL query.

### Data types

Before we get into the actual KQL operators, let’s first touch on data types. As in most languages, the data type determines what calculations and manipulations can be run against a value. For example, if you have a value that is of type string, you won’t be able to perform arithmetic calculations against it.

In KQL, most of the data types follow traditional names you are used to seeing, but there are a few that you might not have seen before such as dynamic and timespan. The following table shows the full list:

| Type       | Additional name(s) | Equivalent .NET type              |
| ---------- | ------------------ | --------------------------------- |
| `bool`     | `Boolean`          | `System.Boolean`                  |
| `datetime` | `Date`             | `System.DateTime`                 |
| `dynamic`  |                    | `System.Object`                   |
| `guid`     | `uuid`, `uniqueid` | `System.Guid`                     |
| `int`      |                    | `System.Int32`                    |
| `long`     |                    | `System.Int64`                    |
| `real`     | `Double`           | `System.Double`                   |
| `string`   |                    | `System.String`                   |
| `timespan` | `Time`             | `System.TimeSpan`                 |
| `decimal`  |                    | `System.Data.SqlTypes.SqlDecimal` |
| | | |

While most of the data types are standard, *dynamic*, *timespan*, and *guid* are less commonly seen.

***Dynamic*** has a structure very similar to JSON (JavaScript Object Notation) with one key difference: It can store KQL-specific data types that traditional JSON cannot, such as a nested dynamic value or timespan. Here’s an example of a dynamic type:

```kusto
{
"countryOrRegion":"US",
"geoCoordinates": {
"longitude":-122.12094116210936,
"latitude":47.68050003051758
},
"state":"Washington",
"city":"Redmond"
}
```

***Timespan*** is a data type that refers to a measure of time such as hours, days, or seconds. Do not confuse timespan with datetime, which is an actual date and time, not a measure of time. The following table shows a list of timespan suffixes.

| Function | Description |
| -------- | ----------- |
| `D` | days |
| `H` | hours |
| `M` | minutes |
| `S` | seconds |
| `Ms` | milliseconds |
| `Microsecond` | microseconds |
| `Tick` | nanoseconds |
| | |

***Guid*** is a datatype representing a 128-bit, globally-unique identifier, which follows the standard format of [8]-[4]-[4]-[4]-[12], where each [number] represents the number of characters and each character can range from 0-9 or a-f.

> [!NOTE]
> KQL has both tabular and scalar operators. In the remainder of this appendix, if you simply see the word "operator," you can assume it means tabular operator, unless otherwise noted.


## Getting, limiting, sorting, and filtering data

When learning any new language, we want to start with a solid foundation. For KQL, this foundation is a collection of operators that will let you start to filter and sort your data. What’s great about KQL is that these handful of commands and operators will make up about 75 percent of the querying you will ever need to do. The remaining 25 percent will be stretching the language to meet your more advanced needs. Let’s expand a bit on some of the commands we used in our above example and look at take, order, and where.

For each operator, we will examine its use in our previous SigninLogs example. Additionally, for each operator, I’ll provide either a useful tip or a best practice.

### Getting data

The first line of any basic query in KQL specifies which table you want to work with. In the case of Azure Sentinel, this will likely be the name of a log type in your workspace, such as SigninLogs, SecurityAlert, or ThreatIntelligenceIndicator. For example:

`SigninLogs`

Note that log names are case sensitive, which is true about KQL in general, so `SigninLogs` and `signinLogs` will be interpreted differently. Take care when choosing names for your custom logs, so they are easily identifiable and that they are not too similar to another log.

### Limiting data: take

The take operator is used to limit your results by the number of rows returned. It accepts an integer to determine the number of rows returned. Typically, it is used at the end of a query after you have determined your sort order.

Using take earlier in the query can be useful for limiting large datasets for testing; however, you run the risk of unintentionally excluding records from your dataset if you have not determined the sort order for your data, so take care. Here’s an example of using take:

SigninLogs
      | take 5
Tip

When working on a brand-new query where you may not know what the query will look like, it can be useful to put a take statement at the beginning to artificially limit your dataset for faster processing and experimentation. Once you are happy with the full query, you can remove the initial take step.

### Sorting data: order

The order operator is used to sort your data by a specified column. For example, here we ordered the results by TimeGenerated and we set the order direction to descending (desc), which will place the highest values first; the inverse being ascending which is denoted as asc.

SigninLogs
| order by TimeGenerated desc
| take 5
Note that we put the order operator before the take operator. We need to sort first to make sure we get the appropriate five records.

In cases where two or more records have the same value in the column you are sorting by, you can be explicit in how the query handles these situations by adding a comma-separated list of variables after the by keyword, but before the sort order keyword (desc), like so:

SigninLogs
| order by TimeGenerated, Identity desc
| take 5
Now, if TimeGenerated is the same between multiple records, it will then try to sort by the value in the Identity column.

### Filtering data: where

The where operator is arguably the most important operator because it is key to making sure you are only working with the subset of data that is valuable to your use case. You should do your best to filter your data as early in the query as possible because doing so will improve query performance by reducing the amount of data that needs to be processed in subsequent steps; it also ensures that you are only performing calculations on the desired data. See this example:

SigninLogs
| where TimeGenerated >= ago(7d)
| order by TimeGenerated, Identity desc
| take 5

The where operator accepts the name of a variable, a comparison (scalar) operator, and a value. In our case, we used >= to denote that the value in the TimeGenerated column needs to be greater than or equal to (later than) seven days ago.

There are two types of comparison operators in KQL: string and numerical. Table A-3 shows the full list of numerical operators:

#### Numerical operators

| Operator | Description |
| - | - |
| + | Add |
| - | Subtract |
| * | Multiply |
| / | Divide |
| % | Modulo |
| < | Less |
| > | Greater |
| == | Equals |
| != | Not equals |
| <= | Less or Equal |
| >= | Greater or Equal |
| in | Equals to one of the elements |
| !in | Not equals to any of the elements |
| 

However, the list of string operators is a much longer list because it has permutations for case sensitivity, substring locations, prefixes, suffixes, and much more. Note, the == operator is both a numeric and string operator, meaning it can be used for both numbers and text. For example, both of the following statements would be valid where statements:

| where ResultType == 0
| where Category == 'SignInLogs'
Best Practice: Almost certainly, you will want to filter your data by more than one column or filter the same column in more than one way. In these instances, there are two best practices you should keep in mind.

You can combine multiple where statements into a single step by using the and keyword. For example

SigninLogs
| where Resource == ResourceGroup
    and TimeGenerated >= ago(7d)
When you have multiple where clauses joined with the and keyword, like above, you will get better performance by putting clauses that only reference a single column first. So, a better way to write the above query would be:

SigninLogs
| where TimeGenerated >= ago(7d)
    and Resource == ResourceGroup

## Summarizing data

Summarizing is one of the most important tabular operators in KQL, but it also is one of the more complex operators to learn if you are new to query languages in general. The job of summarize is to take in a table of data and output a new table that is aggregated by one or more columns.

Structure of the summarize statement
The basic structure of a summarize statement is as follows:

| summarize <aggregation> by <column>
For example, the following would return the count of records for each CounterName value in the Perf table:

Perf
| summarize count() by CounterName
Because the output of summarize is a new table, any columns not explicitly specified in the summarize statement will not be passed down the pipeline. To illustrate this concept, consider this example:

Perf
| project ObjectName, CounterValue , CounterName
| summarize count() by CounterName
| order by ObjectName asc
On the second line, we are specifying that we only care about the columns ObjectName, CounterValue, and CounterName. We then summarized to get the record count by CounterName and finally, we attempt to sort the data in ascending order based on the ObjectName column. Unfortunately, this query will fail with an error indicating that the ObjectName is unknown. This is because when we summarized, we only included the Count and CounterName columns in our new table. To fix this, we can simply add ObjectName to the end of our summarize step, like this:

Perf
| project ObjectName, CounterValue , CounterName
| summarize count() by CounterName, ObjectName
| order by ObjectName asc
The way to read the summarize line in your head would be: “summarize the count of records by CounterName, and group by ObjectName”. You can continue adding comma-separated columns to the end of the summarize statement.

Building on the previous example, if we want to aggregate multiple columns at the same time, we can achieve this by adding a comma-separated list of aggregations. In the example below, we are getting a sum of the CounterValue column in addition to getting a count of records:

Perf
| project ObjectName, CounterValue , CounterName
| summarize count(), sum(CounterValue) by CounterName, ObjectName
| order by ObjectName asc
This seems like a good time to talk about column names for these aggregated columns. At the start of this section, we said the summarize operator takes in a table of data and produces a new table, and only the columns you specify in the summarize statement will continue down the pipeline. Therefore, if you were to run the above example, the resulting columns for our aggregation would be count_ and sum_CounterValue.

The KQL engine will automatically create a column name without us having to be explicit, but often, you will find that you will prefer your new column have a friendlier name. To do this, you can easily name your column in the summarize statement, like so:

Perf
| project ObjectName, CounterValue , CounterName
| summarize Count = count(), CounterSum = sum(CounterValue) by CounterName,
ObjectName
| order by ObjectName asc
Now, our summarized columns will be named Count and CounterSum.

There is much more to the summarize operator than we can cover in this short section, but I encourage you to invest the time to learn it because it is a key component to any data analysis you plan to perform on your Azure Sentinel data.

Aggregation reference
The are many aggregation functions, but some of the most commonly used are sum(), count(), and avg(). Table A-4 shows the full list.

TABLE A-4 Aggregation Functions

Function

Description

any()

Returns random non-empty value for the group

arg_max()

Returns one or more expressions when argument is maximized

arg_min()

Returns one or more expressions when argument is minimized

avg()

Returns average value across the group

buildschema()

Returns the minimal schema that admits all values of the dynamic input

count()

Returns count of the group

countif()

Returns count with the predicate of the group

dcount()

Returns approximate distinct count of the group elements

make_bag()

Returns a property bag of dynamic values within the group

make_list()

Returns a list of all the values within the group

make_set()

Returns a set of distinct values within the group

max()

Returns the maximum value across the group

min()

Returns the minimum value across the group

percentiles()

Returns the percentile approximate of the group

stdev()

Returns the standard deviation across the group

sum()

Returns the sum of the elements withing the group

variance()

Returns the variance across the group


## Adding and removing columns

As you start working more with KQL, you will find that you either have more columns than you need from a table, or you need to add a new calculated column. Let’s look at a few of the key operators for column manipulation.

### Project and project-away

Project is roughly equivalent to many languages’ select statements. It allows you to choose which columns to keep. The order of the columns returned will match the order of the columns you list in your project statement, as shown in this example:

Perf
| project ObjectName, CounterValue , CounterName
As you can imagine, when you are working with very wide datasets, you may have lots of columns you want to keep, and specifying them all by name would require a lot of typing. For those cases, you have project-away, which lets you specify which columns to remove, rather than which ones to keep, like so:

Perf
| project-away MG, _ResourceId, Type
Tip

It can be useful to use project in two locations in your queries, both at the beginning as well as the end. Using project early in your query can provide you with performance improvements by stripping away large chunks of data you don’t need to pass down the pipeline. Using it at the end lets you strip away any columns that may have been created in previous steps and you do not need in your final output.

### Extend

Extend is used to create a new calculated column. This can be useful when you want to perform a calculation against existing columns and see the output for every row. Let’s look at a simple example where we calculate a new column called Kbytes, which we can calculate by multiplying the MB value by 1,024.

Usage
| where QuantityUnit == 'MBytes'
| extend KBytes = Quantity * 1024
| project ResourceUri, MBytes=Quantity, KBytes
On the final line in our project statement, we renamed the Quantity column to Mbytes, so we can easily tell which unit of measure is relevant to each column. It is worth noting that extend also works with previously calculated columns. For example, we can add one more column called Bytes that is calculated from Kbytes:

Usage
| where QuantityUnit == 'MBytes'
| extend KBytes = Quantity * 1024
| extend Bytes = KBytes * 1024
| project ResourceUri, MBytes=Quantity, KBytes, Bytes
Joining tables
Much of your work in Azure Sentinel can be carried out by using a single log type, but there are times when you will want to correlate data together or perform a lookup against another set of data. Like most query languages, KQL offers a few operators used to perform various types of joins. In this section, we will look at the most-used operators, union and join.

### Union

Union simply takes two or more tables and returns all the rows. For example:

OfficeActivity
| union SecurityEvent
This would return all rows from both the OfficeActivity and SecurityEvent tables. Union offers a few parameters that can be used to adjust how the union behaves. Two of the most useful are withsource and kind:

OfficeActivity
| union withsource = SourceTable kind = inner SecurityEvent
The parameter withsource lets you specify the name of a new column whose value will be the name of the source table from which the row came. In the example above, we named the column SourceTable, and depending on the row, the value will either be OfficeActivity or SecurityEvent.

The other parameter we specified was kind, which has two options: inner or outer. In the example we specified inner, which means the only columns that will be kept during the union are those that exist in both tables. Alternatively, if we had specified outer (which is the default value), then all columns from both tables would be returned.

### Join

Join works similarly to union, except instead of joining tables to make a new table, we are joining rows to make a new table. Like most database languages, there are multiple types of joins you can perform. The general syntax for a join is:

T1
| join kind = <join type>
(
               T2
) on $left.<T1Column> == $right.<T2Column>
After the join operator, we specify the kind of join we want to perform followed by an open parenthesis. Within the parentheses is where you specify the table you want to join as well as any other query statements you wish to add. After the closing parenthesis, we use the on keyword followed by our left ($left) and right ($right) columns separated with a ==. Here’s an example of an inner join:

OfficeActivity
| where TimeGenerated >= ago(1d)
    and LogonUserSid != ''
| join kind = inner (
    SecurityEvent
    | where TimeGenerated >= ago(1d)
        and SubjectUserSid != ''
) on $left.LogonUserSid == $right.SubjectUserSid
Note

If both tables have the same name for the columns on which you are performing a join, you don’t need to use $left and $right; instead, you can just specify the column name. Using $left and $right, however, is more explicit and generally considered to be a good practice.

For your reference, Table A-5 shows a list of available types of joins.

TABLE A-5 Types of Joins

Join Type

Description

inner

One row returned for each combination of matching rows.

innerunique

Inner join with left side deduplication. (Default)

leftouter/rightouter

For a leftouter join, this would return matched records from left table and all records from right, matching or not. Unmatched values will be null.

fullouter

Returns all records from both left and right tables, matching or not. Unmatched values will be null.

leftanti/rightanti

For a leftanti join, this would return records that did not have a match in the right table. Only columns from the left table will be returned.

leftsemi/rightsemi

For a leftanit join, this would return records that had a match in the right table. Only columns from the left table will be returned.

Tip

It is best practice to have your smallest table on the left. In some cases, following this rule will give you huge performance benefits, depending on the types of joins you are performing and the size of the tables.

## Evaluate

You may remember that in the first KQL example, I used the evaluate operator on one of the lines. The evaluate operator is less commonly used than the ones we have touched on previously. However, knowing how the evaluate operator works is well worth your time. Once more, here is that first query, where you will see evaluate on the second line.

SigninLogs
| evaluate bag_unpack(LocationDetails)
| where RiskLevelDuringSignIn == 'none'
   and TimeGenerated >= ago(7d)
| summarize Count = count() by city
| order by Count desc
| take 5
This operator allows you to invoke available plugins (essentially service-side functions). Many of these plugins are focused around data science, such as autocluster, diffpatterns, and sequence_detect. Some plugins, like R and python, allow you to run scripts in those languages within your queries.

The plugin used in the above example was called bag_unpack, and it makes it very easy to take a chunk of dynamic data and convert it to columns. Remember, dynamic data is a data type that looks very similar to JSON, as shown in this example:

{
"countryOrRegion":"US",
"geoCoordinates": {
"longitude":-122.12094116210936,
"latitude":47.68050003051758
},
"state":"Washington",
"city":"Redmond"
}
In this case, I wanted to summarize the data by city, but city is contained as a property within the LocationDetails column. To use the city property in my query, I had to first convert it to a column using bag_unpack.

## Let statements

Now that we have covered many of the major KQL operators and data types, let’s wrap up with the let statement, which is a great way to make your queries easier to read, edit, and maintain.

If you are familiar with programming languages and setting variables, let works much the same way. Let allows you to bind a name to an expression, which could be a single value or a whole query. Here is a simple example:

let daysAgo = ago(7d);
SigninLogs
| where TimeGenerated >= daysAgo
Here, we specified a name of daysAgo and set it to be equal to the output of a timespan function, which returns a datetime value. We then terminate the let statement with a semicolon to denote that we are finished setting our let statement. Now we have a new variable called daysAgo that can be used anywhere in our query.

As mentioned earlier, you can wrap a whole query into a let statement as well. Here’s a slight modification on our earlier example:

let daysAgo = ago(7d);
let getSignins = SigninLogs
| where TimeGenerated >= daysAgo;
getSignins
In this case, we created a second let statement, where we wrapped our whole query into a new variable called getSignins. Just like before, we terminate the second let statement with a semicolon and call the variable on the final line, which will run the query. Notice that we were able to use daysAgo in the second let statement. This was because we specified it on the previous line; if we were to swap the let statements so that getSignins came first, we would get an error.

Let statements are very easy to use, and they make it much easier to organize your queries. They truly come in handy when you are organizing more complex queries that may be doing multiple joins.

## Suggested learning resources

As you can probably tell, we only scratched the surface on KQL, but the goal here was simply to demystify the basics of the language. In order to keep building your expertise around KQL, we recommend taking an online course and reading through the formal documentation.

The following list of resources is, by no means, an exhaustive list. However, the information here will help you create your own custom Azure Sentinel notebooks.

https://aka.ms/KQLDocs [Official Documentation for KQL]

https://aka.ms/KQLFromScratch [Pluralsight Course: KQL From Scratch]

https://aka.ms/KQLCheatSheet [KQL Cheat Sheet made by Marcus Bakker]

## Next steps
