---
title: Migrate QRadar detection rules to Microsoft Sentinel | Microsoft Docs
description: Identify, compare, and migrate your QRadar detection rules to Microsoft Sentinel built-in rules.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Migrate QRadar detection rules to Microsoft Sentinel

This article describes how to identify, compare, and migrate your QRadar detection rules to Microsoft Sentinel built-in rules.

## Identify rules

Mapping detection rules from your SIEM to map to Microsoft Sentinel rules is critical. 
- Understand Microsoft Sentinel rules. Azure Sentinel has four built-in rule types:
    - Alert grouping: Reduces alert fatigue by grouping up to 150 alerts within a given timeframe, using three [alert grouping](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-reduce-alert-noise-with-incident-settings-and-alert/ba-p/1187940) options: matching entities, alerts triggered by the scheduled rule, and matches of specific entities.
    - Entity mapping: Enables your SecOps engineers to define entities to be tracked during the investigation. [Entity mapping](map-data-fields-to-entities.md) also makes it possible for analysts to take advantage of the intuitive [investigation graph](tutorial-investigate-cases.md) to reduce time and effort.
    - Evidence summary: Surfaces events, alerts, and bookmarks associated with a particular incident within the preview pane. Entities and tactics also show up in the incident pane—providing a snapshot of essential details and enabling faster triage.
    - KQL: The request is sent to a Log Analytics database and is stated in plain text, using a data-flow model that makes the syntax easy to read, author, and automate. Because several other Microsoft services also store data in [Azure Log](../azure-monitor/logs/log-analytics-tutorial.md) Analytics or [Azure Data Explorer](https://azure.microsoft.com/services/data-explorer/), this reduces the learning curve needed to query or correlate.
- Check you understand rule terminology using the diagram below.
- Don’t migrate all rules without consideration. Focus on quality, not quantity.
- Leverage existing functionality, and check whether Microsoft Sentinel’s [built-in analytics rules](detect-threats-built-in.md) might address your current use cases. Because Microsoft Sentinel uses machine learning analytics to produce high-fidelity and actionable incidents, it’s likely that some of your existing detections won’t be required anymore.
- Confirm connected data sources and review your data connection methods. Revisit data collection conversations to ensure data depth and breadth across the use cases you plan to detect.
- Explore community resources such as [SOC Prime Threat Detection Marketplace](https://my.socprime.com/tdm/) to check whether  your rules are available.
- Consider whether an online query converter such as Uncoder.io conversion tool might work for your rules? 
- If rules aren’t available or can’t be converted, they need to be created manually, using a KQL query. Review the [Splunk to Kusto Query Language map](https://docs.microsoft.com/azure/data-explorer/kusto/query/splunk-cheat-sheet).

## Compare rule terminology

This diagram helps you to clarify the concept of a rule in Microsoft Sentinel compared to other SIEMs.

:::image type="content" source="media/migration-arcsight-detection-rules/compare-rule-terminology.png" alt-text="Diagram comparing Microsoft Sentinel rule terminology with other SIEMs." lightbox="media/migration-arcsight-detection-rules/compare-rule-terminology.png":::

## Migrate rules

Use these samples to migrate rules from QRadar to Microsoft Sentinel in various scenarios.

|Rule  |Syntax |Sample detection rule (QRadar)  |Sample KQL query  |Resources  |
|---------|---------|---------|---------|---------|
|Common property tests     |[QRadar syntax](#common-property-tests) |• [Regular expression example](#regular-expression-example)<br>• [AQL filter query example](#aql-filter-query-example)<br>• [equals/not equals example](#equalsnot-equals-example)      |• [Regular expression example](#regular-expression-sample-kql-query)<br>• [AQL filter query example](#aql-filter-query-sample-kql-query)<br>• [equals/not equals example](#equalsnot-equals-sample-kql-query)       |• Regular expression: [matches regex](https://docs.microsoft.com/azure/data-explorer/kusto/query/re2)<br>• AQL filter query: [string operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• equals/not equals: [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)   | 
|Date/time tests     |[QRadar syntax](#datetime-tests) |• [Selected day of the month example](#selected-day-of-the-month-example)<br>• [Selected day of the week example](#selected-day-of-the-week-example)<br>• [after/before/at example](#afterbeforeat-example)      |• [Selected day of the month example](#selected-day-of-the-month-sample-kql-query)<br>• [Selected day of the week example](#selected-day-of-the-week-sample-kql-query))<br>• [after/before/at example](#aql-filter-query-example)   |• [Date and time operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/samples?pivots=azuremonitor#date-and-time-operations)<br>• Selected day of the month: [dayofmonth()](https://docs.microsoft.com/azure/data-explorer/kusto/query/dayofmonthfunction)<br>• Selected day of the week: [dayofweek()](https://docs.microsoft.com/azure/data-explorer/kusto/query/dayofweekfunction)<br>• after/before/at: [format_datetime()](https://docs.microsoft.com/azure/data-explorer/kusto/query/format-datetimefunction)   | 
|Event property tests     |[QRadar syntax](#event-property-tests) |• [IP protocol example](#ip-protocol-example)<br>• [Event Payload string example](#event-payload-string-example)<br>     |• [IP protocol example](#ip-protocol-sample-kql-query)<br>• [Event Payload string example](#event-payload-string-sample-kql-query)<br>   |• IP protocol: [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• Event Payload string: [has](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators)   | 
|Functions: counters    |[QRadar syntax](#functions-counters) |[Event property and time example](#event-property-and-time-example)    |[Event property and time example](#event-property-and-time-sample-kql-query)   |[summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)   | 
|Functions: negative conditions |[QRadar syntax](#functions-negative) |[Negative conditions example](#negative-conditions-example) |[Negative conditions example](#negative-conditions-sample-kql-query) |• [join()](https://docs.microsoft.com/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• [Numerical operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/numoperators)] |
|Functions: simple |[QRadar syntax](#functions-simple) |[Simple conditions example](#simple-conditions-example) |[Simple conditions example](#simple-conditions-example) |[or](https://docs.microsoft.com/azure/data-explorer/kusto/query/logicaloperators) |
|IP/port tests |[QRadar syntax](#ipport-tests) |• [Source port example](#source-port-example)<br>• [Source IP example](#source-ip-example) |• [Source port example](#source-port-sample-kql-query)<br>• [Source IP example](#source-ip-sample-kql-query) | |
|Log source tests |[QRadar syntax](#log-source-tests) |[Log source example](#log-source-example) |[Log source example](#log-source-sample-kql-query) | |

#### Common property tests

Here is the QRadar syntax for a common property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-syntax.png" alt-text="Diagram illustrating a common property test rule syntax." lightbox="media/migration-qradar-detection-rules/rule-1-syntax.png":::

##### Regular expression example

Here is the syntax for a sample QRadar common property tests rule that uses a regular expression: 

```bash
when any of <these properties> match <this regular expression>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a common property test rule that uses a regular expression." lightbox="media/migration-qradar-detection-rules/rule-1-sample.png":::

###### Regular expression: Sample KQL query

Here is the common property tests rule with a regular expression in KQL.  

```kusto
CommonSecurityLog
| where tostring(SourcePort) matches regex @"\d{1,5}" or tostring(DestinationPort) matches regex @"\d{1,5}"
```
##### AQL filter query example

Here is the syntax for a sample QRadar common property tests rule that uses an AQL filter query. 

```bash
when the event matches <this> AQL filter query
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-aql.png" alt-text="Diagram illustrating a common property test rule that uses an AQL filter query." lightbox="media/migration-qradar-detection-rules/rule-1-sample-aql.png":::

###### AQL filter query: Sample KQL query

Here is the common property tests rule with an AQL filter query in KQL.

```kusto
CommonSecurityLog
| where SourceIP == '10.1.1.10'
```
##### equals/not equals example

Here is the syntax for a sample QRadar common property tests rule that uses the `equals` or `not equals` operator. 

```bash
and when <this property> <equals/not equals> <this property>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-equals.png" alt-text="Diagram illustrating a common property test rule that uses equals/not equals." lightbox="media/migration-qradar-detection-rules/rule-1-sample-equals.png":::

###### equals/not equals: Sample KQL query

Here is the common property tests rule with the `equals` or `not equals` operator in KQL.

```kusto
CommonSecurityLog
| where SourceIP == DestinationIP
```
#### Date/time tests

Here is the QRadar syntax for a date/time tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-syntax.png" alt-text="Diagram illustrating a date/time tests rule syntax." lightbox="media/migration-qradar-detection-rules/rule-2-syntax.png":::

##### Selected day of the month example

Here is the syntax for a sample QRadar date/time tests rule that uses a selected day of the month. 

```bash
and when the event(s) occur <on/after/before> the <selected> day of the month
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day." lightbox="media/migration-qradar-detection-rules/rule-2-sample-selected-day.png":::

###### Selected day of the month: Sample KQL query

Here is the date/time tests rule with a selected day of the month in KQL.  

```kusto
SecurityEvent
 | where dayofmonth(TimeGenerated) < 4
```
##### Selected day of the week example

Here is the syntax for a sample QRadar date/time tests rule that uses a selected day of the week: 

```bash
and when the event(s) occur on any of <these days of the week{Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day-week.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day of the week." lightbox="media/migration-qradar-detection-rules/rule-2-sample-selected-day-week.png":::

###### Selected day of the week: Sample KQL query

Here is the date/time tests rule with a selected day of the week in KQL.  

```kusto
SecurityEvent
 | where dayofweek(TimeGenerated) between (3d .. 5d)
```
##### after/before/at example

Here is the syntax for a sample QRadar date/time tests rule that uses the `after`, `before`, or `at` operator. 

```bash
and when the event(s) occur <after/before/at> <this time{12.00AM, 12.05AM, ...11.50PM, 11.55PM}>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-after-before-at.png" alt-text="Diagram illustrating a date/time tests rule that uses the after/before/at operator." lightbox="media/migration-qradar-detection-rules/rule-2-sample-after-before-at.png":::

###### Selected day of the week: Sample KQL query

Here is the date/time tests rule that uses the `after`, `before`, or `at` operator in KQL.  

```kusto
SecurityEvent
| where format_datetime(TimeGenerated,'HH:mm')=="23:55"
```
`TimeGenerated` is in UTC/GMT.

#### Event property tests

Here is the QRadar syntax for an event property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-syntax.png" alt-text="Diagram illustrating an event property tests rule syntax." lightbox="media/migration-qradar-detection-rules/rule-3-syntax.png":::

##### IP protocol example

Here is the syntax for a sample QRadar event property tests rule that uses an IP protocol. 

```bash
and when the IP protocol is one of the following <protocols>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-protocol.png" alt-text="Diagram illustrating an event property tests rule that uses an IP protocol." lightbox="media/migration-qradar-detection-rules/rule-3-sample-protocol.png":::

###### IP protocol: Sample KQL query

```kusto
CommonSecurityLog
| where Protocol in ("UDP","ICMP")
```
##### Event Payload string example

Here is the syntax for a sample QRadar event property tests rule that uses an `Event Payload` string value. 

```bash
and when the Event Payload contains <this string>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-protocol.png" alt-text="Diagram illustrating an event property tests rule that uses an Event Payload string." lightbox="media/migration-qradar-detection-rules/rule-3-sample-protocol.png":::

###### Event Payload string: Sample KQL query

```kusto
CommonSecurityLog
| where DeviceVendor has "Palo Alto"

search "Palo Alto"
```
To optimize performance, avoid using the `search` command if you already know the table name.

#### Functions: counters

Here is the QRadar syntax for a functions rule that uses counters.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses counters." lightbox="media/migration-qradar-detection-rules/rule-4-syntax.png":::

##### Event property and time example

Here is the syntax for a sample QRadar functions rule that uses a defined number of event properties in a defined number of minutes. 

```bash
and when at least <this many> events are seen with the same <event properties> in <this many> <minutes>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-sample-event-property.png" alt-text="Diagram illustrating a functions rule that uses event properties." lightbox="media/migration-qradar-detection-rules/rule-4-sample-event-property.png":::

###### Event property and time: Sample KQL query

```kusto
CommonSecurityLog
| summarize Count = count() by SourceIP, DestinationIP
| where Count >= 5
```
### Functions: negative

Here is the QRadar syntax for a functions rule that uses negative conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses negative conditions." lightbox="media/migration-qradar-detection-rules/rule-5-syntax.png":::

##### Negative conditions example

Here is the syntax for a sample QRadar functions rule that uses negative conditions. 

```bash
and when none of <these rules> match in <this many> <minutes> after <these rules> match with the same <event properties>
```
Here are two defined rules in QRadar. The negative conditions will be based on these rules.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-1.png" alt-text="Diagram illustrating an event property tests rule to be used for a negative conditions rule." lightbox="media/migration-qradar-detection-rules/rule-5-sample-1.png":::

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-2.png" alt-text="Diagram illustrating a common property tests rule to be used for a negative conditions rule." lightbox="media/migration-qradar-detection-rules/rule-5-sample-2.png":::

Here is a sample of the negative conditions rule based on the rules above.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-3.png" alt-text="Diagram illustrating a functions rule with negative conditions." lightbox="media/migration-qradar-detection-rules/rule-5-sample-3.png":::

###### Negative conditions: Sample KQL query

```kusto
let spanoftime = 10m;
let Test2 = (
CommonSecurityLog
| where Protocol !in ("UDP","ICMP")
| where TimeGenerated > ago(spanoftime)
);
let Test6 = (
CommonSecurityLog
| where SourceIP == DestinationIP
);
Test2
| join kind=rightanti Test6 on $left. SourceIP == $right. SourceIP and $left. Protocol ==$right. Protocol
```
### Functions: simple

Here is the QRadar syntax for a functions rule that uses simple conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses simple conditions." lightbox="media/migration-qradar-detection-rules/rule-6-syntax.png":::

##### Simple conditions example

Here is the syntax for a sample QRadar functions rule that uses simple conditions. 

```bash
and when an event matches <any|all> of the following <rules>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-sample-1.png" alt-text="Diagram illustrating a functions rule with simple conditions." lightbox="media/migration-qradar-detection-rules/rule-6-sample-1.png":::

###### Simple conditions: Sample KQL query

```kusto
CommonSecurityLog
| where Protocol !in ("UDP","ICMP") or SourceIP == DestinationIP
```
### IP/port tests

Here is the QRadar syntax for an IP/port tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-syntax.png" alt-text="Diagram illustrating the syntax of an IP/port tests rule." lightbox="media/migration-qradar-detection-rules/rule-7-syntax.png":::

##### Source port example

Here is the syntax for a sample QRadar rule specifying a source port. 

```bash
and when the source port is one of the following <ports>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-1-port.png" alt-text="Diagram illustrating a rule that specifies a source port." lightbox="media/migration-qradar-detection-rules/rule-7-sample-1-port.png":::

###### Source port: Sample KQL query

```kusto
CommonSecurityLog
| where SourcePort == 20
```
##### Source IP example

Here is the syntax for a sample QRadar rule specifying a source IP. 

```bash
and when the source IP is one of the following <IP addresses>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-2-ip.png" alt-text="Diagram illustrating a rule that specifies a source IP address." lightbox="media/migration-qradar-detection-rules/rule-7-sample-2-ip.png":::

###### Source IP: Sample KQL query

```kusto
CommonSecurityLog
| where SourceIP in (“10.1.1.1”,”10.2.2.2”)
```
### Log source tests

Here is the QRadar syntax for a log source tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-syntax.png" alt-text="Diagram illustrating the syntax of a log source tests rule." lightbox="media/migration-qradar-detection-rules/rule-8-syntax.png":::

##### Log source example

Here is the syntax for a sample QRadar rule specifying log sources. 

```bash
and when the event(s) were detected by one or more of these <log source types>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-sample-1.png" alt-text="Diagram illustrating a rule that specifies log sources." lightbox="media/migration-qradar-detection-rules/rule-8-sample-1.png":::

###### Log source: Sample KQL query

```kusto
OfficeActivity
| where OfficeWorkload == "Exchange"
```