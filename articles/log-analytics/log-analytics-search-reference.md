---
title: Azure Log Analytics search reference | Microsoft Docs
description: The Log Analytics search reference describes the search language and provides the general query syntax options you can use when searching for data and filtering expressions to help narrow your search.
services: log-analytics
documentationcenter: ''
author: bandersmsft
manager: carmonm
editor: ''
ms.assetid: 402615a2-bed0-4831-ba69-53be49059718
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/20/2017
ms.author: banders
ms.custom: H1Hack27Feb2017

---
# Log Analytics search reference
The following reference section about search language describes the general query syntax options you can use when searching for data and filtering expressions to help narrow your search. It also describes commands that you can use to take action on the data retrieved.

You can read about the fields returned in searches, and the facets that help you discover more about similar categories of data, in the [Search field and facet reference section](#search-field-and-facet-reference).

## General query syntax
The syntax for general querying is as follows:

```
filterExpression | command1 | command2 …
```

The filter expression (`filterExpression`) defines the "where" condition for the query. The commands apply to the results returned by the query. Multiple commands must be separated by the pipe character ( | ).

### General syntax examples
Examples:

```
system
```

This query returns results that contain the word *system* in any field that has been indexed for full text or terms searching.

> [!NOTE]
> Not all fields are indexed this way, but the most common textual fields (such as descriptions and names) usually are.
>
>

```
system error
```

This query returns results that contain the words *system* and *error*.

```
system error | sort ManagementGroupName, TimeGenerated desc | top 10
```

This query returns results that contain the words *system* and *error*. It then sorts the results by the *ManagementGroupName* field (in ascending order), and then by the *TimeGenerated* field (in descending order). It takes only the first 10 results.

> [!IMPORTANT]
> All the field names and the values for the string and text fields are case sensitive.
>
>

## Filter expressions
The following subsections explain the filter expressions.

### String literals
A string literal is any string that is not recognized by the parser as a keyword or a predefined data type (for example, a number or date).

Examples:

```
These all are string literals
```

This query searches for results that contain occurrences of all five words. To perform a complex string search, enclose the string literal in quotation marks. For example:

```
"Windows Server"
```

This only returns results with exact matches for *Windows Server*.

### Numbers
The parser supports the decimal integer and floating-point number syntax for numerical fields.

Examples:

```
Type:Perf 0.5
```

```
HTTP 500
```

### Dates and times
Every piece of data in the system has a *TimeGenerated* property, which represents the original date and time of the record. Some types of data can have additional date and time fields (for example, *LastModified*).

The timeline **Chart/Time** selector in Azure Log Analytics shows a distribution of results over time (according to the current query being run). This is based on the *TimeGenerated* field. Date and time fields have a specific string format that can be used in queries to restrict the query to a particular timeframe. You can also use syntax to refer to relative time intervals (for example, "between 3 days ago and 2 hours ago").

The following are valid forms of syntax for dates and times:

```
yyyy-mm-ddThh:mm:ss.dddZ
```

```
yyyy-mm-ddThh:mm:ss.ddd
```

```
yyyy-mm-ddThh:mm:ss
```

```
yyyy-mm-ddThh:mm:ss
```

```
yyyy-mm-ddThh:mm
```

```
yyyy-mm-dd
```


For example:

```
TimeGenerated:2013-10-01T12:20
```

The previous command returns only records with a *TimeGenerated* value of exactly 12:20 on October 1, 2013.

The parser also supports the mnemonic Date/Time value, NOW. (It is unlikely that this will yield any results, because data doesn’t make it through the system that fast.)

These examples are building blocks to use for relative and absolute dates. In the next three subsections, you'll see how to use them in more advanced filters, with examples that use relative date ranges.

### Date/Time math
Use the Date/Time math operators to offset or round the Date/Time value, by using simple Date/Time calculations.

Syntax:

```
datetime/unit
```

```
datetime[+|-]count unit
```

| Operator | Description |
| --- | --- |
| / |Rounds Date/Time to the specified unit. For example, NOW/DAY rounds the current Date/Time to midnight of the current day. |
| + or - |Offsets Date/Time by the specified number of units. For example, NOW+1HOUR offsets the current Date/Time by one hour ahead. 2013-10-01T12:00-10DAYS offsets the Date value back by 10 days. |

You can chain the Date/Time math operators together. For example:

```
NOW+1HOUR-10MONTHS/MINUTE
```

The following table lists the supported Date/Time units.

| Date/Time unit | Description |
| --- | --- |
| YEAR, YEARS |Rounds to current year, or offsets by the specified number of years. |
| MONTH, MONTHS |Rounds to current month, or offsets by the specified number of months. |
| DAY, DAYS, DATE |Rounds to current day of the month, or offsets by the specified number of days. |
| HOUR, HOURS |Rounds to current hour, or offsets by the specified number of hours. |
| MINUTE, MINUTES |Rounds to current minute, or offsets by the specified number of minutes. |
| SECOND, SECONDS |Rounds to current second, or offsets by the specified number of seconds. |
| MILLISECOND, MILLISECONDS, MILLI, MILLIS |Rounds to current millisecond, or offsets by the specified number of milliseconds. |

### Field facets
By using field facets, you can specify the search condition for specific fields and their exact values. This differs from writing "free text" queries for various terms throughout the index. You have already seen this technique in several previous examples. The following are more complex examples.

**Syntax**

```
field:value
```

```
field=value
```

**Description**

Searches the field for the specific value. The value can be a string literal, number, or date and time.

For example:

```
TimeGenerated:NOW
```

```
ObjectDisplayName:"server01.contoso.com"
```

```
SampleValue:0.3
```

**Syntax**

*field>value*

*field<value*

*field>=value*

*field<=value*

*field!=value*

**Description**

Provides comparisons.

For example:

```
TimeGenerated>NOW+2HOURS
```

**Syntax**

```
field:[from..to]
```

**Description**

Provides range faceting.

For example:

```
TimeGenerated:[NOW..NOW+1DAY]
```

```
SampleValue:[0..2]
```

### IN
The **IN** keyword allows you to select from a list of values. Depending on the syntax you use, this can be a simple list of values you provide, or a list of values from an aggregation.

Syntax 1:

```
field IN {value1,value2,value3,...}
```

This syntax allows you to include all values in a simple list.



Examples:

```
EventID IN {1201,1204,1210}
```

```
Computer IN {"srv01.contoso.com","srv02.contoso.com"}
```

Syntax 2:

```
(Outer query) (Field to use with inner query results) IN {Inner query | measure count() by (Field to send to outer query)} (rest  of outer query)  
```

This syntax allows you to create an aggregation. You can then feed the list of values from that aggregation into another outer (primary) search that looks for events with those value. You do this by enclosing the inner search in braces, and feeding its results as possible values for a field in the outer search by using the IN operator.

Inner query example: *computers currently missing security updates* with the following aggregation query:

```
Type:Update Classification="Security Updates"  UpdateState=needed TimeGenerated>NOW-25HOURS | measure count() by Computer
```    

The final query that finds *all Windows events for computers currently missing security updates* resembles the following:

```
Type=Event Computer IN {Type:Update Classification="Security Updates"  UpdateState=needed TimeGenerated>NOW-25HOURS | measure count() by Computer}
```

### Contains
The **Contains** keyword allows you to filter for records with a field that contains a specified string. This is case sensitive, works only with string fields, and may not include any escape characters.

Syntax:

```
field:contains("string")
```

Example:

```
Type:contains("Event")
```

This returns records with a type that contains the string "Event". Examples include **Event**, **SecurityEvent**, and **ServiceFabricOperationEvent**.



### Regular expressions
You can specify a search condition for a field with a regular expression, by using the **Regex** keyword. For a complete description of the syntax you can use in regular expressions, see [Using regular expressions to filter log searches in Log Analytics](log-analytics-log-searches-regex.md).

Syntax:

```
field:Regex("Regular Expression")
```

Example:

```
Computer:Regex("^C.*")
```

### Logical operators
The query languages support the logical operators (*AND*, *OR*, and *NOT*) and their C-style aliases (*&&*, *||*, and *!*, respectively). You can use parentheses to group these operators.

Examples:

```
system OR error

```

```
Type:Alert AND NOT(Severity:1 OR ObjectId:"8066bbc0-9ec8-ca83-1edc-6f30d4779bcb8066bbc0-9ec8-ca83-1edc-6f30d4779bcb")
```

You can omit the logical operator for the top-level filter arguments. In this case, the AND operator is assumed.

| Filter expression | Equivalent to |
| --- | --- |
| system error |system AND error |
| system "Windows Server" OR Severity:1 |system AND ("Windows Server" OR Severity:1) |

### Wildcarding
The query language supports using the ( \* ) character to  represent one or more characters for a value in a query.

Example:

 Find all computers with "SQL" in the name, such as "Redmond-SQL".

```
Type=Event Computer=*SQL*
```

> [!NOTE]
> At this time, wildcards cannot be used within quotations. For example, the message `"*This text*"` considers the (\*) used as a literal (\*) character.


## Commands


The commands apply to the results that are returned by the query. Use the pipe character ( | ) to apply a command to the retrieved results. Multiple commands must be separated by the pipe character.

> [!NOTE]
> Command names can be written in upper case or lower case, unlike the field names and the data.
>
>

### Sort
Syntax:

    sort field1 asc|desc, field2 asc|desc, …

Sorts the results by particular fields. The asc/desc suffix to sort the results in ascending or descending order is optional. If it is omitted, the *asc* sort order is assumed. For the **TimeGenerated** field, *desc* sort order is assumed, so it returns the most recent results first by default.

### Top/Limit
Syntax:

    top number


    limit number
Limits the response to the top N results.

Example:

    Type:Alert errors detected | top 10

Returns the top 10 matching results.

### Skip
Syntax:

    skip number

Skips the number of results listed.

Example:

    Type:Alert errors detected | top 10 | skip 200

Returns top 10 matching results starting at result 200.

### Select
Syntax:

    select field1, field2, ...

Limits results to the fields you choose.

Example:

    Type:Alert errors detected | select Name, Severity

Limits the returned results fields to *Name* and *Severity*.

### Measure
The *measure* command is used to apply statistical functions to the raw search results. This is very useful to get *group-by* views over the data. When you use the measure command, Log Analytics search displays a table with aggregated results.

**Syntax:**

    measure aggregateFunction1([aggregatedField]) [as fieldAlias1] [, aggregateFunction2([aggregatedField2]) [as fieldAlias2] [, ...]] by groupField1 [, groupField2 [, groupField3]]  [interval interval]


    measure aggregateFunction1([aggregatedField]) [as fieldAlias1] [, aggregateFunction2([aggregatedField2]) [as fieldAlias2] [, ...]]  interval interval



Aggregates the results by *groupField*, and calculates the aggregated measure values by using *aggregatedField*.

| Measure statistical function | Description |
| --- | --- |
| *aggregateFunction* |The name of the aggregate function (case insensitive). The following aggregate functions are supported: COUNT, MAX, MIN, SUM, AVG, STDDEV, COUNTDISTINCT, PERCENTILE##, or PCT## (## is any number between 1 and 99). |
| *aggregatedField* |The field that is being aggregated. This field is optional for the COUNT aggregate function, but has to be an existing numeric field for SUM, MAX, MIN, AVG, STDDEV, PERCENTILE##, or PCT## (## is any number between 1 and 99). The aggregatedField can also be any of the **Extend** supported functions. |
| *fieldAlias* |The (optional) alias for the calculated aggregated value. If not specified, the field name is **AggregatedValue**. |
| *groupField* |The name of the field that the result set is grouped by. |
| *Interval* |The time interval, in the format:**nnnNAME**. **nnn** is the positive integer number. **NAME** is the interval name. Supported interval names are case sensitive, and include:MILLISECOND[S], SECOND[S], MINUTE[S], HOUR[S], DAY[S], MONTH[S], and YEAR[S]. |

The interval option can only be used in Date/Time group fields (such as *TimeGenerated* and *TimeCreated*). Currently, this is not enforced by the service, but a field without Date/Time that is passed to the back end causes a runtime error. When the schema validation is implemented, the service API rejects queries that use fields without Date/Time for interval aggregation. The current *Measure* implementation supports interval grouping for any aggregate function.

If the BY clause is omitted, but an interval is specified (as a second syntax), the *TimeGenerated* field is assumed by default.

Examples:

**Example 1**

    Type:Alert | measure count() as Count by ObjectId

Groups the alerts by *ObjectID*, and calculates the number of alerts for each group. The aggregated value is returned as the *Count* field (alias).

**Example 2**

    Type:Alert | measure count() interval 1HOUR

Groups the alerts by 1-hour intervals by using the *TimeGenerated* field, and returns the number of alerts in each interval.

**Example 3**

    Type:Alert | measure count() as AlertsPerHour interval 1HOUR

Same as the previous example, but with an aggregated field alias (*AlertsPerHour*).

**Example 4**

    * | measure count() by TimeCreated interval 5DAYS

Groups the results by 5-day intervals by using the *TimeCreated* field, and returns the number of results in each interval.

**Example 5**

    Type:Alert | measure max(Severity) by WorkflowName

Groups the alerts by workload name, and returns the maximum alert severity value for each workflow.

**Example 6**

    Type:Alert | measure min(Severity) by WorkflowName

Same as the previous example, but with the *min* aggregated function.

**Example 7**

    Type:Perf | measure avg(CounterValue) by Computer

Groups Perf by computer, and calculates the average (avg).

**Example 8**

    Type:Perf | measure sum(CounterValue) by Computer

Same as the previous example, but uses *sum*.

**Example 9**

    Type:Perf | measure stddev(CounterValue) by Computer

Same as the previous example, but uses *stddev*.

**Example 10**

    Type:Perf | measure percentile70(CounterValue) by Computer

Same as the previous example, but uses *percentile70*.

**Example 11**

    Type:Perf | measure pct70(CounterValue) by Computer

Same as the previous example, but uses *pct70*. Note that *PCT##* is only an alias for *PERCENTILE##* function.

**Example 12**

    Type:Perf | measure avg(CounterValue) by Computer, CounterName

Groups Perf first by Computer and then CounterName, and calculates the average (avg).

**Example 13**

    Type:Alert | measure count() as Count by WorkflowName | sort Count desc | top 5

Gets the top five workflows with the maximum number of alerts.

**Example 14**

    * | measure countdistinct(Computer) by Type

Counts the number of unique computers reporting for each Type.

**Example 15**

    * | measure countdistinct(Computer) Interval 1HOUR

Counts the number of unique computers reporting for every hour.

**Example 16**

```
Type:Perf CounterName=”% Processor Time” InstanceName=”_Total” | measure avg(CounterValue) by Computer Interval 1HOUR
```

Groups % Processor Time by Computer, and returns the average for every hour.

**Example 17**

    Type:W3CIISLog | measure max(TimeTaken) by csMethod Interval 5MINUTES

Groups W3CIISLog by method, and returns the maximum for every 5 minutes.

**Example 18**

```
Type:Perf CounterName=”% Processor Time” InstanceName=”_Total”  | measure min(CounterValue) as MIN, avg(CounterValue) as AVG, percentile75(CounterValue) as PCT75, max(CounterValue) as MAX by Computer Interval 1HOUR
```

Groups % Processor Time by computer, and returns the minimum, average, 75th percentile, and maximum for every hour.

**Example 19**

```
Type:Perf CounterName=”% Processor Time”  | measure min(CounterValue) as MIN, avg(CounterValue) as AVG, percentile75(CounterValue) as PCT75, max(CounterValue) as MAX by Computer, InstanceName Interval 1HOUR
```

Groups % Processor Time first by computer and then by Instance name, and returns the minimum, average, 75th percentile, and maximum for every hour.

**Example 20**

```
Type= Perf CounterName="Disk Writes/sec" Computer="BaconDC01.BaconLand.com" | measure max(product(CounterValue,60)) as MaxDWPerMin by InstanceName Interval 1HOUR
```

Calculates the maximum of disk writes per minute for every disk on your computer.

### Where
Syntax:

```
**where** AggregatedValue>20
```

Can only be used after a *Measure* command to further filter the aggregated results that the *Measure* aggregation function has produced.

Examples:

    Type:Perf CounterName:"% Total Run Time" | Measure max(CounterValue) as MAXCPU by Computer

    Type:Perf CounterName:"% Total Run Time" | Measure max(CounterValue) by Computer | where (AggregatedValue>50 and AggregatedValue<90)



### Dedup
Syntax:

    Dedup FieldName

Returns the first document found for every unique value of the given field.

Example:

    Type=Event | Dedup EventID | sort TimeGenerated DESC

This example returns one event (the latest event) per EventID.

### Join
Joins the results of two queries to form a single result set.  Supports multiple join types described in the follow table.
  
| Join type | Description |
|:--|:--|
| inner | Return only records with a matching value in both queries. |
| outer | Return all records from both queries.  |
| left  | Return all records from left query and matching records from right query. |


- Joins do not currently support queries that include the **IN** keyword, the **Measure** command or the **Extend** command if it targets a field from the right query.
- You can currently include only a single field in a join.
- A single search may not include more than one join.

**Syntax**

```
<left-query> | JOIN <join-type> <left-query-field-name> (<right-query>) <right-query-field-name>
```

**Examples**

To illustrate the different join types, consider joining a data type collected from a custom log called MyBackup_CL with the heartbeat for each computer.  These datatypes have the following data.

`Type = MyBackup_CL`

| TimeGenerated | Computer | LastBackupStatus |
|:---|:---|:---|
| 4/20/2017 01:26:32.137 AM | srv01.contoso.com | Success |
| 4/20/2017 02:13:12.381 AM | srv02.contoso.com | Success |
| 4/20/2017 02:13:12.381 AM | srv03.contoso.com | Failure |

`Type = Hearbeat` (Only a subset of fields shown)

| TimeGenerated | Computer | ComputerIP |
|:---|:---|:---|
| 4/21/2017 12:01:34.482 PM | srv01.contoso.com | 10.10.100.1 |
| 4/21/2017 12:02:21.916 PM | srv02.contoso.com | 10.10.100.2 |
| 4/21/2017 12:01:47.373 PM | srv04.contoso.com | 10.10.100.4 |

#### inner join

`Type=MyBackup_CL | join inner Computer (Type=Heartbeat) Computer`

Returns the following records where the computer field matches for both datatypes.

| Computer| TimeGenerated | LastBackupStatus | TimeGenerated_joined | ComputerIP_joined | Type_joined |
|:---|:---|:---|:---|:---|:---|
| srv01.contoso.com | 4/20/2017 01:26:32.137 AM | Success | 4/21/2017 12:01:34.482 PM | 10.10.100.1 | Heartbeat |
| srv02.contoso.com | 4/20/2017 02:13:12.381 AM | Success | 4/21/2017 12:02:21.916 PM | 10.10.100.2 | Heartbeat |


#### outer join

`Type=MyBackup_CL | join outer Computer (Type=Heartbeat) Computer`

Returns the following records for both datatypes.

| Computer| TimeGenerated | LastBackupStatus | TimeGenerated_joined | ComputerIP_joined | Type_joined |
|:---|:---|:---|:---|:---|:---|
| srv01.contoso.com | 4/20/2017 01:26:32.137 AM | Success  | 4/21/2017 12:01:34.482 PM | 10.10.100.1 | Heartbeat |
| srv02.contoso.com | 4/20/2017 02:14:12.381 AM | Success  | 4/21/2017 12:02:21.916 PM | 10.10.100.2 | Heartbeat |
| srv03.contoso.com | 4/20/2017 01:33:35.974 AM | Failure  | 4/21/2017 12:01:47.373 PM | | |
| srv04.contoso.com |                           |          | 4/21/2017 12:01:47.373 PM | 10.10.100.2 | Heartbeat |



#### left join

`Type=MyBackup_CL | join left Computer (Type=Heartbeat) Computer`

Returns the following records from MyBackup_CL with any matching fields from Heartbeat.

| Computer| TimeGenerated | LastBackupStatus | TimeGenerated_joined | ComputerIP_joined | Type_joined |
|:---|:---|:---|:---|:---|:---|
| srv01.contoso.com | 4/20/2017 01:26:32.137 AM | Success | 4/21/2017 12:01:34.482 PM | 10.10.100.1 | Heartbeat |
| srv02.contoso.com | 4/20/2017 02:13:12.381 AM | Success | 4/21/2017 12:02:21.916 PM | 10.10.100.2 | Heartbeat |
| srv03.contoso.com | 4/20/2017 02:13:12.381 AM | Failure | | | |


### Extend
Allows you to create run-time fields in queries. You can also use the measure command after the extend command if you want to perform aggregation.

**Example 1**

    Type=SQLAssessmentRecommendation | Extend product(RecommendationScore, RecommendationWeight) AS RecommendationWeightedScore
Shows weighted recommendation score for SQL Assessment recommendations.

**Example 2**

    Type=Perf CounterName="Private Bytes" | EXTEND div(CounterValue,1024) AS KBs | Select CounterValue,Computer,KBs
Shows counter value in KBs instead of bytes.

**Example 3**

    Type=WireData | EXTEND scale(TotalBytes,0,100) AS ScaledTotalBytes | Select ScaledTotalBytes,TotalBytes | SORT TotalBytes DESC
Scales the value of WireData TotalBytes, such that all results are between 0 and 100.

**Example 4**

```
Type=Perf CounterName="% Processor Time" | EXTEND if(map(CounterValue,0,50,0,1),"HIGH","LOW") as UTILIZATION
```
Tags Perf Counter Values less than 50 percent as LOW, and others as HIGH.

**Example 5**

```
Type= Perf CounterName="Disk Writes/sec" Computer="BaconDC01.BaconLand.com" | Extend product(CounterValue,60) as DWPerMin| measure max(DWPerMin) by InstanceName Interval 1HOUR
```
Calculates the maximum of disk writes per minute for every disk on your computer.

**Supported functions**

| Function | Description | Syntax examples |
| --- | --- | --- |
| abs |Returns the absolute value of the specified value or function. |`abs(x)` <br> `abs(-5)` |
| acos |Returns arc cosine of a value or a function. |`acos(x)` |
| and |Returns a value of true if and only if all of its operands evaluate to true. |`and(not(exists(popularity)),exists(price))` |
| asin |Returns arc sine of a value or a function. |`asin(x)` |
| atan |Returns arc tangent of a value or a function. |`atan(x)` |
| atan2 |Returns the angle resulting from the conversion of the rectangular coordinates x,y to polar coordinates. |`atan2(x,y)` |
| cbrt |Cube root. |`cbrt(x)` |
| ceil |Rounds up to an integer. |`ceil(x)`  <br> `ceil(5.6)` Returns 6 |
| cos |Returns cosine of an angle. |`cos(x)` |
| cosh |Returns hyperbolic cosine of an angle. |`cosh(x)` |
| def |Abbreviation for default. Returns the value of field "field". If the field does not exist, returns the default value specified and yields the first value where: `exists()==true`. |`def(rating,5)`. This def() function returns the rating, or if no rating is specified in the document, returns 5. <br> `def(myfield, 1.0)` is equivalent to `if(exists(myfield),myfield,1.0)`. |
| deg |Converts radians to degrees. |`deg(x)` |
| div |`div(x,y)` divides x by y. |`div(1,y)` <br> `div(sum(x,100),max(y,1))` |
| dist |Returns the distance between two vectors, (points) in an n-dimensional space. Takes in the power, plus two or more, ValueSource instances, and calculates the distances between the two vectors. Each ValueSource must be a number. There must be an even number of ValueSource instances passed in, and the method assumes that the first half represent the first vector and the second half represent the second vector. |`dist(2, x, y, 0, 0)` Calculates the Euclidean distance between (0,0) and (x,y) for each document. <br> `dist(1, x, y, 0, 0)` Calculates the Manhattan (taxicab) distance between (0,0) and (x,y) for each document. <br> `dist(2,,x,y,z,0,0,0)` Euclidean distance between (0,0,0) and (x,y,z) for each document.<br>`dist(1,x,y,z,e,f,g)` Manhattan distance between (x,y,z) and (e,f,g), where each letter is a field name. |
| exists |Returns TRUE if any member of the field exists. |`exists(author)` Returns TRUE for any document that has a value in the "author" field.<br>`exists(query(price:5.00))` Returns TRUE if "price" matches,"5.00". |
| exp |Returns Euler's number raised to power x. |`exp(x)` |
| floor |Rounds down to an integer. |`floor(x)`  <br> `floor(5.6)` Returns 5 |
| hypo |Returns sqrt(sum(pow(x,2),pow(y,2))) without intermediate overflow or underflow. |`hypo(x,y)`  <br> ` |
| if |Enables conditional function queries. In `if(test,value1,value2)`, test is or refers to a logical value or expression that returns a logical value (TRUE or FALSE). `value1` is the value returned by the function if test yields TRUE. `value2` is the value returned by the function if test yields FALSE. An expression can be any function which outputs boolean values. It can also be a function returning numeric values, in which case value 0 is interpreted as false, or returning strings, in which case empty string is interpreted as false. |`if(termfreq(cat,'electronics'),popularity,42)` This function checks each document to see if it contains the term "electronics" in the cat field. If it does, then the value of the popularity field is returned. Otherwise, the value of 42 is returned. |
| linear |Implements `m*x+c`, where m and c are constants, and x is an arbitrary function. This is equivalent to `sum(product(m,x),c)`, but slightly more efficient as it is implemented as a single function. |`linear(x,m,c) linear(x,2,4)` returns `2*x+4` |
| ln |Returns the natural log of the specified function. |`ln(x)` |
| log |Returns the log base 10 of the specified function. |`log(x)   log(sum(x,100))` |
| map |Maps any values of an input function x that fall within min and max, inclusive to the specified target. The arguments min and max must be constants. The arguments target and default can be constants or functions. If the value of x does not fall between min and max, then either the value of x is returned, or a default value is returned if specified as a 5th argument. |`map(x,min,max,target) map(x,0,0,1)` Changes any values of 0 to 1. This can be useful in handling default 0 values.<br> `map(x,min,max,target,default)    map(x,0,100,1,-1)` Changes any values between 0 and 100 to 1, and all other values to -1.<br>  `map(x,0,100,sum(x,599),docfreq(text,solr))` Changes any values between 0 and 100 to x+599, and all other values to frequency of the term 'solr' in the field text. |
| max |Returns the maximum numeric value of multiple nested functions or constants, which are specified as arguments: `max(x,y,...)`. The max function can also be useful for "bottoming out" another function or field at some specified constant.  Use the `field(myfield,max)` syntax for selecting the maximum value of a single multivalued field. |`max(myfield,myotherfield,0)` |
| min |Returns the minimum numeric value of multiple nested functions of constants, which are specified as arguments: `min(x,y,...)`. The min function can also be useful for providing an "upper bound" on a function using a constant. Use the `field(myfield,min)` syntax for selecting the minimum value of a single multivalued field. |`min(myfield,myotherfield,0)` |
| mod |Computes the modulus of the function x by the function y. |`mod(1,x)` <br> `mod(sum(x,100), max(y,1))` |
| ms |Returns milliseconds of difference between its arguments. Dates are relative to the Unix or POSIX time epoch, midnight, January 1, 1970 UTC. Arguments may be the name of an indexed TrieDateField, or date math based on a constant date or NOW . `ms()` is equivalent to `ms(NOW)`, number of milliseconds since the epoch. `ms(a)` returns the number of milliseconds since the epoch that the argument represents. `ms(a,b)` returns the number of milliseconds that b occurs before a, which is `a - b`. |`ms(NOW/DAY)`<br>`ms(2000-01-01T00:00:00Z)`<br>`ms(mydatefield)`<br>`ms(NOW,mydatefield)`<br>`ms(mydatefield,2000-01-01T00:00:00Z)`<br>`ms(datefield1,datefield2)` |
| not |The logically negated value of the wrapped function. |`not(exists(author))` TRUE only when `exists(author)` is false. |
| or |A logical disjunction. |`or(value1,value2)` TRUE if either value1 or value2 is true. |
| pow |Raises the specified base to the specified power. `pow(x,y)` raises x to the power of y. |`pow(x,y)`<br>`pow(x,log(y))`<br>`pow(x,0.5)` The same as sqrt. |
| product |Returns the product of multiple values or functions, which are specified in a comma-separated list. `mul(...)` may also be used as an alias for this function. |`product(x,y,...)`<br>`product(x,2)`<br>`product(x,y)`<br>`mul(x,y)` |
| recip |Performs a reciprocal function with `recip(x,m,a,b)` implementing `a/(m*x+b)`, where m, a,and b are constants, and x is any arbitrarily complex function. When a and b are equal, and x>=0, this function has a maximum value of 1 that drops as x increases. Increasing the value of a and b together results in a movement of the entire function to a flatter part of the curve. These properties can make this an ideal function for boosting more recent documents when x is `rord(datefield)`. |`recip(myfield,m,a,b)`<br>`recip(rord(creationDate),1,1000,1000)` |
| rad |Converts degrees to radians. |`rad(x)` |
| rint |Rounds to the nearest integer. |`rint(x)`  <br> `rint(5.6)` Returns 6 |
| sin |Returns sine of an angle. |`sin(x)` |
| sinh |Returns hyperbolic sine of an angle. |`sinh(x)` |
| scale |Scales values of the function x, such that they fall between the specified minTarget and maxTarget inclusive. The current implementation traverses all of the function values to obtain the min and max, so it can pick the correct scale. The current implementation cannot distinguish when documents have been deleted, or documents that have no value. It uses 0.0 values for these cases. This means that if values are normally all greater than 0.0, one can still end up with 0.0 as the min value to map from. In these cases, an appropriate `map()` function could be used as a workaround to change 0.0 to a value in the real range, as shown here: `scale(map(x,0,0,5),1,2)` |`scale(x,minTarget,maxTarget)`<br>`scale(x,1,2)` Scales the values of x, such that all values are between 1 and 2 inclusive. |
| sqrt |Returns the square root of the specified value or function. |`sqrt(x)`<br>`sqrt(100)`<br>`sqrt(sum(x,100))` |
| strdist |Calculates the distance between two strings. Uses the Lucene spell checker StringDistance interface, and supports all of the implementations available in that package. Also allows applications to plug in their own, via Solr's resource loading capabilities. strdist takes `(string1, string2, distance measure)`. Possible values for distance measure are:<ul><li>jw: Jaro-Winkler</li><li>edit: Levenstein or Edit distance</li><li>ngram: The NGramDistance, if specified, can optionally pass in the ngram size too. Default is 2.</li><li>FQN: Fully Qualified class Name for an implementation of the StringDistance interface. Must have a no-arg constructor.</li></ul> |`strdist("SOLR",id,edit)` |
| sub |Returns x-y from `sub(x,y)`. |`sub(myfield,myfield2)`<br>`sub(100,sqrt(myfield))` |
| sum |Returns the sum of multiple values or functions, which are specified in a comma-separated list. `add(...)` may be used as an alias for this function. |`sum(x,y,...)`<br>`sum(x,1)`<br>`sum(x,y)`<br>`sum(sqrt(x),log(y),z,0.5)`<br>`add(x,y)` |
| termfreq |Returns the number of times the term appears in the field for that document. |termfreq(text,'memory') |
| tan |Returns tangent of an angle. |`tan(x)` |
| tanh |Returns hyperbolic tangent of an angle. |`tanh(x)` |

## Search field and facet reference
When you use Log Search to find data, results display various field and facets. Some of the information might not appear very descriptive. Use the following information to help you understand the results.

| Field | Search type | Description |
| --- | --- | --- |
| TenantId |All |Used to partition data. |
| TimeGenerated |All |Used to drive the timeline, timeselectors (in search and in other screens). It represents when the piece of data was generated (typically on the agent). The time is expressed in ISO format, and is always UTC. In the case of types that are based on existing instrumentation (that is, events in a log), this is typically the real time that the log entry/line/record was logged. For some of the other types that are produced either via management packs or in the cloud (for example, recommendations or alerts), the time represents something different. This is the time when this new piece of data with a snapshot of a configuration of some sort was collected, or a recommendation/alert was produced based on it. |
| EventID |Event |EventID in the Windows event log. |
| EventLog |Event |Event log where the event was logged by Windows. |
| EventLevelName |Event |Critical/warning/information/success |
| EventLevel |Event |Numerical value for critical/warning/information/success (use EventLevelName instead for easier/more readable queries). |
| SourceSystem |All |Where the data comes from (in terms of attach mode to the service). Examples include Microsoft System Center Operations Manager and Azure Storage. |
| ObjectName |PerfHourly |Windows performance object name. |
| InstanceName |PerfHourly |Windows performance counter instance name. |
| CounteName |PerfHourly |Windows performance counter name. |
| ObjectDisplayName |PerfHourly, ConfigurationAlert, ConfigurationObject, ConfigurationObjectProperty |Display name of the object targeted by a performance collection rule in Operations Manager. Could also be the display name of the object discovered by Operational Insights, or against which the alert was generated. |
| RootObjectName |PerfHourly, ConfigurationAlert, ConfigurationObject, ConfigurationObjectProperty |Display name of the parent of the parent (in a double hosting relationship) of the object targeted by a performance collection rule in Operations Manager. Could also be the display name of the object discovered by Operational Insights, or against which the alert was generated. |
| Computer |Most types |Computer name that the data belongs to. |
| DeviceName |ProtectionStatus |Computer name the data belongs to (same as "Computer"). |
| DetectionId |ProtectionStatus | |
| ThreatStatusRank |ProtectionStatus |Threat status rank is a numerical representation of the threat status. Similar to HTTP response codes, the ranking has gaps between the numbers (which is why no threats is 150 and not 100 or 0), leaving room to add new states. For a rollup of threat status and protection status, the intention is to show the worst state that the computer has been in during the selected time period. The numbers rank the different states, so you can look for the record with the highest number. |
| ThreatStatus |ProtectionStatus |Description of ThreatStatus, maps 1:1 with ThreatStatusRank. |
| TypeofProtection |ProtectionStatus |Antimalware product that is detected in the computer: none, Microsoft Malware Removal tool, Forefront, and so on. |
| ScanDate |ProtectionStatus | |
| SourceHealthServiceId |ProtectionStatus, RequiredUpdate |HealthService ID for this computer's agent. |
| HealthServiceId |Most types |HealthService ID for this computer's agent. |
| ManagementGroupName |Most types |Management Group Name for Operations Manager-attached agents. Otherwise, it is null/blank. |
| ObjectType |ConfigurationObject |Type (as in Operations Manager management pack's type/class) for this object, discovered by Log Analytics configuration assessment. |
| UpdateTitle |RequiredUpdate |Name of the update that was found not installed. |
| PublishDate |RequiredUpdate |When the update was published on Microsoft Update. |
| Server |RequiredUpdate |Computer name the data belongs to (same as "Computer"). |
| Product |RequiredUpdate |Product that the update applies to. |
| UpdateClassification |RequiredUpdate |Type of update (for example, update rollup or service pack). |
| KBID |RequiredUpdate |KB article ID that describes this best practice or update. |
| WorkflowName |ConfigurationAlert |Name of the rule or monitor that produced the alert. |
| Severity |ConfigurationAlert |Severity of the alert. |
| Priority |ConfigurationAlert |Priority of the alert. |
| IsMonitorAlert |ConfigurationAlert |Is this alert generated by a monitor (true) or a rule (false)? |
| AlertParameters |ConfigurationAlert |XML with the parameters of the Log Analytics alert. |
| Context |ConfigurationAlert |XML with the context of the Log Analytics alert. |
| Workload |ConfigurationAlert |Technology or workload that the alert refers to. |
| AdvisorWorkload |Recommendation |Technology or workload that the recommendation refers to. |
| Description |ConfigurationAlert |Alert description (short). |
| DaysSinceLastUpdate |UpdateAgent |How many days ago (relative to TimeGenerated of this record) did this agent install any update from Windows Server Update Service (WSUS) or Microsoft Update? |
| DaysSinceLastUpdateBucket |UpdateAgent |Based on DaysSinceLastUpdate, a categorization in time buckets of how long ago a computer last installed any update from WSUS/Microsoft Update. |
| AutomaticUpdateEnabled |UpdateAgent |Is automatic update checking enabled or disabled on this agent? |
| AutomaticUpdateValue |UpdateAgent |Is automatic update checking set to automatically download and install, only download, or only check? |
| WindowsUpdateAgentVersion |UpdateAgent |Version number of the Microsoft Update agent. |
| WSUSServer |UpdateAgent |Which WSUS server is this update agent targeting? |
| OSVersion |UpdateAgent |Version of the operating system this update agent is running on. |
| Name |Recommendation, ConfigurationObjectProperty |Name/title of the recommendation, or name of the property from Log Analytics configuration assessment. |
| Value |ConfigurationObjectProperty |Value of a property from Log Analytics configuration assessment. |
| KBLink |Recommendation |URL to the KB article that describes this best practice or update. |
| RecommendationStatus |Recommendation |Recommendations are among the few types whose records get updated, not just added to the search index. This status changes whether the recommendation is active/open, or if Log Analytics detects that it has been resolved. |
| RenderedDescription |Event |Rendered description (reused text with populated parameters) of a Windows event. |
| ParameterXml |Event |XML with the parameters in the data section of a Windows Event (as seen in event viewer). |
| EventData |Event |XML with the whole data section of a Windows Event (as seen in event viewer). |
| Source |Event |Event log source that generated the event. |
| EventCategory |Event |Category of the event, directly from the Windows event log. |
| UserName |Event |User name of the Windows event (typically, NT AUTHORITY\LOCALSYSTEM). |
| SampleValue |PerfHourly |Average value for the hourly aggregation of a performance counter. |
| Min |PerfHourly |Minimum value in the hourly interval of a performance counter hourly aggregate. |
| Max |PerfHourly |Maximum value in the hourly interval of a performance counter hourly aggregate. |
| Percentile95 |PerfHourly |The 95th percentile value for the hourly interval of a performance counter hourly aggregate. |
| SampleCount |PerfHourly |How many raw performance counter samples were used to produce this hourly aggregate record. |
| Threat |ProtectionStatus |Name of malware found. |
| StorageAccount |W3CIISLog |Azure Storage account the log was read from. |
| AzureDeploymentID |W3CIISLog |Azure deployment ID of the cloud service the log belongs to. |
| Role |W3CIISLog |Role of the Azure cloud service the log belongs to. |
| RoleInstance |W3CIISLog |RoleInstance of the Azure role that the log belongs to. |
| sSiteName |W3CIISLog |IIS website that the log belongs to (metabase notation); the s-sitename field in the original log. |
| sComputerName |W3CIISLog |The s-computername field in the original log. |
| sIP |W3CIISLog |Server IP address the HTTP request was addressed to. The s-ip field in the original log. |
| csMethod |W3CIISLog |HTTP method (for example, GET/POST) used by the client in the HTTP request. The cs-method in the original log. |
| cIP |W3CIISLog |Client IP address the HTTP request came from. The c-ip field in the original log. |
| csUserAgent |W3CIISLog |HTTP User-Agent declared by the client (browser or otherwise). The cs-user-agent in the original log. |
| scStatus |W3CIISLog |HTTP Status code (for example, 200/403/500) returned by the server to the client. The cs-status in the original log. |
| TimeTaken |W3CIISLog |How long (in milliseconds) that the request took to complete. The timetaken field in the original log. |
| csUriStem |W3CIISLog |Relative URI (without host address, that is, /search ) that was requested. The cs-uristem field in the original log. |
| csUriQuery |W3CIISLog |URI query. URI queries are necessary only for dynamic pages, such as ASP pages, so this field usually contains a hyphen for static pages. |
| sPort |W3CIISLog |Server port that the HTTP request was sent to (and that IIS listens to, since it picked it up). |
| csUserName |W3CIISLog |Authenticated user name, if the request is authenticated and not anonymous. |
| csVersion |W3CIISLog |HTTP Protocol version used in the request (for example, HTTP/1.1). |
| csCookie |W3CIISLog |Cookie information. |
| csReferer |W3CIISLog |Site that the user last visited. This site provided a link to the current site. |
| csHost |W3CIISLog |Host header (for example, www.mysite.com) that was requested. |
| scSubStatus |W3CIISLog |Substatus error code. |
| scWin32Status |W3CIISLog |Windows status code. |
| csBytes |W3CIISLog |Bytes sent in the request from the client to the server. |
| scBytes |W3CIISLog |Bytes returned back in the response from the server to the client. |
| ConfigChangeType |ConfigurationChange |Type of change (for example, WindowsServices/Software). |
| ChangeCategory |ConfigurationChange |Category of the change (Modified/Added/Removed). |
| SoftwareType |ConfigurationChange |Type of software (Update/Application). |
| SoftwareName |ConfigurationChange |Name of the software (only applicable to software changes). |
| Publisher |ConfigurationChange |Vendor who publishes the software (only applicable to software changes). |
| SvcChangeType |ConfigurationChange |Type of change that was applied on a Windows service (State/StartupType/Path/ServiceAccount). This is only applicable to Windows service changes. |
| SvcDisplayName |ConfigurationChange |Display name of the service that was changed. |
| SvcName |ConfigurationChange |Name of the service that was changed. |
| SvcState |ConfigurationChange |New (current) state of the service. |
| SvcPreviousState |ConfigurationChange |Previous known state of the service (only applicable if service state changed). |
| SvcStartupType |ConfigurationChange |Service startup type. |
| SvcPreviousStartupType |ConfigurationChange |Previous service startup type (only applicable if service startup type changed). |
| SvcAccount |ConfigurationChange |Service account. |
| SvcPreviousAccount |ConfigurationChange |Previous service account (only applicable if service account changed). |
| SvcPath |ConfigurationChange |Path to the executable of the Windows service. |
| SvcPreviousPath |ConfigurationChange |Previous path of the executable for the Windows service (only applicable if it changed). |
| SvcDescription |ConfigurationChange |Description of the service. |
| Previous |ConfigurationChange |Previous state of this software (Installed/Not Installed/previous version). |
| Current |ConfigurationChange |Latest state of this software (Installed/Not Installed/current version). |

## Next steps
For additional information about log searches:

* Get familiar with [log searches](log-analytics-log-searches.md) to view detailed information gathered by solutions.
* Use [custom fields in Log Analytics](log-analytics-custom-fields.md) to extend log searches.
