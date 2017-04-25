---
title: Diagnose and solve problems | Microsoft Docs
description: This tutorial covers how to diagnose and solve problems in your Time Series Insights environment
keywords: 
services: time-series-insights
documentationcenter: 
author: venkatgcg
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
Here are some the reasons why you might not see your data.

### Does your event source have data in JSON format?
Azure Time Series Insights supports only JSON data today. For JSON samples click [here](time-series-insights-send-events.md##Supported-JSON-shapes).

### When registering your event source, did you provide the key with read permissions?
1. For IoTHub, you need to provide the key with *service connect* permission.

   ![IotHub service connect permission](media/diagnose-and-solve-problems/iothub-serviceconnect-permissions.png)

   As shown in the image above, either of the policies “iothubowner” or “service” would work, since both have “service connect” permission.
2. For EventHub, you need to provide the key with *Listen* permission.

   ![Event hub listen permission](media/diagnose-and-solve-problems/eventhub-listen-permissions.png)

   As shown in the image above, either of the policies “read” or “manage” would work, since both have “read” permission

### Are you sure that the consumer group provided is exclusive to Time Series Insights?
For IoTHub or EventHub, during registration we require you to specify the consumer group that should be used when reading your data. This consumer group should not be shared. Underlying event hub will automatically disconnect one of the readers randomly, if shared.

## I see data, but there is a lag
Here are some the reasons why you might see partial data.

### You might be getting throttled
Remember that you specified the SKU and capacity when creating an environment. Throttling limits will be enforced based on this. All event sources within the environment will share this capacity. Make sure that your event hub / IoT hub is pushing data within these limits.
The image below show a Time Series Insights environment with SKU S1 and capacity 3. It can ingress 3M events every day.

![Environment sku current capacity](media/diagnose-and-solve-problems/environment-sku-current-capacity.png)

Assume that this environment was ingesting messages from an event hub with ingress rate as shown below. 

![Environment sku current capacity](media/diagnose-and-solve-problems/eventhub-ingress-rate.png)

As you can see, the image above shows that the daily ingress rate was ~67000 messages. This translates to roughly 46 messages / minute. If each event hub message is flattened to a single Time Series Insights event, then for the environment above, there will not be any throttling. If each event hub message can be flattened to 100 Time Series Insights events, then you will see throttling. This is because, 46 * 100 events have to be ingested every minute. But, an S1 SKU with a capacity of 3, can only ingest 2100 events every minute (1M/day = 700/minute, 3 units => 2100/minute). For a high-level understanding on flattening logic works, see these JSON [samples](time-series-insights-send-events.md##Supported-JSON-shapes).

#### Recommended steps
In order to fix this issue, increase the capacity of your SKU.

### You might be pushing historical data and hence the slow ingress
If you are connecting an existing event source, it is likely that your event hub / IoT hub already has data in it. In such a case, the environment will start pulling data from the very beginning on your message retention in your event source. Today, this is the default behavior and cannot be overridden. Even in this case, throttling will be engaged and it is likely that it will take a while to catch up.

#### Recommended steps
In order to fix this issue, do the following:
1. Increase the capacity to the max allowed value (10 in this case). Once this is done, the ingress process will start catching up much faster. You can visualize how quickly we are catching up through the availability chart in [time series explorer](https://insights.timeseries.azure.com). Please note that, you will be charged for the increased capacity.
2. Once the lag has been caught up, bring down the capacity to your normal ingress rate.

## My event source *timestamp property name* setting does not work
Ensure that the name and value conforms to the following.
1. The timestamp property name is __case sensitive__. 
2. The timestamp property value coming from your event source, as a JSON string, should have the format __yyyy-MM-ddTHH:mm:ss.FFFFFFFK__. An example of such a string is “2008-04-12T12:53Z”.