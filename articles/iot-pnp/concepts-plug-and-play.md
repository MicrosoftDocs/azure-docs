---
title: 'Azure IoT Plug and Play | Microsoft Docs'
description: Understand Azure IoT Plug and Play.
author: dsk-2015
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: dkshir
---

# Azure IoT Plug and Play

Azure IoT Plug and Play is a new service to allow you to choose and connect authorized devices to your IoT hub. 

This is an example file, and from here on is a direct copy paste from another service. Use this as a placeholder. 

These constraints exist to help simplify learning about the new service and its many features.

> [!NOTE]
> These limits will be increased or removed by general availability (GA).

## Per-subscription limits

During the public preview, each Azure subscription can create or run only one Azure Digital Twins instance at a time.

> [!TIP]
> If you delete your instance, you can create a new one.

## Per-instance limits

In turn, each Azure Digital Twins instance can have:

- Exactly one embedded **IoTHub** resource that's created automatically during service provisioning.
- Exactly One **EventHub** endpoint for the event type **DeviceMessage**.
- Up to three **EventHub**, **ServiceBus**, or **EventGrid** endpoints of the event type **SensorChange**, **SpaceChange**, **TopologyOperation**, or **UdfCustom**.

## Azure Digital Twins Management API limits

The request rate limits for your Azure Digital Twins Management API are:

- 100 requests per second to the Azure Digital Twins Management API.
- Up to 1,000 objects returned by a single Azure Digital Twins Management API query.

> [!IMPORTANT]
> If you exceed the 1,000-object limit, you receive an error and must simplify your query.

## User-defined functions rate limits

The following limits set the total number of all user-defined function calls made to your Azure Digital Twins instance:

- 400 client library calls per second
- 100 **SendNotification** calls per second

> [!NOTE]
> The following actions might cause additional rate limits to be applied temporarily:
> - Edits made to the topology object metadata
> - Updates made to the user-defined function definition
> - Devices that send telemetry for the first time

## Device telemetry limits

The following limits cap the total number of all messages your devices can send to your Azure Digital Twins instance:

- 100 messages per second

## Next steps

- To try out an Azure Device Builder, go to the [Azure portal](https://portal.azure.com).