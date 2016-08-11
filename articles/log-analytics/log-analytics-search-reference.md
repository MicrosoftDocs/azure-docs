<properties
	pageTitle="Log Analytics search reference | Microsoft Azure"
	description="The Log Analytics search reference describes the search language and provides the general query syntax options you can use when searching for data and filtering expressions to help narrow your search."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2016"
	ms.author="banders"/>


# Log Analytics search reference

The following reference section about search language describes the general query syntax options you can use when searching for data and filtering expressions to help narrow your search. It also describes commands that you can use to take action on the data retrieved.

You can read about the fields returned in searches and the facets that help you dill-into similar categories of data in the [Search field and facet reference section](#search-field-and-facet-reference).

## General query syntax

Syntax:

```
filterExpression | command1 | command2 …
```

The filter expression (`filterExpression`) defines the "where" condition for the query. The commands apply to the results returned by the query. Multiple commands must be separated by the pipe character ( | ).

### General syntax examples

Examples:

```
system
```

This query returns results that contain the word "system" in any field that has been indexed for full text or terms searching.

>[AZURE.NOTE] Not all fields are indexed this way, but the most common textual fields (such as descriptions and names) typically would be.

```
system error
```

This query returns results that contain the words *system* and *error*.

```
system error | sort ManagementGroupName, TimeGenerated desc | top 10
```

This query returns results that contain the words *system* and *error*. It then sorts the results by the *ManagementGroupName* field (in ascending order), and then by *TimeGenerated* (in descending order). It takes only the first 10 results.

>[AZURE.IMPORTANT] All the field names and the values for the string and text fields are case sensitive.

## Filter expression

The following subsections explain the filter expressions.

### String literals

A string literal is any string that is not recognized by the parser as a keyword or a predefined data type (for example, a number or date).

Examples:

```
These all are string literals
```

This query searches for results that contain occurrences of all five words. To perform a complex string search, enclose the string literal in quotation marks, for example:

```
" Windows Server"
```

This only returns results with exact matches for “Windows Server”.

### Numbers

The parser supports the decimal integer and floating-point number syntax for numerical fields.

Examples:

```
Type:Perf 0.5
```

```
HTTP 500
```

### Date/Time

Every piece of data in the system has a *TimeGenerated* property, which represents the original date and time of the record. Some types of data can additionally have more Date/Time fields (for example, *LastModified*).

The timeline Chart/Time selector in Log Analytics shows a distribution of results over time (according to the current query being run), based on the *TimeGenerated* field. Date/Time fields have a specific string format that can be used in queries to restrict the query to a particular timeframe. You can also use syntax to refer to relative time intervals (for example, "between 3 days ago and 2 hours ago").

Syntax:

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


Example:

```
TimeGenerated:2013-10-01T12:20
```

The previous command returns only records with a *TimeGenerated* value of exactly 12:20 on October 1, 2013. It is unlikely that it will provide any result, but you understand the idea.

The parser also supports the mnemonic Date/Time value, NOW.


Again, it is unlikely that this will yield any result because data doesn’t make it through the system that fast.

These examples are building blocks to use for relative and absolute dates. In the next three subsections, we’ll explain how to use them in more advanced filters with examples that use relative date ranges.

### Date/Time math

Use the Date/Time math operators to offset or round the Date/Time value by using simple Date/Time calculations.

Syntax:

```
datetime/unit
```

```
datetime[+|-]count unit
```

|Operator|Description|
|---|---|
|/|Rounds Date/Time to the specified unit. Example: NOW/DAY rounds the current Date/Time to the midnight of the current day.|
|+ or -|Offsets Date/Time by the specified number of units. Examples:NOW+1HOUR offsets the current Date/Time by one hour ahead.2013-10-01T12:00-10DAYS offsets the Date value back by 10 days.|



You can chain the Date/Time math operators together, for example:

```
NOW+1HOUR-10MONTHS/MINUTE
```

The following table lists the supported Date/Time units.

Date/Time unit|Description
---|---
YEAR, YEARS|Rounds to current year, or offsets by the specified number of years.
MONTH, MONTHS|Rounds to current month, or offsets by the specified number of months.
DAY, DAYS, DATE|Rounds to current day of the month, or offsets by the specified number of days.
HOUR, HOURS|Rounds to current hour, or offsets by the specified number of hours.
MINUTE, MINUTES|Rounds to current minute, or offsets by the specified number of minutes.
SECOND, SECONDS|Rounds to current second, or offsets by the specified number of seconds.
MILLISECOND, MILLISECONDS, MILLI, MILLIS|Rounds to current millisecond, or offsets by the specified number of milliseconds.


### Field facets

By using field facets, you can specify the search condition for specific fields and their exact values, as opposed to writing "free text" queries for various terms throughout the index. We have already used this syntax in several examples in the previous paragraphs. Here, we provide more complex examples.

**Syntax**

```
field:value
```

```
field=value
```

**Description**

Searches the field for the specific value. The value can be a string literal, number, or Date/Time.

Example:

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

Example:

```
TimeGenerated>NOW+2HOURS
```

**Syntax**

```
field:[from..to]
```

**Description**

Provides range faceting.

Example:

```
TimeGenerated:[NOW..NOW+1DAY]
```

```
SampleValue:[0..2]
```

### Logical operators

The query languages support the logical operators (*AND*, *OR*, and *NOT*) and their C-style aliases (*&&*, *||*, and *!*) respectively. You can use parentheses to group these operators.

Examples:

```
system OR error

```

```
Type:Alert AND NOT(Severity:1 OR ObjectId:"8066bbc0-9ec8-ca83-1edc-6f30d4779bcb8066bbc0-9ec8-ca83-1edc-6f30d4779bcb")
```

You can omit the logical operator for the top-level filter arguments. In this case, the AND operator is assumed.


Filter expression|Equivalent to
---|---
system error|system AND error
system "Windows Server" OR Severity:1|system AND ("Windows Server" OR Severity:1)

### Wildcarding

The query language supports using the (*\*) character to  represent one or more characters for a value in a query.

Examples:

 Find all computers with "SQL" in the name such as "Redmond-SQL".

```
Type=Event Computer=*SQL*
```

>[AZURE.NOTE] Wildcards cannot be used within quotations today. Message=`"*This text*"` will consider the (\*) used as a literal (\*) character.
## Commands

The commands apply to the results that are returned by the query. Use the pipe character ( | ) to apply a command to the retrieved results. Multiple commands must be separated by the pipe character.

>[AZURE.NOTE] Command names can be written in upper case or lower case, unlike the field names and the data.

### Sort

Syntax:

	sort field1 asc|desc, field2 asc|desc, …

Sorts the results by particular fields. The asc/desc prefix is optional. If they are omitted, the *asc* sort order is assumed. If a query does not use the *Sort* command explicitly, Sort **TimeGenerated** desc is the default behavior, and it will always return the most recent results first.

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

The *measure* command is used to apply statistical functions to the raw search results. This is very useful to get *group-by* views over the data. When you use the *measure* command, Log Analytics search displays a table with aggregated results.

Syntax:

	 measure aggregateFunction([aggregatedField]) [as fieldAlias] by groupField [interval interval]

	 measure aggregateFunction1([aggregatedField]) [as fieldAlias1] , aggregateFunction2([aggregatedField]) [as fieldAlias2] by groupField [interval interval]

	 measure aggregateFunction([aggregatedField])  interval interval

	 measure aggregateFunction1([aggregatedField]), aggregateFunction2([aggregatedField]), ...  interval interval


Aggregates the results by *groupField* and calculates the aggregated measure values by using *aggregatedField*.


|Measure statistical function|Description|
|---|---|
|*aggregateFunction*|The name of the aggregate function (case insensitive). The following aggregate functions are supported:COUNT MAX MIN SUM AVG STDDEV COUNTDISTINCT PERCENTILE## or PCT## (## is any number between 1 to 99)|
|*aggregatedField*|The field that is being aggregated. This field is optional for the COUNT aggregate function, but has to be an existing numeric field for SUM, MAX, MIN, AVG STDDEV, or PERCENTILE## or PCT## (## is any number between 1 to 99).|
|*fieldAlias*|The (optional) alias for the calculated aggregated value. If not specified, the field name will be AggregatedValue.|
|*groupField*|The name of the field that the result set is grouped by.|
|*Interval*|The time interval in the format:**nnnNAME** Where:nnn is the positive integer number. **NAME** is the interval name. Supported interval names include (case sensitive):MILLISECOND[S] SECOND[S] MINUTE[S] HOUR[S] DAY[S] MONTH[S] YEAR[S]|


The interval option can only be used in Date/Time group fields (such as *TimeGenerated* and *TimeCreated*). Currently, this is not enforced by the service, but a field without Date/Time that is passed to the backend will cause a runtime error. When the schema validation is implemented, the service API rejects queries that use fields without Date/Time for interval aggregation. The current *Measure* implementation supports interval grouping for any aggregate function.

If the BY clause is omitted but an interval is specified (as a second syntax), the *TimeGenerated* field is assumed by default.

Examples:

**Example 1**

	Type:Alert | measure count() as Count by ObjectId

*Explanation*

Groups the alerts by *ObjectID* and calculates the number of alerts for each group. The aggregated value is returned as the *Count* field (alias).

**Example 2**

	Type:Alert | measure count() interval 1HOUR

*Explanation*

Groups the alerts by 1-hour intervals by using the *TimeGenerated* field, and returns the number of alerts in each interval.

**Example 3**

	Type:Alert | measure count() as AlertsPerHour interval 1HOUR

*Explanation*

Same as the previous example, but with an aggregated field alias (*AlertsPerHour*).

**Example 4**

	* | measure count() by TimeCreated interval 5DAYS

*Explanation*

Groups the results by 5-day intervals by using the *TimeCreated* field, and returns the number of results in each interval.

**Example 5**

	Type:Alert | measure max(Severity) by WorkflowName

*Explanation*

Groups the alerts by workload name, and returns the maximum alert severity value for each workflow.

**Example 6**

	Type:Alert | measure min(Severity) by WorkflowName

*Explanation*

Same as the previous example, but with the *Min* aggregated function.

**Example 7**

	Type:Perf | measure avg(CounterValue) by Computer

*Explanation*

Groups Perf by Computer and calculates the average (avg).

**Example 8**

	Type:Perf | measure sum(CounterValue) by Computer

*Explanation*

Same as the previous example, but uses *Sum*.

**Example 9**

	Type:Perf | measure stddev(CounterValue) by Computer

*Explanation*

Same as the previous example, but uses *STDDEV*.

**Example 10**

	Type:Perf | measure percentile70(CounterValue) by Computer

*Explanation*

Same as the previous example, but uses *PERCENTILE70*.

**Example 11**

	Type:Perf | measure pct70(CounterValue) by Computer

*Explanation*

Same as the previous example, but uses *PCT70*. Note that *PCT##* is only an alias for *PERCENTILE##* function.

**Example 12**

	Type:Alert | measure count() as Count by WorkflowName | sort Count desc | top 5

*Explanation*

Gets the top five workflows with the maximum number of alerts.

**Example 13**

	* | measure countdistinct(Computer) by Type

*Explanation*

Counts the number of unique computers reporting for each Type.

**Example 14**

	* | measure countdistinct(Computer) Interval 1HOUR

*Explanation*

Counts the number of unique computers reporting for every hour.

**Example 15**

```
Type:Perf CounterName=”% Processor Time” InstanceName=”_Total” | measure avg(CounterValue) by Computer Interval 1HOUR
```

*Explanation*

Groups % Processor Time by Computer, and returns the average for every 1 hour.

**Example 16**

	Type:W3CIISLog | measure max(TimeTaken) by csMethod Interval 5MINUTES

*Explanation*

Groups W3CIISLog by method, and returns the maximum for every 5 minutes.

**Example 17**

```
Type:Perf CounterName=”% Processor Time” InstanceName=”_Total”  | measure min(CounterValue) as MIN, avg(CounterValue) as AVG, percentile75(CounterValue) as PCT75, max(CounterValue) as MAX by Computer Interval 1HOUR
```

*Explanation*

Groups % Processor Time by computer, and returns the minimum, average, 75 percentile, and maximum for every 1 hour.

### Where

Syntax:

```
**where** AggregatedValue>20
```

Can only be used after a *Measure* command to further filter the aggregated results that the *Measure* aggregation function has produced.

Examples:

	Type:Perf CounterName:"% Total Run Time" | Measure max(CounterValue) as MAXCPU by Computer

	Type:Perf CounterName:"% Total Run Time" | Measure max(CounterValue) by Computer | where (AggregatedValue>50 and AggregatedValue<90)

### IN

Syntax:

```
(Outer Query) (Field to use with inner query results) IN {Inner query | measure count() by (Field to send to outer query)} (rest  of outer query)  
```

Description:
This syntax allows you to create an aggregation and feed the list of values from that aggregation into another outer (primary) search that will look for events with those value. You do this by enclosing the inner search in braces and feeding its results as possible values for a field in the outer search using the IN operator.

Inner query Example: *computers currently missing security updates* with the following aggregation query:

```
Type:Update Classification="Security Updates"  UpdateState=needed TimeGenerated>NOW-25HOURS | measure count() by Computer
```    

The final query that finds *all Windows events for computers currently missing security updates* would resemble:

```
Type=Event Computer IN {Type:Update Classification="Security Updates"  UpdateState=needed TimeGenerated>NOW-25HOURS | measure count() by Computer}
```

### Dedup

**Syntax**

	Dedup FieldName

**Description**
Returns the first document found for every unique value of the given field.

**Example**

	Type=Event | sort TimeGenerated DESC | Dedup EventID

The above example returns one  event  (the latest since we use DESC on TimeGenerated) per EventID


### Extend

**Description**
Allows you to create run-time fields in queries

**Example 1**

	Type=SQLAssessmentRecommendation | Extend product(RecommendationScore, RecommendationWeight) AS RecommendationWeightedScore
Show weighted recommendation score for SQL Assessment recommendations

**Example 2**

	Type=Perf CounterName="Private Bytes" | EXTEND div(CounterValue,1024) AS KBs | Select CounterValue,Computer,KBs
Show counter value in KBs instead of Bytes

**Example 3**

	Type=WireData | EXTEND scale(TotalBytes,0,100) AS ScaledTotalBytes | Select ScaledTotalBytes,TotalBytes | SORT TotalBytes DESC
Scale the value of WireData TotalBytes such that all results lie between 0 and 100.

**Example 4**

```
Type=Perf CounterName="% Processor Time" | EXTEND if(map(CounterValue,0,50,0,1),"HIGH","LOW") as UTILIZATION
Tag Perf Counter Values less than 50% las LOW and others as HIGH
```

**Supported  Functions**


| Function | Description | Syntax Examples |
|---------|---------|---------|
| abs | Returns the absolute value of the specified value or function. | `abs(x)` <br> `abs(-5)` |
| and | Returns a value of true if and only if all of its operands evaluate to  true. | `and(not(exists(**popularity**)),exists(**price**))` |
| def | def is short for default. Returns the value of field "field", or if the field does not exist, returns the default value specified and yields the first value where: `exists()==true`. | `div(1,y)` <br> `div(sum(x,100),max(y,1))` |
| div | `div(x,y)` divides x by y. | `div(1,y),div(sum(x,100),max(y,1))` |
| dist | Returns the distance between two vectors, (points) in an n-dimensional space. Takes in the power, plus two or more, ValueSource instances and calculates the distances between the two vectors. Each ValueSource must be a number. There must be an even number of ValueSource instances passed in and the method assumes that the first half represent the first vector and the second half represent the second vector.  | `dist(2, x, y, 0, 0)` - Calculates the Euclidean distance between,(0,0) and (x,y) for each document. <br> `dist(1, x, y, 0, 0)` - Calculates the Manhattan (taxicab), distance between (0,0) and (x,y) for each document. <br> `dist(2,,x,y,z,0,0,0)` - Euclidean distance between (0,0,0) and (x,y,z) for each document.<br>`dist(1,x,y,z,e,f,g)` - Manhattan distance between (x,y,z) and (e,f,g), where each letter is a field name. |
| exists | Returns TRUE if any member of the field exists. | `exists(author)` - Returns TRUE for any document has a value in the "author" field.<br>`exists(query(price:5.00))` -  Returns TRUE if "price" matches,"5.00". |
| hsin | The Haversine distance calculates the distance between two points on a sphere when traveling along the sphere. The values must be in radians. hsin also takes a Boolean argument to specify whether the function should convert its output to radians. | `hsin(2, true, x, y, 0, 0)` |
| if | Enables conditional function queries. In `if(test,value1,value2)` - Test is or refers to a logical value or expression that returns a logical value (TRUE or FALSE).  `value1` is the value that is returned by the function if test yields TRUE. `value2` is the value that is returned by the function if test yields FALSE. An expression can be any function which outputs boolean values, or even functions returning numeric values, in which case value 0 will be interpreted as false, or strings, in which case empty string is interpreted as false. | `if(termfreq(cat,'electronics'),popularity,42)` - This function checks each document for the to see if it contains the term "electronics" in the cat field. If it does, then the value of the popularity field is returned, otherwise the value of 42 is returned. |
| linear | Implements `m*x+c` where m and c are constants and x is an arbitrary function. This is equivalent to `sum(product(m,x),c)`, but slightly more efficient as it is implemented as a single function. | `linear(x,m,c) linear(x,2,4)` returns `2*x+4` |
| log | Returns the log base 10 of the specified function. | `log(x)   log(sum(x,100))` |
| map | Maps any values of an input function x that fall within min and max inclusive to the specified target. The arguments min and max must be constants. The arguments target and default can be constants or functions. If the value of x does not fall between min and max, then either the value of x is returned, or a default value is returned if specified as a 5th argument. |  `map(x,min,max,target) map(x,0,0,1)` - Changes any values of 0 to 1. This can be useful in handling default 0 values.<br> `map(x,min,max,target,default)    map(x,0,100,1,-1)` - Changes any values between 0 and 100 to 1, and all other values to -1.<br>  `map(x,0,100,sum(x,599),docfreq(text,solr))` - Changes any values between 0 and 100 to x+599, and all other values to frequency of the term 'solr' in the field text. |
| max | Returns the maximum numeric value of multiple nested functions or constants, which are specified as arguments: `max(x,y,...)`. The max function can also be useful for "bottoming out" another function or field at some specified constant.  Use the `field(myfield,max)` syntax for selecting the maximum value of a single multivalued field.  | `max(myfield,myotherfield,0)` |
| min | Returns the minimum numeric value of multiple nested functions of constants, which are specified as arguments: `min(x,y,...)`. The min function can also be useful for providing an "upper bound" on a function using a constant. Use the `field(myfield,min)` syntax for selecting the minimum value of a single multivalued field. | `min(myfield,myotherfield,0)` |
| ms | Returns milliseconds of difference between its arguments. Dates are relative to the Unix or POSIX time epoch, midnight, January 1, 1970 UTC. Arguments may be the name of an indexed TrieDateField, or date math based on a constant date or NOW . `ms()` is equivalent to `ms(NOW)`, number of milliseconds since the epoch. `ms(a)` returns the number of milliseconds since the epoch that the argument represents. `ms(a,b)` returns the number of milliseconds that b occurs before a, which is `a - b`.| `ms(NOW/DAY)`<br>`ms(2000-01-01T00:00:00Z)`<br>`ms(mydatefield)`<br>`ms(NOW,mydatefield)`<br>`ms(mydatefield,2000-01-01T00:00:00Z)`<br>`ms(datefield1,datefield2)` |
| not | The logically negated value of the wrapped function. | `not(exists(author))` - TRUE only when `exists(author)` is false. |
| or | A logical disjunction. | `or(value1,value2)` - TRUE if either value1 or value2 is true. |
| pow | Raises the specified base to the specified power. `pow(x,y)` raises x to the power of y. |  `pow(x,y)`<br>`pow(x,log(y))`<br>`pow(x,0.5)` - The same as sqrt. |
| product | Returns the product of multiple values or functions, which are specified in a comma-separated list. `mul(...)` may also be used as an alias for this function. | `product(x,y,...)`<br>`product(x,2)`<br>`product(x,y)`<br>`mul(x,y)` |
| recip | Performs a reciprocal function with `recip(x,m,a,b)` implementing `a/(m*x+b)` where m,a,b are constants, and x is any arbitrarily complex function. When a and b are equal, and x>=0, this function has a maximum value of 1 that drops as x increases. Increasing the value of a and b together results in a movement of the entire function to a flatter part of the curve. These properties can make this an ideal function for boosting more recent documents when x is `rord(datefield)`. | `recip(myfield,m,a,b)`<br>`recip(rord(creationDate),1,1000,1000)` |
| scale | Scales values of the function x such that they fall between the specified minTarget and maxTarget inclusive. The current implementation traverses all of the function values to obtain the min and max, so it can pick the correct scale. The current implementation cannot distinguish when documents have been deleted or documents that have no value. It uses 0.0 values for these cases. This means that if values are normally all greater than 0.0, one can still end up with 0.0 as the min value to map from. In these cases, an appropriate `map()` function could be used as a workaround to change 0.0 to a value in the real range, as shown here: `scale(map(x,0,0,5),1,2)` | `scale(x,minTarget,maxTarget)`<br>`scale(x,1,2)` - Scales the values of x such that all values will be between 1 and 2 inclusive. |
| sqedist | The Square Euclidean distance calculates the 2-norm (Euclidean distance) but does not take the square root, thus saving a fairly expensive operation. It is often the case that applications that care about Euclidean distance do not need the actual distance, but instead can use the square of the distance. There must be an even number of ValueSource instances passed in and the method assumes that the first half represent the first vector and the second half represent the second vector. | `sqedist(x_td, y_td, 0, 0)` |
| sqrt | Returns the square root of the specified value or function. | `sqrt(x)`<br>`sqrt(100)`<br>`sqrt(sum(x,100))` |
| strdist | Calculate the distance between two strings. Uses the Lucene spell checker StringDistance interface and supports all of the implementations available in that package, plus allows applications to plug in their own via Solr's resource loading capabilities. strdist takes `(string1, string2, distance measure)`. Possible values for distance measure are: <br>jw: Jaro-Winkler<br>edit: Levenstein or Edit distance<br>ngram: The NGramDistance, if specified, can optionally pass in the ngram size too. Default is 2.<br>FQN: Fully Qualified class Name for an implementation of the StringDistance interface. Must have a no-arg constructor.|`strdist("SOLR",id,edit)` |
| sub | Returns x-y from `sub(x,y)`. | `sub(myfield,myfield2)`<br>`sub(100,sqrt(myfield))` |
| sum | Returns the sum of multiple values or functions, which are specified in a comma-separated list. `add(...)` may be used as an alias for this function. | `sum(x,y,...)`<br>`sum(x,1)`<br>`sum(x,y)`<br>`sum(sqrt(x),log(y),z,0.5)`<br>`add(x,y)`|
| xor | Other but not both. | `xor(field1,field2)` - Returns TRUE if either field1 or field2 is true; FALSE if both are true. |



## Search field and facet reference

When you use Log Search to find data, results display various field and facets. However, some of the information you’ll see might not appear very descriptive. You can use the following information to help you understand the results.



|Field|Search Type|Description|
|---|---|---|
|TenantId|All|Used to partition data|
|TimeGenerated|All|Used to drive the timeline, timeselectors (in search and in other screens). It represents when the piece of data was generated (typically on the agent). The time is expressed in ISO format and is always UTC. In the case of 'types' that are based on existing instrumentation (i.e. events in a log) this is typically the real time that the log entry/line/record was logged at; for some of the other types that are produced either via management packs or in the cloud - i.e. recommendations/alerts/updateagent/etc, this is the time when this new piece of data with a snapshot of a configuration of some sort was collected or a recommendation/alert was produced based on it.|
|EventID|Event|EventID in the Windows event log|
|EventLog|Event|Event Log where the event was logged by Windows|
|EventLevelName|Event|Critical / warning / information / success|
|EventLevel|Event|Numerical value for critical / warning / information / success (use EventLevelName instead for easier/more readable queries)|
|SourceSystem|All|Where the data comes from (in terms of 'attach' mode to the service - i.e. Operations Manager, OMS (=the data is generated in the cloud), Azure Storage (data coming from WAD) and so on|
|ObjectName|PerfHourly|Windows performance object name|
|InstanceName|PerfHourly|Windows performance counter instance name|
|CounteName|PerfHourly|Windows performance counter name|
|ObjectDisplayName|PerfHourly, ConfigurationAlert, ConfigurationObject, ConfigurationObjectProperty|Display name of the object targeted by a performance collection rule in Operations Manager, or that of the object discovered by Operational Insights, or against which the alert was generated|
|RootObjectName|PerfHourly, ConfigurationAlert, ConfigurationObject, ConfigurationObjectProperty|Display name of the parent of the parent (in a double hosting relationship: i.e. SqlDatabase hosted by SqlInstance hosted by Windows Computer) of the object targeted by a performance collection rule in Operations Manager, or that of the object discovered by Operational Insights, or against which the alert was generated|
|Computer|Most types|Computer name that the data belongs to|
|DeviceName|ProtectionStatus|Computer name the data belongs to (same as 'Computer')|
|DetectionId|ProtectionStatus| |
|ThreatStatusRank|ProtectionStatus|Threat status rank is a numerical representation of the threat status, and similar to HTTP response codes, we've left gaps between the numbers (which is why no threats is 150 and not 100 or 0) so that we've got some room to add new states. When we do a rollup for threat status and protection status, we want to show the worst state that the computer has been in during the selected time period. We use the numbers to rank the different states so we can look for the record with the highest number.|
|ThreatStatus|ProtectionStatus|Description of ThreatStatus, maps 1:1 with ThreatStatusRank|
|TypeofProtection|ProtectionStatus|Anti-malware product that is detected in the computer: none, Microsoft Malware Removal tool, Forefront, and so on|
|ScanDate|ProtectionStatus| |
|SourceHealthServiceId|ProtectionStatus, RequiredUpdate|HealthService ID for this computer's agent|
|HealthServiceId|Most types|HealthService ID for this computer's agent|
|ManagementGroupName|Most types|Management Group Name for Operations Manager-attached agents; otherwise it will be null/blank|
|ObjectType|ConfigurationObject|Type (as in Operations Manager management pack's 'type'/class) for this object discovered by Log Analytics configuration assessment|
|UpdateTitle|RequiredUpdate|Name of the update that was found not installed|
|PublishDate|RequiredUpdate|When was the update published on Microsoft update?|
|Server|RequiredUpdate|Computer name the data belongs to (same as 'Computer')|
|Product|RequiredUpdate|Product that the update applies to|
|UpdateClassification|RequiredUpdate|Type of update (update rollup, service pack, etc)|
|KBID|RequiredUpdate|KB article ID that describes this best practice or update|
|WorkflowName|ConfigurationAlert|Name of the rule or monitor that produced the alert|
|Severity|ConfigurationAlert|Severity of the alert|
|Priority|ConfigurationAlert|Priority of the alert|
|IsMonitorAlert|ConfigurationAlert|Is this alert generated by a monitor (true) or a rule (false)?|
|AlertParameters|ConfigurationAlert|XML with the parameters of the Log Analytics alert|
|Context|ConfigurationAlert|XML with the 'context' of the Log Analytics alert|
|Workload|ConfigurationAlert|Technology or 'workload' that the alert refers to|
|AdvisorWorkload|Recommendation|Technology or 'workload' that the recommendation refers to|
|Description|ConfigurationAlert|Alert description (short)|
|DaysSinceLastUpdate|UpdateAgent|How many days ago (relative to 'TimeGenerated' of this record) did this agent install any update from WSUS/Microsoft Update?|
|DaysSinceLastUpdateBucket|UpdateAgent|Based on DaysSinceLastUpdate, a categorization in 'time buckets' of how long ago was a computer last installed any update from WSUS/Microsoft Update|
|AutomaticUpdateEnabled|UpdateAgent|Is automatic update checking enabled or disabled on this agent?
|AutomaticUpdateValue|UpdateAgent|Is automatic update checking set to automatically download and install, only download, or only check?|
|WindowsUpdateAgentVersion|UpdateAgent|Version number of the Microsoft Update agent|
|WSUSServer|UpdateAgent|Which WSUS server is this update agent targeting?|
|OSVersion|UpdateAgent|Version of the operating system this update agent is running on|
|Name|Recommendation, ConfigurationObjectProperty|Name/title of the recommendation, or name of the property from Log Analytics Configuration Assessment|
|Value|ConfigurationObjectProperty|Value of a property from Log Analytics Configuration Assessment|
|KBLink|Recommendation|URL to the KB article that describes this best practice or update|
|RecommendationStatus|Recommendation|Recommendations are among the few types whose records get 'updated', not just added to the search index. This status changes whether the recommendation is active/open or if Log Analytics detects that it has been resolved.|
|RenderedDescription|Event|Rendered description (reused text with populated parameters) of a Windows event|
|ParameterXml|Event|XML with the parameters in the 'data' section of a Windows Event (as seen in event viewer)|
|EventData|Event|XML with the whole 'data' section of a Windows Event (as seen in event viewer)|
|Source|Event|Event log source that generated the event|
|EventCategory|Event|Category of the event , directly from the Windows event log|
|UserName|Event|User name of the Windows event (typically, NT AUTHORITY\LOCALSYSTEM)|
|SampleValue|PerfHourly|Average value for the hourly aggregation of a performance counter|
|Min|PerfHourly|Minimum value in the hourly interval of a performance counter hourly aggregate|
|Max|PerfHourly|Maximum value in the hourly interval of a performance counter hourly aggregate|
|Percentile95|PerfHourly|The 95th percentile value for the hourly interval of a performance counter hourly aggregate|
|SampleCount|PerfHourly|How many 'raw' performance counter samples were used to produce this hourly aggregate record|
|Threat|ProtectionStatus|Name of malware found|
|StorageAccount|W3CIISLog|Azure storage account the log was read from|
|AzureDeploymentID|W3CIISLog|Azure deployment ID of the cloud service the log belongs to|
|Role|W3CIISLog|Role of the Azure Cloud Service the log belongs to|
|RoleInstance|W3CIISLog|RoleInstance of the Azure Role that the log belongs to|
|sSiteName|W3CIISLog|IIS Website that the log belongs to (metabase notation); the s-sitename field in the original log|
|sComputerName|W3CIISLog|The s-computername field in the original log|
|sIP|W3CIISLog|Server IP address the HTTP request was addressed to. The s-ip field in the original log|
|csMethod|W3CIISLog|HTTP Method (GET/POST/etc) used by the client in the HTTP request. The cs-method in the original log|
|cIP|W3CIISLog|Client IP address the HTTP request came from. The c-ip field in the original log|
|csUserAgent|W3CIISLog|HTTP User-Agent declared by the client (browser or otherwise). The cs-user-agent in the original log|
|scStatus|W3CIISLog|HTTP Status code (200/403/500/etc) returned by the server to the client. The cs-status in the original log|
|TimeTaken|W3CIISLog|How long (in milliseconds) that the request took to complete. The timetaken field in the original log|
|csUriStem|W3CIISLog|Relative Uri (without host address, i.e. '/search' ) that was requested. The cs-uristem field in the original log|
|csUriQuery|W3CIISLog|URI query. URI queries are necessary only for dynamic pages, such as ASP pages, so this field usually contains a hyphen for static pages.|
|sPort|W3CIISLog|Server port that the HTTP request was sent to (and IIS listens to, since it picked it up)|
|csUserName|W3CIISLog|Authenticated user name, if the request is authenticated and not anonymous|
|csVersion|W3CIISLog|HTTP Protocol version used in the request (i.e. 'HTTP/1.1')|
|csCookie|W3CIISLog|Cookie information|
|csReferer|W3CIISLog|Site that the user last visited. This site provided a link to the current site.|
|csHost|W3CIISLog|Host header (i.e. 'www.mysite.com') that was requested|
|scSubStatus|W3CIISLog|Substatus error code|
|scWin32Status|W3CIISLog|Windows Status code|
|csBytes|W3CIISLog|Bytes sent in the request from the client to the server|
|scBytes|W3CIISLog|Bytes returned back in the response from the server to the client|
|ConfigChangeType|ConfigurationChange|Type of change (WindowsServices / Software / etc)|
|ChangeCategory|ConfigurationChange|Category of the change (Modified / Added / Removed)|
|SoftwareType|ConfigurationChange|Type of software (Update / Application)|
|SoftwareName|ConfigurationChange|Name of the software (only applicable to software changes)|
|Publisher|ConfigurationChange|Vendor who publishes the software (only applicable to software changes)|
|SvcChangeType|ConfigurationChange|Type of change that was applied on a Windows service (State / StartupType / Path / ServiceAccount) - only applicable to Windows service changes|
|SvcDisplayName|ConfigurationChange|Display name of the service that was changed|
|SvcName|ConfigurationChange|Name of the service that was changed|
|SvcState|ConfigurationChange|New (current) state of the service|
|SvcPreviousState|ConfigurationChange|Previous known state of the service (only applicable if service state changed)|
|SvcStartupType|ConfigurationChange|Service startup type|
|SvcPreviousStartupType|ConfigurationChange|Previous service startup type (only applicable if service startup type changed)|
|SvcAccount|ConfigurationChange|Service account|
|SvcPreviousAccount|ConfigurationChange|Previous service account (only applicable if service account changed)|
|SvcPath|ConfigurationChange|Path to the executable of the Windows service|
|SvcPreviousPath|ConfigurationChange|Previous path of the executable for the Windows service (only applicable if it changed)|
|SvcDescription|ConfigurationChange|Description of the service|
|Previous|ConfigurationChange|Previous state of this software (Installed / Not Installed / previous version)|
|Current|ConfigurationChange|Latest state of this software (Installed / Not Installed / current version)|

## Next Steps
For additional information about log searches:

- Get familiar with [log searches](log-analytics-log-searches.md) to view detailed information gathered by solutions.
- Use [Custom fields in Log Analytics](log-analytics-custom-fields.md) to extend log searches.
