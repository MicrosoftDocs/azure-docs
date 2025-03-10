---
title: Enable events diagnostic settings for diagnostic logs and metrics export - Azure Health Data Services
description: Learn how to enable events diagnostic settings for diagnostic logs and metrics exporting.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/26/2024
ms.author: chrupa
---

# How to enable diagnostic settings for events

In this article, learn how to enable the events diagnostic settings for Azure Event Grid system topics. 

## Resources

|Description|Resource|
|-----------|--------|
|Learn how to enable the Event Grid system topics diagnostic logging and metrics export feature.|[Enable diagnostic logs for Event Grid system topics](../../event-grid/enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)|
|View a list of currently captured Event Grid system topics diagnostic logs.|[Event Grid system topic diagnostic logs](/azure/azure-monitor/essentials/resource-logs-categories#microsofteventgridsystemtopics)|
|View a list of currently captured Event Grid system topics metrics.|[Event Grid system topic metrics](/azure/azure-monitor/essentials/metrics-supported#microsofteventgridsystemtopics)| 
|More information about how to work with diagnostics logs.|[Azure Resource Log documentation](/azure/azure-monitor/essentials/platform-logs-overview)|

> [!NOTE] 
> It might take up to 15 minutes for the first events diagnostic logs and metrics to display in the destination of your choice.  

## Next steps

In this article, you learned how to enable diagnostic settings for events.

To learn how to use events metrics using the Azure portal, see

> [!div class="nextstepaction"]
> [How to use events metrics](events-use-metrics.md)
