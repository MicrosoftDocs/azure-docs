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

### Shape the JSON in your events
It's important to think about how you send events to Time Series Insights to ensure for two major reasons.

1. To send data over the network more efficiently.  
2. To ensure your data is stored in a way that enables you to perform aggregations on it that is suitable for your scenario.  

Let's use the following example of an event as a starting point, and then discuss pros and cons.

We'll start with a fairly typical message, a single-item JSON array, to use as a sample payload. 

#### Payload 1:
```json
[{
            "messageId": "LINE_DATA",
            "deviceId": "FXXX",
            "timestamp": "2018-01-17T01:17:00Z"
            "series": [{
                        "tagId": 3,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": -3750.0
                  }, {
                        "tagId": 13,
                        "type": "CALC Pump Rate",
                        "unit": "psi",
                        "value": 0.58015072345733643
                  }, {
                        "tagId": 11,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 800.0
                  }, {
                        "tagId": 21,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 0.0
                  }, {
                        "tagId": 14,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": -999.0
                  }, {
                        "tagId": 37,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 2.445906400680542
                  }, {
                        "tagId": 39,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 0.0
                  }, {
                        "tagId": 40,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 1.0
                  }, {
                        "tagId": 1,
                        "type": "CALC Pump Rate", 
                        "unit": "psi",
                        "value": 1.0172575712203979
                  }
            ],
            }
      }
]
 ```

If the above message is sent to TSI, it will be stored as one event/per measure value, in this case 9 events. This JSON shape enables split-bys of messageId, deviceId, tagId, type, unit, and value.  This JSON shape enables aggregations like sum, count, avg, min, and max of the value of each unit corresponding to the event properties.  In the above example, messageId, timestampId, and deviceId are all the same, so this payload is smaller because this information was only conveyed once.  However, notice that the type and unit of measure are repeated with each tagId.  If these two properties are static, this is not ideal and these  properties would be good candidates for reference data, assuming they are always consistant.  For example, you can create reference data set with Key Property = tagId:  


|tagId|type|unit|
|--------|---------------|----------------------|
|13|CALC Pump Rate|PSI|
|11|CALC Pump Rate|PSI|
|21|CALC Pump Rate|PSI|
|14|CALC Pump Rate|PSI|
|37|CALC Pump Rate|PSI|
|39|CALC Pump Rate|PSI|
|40|CALC Pump Rate|PSI|
|1|CALC Pump Rate|PSI|

For more information on managing reference data in Time Series Insights, see the [reference data article](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-add-reference-data-set).

As Time Series Insights ingests this data, we flatten it to store it as rows and columns.  There is no data loss during the process, but to make search performance we flatten nested values to a dot-like notation.  Here is what the above payload would like flattened.  

[!Note - The flattened file would be exactly the same if you employed the reference data set above in lieu of sending 'type' and 'unit' in each nested event.]

|messageId|deviceId|timestamp|series.tagId|series.type|series.unit|series.value|
|--------|---------------|----------------------|----------------------|----------------------|----------------------|----------------------|
|LINE_DATA|FXXX|2018-01-17T01:17:00|3|CALC Pump Rate|PSI|-3750.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|13|CALC Pump Rate|PSI|0.58015072345733643|
|LINE_DATA|FXXX|2018-01-17T01:17:00|11|CALC Pump Rate|PSI|800.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|21|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|14|CALC Pump Rate|PSI|-999.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|37|CALC Pump Rate|PSI|2.445906400680542|
|LINE_DATA|FXXX|2018-01-17T01:17:00|39|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|40|CALC Pump Rate|PSI|1.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|1|CALC Pump Rate|PSI|1.0172575712203979|


As an alternative to the payload above, let's look at another example.  

#### Payload 2:
```json
[{
            "messageId": "LINE_DATA",
            "deviceId": "FXXX",
            "timestamp": "2018-01-17T01:17:00Z"
            "type": "CALC Pump Rate"
            "unit": "psi"
            "series": [{
                        "tagId": 3,
                        "value": -3750.0
                  }, {
                        "tagId": 13,
                        "value": 0.58015072345733643
                  }, {
                        "tagId": 11,
                        "value": 800.0
                  }, {
                        "tagId": 21,
                        "value": 0.0
                  }, {
                        "tagId": 14,
                        "value": -999.0
                  }, {
                        "tagId": 37,
                        "value": 2.445906400680542
                  }, {
                        "tagId": 39,
                        "value": 0.0
                  }, {
                        "tagId": 40,
                        "value": 1.0
                  }, {
                        "tagId": 1,
                        "value": 1.0172575712203979
                  }
            ],
            }
      }
]
```

Assuming the tagId's have multiple sensors, and therefore may need to convey different 'types' and 'units, we could use the above strategy to embed these properties into the message.  This is more efficient payload if all the nested events have the same type.  Below is another example, but showing as if each tag/device had different types and units.  The flattened payload would look identical to the previous example:

