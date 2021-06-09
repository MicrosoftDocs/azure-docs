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

> [!NOTE]
> This article is part of the [Monitoring virtual machines and their workloads in Azure Monitor scenario](monitor-virtual-machine.md). It describes how to configure Azure Monitor to most effectively monitor you Azure and hybrid virtual machines.

Once you’ve enabled VM insights on your virtual machines, data will be available for analysis. You can leverage existing views and workbooks that visualize the collected data and allow you to drill in for more analysis, or you can perform ad hoc analysis by writing your own log queries. You can even create your own workbooks to combine different sets of data.

> [!NOTE]
> This article includes guidance on analyzing data that's collected by Azure Monitor and VM insights. For data that you configure to monitor workloads running on virtual machines, see [Monitor workloads](monitor-virtual-machine-workloads.md).

There are fundamentally two different experiences in Azure Monitor for analyzing the health and performance of virtual machines depending on whether you're analyzing a single machine or multiple. For example, you might receive an alert about a problem with an application on a virtual machine running slowly and need to investigate telemetry related to that specific machine. Or, you might want to compare performance trends across multiple machines. Each of these scenarios uses the same tools in Azure Monitor, but their experience is slightly different depending on how you launch them.


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

## Analyze single machine
Each Azure virtual machine and Azure Arc enabled server has a **Monitoring** menu in the Azure portal where you can access all the monitoring data for that machine. These options either limit the data that you're viewing to that machine or at least sets an initial filter for it. This allows you to focus on that particular machine, viewing its current performance, its trending over time, helping to identify any issues it maybe experiencing.

The table below lists the different options in the virtual machine's **Monitoring** menu.

![Monitoring in the Azure portal](media/monitor-vm-azure/monitor-menu.png)

