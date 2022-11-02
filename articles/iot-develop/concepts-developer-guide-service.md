---
title: Service developer guide - IoT Plug and Play | Microsoft Docs
description: Description of IoT Plug and Play for service developers
author: dominicbetts
ms.author: dobett
ms.date: 10/01/2020
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
zone_pivot_groups: programming-languages-set-ten

# - id: programming-languages-set-ten
#   title: Programming languages
#   prompt: Choose a programming language
#   pivots:
#   - id: programming-language-csharp
#     title: C#
#   - id: programming-language-java
#     title: Java
#   - id: programming-language-javascript
#     title: JavaScript
#   - id: programming-language-python
#     title: Python
---

# IoT Plug and Play service developer guide

IoT Plug and Play lets you build IoT devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

IoT Plug and Play lets you use devices that have announced their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

To use an IoT Plug and Play device that's connected to your IoT hub, one of the IoT service SDKs:

## Service SDKs

Use the Azure IoT Service SDKs in your solution to interact with devices and modules. For example, you can use the service SDKs to read and update twin properties and invoke commands. Supported languages include C#, Java, Node.js, and Python.

The service SDKs let you access device information from a solution, such as a desktop or web application. The service SDKs include two namespaces and object models that you can use to retrieve the model ID:

- Iot Hub service client. This service exposes the model ID as a device twin property.

- Digital Twins client. The new Digital Twins API operates on [Digital Twins Definition Language (DTDL)](concepts-digital-twin.md) model constructs such as components, properties, and commands. The Digital Twin APIs make it easier for solution builders to create IoT Plug and Play solutions.

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-pnp-service-devguide-csharp](../../includes/iot-pnp-service-devguide-csharp.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-pnp-service-devguide-java](../../includes/iot-pnp-service-devguide-java.md)]

:::zone-end

:::zone pivot="programming-language-javascript"

[!INCLUDE [iot-pnp-service-devguide-node](../../includes/iot-pnp-service-devguide-node.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-pnp-service-devguide-python](../../includes/iot-pnp-service-devguide-python.md)]

:::zone-end

## Next steps

Now that you've learned about device modeling, here are some additional resources:

- [Digital Twins Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md)
- [C device SDK](https://github.com/Azure/azure-iot-sdk-c/)
- [IoT REST API](/rest/api/iothub/device)
- [IoT Plug and Play modeling guide](concepts-modeling-guide.md)