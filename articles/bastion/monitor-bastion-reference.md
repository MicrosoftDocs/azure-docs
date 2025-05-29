---
title: Monitoring data reference for Azure Bastion
description: This article contains important reference material you need when you monitor Azure Bastion by using Azure Monitor.
ms.date: 12/02/2024
ms.custom: horz-monitor
ms.topic: reference
author: abell
ms.author: abell
ms.service: azure-bastion
---
# Azure Bastion monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Bastion](monitor-bastion.md) for details on the data you can collect for and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

> [!NOTE]
> We don't recommend that your use *Classic Metrics*.

### Supported metrics for microsoft.network/bastionHosts

The following table lists the metrics available for the microsoft.network/bastionHosts resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [microsoft.network/bastionHosts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-bastionhosts-metrics-include.md)]

> [!NOTE]
> The Bastion Communication Status metric only applies to Azure Bastion hosts deployed after November 2020.

### Metrics details

The following sections give details about the metrics in the preceding table.

#### Bastion communication status

You can view the communication status of Azure Bastion, aggregated across all instances comprising the bastion host.

- A value of **1** indicates that the bastion is available.
- A value of **0** indicates that the bastion service is unavailable.

:::image type="content" source="./media/metrics-monitor-alert/communication-status.png" alt-text="Screenshot that shows the communication status metric in the Azure portal.":::

Bastion communication status is an Availability metric.

#### Session count

You can view the count of active sessions per bastion instance, aggregated across each session type (RDP and SSH). Each Azure Bastion can support a range of active RDP and SSH sessions. Monitoring this metric helps you to understand if you need to adjust the number of instances running the bastion service. For more information about the session count Azure Bastion can support, see the [Azure Bastion FAQ](bastion-faq.md).

The recommended values for this metric's configuration are:

- **Aggregation:** Avg
- **Granularity:** 5 or 15 minutes
- Splitting by instances is recommended to get a more accurate count

:::image type="content" source="./media/metrics-monitor-alert/session-count.png" alt-text="Screenshot that shows the session count metric in the Azure portal.":::

Session count is a Traffic metric.

#### Total memory

You can view the total memory of Azure Bastion, split across each bastion instance.

:::image type="content" source="./media/metrics-monitor-alert/total-memory.png" alt-text="Screenshot that shows the total memory metric in the Azure portal.":::

Total memory is a Saturation metric.

#### CPU usage

You can view the CPU utilization of Azure Bastion, split across each bastion instance. Monitoring this metric helps gauge the availability and capacity of the instances that comprise Azure Bastion.

:::image type="content" source="./media/metrics-monitor-alert/used-cpu.png" alt-text="Screenshot that shows the CPU used metric in the Azure portal.":::

CPU usage is a Saturation metric.

#### Memory usage

You can view memory utilization across each bastion instance, split across each bastion instance. Monitoring this metric helps gauge the availability and capacity of the instances that comprise Azure Bastion.

:::image type="content" source="./media/metrics-monitor-alert/used-memory.png" alt-text="Screenshot that shows the memory used metric in the Azure portal.":::

Memory usage is a Saturation metric.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- cpu
- host

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for microsoft.network/bastionHosts

[!INCLUDE [microsoft.network/bastionHosts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-bastionhosts-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Bastion microsoft.network/bastionHosts

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [MicrosoftAzureBastionAuditLogs](/azure/azure-monitor/reference/tables/microsoftazurebastionauditlogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Networking resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure Bastion](monitor-bastion.md) for a description of monitoring Azure Bastion.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
