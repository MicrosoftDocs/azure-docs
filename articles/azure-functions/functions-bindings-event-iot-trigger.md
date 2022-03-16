---
title: Azure IoT Hub trigger for Azure Functions
description: Learn to respond to events sent to an IoT hub event stream in Azure Functions.
ms.topic: reference
ms.date: 03/04/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure IoT Hub trigger for Azure Functions

This article explains how to work with Azure Functions bindings for IoT Hub. The IoT Hub support is based on the [Azure Event Hubs Binding](functions-bindings-event-hubs.md).

For information on setup and configuration details, see the [overview](functions-bindings-event-iot.md).

> [!IMPORTANT]
> While the following code samples use the Event Hub API, the given syntax is applicable for IoT Hub functions.

[!INCLUDE [functions-bindings-event-hubs](../../includes/functions-bindings-event-hubs-trigger.md)]

## host.json properties

The [host.json](functions-host-json.md#eventhub) file contains settings that control Event Hub trigger behavior. See the [host.json settings](functions-bindings-event-iot.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Write events to an event stream (Output binding)](./functions-bindings-event-iot-output.md)
