---
title: Plan your Azure Time Series Insights Preview environment | Microsoft Docs
description: Plan your Azure Time Series Insights Preview environment 
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/03/2018
---

# Plan your Azure Time Series Insights Preview environment

This article describes best practices to plan and get started quickly using the Azure Time Series Insights Preview.

## Best practices for planning and preparation

To get started with Time Series Insights, it’s best if you understand:

* What you get when you provision a Time Series Insights Preview environment.
* What your **Time Series IDs** and **Timestamp** properties are.
* What the new Time Series Model is, and how to build your own.
* How to send events efficiently in JSON. 
* Time Series Insights business disaster recovery options.

The Time Series Insights update employs a pay-as-you-go business model. For more information about charges and capacity, see [Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

## The Time Series Insights Preview environment

When you provision a Time Series Insights Preview environment, you create two Azure resources:

* Time Series Insights Preview environment
* Azure Storage general-purpose V1 account

To start, you need three additional items:
 
- A [Time Series Model](./time-series-insights-update-tsm.md). 
- An [event source connected to Time Series Insights](./time-series-insights-how-to-add-an-event-source-iothub.md). 
- [Events flowing into the event source](./time-series-insights-send-events.md) that are both mapped to the model and are in valid JSON format. 

## Configure your Time Series IDs and Timestamp properties

To create a new Time Series Insights environment, select a **Time Series ID**. Doing so acts as a logical partition for your data. As noted, make sure to have your **Time Series IDs** ready.

> [!IMPORTANT]
> **Time Series IDs** are *immutable* and *can't be changed later*. Verify each one before final selection and first use.

You can select up to three (3) keys to uniquely differentiate your resources. For more information, read [Best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md) and [Storage and ingress](./time-series-insights-update-storage-ingress.md).

The **Timestamp** property is also important. You can designate this property when you add event sources. Each event source has an optional **Timestamp** property that's used to track event sources over time. **Timestamp** values are case sensitive and must be formatted to the individual specification of each event source.

> [!TIP]
> Verify the formatting and parsing requirements for your event sources.

When left blank, the **Event Enqueue Time** of an event source is used as the event **Timestamp**. If you send historical data or batched events, customizing the **Timestamp** property is more helpful than the default **Event Enqueue Time**. For more information, read about [How to add event sources in IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md). 

## Understand the Time Series Model

You can now configure your Time Series Insights environment’s Time Series Model. The new model makes it easy to find and analyze IoT data. It enables the curation, maintenance, and enrichment of time series data and helps to prepare consumer-ready data sets. The model uses **Time Series IDs**, which map to an instance that associates the unique resource with variables, known as types, and hierarchies. Read about the new [Time Series Model](./time-series-insights-update-tsm.md).

The model is dynamic, so it can be built at any time. To get started quickly, build and upload it prior to pushing data into Time Series Insights. To build your model, see [Use the Time Series Model](./time-series-insights-update-how-to-tsm.md).

For many customers, the Time Series Model maps to an existing asset model or ERP system already in place. If you don't have an existing model, a prebuilt user experience is [provided](https://github.com/Microsoft/tsiclient) to get up and running quickly. To envision how a model might help you, view the [sample demo environment](https://insights.timeseries.azure.com/preview/demo). 

## Shape your events

You can verify the way that you send events to Time Series Insights. Ideally, your events are denormalized well and efficiently.

A good rule of thumb:

* Store metadata in your Time Series Model
* Time Series Mode, instance fields, and events include only necessary information such as:
  * **Time Series ID**
  * **Timestamp**

For more information, see [Shape events](./time-series-insights-send-events.md#json).

## Business disaster recovery

Azure Time Series Insights is a high-availability service that uses redundancies at the Azure region level. Configuration isn't required to use these inherent functionalities. The Microsoft Azure platform also includes features to help you build solutions with disaster recovery capabilities or cross-region availability. To provide global, cross-region high availability for devices or users, take advantage of these Azure disaster recovery features. 

For information on built-in features in Azure for business continuity and disaster recovery (BCDR), see [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/resiliency/resiliency-technical-guidance). For architecture guidance on strategies for Azure applications to achieve high availability and disaster recovery, see the paper on [Disaster recovery and high availability for Azure applications](https://docs.microsoft.com/azure/architecture/resiliency/index).

> [!NOTE]
> Azure Time Series Insights doesn't have built-in BCDR.
> By default, Azure Storage, Azure IoT Hub, and Azure Event Hubs have recovery built in.

To learn more, read about:

* [Azure Storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy)
* [IoT Hub high-availability disaster recovery](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr)
* [Event Hub policies](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr)

If you require BCDR, you can still implement a recovery strategy. Create a second Time Series Insights environment in a backup Azure region. Send events to this secondary environment from your primary event source. Use a second dedicated consumer group and that event source's BCDR guidelines.

Follow these steps to create and use a secondary Time Series Insights environment.

1. Create an environment in a second region. For more information, see [Time Series Insights environments](./time-series-insights-get-started.md).
1. Create a second dedicated consumer group for your event source. Connect that event source to the new environment. Be sure to designate the second dedicated consumer group. To learn more, see the [IoT Hub documentation](./time-series-insights-how-to-add-an-event-source-iothub.md) or the [Event Hub documentation](./time-series-insights-data-access.md).
1. If your primary region is affected during a disaster incident, reroute operations to the backup Time Series Insights environment.

> [!IMPORTANT]
> * Note that a delay might be experienced in the event of a failover.
> * Failover also might cause a momentary spike in message processing as operations are rerouted.
> * For more information, see [Mitigate latency in Time Series Insights](./time-series-insights-environment-mitigate-latency.md).

## Next steps

To learn more, read about:

- [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md)
- [Data modeling](./time-series-insights-update-tsm.md)