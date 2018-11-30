---
title: How to add an IoT Hub event source to Azure Time Series Insights | Microsoft Docs
description: This article describes how to add an event source that is connected to an IoT Hub to your Time Series Insights environment
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.workload: big-data
ms.topic: conceptual 
ms.date: 11/26/2018
---

# How to add an IoT Hub event source to Time Series Insights environment

This article describes how to use the Azure portal to add an event source that reads data from an IoT Hub into your Azure Time Series Insights (TSI) environment.

> [!NOTE]
> These instructions apply to both TSI GA & TSI preview environments.

## Prerequisites

* Create a TSI environment. For more information, see [Create an Azure TSI environment](time-series-insights-get-started.md) 
* Create an IoT Hub. For more information on IoT Hubs, see [Create an IoT Hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md)
* The IoT Hub needs to have active message events being sent in.
* Create a dedicated consumer group in IoT Hub for the TSI environment to consume from. Each TSI event source needs to have its own dedicated consumer group that is not shared with any other consumers. If multiple readers consume events from the same consumer group, all readers are likely to see failures. For details, see the [IoT Hub developer guide](../iot-hub/iot-hub-devguide.md).

### Add a consumer group to your IoT Hub

Consumer groups are used by applications to pull data from Azure IoT Hubs. Provide a dedicated consumer group, for use by this TSI environment only, to reliably read data from your IoT Hub.

To add a new consumer group to your IoT Hub, follow these steps:

1. In the Azure portal, locate and open your IoT Hub.
1. Under the **Settings** heading, select **Built-in Endpoints**.

   ![IoT Hub one][1]

1. Select the **Events** endpoint, and the **Properties** page opens.

1. Under the **Consumer groups** heading, provide a new unique name for the consumer group. Use this same name in TSI environment when creating a new event source.

1. Select **Save** to save the new consumer group.

## Add a new event source

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Locate your existing TSI environment. Click **All resources** in the menu on the left side of the Azure portal. Select your TSI environment.

1. Under the **Environment Topology** heading, click **Event Sources**.

   ![IoT Hub Two][2]

1. Click **+ Add**.

1. Provide an **Event source name** unique to this TSI environment, such as **event-stream**.

   ![IoT Hub Three][3]

1. Select the **Source** as **IoT Hub**.

1. Select the appropriate **Import option**.

   * Choose **Use IoT Hub from available subscriptions** when you already have an existing IoT Hub on one of your subscriptions. This is the easiest approach.
   * Choose **Provide IoT Hub settings manually** when the IoT Hub is external to your subscriptions, or you wish to choose advanced options.

1. If you have selected the **Use IoT Hub from available subscriptions** option, the following table explains each required property:

   ![IoT Hub Four][4]

   | Property | Description |
   | --- | --- |
   | Subscription ID | Select the subscription in which this IoT Hub was created.
   | IoT Hub name | Select the name of the IoT Hub.
   | IoT Hub policy name | Select the shared access policy, which can be found on the IoT Hub settings tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **service connect** permissions.
   | IoT Hub policy key | The key is prepopulated.
   | IoT Hub consumer group | The consumer group to read events from the IoT Hub. It is highly recommended to use a dedicated consumer group for your event source.
   | Event serialization format | JSON is the only available serialization at present. The event messages must be in this format, or no data can be read. |
   | Timestamp property name | To determine this value, you need to understand the message format of the message data sent into IoT Hub. This value is the **name** of the specific event property in the message data that you want to use as the event timestamp. The value is case-sensitive. When left blank, the **event enqueue time** within the event source is used as the event timestamp. |

1. If you have selected the **Provide IoT Hub settings manually** option, the following table explains each required property:

   | Property | Description |
   | --- | --- |
   | Subscription ID | The subscription in which this IoT Hub was created.
   | Resource group | The resource group name in which this IoT Hub was created.
   | IoT Hub name | The name of your IoT Hub. When you created your IoT Hub, you also gave it a specific name.
   | IoT Hub policy name | The shared access policy, which can be created on the IoT Hub settings tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **service connect** permissions.
   | IoT Hub policy key | The shared access key used to authenticate access to the Service Bus namespace. Type the primary or secondary key here.
   | IoT Hub consumer group | The consumer group to read events from the IoT Hub. It is highly recommended to use a dedicated consumer group for your event source.
   | Event serialization format | JSON is the only available serialization at present. The event messages must be in this format, or no data can be read. |
   | Timestamp property name | To determine this value, you need to understand the message format of the message data sent into IoT Hub. This value is the **name** of the specific event property in the message data that you want to use as the event timestamp. The value is case-sensitive. When left blank, the **event enqueue time** within the event source is used as the event timestamp. |

1. Add the dedicated TSI consumer group name that you added to your IoT Hub.

1. Select **Create** to add the new event source.

   ![IoT Hub Five][5]

1. After creation of the event source, Time Series Insights will automatically start streaming data into your environment.

## Next steps

* [Define data access policies](time-series-insights-data-access.md) to secure the data.
* [Send events](time-series-insights-send-events.md) to the event source.
* Access your environment in the [Time Series Insights explorer](https://insights.timeseries.azure.com).

<!-- Images -->
[1]: media/time-series-insights-how-to-add-an-event-source-iothub/iothub_one.png
[2]: media/time-series-insights-how-to-add-an-event-source-iothub/iothub_two.png
[3]: media/time-series-insights-how-to-add-an-event-source-iothub/iothub_three.png
[4]: media/time-series-insights-how-to-add-an-event-source-iothub/iothub_four.png
[5]: media/time-series-insights-how-to-add-an-event-source-iothub/iothub_five.png