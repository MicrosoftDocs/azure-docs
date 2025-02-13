---
title: Audit Microsoft Sentinel queries and activities | Microsoft Docs
description: This article describes how to audit queries and activities performed in Microsoft Sentinel.
author: batamig
ms.topic: how-to
ms.date: 11/12/2024
ms.author: bagol

#Customer intent: As a security analyst, I want to audit queries and activities in my SOC environment so that I can ensure compliance and monitor security operations effectively.
---

# Audit Microsoft Sentinel queries and activities

This article describes how you can view audit data for queries run and activities performed in your Microsoft Sentinel workspace, such as for internal and external compliance requirements in your Security Operations (SOC) workspace.

Microsoft Sentinel provides access to:

- The **AzureActivity** table, which provides details about all actions taken in Microsoft Sentinel, such as editing alert rules. The **AzureActivity** table doesn't log specific query data. For more information, see [Auditing with Azure Activity logs](#auditing-with-azure-activity-logs).

- The **LAQueryLogs** table, which provides details about the queries run in Log Analytics, including queries run from Microsoft Sentinel. For more information, see [Auditing with LAQueryLogs](#auditing-with-laquerylogs).

> [!TIP]
> In addition to the manual queries described in this article, we recommend that you use the built-in **Workspace audit** workbook help you audit the activities in your SOC environment. For more information, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](monitor-your-data.md).

## Prerequisites

- Before you can successfully run the sample queries in this article, you need to have relevant data in your Microsoft Sentinel workspace to query on and access to Microsoft Sentinel.

  For more information, see [Configure Microsoft Sentinel content](configure-content.md) and [Roles and permissions in Microsoft Sentinel](roles.md).

## Auditing with Azure Activity logs

Microsoft Sentinel's audit logs are maintained in the [Azure Activity Logs](/azure/azure-monitor/essentials/platform-logs-overview), where the **AzureActivity** table includes all actions taken in your Microsoft Sentinel workspace.

Use the **AzureActivity** table when auditing activity in your SOC environment with Microsoft Sentinel.

**To query the AzureActivity table**:

1. Install the **Azure Activity solution for Sentinel** solution and connect the [Azure Activity](./data-connectors/azure-activity.md) data connector to start streaming audit events into a new table called `AzureActivity`.

