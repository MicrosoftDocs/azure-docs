---
title: Monitor Media Services metrics and diagnostic logs via Azure Monitor | Microsoft Docs
description: This article gives an overview of how to monitor Media Services metrics and diagnostic logs via Azure Monitor.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/20/2019
ms.author: juliako

---

# Monitor Media Services metrics and diagnostic logs

Azure Media Services uses [Azure Monitor](../../azure-monitor/overview.md) to enable you to monitor metrics and diagnostic logs that help you understand how your applications are performing. You can create alerts and notifications for the metrics and diagnostic logs or archive them to Storage accounts, Event Hubs, OMS Log Analytics or to 3rd party services.

For detailed information, see [Metrics](../../azure-monitor/platform/data-collection.md) and [Diagnostic logs](../../azure-monitor/platform/diagnostic-logs-overview.md).

This topic discusses currently available Media Services [metrics](#media-services-metrics) and [diagnostic logs](#media-services-diagnostic-logs).

## Media Services metrics

Currently, you can view the following metrics:

|Name|Description|
|---|---|
|Requests|Gives details around total # of requests serviced by streaming endpoint.|
|Egress|Total number of egress bytes. For example, bytes streamed by streaming endpoint.|
|Success end to end Latency| Gives information about end to end latency of successful requests.|

You can [view metrics using the Azure portal](#view-metrics-using-portal) or [query metrics using the Azure CLI](#query-metrics-using-cli). 

### View metrics using portal 

You can view metrics using the Azure portal either from Azure Monitor or from your Media Services account.

#### Azure Monitor - Metrics 

In the Azure portal, navigate to **Monitor** -> **Metrics**.

![Navigate to Monitor -> Metrics](media/media-services-azure-monitor/azure-monitor-metrics1.png)

Add a chart for your Media Services resource.

![Find your Media Services resource](media/media-services-azure-monitor/azure-monitor-metrics2.png)

Add metrics that you want to monitor.

![Add metrics that you want to monitor](media/media-services-azure-monitor/azure-monitor-metrics3.png)

#### Media Services account - Metrics

In the Azure portal, navigate to <*your account*> -> **Metrics**.

![Navigate to Media Services account -> Metrics](media/media-services-azure-monitor/media-services-account-metrics1.png)

Then, add a chart and a metric that you want to monitor.

### Query metrics using CLI

TODO

## Media Services diagnostic logs

Currently, you can get the following diagnostic logs:

|Name|Description|
|---|---|
|Key delivery service request|Logs that show the delivery service request information. For more details, see [schemas](media-services-diagnostic-logs-schema.md).|
|Streaming endpoint|Logs that show the streaming endpoint information. For more details, see [schemas](media-services-diagnostic-logs-schema.md).|

### Access diagnostic logs

To enable diagnostic logs for your Media Services Azure Resource Manager resource, use the following Azure CLI command. In the command, you need to provide the storage account into which you want for the Media Services logs to be written.

TODO

### View diagnostic logs

To view the logs in the storage account, use the Azure CLI or the Azure portal.

#### View logs with CLI

TODO

#### View logs with portal

TODO

# Next steps 

[Azure Monitor](../../azure-monitor/overview.md)
