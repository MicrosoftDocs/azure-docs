---
title: Azure Event Grid event sources
description: Describes supported event sources for Azure Event Grid 
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/19/2018
ms.author: tomfitz
---

# Event sources in Azure Event Grid

An event source is where the event happens. Several Azure services are automatically configured to send events. You can also create custom applications that send events. Custom applications do not need to be hosted in Azure to use Event Grid for event distribution.

This article provides links to content for each event source.

## Sources

### Azure Subscriptions (management operations)

[Schema](event-schema-subscriptions.md)

### Custom Topics

* [Create and route custom events with Azure CLI](custom-event-quickstart.md)
* [Create and route custom events with Azure PowerShell](custom-event-quickstart-powershell.md)
* [Create and route custom events with the Azure portal](custom-event-quickstart-portal.md)
* [Post to custom topic](post-to-custom-topic.md)
* [Schema](event-schema.md)

### Event Hubs

* [Stream big data into a data warehouse](event-grid-event-hubs-integration.md)
* [Schema](event-schema-event-hubs.md)

### IoT Hub

* [Send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md)
* [React to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md)
* [Schema](event-schema-iot-hub.md)

### Media Services

* [Reacting to Media Services events](/media-services/latest/reacting-to-media-services-events)
* [Route Azure Media Services events to a custom web endpoint using CLI](/media-services/latest/job-state-events-cli-how-to)
* [Schema](/media-services/latest/media-services-event-schemas)

### Resource Groups (management operations)

 [Schema](event-schema-resource-groups.md)

### Service Bus

* [Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json)
* [Azure Service Bus to Event Grid integration overview](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md)
* [Schema](event-schema-service-bus.md)

### Storage Blob

* [Route Blob storage events to a custom web endpoint with Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
* [Route Blob storage events to a custom web endpoint with PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json)
* [Reacting to Blob storage events](../storage/blobs/storage-blob-event-overview.md)

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
