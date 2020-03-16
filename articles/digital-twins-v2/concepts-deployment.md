---
# Mandatory fields.
title: Deploy Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Understand the different ways to set up and deploy Azure Digital Twins.
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

# Set up and deploy Azure Digital Twins

Azure Digital Twins is always deployed with an ingress service and an egress service for the e2e data flow to work. Please note that it cannot be used alone. The ingress service collects data and routes it into Azure Digital Twins. The egress service enables Azure Digital Twins to route data to a final endpoint, such as a storage service.

![Ingress/egress coupling](./media/overview/coupling.jpg)

## Ingress services

The ingress service currently supported and validated with Azure Digital Twins is [IoT Hub](../iot-hub/about-iot-hub.md), and it allows collecting telemetry from physical devices in your deployment and processing this data in the cloud. IoT Hub is loosely coupled with Azure Digital Twins. You must use an [Azure Function](../azure-functions/functions-overview.md) to redirect data from IoT Hub into Azure Digital Twins. You may use an IoT Hub you currently have in production, or deploy a new one.

## Egress services

A variety of egress services are supported with Azure Digital Twins and these may connect directly or indirectly with Azure Digital Twins. There are three services that can be configured as Azure Digital Twins end points. These are:
* [Event Hub](../event-hubs/event-hubs-about.md)
* [Event Grid](../event-grid/overview.md)
* [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md)

Learn more about how to configure one of these three to be an Azure Digital Twins end point in the [Azure Digital Twins CLI doc](https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI).

Note that there are many other services that you may wish to direct your data to, for instance, [Azure Storage](../storage/common/storage-introduction.md) or [Time Series Insights](../time-series-insights/time-series-insights-update-overview.md), and these can be attached to one of the end point services above. Likewise, if additional services like [Azure Maps](../azure-maps/about-azure-maps.md) are to be used to correlate location with your Azure Digital Twins graph, utilize an additional instances of Azure Function and Event Grid to establish all the services in your deployment.

## Next steps

Learn more about how to deploy Azure Digital Twins with ingress and egress services:
* [Get started with the Azure Digital Twins CLI](https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI)
