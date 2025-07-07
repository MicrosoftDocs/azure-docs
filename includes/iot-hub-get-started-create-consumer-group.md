---
author: SoniaLopezBravo

ms.author: sonialopez
ms.topic: include
ms.date: 05/22/2025
---
## Add a consumer group to your IoT hub

[Consumer groups](../articles/event-hubs/event-hubs-features.md#event-consumers) provide independent views into the event stream that enable apps and Azure services to independently consume data from the same Event Hubs endpoint. In this section, you add a consumer group to your IoT hub's built-in endpoint that is used later in this tutorial to pull data from the endpoint.

To add a consumer group to your IoT hub, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), open your IoT hub.

1. On the left pane, select **Built-in endpoints** under **Hub settings**. Enter a name for your new consumer group in the text box under **Consumer Groups**.

   :::image type="content" source="./media/iot-hub-get-started-create-consumer-group/iot-hub-create-consumer-group-azure.png" alt-text="Screenshot showing how to create a consumer group in your IoT hub." border="true":::

1. Select anywhere outside the text box to save the consumer group.