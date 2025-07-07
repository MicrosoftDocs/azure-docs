---
title: Use events metrics -  Azure Health Data Services
description: Learn how use events metrics.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 11/26/2024
ms.author: chrupa
---

# How to use events metrics

In this article, learn how to use events metrics using the Azure portal. 

> [!TIP]
> To learn more about Azure Monitor and metrics, see [Azure Monitor Metrics overview](/azure/azure-monitor/essentials/data-platform-metrics).

> [!NOTE]
> For the purposes of this article, an [Azure Event Hubs](../../event-hubs/event-hubs-about.md) was used as the events message endpoint. 

## Use metrics

1. Within your Azure Health Data Services workspace, select the **Events** button. 

   :::image type="content" source="media\events-display-metrics\events-metrics-workspace-select.png" alt-text="Screenshot of select the events button from the Azure Health Data Services workspace." lightbox="media\events-display-metrics\events-metrics-workspace-select.png"::: 

2. The Events page displays the combined metrics for all Events Subscriptions. In this example, we have one subscription named  **fhir-events** and one processed message. To view the metrics for that subscription, select the subscription in the lower left-hand corner of the page.

   :::image type="content" source="media\events-display-metrics\events-metrics-main.png" alt-text="Screenshot of events you would like to display metrics for." lightbox="media\events-display-metrics\events-metrics-main.png":::
    
3. On this page, notice that the subscription named **fhir-events** has one processed message. To view the Event Hubs metrics, select the name of the Event Hubs (in this example, **azuredocsfhirservice**) from the lower right-hand corner of the page.

   :::image type="content" source="media\events-display-metrics\events-metrics-subscription.png" alt-text="Screenshot of select the metrics button." lightbox="media\events-display-metrics\events-metrics-subscription.png"::: 

4. On this page, notice that the Event Hubs received the incoming message presented in the previous Events Subscription metrics pages.

   :::image type="content" source="media\events-display-metrics\events-metrics-event-hub.png" alt-text="Screenshot of displaying event hubs metrics." lightbox="media\events-display-metrics\events-metrics-event-hub.png"::: 

## Next steps

In this tutorial, you learned how to use events metrics using the Azure portal.

To learn how to enable events diagnostic settings, see:

> [!div class="nextstepaction"]
> [Enable diagnostic settings for events](events-enable-diagnostic-settings.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]
