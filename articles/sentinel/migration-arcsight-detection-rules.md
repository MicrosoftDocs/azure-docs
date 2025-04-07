---
title: Migrate ArcSight detection rules to Microsoft Sentinel | Microsoft Docs
description: Identify, compare, and migrate your ArcSight detection rules to Microsoft Sentinel built-in rules.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 05/03/2022


#Customer intent: As a security engineer, I want to migrate ArcSight detection rules to Microsoft Sentinel so that analysts can leverage advanced analytics and machine learning for more effective threat detection and response.

---

# Migrate ArcSight detection rules to Microsoft Sentinel

This article describes how to identify, compare, and migrate your ArcSight detection rules to Microsoft Sentinel analytics rules.

## Identify and migrate rules

Microsoft Sentinel uses machine learning analytics to create high-fidelity and actionable incidents, and some of your existing detections may be redundant in Microsoft Sentinel. Therefore, don't migrate all of your detection and analytics rules blindly. Review these considerations as you identify your existing detection rules.

- Make sure to select use cases that justify rule migration, considering business priority and efficiency.
- Check that you [understand Microsoft Sentinel rule types](threat-detection.md). 
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

        For more information, see [Create scheduled analytics rules from templates](create-analytics-rule-from-template.md).

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

- [**Scheduled analytics rules in Microsoft Sentinel**](scheduled-rules-overview.md). Use [alert grouping](scheduled-rules-overview.md#alert-grouping) to reduce alert fatigue by grouping alerts that occur within a given timeframe.
- [**Map data fields to entities in Microsoft Sentinel**](map-data-fields-to-entities.md) to enable SOC engineers to define entities as part of the evidence to track during an investigation. Entity mapping also makes it possible for SOC analysts to take advantage of an intuitive [investigation graph](investigate-cases.md#use-the-investigation-graph-to-deep-dive) that can help reduce time and effort.
- [**Investigate incidents with UEBA data**](investigate-with-ueba.md), as an example of how to use evidence to surface events, alerts, and any bookmarks associated with a particular incident in the incident preview pane.
- [**Kusto Query Language (KQL)**](/kusto/query/?view=microsoft-sentinel&preserve-view=true), which you can use to send read-only requests to your [Log Analytics](/azure/azure-monitor/logs/log-analytics-tutorial) database to process data and return results. KQL is also used across other Microsoft services, such as [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) and [Application Insights](/azure/azure-monitor/app/app-insights-overview).

## Compare rule terminology

This table helps you to clarify the concept of a rule in Microsoft Sentinel compared to ArcSight.

| |ArcSight |Microsoft Sentinel |
|---------|---------|---------|
|**Rule type** |• Filter rule<br>• Join rule<br>• Active list rule<br>• And more |• Scheduled query<br>• Fusion<br>• Microsoft Security<br>• Machine Learning (ML) Behavior Analytics |
|**Criteria** |Define in rule conditions |Define in KQL |
|**Trigger condition** |• Define in action<br>• Define in aggregation (for event aggregation) |Threshold: Number of query results |
|**Action** |• Set event field<br>• Send notification<br>• Create new case<br>• Add to active list<br>• And more |• Create alert or incident<br>• Integrates with Logic Apps |

## Map and compare rule samples

Use these samples to compare and map rules from ArcSight to Microsoft Sentinel in various scenarios.

|Rule  |Description    |Sample detection rule (ArcSight)  |Sample KQL query  |Resources  |
|---------|---------|---------|---------|---------|
|Filter (`AND`)     |A sample rule with `AND` conditions. The event must match all conditions.    |[Filter (AND) example](#filter-and-example-arcsight)      |[Filter (AND) example](#filter-and-example-kql)         |String filter:<br>• [String operators](/kusto/query/datatypes-string-operators?view=microsoft-sentinel&preserve-view=true#operators-on-strings)<br><br>Numerical filter:<br>• [Numerical operators](/kusto/query/numerical-operators?view=microsoft-sentinel&preserve-view=true)<br><br>Datetime filter:<br>• [ago](/kusto/query/ago-function?view=microsoft-sentinel&preserve-view=true)<br>• [Datetime](/kusto/query/datetime-timespan-arithmetic?view=microsoft-sentinel&preserve-view=true)<br>• [between](/kusto/query/between-operator?view=microsoft-sentinel&preserve-view=true)<br>• [now](/kusto/query/now-function?view=microsoft-sentinel&preserve-view=true)<br><br>Parsing:<br>• [parse](/kusto/query/parse-operator?view=microsoft-sentinel&preserve-view=true)<br>• [extract](/kusto/query/extract-function?view=microsoft-sentinel&preserve-view=true)<br>• [parse_json](/kusto/query/parse-json-function?view=microsoft-sentinel&preserve-view=true)<br>• [parse_csv](/kusto/query/parse-csv-function?view=microsoft-sentinel&preserve-view=true)<br>• [parse_path](/kusto/query/parse-path-function?view=microsoft-sentinel&preserve-view=true)<br>• [parse_url](/kusto/query/parse-url-function?view=microsoft-sentinel&preserve-view=true)  |
|Filter (`OR`)    |A sample rule with `OR` conditions. The event can match any of the conditions.    |[Filter (OR) example](#filter-or-example-arcsight)         |[Filter (OR) example](#filter-or-example-kql)         |• [String operators](/kusto/query/datatypes-string-operators?view=microsoft-sentinel&preserve-view=true#operators-on-strings)<br>• [in](/kusto/query/in-operator?view=microsoft-sentinel&preserve-view=true)        |
|Nested filter    |A sample rule with nested filtering conditions. The rule includes the `MatchesFilter` statement, which also includes filtering conditions. |[Nested filter example](#nested-filter-example-arcsight) |[Nested filter example](#nested-filter-example-kql) |• [Sample KQL function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381)<br>• [Sample parameter function](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/enriching-windows-security-events-with-parameterized-function/ba-p/1712564)<br>• [join](/kusto/query/join-operator?view=microsoft-sentinel&preserve-view=true)<br>• [where](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true) |
|Active list (lookup) |A sample lookup rule that uses the `InActiveList` statement. |[Active list (lookup) example](#active-list-lookup-example-arcsight) |[Active list (lookup) example](#active-list-lookup-example-kql) |• A watchlist is the equivalent of the active list feature. Learn more about [watchlists](watchlists.md).<br>• [Other ways to implement lookups](https://techcommunity.microsoft.com/t5/azure-sentinel/implementing-lookups-in-azure-sentinel/ba-p/1091306) |
|Correlation (matching) |A sample rule that defines a condition against a set of base events, using the `Matching Event` statement. |[Correlation (matching) example](#correlation-matching-example-arcsight) |[Correlation (matching) example](#correlation-matching-example-kql) |join operator:<br>• [join](/kusto/query/join-operator?view=microsoft-sentinel&preserve-view=true)<br>• [join with time window](/kusto/query/join-time-window?view=microsoft-sentinel&preserve-view=true)<br>• [shuffle](/kusto/query/shuffle-query?view=microsoft-sentinel&preserve-view=true)<br>• [Broadcast](/kusto/query/broadcast-join?view=microsoft-sentinel&preserve-view=true)<br>• [Union](/kusto/query/union-operator?view=microsoft-sentinel&preserve-view=true)<br><br>define statement:<br>• [let](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)<br><br>Aggregation:<br>• [make_set](/kusto/query/make-set-aggregation-function?view=microsoft-sentinel&preserve-view=true)<br>• [make_list](/kusto/query/make-list-aggregation-function?view=microsoft-sentinel&preserve-view=true)<br>• [make_bag](/kusto/query/make-bag-aggregation-function?view=microsoft-sentinel&preserve-view=true)<br>• [bag_pack](/kusto/query/pack-function?view=microsoft-sentinel&preserve-view=true) |
|Correlation (time window) |A sample rule that defines a condition against a set of base events, using the `Matching Event` statement, and uses the `Wait time` filter condition. |[Correlation (time window) example](#correlation-time-window-example-arcsight) |[Correlation (time window) example](#correlation-time-window-example-kql) |• [join](/kusto/query/join-operator?view=microsoft-sentinel&preserve-view=true)<br>• [Microsoft Sentinel rules and join statement](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500) |

### Filter (AND) example: ArcSight

Here's a sample filter rule with `AND` conditions in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a sample filter rule." lightbox="media/migration-arcsight-detection-rules/rule-1-sample.png":::

### Filter (AND) example: KQL

Here's the filter rule with `AND` conditions in KQL.  

```kusto
SecurityEvent
| where EventID == 4728
| where SubjectUserName =~ "AutoMatedService"
| where isnotempty(SubjectDomainName)
```

This rule assumes that the Azure Monitoring Agent (AMA) collects the Windows Security Events. Therefore, the rule uses the Microsoft Sentinel [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent) table.

Consider these best practices:

- To optimize your queries, avoid case-insensitive operators when possible: `=~`.
- Use `==` if the value isn't case-sensitive.
- Order the filters by starting with the `where` statement, which filters out the most data.

### Filter (OR) example: ArcSight

Here's a sample filter rule with `OR` conditions in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-2-sample.png" alt-text="Diagram illustrating a sample filter rule (or).":::

### Filter (OR) example: KQL

Here are a few ways to write the filter rule with `OR` conditions in KQL.  

As a first option, use the `in` statement:

```kusto
SecurityEvent
| where SubjectUserName in
 ("Adm1","ServiceAccount1","AutomationServices")
```
As a second option, use the `or` statement:

```kusto
SecurityEvent
| where SubjectUserName == "Adm1" or 
SubjectUserName == "ServiceAccount1" or 
SubjectUserName == "AutomationServices"
```
While both options are identical in performance, we recommend the first option, which is easier to read.

### Nested filter example: ArcSight

Here's a sample nested filter rule in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-1.png" alt-text="Diagram illustrating a sample nested filter rule.":::

Here's a rule for the `/All Filters/Soc Filters/Exclude Valid Users` filter.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-2.png" alt-text="Diagram illustrating an Exclude Valid Users filter.":::

### Nested filter example: KQL

Here are a few ways to write the filter rule with `OR` conditions in KQL.

As a first option, use a direct filter with a `where` statement:

```kusto
SecurityEvent
| where EventID == 4728 
| where isnotempty(SubjectDomainName) or 
isnotempty(TargetDomainName) 
| where SubjectUserName !~ "AutoMatedService"
```
As a second option, use a KQL function:

1. Save the following query as a KQL function with the `ExcludeValidUsers` alias.
    
    ```kusto
        SecurityEvent
        | where EventID == 4728
        | where isnotempty(SubjectDomainName)
        | where SubjectUserName =~ "AutoMatedService"
        | project SubjectUserName
    ```

1. Use the following query to filter the `ExcludeValidUsers` alias.

    ```kusto
        SecurityEvent    
        | where EventID == 4728
        | where isnotempty(SubjectDomainName) or 
        isnotempty(TargetDomainName)
        | where SubjectUserName !in (ExcludeValidUsers)
    ```

As a third option, use a parameter function:

1. Create a parameter function with `ExcludeValidUsers` as the name and alias.
2. Define the parameters of the function. For example:

    ```kusto
        Tbl: (TimeGenerated:datetime, Computer:string, 
        EventID:string, SubjectDomainName:string, 
        TargetDomainName:string, SubjectUserName:string)
    ```

1. The `parameter` function has the following query:
    
    ```kusto
        Tbl
        | where SubjectUserName !~ "AutoMatedService"
    ```

1. Run the following query to invoke the parameter function:

    ```kusto
        let Events = (
        SecurityEvent 
        | where EventID == 4728
        );
        ExcludeValidUsers(Events)
    ```

As a fourth option, use the `join` function:

```kusto
let events = (
SecurityEvent
| where EventID == 4728
| where isnotempty(SubjectDomainName) 
or isnotempty(TargetDomainName)
);
let ExcludeValidUsers = (
SecurityEvent
| where EventID == 4728
| where isnotempty(SubjectDomainName)
| where SubjectUserName =~ "AutoMatedService"
);
events
| join kind=leftanti ExcludeValidUsers on 
$left.SubjectUserName == $right.SubjectUserName
```
Considerations:
- We recommend that you use a direct filter with a `where` statement (first option) due to its simplicity. For optimized performance, avoid using `join` (fourth option).
- To optimize your queries, avoid the `=~` and `!~` case-insensitive operators when possible. Use the `==` and `!=` operators if the value isn't case-sensitive.

### Active list (lookup) example: ArcSight

Here's an active list (lookup) rule in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-4-sample.png" alt-text="Diagram illustrating a sample active list rule (lookup).":::

### Active list (lookup) example: KQL

This rule assumes that the Cyber-Ark Exception Accounts watchlist exists in Microsoft Sentinel with an Account field.

```kusto
let Activelist=(
_GetWatchlist('Cyber-Ark Exception Accounts')
| project Account );
CommonSecurityLog
| where DestinationUserName in (Activelist)
| where DeviceVendor == "Cyber-Ark"
| where DeviceAction == "Get File Request"
| where DeviceCustomNumber1 != ""
| project DeviceAction, DestinationUserName, 
TimeGenerated,SourceHostName, 
SourceUserName, DeviceEventClassID
```
Order the filters by starting with the `where` statement that filters out the most data.

### Correlation (matching) example: ArcSight

Here's a sample ArcSight rule that defines a condition against a set of base events, using the `Matching Event` statement.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-5-sample.png" alt-text="Diagram illustrating a sample correlation rule (matching).":::

### Correlation (matching) example: KQL

```kusto
let event1 =(
SecurityEvent
| where EventID == 4728
);
let event2 =(
SecurityEvent
| where EventID == 4729
);
event1
| join kind=inner event2 
on $left.TargetUserName==$right.TargetUserName
```
Best practices:
- To optimize your query, ensure that the smaller table is on the left side of the `join` function. 
- If the left side of the table is relatively small (up to 100 K records), add `hint.strategy=broadcast` for better performance.

### Correlation (time window) example: ArcSight

Here's a sample ArcSight rule that defines a condition against a set of base events, using the `Matching Event` statement, and uses the `Wait time` filter condition.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-6-sample.png" alt-text="Diagram illustrating a sample correlation rule (time window).":::

### Correlation (time window) example: KQL

```kusto
let waittime = 10m;
let lookback = 1d;
let event1 = (
SecurityEvent
| where TimeGenerated > ago(waittime+lookback)
| where EventID == 4728
| project event1_time = TimeGenerated, 
event1_ID = EventID, event1_Activity= Activity, 
event1_Host = Computer, TargetUserName, 
event1_UPN=UserPrincipalName, 
AccountUsedToAdd = SubjectUserName 
);
let event2 = (
SecurityEvent
| where TimeGenerated > ago(waittime)
| where EventID == 4729
| project event2_time = TimeGenerated, 
event2_ID = EventID, event2_Activity= Activity, 
event2_Host= Computer, TargetUserName, 
event2_UPN=UserPrincipalName,
 AccountUsedToRemove = SubjectUserName 
);
 event1
| join kind=inner event2 on TargetUserName
| where event2_time - event1_time < lookback
| where tolong(event2_time - event1_time ) >=0
| project delta_time = event2_time - event1_time,
 event1_time, event2_time,
 event1_ID,event2_ID,event1_Activity,
 event2_Activity, TargetUserName, AccountUsedToAdd,
 AccountUsedToRemove,event1_Host,event2_Host, 
 event1_UPN,event2_UPN
```
### Aggregation example: ArcSight

Here's a sample ArcSight rule with aggregation settings: three matches within 10 minutes.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-7-sample.png" alt-text="Diagram illustrating a sample aggregation rule.":::

### Aggregation example: KQL

```kusto
SecurityEvent
| summarize Count = count() by SubjectUserName, 
SubjectDomainName
| where Count >3
```

## Next steps

In this article, you learned how to map your migration rules from ArcSight to Microsoft Sentinel. 

> [!div class="nextstepaction"]
> [Migrate your SOAR automation](migration-arcsight-automation.md)
