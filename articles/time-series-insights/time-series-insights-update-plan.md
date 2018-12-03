---
title: Plan your Azure Time Series Insights (preview) environment | Microsoft Docs
description: Plan your Azure Time Series Insights (preview) environment 
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/03/2018
---

# Plan your Azure Time Series Insights (preview) environment

This article describes best practices to plan and get started quickly using the Azure Time Series Insights (preview).

## Best practices for planning and preparation

To get started with Time Series Insights (TSI), it’s best if you understand the following:

1. What you are getting when you provision a TSI (preview) environment.
1. What your **Time Series IDs** and **Timestamp** properties are.
1. What the new **Time Series Model** is and how to build your own.
1. How to send events efficiently in JSON.  
1. TSI business disaster recovery options.

The Time Series Insights update employs a pay-as-you-go business model.  For more information about charges and capacity, see [Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

## The Time Series Insights (preview) environment

When you provision a TSI (preview) environment, you create two Azure resources:

1. TSI (preview) environment
1. Azure storage general-purpose V1 account

To get going, you’ll need three additional items.  The first is a [Time Series Model](./time-series-insights-update-tsm.md), the second is an [event source connected to Time Series Insights](./time-series-insights-how-to-add-an-event-source-iothub.md), and the third is [events flowing into the event source](./time-series-insights-send-events.md) that are both mapped to the model and are in valid JSON format.  

## Configure your Time Series IDs and Timestamp properties

To create a new TSI environment, select a **Time Series ID**. Doing so acts as a logical partition for your data. As noted, make sure to have your **Time Series IDs** ready.

> [!IMPORTANT]
> **Time Series IDs** are **immutable** and **cannot be changed later**. Verify each before final selection and first use.

You can select up to **three** (3) keys to uniquely differentiate your resources. Read the [Best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md) and [Storage and ingress](./time-series-insights-update-storage-ingress.md) articles for more information.

The **Timestamp** property is also very important. You can designate this property when adding event sources. Each event source has an optional **Timestamp** property that's used to track event sources over time. **Timestamp** values are case-sensitive and must be formatted to the individual specification of each event source.

> [!TIP]
> Verify the formatting and parsing requirements for your event sources.

When left blank, the **Event Enqueue Time** of an event source is used as the event **Timestamp**. If you are sending historical data or batched events, you will likely find customizing the **Timestamp** property to be more helpful than the default **Event Enqueue Time**. For more information, read about [How to add event sources in IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md).  

## Understand the Time Series Model

You can now configure your TSI environment’s **Time Series Model**. The new model makes it easy to find and analyze IoT data. It does so by enabling the curation, maintenance, and enrichment of time series data and helps to prepare consumer-ready data sets. The model uses **Time Series IDs**, which map to an instance associating the unique resource with variables (known as types) and hierarchies. Read about the new [Time Series Model](./time-series-insights-update-tsm.md).

The model is dynamic so it can built at any time. However, you’ll be able to get started more quickly if it’s built and uploaded prior to you beginning to push data into TSI. To build your model, review the [How to use TSM](./time-series-insights-update-how-to-tsm.md) article.

For many customers, we expect the **Time Series Model** to map to an existing asset model or ERP system already in place. For those customers that do not have an existing model, a pre-built user experience is [provided](https://github.com/Microsoft/tsiclient) to get up and running quickly. You can envision how a model might help you by viewing our [sample demo environment](https://insights.timeseries.azure.com/preview/demo).  

## Shaping your events

It's important to verify the way you send events to TSI. Ideally, your events will be denormalized well and efficiently.

A good rule of thumb:

* Metadata should be stored in your **Time Series Model**
* **Time Series Mode;** instance fields and events should only necessary information such as:
  * **Time Series ID**
  * **Timestamp**

Review the [How to shape events](./time-series-insights-send-events.md#json) article for greater detail.

## Business disaster recovery

As an Azure service, TSI is a high availability (HA) service using redundancies at the Azure region level. No configuration is required to use these inherent functionalities. The Microsoft Azure platform also includes features to help you build solutions with disaster recovery (DR) capabilities or cross-region availability. If you want to provide global, cross-region HA for devices or users, take advantage of these Azure DR features. The article [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/resiliency/resiliency-technical-guidance) describes the built-in features in Azure for business continuity and DR. The [Disaster](https://docs.microsoft.com/azure/architecture/resiliency/index) recovery and high availability for Azure applications paper provides architecture guidance on strategies for Azure applications to achieve HA and DR.

> [!NOTE]
> Azure Time Series Insights does not have built-in BCDR.
> By default Azure Storage, Azure IoT Hub, and Event Hubs have recovery built in.

To learn more:

* Read about [Azure Storage’s redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy).
* Read about [IoT Hub's HA DR](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr).
* Read about [Event Hub's policies](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr).

Nevertheless, customers that require BCDR can still implement a recovery strategy by creating a second TSI environment in a backup Azure region. Customers send events to this secondary environment from the primary event source, leveraging a second dedicated consumer group and that event source's BCDR guidelines.

The specific steps to accomplish this are as follows:

1. Create an environment in a second region. Read about [TSI environments](./time-series-insights-get-started.md).
1. Create a second dedicated consumer group for your event source and connect that event source to the new environment. Be sure to designate the second, dedicated consumer group. Learn more from the [IoT Hub documentation](./time-series-insights-how-to-add-an-event-source-iothub.md) or the [Event Hub documentation](./time-series-insights-data-access.md).
1. If your primary region is impacted during a disaster incident, reroute operations to the backup TSI environment.

> [!IMPORTANT]
> * Note that a delay may be experienced in the event of a failover.
> * Failover may also cause a mometary spike in message processing as operations are rerouted.
> * For more information, review [Mitigating latency in TSI](./time-series-insights-environment-mitigate-latency.md).

## Next steps

Read the [Azure TSI (preview) Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about the new [Time Series Model](./time-series-insights-update-tsm.md).