| Menu option | Description |
|:---|:---|
| Overview | Click the **Monitoring** tab to display [platform metrics](../essentials/data-platform-metrics.md) for the virtual machine host. This gives you a quick view of the trend over different time periods for important metrics such as CPU, network, and disk. Since these are host metrics though, counters from the guest operating system such as memory aren't included. Click on a graph to work with this data in [metrics explorer](../essentials/metrics-getting-started.md) where you can perform different aggregations and add additional counters for analysis. |
| Activity log | [Activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for the current virtual machine. Use this to view the recent activity of the machine such as any configuration changers and when it's been stopped and started. |
| Insights | Open [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. <br>Click on the **Performance** tab to view trends of critical performance counters over different periods of time. This is data gathered from the guest operating system of the machine, so it includes detailed data for individual disks and memory. See [How to chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm) for details. |
| Alerts | Views [alerts](../alerts/alerts-overview.md) for the current virtual machine. These are only alerts that use the machine as the target resource. See [Alerts]() for details. |
| Metrics | Open [metrics explorer](../essentials/metrics-getting-started.md) with the scope set to the current machine. |
| Diagnostic settings | Enable and configure [diagnostics extension](../agents/diagnostics-extension-overview.md) for the current virtual machine. Note that this option is different than the **Diagnostic settings** option for other Azure resources.   |
| Advisor recommendations | Recommendations for the current virtual machine from [Azure Advisor](../../advisor/index.yml). |
| Logs | Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. This allows you to create custom queries with data from only this machine. |
| Connection monitor | Open [Network Watcher Connection Monitor](../../network-watcher/connection-monitor-overview.md) to monitor connections between the current virtual machine and other virtual machines. |
| Workbooks | Open the workbook gallery for virtual machines. |


### Analyze data with VM insights
VM insights includes multiple performance charts that help you quickly get a status of the operation of a single machine, its trending performance over time, and its dependencies on other machines and processes. When you open VM insights from a virtual machines, both the map and performance view offer a consolidated view of different aspects of the machine such as its properties and events collected in the Log Analytics workspace.

Use the **Map** view to see running processes on the machine, dependencies on other machines and external processes. You can change the time window for the view to determine if these dependencies have changed from another time period.  See [Use the Map feature of VM insights to understand application components](vminsights-maps.md#view-a-map-from-a-vm) for details on using the map view for a single machine.

The **Performance** view includes multiple charts with several key performance indicators (KPIs) to help you determine how well a machine is performing. The charts show resource utilization over a period of time so you can identify bottlenecks, anomalies, or switch to a perspective listing each machine to view resource utilization based on the metric selected. When you open VM insights from the virtual machine menu, you also have a table with detailed metrics for each disk. See [How to chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm) for details on using the map view for a single machine.

### Analyze metric data with metrics explorer
Select  **Metrics** from the virtual machine's menu to open metrics explorer with the scope set to the machine. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool. 

> [!NOTE]
> You will only have host metrics for a machine unless the diagnostic extension is installed. This is the same data collected by VM insights, but that data is stored in Logs and note available in metrics explorer. For machines without the diagnostic extension installed, you'll see an option in the **Metric Namespace** dropdown called **Enable new guest memory metrics**. This option describes how to add the diagnostic extension to the machine to collect guest metrics. These same values are collected in Logs when VM insights is enabled.


There are three namespaces used by virtual machines:

| Namespace | Description | Requirement |
|:---|:---|:---|
| Virtual Machine Host | Host metrics automatically collected for all Azure virtual machines. Detailed list of metrics at [Microsoft.Compute/virtualMachines](../essentials/metrics-supported.md#microsoftcomputevirtualmachines). | Collected automatically with no configuration required. |
| Guest (classic) | Limited set of guest operating system and application performance data. Available in metrics explorer but not other Azure Monitor features such as metric alerts.  | [Diagnostic extension](../agents/diagnostics-extension-overview.md) installed. Data is read from Azure storage.  |
| Virtual Machine Guest | Guest operating system and application performance data available to all Azure Monitor features using metrics. | For Windows, [diagnostic extension installed](../agents/diagnostics-extension-overview.md) installed with Azure Monitor sink enabled. For Linux, [Telegraf agent installed](../essentials/collect-custom-metrics-linux-telegraf.md). |


### Analyze log data with log queries
Log Analytics allows you to perform custom analysis of your log data. This is the same data used to create the views in VM insights, but you may want to analyze different logic and aggregations of that data. You may also want to correlate security data collected by Azure Security Center and Azure Sentinel with your health and availability data, or work with data collected for your [workloads](monitor-virtual-machine-workloads.md). 

There are two methods to open Log Analytics from the virtual machine menu. When you select **Logs** from the virtual machine's menu, it sets the [scope](../log/../logs/scope.md) to that machine. This means that only records for that computer are returned, allowing you to focus on the machine that you're analyzing.  If the **Queries** pane doesn't open with Log Analytics, then click **Queries** at the top of the screen. The **Resource type** will be set to **Virtual machines** which displays a variety of different prebuilt queries that you can use to analyze the data for this machine. See [Using queries in Azure Monitor Log Analytics](../logs/queries.md) for information on using these queries and [Log Analytics tutorial](../logs/log-analytics-tutorial.md) for a complete tutorial on using Log Analytics to run queries and work with their results.

Launch Log Analytics from VM insights using the properties pane in either the **Performance** or **Map** view for the computer. This lists the tables that have data for that computer with the number of matching records. When you click on a table, Log Analytics will open with a simple query that returns in that table for the computer. You can work with these results or modify the query for more complex analysis. The [scope](../log/../logs/scope.md) set to the workspace meaning that you have access data for all computers using that workspace. 

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


### Analyze data with VM insights
VM insights includes multiple performance charts that help you quickly get a status of the operation of a single machine, its trending performance over time, and its dependencies on other machines and processes. When you open VM insights from a virtual machines, both the map and performance view offer a consolidated view of different aspects of the machine such as its properties and events collected in the Log Analytics workspace.

Use the **Map** view to see running processes on the machine, dependencies on other machines and external processes. You can change the time window for the view to determine if these dependencies have changed from another time period.  See [Use the Map feature of VM insights to understand application components](vminsights-maps.md#view-a-map-from-a-vm) for details on using the map view for a single machine.

The **Performance** view includes multiple charts with several key performance indicators (KPIs) to help you determine how well a machine is performing. The charts show resource utilization over a period of time so you can identify bottlenecks, anomalies, or switch to a perspective listing each machine to view resource utilization based on the metric selected. When you open VM insights from the virtual machine menu, you also have a table with detailed metrics for each disk. See [How to chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm) for details on using the map view for a single machine.

### Analyze metric data with metrics explorer
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





## Workbooks
[Workbooks](../visualize/workbooks-overview.MD) are an interactive visualization tool, commonly found in Azure Monitor, Azure Sentinel, and Azure Security Center. They are particularly useful because they can combine different kinds of data into a single view. They support querying both Azure Monitor Logs, Azure Metrics and other services like Azure Resource Graph.

### Standard workbooks
VM insights provides several workbooks in the **Performance** and **Map** tabs. Use these workbooks without modification or create custom workbooks to address unique requirements of different roles in your organization. 

### Custom workbooks
Workbooks also provide a blank canvas to create custom visuals that meet your particular requirements. You can combine data from 

With Virtual Machines we have host platform metrics available to use, Event Log, Syslog, as well as performance data under both InsightsMetrics and Perf tables. 

Use Resource Graph to include queries with alerts:






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