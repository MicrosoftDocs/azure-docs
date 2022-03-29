---
title: Configure Events diagnostic settings for diagnostic logs and metrics export - Azure Health Data Services
description: This article provides resources on how to configure Events Diagnostic settings for diagnostic logs and metrics exporting.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 03/22/2022
ms.author: jasteppe
---

# Configure Events diagnostic settings

In this article, you'll be provided resources to configure the Events diagnostic settings for Azure Event Grid system topics. 

After they're configured, Event Grid system topics diagnostic logs and metrics will be exported for audit, analysis, troubleshooting, or backup.

## Resources

|Description|Resource|
|----------------|--------|
|Learn how to enable the Event Grid system topics diagnostic logging and metrics export feature.|[Enable diagnostic logs for Event Grid system topics](../../event-grid/enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)|
|View a list of currently captured Event Grid system topics diagnostic logs.|[Event Grid system topic diagnostic logs](../../azure-monitor/essentials/resource-logs-categories.md#microsofteventgridsystemtopics)|
|View a list of currently captured Event Grid system topics metrics.|[Event Grid system topic metrics](../../azure-monitor/essentials/metrics-supported.md#microsofteventgridsystemtopics)| 
|More information about how to work with diagnostics logs.|[Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md)|

> [!Note] 
> It might take up to 15 minutes for the first Events diagnostic logs and metrics to display in the destination of your choice.  

## Next steps

To learn how to display Events metrics in the Azure portal, see

>[!div class="nextstepaction"]
>[How to display Events metrics](./events-display-metrics.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
