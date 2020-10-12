---
# Mandatory fields.
title: Integration with other services
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

# Integrate Azure Digital Twins with other services

Azure Digital Twins is typically used together with other services to create flexible, connected solutions that use your data in a variety of ways.

Using [**event routes**](concepts-route-events.md), Azure Digital Twins can receive data from upstream services such as [IoT Hub](../iot-hub/about-iot-hub.md) or [Logic Apps](../logic-apps/logic-apps-overview.md), which are used to deliver telemetry and notifications. 

Azure Digital Twins can also route data to downstream services, such as [Azure Maps](../azure-maps/about-azure-maps.md) and [Time Series Insights](../time-series-insights/time-series-insights-update-overview.md), for storage, workflow integration, analytics, and more. 

## Data ingress

Azure Digital Twins can be driven with data and events from any service—[IoT Hub](../iot-hub/about-iot-hub.md), [Logic Apps](../logic-apps/logic-apps-overview.md), your own custom service, and more. This allows you to collect telemetry from physical devices in your environment, and process this data using the Azure Digital Twins graph in the cloud.

Instead of having a built-in IoT Hub behind the scenes, Azure Digital Twins allows you to "bring your own" IoT Hub to use with the service. You can use an existing IoT Hub you currently have in production, or deploy a new one to be used for this purpose. This gives you full access to all of the device management capabilities of IoT Hub.

To ingest data from any source into Azure Digital Twins, use an [**Azure function**](../azure-functions/functions-overview.md). Learn more about this pattern in [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md), or try it out yourself in the Azure Digital Twins [*Tutorial: Connect an end-to-end solution*](tutorial-end-to-end.md). 

You can also learn how to connect Azure Digital Twins to a Logic Apps trigger in [*How-to: Integrate with Logic Apps*](how-to-integrate-logic-apps.md).

## Data egress services

Azure Digital Twins can send data to connected **endpoints**. Supported endpoints can be:
* [Event Hub](../event-hubs/event-hubs-about.md)
* [Event Grid](../event-grid/overview.md)
* [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md)

Endpoints are attached to Azure Digital Twins using management APIs or the Azure portal. Learn more about how to attach an endpoint to Azure Digital Twins in [*How-to: Manage endpoints and routes*](how-to-manage-routes-apis-cli.md).

There are many other services where you may want to ultimately direct your data, such as [Azure Storage](../storage/common/storage-introduction.md), [Azure Maps](../azure-maps/about-azure-maps.md), or [Time Series Insights](../time-series-insights/time-series-insights-update-overview.md). To send your data to services like these, attach the destination service to an endpoint.

For example, if you are also using Azure Maps and want to correlate location with your Azure Digital Twins [twin graph](concepts-twins-graph.md), you can use Azure Functions with Event Grid to establish communication between all the services in your deployment. Learn more about this in [*How-to: Use Azure Digital Twins to update an Azure Maps indoor map*](how-to-integrate-maps.md)

You can also learn how to route data in a similar way to Time Series Insights, in [*How-to: Integrate with Time Series Insights*](how-to-integrate-time-series-insights.md).

## Next steps

Learn more about endpoints and routing events to external services:
* [*Concepts: Routing Azure Digital Twins events*](concepts-route-events.md)

See how to set up Azure Digital Twins to ingest data from IoT Hub:
* [*How-to: Ingest telemetry from IoT Hub*](how-to-ingest-iot-hub-data.md)
