---
title: How to send events to an Azure Time Series Insights environment | Microsoft Docs
description: This tutorial explains how to create and configure event hub and run a sample application to push events to be shown in Azure Time Series Insights.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 12/03/2018
---

# Send events to a Time Series Insights environment using event hub

This article explains how to create and configure event hub and run a sample application to push events. If you have an existing event hub with events in JSON format, skip this tutorial and view your environment in [Azure Time Series Insights](./time-series-insights-update-create-environment.md).

## Configure an Event Hub

1. For Event Hub creation, follow instructions from the Event Hub [documentation](https://docs.microsoft.com/azure/event-hubs/).
1. Search for `Event Hub` in the search bar. Click **Event Hubs** in the returned list.
1. Select your Event Hub by clicking on its name.
1. When you create an Event Hub, you are really creating an Event Hub Namespace.  If you have yet to create an Event Hub within the Namespace, create one under entities.  

    ![updated][1]

1. Once you have created an Event Hub, click on its name.
1. Under **Entities** in the middle configuration window, click **Event Hubs** again.
1. Select the name of the Event Hub to configure it.

    ![consumer-group][2]

1. Under **Entities**, select **Consumer groups**.
1. Make sure you create a consumer group that is used exclusively by your TSI event source.

    > [!IMPORTANT]
    > Make sure this consumer group is not used by any other service (such as Stream Analytics job or another TSI environment). If the consumer group is used by other services, read operation is negatively affected for this environment and the other services. If you are using `$Default` as the consumer group, it could lead to potential reuse by other readers.

1. Under the **Settings** heading, select **Share access policies**.
1. On the event hub, create **MySendPolicy** that is used to send events in the C# sample.

    ![shared=access-one][3]

    ![shared-access-two][4]

## Add Time Series Insights instances

The TSI update uses instances to add contextual data to incoming telemetry data. The data is joined at query time using a **Time Series ID**. The **Time Series ID** for the sample windmills project is `Id`. To learn more about Time Series Instances and **Time Series IDs**, read [Time Series Models](./time-series-insights-update-tsm.md).

### Create Time Series Insights event source

1. If you haven't created an event source, follow [these instructions](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-eventhub) to create an event source.
1. Specify the `timeSeriesId` – refer to [Time Series Models](./time-series-insights-update-tsm.md) to learn more about **Time Series IDs**.

### Push events (sample windmills)

1. Search for event hub in the search bar. Click **Event Hubs** in the returned list.
1. Select your event hub by clicking on its name.
1. Go to **Shared Access Policies** and then **RootManageSharedAccessKey**. Copy the **Connection sting-primary key**

   ![connection-string][5]

1. Go to https://tsiclientsample.azurewebsites.net/windFarmGen.html. This runs simulated windmill devices.
1. Paste the connection string copied from step three in the **Event Hub Connection String**.

    ![connection-string][6]

1. Click on **Click to Start**. The simulator will also generate an Instance JSON that you can use directly.
1. Go back to your Event Hub. You should see the new events being received by the hub:

   ![telemetry][7]

## Next steps

> [!div class="nextstepaction"]
> [View your environment in Time Series Insights Explorer](https://insights.timeseries.azure.com).

<!-- Images -->
[1]: media/send-events/updated.png
[2]: media/send-events/consumer-group.png
[3]: media/send-events/shared-access-policy.png
[4]: media/send-events/shared-access-policy-2.png
[5]: media/send-events/sample-code-connection-string.png
[6]: media/send-events/updated_two.png
[7]: media/send-events/telemetry.png