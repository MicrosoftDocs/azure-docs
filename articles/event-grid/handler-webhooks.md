---
title: Webhooks as event handlers for Azure Event Grid events
description: Describes how you can use Webhooks (Azure Automation runbooks and logic apps) as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Webhooks, Automation runbooks, Logic apps as event handlers for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any WebHook for handling events. The WebHook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS WebHook endpoints.

> [!NOTE]
> Using Azure Automation runbooks or logic apps as event handlers is supported via webhooks. 

## WebHooks

Use webhooks for customizable endpoints that respond to events.

|Title  |Description  |
|---------|---------|
| Quickstart: create and route custom events with - [Azure CLI](custom-event-quickstart.md), [PowerShell](custom-event-quickstart-powershell.md), and [portal](custom-event-quickstart-portal.md). | Shows how to send custom events to a WebHook. |
| Quickstart: route Blob storage events to a custom web endpoint with - [Azure CLI](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json), [PowerShell](../storage/blobs/storage-blob-event-quickstart-powershell.md?toc=%2fazure%2fevent-grid%2ftoc.json), and [portal](blob-event-quickstart-portal.md). | Shows how to send blob storage events to a WebHook. |
| [Quickstart: send container registry events](../container-registry/container-registry-event-grid-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Shows how to use Azure CLI to send Container Registry events. |
| [Overview: receive events to an HTTP endpoint](receive-events.md) | Describes how to validate an HTTP endpoint to receive events from an Event Subscription, and receive and deserialize events. |


## Azure Automation
Processing of events by using automated runbooks is supported via webhooks. You create a webhook for the runbook and then use the webhook handler as mentioned in the [WebHooks](#webhooks) section. 

|Title  |Description  |
|---------|---------|
|[Tutorial: Azure Automation with Event Grid and Microsoft Teams](ensure-tags-exists-on-new-virtual-machines.md) |Create a virtual machine, which sends an event. The event triggers an Automation runbook that tags the virtual machine, and triggers a message that is sent to a Microsoft Teams channel. |


## Logic Apps
Use **Logic Apps** to implement business processes to process Event Grid events. 

|Title  |Description  |
|---------|---------|
| [Tutorial: monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Tutorial: send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | A logic app sends a notification email every time a device is added to your IoT hub. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |

## Next steps
For an introduction to Event Grid, see [About Event Grid](overview.md).


## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
