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
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to configure data collection once you've deployed agents to your Azure and hybrid virtual machines in Azure Monitor.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).


## Data collection rules
Data collection from the Azure Monitor agent is defined by one or more [data collection rules (DCR)](../essentials/data-collection-rule-overview.md) that are stored in your Azure subscription and are associated with your virtual machines. 

For virtual machines, DCRs will define data such as events and performance counters to collect and specify the Log Analytics workspaces that data should be sent to. The DCR can also apply transformations to the data to filter out unwanted data and to add calculated properties. A single machine can be associated with multiple DCRs, and a single DCR can be associated with multiple machines. DCRs are delivered to any machines they're associated with where they're processed by the Azure Monitor agent.

You can view the DCRs in your Azure subscription from **Data Collection Rules** in the **Monitor** menu in the Azure portal. DCRs support other data collection scenarios in Azure Monitor, so all of your DCRs won't necessarily be for virtual machines.

You should implement a strategy for configuring your DCRs so that they're manageable as your monitoring environment grows in complexity. See [Best practices for data collection rule creation and management in Azure Monitor](data-collection-rule-vm-strategy.md) for guidance on different strategies.

## Default data collection
Azure Monitor provides a basic level of monitoring for Azure virtual machines with little or no configuration.

### Platform metrics
Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization. They can be viewed on the [Overview page](monitor-virtual-machine-analyze.md#single-machine-experience), analyzed with [metrics explorer](../essentials/tutorial-metrics.md) for the machine in the Azure portal and used for [metric alerts](tutorial-monitor-vm-alert-recommended.md).

### Activity log
The [Activity log](../essentials/activity-log.md) is collected automatically and includes the recent activity of the machine, such as any configuration changes and when it was stopped and started. You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal.

You can [view the Activity log](../essentials/activity-log.md#view-the-activity-log) for an individual machine or for all resources in a subscription. You should create a diagnostic setting to send this data into the same Log Analytics workspace used by your Azure Monitor agent to analyze it with the other monitoring data collected for the virtual machine. There's no cost for ingestion or retention of Activity log data. See [Create diagnostic settings](../essentials/diagnostic-settings.md).

### VM insights
By default, [VM insights](../vm/vminsights-overview.md) will not enable collection of processes and dependencies to save data ingestion costs. This data is required for the map feature and will also deploy the dependency agent to the machine. [Enable this collection](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent) if you want to use this feature.

When you enable VM insights, then it will create a data collection rule, with the **_MSVMI-_** prefix that collects the following:

- Common performance counters for the client operating system are sent to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table in the Log Analytics workspace. Counter names will be normalize to use the same common name regardless of the operating system.
- If you specified processes and dependencies to be collected, then the following tables are populated:
  
  - [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) - Traffic for open server ports on the machine
  - [VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) - Inventory data for the machine
  - [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) - Traffic for inbound and outbound connections to and from the machine
  - [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) - Processes running on the machine

A previously created data collection rule, can be targeted when enabling additional virtual machines, without being forced to create a new one for each VM.

## Controlling costs
Since your Azure Monitor cost is dependent on how much data you collect, you should ensure that you're not collecting any more than you need to meet your monitoring requirements. Your configuration will be a balance between your budget and how much insight you want into the operation of your virtual machines.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

A typical virtual machine will generate between 1GB and 3GB of data per month, but this data size is highly dependent on the configuration of the machine itself, the workloads running on it, and the configuration of your data collection rules. Before you configure data collection across your entire virtual machine environment, you should begin collection on some representative machines to better predict your expected costs when deployed across your environment. Use log queries in [Data volume by computer](../logs/analyze-usage.md#data-volume-by-computer) to determine the amount of billable data collected for each machine. 

Each data source that you collect may have a different method for filtering out unwanted data. You can also use transformations to implement more granular filtering and also to filter data from columns that provide little value. For example, you might have a Windows event that's valuable for alerting, but it includes columns with redundant or excessive data. You can create a transformation that allows the event to be collected but removes this excessive data.


## Windows and Syslog events
The operating system and applications in virtual machines will often write to the Windows Event Log or Syslog. You may create an alert as soon as a single event is found or wait for a series of matching events within a particular time window. You may also collect events for later analysis such as identifying particular trends over time, or for performing troubleshooting after a problem occurs.

See [Collect data from standard sources](../agents/data-collection-rule-azure-monitor-agent.md) for guidance on creating a DCR to collect Windows and Syslog events. This will allow you to quickly create a DCR using the most common Windows event logs and Syslog facilities filtering by event level. For more granular filtering by criteria such as event ID, you can create a custom filter using [XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries).

Use the following guidance as a recommended starting point for event collection. Modify the DCR settings to filter unneeded events and add additional events depending on your requirements.


| Source | Strategy |
|:---|:---|
| Windows events | Collect at least **Critical**, **Error**, and **Warning** events for the **System** and **Application** logs to support alerting. Add **Information** events to analyze trends and support troubleshooting. **Verbose** events will rarely be useful and typically shouldn't be collected. |
| Syslog events | Collect at least **LOG_WARNING** events for \<which facilities\> to support alerting. Add **Information** events to analyze trends and support troubleshooting. **LOG_DEBUG** events will rarely be useful and typically shouldn't be collected. |



## Performance counters
Performance data from the client can be sent to either [Azure Monitor Metrics](../essentials/data-platform-metrics.md) or [Azure Monitor Logs](../logs/data-platform-logs.md), and you'll typically send them to both destinations. If you enabled VM insights, then a common set of performance counters is collected in a Log Analytics workspace to support its performance charts. You can't modify this set of counters, but you can create additional DCRs to collect additional counters and send them to different destinations.

There are multiple reasons why you would want to create a DCR to collect guest performance:

- You aren't using VM insights so client performance data is being collected.
- Collect additional performance counters that aren't being collected by VM insights.
- Collect performance counters from other workloads running on your client.
- Send performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) where you can use them with metrics explorer and metrics alerts.


### Send to Metrics
Host metrics are automatically sent to Azure Monitor Metrics, and you can use a DCR to collect client metrics so they can be analyzed together. This data is stored for 93 days.

Client metrics are stored in a separate namespace as shown in the following table.

| Metrics | Namespace |
|:---|:---|
| Host | Virtual Machine Host |
| Windows client | Virtual Machine Guest |
| Linux client | azure.vm.linux.guestmetrics |


### Send to Logs
Performance data stored in Azure Monitor Logs can be stored for extended periods and can be analyzed along with your event data using log queries with Log Analytics or log alerts. You can also corelate data using complex logic across multiple machines, regions, and subscriptions.

Performance data collected by a DCR that you create is stored in the [Perf](/azure/azure-monitor/reference/tables/perf) table. This table has a different structure than the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table used by VM insights.


## Configure additional data collection
Create additional DCRs to collect other telemetry such as Windows and Syslog events and to send performance data to Azure Monitor Metrics. See the following for guidance on creating DCRs to collect different types of data. For a list of the data sources available and details on how to configure them, see [Agent data sources in Azure Monitor](../agents/agent-data-sources.md).

- [IISlogs](../agents/data-collection-iis.md)
- [Text logs](../agents/data-collection-text-log.md)
- [SNMP traps](../agents/data-collection-snmp-data.md)


## Text logs
Some applications write events written to a text log stored on the virtual machine. Create a [custom table and DCR](../agents/data-collection-text-log.md) to collect this data. You define the location of the text log, its detailed , and the schema of the custom tbale. There's a cost for the ingestion and retention of this data in the workspace.

## IIS logs
IIS running on Windows machines writes logs to a text file. Configure IIS log collection using [Collect IIS logs with Azure Monitor Agent](../agents/data-collection-iis.md). There's a cost for the ingestion and retention of this data in the workspace.

Records from the IIS log are stored in the [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) table in the Log Analytics workspace.


## Transformations
Use [transformations](../essentials/data-collection-transformations.md) to filter and modify data that you collect from your virtual machines to minimize your cost and increase the richness of your data. You should first filter data using xpath queries as described in [Filter events using XPath queries]()../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries). Use transformations where you need more complex logic to filter records or to remove data from columns that you don't need. 

The following table lists the different data sources on a VM and how to filter the data they collect.

> [!NOTE]
> Azure tables here refers to tables that are created and maintained by Microsoft and documented in the [Azure Monitor reference](/azure/azure-monitor/reference/). Custom tables are created by custom applications and have a suffix of _CL in their name.

| Target | Description | Filtering method |
|:---|:---|:---|
| Azure tables | [Collect data from standard sources](../agents/data-collection-rule-azure-monitor-agent.md) such as Windows events, Syslog, and performance data and send to Azure tables in Log Analytics workspace. | Use [XPath in the data collection rule (DCR)](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries) to collect specific data from client machines.<br><br>Use transformations to further filter specific events or remove unnecessary columns. |
| Custom tables | [Create a data collection rule](../agents/data-collection-text-log.md) to collect file-base text logs from the agent. | Add a [transformation](../essentials/data-collection-transformations.md) to the data collection rule. |

## DCR strategy
A common set of DCRs may not be sufficient for your entire environment, but you may have unique monitoring requirements for different sets of machines. As your monitoring environment grows, you should establish a strategy for structuring your DCRs. See [Best practices for data collection rule creation and management in Azure Monitor](../essentials/data-collection-rule-best-practices.md) for guidance on how to structure and manage your DCRs.


## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines](monitor-virtual-machine-workloads.md)

