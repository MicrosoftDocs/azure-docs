---
title: 'Plan your GA environment - Azure Time Series Insights | Microsoft Docs'
description: Best practices for preparing, configuring, and deploying your Azure Time Series Insights GA environment.
services: time-series-insights
ms.service: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 01/21/2020
ms.custom: seodec18
---

# Plan your Azure Time Series Insights GA environment

This article describes how to plan your Azure Time Series Insights general availability (GA) environment based on your expected ingress rate and your data retention requirements.

## Video

**Watch this video to learn more about data retention in Azure Time Series Insights and how to plan for it**:<br /><br />

> [!VIDEO https://www.youtube.com/embed/03x6zKDQ6DU]

## Best practices

To get started with Azure Time Series Insights, it’s best if you know how much data you expect to push by the minute and how long you need to store your data.  

For more information about capacity and retention for both Time Series Insights SKUs, read [Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

To best plan your Time Series Insights environment for long-term success, consider the following attributes:

- [Storage capacity](#storage-capacity)
- [Data retention period](#data-retention)
- [Ingress capacity](#ingress-capacity)
- [Shaping your events](#shape-your-events)
- [Ensuring that you have reference data in place](#ensure-that-you-have-reference-data)

## Storage capacity

By default, Time Series Insights retains data based on the amount of storage you provision (units &#215; the amount of storage per unit) and ingress.

## Data retention

You can change the **Data retention time** setting in your Azure Time Series Insights environment. You can enable up to 400 days of retention. 

Azure Time Series Insights has two modes:

* One mode optimizes for the most up-to-date data. It enforces a policy to **Purge old data** leaving recent data available with the instance. This mode is on, by default. 
* The other optimizes data to remain below the configured retention limits. **Pause ingress** prevents new data from being ingressed when it's selected as the **Storage limit exceeded behavior**.

You can adjust retention and toggle between the two modes on the environment’s configuration page in the Azure portal.

> [!IMPORTANT]
> You can configure a maximum of 400 days of data retention in your Azure Time Series Insights GA environment.

### Configure data retention

1. In the [Azure portal](https://portal.azure.com), select your Time Series Insights environment.

1. In the **Time Series Insights environment** pane, under **Settings**, select **Storage configuration**.

1. In the **Data retention time (in days)** box, enter a value between 1 and 400.

   [![Configure retention](media/data-retention/configure-data-retention.png)](media/data-retention/configure-data-retention.png#lightbox)

> [!TIP]
> To learn more about how to implement an appropriate data retention policy, read [How to configure retention](./time-series-insights-how-to-configure-retention.md).

## Ingress capacity

[!INCLUDE [Azure Time Series Insights GA limits](../../includes/time-series-insights-ga-limits.md)]

### Environment planning

The second area to focus on for planning your Time Series Insights environment is ingress capacity. Ingress capacity is a derivative of the per-minute allocation.

From a throttling perspective, an ingressed data packet that has a packet size of 32 KB is treated as 32 events, each 1 KB in size. The maximum allowed event size is 32 KB. Data packets larger than 32 KB are truncated.

You can increase the capacity of an S1 or S2 SKU to 10 units in a single environment. You can't migrate from an S1 environment to an S2. You can't migrate from an S2 environment to an S1.

For ingress capacity, first determine the total ingress you require on a per-month basis. Next, determine what your per-minute needs are. 

Throttling and latency play a role in per-minute capacity. If you have a spike in your data ingress that lasts less than 24 hours, Time Series Insights can "catch up" at an ingress rate of two times the rates listed in the preceding table.

For example, if you have a single S1 SKU, you ingress data at a rate of 720 events per minute, and the data rate spikes for less than one hour at a rate of 1,440 events or less, there's no noticeable latency in your environment. However, if you exceed 1,440 events per minute for more than one hour, you likely will experience latency in data that is visualized and available for query in your environment.

You might not know in advance how much data you expect to push. In this case, you can find data telemetry for [Azure IoT Hub](../iot-hub/iot-hub-metrics.md) and [Azure Event Hubs](https://blogs.msdn.microsoft.com/cloud_solution_architect/2016/05/25/using-the-azure-rest-apis-to-retrieve-event-hub-metrics/) in your Azure portal subscription. The telemetry can help you determine how to provision your environment. Use the **Metrics** pane in the Azure portal for the respective event source to view its telemetry. If you understand your event source metrics, you can more effectively plan and provision your Time Series Insights environment.

### Calculate ingress requirements

To calculate your ingress requirements:

- Verify that your ingress capacity is above your average per-minute rate and that your environment is large enough to handle your anticipated ingress equivalent to two times your capacity for less than one hour.

- If ingress spikes occur that last for longer than 1 hour, use the spike rate as your average. Provision an environment with the capacity to handle the spike rate.

### Mitigate throttling and latency

For information about how to prevent throttling and latency, read [Mitigate latency and throttling](time-series-insights-environment-mitigate-latency.md).

## Shape your events

It's important to ensure that the way you send events to Time Series Insights supports the size of the environment you are provisioning. (Conversely, you can map the size of the environment to how many events Time Series Insights reads and the size of each event.) It's also important to think about the attributes that you might want to use to slice and filter by when you query your data.

> [!TIP]
> Review the JSON shaping documentation in [Sending events](time-series-insights-send-events.md).

## Ensure that you have reference data

A *reference dataset* is a collection of items that augment the events from your event source. The Time Series Insights ingress engine joins each event from your event source with the corresponding data row in your reference dataset. The augmented event is then available for query. The join is based on the **Primary Key** columns that are defined in your reference dataset.

> [!NOTE]
> Reference data isn't joined retroactively. Only current and future ingress data is matched and joined to the reference dataset after it's configured and uploaded. If you plan to send a large amount of historical data to Time Series Insights and don't first upload or create reference data in Time Series Insights, you might have to redo your work (hint: not fun).  

To learn more about how to create, upload, and manage your reference data in Time Series Insights, read our [Reference dataset documentation](time-series-insights-add-reference-data-set.md).

[!INCLUDE [business-disaster-recover](../../includes/time-series-insights-business-recovery.md)]

## Next steps

- Get started by creating [a new Time Series Insights environment in the Azure portal](time-series-insights-get-started.md).

- Learn how to [add an Event Hubs event source](time-series-insights-how-to-add-an-event-source-eventhub.md) to Time Series Insights.

- Read about how to [configure an IoT Hub event source](time-series-insights-how-to-add-an-event-source-iothub.md).
