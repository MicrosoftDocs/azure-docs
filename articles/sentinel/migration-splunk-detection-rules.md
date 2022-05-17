---
title: Migrate Splunk detection rules to Microsoft Sentinel | Microsoft Docs
description: Learn how to identify, compare, and migrate your Splunk detection rules to Microsoft Sentinel built-in rules.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Migrate Splunk detection rules to Microsoft Sentinel

This article describes how to identify, compare, and migrate your Splunk detection rules to Microsoft Sentinel built-in rules.

## Identify rules

Mapping detection rules from your SIEM to map to Microsoft Sentinel rules is critical. 
- Understand Microsoft Sentinel rules. Azure Sentinel has four built-in rule types:
    - Alert grouping: Reduces alert fatigue by grouping up to 150 alerts within a given timeframe, using three [alert grouping](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-reduce-alert-noise-with-incident-settings-and-alert/ba-p/1187940) options: matching entities, alerts triggered by the scheduled rule, and matches of specific entities.
    - Entity mapping: Enables your SecOps engineers to define entities to be tracked during the investigation. [Entity mapping](map-data-fields-to-entities.md) also makes it possible for analysts to take advantage of the intuitive [investigation graph](tutorial-investigate-cases.md) to reduce time and effort.
    - Evidence summary: Surfaces events, alerts, and bookmarks associated with a particular incident within the preview pane. Entities and tactics also show up in the incident pane—providing a snapshot of essential details and enabling faster triage.
    - KQL: The request is sent to a Log Analytics database and is stated in plain text, using a data-flow model that makes the syntax easy to read, author, and automate. Because several other Microsoft services also store data in [Azure Log](../azure-monitor/logs/log-analytics-tutorial.md) Analytics or [Azure Data Explorer](https://azure.microsoft.com/en-us/services/data-explorer/), this reduces the learning curve needed to query or correlate.
- Check you understand rule terminology using the diagram below.
- Don’t migrate all rules without consideration. Focus on quality, not quantity.
- Leverage existing functionality, and check whether Microsoft Sentinel’s [built-in analytics rules](detect-threats-built-in.md) might address your current use cases. Because Microsoft Sentinel uses machine learning analytics to produce high-fidelity and actionable incidents, it’s likely that some of your existing detections won’t be required anymore.
- Confirm connected data sources and review your data connection methods. Revisit data collection conversations to ensure data depth and breadth across the use cases you plan to detect.
- Explore community resources such as [SOC Prime Threat Detection Marketplace](https://my.socprime.com/tdm/) to check whether  your rules are available.
- Consider whether an online query converter such as Uncoder.io conversion tool might work for your rules? 
- If rules aren’t available or can’t be converted, they need to be created manually, using a KQL query. Review the [Splunk to Kusto Query Language map](../data-explorer/kusto/query/splunk-cheat-sheet.md).

## Compare rule terminology

This diagram helps you to clarify the concept of a rule in Microsoft Sentinel compared to other SIEMs.

:::image type="content" source="media/migration-arcsight-detection-rules/compare-rule-terminology.png" alt-text="Diagram comparing Microsoft Sentinel rule terminology with other SIEMs." lightbox="media/migration-arcsight-detection-rules/compare-rule-terminology.png":::

## Migrate rules

Use these samples to migrate rules from Splunk to Microsoft Sentinel in various scenarios.

#### Common search commands


|SPL command  |Description  |SPL example  |KQL operator |KQL example  |
|---------|---------|---------|---------|---------|
|`chart/ timechart`	     |Returns results in a tabular output for time-series charting. |     |[render operator](https://docs.microsoft.com/azure/data-explorer/kusto/query/renderoperator?pivots=azuredataexplorer) |`… \| render timechart`   |
|`dedup`     |Removes subsequent results that match a specified criterion.	|         |• [distinct](https://docs.microsoft.com/azure/data-explorer/kusto/query/distinctoperator)<br>• [summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)     |`… \| summarize by Computer, EventID`          |
|`eval`   |Calculates an expression. Learn about [common eval commands](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/SPL%20to%20KQL.md#common-eval-commands).   |    |[extend](https://docs.microsoft.com/azure/data-explorer/kusto/query/extendoperator)    |`T \| extend duration = endTime - startTime`         |
|`fields`     |Removes fields from search results.	    |    |• [project](https://docs.microsoft.com/azure/data-explorer/kusto/query/projectoperator)<br>• [project-away](https://docs.microsoft.com/azure/data-explorer/kusto/query/projectawayoperator)   |`T \| project cost=price*quantity, price`   |
|`head/tail`     |Returns the first or last N results.	|    |[top](https://docs.microsoft.com/azure/data-explorer/kusto/query/topoperator)         |`T \| top 5 by Name desc nulls last`    |
|`lookup`     |Adds field values from an external source.	|     |• [externaldata](https://docs.microsoft.com/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuredataexplorer)<br>• [lookup](https://docs.microsoft.com/azure/data-explorer/kusto/query/lookupoperator)    |`Users`<br> `\| where UserID in ((externaldata (UserID:string) [`<br> `@"https://storageaccount.blob.core.windows.net/storagecontainer/users.txt"`<br> `h@"?...SAS..." // Secret token to access the blob`<br> `])) \| ...`          |
|`rename`     |Renames a field. Use wildcards to specify multiple fields.	         |    |[project-rename](https://docs.microsoft.com/azure/data-explorer/kusto/query/projectrenameoperator)         |`T \| project-rename new_column_name = column_name`      |
|`rex`     |Specifies group names using regular expressions to extract fields.	         |    |[matches regex](https://docs.microsoft.com/azure/data-explorer/kusto/query/re2)         |`… \| where field matches regex "^addr.*"`         |
|`search`     |Filters results to results that match the search expression.	       |    |[search](https://docs.microsoft.com/azure/data-explorer/kusto/query/searchoperator?pivots=azuredataexplorer)         |`search "X"`         |
|`sort`     |Sorts the search results by the specified fields.	         |    |[sort](sort)         |` T \| sort by strlen(country) asc, price desc`         |
|`stats`     |Provides statistics, optionally grouped by fields. Learn more about [common stats commands](https://github.com/Azure/Azure-Sentinel/blob/master/Tools/RuleMigration/SPL%20to%20KQL.md#common-stats-commands).         |         |[summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)         |`Sales`<br>`\| summarize NumTransactions=count(),`<br>`Total=sum(UnitPrice * NumUnits) by Fruit,`<br>`StartOfMonth=startofmonth(SellDateTime)` |
|`mstats`     |Similar to stats, used on metrics instead of events.	        |    |[summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)          |`T`<br>`\| summarize count() by price_range=bin(price, 10.0)` |
|`table`     |Specifies which fields to keep in the result set, and retains data in tabular format.	|    |[project](https://docs.microsoft.com/azure/data-explorer/kusto/query/projectoperator)         |`T \| project columnA, columnB`         |
|`top/rare`	     |Displays the most or least common values of a field.	         |    |[top](https://docs.microsoft.com/azure/data-explorer/kusto/query/topoperator)         |`T \| top 5 by Name desc nulls last` | 
|`transaction`     |Groups search results into transactions.         |[SPL example](#transaction-command-spl-example)         |Example: [row_window_session](https://docs.microsoft.com/azure/data-explorer/kusto/query/row-window-session-function)       |[KQL example](#transaction-command-kql-example) |
|`eventstats`     |Generates summary statistics from fields in your events and saves those statistics in a new field.	         |[SPL example](#eventstats-command-spl-example)         |Examples:<br>• [join](https://docs.microsoft.com/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [make_list](https://docs.microsoft.com/azure/data-explorer/kusto/query/makelist-aggfunction)<br>• [mv-expand](https://docs.microsoft.com/azure/data-explorer/kusto/query/mvexpandoperator)         |[KQL example](#eventstats-command-kql-example) |
|`streamstats`     |Find the cumulative sum of a field.	         |`... \| streamstats sum(bytes) as bytes _ total \| timechart`	         |[row_cumsum](https://docs.microsoft.com/azure/data-explorer/kusto/query/rowcumsumfunction)         |`...\| serialize cs=row_cumsum(bytes)` |
|`anomalydetection`     |Find anomalies in the specified field.	         |[SPL example](#anomalydetection-command-spl-example)         |[series_decompose_anomalies()](https://docs.microsoft.com/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction)         |[KQL example](#anomalydetection-command-kql-example) |
|`where`     |Filters search results using `eval` expressions. Used to compare two different fields.	         |    |[where](https://docs.microsoft.com/azure/data-explorer/kusto/query/whereoperator)         |`T \| where fruit=="apple"`         |

##### transaction command: SPL example

```bash
sourcetype=MyLogTable type=Event
| transaction ActivityId startswith="Start" endswith="Stop"
| Rename timestamp as StartTime
| Table City, ActivityId, StartTime, Duration
```
##### transaction command: KQL example

```kusto
let Events = MyLogTable | where type=="Event";
Events
| where Name == "Start"
| project Name, City, ActivityId, StartTime=timestamp
| join (Events
| where Name == "Stop"
| project StopTime=timestamp, ActivityId)
on ActivityId
| project City, ActivityId, StartTime, 
Duration = StopTime – StartTime
```

Use `row_window_session()` to the calculate session start values for a column in a serialized row set.

```kusto
...| extend SessionStarted = row_window_session(
Timestamp, 1h, 5m, ID != prev(ID))
```

##### eventstats command: SPL example

```bash
… | bin span=1m _time
|stats count AS count_i by _time, category
| eventstats sum(count_i) as count_total by _time	
```
##### eventstats command: KQL example

###### Example with join statement

```kusto
let binSize = 1h;
let detail = SecurityEvent 
| summarize detail_count = count() by EventID,
tbin = bin(TimeGenerated, binSize);
let summary = SecurityEvent
| summarize sum_count = count() by 
tbin = bin(TimeGenerated, binSize);
detail 
| join kind=leftouter (summary) on tbin 
| project-away tbin1
```
###### Example with make_list statement

```kusto
let binSize = 1m;
SecurityEvent
| where TimeGenerated >= ago(24h)
| summarize TotalEvents = count() by EventID, 
groupBin =bin(TimeGenerated, binSize)
|summarize make_list(EventID), make_list(TotalEvents), 
sum(TotalEvents) by groupBin
| mvexpand list_EventID, list_TotalEvents
```
#### anomalydetection command: SPL example

```bash
sourcetype=nasdaq earliest=-10y
| anomalydetection Close _ Price
```
##### anomalydetection command: KQL example

```kusto
let LookBackPeriod= 7d;
let disableAccountLogon=SignIn
| where ResultType == "50057"
| where ResultDescription has "account is disabled";
disableAccountLogon
| make-series Trend=count() default=0 on TimeGenerated 
in range(startofday(ago(LookBackPeriod)), now(), 1d)
| extend (RSquare,Slope,Variance,RVariance,Interception,
LineFit)=series_fit_line(Trend)
| extend (anomalies,score) = 
series_decompose_anomalies(Trend)
```
## Common eval commands

|SPL command  |Description  |SPL example  |KQL command  |KQL example |
|---------|---------|---------|---------|---------|
|`abs(X)`     |Returns the absolute value of X.         |`abs(number)`         |[abs()](https://docs.microsoft.com/azure/data-explorer/kusto/query/abs-function)         |`abs(X)` |
|`case(X,"Y",…)`     |Takes pairs of `X` and `Y` arguments, where the `X` arguments are boolean expressions. When evaluated to `TRUE`, the arguments return the corresponding `Y` argument.         |`case(error == 404, "Not found",`<br>`error == 500,"Internal Server Error",`<br>`error == 200, "OK")`         |[case](https://docs.microsoft.com/azure/data-explorer/kusto/query/casefunction)         |`T \| extend Message = case(error == 404, "Not found",`<br>`error == 500,"Internal Server Error", "OK")` |
|`ceil(X)`	     |Ceiling of a number X.         |`ceil(1.9)`         |ceiling()](https://docs.microsoft.com/azure/data-explorer/kusto/query/ceilingfunction)         |`ceiling(1.9)` |
|`cidrmatch("X",Y)`     |Identifies IP addresses that belong to a particular subnet.         |`cidrmatch("123.132.32.0/25",ip)`         |• [ipv4_is_match()](https://docs.microsoft.com/azure/data-explorer/kusto/query/ipv4-is-matchfunction)<br>• [ipv6_is_match()](https://docs.microsoft.com/azure/data-explorer/kusto/query/ipv6-is-matchfunction)         |`ipv4_is_match('192.168.1.1', '192.168.1.255')`<br>`== false` |
|`coalesce(X,…)`	     |Returns the first value that is not null.        |`coalesce(null(), "Returned val", null())`	         |[coalesce()](https://docs.microsoft.com/azure/data-explorer/kusto/query/coalescefunction)         |`coalesce(tolong("not a number"), tolong("42"), 33) == 42` |
|`exact(X)`	     |Evaluates an expression X using double precision floating point arithmetic.         |`exact(3.14*num)`         |[todecimal()](https://docs.microsoft.com/azure/data-explorer/kusto/query/todecimalfunction)         |`todecimal(3.14*2)` |
|`exp(X)`    |Returns eX.         |`exp(3)`         |[exp()](https://docs.microsoft.com/azure/data-explorer/kusto/query/exp-function)         |`exp(3)` |
|`if(X,Y,Z)`     |If `X` evaluates to `TRUE`, the result is the second argument `Y`. If `X` evaluates to `FALSE`, the result evaluates to the third argument `Z`.         |`if(error==200, "OK", "Error")`         |[iif()](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction)         |`iif(floor(Timestamp, 1d)==floor(now(), 1d),`<br>`"today", "anotherday")` |
|`isbool(X)`	     |Returns `TRUE` if `X` is boolean.	         |`isbool(field)`         |• [iif()](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction)<br>• gettype(https://docs.microsoft.com/azure/data-explorer/kusto/query/gettypefunction)    |`iif(gettype(X) =="bool","TRUE","FALSE")` |
|`isint(X)`     |Returns `TRUE` if `X` is an integer.	         |`isint(field)`         |• [iif()](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction)<br>• gettype(https://docs.microsoft.com/azure/data-explorer/kusto/query/gettypefunction)         |`iif(gettype(X) =="long","TRUE","FALSE")` |
|`isnull(X)`	     |Returns `TRUE` if `X` is null.	         |`isnull(field)`	 |[isnull()](https://docs.microsoft.com/azure/data-explorer/kusto/query/isnullfunction)         |`isnull(field)` |
|`isstr(X)`    |Returns `TRUE` if `X` is a string.	        |`isstr(field)`         |• [iif()](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction)<br>• gettype(https://docs.microsoft.com/azure/data-explorer/kusto/query/gettypefunction)    |`iif(gettype(X) =="bool","TRUE","FALSE")`         |`iif(gettype(X) =="string","TRUE","FALSE")` |
|`len(X)`	     |This function returns the character length of a string `X`.	         |`len(field)`	         |[strlen()](https://docs.microsoft.com/azure/data-explorer/kusto/query/strlenfunction)         |`strlen(field)`
|`like(X,"y")`     |Returns `TRUE` if and only if `X` is like the SQLite pattern in `Y`.       |`like(field, "addr%")`         |• [has](https://docs.microsoft.com/azure/data-explorer/kusto/query/has-anyoperator)<br>• [contains](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators)<br>• [startswith](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators)<br>• [matches regex](https://docs.microsoft.com/azure/data-explorer/kusto/query/re2)	 |`… | where field has "addr"`<br><br>`… | where field contains "addr"`<br><br>`… | where field startswith "addr"`<br><br>`… | where field matches regex "^addr.*"` |
|`log(X,Y)`     |Returns the log of the first argument `X` using the second argument `Y` as the base. The default value of `Y` is `10`.       |`log(number,2)`         |• [log](https://docs.microsoft.com/azure/data-explorer/kusto/query/log-function)<br>• [log2](https://docs.microsoft.com/azure/data-explorer/kusto/query/log2-function)<br>• [log10](https://docs.microsoft.com/azure/data-explorer/kusto/query/log10-function)         |`log(X)`<br><br>`log2(X)`<br><br>`log10(X)` |
|`lower(X)`	     |Returns the lowercase value of `X`.	         |`lower(username)`         |[tolower](https://docs.microsoft.com/azure/data-explorer/kusto/query/tolowerfunction)         |`tolower(username)` |
|`ltrim(X,Y)`     |Returns `X` with the characters in parameter `Y` trimmed from the left side. The default output of `Y` is spaces and tabs.	         |`ltrim(" ZZZabcZZ ", " Z")`	         |trim_start()[https://docs.microsoft.com/azure/data-explorer/kusto/query/trimstartfunction]         |`trim_start(“ ZZZabcZZ”,” ZZZ”)` |
|`match(X,Y)`	     |Returns if X matches the regex pattern Y.	         |`match(field, "^\d{1,3}.\d$")`         |[matches regex](https://docs.microsoft.com/azure/data-explorer/kusto/query/re2)         |`… \| where field matches regex @"^\d{1,3}.\d$")` |
|`max(X,…)`	    |Returns the maximum value in a column.	         |`max(delay, mydelay)`         |• [max()](https://docs.microsoft.com/azure/data-explorer/kusto/query/max-aggfunction)<br>• [arg_max()](https://docs.microsoft.com/azure/data-explorer/kusto/query/arg-max-aggfunction)         |`… | summarize max(field)` |
|`md5(X)`	     |Returns the MD5 hash of a string value `X`.	         |`md5(field)`         |[hash_md5](https://docs.microsoft.com/azure/data-explorer/kusto/query/md5hashfunction)         |`hash_md5("X")` |
|`min(X,…)`     |Returns the minimum value in a column.	         |`min(delay, mydelay)`	         |• [min_of()](https://docs.microsoft.com/azure/data-explorer/kusto/query/min-offunction)<br>• [min()](https://docs.microsoft.com/azure/data-explorer/kusto/query/min-aggfunction)<br>• [arg_min](https://docs.microsoft.com/azure/data-explorer/kusto/query/arg-min-%3Csub%3E**aggfunction) |`min_of (expr_1, expr_2 ...)`<br><br>`…\|summarize min(expr)`<br><br>`…\| summarize arg_min(Price,*) by Product` |
|`mvcount(X)`     |Returns the number (total) of `X` values.	  |`mvcount(multifield)`         |[dcount](https://docs.microsoft.com/azure/data-explorer/kusto/query/dcount-aggfunction)         |`…\| summarize dcount(X) by Y` |
|`mvfilter(X)`     |Filters a multi-valued field based on the boolean `X` expression.	         |`mvfilter(match(email, "net$"))`         |[mv-apply](https://docs.microsoft.com/azure/data-explorer/kusto/query/mv-applyoperator)         |`T \| mv-apply Metric to typeof(real) on`<br>`(`<br>` top 2 by Metric desc`<br>`)` |
|`mvindex(X,Y,Z)`     |Returns a subset of the multi-valued `X` argument from a start position (zero-based) `Y` to `Z` (optional).	         |`mvindex( multifield, 2)`	         |[array_slice](https://docs.microsoft.com/azure/data-explorer/kusto/query/arrayslicefunction)         |`array_slice(arr, 1, 2)` |
|`mvjoin(X,Y)`     |Given a multi-valued field `X` and string delimiter `Y`, and joins the individual values of `X` using `Y`.		         |`mvjoin(address, ";")`         |[strcat_array](https://docs.microsoft.com/azure/data-explorer/kusto/query/strcat-arrayfunction)         |`strcat_array(dynamic([1, 2, 3]), "->")` |
|`now()`     |Returns the current time, represented in Unix time.         |`now()`         |[now()](https://docs.microsoft.com/azure/data-explorer/kusto/query/nowfunction)         |`now()`<br><br>`now(-2d)` |
|`null()`     |Does not accept arguments and returns `NULL`.	         |`null()`         |[null](https://docs.microsoft.com/azure/data-explorer/kusto/query/scalar-data-types/null-values?pivots=azuredataexplorer)         |`null`
|`nullif(X,Y)`	     |Includes two arguments, `X` and `Y`, and returns `X` if the arguments are different. Otherwise, returns `NULL`. |`nullif(fieldA, fieldB)`         |[iif](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction)         |`iif(fieldA==fieldB, null, fieldA)` |
|`random()`     |Returns a pseudo-random number between `0` to `2147483647`.         |`random()`         |[rand()](https://docs.microsoft.com/azure/data-explorer/kusto/query/randfunction)         |`rand()` |
|`relative_ time(X,Y)`    |Given an epoch time time `X` and relative time specifier `Y`, returns the epoch time value of `Y` applied to `X`.	         |`relative_time(now(),"-1d@d")`	         |[unix time](https://docs.microsoft.com/azure/data-explorer/kusto/query/datetime-timespan-arithmetic#example-unix-time)         |`let toUnixTime = (dt:datetime)`<br>`{`<br>`(dt - datetime(1970-01-01))/1s`<br>`};` |
|`replace(X,Y,Z)` |Returns a string formed by substituting string `Z` for every occurrence of regular expression string `Y` in string `X`. |Returns date with the month and day numbers switched.<br>For example, for the `4/30/2015` input, the output is `30/4/2009`:<br><br>`replace(date, "^(\d{1,2})/ (\d{1,2})/", "\2/\1/")`	|[replace()](https://docs.microsoft.com/azure/data-explorer/kusto/query/replacefunction)	|`replace( @'^(\d{1,2})/(\d{1,2})/', @'\2/\1/',date)` |
|`round(X,Y)` |Returns `X` rounded to the amount of decimal places specified by `Y`. The default is to round to an integer. |`round(3.5)` |[round](https://docs.microsoft.com/azure/data-explorer/kusto/query/roundfunction) |`round(3.5)` |
`rtrim(X,Y)` |Returns `X` with the characters of `Y` trimmed from the right side. If `Y` is not specified, spaces and tabs are trimmed. |`rtrim(" ZZZZabcZZ ", " Z")` |[trim_end()](https://docs.microsoft.com/azure/data-explorer/kusto/query/trimendfunction) |`trim_end(@"[ Z]+",A)` |
|`searchmatch(X)` |Returns `TRUE` if the event matches the search string `X`. |`searchmatch("foo AND bar")` |[iif()](https://docs.microsoft.com/azure/data-explorer/kusto/query/iiffunction) |`iif(field has "X","Yes","No")` |	| `split(X,"Y")` |Returns `X` as a multi-valued field, split by delimiter `Y`. |`split(address, ";")` |[split()](https://docs.microsoft.com/azure/data-explorer/kusto/query/splitfunction) |`split(address, ";")` |
|`sqrt(X)` |Returns the square root of `X`. |`sqrt(9)` |[sqrt()](https://docs.microsoft.com/azure/data-explorer/kusto/query/sqrtfunction) |`sqrt(9)` |
|`strftime(X,Y)` |Returns the epoch time value `X` rendered using the format specified by `Y`. |`strftime(_time, "%H:%M")` |[format_datetime()](https://docs.microsoft.com/azure/data-explorer/kusto/query/format-datetimefunction) |`format_datetime(time,'HH:mm')` |
| `strptime(X,Y)` |Given a time represented by a string `X`, returns value parsed from format `Y`. |`strptime(timeStr, "%H:%M")` |[format_datetime()](https://docs.microsoft.com/azure/data-explorer/kusto/query/format-datetimefunction) |`format_datetime(datetime('2017-08-16 11:25:10'),`<br>`'HH:mm')` |
|`substr(X,Y,Z)` |Returns a substring field `X` from start position (1-based) `Y` for `Z` (optional) characters. |`substr("string", 1, 3)` |`substring()`(https://docs.microsoft.com/azure/data-explorer/kusto/query/substringfunction) |`substring("string", 0, 3)` |
|`time()` |Returns the wall-clock time with microsecond resolution.	 |`time()` |[format_datetime()](https://docs.microsoft.com/azure/data-explorer/kusto/query/format-datetimefunction) |`format_datetime(datetime(2015-12-14 02:03:04),`<br>`'h:m:s')` |
|`tonumber(X,Y)` |Converts input string `X` to a number, where `Y` (optional, default value is `10`) defines the base of the number to convert to. |`tonumber("0A4",16)` |[toint()](https://docs.microsoft.com/azure/data-explorer/kusto/query/tointfunction) |`toint("123")` |	
|`tostring(X,Y)` |Returns a field value of `X` as a string.<br>• If the value of `X` is a number, `X` is reformatted to a string value.<br>• If `X` is a boolean value, `X` is reformatted to `TRUE` or `FALSE`.<br>• If `X` is a number, the second argument `Y` is optional and can either be `hex` (converts `X` to a hexadecimal), `commas` (formats `X` with commas and two decimal places), or `duration` (converts `X` from a time format in seconds to a readable time format: `HH:MM:SS`). |This example returns:<br>`foo=615 and foo2=00:10:15:`<br>`… \| eval foo=615 \| eval foo2 = tostring(`<br>`1foo, "duration")` |[tostring()](https://docs.microsoft.com/azure/data-explorer/kusto/query/tostringfunction) |`tostring(123)` |
|`typeof(X)` |Returns a string representation of the field type. |`typeof(12)` |[gettype()](https://docs.microsoft.com/azure/data-explorer/kusto/query/gettypefunction) |`gettype(12)` |
|`urldecode(X)` |Returns the URL `X` decoded. |`urldecode("http%3A%2F%2Fwww.`<br>`splunk.com%2Fdownload%3Fr%3D`<br>`header")` |[url_decode](https://docs.microsoft.com/azure/data-explorer/kusto/query/urldecodefunction) |`url_decode('https%3a%2f%2fwww.bing.com%2f')` |

## Common stats commands

|SPL command  |Description  |KQL command  |KQL example  |
|---------|---------|---------|---------|
|`avg(X)` |Returns the average of the values of field `X`.  |[avg()](https://docs.microsoft.com/azure/data-explorer/kusto/query/avg-aggfunction)         |`avg(X)`         |
|`count(X)`     |Returns the number of occurrences of the field `X`. To indicate a specific field value to match, format `X` as `eval(field="value")`.         |[count()](https://docs.microsoft.com/azure/data-explorer/kusto/query/count-aggfunction)         |`summarize count()`         |
|`dc(X)`     |Returns the count of distinct values of the field `X`.	         |[dcount()](https://docs.microsoft.com/azure/data-explorer/kusto/query/dcount-aggfunction)         |`…\| summarize countries=dcount(country) by continent`         |
|`earliest(X)`     |Returns the chronologically earliest seen value of `X`.	         |[arg_min()](https://docs.microsoft.com/azure/data-explorer/kusto/query/arg-min-aggfunction)         |`… \| summarize arg_min(TimeGenerated, *) by X`         |
|`latest(X)`     |Returns the chronologically latest seen value of `X`.	        |[arg_max()](https://docs.microsoft.com/azure/data-explorer/kusto/query/arg-max-aggfunction)         |`… \| summarize arg_max(TimeGenerated, *) by X`         |
|`max(X)`     |Returns the maximum value of the field `X`. If the values of `X` are non-numeric, the maximum value is found via alphabetical ordering.	         |[max()](https://docs.microsoft.com/azure/data-explorer/kusto/query/max-aggfunction)         |`…\| summarize max(X)`         |
|`median(X)`     |Returns the middle-most value of the field `X`.	         |[percentile()](https://docs.microsoft.com/azure/data-explorer/kusto/query/percentiles-aggfunction)         |`…\| summarize percentile(X, 50)`         |
|`min(X)`     |Returns the minimum value of the field `X`. If the values of `X` are non-numeric, the minimum value is found via alphabetical ordering.	         |[min()](https://docs.microsoft.com/azure/data-explorer/kusto/query/min-aggfunction)         |`…\| summarize min(X)`         |
|`mode(X)`     |Returns the most frequent value of the field `X`.         |[top-hitters()](https://docs.microsoft.com/azure/data-explorer/kusto/query/tophittersoperator)         |`…\| top-hitters 1 of Y by X`         |
|`perc(Y)`     |Returns the percentile `X` value of the field `Y`. For example, `perc5(total)` returns the fifth percentile value of a field `total`.	         |[percentile()](https://docs.microsoft.com/azure/data-explorer/kusto/query/percentiles-aggfunction)         |`…\| summarize percentile(Y, 5)`         |
|`range(X)`     |Returns the difference between the maximum and minimum values of the field `X`.	         |[range()](https://docs.microsoft.com/azure/data-explorer/kusto/query/rangefunction)         |`range(1, 3)`         |
|`stdev(X)`     |Returns the sample standard deviation of the field `X`.	         |[stdev](https://docs.microsoft.com/azure/data-explorer/kusto/query/stdev-aggfunction)         |`stdev()`         |
|`stdevp(X)`     |Returns the population standard deviation of the field `X`.	         |[stdevp()](https://docs.microsoft.com/azure/data-explorer/kusto/query/stdevp-aggfunction)         |`stdevp()`         |
|`sum(X)`     |Returns the sum of the values of the field `X`.	         |[sum()](https://docs.microsoft.com/azure/data-explorer/kusto/query/sum-aggfunction)         |`sum(X)`         |
|`sumsq(X)`     |Returns the sum of the squares of the values of the field `X`.	         |         |         |
|`values(X)`     |Returns the list of all distinct values of the field `X` as a multi-value entry. The order of the values is alphabetical.	         |[make_set()](https://docs.microsoft.com/azure/data-explorer/kusto/query/makeset-aggfunction)         |`…\| summarize r = make_set(X)`         |
|`var(X)`     |Returns the sample variance of the field `X`.	         |[variance](https://docs.microsoft.com/azure/data-explorer/kusto/query/variance-aggfunction)         |`variance(X)`         |