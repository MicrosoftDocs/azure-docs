---
title: Monitor Azure virtual machines with Azure Monitor - Analyze monitoring data
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/31/2021

---

# Monitoring virtual machines with Azure Monitor - Analyze monitoring data
Once you’ve deployed agents to your virtual machines and configured data collection, data will be available for analysis. You can leverage existing views and workbooks that visualize the collected data and allow you to drill in for more analysis, or you can perform ad hoc analysis by writing your own log queries. You can even create your own workbooks if you have custom requirements.

There are fundamentally two different experiences in Azure Monitor for analyzing the health and performance of virtual machines depending on whether you're analyzing a single machine or multiple. For example, you might receive an alert about a problem with an application on a virtual machine running slowly and need to investigate telemetry related to that specific machine. Or, you might want to compare performance trends across multiple machines. Each of these scenarios uses the same tools in Azure Monitor, but their experience is slightly different depending on how you launch them.

> [!NOTE]
> This article includes guidance on analyzing data that's collected by Azure Monitor and VM insights. For data that you configure to monitor workloads running on virtual machines, see []().

## Single Machine
Each Azure virtual machine and Azure Arc enabled server has a **Monitoring** menu in the Azure portal where you can access all the monitoring data for that machine. These options either limit the data that you're viewing to that machine or at least sets an initial filter for it. In some cases, you have additional information returned that isn't available when using the **Azure Monitor** menu.

The table below lists the different options in the virtual machine's **Monitoring** menu.

![Monitoring in the Azure portal](media/monitor-vm-azure/monitor-menu.png)

