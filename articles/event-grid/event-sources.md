---
title: Azure Event Grid event sources
description: Describes supported event sources for Azure Event Grid 
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/24/2018
ms.author: tomfitz
---

# Event sources in Azure Event Grid

An event source is where the event happens. Several Azure services are automatically configured to send events. You can also create custom applications that send events. Custom applications do not need to be hosted in Azure to use Event Grid for event distribution.

This article provides links to content for each event source.

## Sources

### Azure Subscriptions (management operations)

|Title  |Type  |Description  |
|---------|---------|---------|
| [Integrate Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Tutorial |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |
| [Event schema](event-schema-subscriptions.md) | Reference | Shows fields in Azure subscription events. |

### Container Registry

|Title  |Type  |Description  |
|---------|---------|---------|
| [Event schema](event-schema-container-registry.md) | Reference | Shows fields in Container Registry events. |

### Custom Topics

|Title  |Type  |Description  |
|---------|---------|---------|
| [Create and route custom events with Azure CLI](custom-event-quickstart.md) | Quickstart | Shows how to use Azure CLI to send custom events. |
| [Create and route custom events with Azure PowerShell](custom-event-quickstart-powershell.md) | Quickstart | Shows how to use Azure PowerShell to send custom events. |
| [Create and route custom events with the Azure portal](custom-event-quickstart-portal.md) | Quickstart | Shows how to use the portal to send custom events. |
| [Post to custom topic](post-to-custom-topic.md) | How to | Shows how to post an event to a custom topic. |
| [Event schema](event-schema.md)| Reference | Shows fields in custom events. |

### Event Hubs

|Title  |Type  |Description  |
|---------|---------|---------|
| [Stream big data into a data warehouse](event-grid-event-hubs-integration.md) | Tutorial | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Event schema](event-schema-event-hubs.md) | Reference | Shows fields in Event Hubs events. |

### IoT Hub

|Title  |Type  |Description  |
|---------|---------|---------|
| [Send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | Tutorial | A logic app sends a notification email every time a device is added to your IoT hub. |
| [React to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md) | Conceptual | Overview of integrating Iot Hubs with Event Grid. |
| [Event schema](event-schema-iot-hub.md) | Reference | Shows fields in IoT Hub events. |

### Media Services

|Title  |Type  |Description  |
|---------|---------|---------|
| [Reacting to Media Services events](/media-services/latest/reacting-to-media-services-events) | Conceptual | Overview of integrating Media Services with Event Grid. |
| [Route Azure Media Services events to a custom web endpoint using CLI](/media-services/latest/job-state-events-cli-how-to) | Tutorial | Shows how to send events from Media Services. |
| [Event schema](/media-services/latest/media-services-event-schemas) | Reference | Shows fields in Media Services events. |

### Resource Groups (management operations)

|Title  |Type  |Description  |
|---------|---------|---------|
| [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | Tutorial | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Event Schema](event-schema-resource-groups.md) | Reference | Shows fields in resource group events. |

### Service Bus

|Title  |Type  |Description  |
|---------|---------|---------|
| [Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Tutorial | Event Grid sends messages from Service Bus topic to function app and logic app. |
| [Azure Service Bus to Event Grid integration overview](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md) | Conceptual | Overview of integrating Service Bus with Event Grid. |
| [Event schema](event-schema-service-bus.md) | Reference | Shows fields in Service Bus events. |

### Storage Blob

|Title  |Type  |Description  |
|---------|---------|---------|
* [Route Blob storage events to a custom web endpoint with Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Quickstart | Shows how to use Azure CLI to send blob storage events. |
* [Route Blob storage events to a custom web endpoint with PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Quickstart | Shows how to use Azure PowerShell to send blob storage events. |
* [Reacting to Blob storage events](../storage/blobs/storage-blob-event-overview.md) | Conceptual | Overview of integrating Blob storage with Event Grid. |
| [Event schema](event-schema-blob-storage.md) | Reference | Shows fields in Blob Storage events. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
