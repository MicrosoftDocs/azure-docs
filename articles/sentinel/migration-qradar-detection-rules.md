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

## Identify and migrate rules

Microsoft Sentinel uses machine learning analytics to create high-fidelity and actionable incidents, and some of your existing detections may be redundant in Microsoft Sentinel. Therefore, don't migrate all of your detection and analytics rules blindly. Review these considerations as you identify your existing detection rules.

- Make sure to select use cases that justify rule migration, considering business priority and efficiency.
- Check that you [understand Microsoft Sentinel rule types](detect-threats-built-in.md). 
- Check that you understand the [rule terminology](#compare-rule-terminology).
- Review any rules that haven't triggered any alerts in the past 6-12 months, and determine whether they're still relevant.
- Eliminate low-level threats or alerts that you routinely ignore.
- Use existing functionality, and check whether Microsoft Sentinel’s [built-in analytics rules](https://github.com/Azure/Azure-Sentinel/tree/master/Detections) might address your current use cases. Because Microsoft Sentinel uses machine learning analytics to produce high-fidelity and actionable incidents, it’s likely that some of your existing detections won’t be required anymore.
- Confirm connected data sources and review your data connection methods. Revisit data collection conversations to ensure data depth and breadth across the use cases you plan to detect.
- Explore community resources such as the [SOC Prime Threat Detection Marketplace](https://my.socprime.com/platform-overview/) to check whether  your rules are available.
- Consider whether an online query converter such as Uncoder.io might work for your rules. 
- If rules aren’t available or can’t be converted, they need to be created manually, using a KQL query. Review the [rules mapping](#map-and-compare-rule-samples) to create new queries. 

Learn more about [best practices for migrating detection rules](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/best-practices-for-migrating-detection-rules-from-arcsight/ba-p/2216417).

**To migrate your analytics rules to Microsoft Sentinel**:

1. Verify that you have a testing system in place for each rule you want to migrate.

    1. **Prepare a validation process** for your migrated rules, including full test scenarios and scripts.

    1. **Ensure that your team has useful resources** to test your migrated rules.

    1. **Confirm that you have any required data sources connected,** and review your data connection methods.

1. Verify whether your detections are available as built-in templates in Microsoft Sentinel:

    - **If the built-in rules are sufficient**, use built-in rule templates to create rules for your own workspace.

        In Microsoft Sentinel, go to the **Configuration > Analytics > Rule templates** tab, and create and update each relevant analytics rule.

        For more information, see [Detect threats out-of-the-box](detect-threats-built-in.md).

    - **If you have detections that aren't covered by Microsoft Sentinel's built-in rules**, try an online query converter, such as [Uncoder.io](https://uncoder.io/) to convert your queries to KQL.

        Identify the trigger condition and rule action, and then construct and review your KQL query.

    - **If neither the built-in rules nor an online rule converter is sufficient**, you'll need to create the rule manually. In such cases, use the following steps to start creating your rule:

        1. **Identify the data sources you want to use in your rule**. You'll want to create a mapping table between data sources and data tables in Microsoft Sentinel to identify the tables you want to query.

        1. **Identify any attributes, fields, or entities** in your data that you want to use in your rules.

        1. **Identify your rule criteria and logic**. At this stage, you may want to use rule templates as samples for how to construct your KQL queries.

            Consider filters, correlation rules, active lists, reference sets, watchlists, detection anomalies, aggregations, and so on. You might use references provided by your legacy SIEM to understand [how to best map your query syntax](#map-and-compare-rule-samples).            

        1. **Identify the trigger condition and rule action, and then construct and review your KQL query**. When reviewing your query, consider KQL optimization guidance resources.

1. Test the rule with each of your relevant use cases. If it doesn't provide expected results, you may want to review the KQL and test it again.

1. When you're satisfied, you can consider the rule migrated. Create a playbook for your rule action as needed. For more information, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).

Learn more about analytics rules:

- [**Create custom analytics rules to detect threats**](detect-threats-custom.md). Use [alert grouping](detect-threats-custom.md#alert-grouping) to reduce alert fatigue by grouping alerts that occur within a given timeframe.
- [**Map data fields to entities in Microsoft Sentinel**](map-data-fields-to-entities.md) to enable SOC engineers to define entities as part of the evidence to track during an investigation. Entity mapping also makes it possible for SOC analysts to take advantage of an intuitive [investigation graph (investigate-cases.md#use-the-investigation-graph-to-deep-dive) that can help reduce time and effort.
- [**Investigate incidents with UEBA data**](investigate-with-ueba.md), as an example of how to use evidence to surface events, alerts, and any bookmarks associated with a particular incident in the incident preview pane.
- [**Kusto Query Language (KQL)**](/azure/data-explorer/kusto/query/), which you can use to send read-only requests to your [Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md) database to process data and return results. KQL is also used across other Microsoft services, such as [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) and [Application Insights](../azure-monitor/app/app-insights-overview.md).

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
|Common property tests     |[QRadar syntax](#common-property-tests-syntax) |• [Regular expression example](#common-property-tests-regular-expression-example-qradar)<br>• [AQL filter query example](#common-property-tests-aql-filter-query-example-qradar)<br>• [equals/not equals example](#common-property-tests-equalsnot-equals-example-qradar)      |• [Regular expression example](#common-property-tests-regular-expression-example-kql)<br>• [AQL filter query example](#common-property-tests-aql-filter-query-example-kql)<br>• [equals/not equals example](#common-property-tests-equalsnot-equals-example-kql)       |• Regular expression: [matches regex](/azure/data-explorer/kusto/query/re2)<br>• AQL filter query: [string operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• equals/not equals: [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)   | 
|Date/time tests     |[QRadar syntax](#datetime-tests-syntax) |• [Selected day of the month example](#datetime-tests-selected-day-of-the-month-example-qradar)<br>• [Selected day of the week example](#datetime-tests-selected-day-of-the-week-example-qradar)<br>• [after/before/at example](#datetime-tests-afterbeforeat-example-qradar)      |• [Selected day of the month example](#datetime-tests-selected-day-of-the-month-example-kql)<br>• [Selected day of the week example](#datetime-tests-selected-day-of-the-week-example-kql)<br>• [after/before/at example](#datetime-tests-afterbeforeat-example-kql)   |• [Date and time operators](/azure/data-explorer/kusto/query/samples?pivots=azuremonitor#date-and-time-operations)<br>• Selected day of the month: [dayofmonth()](/azure/data-explorer/kusto/query/dayofmonthfunction)<br>• Selected day of the week: [dayofweek()](/azure/data-explorer/kusto/query/dayofweekfunction)<br>• after/before/at: [format_datetime()](/azure/data-explorer/kusto/query/format-datetimefunction)   | 
|Event property tests     |[QRadar syntax](#event-property-tests-syntax) |• [IP protocol example](#event-property-tests-ip-protocol-example-qradar)<br>• [Event Payload string example](#event-property-tests-event-payload-string-example-qradar)<br>     |• [IP protocol example](#event-property-tests-ip-protocol-example-kql)<br>• [Event Payload string example](#event-property-tests-event-payload-string-example-kql)<br>   |• IP protocol: [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• Event Payload string: [has](/azure/data-explorer/kusto/query/datatypes-string-operators)   | 
|Functions: counters    |[QRadar syntax](#functions-counters-syntax) |[Event property and time example](#counters-event-property-and-time-example-qradar)    |[Event property and time example](#counters-event-property-and-time-example-kql)   |[summarize](/azure/data-explorer/kusto/query/summarizeoperator)   | 
|Functions: negative conditions |[QRadar syntax](#functions-negative-conditions-syntax) |[Negative conditions example](#negative-conditions-example-qradar) |[Negative conditions example](#negative-conditions-example-kql) |• [join()](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• [Numerical operators](/azure/data-explorer/kusto/query/numoperators) |
|Functions: simple |[QRadar syntax](#functions-simple-conditions-syntax) |[Simple conditions example](#simple-conditions-example-qradar) |[Simple conditions example](#simple-conditions-example-kql) |[or](/azure/data-explorer/kusto/query/logicaloperators) |
|IP/port tests |[QRadar syntax](#ipport-tests-syntax) |• [Source port example](#ipport-tests-source-port-example-qradar)<br>• [Source IP example](#ipport-tests-source-ip-example-qradar) |• [Source port example](#ipport-tests-source-port-example-kql)<br>• [Source IP example](#ipport-tests-source-ip-example-kql) | |
|Log source tests |[QRadar syntax](#log-source-tests-syntax) |[Log source example](#log-source-example-qradar) |[Log source example](#log-source-example-kql) | |

### Common property tests syntax

Here's the QRadar syntax for a common property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-syntax.png" alt-text="Diagram illustrating a common property test rule syntax.":::

### Common property tests: Regular expression example (QRadar)

Here's the syntax for a sample QRadar common property tests rule that uses a regular expression: 

```
when any of <these properties> match <this regular expression>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a common property test rule that uses a regular expression.":::

### Common property tests: Regular expression example (KQL)

Here's the common property tests rule with a regular expression in KQL.  

```kusto
CommonSecurityLog
| where tostring(SourcePort) matches regex @"\d{1,5}" or tostring(DestinationPort) matches regex @"\d{1,5}"
```
### Common property tests: AQL filter query example (QRadar)

Here's the syntax for a sample QRadar common property tests rule that uses an AQL filter query. 

```
when the event matches <this> AQL filter query
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-aql.png" alt-text="Diagram illustrating a common property test rule that uses an A Q L filter query.":::

### Common property tests: AQL filter query example (KQL)

Here's the common property tests rule with an AQL filter query in KQL.

```kusto
CommonSecurityLog
| where SourceIP == '10.1.1.10'
```
### Common property tests: equals/not equals example (QRadar)

Here's the syntax for a sample QRadar common property tests rule that uses the `equals` or `not equals` operator. 

```
and when <this property> <equals/not equals> <this property>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-1-sample-equals.png" alt-text="Diagram illustrating a common property test rule that uses equals/not equals.":::

### Common property tests: equals/not equals example (KQL)

Here's the common property tests rule with the `equals` or `not equals` operator in KQL.

```kusto
CommonSecurityLog
| where SourceIP == DestinationIP
```
### Date/time tests syntax

Here's the QRadar syntax for a date/time tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-syntax.png" alt-text="Diagram illustrating a date/time tests rule syntax.":::

### Date/time tests: Selected day of the month example (QRadar)

Here's the syntax for a sample QRadar date/time tests rule that uses a selected day of the month. 

```
and when the event(s) occur <on/after/before> the <selected> day of the month
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day.":::

### Date/time tests: Selected day of the month example (KQL)

Here's the date/time tests rule with a selected day of the month in KQL.  

```kusto
SecurityEvent
 | where dayofmonth(TimeGenerated) < 4
```
### Date/time tests: Selected day of the week example (QRadar)

Here's the syntax for a sample QRadar date/time tests rule that uses a selected day of the week: 

```
and when the event(s) occur on any of <these days of the week{Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-selected-day-week.png" alt-text="Diagram illustrating a date/time tests rule that uses a selected day of the week.":::

### Date/time tests: Selected day of the week example (KQL)

Here's the date/time tests rule with a selected day of the week in KQL.  

```kusto
SecurityEvent
 | where dayofweek(TimeGenerated) between (3d .. 5d)
```
### Date/time tests: after/before/at example (QRadar)

Here's the syntax for a sample QRadar date/time tests rule that uses the `after`, `before`, or `at` operator. 

```
and when the event(s) occur <after/before/at> <this time{12.00AM, 12.05AM, ...11.50PM, 11.55PM}>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-2-sample-after-before-at.png" alt-text="Diagram illustrating a date/time tests rule that uses the after/before/at operator.":::

### Date/time tests: after/before/at example (KQL)

Here's the date/time tests rule that uses the `after`, `before`, or `at` operator in KQL.  

```kusto
SecurityEvent
| where format_datetime(TimeGenerated,'HH:mm')=="23:55"
```
`TimeGenerated` is in UTC/GMT.

### Event property tests syntax

Here's the QRadar syntax for an event property tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-syntax.png" alt-text="Diagram illustrating an event property tests rule syntax.":::

### Event property tests: IP protocol example (QRadar)

Here's the syntax for a sample QRadar event property tests rule that uses an IP protocol. 

```
and when the IP protocol is one of the following <protocols>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-protocol.png" alt-text="Diagram illustrating an event property tests rule that uses an I P protocol.":::

### Event property tests: IP protocol example (KQL)

```kusto
CommonSecurityLog
| where Protocol in ("UDP","ICMP")
```
### Event property tests: Event Payload string example (QRadar)

Here's the syntax for a sample QRadar event property tests rule that uses an `Event Payload` string value. 

```
and when the Event Payload contains <this string>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-3-sample-payload.png" alt-text="Diagram illustrating an event property tests rule that uses an Event Payload string.":::

### Event property tests: Event Payload string example (KQL)

```kusto
CommonSecurityLog
| where DeviceVendor has "Palo Alto"

search "Palo Alto"
```
To optimize performance, avoid using the `search` command if you already know the table name.

### Functions: counters syntax

Here's the QRadar syntax for a functions rule that uses counters.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses counters.":::

### Counters: Event property and time example (QRadar)

Here's the syntax for a sample QRadar functions rule that uses a defined number of event properties in a defined number of minutes. 

```
and when at least <this many> events are seen with the same <event properties> in <this many> <minutes>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-4-sample-event-property.png" alt-text="Diagram illustrating a functions rule that uses event properties.":::

### Counters: Event property and time example (KQL)

```kusto
CommonSecurityLog
| summarize Count = count() by SourceIP, DestinationIP
| where Count >= 5
```
### Functions: negative conditions syntax

Here's the QRadar syntax for a functions rule that uses negative conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses negative conditions.":::

### Negative conditions example (QRadar)

Here's the syntax for a sample QRadar functions rule that uses negative conditions. 

```
and when none of <these rules> match in <this many> <minutes> after <these rules> match with the same <event properties>
```
Here are two defined rules in QRadar. The negative conditions will be based on these rules.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-1.png" alt-text="Diagram illustrating an event property tests rule to be used for a negative conditions rule.":::

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-2.png" alt-text="Diagram illustrating a common property tests rule to be used for a negative conditions rule.":::

Here's a sample of the negative conditions rule based on the rules above.

:::image type="content" source="media/migration-qradar-detection-rules/rule-5-sample-3.png" alt-text="Diagram illustrating a functions rule with negative conditions.":::

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

Here's the QRadar syntax for a functions rule that uses simple conditions.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-syntax.png" alt-text="Diagram illustrating the syntax of a functions rule that uses simple conditions.":::

### Simple conditions example (QRadar)

Here's the syntax for a sample QRadar functions rule that uses simple conditions. 

```
and when an event matches <any|all> of the following <rules>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-6-sample-1.png" alt-text="Diagram illustrating a functions rule with simple conditions.":::

### Simple conditions example (KQL)

```kusto
CommonSecurityLog
| where Protocol !in ("UDP","ICMP") or SourceIP == DestinationIP
```
### IP/port tests syntax

Here's the QRadar syntax for an IP/port tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-syntax.png" alt-text="Diagram illustrating the syntax of an IP/port tests rule.":::

### IP/port tests: Source port example (QRadar)

Here's the syntax for a sample QRadar rule specifying a source port. 

```
and when the source port is one of the following <ports>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-1-port.png" alt-text="Diagram illustrating a rule that specifies a source port.":::

### IP/port tests: Source port example (KQL)

```kusto
CommonSecurityLog
| where SourcePort == 20
```
### IP/port tests: Source IP example (QRadar)

Here's the syntax for a sample QRadar rule specifying a source IP. 

```
and when the source IP is one of the following <IP addresses>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-7-sample-2-ip.png" alt-text="Diagram illustrating a rule that specifies a source IP address.":::

### IP/port tests: Source IP example (KQL)

```kusto
CommonSecurityLog
| where SourceIP in (“10.1.1.1”,”10.2.2.2”)
```
### Log source tests syntax

Here's the QRadar syntax for a log source tests rule.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-syntax.png" alt-text="Diagram illustrating the syntax of a log source tests rule.":::

#### Log source example (QRadar)

Here's the syntax for a sample QRadar rule specifying log sources. 

```
and when the event(s) were detected by one or more of these <log source types>
```
Here's the sample rule in QRadar.

:::image type="content" source="media/migration-qradar-detection-rules/rule-8-sample-1.png" alt-text="Diagram illustrating a rule that specifies log sources.":::

#### Log source example (KQL)

```kusto
OfficeActivity
| where OfficeWorkload == "Exchange"
```
## Next steps

In this article, you learned how to map your migration rules from QRadar to Microsoft Sentinel. 

> [!div class="nextstepaction"]
> [Migrate your SOAR automation](migration-qradar-automation.md)
