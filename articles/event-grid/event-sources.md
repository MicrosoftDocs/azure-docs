---
title: Azure Event Grid event sources
description: Describes supported event sources for Azure Event Grid 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 02/12/2019
ms.author: spelluru
---

# Event sources in Azure Event Grid

An event source is where the event happens. Several Azure services are automatically configured to send events. You can also create custom applications that send events. Custom applications don't need to be hosted in Azure to use Event Grid for event distribution.

This article provides links to content for each event source.

## Azure subscriptions

Subscribe to Azure Subscriptions events to respond to changes in resources across an Azure subscription.

|Title |Description  |
|---------|---------|
| [Tutorial: Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |
| [How to: subscribe to events through portal](subscribe-through-portal.md) | Use the portal to subscribe to events for an Azure subscription. |
| [Azure CLI: subscribe to events for an Azure subscription](./scripts/event-grid-cli-azure-subscription.md) |Sample script that creates an Event Grid subscription to an Azure subscription and sends events to a WebHook. |
| [PowerShell: subscribe to events for an Azure subscription](./scripts/event-grid-powershell-azure-subscription.md)| Sample script that creates an Event Grid subscription to an Azure subscription and sends events to a WebHook. |
| [Event schema](event-schema-subscriptions.md) | Shows fields in Azure subscription events. |

## Container Registry

Subscribe to Container Registry events to respond to changes in images.

|Title |Description  |
|---------|---------|
| [Quickstart: send container registry events](../container-registry/container-registry-event-grid-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Container Registry events. |
| [Event schema](event-schema-container-registry.md) | Shows fields in Container Registry events. |

## Custom topics

Subscribe to custom topics to respond to application events.

|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with Azure CLI](custom-event-quickstart.md) | Shows how to use Azure CLI to send custom events. |
| [Quickstart: create and route custom events with Azure PowerShell](custom-event-quickstart-powershell.md) | Shows how to use Azure PowerShell to send custom events. |
| [Quickstart: create and route custom events with the Azure portal](custom-event-quickstart-portal.md) | Shows how to use the portal to send custom events. |
| [Quickstart: route custom events to Azure Queue storage](custom-event-to-queue-storage.md) | Describes how to send custom events to a Queue storage. |
| [How to: post to custom topic](post-to-custom-topic.md) | Shows how to post an event to a custom topic. |
| [Azure CLI: create Event Grid custom topic](./scripts/event-grid-cli-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [Azure CLI: subscribe to events for a custom topic](./scripts/event-grid-cli-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|
| [PowerShell: create Event Grid custom topic](./scripts/event-grid-powershell-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [PowerShell: subscribe to events for a custom topic](./scripts/event-grid-powershell-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|
| [Resource Manager template: custom topic and WebHook endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid) | A Resource Manager template that creates a custom topic and subscription for that custom topic. It sends events to a WebHook. |
|
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |
| [Event schema](event-schema.md) | Shows fields in custom events. |

## Event Hubs

Subscribe to Event Hubs events to respond to Capture file events. Event Hubs can act as either an event source or event handler. The following articles show how to use Event Hubs as a source.

|Title  |Description  |
|---------|---------|
| [Tutorial: stream big data into a data warehouse](event-grid-event-hubs-integration.md) | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Event schema](event-schema-event-hubs.md) | Shows fields in Event Hubs events. |

For examples of Event Hubs as a handler, see [Event Hubs handler](event-handlers.md#event-hubs).

## IoT Hub

Subscribe to IoT Hub events to respond to device created, deleted, connected, disconnected and telemetry events.

|Title  |Description  |
|---------|---------|
| [Send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | A logic app sends a notification email every time a device is added to your IoT Hub. |
| [React to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md) | Overview of integrating IoT Hub with Event Grid. |
| [Event schema](event-schema-iot-hub.md) | Shows fields in IoT Hub events. |
| [Order device connected and device disconnected events](../iot-hub/iot-hub-how-to-order-connection-state-events.md) | Shows how to order device connection state events. |

## Media Services

Subscribe to Media Services events to respond to job state events.

|Title  |Description  |
|---------|---------|
| [Overview: reacting to Media Services events](../media-services/latest/reacting-to-media-services-events.md) | Overview of integrating Media Services with Event Grid. |
| [Tutorial: route Azure Media Services events to a custom web endpoint using CLI](../media-services/latest/job-state-events-cli-how-to.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to send events from Media Services. |
| [Event schema](../media-services/latest/media-services-event-schemas.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows fields in Media Services events. |

## Resource groups

Subscribe to resource group events to respond to changes in resources across a resource group.

|Title  |Description  |
|---------|---------|
| [Tutorial: monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Azure CLI: subscribe to events for a resource group](./scripts/event-grid-cli-resource-group.md)| Sample script that subscribes to events for a resource group. It sends events to a WebHook. |
| [Azure CLI: subscribe to events for a resource group and filter for a resource](./scripts/event-grid-cli-resource-group-filter.md) | Sample script that subscribes to events for a resource group and filters events for one resource. |
| [PowerShell: subscribe to events for a resource group](./scripts/event-grid-powershell-resource-group.md) | Sample script that subscribes to events for a resource group. It sends events to a WebHook. |
| [PowerShell: subscribe to events for a resource group and filter for a resource](./scripts/event-grid-powershell-resource-group-filter.md) | Sample script that subscribes to events for a resource group and filters events for one resource. |
| [Resource Manager template: resource subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-resource-events-to-webhook) | Subscribes to events for an Azure subscription or resource group. It sends events to a WebHook. |
| [Event Schema](event-schema-resource-groups.md) | Shows fields in resource group events. |

## Service Bus

Subscribe to Service Bus events to respond to messages without an active listener.

|Title  |Description  |
|---------|---------|
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |
| [Overview: Azure Service Bus to Event Grid integration](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md) | Overview of integrating Service Bus with Event Grid. |
| [Event schema](event-schema-service-bus.md) | Shows fields in Service Bus events. |

## Storage

Subscribe to Blob Storage events to respond to blob created and deleted events.

|Title  |Description  |
|---------|---------|
| [Quickstart: route Blob storage events to a custom web endpoint with Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send blob storage events to a WebHook. |
| [Quickstart: route Blob storage events to a custom web endpoint with PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure PowerShell to send blob storage events to a WebHook. |
| [Quickstart: create and route Blob storage events with the Azure portal](blob-event-quickstart-portal.md) | Shows how to use the portal to send blob storage events to a WebHook. |
| [Azure CLI: subscribe to events for a Blob storage account](./scripts/event-grid-cli-blob.md) | Sample script that subscribes to event for a Blob storage account. It sends the event to a WebHook. |
| [PowerShell: subscribe to events for a Blob storage account](./scripts/event-grid-powershell-blob.md) | Sample script that subscribes to event for a Blob storage account. It sends the event to a WebHook. |
| [Resource Manager template: Create Blob storage and subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-subscription-and-storage) | Deploys an Azure Blob storage account and subscribes to events for that storage account. It sends events to a WebHook. |
| [Overview: reacting to Blob storage events](../storage/blobs/storage-blob-event-overview.md) | Overview of integrating Blob storage with Event Grid. |
| [Event schema](event-schema-blob-storage.md) | Shows fields in Blob Storage events. |

## Maps
Subscribe to Azure Maps events to respond to geofence events. For example, an application could deliver an email notification every time a device enters or exits a geofence.

|Title  |Description  |
|---------|---------|
| [React to Azure Maps events by using Event Grid](../azure-maps/azure-maps-event-grid-integration.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Overview of integrating Azure Maps with Event Grid. |
| [Tutorial: Set up a geofence](../azure-maps/tutorial-geofence.md?toc=%2fazure%2fevent-grid%2ftoc.json) | This tutorial walks you through the basics steps to set up geofence by using Azure Maps. You use Azure Event Grid to stream the geofence results and set up a notification based on the geofence results. |
| [Event schema](event-schema-azure-maps.md) | Shows fields in Azure Maps events. |

## App Configuration
Subscribe to Azure App Configuration events to respond to key-value modification events.

|Title | Description |
|---------|---------|
| [React to Azure App Configuration events by using Event Grid](../azure-app-configuration/concept-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Overview of integrating Azure App Configuration with Event Grid. |
| [QuickStart: route Azure App Configuration events to a custom web endpoint with Azure CLI](../azure-app-configuration/howto-app-configuration-event.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Azure App Configuration events to a WebHook. |
| [Event schema](event-schema-app-configuration.md) | Shows fields in Azure App Configuration events. |

## Azure SignalR
Subscribe to Azure SignalR Service events to respond to client connection events.

|Title | Description |
|---------|---------|
| [React to Azure SignalR Service events by using Event Grid](../azure-signalr/signalr-concept-event-grid-integration.md) | Overview of integrating Azure SignalR Service with Event Grid. |
| [How to send Azure SignalR Service events to Event Grid](../azure-signalr/signalr-howto-event-grid-integration.md) | Shows how to send  Azure SignalR Service events to an application through Event Grid. |
| [Event schema](event-schema-azure-signalr.md) | Shows fields in Azure SignalR Service events. |



## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
