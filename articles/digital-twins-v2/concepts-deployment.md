---
# Mandatory fields.
title: Deploy Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Understand the ingress and egress requirements when deploying Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/16/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Deploy Azure Digital Twins alongside other services

Azure Digital Twins is typically used together with other services. Azure Digital Twins receives data from upstream services such as IoT Hub, which is used to deliver telemetry. Azure Digital Twins can also route data to downstream services for storage, workflow integration, analytics and other use cases. 

## Data ingress

Azure Digital Twins can be driven with data from [IoT Hub](../iot-hub/about-iot-hub.md). This allows to collect telemetry from physical devices in your environment and process this data using the digital twins graph in the cloud.

Azure Digital Twins does not have a built-in IoT Hub. You can use an existing IoT Hub you currently have in production, or deploy a new one. This gives you full access to all device management capabilities of IoT Hub.

To ingest data from IoT Hub into Azure Digital Twins, you use an [Azure Function](../azure-functions/functions-overview.md). Learn more about using this pattern in a [tutorial](https://github.com/Azure/azure-digital-twins/tree/private-preview/Tutorials).

Also see [How to ingest data from IoT Hub](how-to-ingest-iot-hub-data.md).

## Egress services

Azure Digital Twins can send data to connected **endpoints**. Supported endpoints can be:
* [Event Hub](../event-hubs/event-hubs-about.md)
* [Event Grid](../event-grid/overview.md)
* [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md)

Endpoints are attached to Azure Digital Twins using management APIs or the Portal. Learn more about how to attach an endpoint to Azure Digital Twins in the [Azure Digital Twins CLI documentation](https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI).

There are many other services where you may wish to ultimately direct your data, such as [Azure Storage](../storage/common/storage-introduction.md) or [Time Series Insights](../time-series-insights/time-series-insights-update-overview.md). To send your data to services like these, attach the destination service to an endpoint.

For example, if you are also using [Azure Maps](../azure-maps/about-azure-maps.md) and want to correlate location with your Azure Digital Twins twin graph, you will utilize an Azure Function alongside Event Grid to establish communication between all the services in your deployment.

## Next steps

Learn more about endpoints and routing events to external services:
* [Route events to external services](concepts-route-events.md)
