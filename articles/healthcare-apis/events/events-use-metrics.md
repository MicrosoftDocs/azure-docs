---
title: View Events Metrics in Azure Health Data Services
description: View events metrics in the Azure portal to monitor event subscriptions and Event Hubs in Azure Health Data Services. Learn how to track processed events and failures.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.topic: how-to
ms.date: 04/28/2026
ms.author: chrupa
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# View events metrics

In this article, you learn how to view events metrics in the Azure portal to monitor event subscriptions and Event Hubs. 

Events metrics provide a way to track the health and performance of your event subscriptions and Event Hubs by showing how many events are successfully processed, delivered, or failed over time.

To learn more about Azure Monitor and metrics, see [Azure Monitor Metrics overview](/azure-monitor/essentials/data-platform-metrics).

## Prerequisites

Before you can view events metrics, ensure you have the following:

- An Azure subscription. If you don't have one, you can create a free account at [https://azure.com/free](https://azure.com/free).
- An Azure Health Data Services workspace with with at least one event subscription configured to send events to an [Azure Event Hubs](events-deploy-portal.md) instance.

## View events metrics

1. Within your Azure Health Data Services workspace, select  **Events**. 

   :::image type="content" source="media\events-display-metrics\events-metrics-workspace-select.png" alt-text="Screenshot of the Events page in an Azure Health Data Services workspace." lightbox="media\events-display-metrics\events-metrics-workspace-select.png"::: 

1. The **Events** page displays the combined metrics for all events subscriptions. In this example, you have one subscription named **fhir-events** and one processed message. To view the metrics for that subscription, select the subscription in the lower left corner of the page.

   :::image type="content" source="media\events-display-metrics\events-metrics-main.png" alt-text="Screenshot of the Events page showing metrics for all event subscriptions." lightbox="media\events-display-metrics\events-metrics-main.png":::
    
1. On **Event Subscription**, the subscription named **fhir-events** has one processed message. To view the Event Hubs metrics, select the name of the Event Hubs (in this example, **azuredocsfhirservice**) from the lower right corner of the page.

   :::image type="content" source="media\events-display-metrics\events-metrics-subscription.png" alt-text="Screenshot of the Event Subscription page with the selected Event Hubs name." lightbox="media\events-display-metrics\events-metrics-subscription.png"::: 

1. On **Event Hubs Instance**, the Event Hubs received the incoming message presented in the previous Events Subscription metrics pages.

   :::image type="content" source="media\events-display-metrics\events-metrics-event-hub.png" alt-text="Screenshot of displaying event hubs metrics." lightbox="media\events-display-metrics\events-metrics-event-hub.png"::: 

## Next steps

> [!div class="nextstepaction"]
> [Enable diagnostic settings for events](events-enable-diagnostic-settings.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]
