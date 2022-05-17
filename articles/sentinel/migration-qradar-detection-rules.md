---
title: Migrate QRadar detection rules to Microsoft Sentinel | Microsoft Docs
description: Identify, compare, and migrate your ArcSight detection rules to Microsoft Sentinel built-in rules.
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

Use these samples to migrate rules from QRadar to Microsoft Sentinel in various scenarios.

|Rule  |Description    |Sample detection rule (QRadar)  |Sample KQL query  |Resources  |
|---------|---------|---------|---------|---------|
|Filter (`AND`)     |This is a sample rule with `AND` conditions. The event must match all conditions.    |:::image type="content" source="media/migration-arcsight-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a sample filter rule." lightbox="media/migration-arcsight-detection-rules/rule-1-sample.png":::<br>[Sample detection rule in ArcSight](#filter-and)      |[Sample KQL query](#filter-and-sample-kql-query)         |String filter:<br>• [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br><br>Numerical filter:<br>• [Numerical operators](/azure/data-explorer/kusto/query/numoperators)<br><br>Datetime filter:<br>• [ago](/azure/data-explorer/kusto/query/agofunction)<br>• [Datetime](/azure/data-explorer/kusto/query/datetime-timespan-arithmetic)<br>• [between](/azure/data-explorer/kusto/query/betweenoperator)<br>• [now](/azure/data-explorer/kusto/query/nowfunction)<br><br>Parsing:<br>• [parse](/azure/data-explorer/kusto/query/parseoperator)<br>• [extract](/azure/data-explorer/kusto/query/extractfunction)<br>• [parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)<br>• [parse_csv](/azure/data-explorer/kusto/query/parseoperator)<br>• [parse_path](/azure/data-explorer/kusto/query/parsepathfunction)<br>• [parse_url](/azure/data-explorer/kusto/query/parseurlfunction)  |
|Filter (`OR`)    |This is a sample rule with `OR` conditions. The event can match any of the conditions.    |[Sample detection rule in ArcSight](#filter-or)         |[Sample KQL queries](#filter-or-sample-kql-queries)         |• [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)<br>• [in](/azure/data-explorer/kusto/query/inoperator)        |
|Nested filter    |This is a sample rule with nested filtering conditions. The rule includes the `MatchesFilter` statement, which also includes filtering conditions. |[Sample detection rule in ArcSight](#nested-filter) |[Sample KQL queries](#nested-filter-sample-kql-queries) |• [Sample KQL function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381)<br>• [Sample parameter function](https://github.com/Azure/Azure-Sentinel/blob/Downloads/Enriching%20Windows%20Security%20Events%20with%20Parameterized%20Function%20-%20Microsoft%20Tech%20Community)<br>• [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [where](/azure/data-explorer/kusto/query/whereoperator) |
|Active list (lookup) |This is a sample lookup rule that uses the `InActiveList` statement. |[Sample detection rule in ArcSight](#active-list-lookup) |[Sample KQL query](#active-list-sample-kql-query) |• A watchlist is the equivalent of the active list feature. Learn more about [watchlists](watchlists.md).<br>• [Additional ways to implement lookups](https://techcommunity.microsoft.com/t5/azure-sentinel/implementing-lookups-in-azure-sentinel/ba-p/1091306) |
|Correlation (matching) |This is a sample rule that defines a condition against a set of base events, using the `Matching Event` statement. |[Sample detection rule in ArcSight](#correlation-matching) |[Sample KQL query](#correlation-matching-sample-kql-query) |join operator:<br>• [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [join with time window](/azure/data-explorer/kusto/query/join-timewindow)<br>• [shuffle](/azure/data-explorer/kusto/query/shufflequery)<br>• [Broadcast](/azure/data-explorer/kusto/query/broadcastjoin)<br>• [Union](/azure/data-explorer/kusto/query/unionoperator?pivots=azuredataexplorer)<br><br>define statement:<br>• [let](/azure/data-explorer/kusto/query/letstatement)<br><br>Aggregation:<br>• [make_set](/azure/data-explorer/kusto/query/makeset-aggfunction)<br>• [make_list](/azure/data-explorer/kusto/query/makelist-aggfunction)<br>• [make_bag](/azure/data-explorer/kusto/query/make-bag-aggfunction)<br>• [pack](/azure/data-explorer/kusto/query/packfunction) |
|Correlation (time window) |This is a sample rule that defines a condition against a set of base events, using the `Matching Event` statement, and uses the `Wait time` filter condition. |[Sample detection rule in ArcSight](#correlation-time-window) |[Sample KQL query](#correlation-time-window-sample-kql-query) |• [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)<br>• [Microsoft Sentinel rules and join statement](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500) |


#### Filter (AND) 

Here is a sample filter rule with `AND` conditions in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a sample filter rule." lightbox="media/migration-arcsight-detection-rules/rule-1-sample.png":::

##### Filter (AND): Sample KQL query

Here is the filter rule with `AND` conditions in KQL.  

```kusto
SecurityEvent
| where EventID == 4728
| where SubjectUserName =~ "AutoMatedService"
| where isnotempty(SubjectDomainName)
```
Because this rule assumes that the Windows Security Events are collected via Microsoft Monitoring Agent (MMA) or Azure Monitoring Agent (AMA), the rule uses the Microsoft Sentinel SecurityEvent table.

Consider these best practices:
- To optimize your queries, avoid case-insensitive operators when possible: `=~`.
- Use '==' if the value is not case-sensitive.
- Order the filters by starting with the `where` statement, which filters out the most data.

#### Filter (OR)

Here is a sample filter rule with `OR` conditions in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-2-sample.png" alt-text="Diagram illustrating a sample filter rule (or).":::

##### Filter (or): Sample KQL queries

Here are a few ways to write the filter rule with `OR` conditions in KQL.  

###### Option 1: Use in statement

```kusto
SecurityEvent
| where SubjectUserName in
 ("Adm1","ServiceAccount1","AutomationServices")
```
###### Option 2: Use or statement

```kusto
SecurityEvent
| where SubjectUserName == "Adm1" or 
SubjectUserName == "ServiceAccount1" or 
SubjectUserName == "AutomationServices"
```
While both options are identical in performance, we recommend option 1, which is easier to read.

#### Nested filter

Here is a sample nested filter rule in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-1.png" alt-text="Diagram illustrating a sample nested filter rule." lightbox="media/migration-arcsight-detection-rules/rule-3-sample-1.png":::

Here is a rule for the `/All Filters/Soc Filters/Exclude Valid Users` filter:

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-2.png" alt-text="Diagram illustrating a sample nested filter rule." lightbox="media/migration-arcsight-detection-rules/rule-3-sample-2.png":::

##### Nested filter: Sample KQL queries

Here are a few ways to write the filter rule with `OR` conditions in KQL.

###### Option 1: Direct filter with where statement

```kusto
SecurityEvent
| where EventID == 4728 
| where isnotempty(SubjectDomainName) or 
isnotempty(TargetDomainName) 
| where SubjectUserName !~ "AutoMatedService"
```
###### Option 2: Use KQL function

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

###### Option 3: Use parameter function

1. Create a parameter function with `ExcludeValidUsers` as the name and alias.
2. Define the parameters of the function. For example:

    ```kusto
        Tbl: (TimeGenerated:datatime, Computer:string, 
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

###### Option 4: Use join function

Avoid using `join` when you can create the same query using other options.

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
- To optimize your queries, avoid the `=~` and `!~` case-insensitive operators when possible. Use the `==` and `!=` operators if the value is not case-sensitive.
- We recommend that you use option 1 due to its simplicity. For optimized performance, avoid using option 4.

#### Active list (lookup)

Here is an active list (lookup) rule in ArcSight.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-4-sample.png" alt-text="Diagram illustrating a sample active list rule (lookup)." lightbox="media/migration-arcsight-detection-rules/rule-4-sample.png":::

##### Active list: Sample KQL query

This rule assumes that the Cyber-Ark Exception Accounts watchlist exists in Azure Sentinel with an Account field.

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

#### Correlation (matching)

Here is a sample ArcSight rule that defines a condition against a set of base events, using the `Matching Event` statement.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-5-sample.png" alt-text="Diagram illustrating a sample correlation rule (matching)." lightbox="media/migration-arcsight-detection-rules/rule-5-sample.png":::

##### Correlation (matching): Sample KQL query

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
- If the left side of the table is relatively small (up to 100K records), add `hint.strategy=broadcast` for better performance.

#### Correlation (time window)

Here is a sample ArcSight rule that defines a condition against a set of base events, using the `Matching Event` statement, and uses the `Wait time` filter condition.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-6-sample.png" alt-text="Diagram illustrating a sample correlation rule (time window)." lightbox="media/migration-arcsight-detection-rules/rule-6-sample.png":::

##### Correlation (time window): Sample KQL query

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
##### Related operators and functions

- [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)
- [Microsoft Sentinel Correlation Rules: join operator](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-correlation-rules-the-join-kql-operator/ba-p/1041500) (blog post) 

#### Aggregation

Here is a sample ArcSight rule with aggregation settings: three matches within ten minutes.

:::image type="content" source="media/migration-arcsight-detection-rules/rule-7-sample.png" alt-text="Diagram illustrating a sample aggregation rule." lightbox="media/migration-arcsight-detection-rules/rule-7-sample.png":::

##### Sample KQL query

```kusto
SecurityEvent
| summarize Count = count() by SubjectUserName, 
SubjectDomainName
| where Count >3
```
##### Related operator

[summarize](/azure/data-explorer/kusto/query/summarizeoperator)