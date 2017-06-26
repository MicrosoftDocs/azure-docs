---
title: Diagnose and solve problems | Microsoft Docs
description: This tutorial covers how to diagnose and solve problems in your Time Series Insights environment
keywords: 
services: time-series-insights
documentationcenter: 
author: venkatgct
manager: almineev
editor: cgronlun

ms.assetid: 
ms.service: time-series-insights
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/24/2017
ms.author: venkatja
---
# Diagnose and solve problems

## I do not see my data
Here are some reasons why you might not see your data in your environment in [Time Series Insights Portal](https://insights.timeseries.azure.com).

### Does your event source have data in JSON format?
Azure Time Series Insights supports only JSON data today. For JSON samples, see the section *Supported JSON shapes* [here](time-series-insights-send-events.md#supported-json-shapes).

### When registering your event source, did you provide the key with required permissions?
1. For IoTHub, you need to provide the key with *service connect* permission.

   ![IotHub service connect permission](media/diagnose-and-solve-problems/iothub-serviceconnect-permissions.png)

   As shown in the preceding image, either of the policies “iothubowner” or “service” would work, since both have “service connect” permission.
2. For EventHub, you need to provide the key with *Listen* permission.

   ![Event hub listen permission](media/diagnose-and-solve-problems/eventhub-listen-permissions.png)

   As shown in the preceding image, either of the policies “read” or “manage” would work, since both have “read” permission

### Are you sure that the consumer group provided is exclusive to Time Series Insights?
For IoTHub or EventHub, during registration we require you to specify the consumer group that should be used when reading your data. This consumer group must not be shared. If shared, the underlying event hub automatically disconnects one of the readers randomly.

## I see my data, but there is a lag
Here are some reasons why you might see partial data in your environment in [Time Series Insights Portal](https://insights.timeseries.azure.com).

### Your environment might be getting throttled
Throttling limit is enforced based on environment SKU kind and capacity. All event sources within the environment share this capacity. If your event hub / IoT hub event source is pushing data beyond the enforced limits, you see throttling and lag.

The following diagram shows a Time Series Insights environment with SKU S1 and capacity 3. It can ingress 3 million events per day.

![Environment sku current capacity](media/diagnose-and-solve-problems/environment-sku-current-capacity.png)

Assume this environment was ingesting messages from an event hub with ingress rate as shown in the following diagram:

![Environment sku current capacity](media/diagnose-and-solve-problems/eventhub-ingress-rate.png)

As shown in the diagram, the daily ingress rate is ~67,000 messages. This rate translates roughly to 46 messages every minute. If each event hub message is flattened to a single Time Series Insights event, this environment sees no throttling. If each event hub message is flattened to 100 Time Series Insights events, then 4,600 events should be ingested every minute. An S1 SKU environment with a capacity of three can only ingress 2,100 events every minute. (1 million events per day => 700 events per minute, 3 units => 2100 events per minute). Therefore you see lag due to throttling. For a high-level understanding on flattening logic works, see the section *Supported JSON shapes* [here](time-series-insights-send-events.md#supported-json-shapes).

#### Recommended steps
To fix lag, increase the SKU capacity of your environment. [How to scale your Time Series Insights environment](time-series-insights-how-to-scale-your-environment.md)

### You might be pushing historical data and hence the slow ingress
If you are connecting an existing event source, it is likely that your event hub / IoT hub already has data in it. So the environment starts pulling data from the very beginning of the event source message retention period. This behavior is the default behavior and cannot be overridden. Throttling may be engaged and it may take a while to catch up ingesting historical data.

#### Recommended steps
To fix lag, do the following steps:
1. Increase the SKU capacity to the max allowed value (10 in this case). Once the capacity is increased, the ingress process starts catching up much faster. You can visualize how quickly we are catching up through the availability chart in [Time Series Insights Portal](https://insights.timeseries.azure.com). You are charged for the increased capacity.
2. Once the lag is caught up, decrease the SKU capacity back to your normal ingress rate.

## My event source *timestamp property name* setting does not work
Ensure that the name and value conforms to the following rules:
1. The timestamp property name is __case-sensitive__.
2. The timestamp property value coming from your event source, as a JSON string, should have the format __yyyy-MM-ddTHH:mm:ss.FFFFFFFK__. An example of such a string is “2008-04-12T12:53Z”.