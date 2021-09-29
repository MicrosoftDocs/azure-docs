---
title: 'Monitor virtual machines with Azure Monitor: Analyze monitoring data'
description: Learn about the different features of Azure Monitor that you can use to analyze the health and performance of your virtual machines.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor: Analyze monitoring data
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to analyze monitoring data for your virtual machines after you've completed their configuration.

After you've enabled VM insights on your virtual machines, data will be available for analysis. This article describes the different features of Azure Monitor that you can use to analyze the health and performance of your virtual machines. Several of these features provide a different experience depending on whether you're analyzing a single machine or multiple. Each experience is described here with any unique behavior of each feature depending on which experience is being used.

> [!NOTE]
> This article includes guidance on analyzing data that's collected by Azure Monitor and VM insights. For data that you configure to monitor workloads running on virtual machines, see [Monitor workloads](monitor-virtual-machine-workloads.md).

## Single machine experience
Access the single machine analysis experience from the **Monitoring** section of the menu in the Azure portal for each Azure virtual machine and Azure Arc–enabled server. These options either limit the data that you're viewing to that machine or at least set an initial filter for it. In this way, you can focus on a particular machine, view its current performance and its trending over time, and help to identify any issues it might be experiencing.

:::image type="content" source="media/monitor-virtual-machines/vm-menu.png" alt-text="Screenshot that shows analyzing a VM in the Azure portal." lightbox="media/monitor-virtual-machines/vm-menu.png":::

