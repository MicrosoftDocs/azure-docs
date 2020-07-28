---
title: Integrate IoT Plug and Play digital twin models in a solution | Microsoft Docs
description: As a solution builder, learn about how you can integrate IoT Plug and Play digital twin models in your IoT solution.
author: prashmo
ms.author: prashmo
ms.date: 07/23/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Integrate IoT Plug and Play digital twin models in an IoT solution

This article describes how, as a solution builder, you can identify model ID of an IoT Plug and Play device and retrieve its digital twin model definition in an IoT solution. 

There are two broad categories of an IoT solution:


- A *purpose-built solution* works with a known set of digital twin models. You have the digital twin model definitions implemented by the IoT Plug and Play devices that will connect to your solution ahead of time.

- A *model-driven* solution works with any digital twin models of IoT Plug and Play devices. Building a model-driven solution is more complex, but the benefit is that your solution works with any devices that may be added in the future. To build a model-driven IoT solution, you need to write logic against the digital twin model primitives: telemetry, properties, and commands. Your solution's logic represents a device by combining multiple telemetry, property, and command capabilities.

To implement an IoT solution with IoT Plug and Play digital twin models, your solution must:

1. *Identify the model ID*. An IoT solution identifies the model ID of the digital twin model implemented by the device.

1. *Retrieve the model definition*. An IoT solution retrieves the digital twin model definition using the model ID of the IoT Plug and Play device.

## Identify model ID

When an IoT Plug and Play device connects to IoT Hub, it registers the model ID of the model it implements with IoT Hub. 

IoT Hub notifies the solution with the device model ID as part of the device connection flow.

A solution can get the model ID of the IoT Plug and Play device by using one of the following three methods:

### Digital twin change event notification 

A device registration results in a [Digital Twin change event](concepts-digital-twin.md#digital-twin-change-events) notification. A solution needs to subscribe to this event notification. To learn how to enable routing for digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The solution can use the event shown in the following snippet to learn about the IoT Plug and Play device that's connecting and get its model ID:

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

### Get Digital Twin API

The solution can use the [Get Digital Twin](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin/getdigitaltwin) API to retrieve the model ID of the model implemented by the IoT Plug and Play device.

In the following digital twin response snippet, `$metadata.$model` contains the model ID of an IoT Plug and Play device:

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

### Get Device Twin API

The solution can use the [Get Device Twin](https://docs.microsoft.com/rest/api/iothub/service/twin/getdevicetwin) API to retrieve model ID of the IoT Plug and Play device.

In the following device twin response snippet, `modelId` contains the model ID of an IoT Plug and Play device:

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

## Retrieve a model definition

A solution uses model ID identified above to retrieve the corresponding digital twin model definition.

A solution can get the model definition by using one of the following options:

### Model repository

Solutions can use the [model repository](concepts-model-repository.md) to retrieve digital twin models. Either the device builders or the solution builders must upload their models to the repository beforehand so the solution can retrieve them. 

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from model repository.

1. Using the model definition of the connected device, you can enumerate the capabilities of the device. 

1. Using the enumerated capabilities of the device, you can allow users to [interact with the device](quickstart-service-node.md).

### Custom store

Solutions can store these model definitions in a local file system, in a public file store, or use a custom implementation.

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from your custom store.

1. Using the model definition of the connected device, you can enumerate the capabilities of the device. 

1. Using the enumerated capabilities of the device, you can allow users to [interact with the device](quickstart-service-node.md).  

## Next steps

Now that you've learned how to integrate IoT Plug and Play digital twin models in an IoT solution, some suggested next steps are:

- [Interact with a device from your solution](quickstart-service-node.md)
- [IoT Digital Twin REST API](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](howto-use-iot-explorer.md)
