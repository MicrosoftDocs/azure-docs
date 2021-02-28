---
title: View audit and reporting data in Azure Sentinel| Microsoft Docs
description: This article describes how to view audit and reporting data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.assetid: 9b4c8e38-c986-4223-aa24-a71b01cb15ae
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/25/2021
ms.author: bagol

---
# View audit data in Azure Sentinel

This article describes how you can use Azure Sentinel to audit the activities in your Security Operations (SOC) environment, such as for both internal and external compliance requirements.

Azure Sentinel provides access to:

- The **LAQueryLogs** table, which provides details about the queries run in Log Analytics, including those run from Azure Sentinel.
- The **AzureActivity** table, which provides details about all actions taken in Azure Sentinel, such as editing alert rules. These actions do not include specific query data.

> [!TIP]
> In addition to the manual queries described in this article, Azure Sentinel provides a built-in workbook to help you audit the activities in your SOC environment.
>
> In the Azure Sentinel **Workbooks** area, search for the **Workspace audit** workbook.


## Auditing with LAQueryLogs

The **LAQueryLogs** table provides details about log queries run in Log Analytics. Since Log Analytics is used as Azure Sentinel's underlying query log, you can configure your system to display LAQueryLogs data in your Azure Sentinel workspace.

LAQueryLogs data includes information such as:

- When queries were run
- Who ran queries in Log Analytics
- What tool was used to run queries in Log Analytics, such as Azure Sentinel
- The query texts themselves
- Performance data on each query run

> [!NOTE]
> The **LAQueryLogs** table only includes data for queries run explicitly by users.
>
> It does not include information about queries run by working interactively with Azure Sentinel, or with scheduled analytics rules.

**To query the LAQueryLogs table**:

1. The **LAQueryLogs** table is not enabled by default in your Log Analytics workspace. To use **LAQueryLogs** data when auditing in Azure Sentinel, first enable the **LAQueryLogs** in your Log Analytics workspace's **Diagnostics settings** area.

    For more information, see, [Audit queries in Azure Monitor Logs](/azure/azure-monitor/logs/query-audit), which provides details about how to enable the audit queries and a full full list of the audit data provided by the **LAQueryLogs** table.

1. Then, query the data using KQL, like you would any other table.

    For example, the following query shows how many queries were run in the last week, on a per-day basis:

    ```kql
    LAQueryLogs
    | where TimeGenerated > ago(7d)
    | summarize events_count=count() by bin(TimeGenerated, 1d)
    ```

The following sections show more sample queries to run on the **LAQueryLogs** table when auditing activities in your SOC environment using Azure Sentinel.

### The number of queries run where the response was not "OK"

The following **LAQueryLogs** table query shows the number of queries run, where anything other than an HTTP response of **200 OK** was received. For example, this number will include queries that had failed to run.

```kql
LAQueryLogs
| where ResponseCode != 200 
| count 
```

### Show users for CPU-intensive queries

The following **LAQueryLogs** table query lists the users who ran the most CPU-intensive queries, based on CPU used and length of query time.

```kql
LAQueryLogs
|summarize arg_max(StatsCPUTimeMs, *) by AADClientId
| extend User = AADEmail, QueryRunTime = StatsCPUTimeMs
| project User, QueryRunTime, QueryText
| order by QueryRunTime desc
```

### Show users who ran the most queries in the past week

The following **LAQueryLogs** table query lists the users who ran the most queries in the last week.

```kql
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

## Auditing with Azure Activity logs

Azure Sentinel's audit logs are maintained in the [Azure Activity Logs](../azure-monitor/essentials/platform-logs-overview.md), where the **AzureActivity** table includes all actions taken in your Azure Sentinel workspace.

You can use the **AzureActivity** table when auditing activity in your SOC environment with Azure Sentinel.

**To query the AzureActivity table**:

1. Connect the [Azure Activity](connect-azure-activity.md) data source. After doing this, audit events are streamed into a new table in the **Logs** screen called AzureActivity.

1. Then, query the data using KQL, like you would any other table.

    For example, to find out who was the last user to edit a particular analytics rule, use the following query (replacing `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with the rule ID of the rule you want to check):

    ```kusto
    AzureActivity
    | where OperationNameValue startswith "MICROSOFT.SECURITYINSIGHTS/ALERTRULES/WRITE"
    | where Properties contains "alertRules/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    | project Caller , TimeGenerated , Properties
    ```

