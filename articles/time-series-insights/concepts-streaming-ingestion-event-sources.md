---
title: 'Streaming ingestion event sources - Azure Time Series Insights Gen2 | Microsoft Docs'
description: Learn about streaming data into Azure Time Series Insights Gen2.
author: lyrana
ms.author: lyhughes
manager: deepakpalled
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 08/31/2020
---

# Azure Time Series Insights Gen2 Event Sources

 Your Azure Time Series Insights Gen2 environment can have up to two streaming event sources. Two types of Azure resources are supported as inputs:

- [Azure IoT Hub](../iot-hub/about-iot-hub.md)
- [Azure Event Hubs](../event-hubs/event-hubs-about.md)

Events must be sent as UTF-8 encoded JSON.

## Create or edit event sources

Your event source resource(s) can live in the same Azure subscription as your Azure Time Series Insights Gen2 environment or a different subscription.You can use the [Azure portal](time-series-insights-update-create-environment.md#create-a-preview-payg-environment), [Azure CLI](https://github.com/Azure/azure-cli-extensions/tree/master/src/timeseriesinsights), [ARM Templates](time-series-insights-manage-resources-using-azure-resource-manager-template.md), and the [REST API](/rest/api/time-series-insights/management(gen1/gen2)/eventsources) to create, edit, or remove your environment's event sources.

When you connect an event source, your Azure Time Series Insights Gen2 environment will read all of the events currently stored in your Iot or Event Hub, starting with the oldest event.

> [!IMPORTANT]
>
> - You may experience high initial latency when attaching an event source to your Azure Time Series Insights Gen2 environment.
> - Event source latency depends on the number of events currently in your IoT Hub or Event Hub.
> - High latency will subside after event source data is first ingested. Submit a support ticket through the Azure portal if you experience ongoing high latency.

## Streaming ingestion best practices

- Always create a unique consumer group for your Azure Time Series Insights Gen2 environment to consume data from your event source. Re-using consumer groups can cause random disconnects and may result in data loss.

- Configure your Azure Time Series Insights Gen2 environment and your IoT Hub and/or Event Hubs in the same Azure region. Although it is possible to configure an event source in a separate region, this scenario is not supported and we cannot guarantee high availability.

- Do not go beyond your environment's [throughput rate limit](./concepts-streaming-ingress-throughput-limits.md) or per partition limit.

- Configure a lag [alert](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-environment-mitigate-latency#monitor-latency-and-throttling-with-alerts) to be notified if your environment is experiencing issues processing data.

- Use streaming ingestion for near real-time and recent data only, streaming historical data is not supported.

- Understand how properties will be escaped and JSON [data flattened and stored.](./concepts-json-flattening-escaping-rules.md)

- Follow the principle of least privilege when providing event source connection strings. For Event Hubs, configure a shared access policy with the *send* claim only, and for IoT Hub use the *service connect* permission only.

### Historical Data Ingestion

Using the streaming pipeline to import historical data is not currently supported in Azure Time Series Insights Gen2. If you need to import past data into your environment, follow the guidelines below:

- Do not stream live and historical data in parallel. Ingesting out of order data will result in degraded query performance.
- Ingest historical data in time-ordered fashion for best performance.
- Stay within the ingestion throughput rate limits below.
- Disable Warm Store if the data is older than your Warm Store retention period.

## Event source timestamp

When configuring an event source you'll be asked to provide a timestamp ID property. The timestamp property is used to track events over time, this is the time that will be used as the $event.$ts in the [Query APIs](https://docs.microsoft.com/rest/api/time-series-insights/dataaccessgen2/query/execute) and for plotting series in the Azure Time Series Insights Explorer. If no property is provided at creation time, or if the timestamp property is missing from an event, then the event's IoT Hub or Events Hubs enqueued time will be used as the default. Timestamp property values are stored in UTC.

In general, users will opt to customize the timestamp property and use the time when the sensor or tag generated the reading rather than using the default hub enqueued time. This is particularly necessary when devices have intermittent connectivity loss and a batch of delayed messages are forwarded to Azure Time Series Insights Gen2.

If your custom timestamp is within a nested JSON object or an array you'll need to provide the correct property name following our [flattening and escaping naming conventions](concepts-json-flattening-escaping-rules.md). For example, the event source timestamp for the JSON payload shown [here](concepts-json-flattening-escaping-rules.md#example-a) should be entered as `"values.time"`.

### Time zone offsets

Timestamps must be sent in ISO 8601 format and will be stored in UTC. If a time zone offset is provided, the offset will be applied and then the time stored and returned in UTC format. If the offset is improperly formatted it will be ignored. In situations where your solution might not have context of the original offset, you can send the offset data in an additional separate event property to ensure that it's preserved and that your application can reference in a query response.

The time zone offset should be formatted as one of the following:

±HHMMZ</br>
±HH:MM</br>
±HH:MMZ</br>

## Next steps

- Read the [JSON Flattening and Escaping Rules](./concepts-json-flattening-escaping-rules.md) to understand how events will be stored.

- Understand your environment's [throughput limitations](./concepts-streaming-ingress-throughput-limits.md)
