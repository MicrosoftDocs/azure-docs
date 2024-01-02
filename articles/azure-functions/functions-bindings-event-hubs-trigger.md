---
title: Azure Event Hubs trigger for Azure Functions
description: Learn to use Azure Event Hubs trigger in Azure Functions.
ms.assetid: daf81798-7acc-419a-bc32-b5a41c6db56b
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/03/2023
zone_pivot_groups: programming-languages-set-functions
---

# Azure Event Hubs trigger for Azure Functions

This article explains how to work with [Azure Event Hubs](../event-hubs/event-hubs-about.md) trigger for Azure Functions. Azure Functions supports trigger and [output bindings](functions-bindings-event-hubs-output.md) for Event Hubs.

For information on setup and configuration details, see the [overview](functions-bindings-event-hubs.md).

[!INCLUDE [functions-bindings-event-hubs-trigger](../../includes/functions-bindings-event-hubs-trigger.md)]

[!INCLUDE [functions-event-hubs-connections](../../includes/functions-event-hubs-connections.md)]

## host.json settings

The [host.json](functions-host-json.md#eventhub) file contains settings that control Event Hubs trigger behavior. See the [host.json settings](functions-bindings-event-hubs.md#hostjson-settings) section for details regarding available settings.

## Next steps

- [Write events to an event stream (Output binding)](./functions-bindings-event-hubs-output.md)