| Menu option | Description |
|:---|:---|
| Overview | Click the **Monitoring** tab to display [platform metrics](../essentials/data-platform-metrics.md) for the virtual machine host. This gives you a quick view of the trend over different time periods for important metrics such as CPU, network, and disk. Since these are host metrics though, counters from the guest operating system such as memory aren't included. Click on a graph to work with this data in [metrics explorer](../essentials/metrics-getting-started.md) where you can perform different aggregations and add additional counters for analysis. |
| Activity log | [Activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for the current virtual machine. Use this to view the recent activity of the machine such as any configuration changers and when it's been stopped and started. |
| Insights | Open [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. This shows you running processes on the machine and dependencies on other machines and external processes. You can also view details of the machine such as its properties and local events. See [Use the Map feature of VM insights to understand application components](vminsights-maps.md#view-a-map-from-a-vm) for details on using this view.<br>Click on the **Performance** tab to view trends of critical performance counters over different periods of time. This is data gathered from the guest operating system of the machine, so it includes detailed data for individual disks and memory. See [How to chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm) for details. |
| Alerts | Views [alerts](../alerts/alerts-overview.md) for the current virtual machine. These are only alerts that use the machine as the target resource. See [Alerts]() for details. |
| Metrics | Open [metrics explorer](../essentials/metrics-getting-started.md) with the scope set to the current machine. |
| Diagnostic settings | Enable and configure [diagnostics extension](../agents/diagnostics-extension-overview.md) for the current virtual machine. Note that this option is different than the **Diagnostic settings** option for other Azure resources.   |
| Advisor recommendations | Recommendations for the current virtual machine from [Azure Advisor](../../advisor/index.yml). |
| Logs | Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. This allows you to create custom queries with data from only this machine. |
| Connection monitor | Open [Network Watcher Connection Monitor](../../network-watcher/connection-monitor-overview.md) to monitor connections between the current virtual machine and other virtual machines. |
| Workbooks | Open the workbook gallery for virtual machines. |



## Multiple machines
Use the **Azure Monitor** menu to access data for multiple machines.

The table below lists the different options the **Azure Monitor** menu that relate to virtual machines.

![Monitoring in the Azure portal](media/monitor-vm-azure/monitor-menu.png)

| Menu option | Description |
|:---|:---|
| Activity log | [Activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for all resources. Create a filter for a **Resource Type** of Virtual Machines or Virtual Machine Scale Sets. |
| Alerts | Views [alerts](../alerts/alerts-overview.md). |
| Metrics | Open [metrics explorer](../essentials/metrics-getting-started.md). |
| Logs | Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. This allows you to create custom queries with data from any machine or any other resources that send data to the workspace. |
| Workbooks | |
| Virtual Machines | Open [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. This shows you running processes on the machine and dependencies on other machines and external processes. You can also view trends for performance data collected for the machine.  |


## Types of monitoring data
You should understand what kinds of data are available in Azure Monitor since different features will use different kinds of data. The basic types of data collected from virtual machines include the following:

| Data | Contents |
|:---|:---|
| [Activity log](../essentials/platform-logs-overview.md) | Provides insight into the operations on each Azure resource in the subscription from the outside (the management plane). For a virtual machine, this includes such information as when it was started and any configuration changes. View the Activity log from the virtual machine's monitoring menu or [create a diagnostic setting]() to send these events into the Log Analytics workspace so you can analyze it with other data. |
| [Metrics](../essentials/data-platform-metrics.md) | Numerical values that are automatically collected at regular intervals and describe some aspect of a resource at a particular time. Platform metrics are collected for the virtual machine host, but you require the diagnostics extension to collect metrics for the guest operating system. View this data in Metrics explorer. |
| [Logs](../essentials/data-platform-metrics.md) | Event and performance data collected from VM insights and from any data sources configured on the workspace. View this data in VM insights or create custom queries using Log Analytics. |

### Metrics and Logs
It can be confusing to determine which data is available between Metrics and Logs since data is collected using different methods, and agents send data to different locations. This is important to understand though, since different features of Azure Monitor use different kinds of data, and the type of alerting that you use for a particular scenario will depend on having that data available in a particular location.

> [!NOTE]
> The Azure Monitor Agent, currently in public preview, will replace the Log Analytics agent and have the ability to send client performance data to both Logs and Metrics. When this agent becomes generally available with VM insights, then all performance data will sent to both Logs and Metrics significantly simplifying this logic. 

The following details should help you understand the differences between the types of data. 

- Any non-numeric data such as events is stored in Logs.  
- Numeric data is often stored in both Metrics and Logs so it can be analyzed in different ways and support different types of alerts.
- Performance data from the guest operating system will be sent to logs by VM insights (using the Log Analytics agent and Dependency agent).
- Performance data from the guest operating system will only be sent to Metrics if the diagnostic extension is installed. The diagnostic extension is only available for Azure virtual machines.
- A specific set of performance counters is available for Metric alerts even though the data is stored in Logs. These counters cannot be analyzed with Metrics explorer.



## Analyze performance with VM insights
VM insights includes multiple performance charts that help you analyze common performance counters from the guest operating system. You can view data for a single machine or compare data from multiple machines over a period of time. For details on using these performance charts, see [How to chart performance with VM insights](vminsights-performance.md).

## Analyze machine dependencies 
Analyze dependencies between machines and between a machine and external dependencies using the map feature of VM insights. See [Use the Map feature of VM insights to understand application components](vminsights-maps.md) for details on this feature.

## Analyze machine details
The map feature of VM insights includes views for machine properties, events associated with the machine, open alerts for the machine, and change analysis. This is data that's available elsewhere in Azure monitor, but you may prefer this consolidated interface and integration with the dependency map. See [Use the Map feature of VM insights to understand application components](vminsights-maps.md) for details on this feature.


## Workbooks
[Workbooks](../visualize/workbooks-overview.MD) are an interactive visualization tool, commonly found in Azure Monitor, Azure Sentinel, and Azure Security Center. They are particularly useful because they can combine different kinds of data into a single view, and you can create custom reports that 

They support querying both Azure Monitor Logs, Azure Metrics and other services like Azure Resource Graph.


With Azure Monitor for Virtual Machines are several built in Workbooks. These Workbooks are available in the Performance tab under Virtual Machine Insights. 




## Analyze metric data with metrics explorer
Select  **Metrics** from the virtual machine's menu to open metrics explorer which allows you to analyze metric data for virtual machines. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool. 

There are three namespaces used by virtual machines:

| Namespace | Description | Requirement |
|:---|:---|:---|
| Virtual Machine Host | Host metrics automatically collected for all Azure virtual machines. Detailed list of metrics at [Microsoft.Compute/virtualMachines](../essentials/metrics-supported.md#microsoftcomputevirtualmachines). | Collected automatically with no configuration required. |
| Guest (classic) | Limited set of guest operating system and application performance data. Available in metrics explorer but not other Azure Monitor features such as metric alerts.  | [Diagnostic extension](../agents/diagnostics-extension-overview.md) installed. Data is read from Azure storage.  |
| Virtual Machine Guest | Guest operating system and application performance data available to all Azure Monitor features using metrics. | For Windows, [diagnostic extension installed](../agents/diagnostics-extension-overview.md) installed with Azure Monitor sink enabled. For Linux, [Telegraf agent installed](../essentials/collect-custom-metrics-linux-telegraf.md). |


> [!NOTE]
> For machines without the diagnostic extension installed, you'll see an option in the **Metric Namespace** dropdown called **Enable new guest memory metrics**. This option describes how to add the diagnostic extension to the machine to collect guest metrics. These same values are collected in Logs when VM insights is enabled.

> [!NOTE]
> Even with the dia


![Metrics explorer in the Azure portal](media/monitor-vm-azure/metrics.png)


## Analyze log data with Log Analytics
VM insights provides 

VM insights collects a predefined set of  set of performance counters that are written to the *InsightsMetrics* table. 


[How to query logs from VM insights](../vm/vminsights-log-search.md) for details.

| Table | Description | Source|
|:---|:---|:---|
| [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) | Traffic for open server ports on the monitored machine. | VM Insights |
| [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) | Inventory data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) | Traffic for inbound and outbound connections to and from monitored computers. | VM insights |
| [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) | Process data for servers collected by the Service Map and VM Insights solutions using the Dependency agent and Log analytics agent. | VM insights |
| ActivityLog | Configuration changes and history of when each virtual machine is stopped and started. | Activity Log |
| InsightsMetrics |  |

> [!NOTE]
> Performance data collected by the Log Analytics agent writes to the *Perf* table while VM insights will collect it to the *InsightsMetrics* table. This is the same data, but the tables have a different structure. If you have existing queries based on *Perf*, the will need to be rewritten to use *InsightsMetrics*.


## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)