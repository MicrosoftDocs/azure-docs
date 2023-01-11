---
title: 'Monitor virtual machines with Azure Monitor: Collect data'
description: Learn how to configure data collection for virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with an Azure Monitor guide.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/05/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Collect data
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure data collection once you've deployed agents to your Azure and hybrid virtual machines in Azure Monitor.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).


## Data collection rules
Data collection from the Azure Monitor agent is defined by one or more [data collection rules (DCR)](../essentials/data-collection-rule-overview.md) that are stored in your Azure subscription and are associated with your virtual machines. 

For virtual machines, DCRs will define data such as events and performance counters to collect and specify the Log Analytics workspaces that data should be sent to. The DCR can also use [transformations](../essentials/data-collection-transformations.md) to filter out unwanted data and to add calculated columns. A single machine can be associated with multiple DCRs, and a single DCR can be associated with multiple machines. DCRs are delivered to any machines they're associated with where they're processed by the Azure Monitor agent.

### View data collection rules
You can view the DCRs in your Azure subscription from **Data Collection Rules** in the **Monitor** menu in the Azure portal. DCRs support other data collection scenarios in Azure Monitor, so all of your DCRs won't necessarily be for virtual machines.

### Create data collection rules
There are multiple methods to create data collection rules depending on the data collection scenario. In some cases, the Azure portal will walk you through the configuration while other scenarios will require you to edit the DCR directly. When you configure VM insights, it will create a preconfigured DCR for you automatically. The sections below identify common data to collect and how to configure the data collection.

In some cases, you may need to [edit an existing DCR](../essentials/data-collection-rule-edit.md) to add functionality. For example, you may use the Azure portal to create a DCR that collects Windows or Syslog events. You then want to add a transformation to that DCR to filter out columns in the events that you don't want to collect. 

As your environment matures and grows in complexity, you should implement a strategy for organizing your DCRs to assist in their management. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for guidance on different strategies.

## Controlling costs
Since your Azure Monitor cost is dependent on how much data you collect, you should ensure that you're not collecting any more than you need to meet your monitoring requirements. Your configuration will be a balance between your budget and how much insight you want into the operation of your virtual machines.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

A typical virtual machine will generate between 1GB and 3GB of data per month, but this data size is highly dependent on the configuration of the machine itself, the workloads running on it, and the configuration of your data collection rules. Before you configure data collection across your entire virtual machine environment, you should begin collection on some representative machines to better predict your expected costs when deployed across your environment. Use log queries in [Data volume by computer](../logs/analyze-usage.md#data-volume-by-computer) to determine the amount of billable data collected for each machine and adjust accordingly.

Each data source that you collect may have a different method for filtering out unwanted data. You can also use [transformations](../essentials/data-collection-transformations.md) to implement more granular filtering and also to filter data from columns that provide little value. For example, you might have a Windows event that's valuable for alerting, but it includes columns with redundant or excessive data. You can create a transformation that allows the event to be collected but removes this excessive data.



## Default data collection
Azure Monitor will automatically perform the following data collection without requiring any additional configuration.

### Platform metrics
Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization. They can be viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience), analyzed with [metrics explorer](../essentials/tutorial-metrics.md) for the machine in the Azure portal and used for [metric alerts](tutorial-monitor-vm-alert-recommended.md).

### Activity log
The [Activity log](../essentials/activity-log.md) is collected automatically and includes the recent activity of the machine, such as any configuration changes and when it was stopped and started. You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal.

