---
title: Enable Events diagnostic settings for diagnostic logs and metrics export - Azure Health Data Services
description: This article provides resources on how to enable Events diagnostic settings for diagnostic logs and metrics exporting.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/21/2022
ms.author: jasteppe
---

# How to enable diagnostic settings for Events

In this article, you'll be provided resources to enable the Events diagnostic settings for Azure Event Grid system topics. 

After they're enabled, Event Grid system topics diagnostic logs and metrics will be exported to the destination of your choosing for audit, analysis, troubleshooting, or backup.

## Resources

|Description|Resource|
|----------------|--------|
|Learn how to enable the Event Grid system topics diagnostic logging and metrics export feature.|[Enable diagnostic logs for Event Grid system topics](../../event-grid/enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)|
|View a list of currently captured Event Grid system topics diagnostic logs.|[Event Grid system topic diagnostic logs](../../azure-monitor/essentials/resource-logs-categories.md#microsofteventgridsystemtopics)|
|View a list of currently captured Event Grid system topics metrics.|[Event Grid system topic metrics](../../azure-monitor/essentials/metrics-supported.md#microsofteventgridsystemtopics)| 
|More information about how to work with diagnostics logs.|[Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md)|

> [!NOTE] 
> It might take up to 15 minutes for the first Events diagnostic logs and metrics to display in the destination of your choice.  

## Next steps

To learn how to use Events metrics in the Azure portal, see

> [!div class="nextstepaction"]
> [How to use Events metrics](events-use-metrics.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
