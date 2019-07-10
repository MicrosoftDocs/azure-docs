---
title: 'How to add an IoT hub event source to Azure Time Series Insights | Microsoft Docs'
description: This article describes how to add an event source that is connected to an IoT hub to your Time Series Insights environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: dpalled
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile
ms.workload: big-data
ms.topic: conceptual 
ms.date: 05/01/2019
ms.custom: seodec18
---

# Add an IoT hub event source to your Time Series Insights environment

This article describes how to use the Azure portal to add an event source that reads data from Azure IoT Hub to your Azure Time Series Insights environment.

> [!NOTE]
> The instructions in this article apply both to Azure Time Series Insights GA and to Time Series Insights Preview environments.

## Prerequisites

* Create an [Azure Time Series Insights environment](time-series-insights-update-create-environment.md).
* Create an [IoT hub by using the Azure portal](../iot-hub/iot-hub-create-through-portal.md).
* The IoT hub must have active message events being sent in.
* Create a dedicated consumer group in the IoT hub for the Time Series Insights environment to consume from. Each Time Series Insights event source must have its own dedicated consumer group that isn't shared with any other consumer. If multiple readers consume events from the same consumer group, all readers are likely to see failures. For details, see the [Azure IoT Hub developer guide](../iot-hub/iot-hub-devguide.md).

### Add a consumer group to your IoT hub

Applications use consumer groups to pull data from Azure IoT Hub. To reliably read data from your IoT hub, provide a dedicated consumer group that's used only by this Time Series Insights environment.

To add a new consumer group to your IoT hub:

1. In the Azure portal, find and open your IoT hub.

1. Under **Settings**, select **Built-in Endpoints**, and then select the **Events** endpoint.

   [![On the Build-in Endpoints page, select the Events button](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-one.png)](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-one.png#lightbox)

1. Under **Consumer groups**, enter a unique name for the consumer group. Use this same name in your Time Series Insights environment when you create a new event source.

1. Select **Save**.

## Add a new event source

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the left menu, select **All resources**. Select your Time Series Insights environment.

1. Under **Environment Topology**, select **Event Sources**, and then select **Add**.

   [![Select Event Sources, and then select the Add button](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-two.png)](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-two.png#lightbox)

1. In the **New event source** pane, for **Event source name**, enter a name that's unique to this Time Series Insights environment. For example, enter **event-stream**.

1. For **Source**, select **IoT Hub**.

1. Select a value for **Import option**:

   * If you already have an IoT hub in one of your subscriptions, select **Use IoT Hub from available subscriptions**. This option is the easiest approach.
   
     [![Select options in the New event source pane](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-three.png)](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-three.png#lightbox)

    * The following table describes the properties that are required for the **Use IoT Hub from available subscriptions** option:

       [![New event source pane - Properties to set in the Use IoT Hub from available subscriptions option](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-four.png)](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-four.png#lightbox)

       | Property | Description |
       | --- | --- |
       | Subscription ID | Select the subscription in which the IoT hub was created.
       | IoT hub name | Select the name of the IoT hub.
       | IoT hub policy name | Select the shared access policy. You can find the shared access policy on the IoT hub settings tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **service connect** permissions.
       | IoT hub policy key | The key is prepopulated.
       | IoT hub consumer group | The consumer group that reads events from the IoT hub. We highly recommend that you use a dedicated consumer group for your event source.
       | Event serialization format | Currently, JSON is the only available serialization format. The event messages must be in this format or no data can be read. |
       | Timestamp property name | To determine this value, you need to understand the message format of the message data that's sent to the IoT hub. This value is the **name** of the specific event property in the message data that you want to use as the event timestamp. The value is case-sensitive. If left blank, the **event enqueue time** in the event source is used as the event timestamp. |

    * If the IoT hub is external to your subscriptions, or if you want to choose advanced options, select **Provide IoT Hub settings manually**.

      The following table describes the required properties for the **Provide IoT Hub settings manually**:

       | Property | Description |
       | --- | --- |
       | Subscription ID | The subscription in which the IoT hub was created.
       | Resource group | The resource group name in which the IoT hub was created.
       | IoT hub name | The name of your IoT hub. When you created your IoT hub, you entered a name for the IoT hub.
       | IoT hub policy name | The shared access policy. You can create the shared access policy on the IoT hub settings tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **service connect** permissions.
       | IoT hub policy key | The shared access key that's used to authenticate access to the Azure Service Bus namespace. Enter the primary or secondary key here.
       | IoT hub consumer group | The consumer group that reads events from the IoT hub. We highly recommend that you use a dedicated consumer group for your event source.
       | Event serialization format | Currently, JSON is the only available serialization format. The event messages must be in this format or no data can be read. |
       | Timestamp property name | To determine this value, you need to understand the message format of the message data that's sent to the IoT hub. This value is the **name** of the specific event property in the message data that you want to use as the event timestamp. The value is case-sensitive. If left blank, the **event enqueue time** in the event source is used as the event timestamp. |

1. Add the dedicated Time Series Insights consumer group name that you added to your IoT hub.

1. Select **Create**.

   [![The Create button](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-five.png)](media/time-series-insights-how-to-add-an-event-source-iothub/iothub-five.png#lightbox)

1. After you create the event source, Time Series Insights automatically starts streaming data to your environment.

## Next steps

* [Define data access policies](time-series-insights-data-access.md) to secure the data.

* [Send events](time-series-insights-send-events.md) to the event source.

* Access your environment in the [Time Series Insights explorer](https://insights.timeseries.azure.com).
