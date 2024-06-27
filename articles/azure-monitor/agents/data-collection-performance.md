---
title: Collect performance counters with Azure Monitor Agent
description: Describes how to erformance counters from virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 7/19/2023
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect performance counters with Azure Monitor Agent
Performance counters provide insight into the performance of hardware components, operating systems, and applications. [Azure Monitor Agent](azure-monitor-agent-overview.md) can collect performance counters from Windows and Linux machines at frequent intervals for near real time analysis.

Performance counters is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the Windows events data source type.

## Prerequisites

- If you are going to send performance data to a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md), then you must have one created where you have at least [contributor rights](../logs/manage-access.md#azure-rbac)..
- Either a new or existing DCR described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Configure performance counters data source 

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **Performance Counters** from the **Data source type** dropdown. 

For performance counters, select from a predefined set of objects and their sampling rate. 
    
:::image type="content" source="media/data-collection-performance/data-source-performance.png" lightbox="media/data-collection-performance/data-source-performance.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

Select **Custom** to collect logs and performance counters that aren't [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values.

:::image type="content" source="media/data-collection-performance/data-source-performance-custom.png" lightbox="media/data-collection-rule-performance/data-source-performance-custom.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::

To collect a performance counter that's not available by default, use the format `\PerfObject(ParentInstance/ObjectInstance#InstanceIndex)\Counter`. If the counter name contains an ampersand (&), replace it with `&amp;`. For example, `\Memory\Free &amp; Zero Page List Bytes`.
   
   
> [!NOTE] 
> At this time, Microsoft.HybridCompute ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md)) resources can't be viewed in [Metrics Explorer](../essentials/metrics-getting-started.md) (the Azure portal UX), but they can be acquired via the Metrics REST API (Metric Namespaces - List, Metric Definitions - List, and Metrics - List).

## Destinations

Performance counters data can be sent to the following locations.

- **Azure Monitor Logs**. Data is sent to the [Perf](/azure/azure-monitor/reference/tables/perf) table table in your Log Analytics workspace.
- **Azure Monitor Metrics**. Data is sent to the following metric namespaces:
    | Destination | Table / Namespace |
    |:---|:---|
    | Log Analytics workspace | [Perf](/azure/azure-monitor/reference/tables/perf) |
    | Azure Monitor Metrics | Windows: Virtual Machine Guest<br>Linux: azure.vm.linux.guestmetrics
    

:::image type="content" source="media/data-collection-performance/destination-metrics.png" lightbox="media/data-collection-performance/destination-metrics.png" alt-text="Screenshot that shows configuration of an Azure Monitor Logs destination in a data collection rule." border="false":::

## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
