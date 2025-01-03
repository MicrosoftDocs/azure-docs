---
title: Use namespace topics to route MQTT messages to Event Hubs
description: 'This tutorial shows how to use namespace topics to route MQTT messages to Azure Event Hubs. You use Azure portal to do the tasks in this tutorial.'
ms.topic: tutorial
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 02/29/2024
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# Tutorial: Use namespace topics to route MQTT messages to Azure Event Hubs (Azure portal)

In this tutorial, you learn how to use a namespace topic to route data from MQTT clients to Azure Event Hubs. Here are the high-level steps:

## Prerequisites

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- If you're new to Event Grid, read the [Event Grid overview](../event-grid/overview.md) before you start this tutorial.
- Register the Event Grid resource provider according to the steps in [Register the Event Grid resource provider](custom-event-quickstart-portal.md#register-the-event-grid-resource-provider).
- Make sure that port **8883** is open in your firewall. The sample in this tutorial uses the MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environments.

[!INCLUDE [event-grid-create-namespace-portal](./includes/event-grid-create-namespace-portal.md)]

[!INCLUDE [event-grid-create-namespace-topic-portal](./includes/event-grid-create-namespace-topic-portal.md)]

[!INCLUDE [enable-identity-portal](./includes/enable-identity-portal.md)]

[!INCLUDE [enable-mqtt-portal](./includes/enable-mqtt-portal.md)]

In a separate tab of the Web browser or in a separate window, use the Azure portal to create an Event Hubs namespace with an event hub.

[!INCLUDE [create-event-hubs-namespace](../event-hubs/includes/create-event-hubs-namespace.md)]

[!INCLUDE [create-event-hub](../event-hubs/includes/create-event-hub.md)]

## Give Event Grid namespace the access to send events to the event hub

1. On the **Event Hubs Namespace** page, select **Access control (IAM)** on the left menu.
1. On the **Access control** page, select **+ Add** on the command bar, and then select **Add role assignment**.

    :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/event-hubs-access-control-add-role-assignment.png" alt-text="Screenshot that shows the Access control page for the Event Hubs namespace.":::
1. On the **Add role assignment** page, select **Azure Event Hubs Data Sender** from the list of roles, and then select **Next** at the bottom of the page.

    :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/select-azure-event-hubs-data-sender.png" alt-text="Screenshot that shows the Add role assignment page with Azure Event Hubs Data Sender selected.":::
1. On the **Members** page, follow these steps:
    1. For the **Assign access to** field, select **Managed identity**. 
    1. Choose **+ Select members**.

        :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/select-managed-identity.png" alt-text="Screenshot that shows the Add role assignment page with Managed identity selected.":::
1. On the **Select managed identities** page, follow these steps:
    1. Select your **Azure subscription**. 
    1. For **Managed identity**, select **Event Grid Namespace**.
    1. Select the managed identity that has the same name as the Event Grid namespace. 
    1. Choose **Select** at the bottom of the page.
    
        :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/select-event-grid-namespace-managed-identity.png" alt-text="Screenshot that shows the Select managed identities page with the Event Grid namespace's managed identity selected.":::          
1. On the **Add role assignment** page, select **Review + assign** at the bottom of the page.
1. On the **Review + assign** page, select **Review + assign**. 

## Create an event subscription with Event Hubs as the endpoint

1. Switch to the tab of your Web browser window that has the Event Grid namespace open. 
1. On the **Event Grid Namespace** page, select **Topics** on the left menu.
1. On the **Topics** page, select the namespace topic you created earlier.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/select-topic.png" alt-text="Screenshot that shows the Topics page with the namespace topic selected.":::              
1. On the **Event Grid Namespace Topic** page, select **+ Subscription** on the command bar at the top.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/subscriptions-page.png" alt-text="Screenshot that shows the Subscriptions page.":::              
1. On the **Create Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    1. For **Delivery mode**, select **Push**.
    1. Confirm that **Endpoint type** is set to **Event hub**.
    1. Select **Configure an endpoint**.

       :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/create-subscription-page.png" alt-text="Screenshot that shows the Create Subscription page.":::              
    1. On the **Select Event Hub**, follow these steps:
        1. Select the **Azure subscription** that has the event hub.
        1. Select the **resource group** that has the event hub.
        1. Select the **Event Hubs namespace**.
        1. Select the **event hub** in the Event Hubs namespace. 
        1. Then, select **Confirm selection**.

           :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/select-event-hub-page.png" alt-text="Screenshot that shows the Select event hub page.":::                    
    1. Back on the **Create Subscription** page, select **System Assigned** for **Managed identity type**. 
    1. Select **Create** at the bottom of the page. 
           
        :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/create-subscription.png" alt-text="Screenshot that shows the Create Subscription page with Create button selected.":::                    

## Configure routing in the Event Grid namespace

1. Navigate back to the **Event Grid Namespace** page by selecting the namespace in the **Essentials** section of the **Event Grid Namespace Topic** page or by selecting the namespace name in the breadcrumb menu at the top. 
1. On the **Event Grid Namespace** page, select **Routing** on the left menu in the **MQTT broker** section.
1. On the **Routing** page, select **Enable routing**.
1. For **Topic type**, select **Namespace topic**.
1. For **Topic**, select the Event Grid namespace topic that you created where all MQTT messages will be routed.
1. Select **Apply**.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/routing-page.png" alt-text="Screenshot that shows the Routing page with the namespace topic selected."::: 

    Check notifications to confirm that the namespace is enabled with the routing information.

## Create clients, topic space, and permission bindings
Follow steps in the quickstart: [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-portal.md) to:

1. Create a client. You can create the second client if you want to, but it's optional. 
1. Create a topic space.
1. Create publisher and subscriber permission bindings.
1. Use MQTTX to send a few messages.
1. Verify that the event hub received those messages on the **Overview** page for your Event Hubs namespace.

   :::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png" alt-text="Screenshot that shows the Overview page of the event hub with incoming message count." lightbox="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png"::: 
 

## View routed MQTT messages in Event Hubs by using a Stream Analytics query

Navigate to the Event Hubs instance (event hub) within your event subscription in the Azure portal. Process data from your event hub by using Stream Analytics. For more information, see [Process data from Azure Event Hubs using Stream Analytics - Azure Event Hubs | Microsoft Learn](../event-hubs/process-data-azure-stream-analytics.md). You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot that shows the MQTT messages data in Event Hubs by using the Stream Analytics query tool.":::

## Next steps

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
