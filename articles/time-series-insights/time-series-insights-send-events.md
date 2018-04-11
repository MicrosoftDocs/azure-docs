---
title: How to send events to an Azure Time Series Insights environment | Microsoft Docs
description: This tutorial explains how to create and configure event hub and run a sample application to push events to be shown in Azure Time Series Insights.
services: time-series-insights
ms.service: time-series-insights
author: venkatgct
ms.author: venkatja
manager: jhubbard
editor: MarkMcGeeAtAquent
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: article
ms.date: 04/09/2018
---
# Send events to a Time Series Insights environment using event hub
This article explains how to create and configure event hub and run a sample application to push events. If you have an existing event hub with events in JSON format, skip this tutorial and view your environment in [Time Series Insights](https://insights.timeseries.azure.com).

## Configure an event hub
1. To create an event hub, follow instructions from the Event Hub [documentation](../event-hubs/event-hubs-create.md).

2. Search for **event hub** in the search bar. Click **Event Hubs** in the returned list.

3. Select your event hub by clicking on its name.

4. Under **Entities** in the middle configuration window, click **Event Hubs** again.

5. Select the name of the event hub to configure it.

  ![Select event hub consumer group](media/send-events/consumer-group.png)

6. Under **Entities**, select **Consumer groups**.
 
7. Make sure you create a consumer group that is used exclusively by your Time Series Insights event source.

   > [!IMPORTANT]
   > Make sure this consumer group is not used by any other service (such as Stream Analytics job or another Time Series Insights environment). If the consumer group is used by other services, read operation is negatively affected for this environment and the other services. If you are using “$Default” as the consumer group, it could lead to potential reuse by other readers.

8. Under the **Settings** heading, select **Share access policies**.

9. On the event hub, create **MySendPolicy** that is used to send events in the csharp sample.

  ![Select Shared access policies and click Add button](media/send-events/shared-access-policy.png)  

  ![Add new shared access policy](media/send-events/shared-access-policy-2.png)  

## Add Time Series Insights reference data set 
Using reference data in TSI contextualizes your telemetry data.  That context adds meaning to your data and makes it easier to filter and aggregate.  TSI joins reference data at ingress time and cannot retroactively join this data.  Therefore, it is critical to add reference data prior to adding an event source with data.  Data like location or sensor type are useful dimensions that you might want to join to a device/tag/sensor ID to make it easier to slice and filter.  

> [!IMPORTANT]
> Having a reference data set configured is critical when you upload historical data.

Ensure that you have reference data in place when you bulk upload historical data to TSI.  Keep in mind, TSI will immediately start reading from a joined event source if that event source has data.  It's useful to wait to join an event source to TSI until you have your reference data in place, especially if that event source has data in it. Alternatively, you can wait to push data to that event source until the reference data set is in place.

To manage reference data, there is the web-based user interface in the TSI Explorer, and there is a programmatic C# API. TSI Explorer has a visual user experience to upload files or paste-in existing reference data sets as JSON or CSV format. With the API, you can build a custom app when needed.

For more information on managing reference data in Time Series Insights, see the [reference data article](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-add-reference-data-set).

## Create Time Series Insights event source
1. If you haven't created an event source, follow [these instructions](time-series-insights-how-to-add-an-event-source-eventhub.md) to create an event source.

2. Specify **deviceTimestamp** as the timestamp property name – this property is used as the actual timestamp in the C# sample. The timestamp property name is case-sensitive and values must follow the format __yyyy-MM-ddTHH:mm:ss.FFFFFFFK__ when sent as JSON to event hub. If the property does not exist in the event, then the event hub enqueued time is used.

  ![Create event source](media/send-events/event-source-1.png)

## Sample code to push events
1. Go to the event hub policy named **MySendPolicy**. Copy the **connection string** with the policy key.

  ![Copy MySendPolicy connection string](media/send-events/sample-code-connection-string.png)

2. Run the following code that to send 600 events per each of the three devices. Update `eventHubConnectionString` with your connection string.

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using Microsoft.ServiceBus.Messaging;

namespace Microsoft.Rdx.DataGenerator
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var from = new DateTime(2017, 4, 20, 15, 0, 0, DateTimeKind.Utc);
            Random r = new Random();
            const int numberOfEvents = 600;

            var deviceIds = new[] { "device1", "device2", "device3" };

            var events = new List<string>();
            for (int i = 0; i < numberOfEvents; ++i)
            {
                for (int device = 0; device < deviceIds.Length; ++device)
                {
                    // Generate event and serialize as JSON object:
                    // { "deviceTimestamp": "utc timestamp", "deviceId": "guid", "value": 123.456 }
                    events.Add(
                        String.Format(
                            CultureInfo.InvariantCulture,
                            @"{{ ""deviceTimestamp"": ""{0}"", ""deviceId"": ""{1}"", ""value"": {2} }}",
                            (from + TimeSpan.FromSeconds(i * 30)).ToString("o"),
                            deviceIds[device],
                            r.NextDouble()));
                }
            }

            // Create event hub connection.
            var eventHubConnectionString = @"Endpoint=sb://...";
            var eventHubClient = EventHubClient.CreateFromConnectionString(eventHubConnectionString);

            using (var ms = new MemoryStream())
            using (var sw = new StreamWriter(ms))
            {
                // Wrap events into JSON array:
                sw.Write("[");
                for (int i = 0; i < events.Count; ++i)
                {
                    if (i > 0)
                    {
                        sw.Write(',');
                    }
                    sw.Write(events[i]);
                }
                sw.Write("]");

                sw.Flush();
                ms.Position = 0;

                // Send JSON to event hub.
                EventData eventData = new EventData(ms);
                eventHubClient.Send(eventData);
            }
        }
    }
}

