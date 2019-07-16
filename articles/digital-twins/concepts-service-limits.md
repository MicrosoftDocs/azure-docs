---
title: 'Azure Digital Twins public preview service limits | Microsoft Docs'
description: Understand Azure Digital Twins public preview service limits.
author: dwalthermsft
manager: deshner
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 01/03/2019
ms.author: dwalther
---

# Public preview service limits

During the public preview, Azure Digital Twins has the following temporary subscription, instance, and rate limits.

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

> [!NOTE]
> Some parameters that are usually defined in creating the above Azure IoT entities are not required during public preview.
> - Consult the [Swagger reference documentation](./how-to-use-swagger.md) for the most recent API specifications.

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

- To try out an Azure Digital Twins sample, go to [Quickstart to find available rooms](./quickstart-view-occupancy-dotnet.md).