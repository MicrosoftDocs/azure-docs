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
|`mstats`     |Similar to stats, used on metrics instead of events.	        |    |[summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)          |         |`T`<br>`\| summarize count() by price_range=bin(price, 10.0)` |
|`table`     |Specifies which fields to keep in the result set, and retains data in tabular format.	|    |[project](https://docs.microsoft.com/azure/data-explorer/kusto/query/projectoperator)         |`T \| project columnA, columnB`         |
|`top/rare`	     |Displays the most or least common values of a field.	         |    |[top](https://docs.microsoft.com/azure/data-explorer/kusto/query/topoperator)         |         |`T \| top 5 by Name desc nulls last` | 
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
##### anomalydetection command: SPL example

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