You can [view the Activity log](../essentials/activity-log.md#view-the-activity-log) for an individual machine or for all resources in a subscription. You should [create a diagnostic setting](../essentials/diagnostic-settings.md) to send this data into the same Log Analytics workspace used by your Azure Monitor agent to analyze it with the other monitoring data collected for the virtual machine. There's no cost for ingestion or retention of Activity log data.

### VM insights
By default, [VM insights](../vm/vminsights-overview.md) will not enable collection of processes and dependencies to save data ingestion costs. This data is required for the map feature and will also deploy the dependency agent to the machine. [Enable this collection](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent) if you want to use this feature.

When you enable VM insights, then it will create a data collection rule, with the **_MSVMI-_** prefix that collects the following:

- Common performance counters for the client operating system are sent to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table in the Log Analytics workspace. Counter names will be normalize to use the same common name regardless of the operating system type.
- If you specified processes and dependencies to be collected, then the following tables are populated:
  
  - [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) - Traffic for open server ports on the machine
  - [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) - Inventory data for the machine
  - [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) - Traffic for inbound and outbound connections to and from the machine
  - [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) - Processes running on the machine

A previously created data collection rule, can be used when enabling additional virtual machines, without being forced to create a new one for each VM.




## Collect Windows and Syslog events
The operating system and applications in virtual machines will often write to the Windows Event Log or Syslog. You may create an alert as soon as a single event is found or wait for a series of matching events within a particular time window. You may also collect events for later analysis such as identifying particular trends over time, or for performing troubleshooting after a problem occurs.

See [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) for guidance on creating a DCR to collect Windows and Syslog events. This will allow you to quickly create a DCR using the most common Windows event logs and Syslog facilities filtering by event level. For more granular filtering by criteria such as event ID, you can create a custom filter using [XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries). 

Use the following guidance as a recommended starting point for event collection. Modify the DCR settings to filter unneeded events and add additional events depending on your requirements.


| Source | Strategy |
|:---|:---|
| Windows events | Collect at least **Critical**, **Error**, and **Warning** events for the **System** and **Application** logs to support alerting. Add **Information** events to analyze trends and support troubleshooting. **Verbose** events will rarely be useful and typically shouldn't be collected. |
| Syslog events | Collect at least **LOG_WARNING** events for each facility to support alerting. Add **Information** events to analyze trends and support troubleshooting. **LOG_DEBUG** events will rarely be useful and typically shouldn't be collected. |


### Sample log queries - Windows events

| Query | Description |
|:---|:---|
| `Event` | All Windows events. |
| `Event | where EventLevelName == "Error"` |All Windows events with severity of error. |
| `Event | summarize count() by Source` |Count of Windows events by source. |
| `Event | where EventLevelName == "Error" | summarize count() by Source` |Count of Windows error events by source. |

### Sample log queries - Syslog events

| Query | Description |
|:--- |:--- |
| `Syslog` |All Syslogs |
| `Syslog | where SeverityLevel == "error"` |All Syslog records with severity of error |
| `Syslog | summarize AggregatedValue = count() by Computer` |Count of Syslog records by computer |
| `Syslog | summarize AggregatedValue = count() by Facility` |Count of Syslog records by facility |


##  Collect performance counters
Performance data from the client can be sent to either [Azure Monitor Metrics](../essentials/data-platform-metrics.md) or [Azure Monitor Logs](../logs/data-platform-logs.md), and you'll typically send them to both destinations. If you enabled VM insights, then a common set of performance counters is collected in a Log Analytics workspace to support its performance charts. You can't modify this set of counters, but you can create additional DCRs to collect additional counters and send them to different destinations.

There are multiple reasons why you would want to create a DCR to collect guest performance:

- You aren't using VM insights, so client performance data isn't already being collected.
- Collect additional performance counters that aren't being collected by VM insights.
- Collect performance counters from other workloads running on your client.
- Send performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) where you can use them with metrics explorer and metrics alerts.

See [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) for guidance on creating a DCR to collect performance counters. This will allow you to quickly create a DCR using the most common counters. For more granular filtering by criteria such as event ID, you can create a custom filter using [XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries). 



| Destination | Namespace/Table | Description |
|:---|:---|:---|
| Metrics | Host - *Virtual Machine Host*<br>Windows client - *Virtual Machine Guest*<br>Linux client - *azure.vm.linux.guestmetrics* | Host metrics are automatically sent to Azure Monitor Metrics, and you can use a DCR to collect client metrics so they can be analyzed together with [metrics explorer](../essentials/metrics-getting-started.md) or used with [metrics alerts](../alerts/alerts-create-new-alert-rule.md?tabs=metric). This data is stored for 93 days. |
| Logs | VM insights - [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics)<br>Other performance data - [Perf](/azure/azure-monitor/reference/tables/perf) | Performance data stored in Azure Monitor Logs can be stored for extended periods and can be analyzed along with your event data using [log queries](../logs/log-query-overview.md) with [Log Analytics](../logs/log-analytics-overview.md) or [log query alerts](../alerts/alerts-create-new-alert-rule.md?tabs=log). You can also corelate data using complex logic across multiple machines, regions, and subscriptions. |

