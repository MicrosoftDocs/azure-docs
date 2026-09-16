---
title: Azure IoT Hub trigger for Azure Functions
description: Learn to respond to events sent to an IoT hub event stream in Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 03/04/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure IoT Hub trigger for Azure Functions

This article explains how to work with Azure Functions bindings for IoT Hub. The IoT Hub support is based on the [Azure Event Hubs Binding](functions-bindings-event-hubs.md).

For information on setup and configuration details, see the [overview](functions-bindings-event-iot.md).

> [!IMPORTANT]
> While the following code samples use the Event Hubs API, the given syntax is applicable for IoT Hub functions.

[!INCLUDE [functions-bindings-event-hubs](../../includes/functions-bindings-event-hubs-trigger.md)]

## Connections

The `connection` property references environment configuration that contains the name of an application setting with a connection string. You get this connection string by selecting the **Connection Information** button for the [namespace](../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace). The connection string must be for an Event Hubs namespace, not the event hub itself.

The connection string must have at least **read** permissions to activate the function. 

Store this connection string in an application setting with a name that matches the value you specify in the `connection` property of the binding configuration.

> [!NOTE]  
> The IoT Hub trigger doesn't support identity-based connections. If you need to use managed identities end-to-end, you can instead use IoT Hub Routing to send data to an event hub you control. In that way, outbound routing can be authenticated by using managed identity and the event is read [from that event hub using managed identity](functions-bindings-event-hubs-trigger.md?tabs=identity-based#connections).

## host.json properties

The [host.json](functions-host-json.md#eventhub) file contains settings that control Event Hubs trigger behavior. See the [host.json settings](functions-bindings-event-iot.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Write events to an event stream (Output binding)](./functions-bindings-event-hubs-output.md)