1. Query the data using Kusto Query Language (KQL), like you would any other table:

    - In the Azure portal, query this table in the **[Logs](hunts-custom-queries.md)** page.
    - In Microsoft's unified security operations platform, query this table in the **Investigation & response > Hunting > [Advanced hunting](/defender-xdr/advanced-hunting-overview)** page.

    The **AzureActivity** table includes data from many services, including Microsoft Sentinel. To filter in only data from Microsoft Sentinel, start your query with the following code:

    ```kusto
     AzureActivity
    | where OperationNameValue startswith "MICROSOFT.SECURITYINSIGHTS"
    ```

    For example, to find out who was the last user to edit a particular analytics rule, use the following query (replacing `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with the rule ID of the rule you want to check):

    ```kusto
    AzureActivity
    | where OperationNameValue startswith "MICROSOFT.SECURITYINSIGHTS/ALERTRULES/WRITE"
    | where Properties contains "alertRules/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    | project Caller , TimeGenerated , Properties
    ```

Add more parameters to your query to explore the **AzureActivities** table further, depending on what you need to report. The following sections provide other sample queries to use when auditing with **AzureActivity** table data.

For more information, see [Microsoft Sentinel data included in Azure Activity logs](#microsoft-sentinel-data-included-in-azure-activity-logs).

### Find all actions taken by a specific user in the last 24 hours

The following **AzureActivity** table query lists all actions taken by a specific Microsoft Entra user in the last 24 hours.

```kusto
AzureActivity
| where OperationNameValue contains "SecurityInsights"
| where Caller == "[AzureAD username]"
| where TimeGenerated > ago(1d)
```

### Find all delete operations

The following **AzureActivity** table query lists all the delete operations performed in your Microsoft Sentinel workspace.

```kusto
AzureActivity
| where OperationNameValue contains "SecurityInsights"
| where OperationName contains "Delete"
| where ActivityStatusValue contains "Succeeded"
| project TimeGenerated, Caller, OperationName
```

### Microsoft Sentinel data included in Azure Activity logs

Microsoft Sentinel's audit logs are maintained in the [Azure Activity Logs](/azure/azure-monitor/essentials/platform-logs-overview), and include the following types of information:

|Operation  |Information types  |
|---------|---------|
|**Created**     |Alert rules <br> Case comments <br>Incident comments <br>Saved searches<br>Watchlists    <br>Workbooks     |
|**Deleted**     |Alert rules <br>Bookmarks <br>Data connectors <br>Incidents <br>Saved searches <br>Settings <br>Threat intelligence reports <br>Watchlists      <br>Workbooks <br>Workflow  |
|**Updated**     |  Alert rules<br>Bookmarks <br> Cases <br> Data connectors <br>Incidents <br>Incident comments <br>Threat intelligence reports <br> Workbooks <br>Workflow       |


You can also use the Azure Activity logs to check for user authorizations and licenses. For example, the following table lists selected operations found in Azure Activity logs with the specific resource the log data is pulled from.

|Operation name| Resource type|
|----|----|
|Create or update workbook |Microsoft.Insights/workbooks|
|Delete workbook |Microsoft.Insights/workbooks|
|Set workflow |Microsoft.Logic/workflows|
|Delete workflow |Microsoft.Logic/workflows|
|Create saved search |Microsoft.OperationalInsights/workspaces/savedSearches|
|Delete saved search |Microsoft.OperationalInsights/workspaces/savedSearches|
|Update alert rules |Microsoft.SecurityInsights/alertRules|
|Delete alert rules |Microsoft.SecurityInsights/alertRules|
|Update alert rule response actions |Microsoft.SecurityInsights/alertRules/actions|
|Delete alert rule response actions |Microsoft.SecurityInsights/alertRules/actions|
|Update bookmarks |Microsoft.SecurityInsights/bookmarks|
|Delete bookmarks |Microsoft.SecurityInsights/bookmarks|
|Update cases |Microsoft.SecurityInsights/Cases|
|Update case investigation |Microsoft.SecurityInsights/Cases/investigations|
|Create case comments |Microsoft.SecurityInsights/Cases/comments|
|Update data connectors |Microsoft.SecurityInsights/dataConnectors|
|Delete data connectors |Microsoft.SecurityInsights/dataConnectors|
|Update settings |Microsoft.SecurityInsights/settings|


For more information, see [Azure Activity Log event schema](/azure/azure-monitor/essentials/activity-log-schema).

## Auditing with LAQueryLogs

The **LAQueryLogs** table provides details about log queries run in Log Analytics. Since Log Analytics is used as Microsoft Sentinel's underlying data store, you can configure your system to collect LAQueryLogs data in your Microsoft Sentinel workspace.

LAQueryLogs data includes information such as:

- When queries were run
- Who ran queries in Log Analytics
- What tool was used to run queries in Log Analytics, such as Microsoft Sentinel
- The query texts themselves
- Performance data on each query run

> [!NOTE]
> - The **LAQueryLogs** table only includes queries that have been run in the Logs blade of Microsoft Sentinel. It does not include the queries run by scheduled analytics rules, using the **Investigation Graph**, in the Microsoft Sentinel **Hunting** page, or in the Defender portal's **Advanced hunting** page.
>
> - There may be a short delay between the time a query is run and the data is populated in the **LAQueryLogs** table. We recommend waiting about 5 minutes to query the **LAQueryLogs** table for audit data.

**To query the LAQueryLogs table**:

1. The **LAQueryLogs** table isn't enabled by default in your Log Analytics workspace. To use **LAQueryLogs** data when auditing in Microsoft Sentinel, first enable the **LAQueryLogs** in your Log Analytics workspace's **Diagnostics settings** area.

    For more information, see [Audit queries in Azure Monitor logs](/azure/azure-monitor/logs/query-audit).

1. Then, query the data using KQL, like you would any other table.

    For example, the following query shows how many queries were run in the last week, on a per-day basis:

    ```kusto
    LAQueryLogs
    | where TimeGenerated > ago(7d)
    | summarize events_count=count() by bin(TimeGenerated, 1d)
    ```

The following sections show more sample queries to run on the **LAQueryLogs** table when auditing activities in your SOC environment using Microsoft Sentinel.

### The number of queries run where the response wasn't "OK"

The following **LAQueryLogs** table query shows the number of queries run, where anything other than an HTTP response of **200 OK** was received. For example, this number includes queries that had failed to run.

```kusto
LAQueryLogs
| where ResponseCode != 200 
| count 
```

### Show users for CPU-intensive queries

The following **LAQueryLogs** table query lists the users who ran the most CPU-intensive queries, based on CPU used and length of query time.

```kusto
LAQueryLogs
|summarize arg_max(StatsCPUTimeMs, *) by AADClientId
| extend User = AADEmail, QueryRunTime = StatsCPUTimeMs
| project User, QueryRunTime, QueryText
| sort by QueryRunTime desc
```

### Show users who ran the most queries in the past week

The following **LAQueryLogs** table query lists the users who ran the most queries in the last week.

```kusto
LAQueryLogs
| where TimeGenerated > ago(7d)
| summarize events_count=count() by AADEmail
| extend UserPrincipalName = AADEmail, Queries = events_count
| join kind= leftouter (
    SigninLogs)
    on UserPrincipalName
| project UserDisplayName, UserPrincipalName, Queries
| summarize arg_max(Queries, *) by UserPrincipalName
| sort by Queries desc
```

## Configuring alerts for Microsoft Sentinel activities

You might want to use Microsoft Sentinel auditing resources to create proactive alerts.

For example, if you have sensitive tables in your Microsoft Sentinel workspace, use the following query to notify you each time those tables are queried:

```kusto
LAQueryLogs
| where QueryText contains "[Name of sensitive table]"
| where TimeGenerated > ago(1d)
| extend User = AADEmail, Query = QueryText
| project User, Query
```

## Monitor Microsoft Sentinel with workbooks, rules, and playbooks

Use Microsoft Sentinel's own features to monitor events and actions that occur within Microsoft Sentinel.

- **Monitor with workbooks**. Several built-in Microsoft Sentinel workbooks can help you monitor workspace activity, including information about the users working in your workspace, the analytics rules being used, the MITRE tactics most covered, stalled or stopped ingestions, and SOC team performance.

  For more information, see [Visualize and monitor your data by using workbooks in Microsoft Sentinel](monitor-your-data.md) and [Commonly used Microsoft Sentinel workbooks](top-workbooks.md)

- **Watch for ingestion delay**.  If you have concerns about ingestion delay, [set a variable in an analytics rule](ingestion-delay.md) to represent the delay.

  For example, the following analytics rule can help to ensure that results don't include duplicates, and that logs aren't missed when running the rules:

  ```kusto
  let ingestion_delay= 2min;let rule_look_back = 5min;CommonSecurityLog| where TimeGenerated >= ago(ingestion_delay + rule_look_back)| where ingestion_time() > (rule_look_back)
  - Calculating ingestion delay
    CommonSecurityLog| extend delay = ingestion_time() - TimeGenerated| summarize percentiles(delay,95,99) by DeviceVendor, DeviceProduct
  ```

  For more information, see [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md).

- **Monitor data connector health** using the [Connector Health Push Notification Solution](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Send-ConnectorHealthStatus) playbook to watch for stalled or stopped ingestion, and send notifications when a connector has stopped collecting data or machines have stopped reporting.

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***let*** statement](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***count*** operator](/kusto/query/count-operator?view=microsoft-sentinel&preserve-view=true)
- [***sort*** operator](/kusto/query/sort-operator?view=microsoft-sentinel&preserve-view=true)
- [***extend*** operator](/kusto/query/extend-operator?view=microsoft-sentinel&preserve-view=true)
- [***join*** operator](/kusto/query/join-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***ago()*** function](/kusto/query/ago-function?view=microsoft-sentinel&preserve-view=true)
- [***ingestion_time()*** function](/kusto/query/ingestion-time-function?view=microsoft-sentinel&preserve-view=true)
- [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***arg_max()*** aggregation function](/kusto/query/arg-max-aggregation-function?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Next step

In Microsoft Sentinel, use the **Workspace audit** workbook to audit the activities in your SOC environment. For more information, see [Visualize and monitor your data](monitor-your-data.md).
