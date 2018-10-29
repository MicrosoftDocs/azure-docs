---
title: Azure Digital Twins public preview service limits | Microsoft Docs
description: Understanding Azure Digital Twins public preview service limits
author: dwalthermsft
manager: deshner
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: dwalthermsft
---

# Public preview service limits

During Public Preview, Azure Digital Twins will have temporary subscription, instance, and rate limits that are described below.

These constraints exist to help simplify learning about the new service and its many features.

> [!NOTE]
> These limits will be increased and/or removed by General Availability (GA).

## Per-Subscription limits

During Public Preview, each Azure subscription can create or have running exactly one Azure Digital Twins instance at a time.

> [!TIP]
> Deleting your instance will allow you to create a new one.

## Per-Instance limits

In turn, each Azure Digital Twins instance can have:

- One `IoTHub` Resource
- One `EventHub` endpoint for event type DeviceMessage
- Up to three `EventHub`, `ServiceBus`, or `EventGrid` endpoints of event type `SensorChange`, `SpaceChange`, `TopologyOperation`, or `UdfCustom`

## Management API limits

The request rate limits for your Management API are:

- 100 requests per second to Management API
- A single Management API query can return up to 1000 objects

> [!IMPORTANT]
> If you exceed the 1000 object limit, you will receive an error and will need to simplify your query.

## UDF rate limits

The following limits set the total number of all user-defined function calls made to your Azure Digital Twins instance:

- 400 client library calls per second
- 100 SendNotification calls per second

> [!NOTE]
> The following actions may cause additional rate limits to be applied temporarily:
> - Topology object metadata edits
> - UDF definition updates
> - Devices sending telemetry for the first time

## Device telemetry limits

The limits below cap the total number of all messages your devices can send  to your Azure Digital Twins instance:

- 100 messages per second

## Next steps

To try out an Azure Digital Twins sample, go to [Quickstart to find available rooms](./quickstart-view-occupancy-dotnet.md).