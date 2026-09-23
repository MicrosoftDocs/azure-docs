---
title: Route MQTT Messages to Azure Functions - Portal
description: Learn how to route MQTT messages from Azure Event Grid to Azure Functions by using custom topics and the portal in this step-by-step tutorial.
ms.topic: tutorial
ms.date: 08/27/2026
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
ai-usage: ai-assisted
#customer intent: As a developer, I want to use custom topics to route MQTT messages to Azure Functions to support apps, such as IoT applications.
---

# Tutorial: Route MQTT messages from Azure Event Grid to Azure Functions with custom topics - Azure portal

Azure Event Grid can receive MQTT messages from your IoT clients and route them to other Azure services for processing. This tutorial shows you how to route MQTT messages received by an Azure Event Grid namespace to an Azure function by using an Event Grid custom topic. Routing messages to a function lets you run custom code, such as transforming or filtering telemetry, each time a message arrives, without managing any servers.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure function that uses an Event Grid trigger.
> * Create an Event Grid custom topic.
> * Add a subscription that sends events to the function.
> * Create an Event Grid namespace with clients, topic spaces, and permission bindings.
> * Enable a managed identity for the namespace.
> * Configure routing from the namespace to the custom topic.
> * Send test MQTT messages and verify that the function receives them.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- The [MQTTX app](https://mqttx.app/) to publish and subscribe to test MQTT messages.

## Create an Azure function by using an Event Grid trigger

> [!IMPORTANT]
> Create all resources in this tutorial in the same region.

Follow the instructions in [Create an Azure function using Visual Studio Code](../azure-functions/functions-develop-vs-code.md), but use the **Azure Event Grid Trigger** instead of the **HTTP Trigger**.

You should see code similar to the following example:

```csharp
using System;
using Azure.Messaging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public class MyEventGridTriggerFunc
    {
        private readonly ILogger<MyEventGridTriggerFunc> _logger;

        public MyEventGridTriggerFunc(ILogger<MyEventGridTriggerFunc> logger)
        {
            _logger = logger;
        }

        [Function(nameof(MyEventGridTriggerFunc))]
        public void Run([EventGridTrigger] CloudEvent cloudEvent)
        {
            _logger.LogInformation("Event type: {type}, Event subject: {subject}", cloudEvent.Type, cloudEvent.Subject);
        }
    }
}
```

You use this Azure function as an event handler for a topic's subscription later in this tutorial.

> [!NOTE]
> This tutorial was tested with an Azure function that uses .NET 8.0 (isolated) runtime stack.

## Create an Event Grid topic (custom topic)

Create an Event Grid topic. See [Create a custom topic using the Azure portal](custom-event-quickstart-portal.md). When you create the Event Grid topic, on the **Advanced** tab, for **Event Schema**, select **Cloud Event Schema v1.0**.

:::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/create-topic-cloud-event-schema.png" alt-text="Screenshot that shows the Advanced page of the Create Topic wizard.":::

> [!NOTE]
> Use **Cloud Event Schema v1.0** everywhere in this tutorial.

## Add a subscription to the topic by using the function

In this step, create a subscription to the Event Grid topic by using the Azure function you created earlier.

1. On the **Event Grid Topic** page, select **Subscriptions**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/event-subscriptions-page.png" alt-text="Screenshot that shows the Event Subscriptions page for a topic." lightbox="./media/mqtt-routing-to-azure-functions-portal/event-subscriptions-page.png":::

1. On the **Create Event Subscription** page, complete these steps:

   1. Enter a **Name** for the event subscription.
   1. For **Event Schema**, select **Cloud Event Schema v1.0**.
   1. For **Endpoint Type**, select **Azure Function**.
   1. Select **Configure an endpoint**.

      :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/create-event-subscription-page.png" alt-text="Screenshot that shows the Create event subscription page.":::

1. On the **Select Azure function** page, complete these steps:

   1. For **Subscription**, select your Azure subscription.
   1. For **Resource group**, select the resource group that has your Azure function.
   1. For **Function app**, select the function app that contains the function.
   1. For **Slot**, select **Production**.
   1. For **Function**, select your Azure function.
   1. Select **Confirm Selection**.

      :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/select-azure-function-page.png" alt-text="Screenshot that shows the Select Azure function page.":::

1. On the **Create Event Subscription** page, select **Create**.
1. On the **Event Subscriptions** page, you should see the subscription you created.

## Create namespace, clients, topic spaces, and permission bindings

Follow the instructions in [Quickstart: Publish and subscribe to MQTT messages using an Event Grid namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) to:

1. Create an Event Grid namespace.
1. Create two clients.
1. Create a topic space.
1. Create publisher and subscriber permission bindings.
1. Test by using the MQTTX app to confirm that clients can send and receive messages.

## Enable managed identity for the namespace

In this section, you enable system-assigned managed identity for the Event Grid namespace, and then grant the identity the **send** permission to the Event Grid custom topic so that it can route messages to the custom topic. You grant this permission by adding the managed identity to the **Event Grid Data Sender** role on the custom topic.

1. On the **Event Grid Namespace** page, select **Identity**. Select **On** and then **Save**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/namespace-identity-page.png" alt-text="Screenshot that shows the Event Grid Namespace with the Identity tab selected." lightbox="./media/mqtt-routing-to-azure-functions-portal/namespace-identity-page.png":::

1. Go to the **Event Grid Topic** for your Event Grid custom topic.
1. Select **Access control** on the left navigation bar.
1. On the **Access control** page, select **Add**, and then select **Add role assignment**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/topic-access-control-page.png" alt-text="Screenshot that shows the Access control page." lightbox="./media/mqtt-routing-to-azure-functions-portal/topic-access-control-page.png":::

1. On the **Role** page of the **Add role assignment** wizard, select **Event Grid Data Sender** role, and select **Next**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/select-data-sender-role.png" alt-text="Screenshot that shows the Role page of the Add role assignment wizard." lightbox="./media/mqtt-routing-to-azure-functions-portal/select-data-sender-role.png":::

1. On **Add role assignment**, on the **Members** page, select **Managed identity**, and then choose **Select members**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/role-members-page.png" alt-text="Screenshot that shows the Members page of the Add role assignment wizard.":::

1. On the **Select managed identities** page, do these steps:

   1. Select your Azure subscription.
   1. For **Managed identity**, select **Event Grid Namespace**.
   1. Select the managed identity that has the same name as the Event Grid namespace.
   1. Choose **Select**.

      :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/select-managed-identity.png" alt-text="Screenshot that shows the Select managed identities page.":::

1. On the **Add role assignment** page, select **Next**.
1. On the **Review + assign** page, review settings, and then select **Review + assign**.

## Configure routing messages to Azure function via custom topic

In this section, configure routing for the Event Grid namespace so that it routes the messages it receives to the custom topic you created.

1. On the **Event Grid Namespace** page, select **Routing**.
1. On the **Routing** page, select **Enable routing**.
1. For **Topic type**, select **Custom topic**.
1. For **Topic**, select the custom topic you created for this tutorial.
1. For **Managed identity for delivery**, select **System Assigned**.
1. Select **Apply**.

   :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/routing-custom-topic.png" alt-text="Screenshot that shows the Routing page for a namespace." lightbox="./media/mqtt-routing-to-azure-functions-portal/routing-custom-topic.png":::

## Send test MQTT messages by using MQTTX

Send test MQTT messages to the namespace and confirm that the function receives them. Follow the instructions in [Publish and subscribe using MQTTX app](mqtt-publish-and-subscribe-portal.md#publish-and-subscribe-by-using-mqttx-app) to send a few test messages to the Event Grid namespace.

When you send messages, they flow through the system in this order:

1. MQTTX sends messages to the topic space of the Event Grid namespace.
1. Event Grid routes the messages to the custom topic that you configured.
1. Event Grid forwards the messages to the event subscription, which is the Azure function.

To confirm delivery, use the logging feature to verify that the function receives the event.

:::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/function-log-stream.png" alt-text="Screenshot that shows the Log stream page for an Azure function." lightbox="./media/mqtt-routing-to-azure-functions-portal/function-log-stream.png":::

## Next step

> [!div class="nextstepaction"]
> [Samples in MqttApplicationSamples](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).

