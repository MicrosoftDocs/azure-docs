---
title: Logic app as an event handler for Azure Event Grid events
description: Describes how you can use Azure logic apps as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: spelluru
---

# Logic app as an event handler for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any WebHook for handling events. The WebHook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS WebHook endpoints.

Use Logic Apps to automate business processes for responding to events.

## Schema

## Tutorials

|Title  |Description  |
|---------|---------|
| [Tutorial: monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md) | A logic app monitors changes to a virtual machine and sends emails about those changes. |
| [Tutorial: send email notifications about Azure IoT Hub events using Logic Apps](publish-iot-hub-events-to-logic-apps.md) | A logic app sends a notification email every time a device is added to your IoT hub. |
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
