---
title: Monitoring data reference for Azure File Sync
description: This article contains important reference material you need when you monitor Azure File Sync by using Azure Monitor.
ms.date: 12/12/2024
ms.custom: horz-monitor
ms.topic: reference
author: khdownie
ms.author: kendownie
ms.service: azure-file-storage
---

# Azure File Sync monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure File Sync](file-sync-monitoring.md) for details on the data you can collect for Azure File Sync and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.StorageSync/storageSyncServices

The following table lists the metrics available for the Microsoft.StorageSync/storageSyncServices resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.StorageSync/storageSyncServices](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-storagesync-storagesyncservices-metrics-include.md)]

Metrics for Azure File Sync are enabled by default and are sent to Azure Monitor every 15 minutes.

To view Azure File Sync metrics in Azure Monitor:

1. Go to your **Storage Sync Service** in the **Azure portal** and select **Metrics**.
1. Select the **Metric** drop-down and select the metric you want to view.

:::image type="content" source="media/storage-sync-files-troubleshoot/file-sync-metrics.png" alt-text="Screenshot of Azure File Sync metrics in the Azure portal.":::

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- ApplicationName
- LastAccessTime
- ServerEndpointName
- ServerName
- SyncDirection
- SyncGroupName
- TieringReason

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.StorageSync resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftstorage)

## Related content

- See [Monitor Azure File Sync](file-sync-monitoring.md) for a description of monitoring Azure File Sync.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
