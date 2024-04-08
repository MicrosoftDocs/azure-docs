---
title: Monitoring data reference for Azure Data Share
description: This article contains important reference material you need when you monitor Azure Data Share.
ms.date: 02/28/2024
ms.custom: horz-monitor
ms.topic: reference
author: sidontha
ms.author: sidontha
ms.service: data-share
---

# Azure Data Share monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Data Share](monitor-data-share.md) for details on the data you can collect for Azure Data Share and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.DataShare/accounts
The following table lists the metrics available for the Microsoft.DataShare/accounts resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.DataShare/accounts](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-datashare-accounts-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- **Sent Shares:** ShareName
- **Received Shares:** ShareSubscriptionName

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.DataShare/accounts
[!INCLUDE [Microsoft.DataShare/accounts](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-datashare-accounts-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Data Share

Microsoft.DataShare/accounts

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [MicrosoftDataShareSentSnapshotLog](/azure/azure-monitor/reference/tables/MicrosoftDataShareSentSnapshotLog#columns)
- [MicrosoftDataShareReceivedSnapshotLog](/azure/azure-monitor/reference/tables/MicrosoftDataShareReceivedSnapshotLog#columns)
- [MicrosoftDataShareShareLog](/azure/azure-monitor/reference/tables/MicrosoftDataShareShareLog#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.DataShare resource provider operations](/azure/role-based-access-control/permissions/storage#microsoftdatashare)

## Related content

- See [Monitor Data Share](monitor-data-share.md) for a description of monitoring Data Share.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
