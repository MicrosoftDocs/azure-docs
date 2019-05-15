---
title: Stream Azure Diagnostic Logs to Log Analytics workspace in Azure Monitor
description: Learn how to stream Azure diagnostic logs to a Log Analytics workspace in Azure Monitor.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 04/18/2019
ms.author: johnkem
ms.subservice: logs
---
# Stream Azure Diagnostic Logs to Log Analytics workspace in Azure Monitor

**[Azure diagnostic logs](diagnostic-logs-overview.md)** can be streamed in near real time to a Log Analytics workspace in Azure Monitor using the portal, PowerShell cmdlets or Azure CLI.

## What you can do with diagnostics logs in a Log Analytics workspace

Azure Monitor provides a flexible log query and analytics tool that enables you to gain insight into the raw log data generated from Azure resources. Some capabilities include:

* **Log query** - Write advanced queries over your log data, correlate logs from various sources, and generate charts that can be pinned to your Azure dashboard.
* **Alerting** - Detect when one or more events match a particular query and become notified with an email or webhook call using Azure Monitor alerts.
* **Advanced analytics** - Apply machine learning and pattern matching algorithms to identify possible issues revealed by your logs.

## Enable streaming of diagnostic logs to Log Analytics workspace

You can enable streaming of diagnostic logs programmatically, via the portal, or using the [Azure Monitor REST APIs](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings). Either way, you create a diagnostic setting in which you specify a Log Analytics workspace and the log categories and metrics you want to send in to that workspace. A diagnostic **log category** is a type of log that a resource may provide.

The Log Analytics workspace does not have to be in the same subscription as the resource emitting logs as long as the user who configures the setting has appropriate RBAC access to both subscriptions.

> [!NOTE]
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.
>
>

## Stream diagnostic logs using the portal
1. In the portal, navigate to Azure Monitor and click on **Diagnostic settings** in the **Settings** menu.


2. Optionally filter the list by resource group or resource type, then click on the resource for which you would like to set a diagnostic setting.

3. If no settings exist on the resource you have selected, you are prompted to create a setting. Click "Turn on diagnostics."

   ![Add diagnostic setting - no existing settings](media/diagnostic-logs-stream-log-store/diagnostic-settings-none.png)

   If there are existing settings on the resource, you will see a list of settings already configured on this resource. Click "Add diagnostic setting."

   ![Add diagnostic setting - existing settings](media/diagnostic-logs-stream-log-store/diagnostic-settings-multiple.png)

3. Give your setting a name and check the box for **Send to Log Analytics**, then select a Log Analytics workspace.

   ![Add diagnostic setting - existing settings](media/diagnostic-logs-stream-log-store/diagnostic-settings-configure.png)

4. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and diagnostic logs are streamed to that workspace as soon as new event data is generated. Note that there may be up to fifteen minutes between when an event is emitted and when it appears in Log Analytics.

### Via PowerShell Cmdlets

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To enable streaming via the [Azure PowerShell Cmdlets](../../azure-monitor/platform/powershell-quickstart-samples.md), you can use the `Set-AzDiagnosticSetting` cmdlet with these parameters:

```powershell
Set-AzDiagnosticSetting -ResourceId [your resource ID] -WorkspaceID [resource ID of the Log Analytics workspace] -Categories [list of log categories] -Enabled $true
```

Note that the workspaceID property takes the full Azure resource ID of the workspace, not the workspace ID/key shown in the Log Analytics portal.

### Via Azure CLI

To enable streaming via the [Azure CLI](../../azure-monitor/platform/cli-samples.md), you can use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command.

```azurecli
az monitor diagnostic-settings create --name <diagnostic name> \
    --workspace <log analytics name or object ID> \
    --resource <target resource object ID> \
    --resource-group <log analytics workspace resource group> \
    --logs '[
    {
        "category": <category name>,
        "enabled": true
    }
    ]'
```

You can add additional categories to the diagnostic log by adding dictionaries to the JSON array passed as the `--logs` parameter.

The `--resource-group` argument is only required if `--workspace` is not an object ID.

## How do I query the data from a Log Analytics workspace?

In the Logs blade in the Azure Monitor portal, you can query diagnostic logs as part of the Log Management solution under the AzureDiagnostics table. There are also [several monitoring solutions for Azure resources](../../azure-monitor/insights/solutions.md) you can install to get immediate insight into the log data you are sending into Azure Monitor.

### Known limitation: column limit in AzureDiagnostics
Because many resources send data types are all sent to the same table (_AzureDiagnostics_), the schema of this table is the super-set of the schemas of all the different data types being collected. For example, if you have created diagnostic settings for the collection of the following data types, all being sent to the same workspace:
- Audit logs of Resource 1 (having a schema consisting of columns A, B, and C)  
- Error logs of Resource 2 (having a schema consisting of columns D, E, and F)  
- Data flow logs of Resource 3 (having a schema consisting of columns G, H, and I)  
 
The AzureDiagnostics table will look as follows, with some sample data:  
 
| ResourceProvider | Category | A | B | C | D | E | F | G | H | I |
| -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| Microsoft.Resource1 | AuditLogs | x1 | y1 | z1 |
| Microsoft.Resource2 | ErrorLogs | | | | q1 | w1 | e1 |
| Microsoft.Resource3 | DataFlowLogs | | | | | | | j1 | k1 | l1|
| Microsoft.Resource2 | ErrorLogs | | | | q2 | w2 | e2 |
| Microsoft.Resource3 | DataFlowLogs | | | | | | | j3 | k3 | l3|
| Microsoft.Resource1 | AuditLogs | x5 | y5 | z5 |
| ... |
 
There is an explicit limit of any given Azure Log table not having more than 500 columns. Once reached, any rows containing data with any column outside of the first 500 will be dropped at ingestion-time. The AzureDiagnostics table is in particular susceptible to be impacted this limit. This typically happens either because a large variety of data sources are sent to the same workspace, or several very verbose data sources being sent to the same workspace. 
 
#### Azure Data Factory  
Azure Data Factory, due to a very detailed set of logs, is a resource that is known to be particularly impacted by this limit. In particular:  
- *User parameters defined against any activity in your pipeline*: there will be a new column created for every uniquely-named user parameter against any activity. 
- *Activity inputs and outputs*: these vary activity-to-activity and generate a large amount of columns due to their verbose nature. 
 
As with the broader workaround proposals below, it is recommended to isolate ADF logs into their own workspace to minimize the chance of these logs impacting other log types being collected in your workspaces. We expect to have curated logs for Azure Data Factory available soon.
 
#### Workarounds
Short term, until the 500-column limit is redefined, it is recommended to separate verbose data types into separate workspaces to reduce the possibility of hitting the limit.
 
Longer term, Azure Diagnostics will be moving away from a unified, sparse schema into individual tables per each data type; paired with support for dynamic types, this will greatly improve the usability of data coming into Azure Logs through the Azure Diagnostics mechanism. You can already see this for select Azure resource types, for example [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-analyze-activity-logs-log-analytics) or [Intune](https://docs.microsoft.com/intune/review-logs-using-azure-monitor) logs. Please look for news about new resource types in Azure supporting these curated logs on the [Azure Updates](https://azure.microsoft.com/updates/) blog!


## Next steps

* [Read more about Azure Diagnostic Logs](diagnostic-logs-overview.md)

