---
title: Send events to an Azure Time Series Insights environment | Microsoft Docs
description: Learn how to configure an event hub and run a sample application to push events you can view in Azure Time Series Insights.
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

# Send events to a Time Series Insights environment by using an event hub

This article explains how to create and configure an event hub in Azure Event Hubs, and then run a sample application to push events. If you have an existing event hub that has events in JSON format, skip this tutorial and view your environment in [Azure Time Series Insights](./time-series-insights-update-create-environment.md).

## Configure an event hub

1. To learn how to create an event hub, see the [Event Hubs documentation](https://docs.microsoft.com/azure/event-hubs/).
1. In the search box, search for **Event Hubs**. In the returned list, select **Event Hubs**.
1. Select your event hub.
1. When you create an event hub, you are really creating an event hub namespace. If you haven't yet created an event hub within the namespace, in the menu, under **Entities**, create an event hub.  

    ![List of event hubs][1]

1. After you create an event hub, select it in the list of event hubs.
1. In the menu, under **Entities**, select **Event Hubs**.
1. Select the name of the event hub to configure it.
1. Under **Entities**, select **Consumer groups**.

    ![Create a consumer group][2]

1. Make sure you create a consumer group that is used exclusively by your Time Series Insights event source.

    > [!IMPORTANT]
    > Make sure this consumer group isn't used by any other service (such as an Azure Stream Analytics job or another Time Series Insights environment). If the consumer group is used by the other services, read operations are negatively affected both for this environment and for other services. If you use **$Default** as the consumer group, other readers might potentially reuse your consumer group.

1. In the menu, under **Settings**, select **Shared access policies**.

    ![Select Shared access policies, and then select the Add button][3]

1. In the **Add new shared access policy** pane, create a shared access named **MySendPolicy**. You'll use this shared access policy to send events in the C# examples later in this article.

    ![In the Policy name box, enter MySendPolicy][4]

1. Under **Claim**, select the **Send** checkbox.

## Add a Time Series Insights instance

The Time Series Insights update uses instances to add contextual data to incoming telemetry data. The data is joined at query time by using a **Time Series ID**. The **Time Series ID** for the sample windmills project that we use later in this article is **Id**. To learn more about Time Series Insight instances and **Time Series ID**, see [Time Series Models](./time-series-insights-update-tsm.md).

### Create a Time Series Insights event source

1. If you haven't created an event source, complete the steps to [create an event source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-eventhub).
1. Set a value for `timeSeriesId`. To learn more about **Time Series ID**, see [Time Series Models](./time-series-insights-update-tsm.md).

### <a name="push-events"></a>Push events (windmills sample)

1. In the search bar, search for **Event Hubs**. In the returned list, select **Event Hubs**.
1. Select your event hub.
1. Go to **Shared Access Policies** > **RootManageSharedAccessKey**. Copy the value for **Connection sting-primary key**.

   ![Copy the value for the primary key connection string][5]

1. Go to https://tsiclientsample.azurewebsites.net/windFarmGen.html. The URL runs simulated windmill devices.
1. In the **Event Hub Connection String** box on the webpage, paste the connection string that you copied in [Push events](#push-events).

    ![Paste the primary key connection string in the Event Hub Connection String box][6]

1. Select **Click to start**. The simulator generates instance JSON that you can use directly.
1. Go back to your event hub in the Azure portal. On the **Overview** page, you should see the new events being received by the event hub:

   ![An event hub Overview page that shows metrics for the event hub][7]

<a id="json"></a>

## Supported JSON shapes

### Sample 1

#### Input

A simple JSON object:

```json
{
    "id":"device1",
    "timestamp":"2016-01-08T01:08:00Z"
}
```

#### Output: One event

|id|timestamp|
|--------|---------------|
|device1|2016-01-08T01:08:00Z|

### Sample 2

#### Input

A JSON array with two JSON objects. Each JSON object is converted to an event.

```json
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

#### Output: Two events

|id|timestamp|
|--------|---------------|
|device1|2016-01-08T01:08:00Z|
|device2|2016-01-08T01:17:00Z|

### Sample 3

#### Input

A JSON object with a nested JSON array that contains two JSON objects:

```json
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

#### Output: Two events

The property **location** is copied over to each event.

|location|events.id|events.timestamp|
|--------|---------------|----------------------|
|WestUs|device1|2016-01-08T01:08:00Z|
|WestUs|device2|2016-01-08T01:17:00Z|

### Sample 4

#### Input

A JSON object with a nested JSON array that contains two JSON objects. This input demonstrates that global properties can be represented by the complex JSON object.

```json
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

#### Output: Two events

|location|manufacturer.name|manufacturer.location|events.id|events.timestamp|events.data.type|events.data.units|events.data.value|
|---|---|---|---|---|---|---|---|
|WestUs|manufacturer1|EastUs|device1|2016-01-08T01:08:00Z|pressure|psi|108.09|
|WestUs|manufacturer1|EastUs|device2|2016-01-08T01:17:00Z|vibration|abs G|217.09|

## Next steps

> [!div class="nextstepaction"]
> [View your environment](https://insights.timeseries.azure.com) in the Time Series Insights explorer.

<!-- Images -->
[1]: media/send-events/updated.png
[2]: media/send-events/consumer-group.png
[3]: media/send-events/shared-access-policy.png
[4]: media/send-events/shared-access-policy-2.png
[5]: media/send-events/sample-code-connection-string.png
[6]: media/send-events/updated_two.png
[7]: media/send-events/telemetry.png