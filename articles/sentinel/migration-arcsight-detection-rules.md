---
title: Migrate ArcSight detection rules to Microsoft Sentinel | Microsoft Docs
description: Identify, compare, and migrate your ArcSight detection rules to Microsoft Sentinel built-in rules.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Migrate ArcSight detection rules to Microsoft Sentinel

This article describes how to identify, compare, and migrate your ArcSight detection rules to Microsoft Sentinel built-in rules.

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

Use these samples to migrate rules from ArcSight to Microsoft Sentinel in various scenarios.

|Rule  |Sample detection rule (ArcSight)  |Sample KQL query  |Resources  |
|---------|---------|---------|---------|
|Filter (and)     |[Sample detection rule in ArcSight](#filter-and-sample-detection-rule-in-arcsight)      |[Sample KQL query](#filter-and-sample-kql-query)         |<ul><li>[String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)</li><li>[Numerical operators](/azure/data-explorer/kusto/query/numoperators)</li><li>[ago](/azure/data-explorer/kusto/query/agofunction)</li><li>[Datetime](/azure/data-explorer/kusto/query/datetime-timespan-arithmetic)</li><li>[between](/azure/data-explorer/kusto/query/betweenoperator)</li><li>[now](/azure/data-explorer/kusto/query/nowfunction)</li><li>[parse](/azure/data-explorer/kusto/query/parseoperator)</li><li>[extract](/azure/data-explorer/kusto/query/extractfunction)</li><li>[parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)</li><li>[parse_csv](/azure/data-explorer/kusto/query/parseoperator)</li><li>[parse_path](/azure/data-explorer/kusto/query/parsepathfunction)</li><li>[parse_url](/azure/data-explorer/kusto/query/parseurlfunction)</li></ul>         |
|Filter (or)    |[Sample detection rule in ArcSight](#filter-or-sample-detection-rule-in-arcsight)         |[Sample KQL query](#filter-and-sample-kql-queries)         |<ul><li>[String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)</li><li>[in](/azure/data-explorer/kusto/query/inoperator)</li>         |


- [Filter (and)](#filter-and)
- [Filter (or)](#filter-or)

#### Filter (and)

This is a rule of type filter (and).

##### Filter (and): Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-1-sample.png" alt-text="Diagram illustrating a sample filter rule (and)." lightbox="media/migration-arcsight-detection-rules/rule-1-sample.png":::

##### Filter (and): Sample KQL query

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

##### Related operators and functions

- [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)
- [Numerical operators](/azure/data-explorer/kusto/query/numoperators)
- [ago](/azure/data-explorer/kusto/query/agofunction)
- [Datetime](/azure/data-explorer/kusto/query/datetime-timespan-arithmetic)
- [between](/azure/data-explorer/kusto/query/betweenoperator)
- [now](/azure/data-explorer/kusto/query/nowfunction)
- [parse](/azure/data-explorer/kusto/query/parseoperator)
- [extract](/azure/data-explorer/kusto/query/extractfunction)
- [parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)
- [parse_csv](/azure/data-explorer/kusto/query/parseoperator)
- [parse_path](/azure/data-explorer/kusto/query/parsepathfunction)
- [parse_url](/azure/data-explorer/kusto/query/parseurlfunction)

#### Filter (or)

This is a rule of type filter (or).

##### Filter (or): Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-2-sample.png" alt-text="Diagram illustrating a sample filter rule (or)." lightbox="media/migration-arcsight-detection-rules/rule-2-sample.png":::

##### Filter (or): Sample KQL queries

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

##### Related operators and functions

- [String operators](/azure/data-explorer/kusto/query/datatypes-string-operators#operators-on-strings)
- [in](/azure/data-explorer/kusto/query/inoperator)

#### Nested filter

This is a rule of type nested filter.

##### Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-1.png" alt-text="Diagram illustrating a sample nested filter rule." lightbox="media/migration-arcsight-detection-rules/rule-3-sample-1.png":::

`/All Filters/Soc Filters/Exclude Valid Users`:

:::image type="content" source="media/migration-arcsight-detection-rules/rule-3-sample-2.png" alt-text="Diagram illustrating a sample nested filter rule." lightbox="media/migration-arcsight-detection-rules/rule-3-sample-2.png":::

##### Sample KQL queries

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

##### Related operators and functions

- [Sample KQL function](https://techcommunity.microsoft.com/t5/azure-sentinel/using-kql-functions-to-speed-up-analysis-in-azure-sentinel/ba-p/712381)
- [Sample parameter function](https://github.com/Azure/Azure-Sentinel/blob/Downloads/Enriching%20Windows%20Security%20Events%20with%20Parameterized%20Function%20-%20Microsoft%20Tech%20Community)
- [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)
- [where](/azure/data-explorer/kusto/query/whereoperator)

#### Active list (lookup)

This is a rule of type active list (lookup).

##### Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-4-sample.png" alt-text="Diagram illustrating a sample active list rule (lookup)." lightbox="media/migration-arcsight-detection-rules/rule-4-sample.png":::

##### Sample KQL query

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

##### Related resources

- A watchlist is the equivalent of the active list feature. Learn more about [watchlists](watchlists.md).
- [Additional ways to implement lookups](https://techcommunity.microsoft.com/t5/azure-sentinel/implementing-lookups-in-azure-sentinel/ba-p/1091306) 

#### Correlation (matching)

This is a rule of type correlation, which matches a rule condition against a set of base events.

##### Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-5-sample.png" alt-text="Diagram illustrating a sample correlation rule (matching)." lightbox="media/migration-arcsight-detection-rules/rule-5-sample.png":::

##### Sample KQL query

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

##### Related operators and functions

join operator:
- [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuredataexplorer)
- [join with time window](/azure/data-explorer/kusto/query/join-timewindow)
- [shuffle](/azure/data-explorer/kusto/query/shufflequery)
- [Broadcast](/azure/data-explorer/kusto/query/broadcastjoin)
- [Union](/azure/data-explorer/kusto/query/unionoperator?pivots=azuredataexplorer)

define statement:
- [let](/azure/data-explorer/kusto/query/letstatement)

Aggregation:

- [make_set](/azure/data-explorer/kusto/query/makeset-aggfunction)
- [make_list](/azure/data-explorer/kusto/query/makelist-aggfunction)
- [make_bag](/azure/data-explorer/kusto/query/make-bag-aggfunction)
- [pack](/azure/data-explorer/kusto/query/packfunction) 

#### Correlation (time window)

This is a rule of type correlation, which uses a time window filter.

##### Sample detection rule in ArcSight

:::image type="content" source="media/migration-arcsight-detection-rules/rule-6-sample.png" alt-text="Diagram illustrating a sample correlation rule (time window)." lightbox="media/migration-arcsight-detection-rules/rule-6-sample.png":::

##### Sample KQL query

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

This is a rule of type aggregation.

##### Sample detection rule in ArcSight

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