|messageId|deviceId|timestamp|series.tagId|series.type|series.unit|series.value|
|--------|---------------|----------------------|----------------------|----------------------|----------------------|----------------------|
|LINE_DATA|FXXX|2018-01-17T01:17:00|3|CALC Pump Rate|PSI|-3750.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|13|CALC Pump Rate|PSI|0.58015072345733643|
|LINE_DATA|FXXX|2018-01-17T01:17:00|11|CALC Pump Rate|PSI|800.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|21|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|14|CALC Pump Rate|PSI|-999.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|37|CALC Pump Rate|PSI|2.445906400680542|
|LINE_DATA|FXXX|2018-01-17T01:17:00|39|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|40|CALC Pump Rate|PSI|1.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|1|CALC Pump Rate|PSI|1.0172575712203979|

#### Payload 3:
```json
[
{
            "messageId": "LINE_DATA",
            "deviceId": "FXXX",
            "timestamp": "2018-01-17T01:17:00Z",
            "type": "CALC Pump Rate",
            "unit": "psi",
            "series": [{
                        "tagId": 3,
                        "value": -3750.0
                  }, {
                        "tagId": 13,
                        "value": 0.58015072345733643
                  }, {
                        "tagId": 11,
                        "value": 800.0
                  }, {
                        "tagId": 21,
                        "value": 0.0
                  }, {
                        "tagId": 14,
                        "value": -999.0
                  }, {
                        "tagId": 37,
                        "value": 2.445906400680542
                  }, {
                        "tagId": 39,
                        "value": 0.0
                  }, {
                        "tagId": 40,
                        "value": 1.0
                  }, {
                        "tagId": 1,
                        "value": 1.0172575712203979
                  }
            ],
 },
 {
            "messageId": "LINE_DATA",
            "deviceId": "FXXX",
            "timestamp": "2018-01-17T01:17:00Z",
            "type": "Engine Oil Pressure",
            "unit": "bbl/min",
            "series": [{
                        "tagId": 3,
                        "value": 34.7
                  }, {
                        "tagId": 13,
                        "value": 49.2
                  }, {
                        "tagId": 11,
                        "value": 22.2
                  }, {
                        "tagId": 21,
                        "value": 37.9
                  }, {
                        "tagId": 14,
                        "value": 37.6
                  }, {
                        "tagId": 37,
                        "value": 51.0
                  }, {
                        "tagId": 39,
                        "value": 33.8
                  }, {
                        "tagId": 40,
                        "value": 19.9
                  }, {
                        "tagId": 1,
                        "value": 43.6
                  }
             ]
      }
]
```
The nested JSON objects inside the JSON array above would generate 18 unique events (9 events per object).  Notice here that my tagId's remain the same, but assuming they have multiple sensor types and each type has a unique unit of measure, I can nest these objects in the same payload.  This is an efficient transfer of data, saving bytes by reducing redundant properties, yet still enabling powerful aggregations over the properties.  For example, you could run an aggregation by "series.type" (in the explorer, you would use the 'split by' element of the term to accomplish this), that aggregates based on two dimension values, "Engine Oil Pressure" or "CALC Pump Rate". You could also use measure, which includes operators like minimum, maximum, and average, on series.tagId or series.value.

|messageId|deviceId|timestamp|series.tagId|series.type|series.unit|series.value|
|--------|---------------|----------------------|----------------------|----------------------|----------------------|----------------------|
|LINE_DATA|FXXX|2018-01-17T01:17:00|3|CALC Pump Rate|PSI|-3750.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|13|CALC Pump Rate|PSI|0.58015072345733643|
|LINE_DATA|FXXX|2018-01-17T01:17:00|11|CALC Pump Rate|PSI|800.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|21|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|14|CALC Pump Rate|PSI|-999.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|37|CALC Pump Rate|PSI|2.445906400680542|
|LINE_DATA|FXXX|2018-01-17T01:17:00|39|CALC Pump Rate|PSI|0.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|40|CALC Pump Rate|PSI|1.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|1|CALC Pump Rate|PSI|1.0172575712203979|
|LINE_DATA|FXXX|2018-01-17T01:17:00|3|Engine Oil Pressure|bbl/min|34.7|
|LINE_DATA|FXXX|2018-01-17T01:17:00|13|Engine Oil Pressure|bbl/min|49.2|
|LINE_DATA|FXXX|2018-01-17T01:17:00|11|Engine Oil Pressure|bbl/min|22.2|
|LINE_DATA|FXXX|2018-01-17T01:17:00|21|Engine Oil Pressure|bbl/min|37.9|
|LINE_DATA|FXXX|2018-01-17T01:17:00|14|Engine Oil Pressure|bbl/min|37.6|
|LINE_DATA|FXXX|2018-01-17T01:17:00|37|Engine Oil Pressure|bbl/min|51.0|
|LINE_DATA|FXXX|2018-01-17T01:17:00|39|Engine Oil Pressure|bbl/min|33.8|
|LINE_DATA|FXXX|2018-01-17T01:17:00|40|Engine Oil Pressure|bbl/min|19.9|
|LINE_DATA|FXXX|2018-01-17T01:17:00|1|Engine Oil Pressure|bbl/min|43.6|



## Next steps
> [!div class="nextstepaction"]
> [View your environment in Time Series Insights explorer](https://insights.timeseries.azure.com).
