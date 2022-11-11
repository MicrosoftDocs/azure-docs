---
title: Use Events metrics in Azure Health Data Services
description: This article explains how use display Events metrics
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 10/21/2022
ms.author: jasteppe
---

# How to use Events metrics

In this article, you'll learn how to use Events metrics in the Azure portal. 

> [!TIP]
> To learn more about Azure Monitor and metrics, see [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics)]

> [!NOTE]
> For the purposes of this article, an Azure Event Hubs event hub was used as the Events message endpoint. 

## Use metrics

1. Within your Azure Health Data Services workspace, select the **Events** button. 

   :::image type="content" source="media\events-display-metrics\events-metrics-workspace-select.png" alt-text="Screenshot of select the events button from the workspace." lightbox="media\events-display-metrics\events-metrics-workspace-select.png"::: 

2. The Events page displays the combined metrics for all Events Subscriptions. For example, we have one subscription named  **fhir-events** and one processed message. Select the subscription in the lower left-hand corner to view the metrics for that subscription.

   :::image type="content" source="media\events-display-metrics\events-metrics-main.png" alt-text="Screenshot of events you would like to display metrics for." lightbox="media\events-display-metrics\events-metrics-main.png":::
    
3. From this page, you'll notice that the subscription named **fhir-events** has one processed message. To view the Event Hubs metrics, select the name of the Event Hubs (for this example, **azuredocsfhirservice**) from the lower right-hand corner of the page.

   :::image type="content" source="media\events-display-metrics\events-metrics-subscription.png" alt-text="Screenshot of select the metrics button." lightbox="media\events-display-metrics\events-metrics-subscription.png"::: 

4. From this page, you'll notice that the Event Hubs received the incoming message presented in the previous Events subscription metrics pages.

   :::image type="content" source="media\events-display-metrics\events-metrics-event-hub.png" alt-text="Screenshot of displaying event hubs metrics." lightbox="media\events-display-metrics\events-metrics-event-hub.png"::: 

## Next steps

To learn how to export Events Azure Event Grid system diagnostic logs and metrics, see

> [!div class="nextstepaction"]
> [Enable diagnostic settings for Events](events-enable-diagnostic-settings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