Add more parameters to your query to explore the **AzureActivities** table further, depending on what you need to report. The following sections provide other sample queries to use when auditing with **AzureActivity** table data. 

For more information, see [Azure Sentinel data included in Azure Activity logs](#azure-sentinel-data-included-in-azure-activity-logs).

### Find all actions taken by a specific AD user in the last 24 hours

The following **AzureActivity** table query lists all actions taken by a specific Azure AD user in the last 24 hours.

```kql
AzureActivity
| where OperationNameValue contains "SecurityInsights"
| where Caller == "[AzureAD username]"
| where TimeGenerated > ago(1d)
```

### Find all delete operations

The following **AzureActivity** table query lists all the delete operations performed in your Azure Sentinel workspace.

```kql
AzureActivity
| where OperationNameValue contains "SecurityInsights"
| where OperationName contains "Delete"
| where ActivityStatusValue contains "Succeeded"
| project TimeGenerated, Caller, OperationName
``` 


### Azure Sentinel data included in Azure Activity logs
 
Azure Sentinel's audit logs are maintained in the [Azure Activity Logs](../azure-monitor/essentials/platform-logs-overview.md).

The following supported operations can be audited:

- **Updates for** incidents, alert rules, incident comments, cases, data connectors, threat intelligence reports, bookmarks
- **Create** case comments, incident comments, watchlists, alert rules
- **Delete** bookmarks, alert rules, threat intelligence reports, data connectors, incidents, settings, watchlists
- **Check** user authorizations and licenses

WHAT ABT THIS TABLE? UPDATE IT WITH THE LIST ABOVE?

|Operation name|	Resource type|
|----|----|
|Create or update workbook	|Microsoft.Insights/workbooks|
|Delete Workbook	|Microsoft.Insights/workbooks|
|Set Workflow	|Microsoft.Logic/workflows|
|Delete Workflow	|Microsoft.Logic/workflows|
|Create Saved Search	|Microsoft.OperationalInsights/workspaces/savedSearches|
|Delete Saved Search	|Microsoft.OperationalInsights/workspaces/savedSearches|
|Update Alert Rules	|Microsoft.SecurityInsights/alertRules|
|Delete Alert Rules	|Microsoft.SecurityInsights/alertRules|
|Update Alert Rule Response Actions	|Microsoft.SecurityInsights/alertRules/actions|
|Delete Alert Rule Response Actions	|Microsoft.SecurityInsights/alertRules/actions|
|Update Bookmarks	|Microsoft.SecurityInsights/bookmarks|
|Delete Bookmarks	|Microsoft.SecurityInsights/bookmarks|
|Update Cases	|Microsoft.SecurityInsights/Cases|
|Update Case Investigation	|Microsoft.SecurityInsights/Cases/investigations|
|Create Case Comments	|Microsoft.SecurityInsights/Cases/comments|
|Update Data Connectors	|Microsoft.SecurityInsights/dataConnectors|
|Delete Data Connectors	|Microsoft.SecurityInsights/dataConnectors|
|Update Settings	|Microsoft.SecurityInsights/settings|
| | |

## Configuring alerts for Azure Sentinel activities

You may want to use Azure Sentinel auditing resources to create proactive alerts.

For example, if you have sensitive tables in your Azure Sentinel workspace, use the following query to notify you each time those tables are queried:

```kql
LAQueryLogs
| where QueryText contains "[Name of sensitive table]"
| where TimeGenerated > ago(1d)
| extend User = AADEmail, Query = QueryText
| project User, Query
```


## Next steps

In Azure Sentinel, use the **Workspace audit** workbook to audit the activities in your SOC environment.

For more information, see [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md).
