---
title: Migrate QRadar detection rules to Microsoft Sentinel | Microsoft Docs
description: Identify, compare, and migrate your QRadar detection rules to Microsoft Sentinel built-in rules.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Migrate QRadar detection rules to Microsoft Sentinel

This article describes how to identify, compare, and migrate your QRadar detection rules to Microsoft Sentinel built-in rules.

## Identify rules

It's critical to identify and map detection rules from QRadar to Microsoft Sentinel rules. Review these considerations as you identify your current rules. 
- [Understand Microsoft Sentinel rule types](detect-threats-built-in.md#view-built-in-detections). 
- Check that you understand rule terminology using the [table below](#compare-rule-terminology).
- Don’t migrate all rules without consideration. Focus on quality, not quantity.
- Leverage existing functionality, and check whether Microsoft Sentinel’s [built-in analytics rules](https://github.com/Azure/Azure-Sentinel/tree/master/Detections) might address your current use cases. Because Microsoft Sentinel uses machine learning analytics to produce high-fidelity and actionable incidents, it’s likely that some of your existing detections won’t be required anymore.
- Confirm connected data sources and review your data connection methods. Revisit data collection conversations to ensure data depth and breadth across the use cases you plan to detect.
- Explore community resources such as the [SOC Prime Threat Detection Marketplace](https://my.socprime.com/tdm/) to check whether  your rules are available.
- Consider whether an online query converter such as Uncoder.io might work for your rules. 
- If rules aren’t available or can’t be converted, they need to be created manually, using a KQL query. Review the [rules mapping](#map-and-compare-rule-samples) to create new queries. 

Learn more about [best practices for migrating detection rules](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417).

## Compare rule terminology

This table helps you to clarify the concept of a rule in Microsoft Sentinel compared to QRadar.

| |QRadar |Microsoft Sentinel |
|---------|---------|---------|
|**Rule type** |• Events<br>• Flow<br>• Common<br>• Offense<br>• Anomaly detection rules |• Scheduled query<br>• Fusion<br>• Microsoft Security<br>• Machine Learning (ML) Behavior Analytics |
|**Criteria** |Define in test condition |Define in KQL |
|**Trigger condition** |Define in rule |Threshold: Number of query results |
|**Action** |• Create offense<br>• Dispatch new event<br>• Add to reference set or data<br>• And more |• Create alert or incident<br>• Integrates with Logic Apps |

## Map and compare rule samples

Use these samples to compare and map rules from QRadar to Microsoft Sentinel in various scenarios.

|Rule  |Syntax |Sample detection rule (QRadar)  |Sample KQL query  |Resources  |
|---------|---------|---------|---------|---------|
|Common property tests     |[QRadar syntax](#common-property-tests-syntax) |• [Regular expression example](#common-property-tests-regular-expression-example-qradar)<br>• [AQL filter query example](#common-property-tests-aql-filter-query-example-qradar)<br>• [equals/not equals example](#common-property-tests-equalsnot-equals-example-qradar)      |• [Regular expression example](#common-property-tests-regular-expression-example-kql)<br>• [AQL filter query example](#common-property-tests-aql-filter-query-example-kql)<br>• [equals/not equals example](#common-property-tests-equalsnot-equals-example-kql)       |• Regular expression: [matches regex](https://docs.microsoft.com/azure/data-explorer/kusto/query/re2)<br>• AQL filter query: [string operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• equals/not equals: [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)   | 
|Date/time tests     |[QRadar syntax](#datetime-tests-syntax) |• [Selected day of the month example](#datetime-tests-selected-day-of-the-month-example-qradar)<br>• [Selected day of the week example](#datetime-tests-selected-day-of-the-week-example-qradar)<br>• [after/before/at example](#datetime-tests-afterbeforeat-example-qradar)      |• [Selected day of the month example](#datetime-tests-selected-day-of-the-month-example-kql)<br>• [Selected day of the week example](#datetime-tests-selected-day-of-the-week-example-kql)<br>• [after/before/at example](#datetime-tests-afterbeforeat-example-kql)   |• [Date and time operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/samples?pivots=azuremonitor#date-and-time-operations)<br>• Selected day of the month: [dayofmonth()](https://docs.microsoft.com/azure/data-explorer/kusto/query/dayofmonthfunction)<br>• Selected day of the week: [dayofweek()](https://docs.microsoft.com/azure/data-explorer/kusto/query/dayofweekfunction)<br>• after/before/at: [format_datetime()](https://docs.microsoft.com/azure/data-explorer/kusto/query/format-datetimefunction)   | 
|Event property tests     |[QRadar syntax](#event-property-tests-syntax) |• [IP protocol example](#event-property-tests-ip-protocol-example-qradar)<br>• [Event Payload string example](#event-property-tests-event-payload-string-example-qradar)<br>     |• [IP protocol example](#event-property-tests-ip-protocol-example-kql)<br>• [Event Payload string example](#event-property-tests-event-payload-string-example-kql)<br>   |• IP protocol: [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• Event Payload string: [has](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators)   | 
|Functions: counters    |[QRadar syntax](#functions-counters-syntax) |[Event property and time example](#counters-event-property-and-time-example-qradar)    |[Event property and time example](#counters-event-property-and-time-example-kql)   |[summarize](https://docs.microsoft.com/azure/data-explorer/kusto/query/summarizeoperator)   | 
|Functions: negative conditions |[QRadar syntax](#functions-negative-conditions-syntax) |[Negative conditions example](#negative-conditions-example-qradar) |[Negative conditions example](#negative-conditions-example-kql) |• [join()](https://docs.microsoft.com/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [String operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• [Numerical operators](https://docs.microsoft.com/azure/data-explorer/kusto/query/numoperators)] |
|Functions: simple |[QRadar syntax](#functions-simple-conditions-syntax) |[Simple conditions example](#simple-conditions-example-qradar) |[Simple conditions example](#simple-conditions-example-kql) |[or](https://docs.microsoft.com/azure/data-explorer/kusto/query/logicaloperators) |
|IP/port tests |[QRadar syntax](#ipport-tests-syntax) |• [Source port example](#ipport-tests-source-port-example-qradar)<br>• [Source IP example](#ipport-tests-source-ip-example-qradar) |• [Source port example](#ipport-tests-source-port-example-kql)<br>• [Source IP example](#ipport-tests-source-ip-example-kql) | |
|Log source tests |[QRadar syntax](#log-source-tests-syntax) |[Log source example](#log-source-example-qradar) |[Log source example](#log-source-example-kql) | |

### Common property tests syntax

Here is the QRadar syntax for a common property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-syntax.png" alt-text="Diagram illustrating a common property test rule syntax." lightbox="media/migration-qradar-detection-rules/rule-1-syntax.png":::

### Common property tests: Regular expression example (QRadar)

Here is the syntax for a sample QRadar common property tests rule that uses a regular expression: 

```
when any of <these properties> match <this regular expression>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a common property test rule that uses a regular expression." lightbox="media/migration-qradar-detection-rules/rule-1-sample.png":::

### Common property tests: Regular expression example (KQL)

Here is the common property tests rule with a regular expression in KQL.  

```kusto
CommonSecurityLog
| where tostring(SourcePort) matches regex @"\d{1,5}" or tostring(DestinationPort) matches regex @"\d{1,5}"
```
### Common property tests: AQL filter query example (QRadar)

Here is the syntax for a sample QRadar common property tests rule that uses an AQL filter query. 

```
when the event matches <this> AQL filter query
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-aql.png" alt-text="Diagram illustrating a common property test rule that uses an AQL filter query." lightbox="media/migration-qradar-detection-rules/rule-1-sample-aql.png":::

### Common property tests: AQL filter query example (KQL)

Here is the common property tests rule with an AQL filter query in KQL.

```kusto
CommonSecurityLog
| where SourceIP == '10.1.1.10'
```
### Common property tests: equals/not equals example (QRadar)

Here is the syntax for a sample QRadar common property tests rule that uses the `equals` or `not equals` operator. 

```
and when <this property> <equals/not equals> <this property>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-equals.png" alt-text="Diagram illustrating a common property test rule that uses equals/not equals." lightbox="media/migration-qradar-detection-rules/rule-1-sample-equals.png":::

### Common property tests: equals/not equals example (KQL)

Here is the common property tests rule with the `equals` or `not equals` operator in KQL.

```kusto
CommonSecurityLog
| where SourceIP == DestinationIP
```
### Date/time tests syntax

Here is the QRadar syntax for a date/time tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-syntax.png" alt-text="Diagram illustrating a date/time tests rule syntax." lightbox="media/migration-qradar-detection-rules/rule-2-syntax.png":::

### Date/time tests: Selected day of the month example (QRadar)

Here is the syntax for a sample QRadar date/time tests rule that uses a selected day of the month. 

```
and when the event(s) occur <on/after/before> the <selected> day of the month
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day." lightbox="media/migration-qradar-detection-rules/rule-2-sample-selected-day.png":::

### Date/time tests: Selected day of the month example (KQL)

Here is the date/time tests rule with a selected day of the month in KQL.  

```kusto
SecurityEvent
 | where dayofmonth(TimeGenerated) < 4
```
### Date/time tests: Selected day of the week example (QRadar)

Here is the syntax for a sample QRadar date/time tests rule that uses a selected day of the week: 

```
and when the event(s) occur on any of <these days of the week{Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day-week.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day of the week." lightbox="media/migration-qradar-detection-rules/rule-2-sample-selected-day-week.png":::

### Date/time tests: Selected day of the week example (KQL)

Here is the date/time tests rule with a selected day of the week in KQL.  

```kusto
SecurityEvent
 | where dayofweek(TimeGenerated) between (3d .. 5d)
```
### Date/time tests: after/before/at example (QRadar)

Here is the syntax for a sample QRadar date/time tests rule that uses the `after`, `before`, or `at` operator. 

```
and when the event(s) occur <after/before/at> <this time{12.00AM, 12.05AM, ...11.50PM, 11.55PM}>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-after-before-at.png" alt-text="Diagram illustrating a date/time tests rule that uses the after/before/at operator." lightbox="media/migration-qradar-detection-rules/rule-2-sample-after-before-at.png":::

### Date/time tests: after/before/at example (KQL)

Here is the date/time tests rule that uses the `after`, `before`, or `at` operator in KQL.  

```kusto
SecurityEvent
| where format_datetime(TimeGenerated,'HH:mm')=="23:55"
```
`TimeGenerated` is in UTC/GMT.

### Event property tests syntax

Here is the QRadar syntax for an event property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-syntax.png" alt-text="Diagram illustrating an event property tests rule syntax." lightbox="media/migration-qradar-detection-rules/rule-3-syntax.png":::

### Event property tests: IP protocol example (QRadar)

Here is the syntax for a sample QRadar event property tests rule that uses an IP protocol. 

```
and when the IP protocol is one of the following <protocols>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-protocol.png" alt-text="Diagram illustrating an event property tests rule that uses an IP protocol." lightbox="media/migration-qradar-detection-rules/rule-3-sample-protocol.png":::

### Event property tests: IP protocol example (KQL)

```kusto
CommonSecurityLog
| where Protocol in ("UDP","ICMP")
```
### Event property tests: Event Payload string example (QRadar)

Here is the syntax for a sample QRadar event property tests rule that uses an `Event Payload` string value. 

```
and when the Event Payload contains <this string>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-protocol.png" alt-text="Diagram illustrating an event property tests rule that uses an Event Payload string." lightbox="media/migration-qradar-detection-rules/rule-3-sample-protocol.png":::

### Event property tests: Event Payload string example (KQL)

```kusto
CommonSecurityLog
| where DeviceVendor has "Palo Alto"

search "Palo Alto"
```
To optimize performance, avoid using the `search` command if you already know the table name.

### Functions: counters syntax

Here is the QRadar syntax for a functions rule that uses counters.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses counters." lightbox="media/migration-qradar-detection-rules/rule-4-syntax.png":::

### Counters: Event property and time example (QRadar)

Here is the syntax for a sample QRadar functions rule that uses a defined number of event properties in a defined number of minutes. 

```
and when at least <this many> events are seen with the same <event properties> in <this many> <minutes>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-sample-event-property.png" alt-text="Diagram illustrating a functions rule that uses event properties." lightbox="media/migration-qradar-detection-rules/rule-4-sample-event-property.png":::

### Counters: Event property and time example (KQL)

```kusto
CommonSecurityLog
| summarize Count = count() by SourceIP, DestinationIP
| where Count >= 5
```
### Functions: negative conditions syntax

Here is the QRadar syntax for a functions rule that uses negative conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses negative conditions." lightbox="media/migration-qradar-detection-rules/rule-5-syntax.png":::

### Negative conditions example (QRadar)

Here is the syntax for a sample QRadar functions rule that uses negative conditions. 

```
and when none of <these rules> match in <this many> <minutes> after <these rules> match with the same <event properties>
```
Here are two defined rules in QRadar. The negative conditions will be based on these rules.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-1.png" alt-text="Diagram illustrating an event property tests rule to be used for a negative conditions rule." lightbox="media/migration-qradar-detection-rules/rule-5-sample-1.png":::

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-2.png" alt-text="Diagram illustrating a common property tests rule to be used for a negative conditions rule." lightbox="media/migration-qradar-detection-rules/rule-5-sample-2.png":::

Here is a sample of the negative conditions rule based on the rules above.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-3.png" alt-text="Diagram illustrating a functions rule with negative conditions." lightbox="media/migration-qradar-detection-rules/rule-5-sample-3.png":::

### Negative conditions example (KQL)

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
### Functions: simple conditions syntax

Here is the QRadar syntax for a functions rule that uses simple conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses simple conditions." lightbox="media/migration-qradar-detection-rules/rule-6-syntax.png":::

### Simple conditions example (QRadar)

Here is the syntax for a sample QRadar functions rule that uses simple conditions. 

```
and when an event matches <any|all> of the following <rules>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-sample-1.png" alt-text="Diagram illustrating a functions rule with simple conditions." lightbox="media/migration-qradar-detection-rules/rule-6-sample-1.png":::

### Simple conditions example (KQL)

```kusto
CommonSecurityLog
| where Protocol !in ("UDP","ICMP") or SourceIP == DestinationIP
```
### IP/port tests syntax

Here is the QRadar syntax for an IP/port tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-syntax.png" alt-text="Diagram illustrating the syntax of an IP/port tests rule." lightbox="media/migration-qradar-detection-rules/rule-7-syntax.png":::

### IP/port tests: Source port example (QRadar)

Here is the syntax for a sample QRadar rule specifying a source port. 

```
and when the source port is one of the following <ports>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-1-port.png" alt-text="Diagram illustrating a rule that specifies a source port." lightbox="media/migration-qradar-detection-rules/rule-7-sample-1-port.png":::

### IP/port tests: Source port example (KQL)

```kusto
CommonSecurityLog
| where SourcePort == 20
```
### IP/port tests: Source IP example (QRadar)

Here is the syntax for a sample QRadar rule specifying a source IP. 

```
and when the source IP is one of the following <IP addresses>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-2-ip.png" alt-text="Diagram illustrating a rule that specifies a source IP address." lightbox="media/migration-qradar-detection-rules/rule-7-sample-2-ip.png":::

### IP/port tests: Source IP example (KQL)

```kusto
CommonSecurityLog
| where SourceIP in (“10.1.1.1”,”10.2.2.2”)
```
### Log source tests syntax

Here is the QRadar syntax for a log source tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-syntax.png" alt-text="Diagram illustrating the syntax of a log source tests rule." lightbox="media/migration-qradar-detection-rules/rule-8-syntax.png":::

#### Log source example (QRadar)

Here is the syntax for a sample QRadar rule specifying log sources. 

```
and when the event(s) were detected by one or more of these <log source types>
```
Here is the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-sample-1.png" alt-text="Diagram illustrating a rule that specifies log sources." lightbox="media/migration-qradar-detection-rules/rule-8-sample-1.png":::

#### Log source example (KQL)

```kusto
OfficeActivity
| where OfficeWorkload == "Exchange"
```