- **Overview page**: Select the **Monitoring** tab to display [platform metrics](../essentials/data-platform-metrics.md) for the virtual machine host. You get a quick view of the trend over different time periods for important metrics, such as CPU, network, and disk. Because these are host metrics though, counters from the guest operating system such as memory aren't included. Select a graph to work with this data in [metrics explorer](../essentials/metrics-getting-started.md) where you can perform different aggregations, and add more counters for analysis.
- **Activity log**: See [activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for the current virtual machine. Use this log to view the recent activity of the machine, such as any configuration changes and when it was stopped and started. 
- **Insights**: Open [VM insights](../vm/vminsights-overview.md) with the map for the current virtual machine selected. The map shows you running processes on the machine, dependencies on other machines, and external processes. For details on how to use the Map view for a single machine, see [Use the Map feature of VM insights to understand application components](vminsights-maps.md#view-a-map-from-a-vm).

    Select the **Performance** tab to view trends of critical performance counters over different periods of time. When you open VM insights from the virtual machine menu, you also have a table with detailed metrics for each disk. For details on how to use the Map view for a single machine, see [Chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm). 

- **Alerts**: View [alerts](../alerts/alerts-overview.md) for the current virtual machine. These alerts only use the machine as the target resource, so there might be other alerts associated with it. You might need to use the **Alerts** option in the Azure Monitor menu to view alerts for all resources. For details, see [Monitor virtual machines with Azure Monitor - Alerts](monitor-virtual-machine-alerts.md).
- **Metrics**: Open metrics explorer with the scope set to the machine. This option is the same as selecting one of the performance charts from the **Overview** page except that the metric isn't already added.
- **Diagnostic settings**: Enable and configure the [diagnostics extension](../agents/diagnostics-extension-overview.md) for the current virtual machine. This option is different than the **Diagnostic settings** option for other Azure resources. Only enable the diagnostic extension if you need to send data to Azure Event Hubs or Azure Storage.
- **Advisor recommendations**: See recommendations for the current virtual machine from [Azure Advisor](../../advisor/index.yml).
- **Logs**: Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the current virtual machine. You can select from a variety of existing queries to drill into log and performance data for only this machine. 
- **Connection monitor**: Open [Network Watcher Connection Monitor](../../network-watcher/connection-monitor-overview.md) to monitor connections between the current virtual machine and other virtual machines. 
- **Workbooks**: Open the workbook gallery with the VM insights workbooks for single machines. For a list of the VM insights workbooks designed for individual machines, see [VM insights workbooks](vminsights-workbooks.md#vm-insights-workbooks).

## Multiple machine experience
Access the multiple machine analysis experience from the **Monitor** menu in the Azure portal for each Azure virtual machine and Azure Arc–enabled server. These options provide access to all data so that you can select the virtual machines that you're interested in comparing.

:::image type="content" source="media/monitor-virtual-machines/monitor-menu.png" alt-text="Screenshot that shows analyzing multiple VMs in the Azure portal." lightbox="media/monitor-virtual-machines/monitor-menu.png":::

- **Activity log**: See [activity log](../essentials/activity-log.md#view-the-activity-log) entries filtered for all resources. Create a filter for a **Resource Type** of virtual machines or virtual machine scale sets to view events for all your machines.
- **Alerts**: View [alerts](../alerts/alerts-overview.md) for all resources, which includes alerts related to virtual machines but that are associated with the workspace. Create a filter for a **Resource Type** of virtual machines or virtual machine scale sets to view alerts for all your machines. 
- **Metrics**: Open [metrics explorer](../essentials/metrics-getting-started.md) with no scope selected. This feature is particularly useful when you want to compare trends across multiple machines. Select a subscription or a resource group to quickly add a group of machines to analyze together.
- **Logs**: Open [Log Analytics](../logs/log-analytics-overview.md) with the [scope](../logs/scope.md) set to the workspace. You can select from a variety of existing queries to drill into log and performance data for all machines. Or you can create a custom query to perform additional analysis.
- **Workbooks**: Open the workbook gallery with the VM insights workbooks for multiple machines. For a list of the VM insights workbooks designed for multiple machines, see [VM insights workbooks](vminsights-workbooks.md#vm-insights-workbooks). 
- **Virtual Machines**: Open [VM insights](../vm/vminsights-overview.md) with the **Get Started** tab open. This action displays all machines in your Azure subscription and identifies which are being monitored. Use this view to onboard individual machines that aren't already being monitored.

    Select the **Performance** tab to compare trends of critical performance counters for multiple machines over different periods of time. Select all machines in a subscription or resource group to include in the view. For details on how to use the Map view for a single machine, see [Chart performance with VM insights](vminsights-performance.md#view-performance-directly-from-an-azure-vm).

    Select the **Map** tab to view running processes on machines, dependencies between machines, and external processes. Select all machines in a subscription or resource group, or inspect the data for a single machine. For details on how to use the Map view for multiple machines, see [Use the Map feature of VM insights to understand application components](vminsights-maps.md#view-a-map-from-azure-monitor). 
 
## Compare Metrics and Logs
For many features of Azure Monitor, you don't need to understand the different types of data it uses and where it's stored. You can use VM insights, for example, without any understanding of what data is being used to populate the Performance view, Map view, and workbooks. You just focus on the logic that you're analyzing. As you dig deeper, you'll need to understand the difference between [Metrics](../essentials/data-platform-metrics.md) and [Logs](../logs/data-platform-logs.md). Different features of Azure Monitor use different kinds of data. The type of alerting that you use for a particular scenario depends on having that data available in a particular location.

This level of detail can be confusing if you're new to Azure Monitor. The following information helps you understand the differences between the types of data:

- Any non-numeric data, such as events, is stored in Logs. Metrics can only include numeric data that's sampled at regular intervals.
- Numeric data can be stored in both Metrics and Logs so that it can be analyzed in different ways and support different types of alerts.
- Performance data from the guest operating system is sent to Logs by VM insights by using the Log Analytics agent.
- Performance data from the guest operating system is sent to Metrics by the Azure Monitor agent.

> [!NOTE]
> The Azure Monitor agent sends data to both Metrics and Logs. In this scenario, it's only used for Metrics because the Log Analytics agent sends data to Logs as currently required for VM insights. When VM insights uses the Azure Monitor agent, this scenario will be updated to remove the Log Analytics agent.

## Analyze data with VM insights
VM insights includes multiple performance charts that help you quickly get a status of the operation of your monitored machines, their trending performance over time, and dependencies between machines and processes. It also offers a consolidated view of different aspects of any monitored machine, such as its properties and events collected in the Log Analytics workspace.

The **Get Started** tab displays all machines in your Azure subscription and identifies which ones are being monitored. Use this view to quickly identify which machines aren't being monitored and to onboard individual machines that aren't already being monitored.

:::image type="content" source="media/monitor-virtual-machines/vminsights-get-started.png" alt-text="Screenshot that shows VM insights get started." lightbox="media/monitor-virtual-machines/vminsights-get-started.png":::

The **Performance** view includes multiple charts with several key performance indicators (KPIs) to help you determine how well machines are performing. The charts show resource utilization over a period of time. You can use them to identify bottlenecks, see anomalies, or switch to a perspective listing each machine to view resource utilization based on the metric selected. For details on how to use the Performance view, see [Chart performance with VM insights](vminsights-performance.md).

:::image type="content" source="media/monitor-virtual-machines/vminsights-performance.png" alt-text="Screenshot that shows VM insights performance." lightbox="media/monitor-virtual-machines/vminsights-performance.png":::

Use the **Map** view to see running processes on machines and their dependencies on other machines and external processes. You can change the time window for the view to determine if these dependencies have changed from another time period. For details on how to use the Map view, see [Use the Map feature of VM insights to understand application components](vminsights-maps.md).

:::image type="content" source="media/monitor-virtual-machines/vminsights-map.png" alt-text="Screenshot that shows VM insights map." lightbox="media/monitor-virtual-machines/vminsights-map.png":::

## Analyze metric data with metrics explorer
By using metrics explorer, you can plot charts, visually correlate trends, and investigate spikes and dips in metrics' values. For details on how to use this tool, see [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md). 

Three namespaces are used by virtual machines.

| Namespace | Description | Requirement |
|:---|:---|:---|
| Virtual Machine Host | Host metrics automatically collected for all Azure virtual machines. Detailed list of metrics at [Microsoft.Compute/virtualMachines](../essentials/metrics-supported.md#microsoftcomputevirtualmachines). | Collected automatically with no configuration required. |
| Guest (classic) | Limited set of guest operating system and application performance data. Available in metrics explorer but not other Azure Monitor features, such as metric alerts.  | [Diagnostic extension](../agents/diagnostics-extension-overview.md) installed. Data is read from Azure Storage.  |
| Virtual Machine Guest | Guest operating system and application performance data available to all Azure Monitor features using metrics. | [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) installed with a [Data Collection Rule](../agents/data-collection-rule-overview.md). |

## Analyze log data with Log Analytics
By using Log Analytics, you can perform custom analysis of your log data. Use Log Analytics when you want to dig deeper into the data used to create the views in VM insights. You might want to analyze different logic and aggregations of that data, correlate security data collected by Azure Security Center and Azure Sentinel with your health and availability data, or work with data collected for your [workloads](monitor-virtual-machine-workloads.md).

You don't necessarily need to understand how to write a log query to use Log Analytics. There are multiple prebuilt queries that you can select and either run without modification or use as a start to a custom query. Select **Queries** at the top of the Log Analytics screen, and view queries with a **Resource type** of **Virtual machines** or **Virtual machine scale sets**. For information on how to use these queries, see [Using queries in Azure Monitor Log Analytics](../logs/queries.md). For a tutorial on how to use Log Analytics to run queries and work with their results, see [Log Analytics tutorial](../logs/log-analytics-tutorial.md).

:::image type="content" source="media/monitor-virtual-machines/vm-queries.png" alt-text="Screenshot that shows virtual machine queries." lightbox="media/monitor-virtual-machines/vm-queries.png":::

When you start Log Analytics from VM insights by using the properties pane in either the **Performance** or **Map** view, it lists the tables that have data for the selected computer. Select a table to open Log Analytics with a simple query that returns all records in that table for the selected computer. Work with these results or modify the query for more complex analysis. The [scope](../log/../logs/scope.md) set to the workspace means that you have access data for all computers using that workspace. 

:::image type="content" source="media/monitor-virtual-machines/table-query.png" alt-text="Screenshot that shows a Table query." lightbox="media/monitor-virtual-machines/table-query.png":::

## Visualize data with workbooks
[Workbooks](../visualize/workbooks-overview.MD) provide interactive reports in the Azure portal and combine different kinds of data into a single view. Workbooks combine text, [log queries](/azure/data-explorer/kusto/query/), metrics, and parameters into rich interactive reports. Workbooks are editable by any other team members who have access to the same Azure resources.

Workbooks are helpful for scenarios such as:

* Exploring the usage of your virtual machine when you don't know the metrics of interest in advance like CPU utilization, disk space, memory, and network dependencies. Unlike other usage analytics tools, workbooks let you combine multiple kinds of visualizations and analyses, which make them great for this kind of free-form exploration.
* Explaining to your team how a recently provisioned VM is performing, by showing metrics for key counters and other log events.
* Sharing the results of a resizing experiment of your VM with other members of your team. You can explain the goals for the experiment with text. Then you can show each usage metric and analytics queries used to evaluate the experiment, along with clear call-outs for whether each metric was above or below target.
* Reporting the impact of an outage on the usage of your VM, combining data, text explanation, and a discussion of next steps to prevent outages in the future.

VM insights include the following workbooks. You can use these workbooks or use them as a start to create custom workbooks to address your particular requirements.

### Single virtual machine

| Workbook | Description |
|----------|-------------|
| Performance | Provides a customizable version of the Performance view that uses all the Log Analytics performance counters that you have enabled. | 
| Connections | Provides an in-depth view of the inbound and outbound connections from your VM. | 

### Multiple virtual machines

| Workbook | Description |
|----------|-------------|
| Performance | Provides a customizable version of the Top N List and Charts view in a single workbook that uses all the Log Analytics performance counters that you have enabled.|
| Performance counters | Provides a Top N Chart view across a wide set of performance counters. |
| Connections | Provides an in-depth view of the inbound and outbound connections from your monitored machines. |
| Active Ports | Provides a list of the processes that have bound to the ports on the monitored machines and their activity in the chosen timeframe. |
| Open Ports | Provides the number of ports open on your monitored machines and the details on those open ports. |
| Failed Connections | Displays the count of failed connections on your monitored machines, the failure trend, and if the percentage of failures is increasing over time. |
| Security and Audit | Provides an analysis of your TCP/IP traffic that reports on overall connections, malicious connections, and where the IP endpoints reside globally. To enable all features, you'll need to enable Security Detection. |
| TCP Traffic | Provides a ranked report for your monitored machines and their sent, received, and total network traffic in a grid and displayed as a trend line. |
| Traffic Comparison | Compares network traffic trends for a single machine or a group of machines. |
| Log Analytics agent | Analyzes the health of your agents, including the number of agents connecting to a workspace that are unhealthy, and the effect of the agent on the performance of the machine. This workbook isn't available from VM insights like the other workbooks. On the Azure Monitor menu, go to **Workbooks** and select **Public Templates**. |

For instructions on how to create your own custom workbooks, see [Create interactive reports VM insights with workbooks](vminsights-workbooks.md).

:::image type="content" source="media/monitor-virtual-machines/workbook-example.png" alt-text="Screenshot that shows virtual machine workbooks." lightbox="media/monitor-virtual-machines/workbook-example.png":::

## Next steps

* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)