```
## Supported JSON shapes
### Sample 1

#### Input

A simple JSON object.

```json
{
    "id":"device1",
    "timestamp":"2016-01-08T01:08:00Z"
}
```
#### Output - one event

|id|timestamp|
|--------|---------------|
|device1|2016-01-08T01:08:00Z|

### Sample 2

#### Input
A JSON array with two JSON objects. Each JSON object will be converted to an event.
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
#### Output - two events

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
#### Output - two events
Notice the property "location" is copied over to each of the event.

|location|events.id|events.timestamp|
|--------|---------------|----------------------|
|WestUs|device1|2016-01-08T01:08:00Z|
|WestUs|device2|2016-01-08T01:17:00Z|

### Sample 4

#### Input

A JSON object with a nested JSON array containing two JSON objects. This input demonstrates that the global properties may be represented by the complex JSON object.

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
#### Output - two events

|location|manufacturer.name|manufacturer.location|events.id|events.timestamp|events.data.type|events.data.units|events.data.value|
|---|---|---|---|---|---|---|---|
|WestUs|manufacturer1|EastUs|device1|2016-01-08T01:08:00Z|pressure|psi|108.09|
|WestUs|manufacturer1|EastUs|device2|2016-01-08T01:17:00Z|vibration|abs G|217.09|

### JSON shaping strategies
Let's use the following example of an event as a starting point, and then discuss issues related with it and strategies for mitigating those issues.

#### Payload 1:
```json
[{
            "messageId": "LINE_DATA",
            "deviceId": "FXXX",
            "timestamp": 1522355650620,
            "series": [{
                        "chId": 3,
                        "value": -3750.0
                  }, {
                        "chId": 13,
                        "value": 0.58015072345733643
                  }, {
                        "chId": 11,
                        "value": 800.0
                  }, {
                        "chId": 21,
                        "value": 0.0
                  }, {
                        "chId": 14,
                        "value": -999.0
                  }, {
                        "chId": 37,
                        "value": 2.445906400680542
                  }, {
                        "chId": 39,
                        "value": 0.0
                  }, {
                        "chId": 40,
                        "value": 1.0
                  }, {
                        "chId": 1,
                        "value": 1.0172575712203979
                  }
            ],
            "EventProcessedUtcTime": "2018-03-29T20:36:21.3245900Z",
            "PartitionId": 2,
            "EventEnqueuedUtcTime": "2018-03-29T20:34:11.0830000Z",
            "IoTHub": {
                  "MessageId": "<17xxx2xx-36x0-4875-9x1x-x428x41x1x68>",
                  "CorrelationId": "<x253x5xx-7xxx-4xx3-91x4-xxx3bx2xx0x3>",
                  "ConnectionDeviceId": "AAAA-ZZ-001",
                  "ConnectionDeviceGenerationId": "<123456789012345678>",
                  "EnqueuedTime": "2018-03-29T20:34:10.7990000Z",
                  "StreamId": null
            }
      }
]
 ```

If you push this array of events as a payload to TSI, it will be stored as one event per each measure value. Doing so can create an excess of events, which may not be ideal. Notice that you can use reference data in TSI to add meaningful names as properties.  For example, you can create reference data set with Key Property = chId:  

chId  Measure               Unit
24    Engine Oil Pressure   PSI
25    CALC Pump Rate        bbl/min

For more information on managing reference data in Time Series Insights, see the [reference data article](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-add-reference-data-set).

Another problem with the first payload is that timestamp is in milliseconds. TSI accepts only ISO formatted timestamps. One solution is to leave the default timestamp behavior in TSI, which is to use enqueued timestamp.

As an alternative to the payload above, let's look at another example.  

#### Payload 2:
```json
{
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "STATE Engine State": 1,
      "unit": "NONE"
}, {
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "MPC_AAAA-ZZ-001",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "Well Head Px 1": -494162.8515625,
      "unit": "psi"
}, {
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "CALC Pump Rate": 0,
      "unit": "bbl/min"
}, {
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "Engine Fuel Pressure": 0,
      "unit": "psi"
}, {
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "Engine Oil Pressure": 0.58015072345733643,
      "unit": "psi"
}
```

Like Payload 1, TSI will store each every measured value as a unique event.  The notable difference is that TSI will read the *timestamp* as correctly here, as ISO.  

If you need to reduce the number of events sent, then you could send the information as the following.  

#### Payload 3:
```json
{
      "line": "Line01",
      "station": "Station 11",
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "CALC Pump Rate": 0,
      "CALC Pump Rate.unit": "bbl/min"
      "Engine Oil Pressure": 0.58015072345733643,
      "Engine Oil Pressure.unit": "psi"
      "Engine Fuel Pressure": 0,
      "Engine Fuel Pressure.unit": "psi"
}
```
One final suggestion is below.

#### Payload 4:
```json
{
              "line": "Line01",
              "station": "Station 11",
              "gatewayid": "AAAA-ZZ-001",
              "deviceid": "F12XX",
              "timestamp": "2018-03-29T20:34:15.0000000Z",
              "CALC Pump Rate": {
                           "value": 0,
                           "unit": "bbl/min"
              },
              "Engine Oil Pressure": {
                           "value": 0.58015072345733643,
                           "unit": "psi"
              },
              "Engine Fuel Pressure": {
                           "value": 0,
                           "unit": "psi"
              }
}
```

This example shows the output after flattening the JSON:

```json
{
      "line": "Line01",
      "station": "Station 11",,
      "gatewayid": "AAAA-ZZ-001",
      "deviceid": "F12XX",
      "timestamp": "2018-03-29T20:34:15.0000000Z",
      "CALC Pump Rate.value": 0,
      "CALC Pump Rate.unit": "bbl/min"
      "Engine Oil Pressure.value": 0.58015072345733643,
      "Engine Oil Pressure.unit": "psi"
      "Engine Fuel Pressure.value": 0,
      "Engine Fuel Pressure.unit": "psi"
}
```

You have the freedom to define different properties for each of the channels inside its own json object, while still keeping the event count low. This flattened approach does occupy more space, which is important to consider. TSI capacity is based on both events and size, whichever comes first.

## Next steps
> [!div class="nextstepaction"]
> [View your environment in Time Series Insights explorer](https://insights.timeseries.azure.com).
