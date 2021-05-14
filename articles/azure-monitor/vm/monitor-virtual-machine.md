---
title: Monitor virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/01/2021

---

# Monitoring Azure virtual machines with Azure Monitor
This article describes how to use Azure Monitor to collect and analyze monitoring data from virtual machines and the workloads running on them to maintain their health and performance. It includes collection of telemetry critical for monitoring, configuring alerting to be proactively notified of critical issues, and analysis and visualization of collected data to identify trends.




## Layers of monitoring


### Virtual machine host
Virtual machines in Azure generate the following data for the virtual machine host the same as other Azure resources as described in [Monitoring data](../essentials/monitor-azure-resource.md#monitoring-data).

- [Platform metrics](../essentials/data-platform-metrics.md) - Numerical values that are automatically collected at regular intervals and describe some aspect of a resource at a particular time. Platform metrics are collected for the virtual machine host, but you require the diagnostics extension to collect metrics for the guest operating system.
- [Activity log](../essentials/platform-logs-overview.md) - Provides insight into the operations on each Azure resource in the subscription from the outside (the management plane). For a virtual machine, this includes such information as when it was started and any configuration changes.


### Guest operating system
To collect data from the guest operating system of a virtual machine, you require an agent, which runs locally on each virtual machine and sends data to Azure Monitor. Multiple agents are available for Azure Monitor with each collecting different data and writing data to different locations. Get a detailed comparison of the different agents at [Overview of the Azure Monitor agents](../agents/agents-overview.md). 

- [Log Analytics agent](../agents/agents-overview.md#log-analytics-agent) - Available for virtual machines in Azure, other cloud environments, and on-premises. Collects data to Azure Monitor Logs. Supports VM insights and monitoring solutions. This is the same agent used for System Center Operations Manager.
- [Dependency agent](../agents/agents-overview.md#dependency-agent) - Collects data about the processes running on the virtual machine and their dependencies. Relies on the Log Analytics agent to transmit data into Azure and supports VM insights, Service Map, and Wire Data 2.0 solutions.
- [Azure Diagnostic extension](../agents/agents-overview.md#azure-diagnostics-extension) - Available for Azure Monitor virtual machines only. Can collect data to multiple locations but primarily used to collect guest performance data into Azure Monitor Metrics for Windows virtual machines.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) - Collect performance data from Linux VMs into Azure Monitor Metrics.


## Features of Azure Monitor



### Enable diagnostics extension and Telegraf agent
VM insights is based on the Log Analytics agent that sends data to a Log Analytics workspace. This supports multiple features of Azure Monitor such as [log queries](../logs/log-query-overview.md), [log alerts](../alerts/alerts-log.md), and [workbooks](../visualize/workbooks-overview.md). The [diagnostics extension](../agents/diagnostics-extension-overview.md) collects performance data from the guest operating system of Windows virtual machines to Azure Storage and optionally sends performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md). For Linux virtual machines, the [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) is required to send data to Azure Metrics.  This enables other features of Azure Monitor such as [metrics explorer](../essentials/metrics-getting-started.md) and [metrics alerts](../alerts/alerts-metric.md). You can also configure the diagnostics extension to send events and performance data outside of Azure Monitor using Azure Event Hubs.

Install the diagnostics extension for a single Windows virtual machine in the Azure portal from the **Diagnostics setting** option in the VM menu. Select the option to enable **Azure Monitor** in the **Sinks** tab. To enable the extension from a template or command line for multiple virtual machines, see [Installation and configuration](../agents/diagnostics-extension-overview.md#installation-and-configuration). Unlike the Log Analytics agent, the data to collect is defined in the configuration for the extension on each virtual machine.

![Diagnostic setting](media/monitor-vm-azure/diagnostic-setting.png)

See [Install and configure Telegraf](../essentials/collect-custom-metrics-linux-telegraf.md#install-and-configure-telegraf) for details on configuring the Telegraf agents on Linux virtual machines. The **Diagnostic setting** menu option is available for Linux, but it will only allow you to send data to Azure storage.

### Collect platform metrics and Activity log
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Collect this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. This collection is configured with a [diagnostic setting](../essentials/diagnostic-settings.md). Collect the Activity log with a [diagnostic setting for the subscription](../essentials/diagnostic-settings.md#create-in-azure-portal).

Collect platform metrics with a diagnostic setting for the virtual machine. Unlike other Azure resources, you cannot create a diagnostic setting for a virtual machine in the Azure portal but must use [another method](../essentials/diagnostic-settings.md#create-using-powershell). The following examples show how to collect metrics for a virtual machine using both PowerShell and CLI.

```powershell
Set-AzDiagnosticSetting -Name vm-diagnostics -ResourceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm" -Enabled $true -MetricCategory AllMetrics -workspaceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
```

```azurecli
az monitor diagnostic-settings create \
--name VM-Diagnostics 
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace
```

## Monitoring in the Azure portal 
Once you configure collection of monitoring data for a virtual machine, you have multiple options for accessing it in the Azure portal:

- Use the **Azure Monitor** menu to access data from all monitored resources. 
- Use VM insights for monitoring sets of virtual machines at scale.
- Analyze data for a single virtual machine from its menu in the Azure portal. The table below lists different options for monitoring the virtual machines menu.

![Monitoring in the Azure portal](media/monitor-vm-azure/monitor-menu.png)

| Menu option | Description |
|:---|:---|
| Overview | Displays [platform metrics](../essentials/data-platform-metrics.md) for the virtual machine host. Click on a graph to work with this data in [metrics explorer](../essentials/metrics-getting-started.md). |
| Activity log | [Activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for the current virtual machine. |
| Insights | Opens [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. |
| Alerts | Views [alerts](../alerts/alerts-overview.md) for the current virtual machine.  |
| Metrics | Open [metrics explorer](../essentials/metrics-getting-started.md) with the scope set to the current virtual machine. |
| Diagnostic settings | Enable and configure [diagnostics extension](../agents/diagnostics-extension-overview.md) for the current virtual machine. |
| Advisor recommendations | Recommendations for the current virtual machine from [Azure Advisor](../../advisor/index.yml). |
| Logs | Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. |
| Connection monitor | Open [Network Watcher Connection Monitor](../../network-watcher/connection-monitor-overview.md) to monitor connections between the current virtual machine and other virtual machines. |


## Analyzing metric data
You can analyze metrics for virtual machines using metrics explorer by opening **Metrics** from the virtual machine's menu. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool. 

There are three namespaces used by virtual machines for metrics:

| Namespace | Description | Requirement |
|:---|:---|:---|
| Virtual Machine Host | Host metrics automatically collected for all Azure virtual machines. Detailed list of metrics at [Microsoft.Compute/virtualMachines](../essentials/metrics-supported.md#microsoftcomputevirtualmachines). | Collected automatically with no configuration required. |
| Guest (classic) | Limited set of guest operating system and application performance data. Available in metrics explorer but not other Azure Monitor features such as metric alerts.  | [Diagnostic extension](../agents/diagnostics-extension-overview.md) installed. Data is read from Azure storage.  |
| Virtual Machine Guest | Guest operating system and application performance data available to all Azure Monitor features using metrics. | For Windows, [diagnostic extension installed](../agents/diagnostics-extension-overview.md) installed with Azure Monitor sink enabled. For Linux, [Telegraf agent installed](../essentials/collect-custom-metrics-linux-telegraf.md). |

![Metrics explorer in the Azure portal](media/monitor-vm-azure/metrics.png)

## Analyzing log data
Azure virtual machines will collect the following data to Azure Monitor Logs. 

VM insights enables the collection of a predetermined set of performance counters that are written to the *InsightsMetrics* table. This is the same table used by [Container insights](../containers/container-insights-overview.md). 

| Data source | Requirements | Tables |
|:---|:---|:---|
| VM insights | Enable on each virtual machine. | InsightsMetrics<br>VMBoundPort<br>VMComputer<br>VMConnection<br>VMProcess<br>See [How to query logs from VM insights](../vm/vminsights-log-search.md) for details. |
| Activity log | Diagnostic setting for the subscription. | AzureActivity |
| Host metrics | Diagnostic setting for the virtual machine. | AzureMetrics |
| Data sources from the guest operating system | Enable Log Analytics agent and configure data sources. | See documentation for each data source. |


> [!NOTE]
> Performance data collected by the Log Analytics agent writes to the *Perf* table while VM insights will collect it to the *InsightsMetrics* table. This is the same data, but the tables have a different structure. If you have existing queries based on *Perf*, the will need to be rewritten to use *InsightsMetrics*.


## Alerts
[Alerts](../alerts/alerts-overview.md) in Azure Monitor proactively notify you when important conditions are found in your monitoring data and potentially launch an action such as starting a Logic App or calling a webhook. Alert rules define the logic used to determine when an alert should be created. Azure Monitor collects the data used by alert rules, but you need to create rules to define alerting conditions in your Azure subscription.

The following sections describe the types of alert rules and recommendations on when you should use each. This recommendation is based on the functionality and cost of the alert rule type. For details pricing of alerts, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).


### Activity log alert rules
[Activity log alert rules](../alerts/alerts-activity-log.md) fire when an entry matching particular criteria is created in the activity log. They have no cost so they should be your first choice if the logic you require is in the activity log. 

The target resource for activity log alerts can be a specific virtual machine, all virtual machines in a resource group, or all virtual machines in a subscription.

For example, create an alert if a critical virtual machine is stopped by selecting the *Power Off Virtual Machine* for the signal name.

![Activity log alert](media/monitor-vm-azure/activity-log-alert.png)


### Metric alert rules
[Metric alert rules](../alerts/alerts-metric.md) fire when a metric value exceeds a threshold. You can define a specific threshold value or allow Azure Monitor to dynamically determine a threshold based on historical data.  Use metric alerts whenever possible with metric data since they cost less and are more responsive than log alert rules. They are also stateful meaning they will resolve themselves when the metric drops below the threshold.

The target resource for activity log alerts can be a specific virtual machine or all virtual machines in a resource group.

For example, to create an alert when the processor of a virtual machine exceeds a particular value, create a metric alert rule using *Percentage CPU* as the signal type. Set either a specific threshold value or allow Azure Monitor to set a dynamic threshold. 

![Metric alert](media/monitor-vm-azure/metric-alert.png)

### Log alerts
[Log alert rules](../alerts/alerts-log.md) fire when the results of a scheduled log query match certain criteria. Log query alerts are the most expensive and least responsive of the alert rules, but they have access to the most diverse data and can perform complex logic that can't be performed by the other alert rules. 

The target resource for a log query is a Log Analytics workspace. Filter for specific computers in the query.

For example, to create an alert that checks if any virtual machines in a particular resource group are offline, use the following query which returns a record for each computer that's missed a heartbeat in the last ten minutes. Use a threshold of 1 which fires if at least one computer has a missed heartbeat.

```kusto
Heartbeat
| where TimeGenerated > ago(10m)
| where ResourceGroup == "my-resource-group"
| summarize max(TimeGenerated) by Computer
```

![Log alert for missed heartbeat](media/monitor-vm-azure/log-alert-01.png)

To create an alert if an excessive number of failed logons have occurred on any Windows virtual machines in the subscription, use the following query which returns a record for each failed logon event in the past hour. Use a threshold set to the number of failed logons that you'll allow. 

```kusto
Event
| where TimeGenerated > ago(1hr)
| where EventID == 4625
```

![Log alert for failed logons](media/monitor-vm-azure/log-alert-02.png)


## System Center Operations Manager
System Center Operations Manager provides granular monitoring of workloads on virtual machines. See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a comparison of monitoring platforms and different strategies for implementation.

If you have an existing Operations Manager environment that you intend to keep using, you can integrate it with Azure Monitor to provide additional functionality. The Log Analytics agent used by Azure Monitor is the same one used for Operations Manager so that you have monitored virtual machines send data to both. You still need to add the agent to VM insights and configure the workspace to collect additional data as specified above, but the virtual machines can continue to run their existing management packs in a Operations Manager environment without modification.

Features of Azure Monitor that augment an existing Operations Manager features include the following:

- Use Log Analytics to interactively analyze your log and performance data.
- Use log alerts to define alerting conditions across multiple virtual machines and using long term trends that aren't possible using alerts in Operations Manager.   

See [Connect Operations Manager to Azure Monitor](../agents/om-agents.md) for details on connecting your existing Operations Manager management group to your Log Analytics workspace.


## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)