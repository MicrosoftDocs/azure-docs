---
title: Implement IoT Plug and Play Preview model discovery | Microsoft Docs
description: As a solution builder, learn about how you can implement IoT Plug and Play model discovery in your solution.
author: JimacoMS3
ms.author: v-jambra
ms.date: 12/26/2019
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Implement IoT Plug and Play Preview model discovery in an IoT solution

This article describes how, as a solution builder, you can implement IoT Plug and Play Preview model discovery in an IoT solution. IoT Plug and Play model discovery is how IoT Plug and Play devices register their model id, and how an IoT solution retrieves the device capabilities.

There are two broad categories of IoT solution: purpose-built solutions and model-driven solutions.

This concept article describes how to implement model discovery in both types of solution.

## Purpose-built IoT solutions

A purpose-built IoT solution works with a known set of IoT Plug and Play device models.

## Model-driven solutions

A model-driven IoT solution can work with any IoT Plug and Play device. Building a model driven IoT Solution is more complex, but the benefit is that your solution works with any devices added in the future.

To build a model-driven IoT solution, you need to build logic against the IoT Plug and Play interface primitives: telemetry, properties, and commands. Your IoT solution's logic represent a device by combining multiple telemetry, property, and command capabilities.

## Model discovery

To discover the model that a device implements, a solution can get the model ID by one of the following ways.

### Event based discovery

When a IoT Plug and Play device connects to IoT Hub it registers the the model it implements. This results in a [Digital Twin Change Event](concepts-digital-twin.md#Digital-twin-change-events) Notification. To learn how to enable routing for digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

Solution can use the below event to learn about IoT Plug and Play device connecting and get it's model id in one shot.

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/22/2020 8:02:27 PM
iothub-message-source:digitalTwinChangeEvents
correlation-id:100f322dc2c5
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "dtmi:com:example:TemperatureController;1"
  }
]
```

This event is triggered when the device model id added or updated.

### Twin based discovery

If the solution wants to know about capability of a given device, it can retrieve it via [Get Digital Twin](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin/getdigitaltwin) API.

As shown below `$metadata.$model` contains the model id of an IoT Plug and Play device.

```json
{
    "$dtId": "sample-device",
    "$metadata": {
        "$model": "dtmi:com:example:TemperatureController;1",
        "serialNumber": {
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

Solution can also use Get Twin to retrieve model id as shown below.

```json
{
    "deviceId": "sample-device",
    "etag": "AAAAAAAAAAc=",
    "deviceEtag": "NTk0ODUyODgx",
    "status": "enabled",
    "statusUpdateTime": "0001-01-01T00:00:00Z",
    "connectionState": "Disconnected",
    "lastActivityTime": "2020-07-17T06:12:26.8402249Z",
    "cloudToDeviceMessageCount": 0,
    "authenticationType": "sas",
    "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
    },
    "modelId": "dtmi:com:example:TemperatureController;1",
    "version": 15,
    "properties": {...}
    }
}
```

### Model Resolution

You can have the interfaces (model or components) for the devices that will connect to your solution ahead of time. You can additionally choose to store these models and/or interfaces in [model repository](./howto-manage-models.md).  Solution can use local cache or model repository to retrieve the model and/or interface definition as needed. Once solution [discovers the model](#Model-discovery) for a device, it can interact with the device appropriately.

## Next steps

Now that you've learned about model discovery an IoT solution, learn more about the [Azure IoT Platform](overview-iot-plug-and-play.md) to leverage other capabilities for your solution.

- [Interact with a device from your solution](quickstart-service-node.md)
- [IoT Digital Twin REST API](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](howto-use-iot-explorer.md)

