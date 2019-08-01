---
title: 'Diagnose, troubleshoot, and solve issues in Azure Time Series Insights | Microsoft Docs'
description: This article describes how to diagnose, troubleshoot, and solve common issues you might encounter in your Azure Time Series Insights environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: dpalled
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile
ms.workload: big-data
ms.topic: troubleshooting
ms.date: 05/07/2019
ms.custom: seodec18
---

# Diagnose and solve issues in your Time Series Insights environment

This article describes some issues you might encounter in your Azure Time Series Insights environment. The article offers potential causes and solutions for resolution.

## Video

### Learn about common Time Series Insights customer challenges and mitigations.</br>

> [!VIDEO https://www.youtube.com/embed/7U0SwxAVSKw]

## Problem: no data is shown

No data in the [Azure Time Series Insights explorer](https://insights.timeseries.azure.com) might occur for several common reasons:

### Cause A: event source data isn't in JSON format

Azure Time Series Insights only supports JSON data. For JSON samples, see [Supported JSON shapes](./how-to-shape-query-json.md).

### Cause B: the event source key is missing a required permission

* For an IoT hub in Azure IoT Hub, you must provide the key that has **service connect** permissions. Either of the **iothubowner** or **service** policies will work because they both have **service connect** permissions.

   [![IoT Hub service connect permissions](media/diagnose-and-solve-problems/iothub-serviceconnect-permissions.png)](media/diagnose-and-solve-problems/iothub-serviceconnect-permissions.png#lightbox)

* For an event hub in Azure Event Hubs, you must provide the key that has **listen** permissions. Either of the **read** or **manage** policies will work because they both have **listen** permissions.

   [![Event hub listen permissions](media/diagnose-and-solve-problems/eventhub-listen-permissions.png)](media/diagnose-and-solve-problems/eventhub-listen-permissions.png#lightbox)

### Cause C: the consumer group provided isn't exclusive to Time Series Insights

When you register an IoT hub or an event hub, it's important to set the consumer group that you want to use to read the data. This consumer group *can't be shared*. If the consumer group is shared, the underlying IoT hub or event hub automatically and randomly disconnects one of the readers. Provide a unique consumer group for Time Series Insights to read from.

## Problem: some data is shown, but data is missing

When data appears only partially and the data appears to be lagging, you should consider several possibilities.

### Cause A: your environment is being throttled

Throttling is a common issue when environments are provisioned after you create an event source that has data. Azure IoT Hub and Azure Events Hubs store data for up to seven days. Time Series Insights always start with the oldest event in the event source (first-in, first-out, or *FIFO*).

For example, if you have 5 million events in an event source when you connect to an S1, single-unit Time Series Insights environment, Time Series Insights reads approximately 1 million events per day. It might look like Time Series Insights is experiencing five days of latency. However, what's happening is that the environment is being throttled.

If you have old events in your event source, you can approach throttling in one of two ways:

- Change your event source's retention limits to help remove old events that you don't want to show up in Time Series Insights.
- Provision a larger environment size (number of units) to increase the throughput of old events. Using the preceding example, if you increase the same S1 environment to five units for one day, the environment should catch up within a day. If your steady-state event production is 1 million or fewer events per day, you can reduce the capacity of the event to one unit after it catches up.

The throttling limit is enforced based on the environment's SKU type and capacity. All event sources in the environment share this capacity. If the event source for your IoT hub or event hub pushes data beyond the enforced limits, you see throttling and a lag.

The following figure shows a Time Series Insights environment that has an SKU of S1 and a capacity of 3. It can ingress 3 million events per day.

![Environment SKU current capacity](media/diagnose-and-solve-problems/environment-sku-current-capacity.png)](media/diagnose-and-solve-problems/environment-sku-current-capacity.png#lightbox)

As an example, assume that this environment ingests messages from an event hub. The following figure shows the ingress rate:

[![Example ingress rate for an event hub](media/diagnose-and-solve-problems/eventhub-ingress-rate.png)](media/diagnose-and-solve-problems/eventhub-ingress-rate.png#lightbox)

The daily ingress rate is ~67,000 messages. This rate translates to approximately 46 messages every minute. If each event hub message is flattened to a single Time Series Insights event, throttling doesn't occur. If each event hub message is flattened to 100 Time Series Insights events, 4,600 events should be ingested every minute. An S1 SKU environment that has a capacity of 3 can ingress only 2,100 events every minute (1 million events per day = 700 events per minute at three units = 2,100 events per minute). For this setup, you see a lag due to throttling.

For a high-level understanding of how flattening logic works, see [Supported JSON shapes](./how-to-shape-query-json.md).

#### Recommended resolutions for excessive throttling

To fix the lag, increase the SKU capacity of your environment. For more information, see [Scale your Time Series Insights environment](time-series-insights-how-to-scale-your-environment.md).

### Cause B: initial ingestion of historical data slows ingress

If you connect an existing event source, it's likely that your IoT hub or event hub already contains data. The environment starts pulling data from the beginning of the event source's message retention period. This default processing can't be overridden. You can engage throttling. Throttling might take a while to catch up as it ingests historical data.

#### Recommended resolutions for large initial ingestion

To fix the lag:

1. Increase the SKU capacity to the maximum allowed value (10, in this case). After you increase capacity, the ingress process starts to catch up much more quickly. You are charged for the increased capacity. To visualize how quickly you're catching up, you can view the availability chart in the [Time Series Insights explorer](https://insights.timeseries.azure.com).

2. When the lag is caught up, decrease the SKU capacity to your normal ingress rate.

## Problem: my event source's timestamp property name setting doesn't work

Ensure that the timestamp property name and value conform to the following rules:

* The timestamp property name is case-sensitive.
* The timestamp property value that comes from your event source as a JSON string should have the format _yyyy-MM-ddTHH:mm:ss.FFFFFFFK_. An example is **2008-04-12T12:53Z**.

The easiest way to ensure that your timestamp property name is captured and working properly is to use the Time Series Insights explorer. In the Time Series Insights explorer, using the chart, select a period of time after you entered the timestamp property name. Right-click the selection, and then select the **Explore events** option.

The first column header should be your timestamp property name. Next to the word **Timestamp**, you should see **($ts)**.

You should not see the following values:

- *(abc)*: Indicates that Time Series Insights is reading the data values as strings.
- *Calendar icon*: Indicates that Time Series Insights is reading the data value as *datetime*.
- *#*: Indicates that Time Series Insights is reading the data values as an integer.

## Next steps

- For assistance, start a conversation in the [MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureTimeSeriesInsights) or [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-timeseries-insights).

- For assisted support options, use [Azure support](https://azure.microsoft.com/support/options/).
