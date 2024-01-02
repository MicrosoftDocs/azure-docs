---
title: Service developer guide - IoT Plug and Play | Microsoft Docs
description: Description of IoT Plug and Play for service developers
author: dominicbetts
ms.author: dobett
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: iot-develop
zone_pivot_groups: programming-languages-set-ten

# - id: programming-languages-set-ten
#     title: Python
---

# IoT Plug and Play service developer guide

IoT Plug and Play lets you build IoT devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

IoT Plug and Play lets you use devices that have announced their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

If you're using IoT Central, you can use the IoT Central UI and REST API to interact with IoT Plug and Play devices connected to your application.

## Service SDKs

Use the Azure IoT service SDKs in your solution to interact with devices and modules. For example, you can use the service SDKs to read and update twin properties and invoke commands. Supported languages include C#, Java, Node.js, and Python.

[!INCLUDE [iot-hub-sdks-service](../../includes/iot-hub-sdks-service.md)]

The service SDKs let you access device information from a solution component such as a desktop or web application. The service SDKs include two namespaces and object models that you can use to retrieve the model ID:

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

Now that you've learned about device modeling, here are some more resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md)
- [C device SDK](https://github.com/Azure/azure-iot-sdk-c/)
- [IoT REST API](/rest/api/iothub/device)
- [IoT Plug and Play modeling guide](concepts-modeling-guide.md)
