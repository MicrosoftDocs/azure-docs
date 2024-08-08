---
title: Collect performance counters with Azure Monitor Agent
description: Describes how to collect performance counters from virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 07/12/2024
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect performance counters with Azure Monitor Agent

**Performance counters** is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides more details for the Windows events data source type.

Performance counters provide insight into the performance of hardware components, operating systems, and applications. [Azure Monitor Agent](azure-monitor-agent-overview.md) can collect performance counters from Windows and Linux machines at frequent intervals for near real time analysis.

## Prerequisites

* If you're going to send performance data to a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md), then you must have one created where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
* Either a new or existing DCR described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Configure performance counters data source

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **Performance Counters** from the **Data source type** dropdown. 

For performance counters, select from a predefined set of objects and their sampling rate. 
    
:::image type="content" source="media/data-collection-performance/data-source-performance.png" lightbox="media/data-collection-performance/data-source-performance.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

Select **Custom** to specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any performance counters not available by default. Use the format `\PerfObject(ParentInstance/ObjectInstance#InstanceIndex)\Counter`. If the counter name contains an ampersand (&), replace it with `&amp;`. For example, `\Memory\Free &amp; Zero Page List Bytes`. You can view the default counters for examples.

:::image type="content" source="media/data-collection-performance/data-source-performance-custom.png" lightbox="media/data-collection-performance/data-source-performance-custom.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::
   
> [!NOTE] 
> At this time, Microsoft.HybridCompute ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md)) resources can't be viewed in [Metrics Explorer](../essentials/metrics-getting-started.md) (the Azure portal UX), but they can be acquired via the Metrics REST API (Metric Namespaces - List, Metric Definitions - List, and Metrics - List).

## Destinations

Performance counters data can be sent to the following locations.

| Destination             | Table / Namespace                                                    |
|:------------------------|:---------------------------------------------------------------------|
| Log Analytics workspace | Perf (see [Azure Monitor Logs reference](/azure/azure-monitor/reference/tables/perf#columns)) |
| Azure Monitor Metrics   | Windows: Virtual Machine Guest<br>Linux: azure.vm.linux.guestmetrics |
    
> [!NOTE]
> On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.

:::image type="content" source="media/data-collection-performance/destination-metrics.png" lightbox="media/data-collection-performance/destination-metrics.png" alt-text="Screenshot that shows configuration of an Azure Monitor Logs destination in a data collection rule.":::

## Log queries with performance records

The following table provides different examples of log queries that retrieve performance records.

| Query                                                        | Description                                     |
|:-------------------------------------------------------------|:------------------------------------------------|
| Perf                                                         | All performance data                            |
| Perf &#124; where Computer == "MyComputer"                   | All performance data from a particular computer |
| Perf &#124; where CounterName == "Current Disk Queue Length" | All performance data for a particular counter   |

<br>
<details>
<summary>Expand for more sample queries</summary>

| Query | Description |
|:------|:------------|
| Perf &#124; where ObjectName == "Processor" and CounterName == "% Processor Time" and InstanceName == "_Total" &#124; summarize AVGCPU = avg(CounterValue) by Computer |Average CPU utilization across all computers |
| Perf &#124; where CounterName == "% Processor Time" &#124; summarize AggregatedValue = max(CounterValue) by Computer |Maximum CPU utilization across all computers |
| Perf &#124; where ObjectName == "LogicalDisk" and CounterName == "Current Disk Queue Length" and Computer == "MyComputerName" &#124; summarize AggregatedValue = avg(CounterValue) by InstanceName |Average current disk queue length across all the instances of a given computer |
| Perf &#124; where CounterName == "Disk Transfers/sec" &#124; summarize AggregatedValue = percentile(CounterValue, 95) by Computer |95th percentile of disk transfers/sec across all computers |
| Perf &#124; where CounterName == "% Processor Time" and InstanceName == "_Total" &#124; summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 1h), Computer |Hourly average of CPU usage across all computers |
| Perf &#124; where Computer == "MyComputer" and CounterName startswith_cs "%" and InstanceName == "_Total" &#124; summarize AggregatedValue = percentile(CounterValue, 70) by bin(TimeGenerated, 1h), CounterName | Hourly 70th percentile of every percent counter for a particular computer |
| Perf &#124; where CounterName == "% Processor Time" and InstanceName == "_Total" and Computer == "MyComputer" &#124; summarize ["min(CounterValue)"] = min(CounterValue), ["avg(CounterValue)"] = avg(CounterValue), ["percentile75(CounterValue)"] = percentile(CounterValue, 75), ["max(CounterValue)"] = max(CounterValue) by bin(TimeGenerated, 1h), Computer |Hourly average, minimum, maximum, and 75-percentile CPU usage for a specific computer |
| Perf &#124; where ObjectName == "MSSQL$INST2:Databases" and InstanceName == "master" | All performance data from the database performance object for the master database from the named SQL Server instance INST2 |

</details>

Additional samples queries are available at [Queries for the Perf table](/azure/azure-monitor/reference/queries/perf).

## Next steps

* [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
* Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
* Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
