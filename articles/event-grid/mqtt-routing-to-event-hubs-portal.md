---
title: 'Tutorial: Route MQTT messages to Event Hubs using portal'
description: 'Tutorial: Use Azure Event Grid to route MQTT messages to Azure Event Hubs.'
ms.topic: tutorial
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid with Azure portal

Use message routing in Azure Event Grid to send data from your MQTT clients to Azure services such as storage queues, and Event Hubs.
In this tutorial, you perform the following tasks:
- Create Event Subscription in your Event Grid topic.
- Configure routing in your Event Grid Namespace.
- View the MQTT messages in the Event Hubs using Azure Stream Analytics.


## Prerequisites

- If you don't have an [Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- If you're new to Azure Event Grid, read through [Event Grid overview](/azure/event-grid/overview) before starting this tutorial.
- Register the Event Grid resource provider as per [Register the Event Grid resource provider](/azure/event-grid/custom-event-quickstart-portal#register-the-event-grid-resource-provider).
- Make sure that port 8883 is open in your firewall. The sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environment.
- An Event Grid Namespace in your Azure subscription. If you don't have a namespace yet, you can follow the steps in [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-portal.md).
- This tutorial uses Event Hubs, Event Grid custom topic, and Event Subscriptions.  You can find more information here:
- Creating an Event Grid topic:  [Create a custom topic using portal](/azure/event-grid/custom-event-quickstart-portal).  While creating the Event Grid topic, ensure to create with Event Schema as Cloud Event Schema v1.0 in the Advanced tab.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/create-event-grid-topic-advanced-tab.png" alt-text="Screenshot showing Event Grid topic create flow Advanced tab.":::

- Creating an Event Hubs:  [Quickstart - Create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

- You can view the Event Hubs data using Stream Analytics:  [Process data from Event Hubs Azure using Stream Analytics](/azure/event-hubs/process-data-azure-stream-analytics).

## Create Event Subscription with Event Hubs as endpoint
1. In your Event Grid topic, go to Event Subscriptions page under Entities in left rail.
2. Select **+ Event Subscription** to add new subscription.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/add-event-subscription-to-event-grid-topic.png" alt-text="Screenshot showing the Add Subscription button in the Event Grid topic overview page.":::

3. For Event Schema, select Cloud Event Schema v1.0.
4. Add Event Hubs as Endpoint Type, and provide your event hub information for endpoint, and select **Confirm Selection** button.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/event-subscription-create-flow.png" alt-text="Screenshot showing the event subscription create flow and configuration.":::

5. Then **Create** the Event subscription.

## Configure routing in the Event Grid Namespace

1. Navigate to Routing page in your Event Grid Namespace.
:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/event-grid-namespace-routing-configuration.png" alt-text="Screenshot showing the Event Grid routing configuration page to enable routing for the namespace." lightbox="./media/mqtt-routing-to-event-hubs-portal/event-grid-namespace-routing-configuration.png":::

2. Select **Enable routing**
3. Select 'Custom topic' option for Topic type
1. Under Topic, select the Event Grid topic that you have created where all MQTT messages will be routed.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/routing-portal-configuration.png" alt-text="Screenshot showing the routing configuration through the portal." lightbox="./media/mqtt-routing-to-event-hubs-portal/routing-portal-configuration.png":::

4. Select **Apply**

> [!NOTE]
> **Routing Event Grid topic considerations:**
> The Event Grid topic that is used for routing has to fulfill following requirements:
> - It needs to be set to use the Cloud Event Schema v1.0.
> - It needs to be in the same region as the namespace.
> - You need to assign "EventGrid Data Sender" role to yourself on the Event Grid Topic.
> 
> **Configuration** 
> - Go to the Event Grid topic resource.
> - In the "Access control (IAM)" menu item, select **Add role assignment**.
> - In the "Role" tab, select "EventGrid Data Sender", then select **Next**.
> - In the "Members" tab, click on **+ Select members**, then type your AD user name in the "Select" box that will appear (e.g. user@contoso.com).
> - Select your AD user name, then select **Review + assign**.

## Viewing the routed MQTT messages in Azure Event Hubs using Azure Stream Analytics query

1. After configuring the routing for the namespace, publish MQTT messages among the clients (as described in the article [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-portal.md).)

2. Navigate to the Event Hubs instance within your Event Subscription on Azure portal.  Process data from your event hub using Azure Stream Analytics.  ([Process data from Event Hubs Azure using Stream Analytics - Azure Event Hubs | Microsoft Learn](/azure/event-hubs/process-data-azure-stream-analytics))  You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot showing the MQTT messages data in Event Hubs using Azure Stream Analytics query tool.":::

## Next steps
- For code samples, go to [this repository.](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main)
