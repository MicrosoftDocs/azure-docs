---
title: View metrics with Azure Monitor
description: This article shows how to monitor metrics with the Azure portal charts and Azure CLI.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 03/17/2021
ms.author: inhenkel 
ms.custom: devx-track-azurecli
---

# Monitor Media Services metrics

[!INCLUDE [media services api v3 logo](../includes/v3-hr.md)]

[Azure Monitor](../../../azure-monitor/overview.md) enables you to monitor metrics and diagnostic logs that help you understand how your applications are performing. For a detailed description of this feature and to understand why you should use Azure Media Services metrics and diagnostics logs, see [Monitor Media Services metrics and diagnostic logs](monitor-media-services-data-reference.md).

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using Azure CLI. This article shows how to monitor metrics with the Azure portal charts and Azure CLI.

## Prerequisites

- [Create a Media Services account](../account-create-how-to.md)
- Review  [Monitor Media Services metrics and diagnostic logs](monitor-media-services-data-reference.md)

## View metrics in Azure portal

1. Sign in to the Azure portal at https://portal.azure.com.
1. Navigate to your Azure Media Services account and select **Metrics**.
1. Click the **Scope** box and select the resource you want to monitor.

    The **Select a scope** window appears on the right with the list of resources available to you. In this case you see:

    * &lt;Media Services account name&gt;
    * &lt;Media Services account name&gt;/&lt;streaming endpoint name&gt;
    * &lt;storage account name&gt;

    Filter then select the resource and press **Apply**. For details about supported resources and metrics, see [Monitor Media Services metrics](monitor-media-services-data-reference.md).

    > [!NOTE]
    > To switch between resources you want to monitor, click on the **Source** box again and repeat this step.

1. Optional: give your chart a name (edit the name by pressing the pencil at the top).
1. Add the metrics that you want to view.
1. You can pin your chart to your dashboard.

## View metrics with Azure CLI

To get "Egress" metrics with Azure CLI, you would run the following `az monitor metrics` command:

```azurecli-interactive
az monitor metrics list --resource \
   "/subscriptions/<subscription id>/resourcegroups/<resource group name>/providers/Microsoft.Media/mediaservices/<Media Services account name>/streamingendpoints/<streaming endpoint name>" \
   --metric "Egress"
```

To get other metrics, substitute "Egress" for the metric name you are interested in.

## See also

- [Azure Monitor Metrics](../../../azure-monitor/data-platform.md)
- [Create, view, and manage metric alerts using Azure Monitor](../../../azure-monitor/alerts/alerts-metric.md).

## Next steps

[Diagnostic logs](../media-services-diagnostic-logs-howto.md)