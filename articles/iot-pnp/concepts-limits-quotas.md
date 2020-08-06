---
title: Limits and quotas IoT Plug and Play Preview | Microsoft Docs
description: Understand the limits, quotas, and throttling that apply when you use IoT Plug and Play Preview.
author: prashmo
ms.author: prashmo
ms.date: 07/21/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview limits, quotas, and throttles

This article explains the IoT Plug and Play-specific limits, quotas, and throttling that apply in the public preview. There are existing [IoT Hub quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md) that also apply.

## IoT Hub

For the public preview, the following limits and quotas apply to an IoT hub:

| Limits, restrictions, and throttles | Value | Notes |
|-----|-----|-----|
| Number of interfaces that can be registered per hub | 1500 ||
| Maximum size of a component name | 1-64 chars | Allowed characters: a-z, A-Z, 0-9 (not as the first character), and underscore(not as the first or last character). |
| Maximum size of a property name | 1-64 chars | Allowed characters: a-z, A-Z, 0-9 (not as the first character), and underscore(not as the first or last character). |
| Maximum size of a property value | Same as Digital Twins Definition Language [Property](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#property) | 5 levels in depth and may not be an array or any complex schema that contains an array |
| Maximum size of a command name | 1-64 chars | Allowed characters: a-z, A-Z, 0-9 (not as the first character), and underscore(not as the first or last character).|
| Device twin size | Same as [IoT Hub Limits](../iot-hub/iot-hub-devguide-device-twins.md#device-twin-size) ||

## Parser library

The parser library follows the limits that apply to the [Digital Twins Definition Language](https://github.com/Azure/opendigitaltwins-dtdl).

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
