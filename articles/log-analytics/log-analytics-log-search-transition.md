---
title: Azure Log Analytics query language cheat sheet | Microsoft Docs
description: This article provides assistance on transitioning to the new query language for Log Analytics if you're already familiar with the legacy language.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/25/2017
ms.author: bwren

---

# Transitioning to Azure Log Analytics new query language

> [!NOTE]
> You can read more about the new Log Analytics query language and get the procedure to upgrade your workspace at Upgrade your [Azure Log Analytics workspace to new log search](log-analytics-log-search-upgrade.md).

This article provides assistance on transitioning to the new query language for Log Analytics if you're already familiar with the legacy language.

## Language converter

If you're familiar with the legacy Log Analytics query language, the easiest way to create the same query in the new language is to use the Language Converter that's installed in the Log Search portal when your workspace is converted.  Using the converter is as simple as typing in a legacy query in the top text box and then clicking **Convert**.  You can either click the search button to run the query or copy and paste it to use it somewhere else.

![Language converter](media/log-analytics-log-search-upgrade/language-converter.png)


## Cheat sheet

The following table provides a comparison between a variety of common queries to equivalent commands between the new and legacy query language in Azure Log Analytics. 

| Description | Legacy | new |
|:--|:--|:--|
| Select data from table | `Type=Event` |  `Event` |
|                        | `Type=Event | select Source, EventLog, EventID` | `Event | project Source, EventLog, EventID` |
|                        | `Type=Event | top 100` | `Event | take 100` |
| String comparison      | `Type=Event Computer=srv01.contoso.com`   | `Event | where Computer == "srv01.contoso.com"` |
|                        | `Type=Event Computer=contains("contoso")` | `Event | where Computer contains "contoso"` |
|                        | `Type=Event Computer=RegEx("@contoso@")`  | `Event | where Computer matches regex ".*contoso*"` |
| Date comparison        | `Type=Event TimeGenerated > NOW-1DAYS` | `Event | where TimeGenerated > ago(1d)` |
|                        | `Type=Event TimeGenerated>2017-05-01 TimeGenerated<2017-05-31` | `Event | where TimeGenerated between (datetime(2017-05-01) .. datetime(2017-05-31))` |
| Boolean comparison     | `Type=Heartbeat IsGatewayInstalled=false`  | `Heartbeat | where IsGatewayInstalled == false |
| Sort                   | `Type=Event | sort Computer asc, EventLog desc, EventLevelName asc` | `Event | sort by Computer asc, EventLog desc, EventLevelName asc` |
| Distinct               | `Type=Event | dedup Computer | select Computer` | `Event | summarize by Computer, EventLog` |
| Extend columns         | `Type=Perf CounterName="% Processor Time" | EXTEND if(map(CounterValue,0,50,0,1),"HIGH","LOW") as UTILIZATION` | `Perf | where CounterName == "% Processor Time" | extend Utilization = iff(CounterValue > 50, "HIGH", "LOW")` |
| Aggregation            | `Type=Event | measure count() as Count by Computer` | `Event | summarize Count = count() by Computer` |
|                                | `Type=Perf ObjectName=Processor CounterName="% Processor Time" | measure avg(CounterValue) by Computer interval 5minute` | `Perf | where ObjectName=="Processor" and CounterName=="% Processor Time" | summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5min)` |
| Aggregation with limit | `Type=Event | measure count() by Computer | top 10` | `Event | summarize AggregatedValue = count() by Computer | limit 10` |
| Union                  | `Type=Event or Type=Syslog` | `union Event, Syslog` |
| Join                   | `Type=NetworkMonitoring | join inner AgentIP (Type=Heartbeat) ComputerIP` | `NetworkMonitoring | join kind=inner (search Type == "Heartbeat") on $left.AgentIP == $right.ComputerIP` |



## Next steps
- Check out a [tutorial on writing queries](https://docs.loganalytics.io/learn/tutorial_getting_started_with_queries.html) using the new query language.
- Refer to the [Query Language Reference](https://docs.loganalytics.io/queryLanguage/query_language.html) for details on all command, operators, and functions for the new query language.  
