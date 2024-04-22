---
title: Project Flash - Use Azure Monitor to monitor Azure Virtual Machine availability
description: This article covers important concepts for monitoring Azure virtual machine availability using the Azure Monitor VM availability metric.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Use Azure Monitor to monitor Azure Virtual Machine availability

Azure Monitor is one solution offered by Flash. Flash is the internal name for a project dedicated to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health.

This article covers the use of the Azure Monitor VM availability metric to monitor Azure Virtual Machine availability. For a general overview of Flash solutions, see the [Flash overview](flash-overview.md).

For documentation specific to the other solutions offered by Flash, choose from the following articles:
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)

## Azure monitor - VM availability metric

Currently in public preview. It's well-suited for tracking trends, aggregating platform metrics (such as CPU and disk usage) and configuring precise threshold-based alerts. Customers can utilize this out-of-the-box [VM availability metric](../azure-monitor/platform/alerts-overview.md) in [Azure Monitor](../azure-monitor/platform/alerts-overview.md). This metric displays the trend of VM availability over time, so users can:

- Set up [threshold-based metric alerts](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric) on dipping VM availability to quickly trigger appropriate mitigation actions.
- Correlate the VM availability metric with existing [platform metrics](../azure-monitor/essentials/data-platform-metrics.md) like memory, network, or disk for deeper insights into concerning changes that impact the overall performance of workloads.
- Easily interact with and chart metric data during any relevant time window on [Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md), for quick and easy debugging.
- Route metrics to downstream tooling like [Grafana dashboards](../azure-monitor/visualize/grafana-plugin.md), for constructing custom visualizations and dashboards.

### Get started

Users can either consume the metric programmatically via the [Azure Monitor REST API](/rest/api/monitor/metrics) or directly from the [Azure portal](https://portal.azure.com/). The following steps highlight metric consumption from the Azure portal.

Once on the Azure portal, navigate to the VM overview blade. The new metric is displayed as VM Availability (Preview), along with other platform metrics under the Monitoring tab.

   :::image type="content" source="media/flash/virtual-machine-availability-metric.png" alt-text="Screenshot of virtual machine availability metric on a virtual machine's overview page on the Azure portal." lightbox="media/flash/virtual-machine-availability-metric.png" :::

Select (single click) the VM availability metric chart on the overview page, to navigate to [Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) for further analysis.
Select the VM availability metric chart on the overview page, to navigate to [Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) for further analysis.

   :::image type="content" source="media/flash/metrics-explorer-virtual-machine-availability.png" alt-text="Screenshot of the newly added VM availability Metric on Metrics Explorer on Azure portal." lightbox="media/flash/metrics-explorer-virtual-machine-availability.png" :::

### Metric description

| **Display Name** | **VM Availability (preview)** |
| --- | --- |
| Metric Values | 1 during expected behavior; corresponds to VM in Available state. 0 when VM is impacted by rebootful disruptions; corresponds to VM in Unavailable state. NULL (shows a dotted or dashed line on charts) when the Azure service that is emitting the metric is down or is unaware of the exact status of the VM; corresponds to VM in Unknown state. |
| Aggregation | The default aggregation of the metric is Average, for prioritized investigations based on extent of downtime incurred. The other aggregations available are: Min, to immediately pinpoint to all the times where VM was unavailable. Max, to immediately pinpoint to all the instances where VM was Available. For more information on chart range, granularity, and data aggregation, see [Azure Monitor Metrics aggregation and display explained](../azure-monitor/essentials/metrics-aggregation-explained.md). |
| Data Retention | Data for the VM availability metric is [stored for 93 days](../azure-monitor/essentials/data-platform-metrics.md#retention-of-metrics) to help trend analysis and historical lookback. |
| Pricing | Refer to the [Pricing breakdown](https://azure.microsoft.com/pricing/details/monitor/#pricing), specifically in the "Metrics" and "Alert Rules" sections. |

We plan to include impact details (user vs platform initiated, planned vs unplanned) as dimensions to the metric, so users are well equipped to interpret dips, and set up much more targeted metric alerts. With the emission of dimensions in 2023, we also anticipate transitioning the offering to a general availability status.

### Useful links

- [How to filter events for Azure Event Grid - Azure Event Grid | Microsoft Learn](../event-grid/how-to-filter-events.md)
- [Event filtering for Azure Event Grid - Azure Event Grid | Microsoft Learn](../event-grid/event-filtering.md#advanced-filtering)

## Next steps

To learn more about the solutions offered, proceed to corresponding solution article:
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)

For a general overview of how to monitor Azure Virtual Machines, see [Monitor Azure virtual machines](monitor-vm.md) and the [Monitoring Azure virtual machines reference](monitor-vm-reference.md).
