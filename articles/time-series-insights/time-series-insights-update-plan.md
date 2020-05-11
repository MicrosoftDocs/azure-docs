---
title: 'Plan your Preview environment - Azure Time Series Insights | Microsoft Docs'
description: Best practices to configure, manage, plan, and deploy your Azure Time Series Insights Preview environment.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 04/27/2020
ms.custom: seodec18
---

# Plan your Azure Time Series Insights Preview environment

This article describes best practices to plan and get started quickly by using Azure Time Series Insights Preview.

> [!NOTE]
> For best practices to plan a general availability Time Series Insights instance, read [Plan your Azure Time Series Insights general availability environment](time-series-insights-environment-planning.md).

## Best practices for planning and preparation

Best practices surrounding planning for and preparing your environment are described further in the following articles:

* What you get when you [provision a Time Series Insights Preview environment](#the-preview-environment).
* What your [Time Series IDs and Timestamp properties are](#configure-time-series-ids-and-timestamp-properties).
* What the new [Time Series Model is](#understand-the-time-series-model), and how to build your own.
* How to [send events efficiently in JSON](#shape-your-events).
* Time Series Insights [business disaster recovery options](#business-disaster-recovery).

Azure Time Series Insights employs a pay-as-you-go business model. For more information about charges and capacity, read [Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

## The preview environment

When you provision a Time Series Insights Preview environment, you create two Azure resources:

* An Azure Time Series Insights Preview environment
* An Azure Storage general-purpose V1 account

As part of the provisioning process, you specify whether you want to enable a warm store. Warm store provides you with a tiered query experience. When enabled, you must specify a retention period between 7 and 30 days. Queries executed within the warm store retention period generally provide faster response times. When a query spans over the warm store retention period, it's served from cold store.

Queries on warm store are free, while queries on cold store incur costs. It's important to understand your query patterns and plan your warm store configuration accordingly. We recommend that interactive analytics on the most recent data reside in your warm store and pattern analysis and long-term trends reside in cold.

> [!NOTE]
> To read more about how to query your warm data, read the [API Reference](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#uri-parameters).

To start, you need three additional items:

* A [Time Series Model](./time-series-insights-update-tsm.md)
* An [event source connected to Time Series Insights](./time-series-insights-how-to-add-an-event-source-iothub.md)
* [Events flowing into the event source](./time-series-insights-send-events.md) that are both mapped to the model and are in valid JSON format

## Review preview limits

[!INCLUDE [Review Time Series Insights Preview limits](../../includes/time-series-insights-preview-limits.md)]

## Configure Time Series IDs and Timestamp properties

To create a new Time Series Insights environment, select a Time Series ID. Doing so acts as a logical partition for your data. As noted, make sure to have your Time Series IDs ready.

> [!IMPORTANT]
> Time Series IDs *can't be changed later*. Verify each one before final selection and first use.

You can select up to three keys to uniquely differentiate your resources. For more information, read [Best practices for choosing a Time Series ID](./time-series-insights-update-how-to-id.md) and [Storage and ingress](./time-series-insights-update-storage-ingress.md).

The **Timestamp** property is also important. You can designate this property when you add event sources. Each event source has an optional Timestamp property that's used to track event sources over time. Timestamp values are case sensitive and must be formatted to the individual specification of each event source.

> [!TIP]
> Verify the formatting and parsing requirements for your event sources.

When left blank, the Event Enqueue Time of an event source is used as the event Timestamp. If you send historical data or batched events, customizing the Timestamp property is more helpful than the default Event Enqueue Time. For more information, read about how to [add event sources in Azure IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md).

## Understand the Time Series Model

You can now configure your Time Series Insights environment’s Time Series Model. The new model makes it easy to find and analyze IoT data. It enables the curation, maintenance, and enrichment of time series data and helps to prepare consumer-ready data sets. The model uses Time Series IDs, which map to an instance that associates the unique resource with variables, known as types, and hierarchies. Read about the new [Time Series Model](./time-series-insights-update-tsm.md).

The model is dynamic, so it can be built at any time. To get started quickly, build and upload it prior to pushing data into Time Series Insights. To build your model, read [Use the Time Series Model](./time-series-insights-update-how-to-tsm.md).

For many customers, the Time Series Model maps to an existing asset model or ERP system already in place. If you don't have an existing model, a prebuilt user experience is [provided](https://github.com/Microsoft/tsiclient) to get up and running quickly. To envision how a model might help you, view the [sample demo environment](https://insights.timeseries.azure.com/preview/demo).

## Shape your events

You can verify the way that you send events to Time Series Insights. Ideally, your events are denormalized well and efficiently.

A good rule of thumb:

* Store metadata in your Time Series Model.
* Ensure that Time Series Mode, instance fields, and events include only necessary information, such as a Time Series ID or Timestamp property.

For more information, read [Shape events](./time-series-insights-send-events.md#supported-json-shapes).

[!INCLUDE [business-disaster-recover](../../includes/time-series-insights-business-recovery.md)]

## Next steps

- Review [Azure Advisor](../advisor/advisor-overview.md) to plan out your business recovery configuration options.
- Read more about [storage and ingress](./time-series-insights-update-storage-ingress.md) in the Time Series Insights Preview.
- Learn about [data modeling](./time-series-insights-update-tsm.md) in the Time Series Insights Preview.
