---
title: 'Streaming ingestion throughput limitations- Azure Time Series Insights Gen2 | Microsoft Docs'
description: Learn about ingress throughput limits in Azure Time Series Insights Gen2.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 01/21/2021
ms.custom: seodec18
---


# Streaming Ingestion Throughput Limits

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

Azure Time Series Insights Gen2 streaming data ingress limitations are described below.

> [!TIP]
> Read [Plan your Azure Time Series Insights Gen2 environment](./how-to-plan-your-environment.md#review-azure-time-series-insights-gen2-limits) for a comprehensive list of all limits.

## Per environment limitations

In general, ingress rates are viewed as the factor of the number of devices that are in your organization, event emission frequency, and the size of each event:

* **Number of devices** × **Event emission frequency** × **Size of each event**.

By default, Azure Time Series Insights Gen2 can ingest incoming data at a rate of **up to 1 megabyte per second (MBps) or 1000 events stored per second per Azure Time Series Insights Gen2 environment**. There are additional limitations [per hub partition](./concepts-streaming-ingress-throughput-limits.md#hub-partitions-and-per-partition-limits). Depending on how you've modeled your data, arrays of objects can be split into multiple events stored: [How to know if my array of objects will produce multiple events
](./concepts-json-flattening-escaping-rules.md#how-to-know-if-my-array-of-objects-will-produce-multiple-events).

> [!TIP]
>
> * Environment support for ingesting speeds up to 2 MBps can be provided by request.
> * Contact us if you require higher throughput by submitting a support ticket through the Azure portal.

* **Example 1:**

    Contoso Shipping has 100,000 devices that emit an event three times per minute. The size of an event is 200 bytes. They’re using an IoT Hub with four partitions as the Azure Time Series Insights Gen2 event source.

  * The ingestion rate for their Azure Time Series Insights Gen2 environment would be: **100,000 devices * 200 bytes/event * (3/60 event/sec) = 1 MBps**.
    * Assuming balanced partitions, the ingestion rate per partition would be 0.25 MBps.
    * Contoso Shipping's ingestion rate would be within the scale limitations.

* **Example 2:**

    Contoso Fleet Analytics has 10,000 devices that emit an event every second. They are using an Event Hub with a partition count of 2 as the Azure Time Series Insights Gen2 event source. The size of an event is 200 bytes.

  * The environment ingestion rate would be: **10,000 devices * 200 bytes/event * 1 event/sec = 2 MBps**.
    * Assuming balanced partitions, their per partition rate would be 1 MBps.
    * Contoso Fleet Analytics' ingestion rate is over the environment and partition limits. They can submit a request to Azure Time Series Insights Gen2 through the Azure portal to increase the ingestion rate for their environment, and create an Event Hub with more partitions to be within the limits.

## Hub partitions and per partition limits

When planning your Azure Time Series Insights Gen2 environment, it's important to consider the configuration of the event source(s) that you'll be connecting to Azure Time Series Insights Gen2. Both Azure IoT Hub and Event Hubs utilize partitions to enable horizontal scale for event processing.

A *partition* is an ordered sequence of events held in a hub. The partition count is set during the hub creation phase and cannot be changed.

For Event Hubs partitioning best practices, review [How many partitions do I need?](../event-hubs/event-hubs-faq.yml#how-many-partitions-do-i-need-)

> [!NOTE]
> Most IoT Hubs used with Azure Time Series Insights Gen2 only need four partitions.

Whether you're creating a new hub for your Azure Time Series Insights Gen2 environment or using an existing one, you'll need to calculate your per partition ingestion rate to determine if it's within the limits.

Azure Time Series Insights Gen2 currently has a general **per partition limit of 0.5 MBps or 500 events stored per second**. Depending on how you've modeled your data, arrays of objects can be split into multiple events stored: [How to know if my array of objects will produce multiple events
](./concepts-json-flattening-escaping-rules.md#how-to-know-if-my-array-of-objects-will-produce-multiple-events).

### IoT Hub-specific considerations

When a device is created in IoT Hub, it's permanently assigned to a partition. In doing so, IoT Hub is able to guarantee event ordering (since the assignment never changes).

A fixed partition assignment also impacts Azure Time Series Insights Gen2 instances that are ingesting data sent from IoT Hub downstream. When messages from multiple devices are forwarded to the hub using the same gateway device ID, they may arrive in the same partition at the same time potentially exceeding the per partition scale limits.

**Impact**:

* If a single partition experiences a sustained rate of ingestion over the limit, it's possible that Azure Time Series Insights Gen2 will not sync all device telemetry before the IoT Hub data retention period has been exceeded. As a result, sent data can be lost if the ingestion limits are consistently exceeded.

To mitigate that circumstance, we recommend the following best practices:

* Calculate your per environment and per partition ingestion rates before deploying your solution.
* Ensure that your IoT Hub devices are load-balanced to the furthest extent possible.

> [!IMPORTANT]
> For environments using IoT Hub as an event source, calculate the ingestion rate using the number of hub devices in use to be sure that the rate falls below the 0.5 MBps per partition limitation.
>
> * Even if several events arrive simultaneously, the limit will not be exceeded.

  ![IoT Hub Partition Diagram](media/concepts-ingress-overview/iot-hub-partiton-diagram.png)

Refer to the following resources to learn more about optimizing hub throughput and partitions:

* [IoT Hub Scale](../iot-hub/iot-hub-scaling.md)
* [Event Hub Scale](../event-hubs/event-hubs-scalability.md#throughput-units)
* [Event Hub Partitions](../event-hubs/event-hubs-features.md#partitions)

## Next steps

* Read about data [storage](./concepts-storage.md)
