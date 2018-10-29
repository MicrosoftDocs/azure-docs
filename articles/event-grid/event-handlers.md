---
title: Azure Event Grid event handlers
description: Describes supported event handlers for Azure Event Grid 
services: event-grid
author: tfitzmac

ms.service: event-grid
ms.topic: conceptual
ms.date: 08/21/2018
ms.author: tomfitz
---

# Event handlers in Azure Event Grid

An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any WebHook for handling events. The WebHook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS WebHook endpoints.

This article provides links to content for each event handler.

## Azure Automation

Use Azure Automation to process events with automated runbooks.

|Title  |Description  |
|---------|---------|
|[Tutorial: Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |

## Azure Functions

Use Azure Functions for serverless response to events.

When using Azure Functions as the handler, use the Event Grid trigger instead of generic HTTP triggers. Event Grid automatically validates Event Grid Function triggers. With generic HTTP triggers, you must implement the [validation response](security-authentication.md#webhook-event-delivery).

|Title  |Description  |
|---------|---------|
| [Event Grid trigger for Azure Functions](../azure-functions/functions-bindings-event-grid.md) | Overview of using the Event Grid trigger in Functions. |
| [Tutorial: automate resizing uploaded images using Event Grid](resize-images-on-storage-blob-upload-event.md) | Users upload images through web app to storage account. When a storage blob is created, Event Grid sends an event to the function app, which resizes the uploaded image. |
| [Tutorial: stream big data into a data warehouse](event-grid-event-hubs-integration.md) | When Event Hubs creates a Capture file, Event Grid sends an event to a function app. The app retrieves the Capture file and migrates data to a data warehouse. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |

## Event Hubs

Use Event Hubs when your solution gets events faster than it can process the events. Your application processes the events from Event Hubs at it own schedule. You can scale your event processing to handle the incoming events.

Event Hubs can act as either an event source or event handler. The following article shows how to use Event Hubs as a handler.

|Title  |Description  |
|---------|---------|
| [Quickstart: route custom events to Azure Event Hubs with Azure CLI and Event Grid](custom-event-to-eventhub.md) | Sends a custom event to an event hub for processing by an application. |
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

For examples of Event Hubs as a source, see [Event Hubs source](event-sources.md#event-hubs).

## Hybrid Connections

Use Azure Relay Hybrid Connections to send events to applications that are within an enterprise network and don't have a publicly accessible endpoint.

|Title  |Description  |
|---------|---------|
| [Tutorial: send events to hybrid connection](custom-event-to-hybrid-connection.md) | Sends a custom event to an existing hybrid connection for processing by a listener application. |

## Logic Apps

Use Logic Apps to automate business processes for responding to events.

|Title  |Description  |
|---------|---------|
| [Tutorial: monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Tutorial: send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | A logic app sends a notification email every time a device is added to your IoT hub. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |

## Queue Storage

Use Queue storage to receive events that need to be pulled. You might use Queue storage when you have a long running process that takes too long to respond. By sending events to Queue storage, the app can pull and process events on its own schedule.

|Title  |Description  |
|---------|---------|
| [Quickstart: route custom events to Azure Queue storage with Azure CLI and Event Grid](custom-event-to-queue-storage.md) | Describes how to send custom events to a Queue storage. |

## WebHooks

Use webhooks for customizable endpoints that respond to events.

|Title  |Description  |
|---------|---------|
| Quickstart: create and route custom events with - [Azure CLI](custom-event-quickstart.md), [PowerShell](custom-event-quickstart-powershell.md), and [portal](custom-event-quickstart-portal.md). | Shows how to send custom events to a WebHook. |
| Quickstart: route Blob storage events to a custom web endpoint with - [Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json), [PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json), and [portal](blob-event-quickstart-portal.md). | Shows how to send blob storage events to a WebHook. |
| [Quickstart: send container registry events](../container-registry/container-registry-event-grid-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Container Registry events. |
| [Overview: receive events to an HTTP endpoint](receive-events.md) | Describes how to validate an HTTP endpoint to receive events from an Event Subscription, and receive and deserialize events. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
