---
title: Azure IoT Hub bindings for Azure Functions
description: Learn to use IoT Hub trigger and binding in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 02/21/2020
ms.author: cshoe
---

# Azure IoT Hub bindings for Azure Functions

This set of articles explains how to work with Azure Functions bindings for IoT Hub. The IoT Hub support is based on the [Azure Event Hubs Binding](functions-bindings-event-hubs.md).

> [!IMPORTANT]
> While the following code samples use the Event Hub API, the given syntax is applicable for IoT Hub functions.

| Action | Type |
|--------|------|
| Respond to events sent to an IoT hub event stream. | [Trigger](./functions-bindings-event-iot-trigger.md) |
| Write events to an IoT event stream | [Output binding](./functions-bindings-event-iot-output.md) |

[!INCLUDE [functions-bindings-event-hubs](../../includes/functions-bindings-event-hubs.md)]

## Next steps

- [Respond to events sent to an event hub event stream (Trigger)](./functions-bindings-event-iot-trigger.md)
- [Write events to an event stream (Output binding)](./functions-bindings-event-iot-output.md)
