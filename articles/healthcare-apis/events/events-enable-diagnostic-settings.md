---
title: Enable Events Diagnostic Settings for Logs and Metrics
description: Learn how to enable events diagnostic settings to export logs and metrics to Azure Monitor, Log Analytics, or a storage account, and start monitoring now.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.topic: how-to
ms.date: 04/28/2026
ms.author: chrupa
ai-usage: ai-assisted
---

# Enable Events Diagnostic Settings for Logs and Metrics

In this article, you learn how to enable events diagnostic settings and monitor events by exporting diagnostic logs and metrics to destinations such as Azure Monitor, Log Analytics, or a storage account. 

The following resources provide guidance on how to enable diagnostic logging for Event Grid system topics and monitor Event Hubs metrics and logs.

## Resources

|Description|Resource|
|-----------|--------|
|Enable diagnostic logs for Event Grid system topics.|[Enable diagnostic logs for Event Grid system topics](../../event-grid/enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)|
| Monitor Azure Event Hubs metrics and logs.|[Monitor Azure Event Hubs](../../event-hubs/monitor-event-hubs.md)|
|Currently captured Event Grid system topics diagnostic logs.|[Event Grid system topic diagnostic logs](/azure/azure-monitor/essentials/resource-logs-categories#microsofteventgridsystemtopics)|
|Currently captured Event Grid system topics metrics.|[Event Grid system topic metrics](/azure/azure-monitor/essentials/metrics-supported#microsofteventgridsystemtopics)| 
|More information about how to work with diagnostics logs.|[Azure Resource Log documentation](/azure/azure-monitor/essentials/platform-logs-overview)|

> [!NOTE] 
> It might take up to 15 minutes for the first events diagnostic logs and metrics to display in the destination of your choice.  

## Next steps

> [!div class="nextstepaction"]
> [View metrics](events-use-metrics.md)
