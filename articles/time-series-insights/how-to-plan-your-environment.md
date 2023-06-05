---
title: 'Plan your Gen2 environment - Azure Time Series Insights | Microsoft Docs'
description: Best practices to configure, manage, plan, and deploy your Azure Time Series Insights Gen2 environment.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 09/30/2020
ms.custom: seodec18
---

# Plan your Azure Time Series Insights Gen2 environment

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

This article describes best practices to plan and get started quickly by using Azure Time Series Insights Gen2.

## Best practices for planning and preparation

Best practices surrounding planning for and preparing your environment are described further in the following articles:

* What you get when you [provision an Azure Time Series Insights Gen2 environment](#the-gen2-environment).
* What your [Time Series IDs and Timestamp properties are](#configure-time-series-ids-and-timestamp-properties).
* What the new [Time Series Model is](#understand-the-time-series-model), and how to build your own.
* How to [send events efficiently in JSON](#shape-your-events).
* Azure Time Series Insights [business disaster recovery options](#business-disaster-recovery).

Azure Time Series Insights employs a pay-as-you-go business model. For more information about charges and capacity, read [Azure Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

## The Gen2 environment

When you provision an Azure Time Series Insights Gen2 environment, you create two Azure resources:

* An Azure Time Series Insights Gen2 environment
* An Azure Storage account

As part of the provisioning process, you specify whether you want to enable a warm store. Warm store provides you with a tiered query experience. When enabled, you must specify a retention period between 7 and 30 days. Queries executed within the warm store retention period generally provide faster response times. When a query spans over the warm store retention period, it's served from cold store.

Queries on warm store are free, while queries on cold store incur costs. It's important to understand your query patterns and plan your warm store configuration accordingly. We recommend that interactive analytics on the most recent data reside in your warm store and pattern analysis and long-term trends reside in cold.

> [!NOTE]
> To read more about how to query your warm data, read the [API Reference](/rest/api/time-series-insights/dataaccessgen2/query/execute#uri-parameters).

To start, you need three additional items:

* A [Time Series Model](./concepts-model-overview.md)
* An [event source connected to Time Series Insights](./concepts-streaming-ingestion-event-sources.md)
* [Events flowing into the event source](./time-series-insights-send-events.md) that are both mapped to the model and are in valid JSON format

## Review Azure Time Series Insights Gen2 limits

[!INCLUDE [Review Azure Time Series Insights Gen2 limits](../../includes/time-series-insights-preview-limits.md)]

## Configure Time Series IDs and Timestamp properties

To create a new Azure Time Series Insights environment, select a Time Series ID. Doing so acts as a logical partition for your data. As noted, make sure to have your Time Series IDs ready.

> [!IMPORTANT]
> Time Series IDs *can't be changed later*. Verify each one before final selection and first use.

You can select up to three keys to uniquely differentiate your resources. For more information, read [Best practices for choosing a Time Series ID](./how-to-select-tsid.md) and [Ingestion rules](concepts-json-flattening-escaping-rules.md).

The **Timestamp** property is also important. You can designate this property when you add event sources. Each event source has an optional Timestamp property that's used to track event sources over time. Timestamp values are case sensitive and must be formatted to the individual specification of each event source.

When left blank, the time when the event was enqueued into the IoT Hub or Event Hub is used as the event Timestamp. In general, users should opt to customize the Timestamp property and use the time when the sensor or tag generated the reading, rather than the hub enqueued time. For more information and to read about time zone offsets read [Event source timestamp](./concepts-streaming-ingestion-event-sources.md#event-source-timestamp).

## Understand the Time Series Model

You can now configure your Azure Time Series Insights environment's Time Series Model. The new model makes it easy to find and analyze IoT data. It enables the curation, maintenance, and enrichment of time series data and helps to prepare consumer-ready data sets. The model uses Time Series IDs, which map to an instance that associates the unique resource with variables, known as types, and hierarchies. Read about the [Time Series Model](./concepts-model-overview.md) overview to learn more.

The model is dynamic, so it can be built at any time. To get started quickly, build and upload it prior to pushing data into Azure Time Series Insights. To build your model, read [Use the Time Series Model](./concepts-model-overview.md).

For many customers, the Time Series Model maps to an existing asset model or ERP system already in place. If you don't have an existing model, a prebuilt user experience is [provided](https://github.com/Microsoft/tsiclient) to get up and running quickly. To envision how a model might help you, view the [sample demo environment](https://insights.timeseries.azure.com/preview/demo).

## Shape your events

You can verify the way that you send events to Azure Time Series Insights. Ideally, your events are denormalized well and efficiently.

A good rule of thumb:

* Store metadata in your Time Series Model.
* Ensure that Time Series Mode, instance fields, and events include only necessary information, such as a Time Series ID or Timestamp property.

For more information and to understand how events will be flattened and stored, read the [JSON flattening and escaping rules](./concepts-json-flattening-escaping-rules.md).

[!INCLUDE [business-disaster-recover](../../includes/time-series-insights-business-recovery.md)]

## Next steps

* Review [Azure Advisor](../advisor/advisor-overview.md) to plan out your business recovery configuration options.
* Review [Azure Advisor](../advisor/advisor-overview.md) to plan out your business recovery configuration options.
* Read more about [data ingestion](./concepts-ingestion-overview.md) in Azure Time Series Insights Gen2.
* Review the article on [data storage](./concepts-storage.md) in Azure Time Series Insights Gen2.
* Learn about [data modeling](./concepts-model-overview.md) in Azure Time Series Insights Gen2.
