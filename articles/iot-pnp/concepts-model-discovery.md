---
title: Implement IoT Plug and Play Preview model discovery | Microsoft Docs
description: As a solution builder, learn about how you can implement IoT Plug and Play model discovery in your solution.
author: prashmo
ms.author: prashmo
ms.date: 07/23/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Implement IoT Plug and Play Preview model discovery in an IoT solution

This article describes how, as a solution builder, you can implement IoT Plug and Play Preview model discovery in an IoT solution. Model discovery describes how:

- IoT Plug and Play devices register their model ID.
- An IoT solution retrieves the interfaces implemented by the device.

There are two broad categories of IoT solution:

- A *purpose-built IoT solution* works with a known set of IoT Plug and Play device models.

- A *model-driven IoT solution* can work with any IoT Plug and Play device. Building a model driven solution is more complex, but the benefit is that your solution works with any devices added in the future.

    To build a model-driven IoT solution, you need to build logic against the IoT Plug and Play interface primitives: telemetry, properties, and commands. Your solution's logic represents a device by combining multiple telemetry, property, and command capabilities.

This article describes how to implement model discovery in both types of solution.

## Model discovery

To discover the model that a device implements, a solution can get the model ID by using event-based discovery or twin-based discovery:

### Event-based discovery

When an IoT Plug and Play device connects to IoT Hub, it registers the model it implements. This registration results in a [Digital Twin change event](concepts-digital-twin.md#digital-twin-change-events) notification. To learn how to enable routing for digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The solution can use the event shown in the following snippet to learn about IoT Plug and Play device that's connecting and get its model ID:

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

This event is triggered when the device model ID is added or updated.

### Twin-based discovery

If the solution wants to know about capabilities of a given device, it can use the [Get Digital Twin](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin/getdigitaltwin) API to retrieve the information.

In the following digital twin snippet, `$metadata.$model` contains the model ID of an IoT Plug and Play device:

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

The solution can also use **Get Twin** to retrieve model ID from the device twin as shown in the following snippet:

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

## Model resolution

A solution uses model resolution to get access to the interfaces that compose a model from the model ID. 

- Solutions can opt to store these interfaces as files in a local folder. 
- Solutions can use the [model repository](concepts-model-repository.md).

## Next steps

Now that you've learned about model discovery an IoT solution, learn more about the [Azure IoT platform](overview-iot-plug-and-play.md) to use other capabilities for your solution.

- [Interact with a device from your solution](quickstart-service-node.md)
- [IoT Digital Twin REST API](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](howto-use-iot-explorer.md)
