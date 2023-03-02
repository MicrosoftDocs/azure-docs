---
title: 'Send events to an environment - Azure Time Series Insights | Microsoft Docs'
description: Learn how to configure an event hub, run a sample application, and send events to your Azure Time Series Insights environment.
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/30/2020
ms.custom: seodec18
---

# Send events to an Azure Time Series Insights Gen1 environment by using an event hub

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

> [!CAUTION]
> This is a Gen1 article.

This article explains how to create and configure an event hub in Azure Event Hubs. It also describes how to run a sample application to push events to Azure Time Series Insights from Event Hubs. If you have an existing event hub with events in JSON format, skip this tutorial and view your environment in [Azure Time Series Insights](./tutorial-set-up-environment.md).

## Configure an event hub

1. To learn how to create an event hub, read the [Event Hubs documentation](../event-hubs/index.yml).
1. In the search box, search for **Event Hubs**. In the returned list, select **Event Hubs**.
1. Select your event hub.
1. When you create an event hub, you're creating an event hub namespace. If you haven't yet created an event hub within the namespace, on the menu, under **Entities**, create an event hub.

    [![List of event hubs](media/send-events/tsi-connect-event-hub-namespace.png)](media/send-events/tsi-connect-event-hub-namespace.png#lightbox)

1. After you create an event hub, select it in the list of event hubs.
1. On the menu, under **Entities**, select **Event Hubs**.
1. Select the name of the event hub to configure it.
1. Under **Overview**, select **Consumer groups**, and then select **Consumer Group**.

    [![Create a consumer group](media/send-events/add-event-hub-consumer-group.png)](media/send-events/add-event-hub-consumer-group.png#lightbox)

1. Make sure you create a consumer group that's used exclusively by your Azure Time Series Insights event source.

    > [!IMPORTANT]
    > Make sure this consumer group isn't used by any other service, such as an Azure Stream Analytics job or another Azure Time Series Insights environment. If the consumer group is used by the other services, read operations are negatively affected both for this environment and for other services. If you use **$Default** as the consumer group, other readers might potentially reuse your consumer group.

1. On the menu, under **Settings**, select **Shared access policies**, and then select **Add**.

    [![Select Shared access policies, and then select the Add button](media/send-events/add-shared-access-policy.png)](media/send-events/add-shared-access-policy.png#lightbox)

1. In the **Add new shared access policy** pane, create a shared access named **MySendPolicy**. You use this shared access policy to send events in the C# examples later in this article.

    [![In the Policy name box, enter MySendPolicy](media/send-events/configure-shared-access-policy-confirm.png)](media/send-events/configure-shared-access-policy-confirm.png#lightbox)

1. Under **Claim**, select the **Send** check box.

## Add an Azure Time Series Insights instance

In Azure Time Series Insights Gen2, you can add contextual data to incoming telemetry using the Time Series Model (TSM). In TSM, your tags or signals are referred to as *instances,* and you can store contextual data in *instance fields.* The data is joined at query time by using a **Time Series ID**. The **Time Series ID** for the sample windmills project that we use later in this article is `id`. To learn more about storing data in instance fields read the [Time Series Model](./concepts-model-overview.md) overview.

### Create an Azure Time Series Insights event source

1. If you haven't created an event source, complete the steps to [create an event source](./how-to-ingest-data-event-hub.md).

1. Set a value for `timeSeriesId`. To learn more about **Time Series ID**, read [Time Series Models](./concepts-model-overview.md).

### Push events to windmills sample

1. In the search bar, search for **Event Hubs**. In the returned list, select **Event Hubs**.

1. Select your event hub instance.

1. Go to **Shared Access Policies** > **MySendPolicy**. Copy the value for **Connection string-primary key**.

    [![Copy the value for the primary key connection string](media/send-events/configure-sample-code-connection-string.png)](media/send-events/configure-sample-code-connection-string.png#lightbox)

1. Navigate to the [TSI Sample Wind Farm Pusher](https://tsiclientsample.azurewebsites.net/windFarmGen.html). The site creates and runs simulated windmill devices.
1. In the **Event Hub Connection String** box on the webpage, paste the connection string that you copied in the [windmill input field](#push-events-to-windmills-sample).

    [![Paste the primary key connection string in the Event Hub Connection String box](media/send-events/configure-wind-mill-sim.png)](media/send-events/configure-wind-mill-sim.png#lightbox)

1. Select **Click to start**.

    > [!TIP]
    > The windmill simulator also creates JSON you can use as a payload with the [Azure Time Series Insights GA Query APIs](/rest/api/time-series-insights/gen1-query).

    > [!NOTE]
    > The simulator will continue to send data until the browser tab is closed.

1. Go back to your event hub in the Azure portal. On the **Overview** page, the new events received by the event hub are displayed.

    [![An event hub Overview page that shows metrics for the event hub](media/send-events/review-windmill-telemetry.png)](media/send-events/review-windmill-telemetry.png#lightbox)

## Supported JSON shapes

### Example one

* **Input**: A simple JSON object.

    ```JSON
    {
        "id":"device1",
        "timestamp":"2016-01-08T01:08:00Z"
    }
    ```

* **Output**: One event.

    |id|timestamp|
    |--------|---------------|
    |device1|2016-01-08T01:08:00Z|

### Example two

* **Input**: A JSON array with two JSON objects. Each JSON object is converted to an event.

    ```JSON
    [
        {
            "id":"device1",
            "timestamp":"2016-01-08T01:08:00Z"
        },
        {
            "id":"device2",
            "timestamp":"2016-01-17T01:17:00Z"
        }
    ]
    ```

* **Output**: Two events.

    |id|timestamp|
    |--------|---------------|
    |device1|2016-01-08T01:08:00Z|
    |device2|2016-01-08T01:17:00Z|

### Example three

* **Input**: A JSON object with a nested JSON array that contains two JSON objects.

    ```JSON
    {
        "location":"WestUs",
        "events":[
            {
                "id":"device1",
                "timestamp":"2016-01-08T01:08:00Z"
            },
            {
                "id":"device2",
                "timestamp":"2016-01-17T01:17:00Z"
            }
        ]
    }
    ```

* **Output**: Two events. The property **location** is copied over to each event.

    |location|events.id|events.timestamp|
    |--------|---------------|----------------------|
    |WestUs|device1|2016-01-08T01:08:00Z|
    |WestUs|device2|2016-01-08T01:17:00Z|

### Example four

* **Input**: A JSON object with a nested JSON array that contains two JSON objects. This input demonstrates that global properties can be represented by the complex JSON object.

    ```JSON
    {
        "location":"WestUs",
        "manufacturer":{
            "name":"manufacturer1",
            "location":"EastUs"
        },
        "events":[
            {
                "id":"device1",
                "timestamp":"2016-01-08T01:08:00Z",
                "data":{
                    "type":"pressure",
                    "units":"psi",
                    "value":108.09
                }
            },
            {
                "id":"device2",
                "timestamp":"2016-01-17T01:17:00Z",
                "data":{
                    "type":"vibration",
                    "units":"abs G",
                    "value":217.09
                }
            }
        ]
    }
    ```

* **Output**: Two events.

    |location|manufacturer.name|manufacturer.location|events.id|events.timestamp|events.data.type|events.data.units|events.data.value|
    |---|---|---|---|---|---|---|---|
    |WestUs|manufacturer1|EastUs|device1|2016-01-08T01:08:00Z|pressure|psi|108.09|
    |WestUs|manufacturer1|EastUs|device2|2016-01-08T01:17:00Z|vibration|abs G|217.09|

## Next steps

* [View your environment](https://insights.timeseries.azure.com) in the Azure Time Series Insights Explorer.

* Read more about [IoT Hub device messages](../iot-hub/iot-hub-devguide-messages-construct.md)