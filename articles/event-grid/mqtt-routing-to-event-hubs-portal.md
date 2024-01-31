---
title: 'Tutorial: Route MQTT messages to Event Hubs by using the portal'
description: 'Tutorial: Use Azure Event Grid to route MQTT messages to Azure Event Hubs.'
ms.topic: tutorial
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid with the Azure portal

Use message routing in Azure Event Grid to send data from your MQTT clients to Azure services, such as storage queues and Azure Event Hubs.

In this tutorial, you learn how to:

- Create an event subscription in your Event Grid topic.
- Configure routing in your Event Grid namespace.
- View the MQTT messages in the event hubs by using Azure Stream Analytics.

If you don't have an [Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

- If you're new to Event Grid, read the [Event Grid overview](/azure/event-grid/overview) before you start this tutorial.
- Register the Event Grid resource provider according to the steps in [Register the Event Grid resource provider](/azure/event-grid/custom-event-quickstart-portal#register-the-event-grid-resource-provider).
- Make sure that port 8883 is open in your firewall. The sample in this tutorial uses the MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environments.
- You need an Event Grid namespace in your Azure subscription. If you don't have a namespace yet, you can follow the steps in [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-portal.md).
- This tutorial uses event hubs, Event Grid custom topics, and event subscriptions. You can find more information here:
   - Create an Event Grid topic. See [Create a custom topic using the portal](/azure/event-grid/custom-event-quickstart-portal). When you create the Event Grid topic, on the **Advanced** tab, for **Event Schema**, select **Cloud Event Schema v1.0**.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/create-event-grid-topic-advanced-tab.png" alt-text="Screenshot that shows the Advanced tab on the Event Grid Create Topic page.":::

   - Create an event hub. See [Quickstart: Create an event hub using the Azure portal](/azure/event-hubs/event-hubs-create).

- View the Event Hubs data by using Stream Analytics. For more information, see [Process data from Azure Event Hubs using Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics).

## Create an event subscription with Event Hubs as the endpoint

1. On your Event Grid topic, go to the **Event Subscription** page under **Entities** in the left pane.
1. Select **+ Event Subscription** to add a new subscription.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/add-event-subscription-to-event-grid-topic.png" alt-text="Screenshot that shows the Add Subscription button on the Event Grid topic overview page.":::

1. For **Event Schema**, select **Cloud Event Schema v1.0**.
1. For **Endpoint Type**, select **Event Hubs**, enter your event hub information for the endpoint, and select **Confirm Selection**.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/event-subscription-create-flow.png" alt-text="Screenshot that shows the event subscription creation flow and configuration.":::

1. Create the event subscription.

## Configure routing in the Event Grid namespace

1. Go to the **Routing** page in your Event Grid namespace.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/event-grid-namespace-routing-configuration.png" alt-text="Screenshot that shows the Event Grid routing configuration page to enable routing for the namespace." lightbox="./media/mqtt-routing-to-event-hubs-portal/event-grid-namespace-routing-configuration.png":::

1. Select **Enable routing**.
1. For **Topic type**, select **Custom topic**.
1. For **Topic**, select the Event Grid topic that you created where all MQTT messages will be routed.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/routing-portal-configuration.png" alt-text="Screenshot that shows the routing configuration through the portal." lightbox="./media/mqtt-routing-to-event-hubs-portal/routing-portal-configuration.png":::

1. Select **Apply**.

### Routing Event Grid topic considerations

The Event Grid topic used for routing must fulfill the following requirements:

- It must be set to use the Cloud Event Schema v1.0.
- It must be in the same region as the namespace.
- You need to assign the Event Grid Data Sender role to yourself on the Event Grid topic.

### Configuration

1. Go to the Event Grid topic resource.
1. On the **Access control (IAM)** menu, select **Add role assignment**.
1. On the **Role** tab, select **Event Grid Data Sender**. Then select **Next**.
1. On the **Members** tab, click **+ Select members**. Then enter your Microsoft Entra username in the **Select** box that appears (for example, user@contoso.com).
1. Select your Microsoft Entra username, and then select **Review + assign**.

## View the routed MQTT messages in Event Hubs by using a Stream Analytics query

1. After you configure the routing for the namespace, publish MQTT messages among the clients. For more information, see [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-portal.md).

1. Go to the Event Hubs instance within your event subscription in the Azure portal. Process data from your event hub by using Stream Analytics. For more information, see [Process data from Azure Event Hubs using Stream Analytics - Azure Event Hubs | Microsoft Learn](/azure/event-hubs/process-data-azure-stream-analytics). You can see the MQTT messages in the query.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot that shows the MQTT messages data in Event Hubs by using the Stream Analytics query tool.":::

## Next steps

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