### Sample log queries
The following samples use the `Perf` table with custom performance data. For details on performance data collected by VM insights, see [How to query logs from VM insights](../vm/vminsights-log-query.md#performance-records).

| Query | Description |
|:--- |:---|
| `Perf` | All Performance data |
| `Perf | where Computer == "MyComputer"` |All Performance data from a particular computer |
| `Perf | where CounterName == "Current Disk Queue Length"` |All Performance data for a particular counter |
| `Perf | where ObjectName == "Processor" and CounterName == "% Processor Time" and InstanceName == "_Total" | summarize AVGCPU = avg(CounterValue) by Computer` |Average CPU Utilization across all computers |
| `Perf  | where CounterName == "% Processor Time" | summarize AggregatedValue = max(CounterValue) by Computer` |Maximum CPU Utilization across all computers |
| `Perf | where ObjectName == "LogicalDisk" and CounterName == "Current Disk Queue Length" and Computer == "MyComputerName" | summarize AggregatedValue = avg(CounterValue) by InstanceName` |Average Current Disk Queue length across all  the instances of a given computer |
| `Perf | where CounterName == "Disk Transfers/sec" | summarize AggregatedValue = percentile(CounterValue, 95) by Computer` |95th Percentile of Disk Transfers/Sec across all computers |
| `Perf | where CounterName == "% Processor Time" and InstanceName == "_Total" | summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 1h), Computer` |Hourly average of CPU usage across all computers |
| `Perf | where Computer == "MyComputer" and CounterName startswith_cs "%" and InstanceName == "_Total" | summarize AggregatedValue = percentile(CounterValue, 70) by bin(TimeGenerated, 1h), CounterName` | Hourly 70 percentile of every % percent counter for a particular computer |
| `Perf | where CounterName == "% Processor Time" and InstanceName == "_Total" and Computer == "MyComputer" | summarize ["min(CounterValue)"] = min(CounterValue), ["avg(CounterValue)"] = avg(CounterValue), ["percentile75(CounterValue)"] = percentile(CounterValue, 75), ["max(CounterValue)"] = max(CounterValue) by bin(TimeGenerated, 1h), Computer` |Hourly average, minimum, maximum, and 75-percentile CPU usage for a specific computer |
| `Perf | where ObjectName == "MSSQL$INST2:Databases" and InstanceName == "master"` | All Performance data from the Database performance object for the master database from the named SQL Server instance INST2. | 

## Collect text logs
Some applications write events written to a text log stored on the virtual machine. Create a [custom table and DCR](../agents/data-collection-text-log.md) to collect this data. You define the location of the text log, its detailed , and the schema of the custom table. There's a cost for the ingestion and retention of this data in the workspace.

### Sample log queries
The column names used here are for example only. The column names for your log will most likely be different.

| Query | Description |
|:--- |:--- |
| `MyApp_CL | summarize count() by code` | Count the number of events by code. |
| `MyApp_CL | where status == "Error" | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)` | Create an alert rule on any error event. |
    



## Collect IIS logs
IIS running on Windows machines writes logs to a text file. Configure IIS log collection using [Collect IIS logs with Azure Monitor Agent](../agents/data-collection-iis.md). There's a cost for the ingestion and retention of this data in the workspace. Records from the IIS log are stored in the [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) table in the Log Analytics workspace. There's a cost for the ingestion and retention of this data in the workspace.

### Sample log queries


| Query | Description |
|:--- |:--- |
| `W3CIISLog | where csHost=="www.contoso.com" | summarize count() by csUriStem` | Count the IIS log entries by URL for the host www.contoso.com. |
| `W3CIISLog | summarize sum(csBytes) by Computer` | Review the total bytes received by each IIS machine. |



## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)

