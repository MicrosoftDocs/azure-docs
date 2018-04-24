---
title: Azure Event Grid event handlers
description: Describes supported event handlers for Azure Event Grid 
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 04/24/2018
ms.author: tomfitz
---

# Event handlers in Azure Event Grid

An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any webhook for handling events. The webhook does not need to be hosted in Azure to handle events.

This article provides links to content for each event handler.

## Azure Automation

|Title  |Type  |Description  |
|---------|---------|---------|
|[Integrate Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Tutorial |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |

## Azure Functions

|Title  |Type  |Description  |
|---------|---------|---------|
| [Event Grid trigger for Azure Functions](../azure-functions/functions-bindings-event-grid.md) | Conceptual | Overview of using the Event Grid trigger in Functions. |
| [Automate resizing uploaded images using Event Grid](resize-images-on-storage-blob-upload-event.md) | Tutorial | Users upload images through web app to storage account. When a storage blob is created, Event Grid sends an event to the function app, which resizes the uploaded image. |
| [Stream big data into a data warehouse](event-grid-event-hubs-integration.md) | Tutorial | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Tutorial | Event Grid sends messages from Service Bus topic to function app and logic app. |

## Logic Apps

|Title  |Type  |Description  |
|---------|---------|---------|
| [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | Tutorial | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | Tutorial | A logic app sends a notification email every time a device is added to your IoT hub. |
| [Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Tutorial | Event Grid sends messages from Service Bus topic to function app and logic app. |

## WebHooks

|Title  |Type  |Description  |
|---------|---------|---------|
| [Receive events to an HTTP endpoint](receive-events.md) | How to | Describes how to validate an HTTP endpoint to receive events from an Event Subscription, and receive and deserialize events. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
