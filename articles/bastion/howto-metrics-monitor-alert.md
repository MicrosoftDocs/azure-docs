---
title: 'Configure monitoring and metrics using Azure Monitor'
titleSuffix: Azure Bastion
description: Learn about Azure Bastion monitoring and metrics using Azure Monitor.
services: bastion
author: mialdrid

ms.service: bastion
ms.topic: how-to
ms.date: 03/12/2021
ms.author: mialdrid

---
# How to configure monitoring and metrics for Azure Bastion using Azure Monitor

This article helps you work with monitoring and metrics for Azure Bastion using Azure Monitor.

>[!NOTE]
>Using **Classic Metrics** is not recommended.
>

## About metrics

Azure Bastion has various metrics that are available. The following table shows the category and dimensions for each available metric.

|**Metric**|**Category**|**Dimension(s)**|
| --- | --- | --- |
|Bastion communication status**|[Availability](#availability)|N/A|
|Total memory|[Availability](#availability)|Instance|
|Used CPU|[Traffic](#traffic)|Instance
|Used memory|[Traffic](#traffic)|Instance
|Session count|[Performance](#performance)|Instance|

** Bastion communication status is only applicable for bastion hosts deployed after November 2020.

### <a name="availability"></a>Availability metrics

#### <a name="communication-status"></a>Bastion communication status

You can view the communication status of Azure Bastion, aggregated across all instances comprising the bastion host.

* A value of **1** indicates that the bastion is available.
* A value of **0** indicates that the bastion service is unavailable.

:::image type="content" source="./media/metrics-monitor-alert/communication-status.png" alt-text="Screenshot showing communication status.":::

#### <a name="total-memory"></a>Total memory

You can view the total memory of Azure Bastion, split across each bastion instance.

:::image type="content" source="./media/metrics-monitor-alert/total-memory.png" alt-text="Screenshot showing total memory.":::

### <a name="traffic"></a>Traffic metrics

#### <a name="used-cpu"></a>Used CPU

You can view the CPU utilization of Azure Bastion, split across each bastion instance. Monitoring this metric will help gauge the availability and capacity of the instances that comprise Azure Bastion

:::image type="content" source="./media/metrics-monitor-alert/used-cpu.png" alt-text="Screenshot showing CPU used.":::

#### <a name="used-memory"></a>Used memory

You can view memory utilization across each bastion instance, split across each bastion instance. Monitoring this metric will help gauge the availability and capacity of the instances that comprise Azure Bastion.

:::image type="content" source="./media/metrics-monitor-alert/used-memory.png" alt-text="Screenshot showing memory used.":::

### <a name="performance"></a>Performance metrics

#### Session count

You can view the count of active sessions per bastion instance, aggregated across each session type (RDP and SSH). Each Azure Bastion can support a range of active RDP and SSH sessions. Monitoring this metric will help you to understand if you need to adjust the number of instances running the bastion service. For more information about the session count Azure Bastion can support, refer to the [Azure Bastion FAQ](bastion-faq.md).

The recommended values for this metric's configuration are:

* **Aggregation:** Avg
* **Granularity:** 5 or 15 minutes
* Splitting by instances is recommended to get a more accurate count

:::image type="content" source="./media/metrics-monitor-alert/session-count.png" alt-text="Screenshot showing session count.":::

## <a name="metrics"></a>How to view metrics

1. To view metrics, go to your bastion host.
1. From the **Monitoring** list, select **Metrics**.
1. Select the parameters. If no metrics are set, click **Add metric**, and then select the parameters.

   * **Scope:** By default, the scope is set to the bastion host.
   * **Metric Namespace:** Standard Metrics.
   * **Metric:** Select the metric that you want to view.

1. Once a metric is selected, the default aggregation will be applied. Optionally, you can apply splitting, which will show the metric with different dimensions.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
  
