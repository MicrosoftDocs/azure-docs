---
author: robinsh
manager: philmea
ms.author: robinsh
ms.topic: include
ms.date: 04/17/2019
---
## Add a consumer group to your IoT hub

[Consumer groups](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#event-consumers) provide independent views into the event stream for apps and Azure services that consume data from the same Event Hub endpoint. With consumer groups, multiple apps and services can independently consume the same event stream. In this section, you add a consumer group to your IoT hub's built-in endpoint that you use later to pull data from the endpoint.

To add a consumer group to your IoT hub, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), open your IoT hub.

2. On the left pane, select **Built-in endpoints**, select **Events** on the right pane, and enter a name under **Consumer groups**. Select **Save**.

   ![Create a consumer group in your IoT hub](./media/iot-hub-get-started-create-consumer-group/iot-hub-create-consumer-group-azure.png)
